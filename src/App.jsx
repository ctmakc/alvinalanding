import { useEffect, useState } from "react";
import heroPrimary from "../assets/source-social/IMG_0237.jpeg";
import heroSecondary from "../assets/source-social/IMG_0241.jpeg";
import buyerGuide from "../assets/source-social/IMG_7202.png";
import sellerGuide from "../assets/source-social/IMG_7203.png";
import { initAnalytics, trackEvent, trackPageView } from "./analytics";
import { content, DEFAULT_LOCALE, resolveInitialLocale, SUPPORTED_LOCALES } from "./content";
import { applySeo } from "./seo";

function useRevealAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll(".reveal"));

    if (reduceMotion) {
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
      node.style.transitionDelay = `${(index % 6) * 45}ms`;
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);
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

  if (String(data.get("website") || "").trim()) {
    return { ok: true, spam: true };
  }

  data.append("locale", locale);
  data.append("page_url", window.location.href);
  data.append("page_title", document.title);
  data.append("submitted_at", new Date().toISOString());

  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
    const value = new URLSearchParams(window.location.search).get(key);
    if (value) data.append(key, value);
  });

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 450));
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
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { ok: response.ok && (!payload || payload.success !== false), payload };
}

function LeadForm({ locale, t }) {
  const [status, setStatus] = useState("idle");
  const liveMode = Boolean(import.meta.env.VITE_FORM_ENDPOINT);
  const redirectOnSuccess = String(import.meta.env.VITE_ENABLE_FORM_REDIRECT || "false") === "true";
  const thankYouUrl = import.meta.env.VITE_THANK_YOU_URL || "/thank-you.html";

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    trackEvent("form_submit", { form_name: "lead_form", locale });

    submitLeadForm(event.currentTarget, locale)
      .then((result) => {
        if (!result.ok) throw new Error("submit_failed");
        setStatus("success");
        trackEvent("generate_lead", { form_name: "lead_form", locale, mode: liveMode ? "live" : "demo" });
        event.currentTarget.reset();

        if (redirectOnSuccess) {
          const nextUrl = new URL(thankYouUrl, window.location.origin);
          nextUrl.searchParams.set("lang", locale);
          window.location.assign(nextUrl.toString());
        }
      })
      .catch(() => {
        setStatus("error");
        trackEvent("form_error", { form_name: "lead_form", locale });
      });
  }

  return (
    <form className={`lead-form${status === "success" ? " submitted" : ""}`} onSubmit={handleSubmit} noValidate>
      <input className="bot-field" type="text" name="website" tabIndex="-1" autoComplete="off" />

      <div className="form-grid">
        <label>
          <span>{t.form.name}</span>
          <input type="text" name="name" placeholder={t.form.placeholders.name} required autoComplete="name" />
        </label>
        <label>
          <span>{t.form.email}</span>
          <input type="email" name="email" placeholder={t.form.placeholders.email} required autoComplete="email" />
        </label>
        <label>
          <span>{t.form.phone}</span>
          <input type="tel" name="phone" placeholder={t.form.placeholders.phone} autoComplete="tel" />
        </label>
        <label>
          <span>{t.form.interest}</span>
          <select name="interest" defaultValue="" required>
            <option value="" disabled>
              {t.form.select}
            </option>
            {t.form.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          <span>{t.form.message}</span>
          <textarea name="message" rows="4" placeholder={t.form.placeholders.message} />
        </label>
      </div>

      <label className="consent-line">
        <input type="checkbox" name="consent" required />
        <span>{t.form.consent}</span>
      </label>

      <div className="form-actions-row">
        <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "..." : t.cta.send}
        </button>
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

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState({}, "", url);
    window.localStorage.setItem("locale", locale);
    applySeo({ locale, seo: t.seo, imageUrl: new URL(heroPrimary, window.location.origin).toString() });
    trackPageView({ locale, page: "landing" });
  }, [locale, t]);

  return (
    <>
      <div className="page-glow" aria-hidden="true">
        <div className="page-glow__orb page-glow__orb--left" />
        <div className="page-glow__orb page-glow__orb--right" />
        <div className="page-glow__grid" />
      </div>

      <header className="shell topbar reveal">
        <a className="brand" href="#home" aria-label="Alvina Usher home">
          <span className="brand-mark">AU</span>
          <span className="brand-copy">
            <strong>Alvina Usher</strong>
            <small>Ottawa Real Estate</small>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          <a href="#buyers">{t.nav.buyers}</a>
          <a href="#sellers">{t.nav.sellers}</a>
          <a href="#market">{t.nav.market}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>

        <div className="topbar-actions">
          <LocaleSwitcher locale={locale} onChange={setLocale} />
          <a className="btn btn-ghost btn-sm" href="tel:+16137961449">
            {t.cta.call}
          </a>
        </div>
      </header>

      <main className="shell site-main">
        <section className="hero reveal" id="home">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="hero-lede">{t.hero.lede}</p>

            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">
                {t.cta.consult}
              </a>
              <a className="btn btn-outline" href="#guides">
                {t.cta.guides}
              </a>
            </div>

            <div className="quick-pills">
              {t.hero.quickPills.map((pill) => (
                <span key={pill} className="quick-pill">
                  {pill}
                </span>
              ))}
            </div>

            <div className="hero-stats">
              {t.hero.stats.map(([value, label]) => (
                <div key={label} className="hero-stat">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="trust-bar">
              {t.hero.trustPills.map((pill) => (
                <span key={pill} className="trust-pill">
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo-card">
              <img src={heroPrimary} alt={t.hero.photoAlt} width="1024" height="1024" fetchPriority="high" />
            </div>
            <div className="hero-float hero-float--market">
              <span className="hero-float__label">{t.hero.marketBadge}</span>
              <strong>{t.hero.marketTitle}</strong>
              <p>{t.hero.marketBody}</p>
            </div>
            <div className="hero-float hero-float--offer">
              <span className="hero-float__label">{t.hero.offerBadge}</span>
              <strong>{t.hero.offerTitle}</strong>
              <p>{t.hero.offerBody}</p>
            </div>
          </div>
        </section>

        <section className="signal-strip reveal" aria-label="Brand and content signals">
          {t.signalStrip.map((item) => (
            <div key={item.title} className="signal-chip">
              <span>{item.title}</span>
              <small>{item.body}</small>
            </div>
          ))}
        </section>

        <section className="section reveal" id="buyers">
          <div className="section-head">
            <p className="eyebrow">{t.audience.eyebrow}</p>
            <h2>{t.audience.title}</h2>
            <p>{t.audience.body}</p>
          </div>

          <div className="audience-grid">
            {t.audience.cards.map((card) => (
              <article key={card.id} className="path-card" id={card.id}>
                <div className="path-card__kicker">{card.kicker}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <a className="text-link" href={card.href}>
                  {card.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal" id="market">
          <div className="section-head">
            <p className="eyebrow">{t.market.eyebrow}</p>
            <h2>{t.market.title}</h2>
            <p>{t.market.body}</p>
          </div>

          <div className="insight-grid">
            {t.market.items.map((item) => (
              <article key={item.title} className="insight-card">
                <span className="insight-card__meta">{item.meta}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section strategy-section reveal">
          <div className="strategy-copy">
            <p className="eyebrow">{t.blueprint.eyebrow}</p>
            <h2>{t.blueprint.title}</h2>
            <p>{t.blueprint.body}</p>
            <ol className="process-list">
              {t.blueprint.steps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <span>{step.body}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="strategy-proof">
            <div className="proof-photo">
              <img src={heroSecondary} alt={t.about.photoAlt} width="1024" height="1024" loading="lazy" />
            </div>
            <div className="proof-card">
              <h3>{t.blueprint.proofTitle}</h3>
              <p>{t.blueprint.proofBody}</p>
              <ul>
                {t.blueprint.proofBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section reveal" id="guides">
          <div className="section-head">
            <p className="eyebrow">{t.guides.eyebrow}</p>
            <h2>{t.guides.title}</h2>
            <p>{t.guides.body}</p>
          </div>

          <div className="guides-grid">
            <article className="guide-card">
              <img src={buyerGuide} alt={t.guides.buyer.imageAlt} width="396" height="601" loading="lazy" />
              <div className="guide-card__copy">
                <h3>{t.guides.buyer.title}</h3>
                <p>{t.guides.buyer.body}</p>
                <a className="btn btn-outline btn-sm" href="#contact">
                  {t.guides.buyer.cta}
                </a>
              </div>
            </article>

            <article className="guide-card">
              <img src={sellerGuide} alt={t.guides.seller.imageAlt} width="396" height="601" loading="lazy" />
              <div className="guide-card__copy">
                <h3>{t.guides.seller.title}</h3>
                <p>{t.guides.seller.body}</p>
                <a className="btn btn-outline btn-sm" href="#contact">
                  {t.guides.seller.cta}
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="section about-section reveal" id="about">
          <div className="section-head">
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2>{t.about.title}</h2>
            <p>{t.about.p1}</p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <p>{t.about.p2}</p>
              <div className="value-grid">
                {t.about.values.map((value) => (
                  <div key={value.title} className="value-card">
                    <strong>{value.title}</strong>
                    <span>{value.body}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-card about-card--soft">
              <p className="about-note">{t.about.note}</p>
              <ul className="feature-list">
                {t.about.featureList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section reveal">
          <div className="section-head">
            <p className="eyebrow">{t.social.eyebrow}</p>
            <h2>{t.social.title}</h2>
            <p>{t.social.body}</p>
          </div>

          <div className="social-grid">
            {t.social.platforms.map((platform) => (
              <a key={platform.name} className="social-card" href={platform.href} target="_blank" rel="noreferrer">
                <span className="social-card__name">{platform.name}</span>
                <strong>{platform.handle}</strong>
                <p>{platform.description}</p>
                <span className="social-card__cta">{platform.label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section contact-section reveal" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2>{t.contact.title}</h2>
            <p>{t.contact.body}</p>

            <div className="contact-links">
              <a href="tel:+16137961449">{t.contact.links.call}</a>
              <a href="sms:+16137961449">{t.contact.links.text}</a>
              <a href="mailto:alvina@alvinausher.com">{t.contact.links.email}</a>
              <a href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">
                {t.contact.links.site}
              </a>
              <a href="https://detailsrealty.ca/our-agents.html/alvina-usher/" target="_blank" rel="noreferrer">
                {t.contact.links.profile}
              </a>
            </div>
          </div>

          <LeadForm locale={locale} t={t} />
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
