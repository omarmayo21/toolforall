"use client";

import { useTheme } from "@/lib/theme-provider";
import { useI18n } from "@/lib/i18n";
import { Sun, Moon, Globe } from "lucide-react";

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
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      aria-label="Toggle language"
      className="flex h-11 md:h-9 items-center gap-1.5 rounded-md px-3 md:px-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-100 hover:text-text-primary dark:hover:bg-surface-800"
    >
      <Globe size={16} />
      <span>{lang === "en" ? "العربية" : "EN"}</span>
    </button>
  );
}
