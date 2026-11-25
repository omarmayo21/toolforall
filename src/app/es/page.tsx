import { LocalizedHome, homeMeta } from "@/lib/i18n/route-pages";
export const generateMetadata = () => homeMeta("es");
export default function Page() { return <LocalizedHome lang="es" />; }
