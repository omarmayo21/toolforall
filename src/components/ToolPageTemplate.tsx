import type { ComponentType } from "react";
import Link from "next/link";
import type { ToolMeta } from "@/lib/types";
import { getCategory } from "@/lib/categories";
import { getRelatedTools } from "@/lib/tools-data";
import { SITE_URL } from "@/lib/site";
import Breadcrumbs from "./layout/Breadcrumbs";

export default function ToolPageTemplate({ tool, Component }: { tool: ToolMeta; Component: ComponentType }) {
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);
  const paragraphs = tool.article.split("\n\n");

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in web browser)",
    url: `${SITE_URL}/${tool.category}/${tool.slug}`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category?.title || tool.category, href: `/${tool.category}` },
          { label: tool.title },
        ]}
      />

      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{tool.title}</h1>
      <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">{tool.shortDescription}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
        100% Free · No Sign-up · Runs in Your Browser
      </p>

      <div className="mt-6">
        <Component />
      </div>

      <article className="prose prose-slate mt-14 max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-indigo-600">
        <h2>About the {tool.title}</h2>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      <section className="mt-14">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-3">
          {tool.faqs.map((f, i) => (
            <details key={i} className="group rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <summary className="cursor-pointer list-none font-semibold text-slate-800 marker:content-none dark:text-slate-100">
                <span className="mr-2 text-indigo-600">Q.</span>
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length ? (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Related Tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.category}/${r.slug}`}
                className="rounded-xl border border-slate-200 p-4 text-sm transition hover:border-indigo-400 hover:shadow-sm dark:border-slate-800"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-100">{r.title}</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{r.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
