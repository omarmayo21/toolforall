import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "../categories";
import { ALL_TOOLS, getTool, getToolsByCategory } from "../tools-data";
import { SITE_NAME, SITE_URL } from "../site";
import { type Lang, LOCALE, lp } from "./config";
import { CAT, UI } from "./ui";
import { hreflangs, langsForTool, translatedTool, translatedTools, allLangs } from "./content";
import { TOOL_REGISTRY } from "@/components/tools/registry";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import UnitPairTool from "@/components/tools/unit-pair-tool";
import PopularTool from "@/components/tools/popular-tools";
import SearchBar from "@/components/layout/SearchBar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/analytics/JsonLd";
import type { CategoryKey } from "../types";

type L = Exclude<Lang, "en">;
const catText = (lang: L, key: CategoryKey) => CAT[lang][key as Exclude<CategoryKey, "unit-converters">] ?? [getCategory(key)?.title ?? key, getCategory(key)?.description ?? ""];

/* ---------- home ---------- */
export function homeMeta(lang: L): Metadata {
  const u = UI[lang], title = `${SITE_NAME} — ${u.heroTitle}`, desc = u.heroDesc.replace("{n}", "700"), url = `${SITE_URL}/${lang}`;
  return { title: { absolute: title }, description: desc, robots: { index: true, follow: true }, alternates: { canonical: url, languages: hreflangs("/", [...allLangs]) }, openGraph: { title, description: desc, url, locale: LOCALE[lang], type: "website", siteName: SITE_NAME } };
}
export function LocalizedHome({ lang }: { lang: L }) {
  const u = UI[lang], n = ALL_TOOLS.length;
  return (
    <div>
      <JsonLd data={[{ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: `${SITE_URL}/${lang}`, inLanguage: lang, description: u.heroDesc.replace("{n}", String(n)) }]} />
      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-16 text-center dark:from-slate-900 dark:to-slate-950 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{u.freeNoSignup}</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">{u.heroTitle}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">{u.heroDesc.replace("{n}", String(n))}</p>
        <div className="mx-auto mt-8 flex justify-center"><SearchBar variant="hero" /></div>
      </section>
      <AdSlot slot="hero" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => { const [title, desc] = catText(lang, c.key); return (
            <Link key={c.key} href={lp(lang, `/${c.key}`)} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">{c.icon}</span>
              <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
            </Link>); })}
        </div>
        <TranslatedList lang={lang} />
      </div>
    </div>
  );
}
function TranslatedList({ lang, category }: { lang: L; category?: CategoryKey }) {
  const list = translatedTools(lang).filter((t) => !category || t.category === category);
  if (!list.length) return null;
  return (
    <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((t) => (
        <Link key={t.slug} href={lp(lang, `/${t.category}/${t.slug}`)} className="rounded-xl border border-slate-200 bg-white p-4 text-sm transition hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold text-slate-800 dark:text-slate-100">{t.title}</p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{t.shortDescription}</p>
        </Link>
      ))}
    </div>
  );
}

/* ---------- category ---------- */
export const categoryParams = () => CATEGORIES.map((c) => ({ category: c.key }));
export function categoryMeta(lang: L, key: string): Metadata {
  const c = getCategory(key); if (!c) return {};
  const [title, desc] = catText(lang, c.key), full = `${title} — ${UI[lang].freeToolsSuffix}`, url = `${SITE_URL}/${lang}/${key}`;
  return { title: full, description: desc, robots: { index: true, follow: true }, alternates: { canonical: url, languages: hreflangs(`/${key}`, [...allLangs]) }, openGraph: { title: `${full} | ${SITE_NAME}`, description: desc, url, locale: LOCALE[lang] } };
}
export function LocalizedCategory({ lang, category }: { lang: L; category: string }) {
  const c = getCategory(category); if (!c) notFound();
  const u = UI[lang], [title, desc] = catText(lang, c.key);
  const done = new Set(translatedTools(lang).filter((t) => t.category === c.key).map((t) => t.slug));
  const rest = getToolsByCategory(c.key).filter((t) => !done.has(t.slug));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: u.home, href: lp(lang, "/") }, { label: title }]} />
      <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">{title}</h1>
      <p className="mt-2 max-w-3xl text-text-secondary">{desc}</p>
      <TranslatedList lang={lang} category={c.key} />
      <AdSlot slot="hero" />
      <h2 className="mt-12 text-xl font-bold text-text-primary">{u.moreEnglish}</h2>
      <p className="mt-1 text-sm text-text-muted">{u.moreEnglishNote}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((t) => <Link key={t.slug} href={`/${t.category}/${t.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 text-sm hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"><p className="font-semibold text-slate-800 dark:text-slate-100">{t.title}</p></Link>)}
      </div>
    </div>
  );
}

/* ---------- tool ---------- */
export const toolParams = (lang: L) => translatedTools(lang).map((t) => ({ category: t.category, slug: t.slug }));
export function toolMeta(lang: L, category: string, slug: string): Metadata {
  const base = getTool(category, slug), t = base && translatedTool(lang, base); if (!t) return {};
  const url = `${SITE_URL}/${lang}/${category}/${slug}`;
  return { title: t.title, description: t.metaDescription, keywords: t.keywords, robots: { index: true, follow: true }, alternates: { canonical: url, languages: hreflangs(`/${category}/${slug}`, langsForTool(slug)) }, openGraph: { title: `${t.title} | ${SITE_NAME}`, description: t.metaDescription, url, type: "website", locale: LOCALE[lang] }, twitter: { card: "summary_large_image", title: `${t.title} | ${SITE_NAME}`, description: t.metaDescription } };
}
export function LocalizedTool({ lang, category, slug }: { lang: L; category: string; slug: string }) {
  const base = getTool(category, slug), tool = base && translatedTool(lang, base); if (!base || !tool) notFound();
  const Component = base.componentKey.startsWith("Pop:") ? () => <PopularTool id={base.componentKey.slice(4)} /> : base.componentKey.startsWith("Unit:") ? () => <UnitPairTool toolKey={base.componentKey} /> : TOOL_REGISTRY[base.componentKey];
  if (!Component) notFound();
  return <ToolPageTemplate tool={tool} Component={Component} lang={lang} />;
}
