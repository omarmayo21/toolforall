import type { CategoryKey } from "./types";

export interface CategoryDef {
  key: CategoryKey;
  title: string;
  titleAr: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "developer-tools",
    title: "Developer Tools",
    titleAr: "أدوات المطورين",
    description: "JSON, encoding, hashing, formatting and other everyday tools for developers.",
    icon: "🛠️",
  },
  {
    key: "seo-webmaster-tools",
    title: "SEO & Webmaster Tools",
    titleAr: "أدوات السيو والمواقع",
    description: "Meta tags, sitemaps, schema markup and other tools to help your site rank.",
    icon: "📈",
  },
  {
    key: "image-tools",
    title: "Image & Graphics Tools",
    titleAr: "أدوات الصور والتصميم",
    description: "Compress, convert, resize and edit images entirely in your browser.",
    icon: "🖼️",
  },
  {
    key: "text-tools",
    title: "Text & Word Tools",
    titleAr: "أدوات النصوص",
    description: "Count, clean, convert and compare text instantly.",
    icon: "📝",
  },
  {
    key: "pdf-tools",
    title: "PDF Tools",
    titleAr: "أدوات PDF",
    description: "Merge, split, compress and convert PDF files without uploading them anywhere unsafe.",
    icon: "📄",
  },
  {
    key: "ai-tools",
    title: "AI Utilities",
    titleAr: "أدوات الذكاء الاصطناعي",
    description: "Prompt builders and content generators to speed up your writing workflow.",
    icon: "🤖",
  },
  {
    key: "color-tools",
    title: "Color & UI Tools",
    titleAr: "أدوات الألوان والتصميم",
    description: "Pick colors, build gradients, shadows and check accessibility contrast.",
    icon: "🎨",
  },
  {
    key: "math-converters",
    title: "Math & Converters",
    titleAr: "الحاسبات والتحويلات",
    description: "Calculators and unit converters for everyday math problems.",
    icon: "🧮",
  },
  {
    key: "security-tools",
    title: "Security & Privacy Tools",
    titleAr: "أدوات الأمان والخصوصية",
    description: "Generate strong passwords and hashes without sending your data anywhere.",
    icon: "🔒",
  },
];

export function getCategory(key: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
