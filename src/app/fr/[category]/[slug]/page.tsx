import { LocalizedTool, toolMeta, toolParams } from "@/lib/i18n/route-pages";
export const dynamicParams = false;
export const generateStaticParams = () => toolParams("fr");
type P = { params: Promise<{ category: string; slug: string }> };
export async function generateMetadata({ params }: P) { const p = await params; return toolMeta("fr", p.category, p.slug); }
export default async function Page({ params }: P) { const p = await params; return <LocalizedTool lang="fr" category={p.category} slug={p.slug} />; }
