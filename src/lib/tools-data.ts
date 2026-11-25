import type { ToolMeta, CategoryKey } from "./types";
import { developerTools } from "./data/developer-tools";
import { seoTools } from "./data/seo-tools";
import { imageTools } from "./data/image-tools";
import { textTools } from "./data/text-tools";
import { pdfTools } from "./data/pdf-tools";
import { aiTools } from "./data/ai-tools";
import { colorTools } from "./data/color-tools";
import { mathTools } from "./data/math-tools";
import { securityTools } from "./data/security-tools";
import { unitTools } from "./generated/units";
import { popularTools } from "./generated/popular";
import { wave1Tools } from "./generated/wave1";

export const ALL_TOOLS: ToolMeta[] = [
  ...developerTools,
  ...seoTools,
  ...imageTools,
  ...textTools,
  ...pdfTools,
  ...aiTools,
  ...colorTools,
  ...mathTools,
  ...securityTools,
  ...unitTools,
  ...popularTools,
  ...wave1Tools,
];

export function getToolsByCategory(category: CategoryKey): ToolMeta[] {
  return ALL_TOOLS.filter((t) => t.category === category);
}

export function getTool(category: string, slug: string): ToolMeta | undefined {
  return ALL_TOOLS.find((t) => t.category === category && t.slug === slug);
}

export function getRelatedTools(tool: ToolMeta, count = 6): ToolMeta[] {
  if (tool.related?.length) {
    const found = tool.related
      .map((slug) => getTool(tool.category, slug))
      .filter((t): t is ToolMeta => !!t);
    if (found.length) return found.slice(0, count);
  }
  return getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, count);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return ALL_TOOLS.map((tool) => {
    const haystack = `${tool.title} ${tool.shortDescription} ${tool.keywords.join(" ")}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (tool.title.toLowerCase().includes(term)) score += 3;
      if (haystack.includes(term)) score += 1;
    }
    return { tool, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map((r) => r.tool);
}
