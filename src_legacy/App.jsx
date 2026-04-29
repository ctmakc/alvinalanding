import { useEffect, useState } from "react";
import heroMain from "../assets/source-social/facebook-profile.jpg";
import instagramProfile from "../assets/source-social/instagram-profile.jpg";
import detailsHeadshot from "../assets/source-social/details-headshot.jpg";
import buyerGuide from "../assets/source-social/IMG_7202.png";
import sellerGuide from "../assets/source-social/IMG_7203.png";
import { initAnalytics, trackEvent, trackPageView } from "./analytics";
import { content, DEFAULT_LOCALE, resolveInitialLocale, SUPPORTED_LOCALES } from "./content";
import { applySeo } from "./seo";

const sourceGallery = [
  { label: "Facebook", image: heroMain, href: "https://www.facebook.com/AlvinaUsherOttawaRealEstate1Expert" },
  { label: "Instagram", image: instagramProfile, href: "https://www.instagram.com/alvinaottawarealestateexpert/" },
  { label: "Details Realty", image: detailsHeadshot, href: "https://detailsrealty.ca/our-agents.html/alvina-usher/" }
];

const statsByLocale = {
  en: [
    ["12+ years", "Ottawa market experience"],
    ["6,406 likes", "Facebook trust signal"],
    ["1,561 posts", "Instagram activity"]
  ],
  fr: [
    ["12+ ans", "Expérience du marché d'Ottawa"],
    ["6 406 mentions J'aime", "Signal de confiance Facebook"],
    ["1 561 publications", "Activité Instagram"]
  ],
  ru: [
    ["12+ лет", "Опыт на рынке Оттавы"],
    ["6 406 likes", "Сигнал доверия с Facebook"],
    ["1 561 пост", "Активный Instagram"]
  ]
};

const copyByLocale = {
  en: {
    heroEyebrow: "Ottawa, ON | Details Realty Inc., Brokerage",
    heroTitle: "Ottawa real estate expert for buyers, sellers, and relocations.",
    heroBody:
      "For buyers, sellers, and families planning the next move. Built from real public signals instead of generic realtor theater.",
    heroNote: "Active social presence, direct contact, educational market content.",
    proofTitle: "The page only needs to prove three things.",
    proofItems: [
      {
        label: "Trust",
        title: "People already see a real brand in public.",
        body: "Facebook audience and public engagement do the heavy lifting better than vague luxury copy."
      },
      {
        label: "Activity",
        title: "The brand is active, not staged.",
        body: "Instagram volume, direct contact details, and steady publishing make the presence feel current."
      },
      {
        label: "Authority",
        title: "Market education beats decoration.",
        body: "Ottawa explainers and practical guidance belong at the center of the story."
      }
    ],
    buyers: {
      label: "For buyers",
      title: "Move with more confidence.",
      body: "Timing, neighborhoods, offer-readiness, and a cleaner first plan.",
      bullets: [
        "First-time and move-up buyers",
        "Relocation and area fit",
        "Guide request or direct consultation"
      ]
    },
    sellers: {
      label: "For sellers",
      title: "List with better control.",
      body: "Pricing, prep, marketing, and a sharper launch without inflated language.",
      bullets: [
        "Pricing and launch sequence",
        "Presentation and timing",
        "Guide request or direct consultation"
      ]
    },
    guidesTitle: "Take the guides.",
    guidesBody: "They should be the easiest first step on the page.",
    contactTitle: "Call. Text. Write.",
    contactBody: "Short form. Clear intent. Quick follow-up.",
    contactReasons: [
      "Buying in Ottawa soon",
      "Selling and need launch or pricing guidance",
      "Need a practical read on the market before moving"
    ],
    demoNote: "Demo mode is active.",
    liveNote: "This message goes straight into the live workflow.",
    footer: "Built from public Facebook, Instagram, brokerage, and Ottawa market-content signals."
  },
  fr: {
    heroEyebrow: "Ottawa, ON | Details Realty Inc., Brokerage",
    heroTitle: "Experte en immobilier à Ottawa pour acheteurs, vendeurs et relocalisations.",
    heroBody:
      "Pour les acheteurs, les vendeurs et les familles qui préparent leur prochain mouvement. Basé sur des signaux publics réels, pas sur un théâtre marketing générique.",
    heroNote: "Présence sociale active, contact direct, contenu marché utile.",
    proofTitle: "La page doit seulement prouver trois choses.",
    proofItems: [
      {
        label: "Confiance",
        title: "La marque existe déjà en public.",
        body: "L'audience Facebook et l'engagement visible font mieux que des promesses vagues."
      },
      {
        label: "Activité",
        title: "La présence est active, pas mise en scène.",
        body: "Le volume Instagram, les coordonnées directes et la publication continue rendent la marque crédible."
      },
      {
        label: "Autorité",
        title: "Le contenu marché vaut mieux que le décor.",
        body: "Les explications sur Ottawa et les conseils pratiques doivent rester au centre."
      }
    ],
    buyers: {
      label: "Pour les acheteurs",
      title: "Avancer avec plus de confiance.",
      body: "Timing, quartiers, préparation d'offre et premier plan plus net.",
      bullets: [
        "Premier achat et montée en gamme",
        "Relocalisation et choix du secteur",
        "Demande de guide ou consultation directe"
      ]
    },
    sellers: {
      label: "Pour les vendeurs",
      title: "Lister avec plus de contrôle.",
      body: "Prix, préparation, marketing et lancement plus net sans langage gonflé.",
      bullets: [
        "Prix et séquence de lancement",
        "Présentation et timing",
        "Demande de guide ou consultation directe"
      ]
    },
    guidesTitle: "Prendre les guides.",
    guidesBody: "Ils doivent être l'étape la plus simple sur la page.",
    contactTitle: "Appeler. Écrire. Envoyer.",
    contactBody: "Formulaire court. Intention claire. Suivi rapide.",
    contactReasons: [
      "Achat prochain à Ottawa",
      "Vente avec besoin de stratégie de prix ou de lancement",
      "Besoin d'une lecture pratique du marché avant d'agir"
    ],
    demoNote: "Le mode démo est actif.",
    liveNote: "Ce message arrive directement dans le workflow actif.",
    footer: "Construit à partir des signaux publics Facebook, Instagram, du profil professionnel et du contenu marché d'Ottawa."
  },
  ru: {
    heroEyebrow: "Ottawa, ON | Details Realty Inc., Brokerage",
    heroTitle: "Эксперт по недвижимости в Оттаве для покупателей, продавцов и relocation.",
    heroBody:
      "Для покупателей, продавцов и семей, которые готовят следующий шаг. Собрано на реальных публичных сигналах, а не на шаблонной realtor-мишуре.",
    heroNote: "Живые соцсети, прямой контакт, полезный контент по рынку.",
    proofTitle: "Эта страница должна доказать только три вещи.",
    proofItems: [
      {
        label: "Доверие",
        title: "Бренд уже существует в публичном поле.",
        body: "Аудитория Facebook и реальная вовлеченность работают лучше, чем любой расплывчатый luxury copy."
      },
      {
        label: "Активность",
        title: "Присутствие живое, а не постановочное.",
        body: "Instagram, прямые контакты и постоянный контент делают бренд актуальным и reachable."
      },
      {
        label: "Авторитет",
        title: "Объяснение рынка сильнее декора.",
        body: "Разборы Оттавы и практичные советы должны быть в центре страницы."
      }
    ],
    buyers: {
      label: "Для покупателей",
      title: "Двигаться увереннее.",
      body: "Тайминг, районы, готовность к офферу и более чистый первый план.",
      bullets: [
        "First-time и move-up buyers",
        "Relocation и выбор района",
        "Запрос гайда или прямая консультация"
      ]
    },
    sellers: {
      label: "Для продавцов",
      title: "Листинг с большим контролем.",
      body: "Цена, подготовка, маркетинг и запуск без раздутой realtor-подачи.",
      bullets: [
        "Ценообразование и сценарий запуска",
        "Подготовка объекта и тайминг",
        "Запрос гайда или прямая консультация"
      ]
    },
    guidesTitle: "Забрать гайды.",
    guidesBody: "Они должны быть самой простой точкой входа на странице.",
    contactTitle: "Позвонить. Написать. Отправить.",
    contactBody: "Короткая форма. Понятный intent. Быстрый follow-up.",
    contactReasons: [
      "Покупка в Оттаве в ближайшее время",
      "Продажа и нужна стратегия цены или запуска",
      "Нужен практичный разбор рынка перед решением"
    ],
    demoNote: "Сейчас активен demo mode.",
    liveNote: "Сообщение сразу уходит в рабочий workflow.",
    footer: "Собрано на основе публичных сигналов Facebook, Instagram, брокерского профиля и контента по рынку Оттавы."
  }
};

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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${(index % 4) * 55}ms`;
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

function LeadForm({ locale, t, noteCopy }) {
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
        <p className="form-note">{liveMode ? noteCopy.live : noteCopy.demo}</p>
      </div>

      {status === "success" && <p className="form-success">{t.form.success}</p>}
      {status === "error" && <p className="form-error">{t.form.error}</p>}
    </form>
  );
}

function App() {
  const [locale, setLocale] = useState(() => (typeof window === "undefined" ? DEFAULT_LOCALE : resolveInitialLocale()));
  const t = content[locale] || content.en;
  const copy = copyByLocale[locale] || copyByLocale.en;
  const stats = statsByLocale[locale] || statsByLocale.en;

  useRevealAnimations();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    window.history.replaceState({}, "", url);
    window.localStorage.setItem("locale", locale);
    applySeo({ locale, seo: t.seo, imageUrl: new URL(heroMain, window.location.origin).toString() });
    trackPageView({ locale, page: "landing" });
  }, [locale, t]);

  return (
    <>
      <div className="page-frame" aria-hidden="true">
        <div className="page-frame__rail" />
      </div>

      <header className="shell topbar reveal">
        <a className="brand" href="#home" aria-label="Alvina Usher home">
          <span className="brand-mark">AU</span>
          <span className="brand-copy">
            <strong>Alvina Usher</strong>
            <small>Ottawa real estate</small>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          <a href="#buyers">{t.nav.buyers}</a>
          <a href="#sellers">{t.nav.sellers}</a>
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
            <div className="hero-topline">
              <p className="eyebrow">{copy.heroEyebrow}</p>
              <div className="hero-links">
                {sourceGallery.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <h1>{copy.heroTitle}</h1>
            <p className="hero-body">{copy.heroBody}</p>
            <div className="hero-stats">
              {stats.map(([value, label]) => (
                <div key={label} className="hero-stats__item">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p className="hero-note">{copy.heroNote}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">
                {t.cta.consult}
              </a>
              <a className="btn btn-outline" href="#guides">
                {t.cta.guides}
              </a>
            </div>
            <div className="hero-contact">
              <a href="tel:+16137961449">613-796-1449</a>
              <a href="mailto:alvina@alvinausher.com">alvina@alvinausher.com</a>
            </div>
            <div className="hero-thumbs" aria-label="Source visuals">
              {sourceGallery.map((item) => (
                <figure key={item.label}>
                  <img src={item.image} alt={`${item.label} source`} loading="lazy" />
                  <figcaption>{item.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <figure className="hero-photo">
            <img src={heroMain} alt="Alvina Usher public portrait" fetchPriority="high" />
          </figure>
        </section>

        <section className="proof reveal">
          <div className="section-head">
            <p className="eyebrow">Public proof</p>
            <h2>{copy.proofTitle}</h2>
            <p>{copy.proofItems[0].body}</p>
          </div>

          <div className="proof-grid">
            {copy.proofItems.map((item) => (
              <article key={item.title} className="proof-card">
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="split reveal">
          <article className="path-block" id="buyers">
            <span>{copy.buyers.label}</span>
            <h2>{copy.buyers.title}</h2>
            <p>{copy.buyers.body}</p>
            <ul>
              {copy.buyers.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>

          <article className="path-block path-block--dark" id="sellers">
            <span>{copy.sellers.label}</span>
            <h2>{copy.sellers.title}</h2>
            <p>{copy.sellers.body}</p>
            <ul>
              {copy.sellers.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="guides reveal" id="guides">
          <div className="section-head">
            <p className="eyebrow">Guides</p>
            <h2>{copy.guidesTitle}</h2>
            <p>{copy.guidesBody}</p>
          </div>

          <div className="guide-grid">
            <article className="guide-card">
              <img src={buyerGuide} alt={t.guides.buyer.imageAlt} width="396" height="601" loading="lazy" />
              <div>
                <span>{copy.buyers.label}</span>
                <h3>{t.guides.buyer.title}</h3>
                <a href="#contact">{t.guides.buyer.cta}</a>
              </div>
            </article>

            <article className="guide-card">
              <img src={sellerGuide} alt={t.guides.seller.imageAlt} width="396" height="601" loading="lazy" />
              <div>
                <span>{copy.sellers.label}</span>
                <h3>{t.guides.seller.title}</h3>
                <a href="#contact">{t.guides.seller.cta}</a>
              </div>
            </article>
          </div>
        </section>

        <section className="contact reveal" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>{copy.contactTitle}</h2>
            <p>{copy.contactBody}</p>
            <ul className="contact-list">
              {copy.contactReasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
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

          <LeadForm
            locale={locale}
            t={t}
            noteCopy={{ demo: copy.demoNote, live: copy.liveNote }}
          />
        </section>
      </main>

      <footer className="shell footer reveal">
        <p>{copy.footer}</p>
        <p className="small">{t.footer.p2}</p>
      </footer>
    </>
  );
}

export default App;
