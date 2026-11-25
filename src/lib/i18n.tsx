"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { type Lang, dirOf, langFromPath, lp } from "@/lib/i18n/config";
import { UI, CAT, type UiKey } from "@/lib/i18n/ui";
import type { CategoryDef } from "@/lib/categories";

export type { Lang };
export type DictKey = UiKey;

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: DictKey) => string;
  /** Prefix a site path with the current language ("/finance" -> "/es/finance"). */
  href: (path: string) => string;
  catTitle: (c: CategoryDef) => string;
}

const I18nContext = createContext<I18nContextValue>({ lang: "en", dir: "ltr", t: (k) => UI.en[k], href: (p) => p, catTitle: (c) => c.title });

/** The language comes from the URL (/es/..., /ar/...), so server HTML is already in the right language and direction. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = langFromPath(usePathname() || "/");
  const dir = dirOf(lang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  const value: I18nContextValue = {
    lang, dir,
    t: (key) => UI[lang][key],
    href: (path) => lp(lang, path),
    catTitle: (c) => (lang === "en" ? c.title : CAT[lang][c.key as keyof (typeof CAT)["es"]]?.[0] ?? c.title),
  };
  return (
    <I18nContext.Provider value={value}>
      <div lang={lang} dir={dir} className="contents">{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
