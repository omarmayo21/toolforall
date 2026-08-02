"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">T</span>
              ToolForAll
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{t("tagline")}</p>
            <p className="mt-2 text-xs text-slate-400">{t("freeNoSignup")}</p>
          </div>
          {CATEGORIES.slice(0, 3).map((c) => (
            <div key={c.key}>
              <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{lang === "ar" ? c.titleAr : c.title}</h3>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link href={`/${c.key}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{t("viewAll")}</Link></li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/${c.key}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
              {lang === "ar" ? c.titleAr : c.title}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} ToolForAll. {t("footerRights")} {t("footerTag")}
        </p>
      </div>
    </footer>
  );
}
