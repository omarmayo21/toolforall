import type { Lang } from "./config";
import { LOCALIZED, LANG_NAMES } from "./config";
import { SITE_URL } from "../site";
import { ALL_TOOLS } from "../tools-data";
import type { ToolMeta } from "../types";
import es from "./tools/es"; import de from "./tools/de"; import fr from "./tools/fr"; import pt from "./tools/pt"; import ja from "./tools/ja";
import it from "./tools/it"; import ru from "./tools/ru"; import ar from "./tools/ar"; import tr from "./tools/tr"; import ko from "./tools/ko";

/** Server-only. Translated tool copy: [title, short description, meta description, article paragraphs joined by blank line, FAQ pairs]. */
export type TT = [title: string, short: string, meta: string, article: string, faqs: [string, string][]];
const DATA: Record<Exclude<Lang, "en">, Record<string, TT>> = { es, de, fr, pt, ja, it, ru, ar, tr, ko };

export function translatedTool(lang: Lang, base: ToolMeta): ToolMeta | undefined {
  if (lang === "en") return base;
  const t = DATA[lang][base.slug];
  if (!t) return undefined;
  return { ...base, title: t[0], shortDescription: t[1], metaDescription: t[2], article: t[3], faqs: t[4].map(([q, a]) => ({ q, a })) };
}
export const translatedTools = (lang: Exclude<Lang, "en">): ToolMeta[] => ALL_TOOLS.filter((t) => DATA[lang][t.slug]).map((t) => translatedTool(lang, t)!);
export const langsForTool = (slug: string) => LOCALIZED.filter((l) => DATA[l][slug]);

/** hreflang map for the English page of a tool, a category, or the home page. Only languages with a real translation are listed. */
export function hreflangs(path: string, langs: readonly Lang[]): Record<string, string> {
  if (!langs.length) return {};
  const m: Record<string, string> = { en: SITE_URL + (path === "/" ? "" : path), "x-default": SITE_URL + (path === "/" ? "" : path) };
  for (const l of langs) m[l] = `${SITE_URL}/${l}${path === "/" ? "" : path}`;
  return m;
}
export const allLangs = LOCALIZED;
export const langLinks = (slug: string, category: string) => [{ lang: "en" as Lang, name: LANG_NAMES.en, href: `/${category}/${slug}` }, ...langsForTool(slug).map((l) => ({ lang: l as Lang, name: LANG_NAMES[l], href: `/${l}/${category}/${slug}` }))];
