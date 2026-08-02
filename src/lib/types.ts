import type { ComponentType } from "react";

export type CategoryKey =
  | "developer-tools"
  | "seo-webmaster-tools"
  | "image-tools"
  | "text-tools"
  | "pdf-tools"
  | "ai-tools"
  | "color-tools"
  | "math-converters"
  | "security-tools";

export interface FAQItem {
  q: string;
  a: string;
}

export interface ToolMeta {
  slug: string;
  title: string;
  shortDescription: string;
  metaDescription: string;
  category: CategoryKey;
  keywords: string[];
  componentKey: string;
  article: string;
  faqs: FAQItem[];
}

export type ComponentRegistry = Record<string, ComponentType>;
