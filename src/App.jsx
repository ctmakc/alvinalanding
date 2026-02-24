import { useEffect, useMemo, useRef, useState } from "react";
import alvinaHero900Avif from "../assets/optimized/alvina-hero-900.avif";
import alvinaHero480Avif from "../assets/optimized/alvina-hero-480.avif";
import alvinaHero900Webp from "../assets/optimized/alvina-hero-900.webp";
import alvinaHero480Webp from "../assets/optimized/alvina-hero-480.webp";
import alvinaPortrait2Avif from "../assets/optimized/alvina-portrait-2-640.avif";
import alvinaPortrait2Webp from "../assets/optimized/alvina-portrait-2-640.webp";
import buyersLifestyleAvif from "../assets/optimized/buyers-lifestyle-900.avif";
import buyersLifestyleWebp from "../assets/optimized/buyers-lifestyle-900.webp";
import sellersLifestyleAvif from "../assets/optimized/sellers-lifestyle-900.avif";
import sellersLifestyleWebp from "../assets/optimized/sellers-lifestyle-900.webp";
import buyerGuideWebp from "../assets/optimized/buyer-guide-640.webp";
import sellerGuideWebp from "../assets/optimized/seller-guide-640.webp";
import { applySeo } from "./seo";
import { content, DEFAULT_LOCALE, resolveInitialLocale, SUPPORTED_LOCALES } from "./content";
import { initAnalytics, trackEvent, trackPageView } from "./analytics";

function useRevealAnimations() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll(".reveal"));
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    nodes.forEach((n, i) => {
      n.style.transitionDelay = `${(i % 5) * 35}ms`;
      observer.observe(n);
    });
    return () => observer.disconnect();
  }, []);
}

function TiltCard({ className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * 7;
      const ry = (px - 0.5) * 8;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    el.addEventListener("pointercancel", reset);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
      el.removeEventListener("pointercancel", reset);
    };
  }, []);
  return <div ref={ref} className={`tilt ${className}`.trim()}>{children}</div>;
}

function LocaleSwitcher({ locale, onChange }) {
  return (
    <div className="locale-switcher" role="group" aria-label="Language switcher">
      {SUPPORTED_LOCALES.map((code) => (
        <button key={code} type="button" className={`locale-pill${locale === code ? " is-active" : ""}`} onClick={() => onChange(code)} aria-pressed={locale === code}>
          {content[code].shortLabel}
        </button>
      ))}
    </div>
  );
}

function Picture({ alt, sources, fallback, width, height, className, priority = false }) {
  return (
    <picture className={className}>
      {sources.map((s) => (
        <source key={`${s.type}-${s.srcSet}`} srcSet={s.srcSet} sizes={s.sizes} type={s.type} />
      ))}
      <img
        src={fallback.src}
        srcSet={fallback.srcSet}
        sizes={fallback.sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
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
      <input className="bot-field" type="text" name="website" tabIndex="-1" autoComplete="off" />
      <div className="form-grid">
        <label>{t.form.name}<input type="text" name="name" placeholder={t.form.placeholders.name} required autoComplete="name" /></label>
        <label>{t.form.email}<input type="email" name="email" placeholder={t.form.placeholders.email} required autoComplete="email" /></label>
        <label>{t.form.phone}<input type="tel" name="phone" placeholder={t.form.placeholders.phone} autoComplete="tel" /></label>
        <label>{t.form.interest}
          <select name="interest" required defaultValue=""><option value="" disabled>{t.form.select}</option>{t.form.options.map((o) => <option key={o}>{o}</option>)}</select>
        </label>
        <label className="full">{t.form.message}<textarea name="message" rows="4" placeholder={t.form.placeholders.message} /></label>
      </div>
      <label className="consent-line"><input type="checkbox" name="consent" required /><span>{t.form.consent}</span></label>
      <div className="form-actions-row">
        <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "..." : t.cta.send}</button>
        <p className="form-note">{liveMode ? t.form.noteLive : t.form.noteDemo}</p>
      </div>
      {status === "success" && <p className="form-success">{t.form.success}</p>}
      {status === "error" && <p className="form-error">{t.form.error}</p>}
    </form>
  );
}

function App() {
  const [locale, setLocale] = useState(() => (typeof window === "undefined" ? DEFAULT_LOCALE : resolveInitialLocale()));
  const t = content[locale] || content.en;
  useRevealAnimations();

  const extra = useMemo(() => ({
    en: {
      heroTag: "Ottawa Real Estate by Alvina Usher",
      heroSub: "Personal brand landing page, rebuilt from scratch for speed, multilingual UX and conversion.",
      galleryTitle: "Brand visuals & client-facing resources",
      galleryBody: "Different photo treatments and guide covers so the page feels like a real personal brand, not a template clone.",
      processTitle: "How clients work with Alvina",
      process: ["Discovery call and goals mapping", "Buyer/seller strategy tailored to Ottawa market conditions", "Execution support and negotiation", "Clear communication from plan to close"],
      whyTitle: "Why this version works better",
      whyBody: "Readable typography in all languages, cleaner hierarchy, stronger visual identity and more image variety across sections."
    },
    fr: {
      heroTag: "Immobilier Ottawa avec Alvina Usher",
      heroSub: "Landing page personnelle reconstruite pour la vitesse, le multilingue et la conversion.",
      galleryTitle: "Visuels de marque et ressources clients",
      galleryBody: "Photos variées et guides intégrés pour une présence de marque plus crédible et plus personnelle.",
      processTitle: "Comment les clients travaillent avec Alvina",
      process: ["Appel de découverte et objectifs", "Stratégie acheteur/vendeur adaptée au marché d'Ottawa", "Exécution et négociation", "Communication claire du plan à la clôture"],
      whyTitle: "Pourquoi cette version est meilleure",
      whyBody: "Typographie lisible dans toutes les langues, hiérarchie plus claire et meilleure variété visuelle."
    },
    ru: {
      heroTag: "Недвижимость в Оттаве с Alvina Usher",
      heroSub: "Личный риелторский лендинг, пересобранный с нуля под скорость, мультиязычность и конверсию.",
      galleryTitle: "Визуалы бренда и клиентские материалы",
      galleryBody: "Разные фото и обложки гайдов, чтобы сайт выглядел как реальный личный бренд, а не шаблон-клон.",
      processTitle: "Как проходит работа с Alvina",
      process: ["Знакомство и постановка целей", "Стратегия покупки/продажи под рынок Оттавы", "Сопровождение и переговоры", "Понятная коммуникация от плана до закрытия сделки"],
      whyTitle: "Почему эта версия лучше",
      whyBody: "Читаемая типографика во всех языках, более сильная визуальная подача и больше разнообразия в фото."
    }
  }[locale]), [locale]);

  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState({}, "", url);
    window.localStorage.setItem("locale", locale);
    applySeo({ locale, seo: t.seo, imageUrl: new URL(alvinaHero900Webp, window.location.origin).toString() });
    trackPageView({ locale, page: "landing" });
  }, [locale, t]);

  return (
    <>
      <div className="bg-decor" aria-hidden="true"><div className="blob blob-a" /><div className="blob blob-b" /><div className="mesh" /></div>

      <header className="shell topbar reveal">
        <a className="brand" href="#home" aria-label="Alvina Usher home">
          <span className="brand-mark">AU</span>
          <span><strong>Alvina Usher</strong><small>Ottawa Real Estate</small></span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#buyers">{t.nav.buyers}</a>
          <a href="#sellers">{t.nav.sellers}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="topbar-actions">
          <LocaleSwitcher locale={locale} onChange={setLocale} />
          <a className="btn btn-primary btn-sm" href="tel:+16137961449">{t.cta.call}</a>
        </div>
      </header>

      <main id="home">
        <section className="shell hero-v2 section-gap">
          <div className="hero-copy reveal">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="lead">{t.hero.lede}</p>
            <p className="hero-tagline">{extra.heroTag}</p>
            <p className="hero-subline">{extra.heroSub}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">{t.cta.consult}</a>
              <a className="btn btn-ghost" href="#guides">{t.cta.guides}</a>
            </div>
            <div className="stats-grid">
              {t.hero.stats.map(([value, label]) => (
                <div key={`${value}-${label}`} className="stat-box"><span>{value}</span><small>{label}</small></div>
              ))}
            </div>
          </div>

          <div className="hero-stage reveal">
            <TiltCard className="hero-portrait-card">
              <Picture
                alt="Alvina Usher portrait"
                width={900}
                height={900}
                priority
                sources={[
                  { type: "image/avif", srcSet: `${alvinaHero480Avif} 480w, ${alvinaHero900Avif} 900w`, sizes: "(max-width: 900px) 88vw, 520px" },
                  { type: "image/webp", srcSet: `${alvinaHero480Webp} 480w, ${alvinaHero900Webp} 900w`, sizes: "(max-width: 900px) 88vw, 520px" }
                ]}
                fallback={{ src: alvinaHero900Webp, srcSet: `${alvinaHero480Webp} 480w, ${alvinaHero900Webp} 900w`, sizes: "(max-width: 900px) 88vw, 520px" }}
              />
            </TiltCard>
            <div className="hero-float hero-float-top reveal"><strong>{t.nav.buyers}</strong><span>{t.hero.cards.buyers}</span></div>
            <div className="hero-float hero-float-bottom reveal"><strong>{t.nav.sellers}</strong><span>{t.hero.cards.sellers}</span></div>
          </div>
        </section>

        <section className="shell trust-row reveal" aria-label="Trust signals">
          {t.trust.map((item) => <div className="pill" key={item}>{item}</div>)}
          <a className="pill" href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">alvinausher.com</a>
        </section>

        <section className="shell section-grid section-gap" id="about">
          <div className="card reveal about-panel">
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2>{t.about.title}</h2>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p className="soft-note">{extra.whyTitle}</p>
            <p className="soft-copy">{extra.whyBody}</p>
          </div>

          <div className="gallery-stack reveal">
            <TiltCard className="card image-card large">
              <Picture
                alt="Alvina Usher portrait in black suit"
                width={640}
                height={640}
                sources={[
                  { type: "image/avif", srcSet: `${alvinaPortrait2Avif} 640w`, sizes: "(max-width: 900px) 88vw, 420px" },
                  { type: "image/webp", srcSet: `${alvinaPortrait2Webp} 640w`, sizes: "(max-width: 900px) 88vw, 420px" }
                ]}
                fallback={{ src: alvinaPortrait2Webp, srcSet: `${alvinaPortrait2Webp} 640w`, sizes: "(max-width: 900px) 88vw, 420px" }}
              />
            </TiltCard>
            <div className="mini-grid">
              <TiltCard className="card image-card"><img src={buyerGuideWebp} alt="Buyer guide cover with Alvina Usher" width="640" height="971" loading="lazy" decoding="async" /></TiltCard>
              <TiltCard className="card image-card"><img src={sellerGuideWebp} alt="Seller guide cover with Alvina Usher" width="640" height="971" loading="lazy" decoding="async" /></TiltCard>
            </div>
          </div>
        </section>

        <section className="shell section-grid section-gap" id="buyers">
          <div className="card split-copy reveal">
            <p className="eyebrow">{t.buyers.eyebrow}</p>
            <h2>{t.buyers.title}</h2>
            <p>{t.buyers.body}</p>
            <ul className="feature-list">{t.buyers.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <a className="text-link" href="#guides">{t.buyers.link}</a>
          </div>
          <TiltCard className="card image-card reveal hero-side-image">
            <Picture
              alt="Happy buyers with keys and sold sign"
              width={900}
              height={900}
              sources={[
                { type: "image/avif", srcSet: `${buyersLifestyleAvif} 900w`, sizes: "(max-width: 900px) 88vw, 560px" },
                { type: "image/webp", srcSet: `${buyersLifestyleWebp} 900w`, sizes: "(max-width: 900px) 88vw, 560px" }
              ]}
              fallback={{ src: buyersLifestyleWebp, srcSet: `${buyersLifestyleWebp} 900w`, sizes: "(max-width: 900px) 88vw, 560px" }}
            />
          </TiltCard>
        </section>

        <section className="shell section-grid reverse section-gap" id="sellers">
          <TiltCard className="card image-card reveal hero-side-image">
            <Picture
              alt="Sold home sign and property exterior"
              width={900}
              height={900}
              sources={[
                { type: "image/avif", srcSet: `${sellersLifestyleAvif} 900w`, sizes: "(max-width: 900px) 88vw, 560px" },
                { type: "image/webp", srcSet: `${sellersLifestyleWebp} 900w`, sizes: "(max-width: 900px) 88vw, 560px" }
              ]}
              fallback={{ src: sellersLifestyleWebp, srcSet: `${sellersLifestyleWebp} 900w`, sizes: "(max-width: 900px) 88vw, 560px" }}
            />
          </TiltCard>
          <div className="card split-copy reveal">
            <p className="eyebrow">{t.sellers.eyebrow}</p>
            <h2>{t.sellers.title}</h2>
            <p>{t.sellers.body}</p>
            <ul className="feature-list">{t.sellers.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <a className="text-link" href="#guides">{t.sellers.link}</a>
          </div>
        </section>

        <section className="shell section-gap" id="guides">
          <div className="section-head reveal">
            <p className="eyebrow">{t.guides.eyebrow}</p>
            <h2>{t.guides.title}</h2>
            <p>{t.guides.body}</p>
          </div>
          <div className="guides-layout">
            <div className="card process-card reveal">
              <h3>{extra.processTitle}</h3>
              <ol className="process-list">
                {extra.process.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <h3>{extra.galleryTitle}</h3>
              <p>{extra.galleryBody}</p>
            </div>
            <TiltCard className="card guide-card reveal">
              <img src={buyerGuideWebp} alt="Alvina Usher buyer guide cover" width="640" height="971" loading="lazy" decoding="async" />
              <div className="guide-copy"><h3>{t.guides.buyer.title}</h3><p>{t.guides.buyer.body}</p><a className="btn btn-ghost" href="#contact">{t.cta.requestAccess}</a></div>
            </TiltCard>
            <TiltCard className="card guide-card reveal">
              <img src={sellerGuideWebp} alt="Alvina Usher seller guide cover" width="640" height="971" loading="lazy" decoding="async" />
              <div className="guide-copy"><h3>{t.guides.seller.title}</h3><p>{t.guides.seller.body}</p><a className="btn btn-ghost" href="#contact">{t.cta.requestAccess}</a></div>
            </TiltCard>
          </div>
        </section>

        <section className="shell section-gap" id="contact">
          <div className="contact-shell card reveal">
            <div className="contact-copy">
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

      <footer className="shell footer reveal">
        <p>{t.footer.p1}</p>
        <p className="small">{t.footer.p2}</p>
      </footer>
    </>
  );
}

export default App;
