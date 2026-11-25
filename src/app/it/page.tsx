import { LocalizedHome, homeMeta } from "@/lib/i18n/route-pages";
export const generateMetadata = () => homeMeta("it");
export default function Page() { return <LocalizedHome lang="it" />; }
