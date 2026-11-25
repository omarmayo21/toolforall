import type { ComponentType } from "react";
import Link from "next/link";
import type { ToolMeta } from "@/lib/types";
import { type Lang, lp } from "@/lib/i18n/config";
import { UI, CAT } from "@/lib/i18n/ui";
import { langLinks } from "@/lib/i18n/content";
import { getCategory } from "@/lib/categories";
import { getRelatedTools } from "@/lib/tools-data";
import { SITE_URL } from "@/lib/site";
import Breadcrumbs from "./layout/Breadcrumbs";
import AdSlot from "./AdSlot";
import JsonLd from "./analytics/JsonLd";
import ToolTracker from "./analytics/ToolTracker";

export default function ToolPageTemplate({ tool, Component, lang = "en" }: { tool: ToolMeta; Component: ComponentType; lang?: Lang }) {
  const category = getCategory(tool.category);
  const u = UI[lang];
  const catTitle = lang === "en" ? category?.title : CAT[lang][tool.category as keyof (typeof CAT)["es"]]?.[0] ?? category?.title;
  const related = lang === "en" ? getRelatedTools(tool) : [];
  const others = langLinks(tool.slug, tool.category).filter((l) => l.lang !== lang);
  const paragraphs = tool.article.split("\n\n");

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript, HTML5",
    url: `${SITE_URL}${lp(lang, `/${tool.category}/${tool.slug}`)}`,
    inLanguage: lang,
    description: tool.metaDescription,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <JsonLd data={faqSchema.mainEntity.length > 0 ? [webAppSchema, faqSchema] : [webAppSchema]} />
      <ToolTracker toolName={tool.slug} category={tool.category} />

      <Breadcrumbs
        items={[
          { label: u.home, href: lp(lang, "/") },
          { label: catTitle || tool.category, href: lp(lang, `/${tool.category}`) },
          { label: tool.title },
        ]}
      />

      <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">{tool.title}</h1>
      <p className="mt-2 max-w-3xl text-text-secondary">{tool.shortDescription}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-500 dark:text-primary-400">
        {u.freeLine}
      </p>
      {others.length > 0 ? (
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
          <span>{u.availableIn}:</span>
          {others.map((l) => (
            <Link key={l.lang} href={l.href} hrefLang={l.lang} lang={l.lang} className="text-primary-600 hover:underline">{l.name}</Link>
          ))}
        </p>
      ) : null}

      <AdSlot slot="hero" />

      <div className="mt-6">
        <Component />
      </div>

      <AdSlot slot="after-tool" />

      <article className="prose prose-slate mt-14 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary-600">
        <h2>{u.about.replace("{t}", tool.title)}</h2>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <AdSlot slot="after-article" />

      <section className="mt-14">
        <h2 className="text-xl font-bold text-text-primary">{u.faq}</h2>
        <div className="mt-4 space-y-3">
          {tool.faqs.map((f, i) => (
            <details key={i} className="group rounded-xl border border-border-default bg-surface-default p-4">
              <summary className="cursor-pointer list-none font-semibold text-text-primary marker:content-none">
                <span className="mr-2 text-primary-500">Q.</span>
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <AdSlot slot="bottom" />

      {related.length ? (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-text-primary">{u.relatedTools}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.category}/${r.slug}`}
                className="rounded-xl border border-border-default bg-surface-default p-4 text-sm transition hover:border-primary-400 hover:shadow-sm"
              >
                <p className="font-semibold text-text-primary">{r.title}</p>
                <p className="mt-1 text-text-muted">{r.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
