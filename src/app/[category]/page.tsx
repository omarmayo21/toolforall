import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-data";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import JsonLd from "@/components/analytics/JsonLd";
import CategoryTracker from "@/components/analytics/CategoryTracker";
import AdSlot from "@/components/AdSlot";
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
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/${key}` },
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
      <CategoryTracker category={category.key} />
      <JsonLd data={jsonLd} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.title }]} />
      <div className="flex items-center gap-3">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary sm:text-3xl">{category.title}</h1>
          <p className="mt-1 text-text-secondary">{category.description}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-primary-500 dark:text-primary-400">
        {tools.length} free tools · No sign-up required · Runs in your browser
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${category.key}/${tool.slug}`}
            className="group rounded-2xl border border-border-default bg-surface-default p-5 transition hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md"
          >
            <h2 className="font-semibold text-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-text-muted">{tool.shortDescription}</p>
          </Link>
        ))}
      </div>

      <AdSlot slot="hero" />

      <section className="mt-16">
        <h2 className="text-lg font-bold text-text-primary">Other Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.filter((c) => c.key !== category.key).map((c) => (
            <Link
              key={c.key}
              href={`/${c.key}`}
              className="group flex items-center gap-4 rounded-xl border border-border-default bg-surface-default p-4 transition hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md dark:bg-surface-900"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-100 text-text-secondary transition-colors group-hover:bg-primary-50 group-hover:text-primary-600 dark:bg-surface-800 dark:group-hover:bg-primary-500/10 dark:group-hover:text-primary-400">
                {c.icon}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-semibold text-text-primary transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {c.title}
                </h3>
                <p className="mt-0.5 truncate text-sm text-text-muted">
                  {c.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
