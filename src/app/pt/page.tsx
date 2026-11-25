import { LocalizedHome, homeMeta } from "@/lib/i18n/route-pages";
export const generateMetadata = () => homeMeta("pt");
export default function Page() { return <LocalizedHome lang="pt" />; }
