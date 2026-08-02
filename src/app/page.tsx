import Link from "next/link";
import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/categories";
import { getToolsByCategory, ALL_TOOLS } from "@/lib/tools-data";
import SearchBar from "@/components/layout/SearchBar";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — 100+ Free Online Tools for Developers, Designers & Marketers`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-b from-indigo-50 to-white px-4 py-16 text-center dark:from-slate-900 dark:to-slate-950 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          100% Free · No Sign-up · {ALL_TOOLS.length}+ Tools
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
          Every Online Tool You Need, For Free
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          ToolForAll gives developers, designers, marketers and students {ALL_TOOLS.length}+ fast, private, browser-based
          tools — no registration, no limits, no catch.
        </p>
        <div className="mx-auto mt-8 flex justify-center">
          <SearchBar variant="hero" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {CATEGORIES.map((category) => {
          const tools = getToolsByCategory(category.key);
          return (
            <section key={category.key} className="mb-14">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{category.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
                  </div>
                </div>
                <Link href={`/${category.key}`} className="hidden shrink-0 text-sm font-medium text-indigo-600 hover:underline sm:block dark:text-indigo-400">
                  View all →
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.slice(0, 6).map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/${category.key}/${tool.slug}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-sm transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{tool.title}</p>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">{tool.shortDescription}</p>
                  </Link>
                ))}
              </div>
              {tools.length > 6 ? (
                <Link href={`/${category.key}`} className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                  + {tools.length - 6} more {category.title.toLowerCase()} →
                </Link>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
