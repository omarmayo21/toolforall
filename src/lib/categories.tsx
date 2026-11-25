import type { CategoryKey } from "./types";
import { Code, LineChart, Image as ImageIcon, FileText, File, Sparkles, Palette, Calculator, Shield } from "lucide-react";
import type { ReactNode } from "react";

export interface CategoryDef {
  key: CategoryKey;
  title: string;
  titleAr: string;
  description: string;
  icon: ReactNode;
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "developer-tools",
    title: "Developer Tools",
    titleAr: "أدوات المطورين",
    description: "JSON, encoding, hashing, formatting and other everyday tools for developers.",
    icon: <Code size="1em" strokeWidth={2.5} />,
  },
  {
    key: "seo-webmaster-tools",
    title: "SEO & Webmaster Tools",
    titleAr: "أدوات السيو والمواقع",
    description: "Meta tags, sitemaps, schema markup and other tools to help your site rank.",
    icon: <LineChart size="1em" strokeWidth={2.5} />,
  },
  {
    key: "image-tools",
    title: "Image & Graphics Tools",
    titleAr: "أدوات الصور والتصميم",
    description: "Compress, convert, resize and edit images entirely in your browser.",
    icon: <ImageIcon size="1em" strokeWidth={2.5} />,
  },
  {
    key: "text-tools",
    title: "Text & Word Tools",
    titleAr: "أدوات النصوص",
    description: "Count, clean, convert and compare text instantly.",
    icon: <FileText size="1em" strokeWidth={2.5} />,
  },
  {
    key: "pdf-tools",
    title: "PDF Tools",
    titleAr: "أدوات PDF",
    description: "Merge, split, compress and convert PDF files without uploading them anywhere unsafe.",
    icon: <File size="1em" strokeWidth={2.5} />,
  },
  {
    key: "ai-tools",
    title: "AI Utilities",
    titleAr: "أدوات الذكاء الاصطناعي",
    description: "Prompt builders and content generators to speed up your writing workflow.",
    icon: <Sparkles size="1em" strokeWidth={2.5} />,
  },
  {
    key: "color-tools",
    title: "Color & UI Tools",
    titleAr: "أدوات الألوان والتصميم",
    description: "Pick colors, build gradients, shadows and check accessibility contrast.",
    icon: <Palette size="1em" strokeWidth={2.5} />,
  },
  {
    key: "math-converters",
    title: "Math & Converters",
    titleAr: "الحاسبات والتحويلات",
    description: "Calculators and unit converters for everyday math problems.",
    icon: <Calculator size="1em" strokeWidth={2.5} />,
  },
  {
    key: "security-tools",
    title: "Security & Privacy Tools",
    titleAr: "أدوات الأمان والخصوصية",
    description: "Generate strong passwords and hashes without sending your data anywhere.",
    icon: <Shield size="1em" strokeWidth={2.5} />,
  },
];

export function getCategory(key: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.key === key);
}
