"use client";

import { useTheme } from "@/lib/theme-provider";
import { useI18n } from "@/lib/i18n";
import { Sun, Moon, Globe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, LANG_NAMES, lp, type Lang } from "@/lib/i18n/config";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="grid h-11 w-11 md:h-9 md:w-9 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-100 hover:text-text-primary dark:hover:bg-surface-800"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function LanguageToggle() {
  const { lang } = useI18n();
  const pathname = usePathname() || "/";
  const rest = pathname.split("/").filter(Boolean).slice(lang === "en" ? 0 : 1);
  const target = (l: Lang) => {
    // A tool page may not be translated into every language, so other languages get its category page.
    const segs = l === "en" ? rest : rest.slice(0, 1);
    return lp(l, segs.length ? "/" + segs.join("/") : "/");
  };
  return (
    <div className="relative">
      <details className="group">
        <summary aria-label="Change language" className="flex h-11 md:h-9 cursor-pointer list-none items-center gap-1.5 rounded-md px-3 md:px-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-100 hover:text-text-primary dark:hover:bg-surface-800 [&::-webkit-details-marker]:hidden">
          <Globe size={16} />
          <span>{LANG_NAMES[lang]}</span>
        </summary>
        <ul className="absolute end-0 z-50 mt-1 max-h-80 w-44 overflow-auto rounded-lg border border-border-default bg-bg-default p-1 shadow-lg">
          {LANGS.map((l) => (
            <li key={l}>
              <Link href={target(l)} hrefLang={l} lang={l} prefetch={false} className={`block rounded-md px-3 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-800 ${l === lang ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                {LANG_NAMES[l]}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
