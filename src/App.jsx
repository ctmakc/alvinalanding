import { useEffect, useState } from "react";
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
import gammaPortraitOne from "../assets/gamma-3.jpg";
import gammaPortraitTwo from "../assets/gamma-6.jpg";
import { applySeo } from "./seo";
import { content, DEFAULT_LOCALE, resolveInitialLocale, SUPPORTED_LOCALES } from "./content";
import { initAnalytics, trackEvent, trackPageView } from "./analytics";

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
  const provider = (import.meta.env.VITE_FORM_PROVIDER || "formsubmit").toLowerCase();
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT || "";
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
    const val = new URLSearchParams(window.location.search).get(key);
    if (val) data.append(key, val);
  });

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ok: true, demo: true };
  }

  if (provider === "web3forms" && accessKey) {
    data.append("access_key", accessKey);
    data.append("subject", `Alvina Landing Lead (${locale.toUpperCase()})`);
    data.append("from_name", "Alvina Landing");
    data.append("replyto", String(data.get("email") || ""));
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: provider === "formsubmit" ? { Accept: "application/json" } : undefined,
    body: data
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return { ok: response.ok && (!payload || payload.success !== false), payload };
}

function LeadForm({ t, locale }) {
  const [status, setStatus] = useState("idle");
  const provider = (import.meta.env.VITE_FORM_PROVIDER || "formsubmit").toLowerCase();
  const liveMode = Boolean(import.meta.env.VITE_FORM_ENDPOINT || provider === "formsubmit");
  const redirectOnSuccess = String(import.meta.env.VITE_ENABLE_FORM_REDIRECT || "true") === "true";
  const thankYouUrl = import.meta.env.VITE_THANK_YOU_URL || "/thank-you.html";
  const usesNativeSubmit = provider === "formsubmit";
  const nativeAction = import.meta.env.VITE_FORM_ACTION || "https://formsubmit.co/ctmakc@gmail.com";
  const nativeNext = new URL(thankYouUrl, typeof window === "undefined" ? "https://alvina.mmix.dev" : window.location.origin);
  nativeNext.searchParams.set("lang", locale);

  function onSubmit(event) {
    trackEvent("form_submit", { form_name: "lead_form", locale });

    if (usesNativeSubmit) {
      const honeypot = event.currentTarget.elements.namedItem("website");
      if (honeypot && String(honeypot.value || "").trim()) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
    setStatus("submitting");

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
    <form
      className={`lead-form${status === "success" ? " submitted" : ""}`}
      onSubmit={onSubmit}
      noValidate
      action={usesNativeSubmit ? nativeAction : undefined}
      method={usesNativeSubmit ? "POST" : undefined}
    >
      <input className="bot-field" type="text" name="website" tabIndex="-1" autoComplete="off" />
      {usesNativeSubmit && (
        <>
          <input type="hidden" name="_subject" value={`Alvina Landing Lead (${locale.toUpperCase()})`} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value={nativeNext.toString()} />
        </>
      )}
      <div className="form-grid">
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
            <option value="" disabled>
              {t.form.select}
            </option>
            {t.form.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="full">
          {t.form.message}
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
  const [locale, setLocale] = useState(() =>
    typeof window === "undefined" ? DEFAULT_LOCALE : resolveInitialLocale()
  );
  const t = content[locale] || content.en;

  const extra = {
    en: {
      heroTag: "Ottawa Real Estate by Alvina Usher",
      heroSub:
        "A faster, cleaner landing page built to feel credible in the first three seconds and convert consultation-ready leads.",
      galleryTitle: "Brand visuals & client-facing resources",
      galleryBody:
        "Multiple portraits, guide covers, and buyer/seller visuals make the page feel like a real personal brand instead of a generic realtor template.",
      processTitle: "How clients work with Alvina",
      process: [
        "Discovery call and goals mapping",
        "Buyer or seller plan tailored to Ottawa timing and inventory",
        "Offer, pricing, and negotiation support",
        "Calm communication from listing prep to closing"
      ],
      whyTitle: "Why this version works better",
      whyBody:
        "The page opens faster, keeps English as the default, uses stronger trust cues, and gives buyers and sellers a clearer next step."
    },
    fr: {
      heroTag: "Immobilier Ottawa avec Alvina Usher",
      heroSub:
        "Une landing page plus rapide et plus claire, pensée pour inspirer confiance rapidement et convertir des demandes sérieuses.",
      galleryTitle: "Visuels de marque et ressources clients",
      galleryBody:
        "Portraits variés, guides et visuels acheteur/vendeur pour donner une vraie présence de marque personnelle.",
      processTitle: "Comment les clients travaillent avec Alvina",
      process: [
        "Appel de découverte et clarification des objectifs",
        "Plan acheteur ou vendeur selon le marché d'Ottawa",
        "Soutien sur le prix, l'offre et la négociation",
        "Communication fluide jusqu'à la clôture"
      ],
      whyTitle: "Pourquoi cette version est meilleure",
      whyBody:
        "La page s'ouvre plus vite, garde l'anglais par défaut et donne un parcours plus net vers la consultation."
    },
    ru: {
      heroTag: "Недвижимость в Оттаве с Alvina Usher",
      heroSub:
        "Более быстрый и внятный лендинг, который сразу вызывает доверие и ведет к заявке на консультацию.",
      galleryTitle: "Визуалы бренда и клиентские материалы",
      galleryBody:
        "Несколько портретов, обложки гайдов и buyer/seller-визуалы делают страницу похожей на живой личный бренд, а не на шаблон.",
      processTitle: "Как проходит работа с Alvina",
      process: [
        "Знакомство и фиксация целей",
        "План покупки или продажи под рынок Оттавы",
        "Поддержка по цене, офферам и переговорам",
        "Спокойная коммуникация до закрытия сделки"
      ],
      whyTitle: "Почему эта версия лучше",
      whyBody:
        "Страница открывается быстрее, по умолчанию дает английскую версию и заметно лучше ведет пользователя к консультации."
    }
  }[locale];

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState({}, "", url);
    applySeo({
      locale,
      seo: t.seo,
      imageUrl: new URL(alvinaHero900Webp, window.location.origin).toString()
    });
    trackPageView({ locale, page: "landing" });
  }, [locale, t]);

  return (
    <>
      <div className="bg-decor" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="mesh" />
      </div>

      <header className="shell topbar">
        <a className="brand" href="#home" aria-label="Alvina Usher home">
          <span className="brand-mark">AU</span>
          <span>
            <strong>Alvina Usher</strong>
            <small>Ottawa Real Estate</small>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#buyers">{t.nav.buyers}</a>
          <a href="#sellers">{t.nav.sellers}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="topbar-actions">
          <LocaleSwitcher locale={locale} onChange={setLocale} />
          <a className="btn btn-primary btn-sm" href="tel:+16137961449">
            {t.cta.call}
          </a>
        </div>
      </header>

      <main id="home">
        <section className="shell hero-v2 section-gap">
          <div className="hero-copy">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="lead">{t.hero.lede}</p>
            <p className="hero-tagline">{extra.heroTag}</p>
            <p className="hero-subline">{extra.heroSub}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">
                {t.cta.consult}
              </a>
              <a className="btn btn-ghost" href="#guides">
                {t.cta.guides}
              </a>
            </div>
            <div className="stats-grid">
              {t.hero.stats.map(([value, label]) => (
                <div key={`${value}-${label}`} className="stat-box">
                  <span>{value}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-stage">
            <div className="hero-portrait-card">
              <Picture
                alt="Alvina Usher portrait"
                width={900}
                height={900}
                priority
                sources={[
                  {
                    type: "image/avif",
                    srcSet: `${alvinaHero480Avif} 480w, ${alvinaHero900Avif} 900w`,
                    sizes: "(max-width: 900px) 88vw, 520px"
                  },
                  {
                    type: "image/webp",
                    srcSet: `${alvinaHero480Webp} 480w, ${alvinaHero900Webp} 900w`,
                    sizes: "(max-width: 900px) 88vw, 520px"
                  }
                ]}
                fallback={{
                  src: alvinaHero900Webp,
                  srcSet: `${alvinaHero480Webp} 480w, ${alvinaHero900Webp} 900w`,
                  sizes: "(max-width: 900px) 88vw, 520px"
                }}
              />
            </div>
            <div className="hero-float hero-float-top">
              <strong>{t.nav.buyers}</strong>
              <span>{t.hero.cards.buyers}</span>
            </div>
            <div className="hero-float hero-float-bottom">
              <strong>{t.nav.sellers}</strong>
              <span>{t.hero.cards.sellers}</span>
            </div>
          </div>
        </section>

        <section className="shell trust-row" aria-label="Trust signals">
          {t.trust.map((item) => (
            <div className="pill" key={item}>
              {item}
            </div>
          ))}
          <a className="pill" href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">
            alvinausher.com
          </a>
        </section>

        <section className="shell section-grid section-gap" id="about">
          <div className="card about-panel">
            <p className="eyebrow">{t.about.eyebrow}</p>
            <h2>{t.about.title}</h2>
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <p className="soft-note">{extra.whyTitle}</p>
            <p className="soft-copy">{extra.whyBody}</p>
          </div>

          <div className="gallery-stack">
            <div className="card image-card large">
              <Picture
                alt="Alvina Usher portrait in black suit"
                width={640}
                height={640}
                sources={[
                  { type: "image/avif", srcSet: `${alvinaPortrait2Avif} 640w`, sizes: "(max-width: 900px) 88vw, 420px" },
                  { type: "image/webp", srcSet: `${alvinaPortrait2Webp} 640w`, sizes: "(max-width: 900px) 88vw, 420px" }
                ]}
                fallback={{
                  src: alvinaPortrait2Webp,
                  srcSet: `${alvinaPortrait2Webp} 640w`,
                  sizes: "(max-width: 900px) 88vw, 420px"
                }}
              />
            </div>
            <div className="mini-grid portrait-grid">
              <div className="card image-card">
                <img src={gammaPortraitOne} alt="Alvina Usher portrait in black suit" width="1024" height="1024" loading="lazy" decoding="async" />
              </div>
              <div className="card image-card">
                <img src={gammaPortraitTwo} alt="Alvina Usher portrait in office setting" width="1024" height="1024" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section className="shell section-grid section-gap" id="buyers">
          <div className="card split-copy">
            <p className="eyebrow">{t.buyers.eyebrow}</p>
            <h2>{t.buyers.title}</h2>
            <p>{t.buyers.body}</p>
            <ul className="feature-list">
              {t.buyers.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <a className="text-link" href="#guides">
              {t.buyers.link}
            </a>
          </div>
          <div className="card image-card hero-side-image">
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
          </div>
        </section>

        <section className="shell section-grid reverse section-gap" id="sellers">
          <div className="card image-card hero-side-image">
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
          </div>
          <div className="card split-copy">
            <p className="eyebrow">{t.sellers.eyebrow}</p>
            <h2>{t.sellers.title}</h2>
            <p>{t.sellers.body}</p>
            <ul className="feature-list">
              {t.sellers.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <a className="text-link" href="#guides">
              {t.sellers.link}
            </a>
          </div>
        </section>

        <section className="shell section-gap" id="guides">
          <div className="section-head">
            <p className="eyebrow">{t.guides.eyebrow}</p>
            <h2>{t.guides.title}</h2>
            <p>{t.guides.body}</p>
          </div>
          <div className="guides-layout">
            <div className="card process-card">
              <h3>{extra.processTitle}</h3>
              <ol className="process-list">
                {extra.process.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h3>{extra.galleryTitle}</h3>
              <p>{extra.galleryBody}</p>
            </div>
            <div className="card guide-card">
              <img src={buyerGuideWebp} alt="Alvina Usher buyer guide cover" width="640" height="971" loading="lazy" decoding="async" />
              <div className="guide-copy">
                <h3>{t.guides.buyer.title}</h3>
                <p>{t.guides.buyer.body}</p>
                <a className="btn btn-ghost" href="#contact">
                  {t.cta.requestAccess}
                </a>
              </div>
            </div>
            <div className="card guide-card">
              <img src={sellerGuideWebp} alt="Alvina Usher seller guide cover" width="640" height="971" loading="lazy" decoding="async" />
              <div className="guide-copy">
                <h3>{t.guides.seller.title}</h3>
                <p>{t.guides.seller.body}</p>
                <a className="btn btn-ghost" href="#contact">
                  {t.cta.requestAccess}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="shell section-gap" id="contact">
          <div className="contact-shell card">
            <div className="contact-copy">
              <p className="eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.body}</p>
              <div className="contact-links">
                <a href="tel:+16137961449">{t.contact.links.call}</a>
                <a href="https://detailsrealty.ca/our-agents.html/alvina-usher/" target="_blank" rel="noreferrer">
                  {t.contact.links.profile}
                </a>
                <a href="https://www.alvinausher.com/" target="_blank" rel="noreferrer">
                  {t.contact.links.site}
                </a>
              </div>
            </div>
            <LeadForm t={t} locale={locale} />
          </div>
        </section>
      </main>

      <footer className="shell footer">
        <p>{t.footer.p1}</p>
        <p className="small">{t.footer.p2}</p>
      </footer>
    </>
  );
}

export default App;
