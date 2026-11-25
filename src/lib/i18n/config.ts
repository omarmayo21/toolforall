export const LANGS = ["en", "es", "de", "fr", "pt", "ja", "it", "ru", "ar", "tr", "ko"] as const;
export type Lang = (typeof LANGS)[number];
export const LOCALIZED = LANGS.filter((l) => l !== "en") as Exclude<Lang, "en">[];
export const LANG_NAMES: Record<Lang, string> = { en: "English", es: "Español", de: "Deutsch", fr: "Français", pt: "Português", ja: "日本語", it: "Italiano", ru: "Русский", ar: "العربية", tr: "Türkçe", ko: "한국어" };
export const LOCALE: Record<Lang, string> = { en: "en_US", es: "es_ES", de: "de_DE", fr: "fr_FR", pt: "pt_BR", ja: "ja_JP", it: "it_IT", ru: "ru_RU", ar: "ar_AR", tr: "tr_TR", ko: "ko_KR" };
export const dirOf = (l: Lang) => (l === "ar" ? "rtl" : "ltr");
export const isLang = (s: string): s is Lang => (LANGS as readonly string[]).includes(s);
/** Path with the language prefix: "/finance/x" -> "/es/finance/x" ("/" -> "/es"). English has no prefix. */
export const lp = (lang: Lang, path: string) => (lang === "en" ? path : path === "/" ? `/${lang}` : `/${lang}${path}`);
/** Language from a pathname like /es/finance. */
export const langFromPath = (p: string): Lang => { const s = p.split("/")[1] ?? ""; return isLang(s) ? s : "en"; };
