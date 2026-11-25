"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

const dict = {
  en: {
    searchPlaceholder: "Search free tools…",
    allCategories: "All Categories",
    home: "Home",
    relatedTools: "Related Tools",
    faq: "Frequently Asked Questions",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    share: "Share",
    clear: "Clear",
    noResults: "No tools found. Try another keyword.",
    freeNoSignup: "100% Free · No Sign-up · Most tools run in your browser",
    viewAll: "View all",
    tagline: "Every tool you need, for free — no account required.",
    footerRights: "All rights reserved.",
    footerTag: "Free online tools. No sign-up needed.",
    tryTool: "Try the tool below — free, instant, no sign-up.",
  },
  ar: {
    searchPlaceholder: "ابحث في الأدوات المجانية…",
    allCategories: "كل الفئات",
    home: "الرئيسية",
    relatedTools: "أدوات ذات صلة",
    faq: "الأسئلة الشائعة",
    copy: "نسخ",
    copied: "تم النسخ!",
    download: "تحميل",
    share: "مشاركة",
    clear: "مسح",
    noResults: "لا توجد أدوات مطابقة. جرّب كلمة أخرى.",
    freeNoSignup: "مجاني 100% · بدون تسجيل · معظم الأدوات تعمل داخل المتصفح",
    viewAll: "عرض الكل",
    tagline: "كل أداة تحتاجها، مجانًا — بدون حساب.",
    footerRights: "جميع الحقوق محفوظة.",
    footerTag: "أدوات مجانية عبر الإنترنت. بدون تسجيل.",
    tryTool: "جرّب الأداة أدناه — مجانية وفورية وبدون تسجيل.",
  },
} as const;

export type DictKey = keyof typeof dict.en;

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: DictKey) => string;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  dir: "ltr",
  t: (key) => dict.en[key],
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("tfa-lang") as Lang | null;
    if (stored) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("tfa-lang", lang);
  }, [lang]);

  const value: I18nContextValue = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: (key) => dict[lang][key],
    setLang: (newLang) => {
      import("@/lib/analytics").then(({ trackEvent }) => {
        trackEvent("language_change", { language: newLang });
      });
      setLangState(newLang);
    },
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
