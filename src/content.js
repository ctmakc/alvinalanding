import en from "./locales/en";
import fr from "./locales/fr";
import ru from "./locales/ru";

export const SUPPORTED_LOCALES = ["en", "fr", "ru"];
export const DEFAULT_LOCALE = "en";

export const content = { en, fr, ru };

export function resolveInitialLocale() {
  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("lang");
  if (SUPPORTED_LOCALES.includes(fromQuery)) return fromQuery;
  return DEFAULT_LOCALE;
}
