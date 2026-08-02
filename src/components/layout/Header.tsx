"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import SearchBar from "./SearchBar";
import { ThemeToggle, LanguageToggle } from "./ThemeLangToggle";

export default function Header() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">T</span>
          ToolForAll
        </Link>

        <button
          className="ml-auto rounded-md border border-slate-300 px-2 py-1 text-sm md:hidden dark:border-slate-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className="order-3 hidden w-full md:order-2 md:block md:w-auto md:flex-1 md:px-4">
          <SearchBar />
        </div>

        <nav className="order-2 ml-auto hidden items-center gap-1 md:order-3 md:flex">
          <ThemeToggle />
          <LanguageToggle />
        </nav>
      </div>

      <div className="hidden border-t border-slate-100 md:block dark:border-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-4 gap-y-1 px-4 py-2 text-sm sm:px-6">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/${c.key}`} className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              {c.icon} {lang === "ar" ? c.titleAr : c.title}
            </Link>
          ))}
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          <SearchBar />
          <nav className="mt-3 flex flex-col gap-2 text-sm">
            {CATEGORIES.map((c) => (
              <Link key={c.key} href={`/${c.key}`} onClick={() => setOpen(false)} className="text-slate-700 dark:text-slate-300">
                {c.icon} {lang === "ar" ? c.titleAr : c.title}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
