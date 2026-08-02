"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchTools } from "@/lib/tools-data";
import { useI18n } from "@/lib/i18n";

export default function SearchBar({ variant = "header" }: { variant?: "header" | "hero" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchTools(query).slice(0, 8), [query]);

  function goTo(category: string, slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/${category}/${slug}`);
  }

  return (
    <div ref={ref} className={`relative w-full ${variant === "hero" ? "max-w-xl" : "max-w-sm"}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t("searchPlaceholder")}
        className={`w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 ${
          variant === "hero" ? "py-3 text-base shadow-lg" : ""
        }`}
      />
      {open && query ? (
        <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {results.length ? (
            results.map((r) => (
              <button
                key={r.slug}
                onMouseDown={() => goTo(r.category, r.slug)}
                className="block w-full border-b border-slate-100 px-4 py-2.5 text-left text-sm last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">{r.title}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{r.shortDescription}</span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-500">{t("noResults")}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
