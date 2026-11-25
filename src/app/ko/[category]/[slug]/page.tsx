import { LocalizedTool, toolMeta, toolParams } from "@/lib/i18n/route-pages";
export const dynamicParams = false;
export const generateStaticParams = () => toolParams("ko");
type P = { params: Promise<{ category: string; slug: string }> };
export async function generateMetadata({ params }: P) { const p = await params; return toolMeta("ko", p.category, p.slug); }
export default async function Page({ params }: P) { const p = await params; return <LocalizedTool lang="ko" category={p.category} slug={p.slug} />; }
