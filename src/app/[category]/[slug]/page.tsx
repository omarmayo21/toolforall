import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_TOOLS, getTool } from "@/lib/tools-data";
import { TOOL_REGISTRY } from "@/components/tools/registry";
import ToolPageTemplate from "@/components/ToolPageTemplate";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return ALL_TOOLS.map((t) => ({ category: t.category, slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) return {};
  const url = `${SITE_URL}/${category}/${slug}`;
  return {
    title: tool.title,
    description: tool.metaDescription,
    keywords: tool.keywords,
    robots: { index: true, follow: true },
    alternates: { canonical: `${SITE_URL}/${category}/${slug}` },
    openGraph: {
      title: `${tool.title} | ${SITE_NAME}`,
      description: tool.metaDescription,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} | ${SITE_NAME}`,
      description: tool.metaDescription,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) notFound();

  const Component = TOOL_REGISTRY[tool.componentKey];
  if (!Component) notFound();

  return <ToolPageTemplate tool={tool} Component={Component} />;
}
