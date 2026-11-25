import { LocalizedHome, homeMeta } from "@/lib/i18n/route-pages";
export const generateMetadata = () => homeMeta("ko");
export default function Page() { return <LocalizedHome lang="ko" />; }
