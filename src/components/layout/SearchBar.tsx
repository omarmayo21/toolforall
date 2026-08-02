"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchTools } from "@/lib/tools-data";
import { useI18n } from "@/lib/i18n";
import { Search } from "lucide-react";

export default function SearchBar({ variant = "header" }: { variant?: "header" | "hero" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const router = useRouter();
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTools(query).slice(0, 8), [query]);

  function goTo(category: string, slug: string) {
    setOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    router.push(`/${category}/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        goTo(results[selectedIndex].category, results[selectedIndex].slug);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setSelectedIndex(-1);
    }
  }

  const isExpanded = open && query.length > 0;

  return (
    <div ref={ref} className={`relative w-full ${variant === "hero" ? "max-w-xl" : "max-w-md mx-auto"}`}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary-500" size={16} />
        <input
          type="search"
          role="combobox"
          aria-expanded={isExpanded}
          aria-controls="search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `search-item-${selectedIndex}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => {
            setOpen(false);
            setSelectedIndex(-1);
          }, 150)}
          onKeyDown={handleKeyDown}
          placeholder={t("searchPlaceholder")}
          className={`w-full rounded-full border border-border-default/50 bg-surface-100 pl-10 pr-12 py-2 text-sm text-text-primary outline-none transition-all focus:border-primary-500/50 focus:bg-surface-default focus:ring-4 focus:ring-primary-500/10 dark:bg-surface-800/50 dark:focus:bg-surface-900 ${
            variant === "hero" ? "py-3 text-base shadow-lg pl-12 pr-14" : ""
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono font-medium text-text-muted/70 bg-bg-default/50 border border-border-default rounded px-1.5 py-0.5">
          ⌘K
        </div>
      </div>
      {isExpanded && (
        <div 
          id="search-listbox"
          role="listbox"
          className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-border-default bg-surface-default/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        >
          {results.length ? (
            results.map((r, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={r.slug}
                  id={`search-item-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={() => goTo(r.category, r.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`block w-full border-b border-border-default/50 px-4 py-3 text-left text-sm last:border-0 transition-colors ${
                    isSelected ? "bg-surface-100 dark:bg-surface-800" : "hover:bg-surface-100 dark:hover:bg-surface-800"
                  }`}
                >
                  <span className={`font-medium ${isSelected ? "text-primary-600 dark:text-primary-400" : "text-text-primary"}`}>{r.title}</span>
                  <span className="block text-xs text-text-muted">{r.shortDescription}</span>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-center text-sm text-text-muted">{t("noResults")}</div>
          )}
        </div>
      )}
    </div>
  );
}
