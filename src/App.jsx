import { useEffect, useRef, useState } from "react";
import heroPortrait900Avif from "../assets/optimized/alvina-hero-900.avif";
import heroPortrait480Avif from "../assets/optimized/alvina-hero-480.avif";
import heroPortrait900 from "../assets/optimized/alvina-hero-900.webp";
import heroPortrait480 from "../assets/optimized/alvina-hero-480.webp";
import buyersLifestyle from "../assets/optimized/buyers-lifestyle-900.webp";
import sellersLifestyle from "../assets/optimized/sellers-lifestyle-900.webp";
import buyerGuide from "../assets/optimized/buyer-guide-640.webp";
import sellerGuide from "../assets/optimized/seller-guide-640.webp";
import { applySeo } from "./seo";
import { content, DEFAULT_LOCALE, resolveInitialLocale, SUPPORTED_LOCALES } from "./content";
import { initAnalytics, trackEvent, trackPageView } from "./analytics";

function useRevealAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll(".reveal"));
    if (prefersReducedMotion) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -5% 0px" }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index % 6, 4) * 40}ms`;
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);
}

function TiltCard({ className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    const onMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 8;
      const ry = (px - 0.5) * 10;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        node.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      node.style.transform = "";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", reset);
    node.addEventListener("pointercancel", reset);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
      node.removeEventListener("pointercancel", reset);
    };
  }, []);

  return (
    <div ref={ref} className={`tilt ${className}`.trim()}>
      {children}
    </div>
  );
}

function LocaleSwitcher({ locale, onChange }) {
  return (
    <div className="locale-switcher" role="group" aria-label="Language switcher">
      {SUPPORTED_LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`locale-pill${locale === code ? " is-active" : ""}`}
          onClick={() => onChange(code)}
          aria-pressed={locale === code}
          title={content[code].localeName}
        >
          {content[code].shortLabel}
        </button>
      ))}
    </div>
  );
}

async function submitLeadForm(form, locale) {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
  const provider = (import.meta.env.VITE_FORM_PROVIDER || "").toLowerCase();
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  const data = new FormData(form);
  if (String(data.get("website") || "").trim()) return { ok: true, spam: true };

  data.append("locale", locale);
  data.append("page_url", window.location.href);
  data.append("page_title", document.title);
  data.append("submitted_at", new Date().toISOString());
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const val = new URLSearchParams(window.location.search).get(key);
    if (val) data.append(key, val);
  });

  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true, demo: true };
  }

  if (provider === "web3forms" && accessKey) {
    data.append("access_key", accessKey);
    data.append("subject", `Alvina Landing Lead (${locale.toUpperCase()})`);
    data.append("from_name", "Alvina Landing");
    data.append("replyto", String(data.get("email") || ""));
  }

  const response = await fetch(endpoint, { method: "POST", body: data });
  let payload = null;
  try { payload = await response.json(); } catch {}
  return { ok: response.ok && (!payload || payload.success !== false), payload };
}

function LeadForm({ t, locale }) {
  const [status, setStatus] = useState("idle");
  const liveMode = Boolean(import.meta.env.VITE_FORM_ENDPOINT);
  const redirectOnSuccess = String(import.meta.env.VITE_ENABLE_FORM_REDIRECT || "false") === "true";
  const thankYouUrl = import.meta.env.VITE_THANK_YOU_URL || "/thank-you.html";

  function onSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    trackEvent("form_submit", { form_name: "lead_form", locale });
    submitLeadForm(event.currentTarget, locale)
      .then((res) => {
        if (!res.ok) throw new Error("submit");
        setStatus("success");
        trackEvent("generate_lead", { form_name: "lead_form", locale, mode: liveMode ? "live" : "demo" });
        event.currentTarget.reset();
        if (redirectOnSuccess) {
          const url = new URL(thankYouUrl, window.location.origin);
          url.searchParams.set("lang", locale);
          window.location.assign(url.toString());
        }
      })
      .catch(() => {
        setStatus("error");
        trackEvent("form_error", { form_name: "lead_form", locale });
      });
  }

  return (
    <form className={`lead-form${status === "success" ? " submitted" : ""}`} onSubmit={onSubmit} noValidate>
      <label>
        {t.form.name}
        <input type="text" name="name" placeholder={t.form.placeholders.name} required autoComplete="name" />
      </label>
      <label>
        {t.form.email}
        <input type="email" name="email" placeholder={t.form.placeholders.email} required autoComplete="email" />
      </label>
      <label>
        {t.form.phone}
        <input type="tel" name="phone" placeholder={t.form.placeholders.phone} autoComplete="tel" />
      </label>
      <label>
        {t.form.interest}
        <select name="interest" required defaultValue="">
          <option value="" disabled>{t.form.select}</option>
          {t.form.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        {t.form.message}
        <textarea name="message" rows="4" placeholder={t.form.placeholders.message} />
      </label>
      <label className="consent-line">
        <input type="checkbox" name="consent" required />
        <span>{t.form.consent}</span>
      </label>
      <input className="bot-field" type="text" name="website" tabIndex="-1" autoComplete="off" />
      <button className="btn" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "..." : t.cta.send}
      </button>
      <p className="form-note">{liveMode ? t.form.noteLive : t.form.noteDemo}</p>
      {status === "success" && <p className="form-success">{t.form.success}</p>}
      {status === "error" && <p className="form-error">{t.form.error}</p>}
    </form>
  );
}

function App() {
  const [locale, setLocale] = useState(() => (typeof window === "undefined" ? DEFAULT_LOCALE : resolveInitialLocale()));
  const t = content[locale] || content.en;
  useRevealAnimations();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState({}, "", url);
    window.localStorage.setItem("locale", locale);
    applySeo({ locale, seo: t.seo, imageUrl: new URL(heroPortrait900, window.location.origin).toString() });
    trackPageView({ locale, page: "landing" });
  }, [locale, t]);

  return (
    <>
      <div className="page-bg" aria-hidden="true"><div className="orb orb-a" /><div className="orb orb-b" /><div className="grid" /></div>

      <header className="topbar reveal">
        <a className="brand" href="#home" aria-label="Alvina Usher home">
          <span className="brand-mark">AU</span>
          <span className="brand-copy"><strong>Alvina Usher</strong><small>Ottawa Real Estate</small></span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#buyers">{t.nav.buyers}</a>
          <a href="#sellers">{t.nav.sellers}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="topbar-actions">
          <LocaleSwitcher locale={locale} onChange={setLocale} />
          <a className="btn btn-sm" href="tel:+16137961449">{t.cta.call}</a>
        </div>
      </header>

      <main id="home">
        <section className="hero section">
          <div className="hero-copy reveal">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="lede">{t.hero.lede}</p>
            <div className="hero-actions">
              <a className="btn" href="#contact">{t.cta.consult}</a>
              <a className="btn btn-ghost" href="#guides">{t.cta.guides}</a>
            </div>
            <div className="hero-meta">
              {t.hero.stats.map(([value, label]) => (
                <div key={`${value}-${label}`}><span>{value}</span><small>{label}</small></div>
              ))}
            </div>
          </div>

          <div className="hero-visual reveal">
            <TiltCard className="portrait-card">
              <picture>
                <source srcSet={`${heroPortrait480Avif} 480w, ${heroPortrait900Avif} 900w`} sizes="(max-width: 860px) 92vw, 540px" type="image/avif" />
                <source srcSet={`${heroPortrait480} 480w, ${heroPortrait900} 900w`} sizes="(max-width: 860px) 92vw, 540px" type="image/webp" />
                <img src={heroPortrait900} srcSet={`${heroPortrait480} 480w, ${heroPortrait900} 900w`} sizes="(max-width: 860px) 92vw, 540px" alt="Alvina Usher portrait" width="900" height="900" fetchPriority="high" loading="eager" decoding="async" />
              </picture>
              <div className="portrait-glow" />
            </TiltCard>
            <div className="floating stat-card stat-a reveal"><strong>{t.nav.buyers}</strong><span>{t.hero.cards.buyers}</span></div>
            <div className="floating stat-card stat-b reveal"><strong>{t.nav.sellers}</strong><span>{t.hero.cards.sellers}</span></div>
          </div>
        </section>

        <section className="trust section reveal" aria-label="Trust signals">
          {t.trust.map((item) => <div className="chip" key={item}>{item}</div>)}
          <div className="chip"><a href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">alvinausher.com</a></div>
        </section>

        <section id="buyers" className="split section perf-section">
          <div className="panel reveal">
            <p className="eyebrow">{t.buyers.eyebrow}</p>
            <h2>{t.buyers.title}</h2>
            <p>{t.buyers.body}</p>
            <ul className="feature-list">{t.buyers.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <a className="text-link" href="#guides">{t.buyers.link}</a>
          </div>
          <TiltCard className="media-card reveal"><img src={buyersLifestyle} alt="Sold home sign and property exterior" width="900" height="900" loading="lazy" decoding="async" /></TiltCard>
        </section>

        <section id="sellers" className="split section perf-section">
          <div className="panel reveal">
            <p className="eyebrow">{t.sellers.eyebrow}</p>
            <h2>{t.sellers.title}</h2>
            <p>{t.sellers.body}</p>
            <ul className="feature-list">{t.sellers.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <a className="text-link" href="#guides">{t.sellers.link}</a>
          </div>
          <div className="media-stack reveal">
            <TiltCard className="media-card"><img src={sellersLifestyle} alt="Happy home buyers with keys and sold sign" width="900" height="900" loading="lazy" decoding="async" /></TiltCard>
            <div className="mini-portrait"><img src={heroPortrait480} alt="Alvina Usher professional portrait" width="480" height="480" loading="lazy" decoding="async" /></div>
          </div>
        </section>

        <section id="guides" className="guides section perf-section">
          <div className="section-head reveal"><p className="eyebrow">{t.guides.eyebrow}</p><h2>{t.guides.title}</h2><p>{t.guides.body}</p></div>
          <div className="guide-grid">
            <TiltCard className="guide-card reveal">
              <img src={buyerGuide} alt="Alvina Usher buying guide for Ottawa" width="640" height="971" loading="lazy" decoding="async" />
              <div className="guide-copy"><h3>{t.guides.buyer.title}</h3><p>{t.guides.buyer.body}</p><a className="btn btn-ghost" href="#contact">{t.cta.requestAccess}</a></div>
            </TiltCard>
            <TiltCard className="guide-card reveal">
              <img src={sellerGuide} alt="Alvina Usher seller guide for top dollar" width="640" height="971" loading="lazy" decoding="async" />
              <div className="guide-copy"><h3>{t.guides.seller.title}</h3><p>{t.guides.seller.body}</p><a className="btn btn-ghost" href="#contact">{t.cta.requestAccess}</a></div>
            </TiltCard>
          </div>
        </section>

        <section id="about" className="about section perf-section">
          <div className="about-card reveal">
            <TiltCard className="about-photo"><img src={heroPortrait900} alt="Alvina Usher" width="900" height="900" loading="lazy" decoding="async" /></TiltCard>
            <div className="about-copy"><p className="eyebrow">{t.about.eyebrow}</p><h2>{t.about.title}</h2><p>{t.about.p1}</p><p>{t.about.p2}</p></div>
          </div>
        </section>

        <section id="contact" className="contact section perf-section reveal">
          <div className="contact-panel">
            <div>
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.body}</p>
              <div className="contact-links">
                <a href="tel:+16137961449">{t.contact.links.call}</a>
                <a href="https://detailsrealty.ca/our-agents.html/alvina-usher/" target="_blank" rel="noreferrer">{t.contact.links.profile}</a>
                <a href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">{t.contact.links.site}</a>
              </div>
            </div>
            <LeadForm t={t} locale={locale} />
          </div>
        </section>
      </main>

      <footer className="footer reveal"><p>{t.footer.p1}</p><p className="small">{t.footer.p2}</p></footer>
    </>
  );
}

export default App;
