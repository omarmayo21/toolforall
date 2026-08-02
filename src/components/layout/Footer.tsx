"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import { LogoIcon } from "./Logo";

export default function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="mt-16 border-t border-border-default bg-bg-default">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-text-primary">
              <LogoIcon className="h-8 w-8" />
              ToolForAll
            </Link>
            <p className="mt-3 text-sm text-text-muted">{t("tagline")}</p>
            <p className="mt-2 text-xs text-text-muted/70">{t("freeNoSignup")}</p>
          </div>
          {CATEGORIES.slice(0, 3).map((c) => (
            <div key={c.key}>
              <h3 className="mb-3 text-sm font-semibold text-text-primary">{lang === "ar" ? c.titleAr : c.title}</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><Link href={`/${c.key}`} className="hover:text-primary-600 dark:hover:text-primary-400">{t("viewAll")}</Link></li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1 border-t border-border-default pt-6 text-xs text-text-muted">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/${c.key}`} className="hover:text-primary-600 dark:hover:text-primary-400">
              {lang === "ar" ? c.titleAr : c.title}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-xs text-text-muted/70">
          © {new Date().getFullYear()} ToolForAll. {t("footerRights")} {t("footerTag")}
        </p>
      </div>
    </footer>
  );
}
