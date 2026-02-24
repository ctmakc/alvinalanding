function ensureMeta(attr, key) {
  let node = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  return node;
}

function ensureLink(rel, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`;
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    if (hreflang) node.setAttribute("hreflang", hreflang);
    document.head.appendChild(node);
  }
  return node;
}

function setAlternates(origin, pathname) {
  const base = `${origin}${pathname}`;
  [["x-default", `${base}?lang=en`], ["en", `${base}?lang=en`], ["fr", `${base}?lang=fr`], ["ru", `${base}?lang=ru`]].forEach(([lang, href]) => {
    ensureLink("alternate", lang).setAttribute("href", href);
  });
}

function setSchema({ locale, canonicalUrl, imageUrl }) {
  let node = document.head.querySelector('script[data-seo-schema="real-estate-agent"]');
  if (!node) {
    node = document.createElement("script");
    node.type = "application/ld+json";
    node.dataset.seoSchema = "real-estate-agent";
    document.head.appendChild(node);
  }

  node.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Alvina Usher",
    url: canonicalUrl,
    image: imageUrl,
    telephone: "+1-613-796-1449",
    areaServed: ["Ottawa", "Ontario", "Canada"],
    address: { "@type": "PostalAddress", addressLocality: "Ottawa", addressRegion: "ON", addressCountry: "CA" },
    sameAs: ["https://www.alvinausher.com/", "https://detailsrealty.ca/our-agents.html/alvina-usher/"],
    memberOf: { "@type": "Organization", name: "Details Realty Inc., Brokerage" },
    knowsLanguage: locale === "fr" ? ["English", "French"] : locale === "ru" ? ["English", "Russian"] : ["English"]
  });
}

export function applySeo({ locale, seo, imageUrl }) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", locale);
  const canonicalUrl = url.toString();

  document.title = seo.title;
  document.documentElement.lang = locale;

  ensureMeta("name", "description").setAttribute("content", seo.description);
  ensureMeta("name", "robots").setAttribute("content", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
  ensureMeta("name", "theme-color").setAttribute("content", "#081018");

  ensureMeta("property", "og:type").setAttribute("content", "website");
  ensureMeta("property", "og:locale").setAttribute("content", locale === "fr" ? "fr_CA" : locale === "ru" ? "ru_RU" : "en_CA");
  ensureMeta("property", "og:title").setAttribute("content", seo.ogTitle);
  ensureMeta("property", "og:description").setAttribute("content", seo.ogDescription);
  ensureMeta("property", "og:url").setAttribute("content", canonicalUrl);
  ensureMeta("property", "og:image").setAttribute("content", imageUrl);

  ensureMeta("name", "twitter:card").setAttribute("content", "summary_large_image");
  ensureMeta("name", "twitter:title").setAttribute("content", seo.ogTitle);
  ensureMeta("name", "twitter:description").setAttribute("content", seo.ogDescription);
  ensureMeta("name", "twitter:image").setAttribute("content", imageUrl);

  ensureLink("canonical").setAttribute("href", canonicalUrl);
  setAlternates(url.origin, url.pathname || "/");
  setSchema({ locale, canonicalUrl, imageUrl });
}
