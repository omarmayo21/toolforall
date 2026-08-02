"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { getToolsByCategory } from "@/lib/tools-data";
import { useI18n } from "@/lib/i18n";

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "";
  const { lang, t } = useI18n();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Translate label safely
  const label = lang === "ar" ? "الفئات" : "Categories";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors ${
          isOpen 
            ? "bg-surface-100 text-text-primary dark:bg-surface-800" 
            : "text-text-secondary hover:bg-surface-100 hover:text-text-primary dark:hover:bg-surface-800"
        }`}
      >
        {label}
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-[340px] origin-top-right rounded-xl border border-border-default/50 bg-bg-default/95 p-2 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 z-50 animate-dropdown"
          role="menu"
        >
          <div className="grid gap-1 max-h-[75vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => {
              const isActive = pathname.startsWith(`/${c.key}`);
              const toolCount = getToolsByCategory(c.key).length;
              
              return (
                <Link
                  key={c.key}
                  href={`/${c.key}`}
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className={`group relative flex items-start gap-3 rounded-lg p-2.5 outline-none transition-colors focus:bg-surface-100 dark:focus:bg-surface-800 ${
                    isActive 
                      ? "bg-primary-500/5 dark:bg-primary-500/10" 
                      : "hover:bg-surface-50 dark:hover:bg-surface-800/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary-500" />
                  )}
                  <div className={`mt-0.5 flex shrink-0 items-center justify-center rounded-md p-1.5 ${isActive ? "text-primary-600 dark:text-primary-400 bg-primary-500/10" : "text-text-secondary bg-surface-100 dark:bg-surface-800 group-hover:text-text-primary"}`}>
                    {c.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${isActive ? "text-primary-700 dark:text-primary-300" : "text-text-primary"}`}>
                      {lang === "ar" ? c.titleAr : c.title}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {c.description}
                    </div>
                  </div>
                  <div className="mt-0.5 flex shrink-0 items-center justify-center min-w-[20px] h-[20px] rounded-full bg-surface-200 dark:bg-surface-700 text-[10px] font-medium text-text-secondary transition-colors">
                    {toolCount}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
