import { LocalizedHome, homeMeta } from "@/lib/i18n/route-pages";
export const generateMetadata = () => homeMeta("ar");
export default function Page() { return <LocalizedHome lang="ar" />; }
