"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import SearchBar from "./SearchBar";
import CategoryDropdown from "./CategoryDropdown";
import { ThemeToggle, LanguageToggle } from "./ThemeLangToggle";
import { LogoIcon } from "./Logo";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";

  return (
    <header className="sticky top-0 z-40 border-b border-border-default/50 bg-bg-default/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 text-lg font-extrabold text-text-primary transition-opacity hover:opacity-80">
          <LogoIcon className="h-8 w-8" />
          <span className="hidden sm:inline-block">ToolForAll</span>
        </Link>

        {/* Categories Dropdown (Desktop) */}
        <div className="hidden shrink-0 md:block ml-2">
          <CategoryDropdown />
        </div>

        {/* Desktop Search (Command Palette Style) */}
        <div className="hidden flex-1 justify-center px-4 md:flex">
          <SearchBar />
        </div>

        {/* Actions (Desktop) */}
        <nav className="ml-auto hidden shrink-0 items-center gap-1 md:flex">
          <ThemeToggle />
          <LanguageToggle />
        </nav>

        {/* Mobile controls */}
        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="grid h-11 w-11 place-items-center rounded-md text-text-secondary transition-colors hover:bg-surface-100 hover:text-text-primary dark:hover:bg-surface-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="flex flex-col gap-4 border-t border-border-default/50 bg-bg-default px-4 py-4 shadow-lg md:hidden animate-dropdown">
          <SearchBar />
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map((c) => {
              const isActive = pathname.startsWith(`/${c.key}`);
              return (
                <Link 
                  key={c.key} 
                  href={`/${c.key}`} 
                  onClick={() => setOpen(false)} 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive 
                      ? "bg-surface-100 font-medium text-text-primary dark:bg-surface-800" 
                      : "text-text-secondary hover:bg-surface-50 hover:text-text-primary dark:hover:bg-surface-800/50"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-100 text-text-primary dark:bg-surface-800">
                    {c.icon}
                  </span>
                  {lang === "ar" ? c.titleAr : c.title}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center justify-center border-t border-border-default/50 pt-4">
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
