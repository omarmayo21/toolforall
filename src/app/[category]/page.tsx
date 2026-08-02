import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-data";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: key } = await params;
  const category = getCategory(key);
  if (!category) return {};
  const title = `${category.title} — Free Online Tools`;
  return {
    title,
    description: category.description,
    alternates: { canonical: `/${key}` },
    openGraph: { title: `${title} | ${SITE_NAME}`, description: category.description, url: `${SITE_URL}/${key}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: key } = await params;
  const category = getCategory(key);
  if (!category) notFound();
  const tools = getToolsByCategory(category.key);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.title} — ToolForAll`,
    description: category.description,
    url: `${SITE_URL}/${category.key}`,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.title }]} />
      <div className="flex items-center gap-3">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">{category.title}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">{category.description}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
        {tools.length} free tools · No sign-up required · Runs in your browser
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${category.key}/${tool.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{tool.shortDescription}</p>
          </Link>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Other Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.key !== category.key).map((c) => (
            <Link
              key={c.key}
              href={`/${c.key}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:hover:text-indigo-400"
            >
              {c.icon} {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
