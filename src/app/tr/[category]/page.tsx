import { LocalizedCategory, categoryMeta, categoryParams } from "@/lib/i18n/route-pages";
export const dynamicParams = false;
export const generateStaticParams = categoryParams;
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) { return categoryMeta("tr", (await params).category); }
export default async function Page({ params }: { params: Promise<{ category: string }> }) { return <LocalizedCategory lang="tr" category={(await params).category} />; }
