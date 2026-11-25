import { LocalizedTool, toolMeta, toolParams } from "@/lib/i18n/route-pages";
export const dynamicParams = false;
export const generateStaticParams = () => toolParams("ru");
type P = { params: Promise<{ category: string; slug: string }> };
export async function generateMetadata({ params }: P) { const p = await params; return toolMeta("ru", p.category, p.slug); }
export default async function Page({ params }: P) { const p = await params; return <LocalizedTool lang="ru" category={p.category} slug={p.slug} />; }
