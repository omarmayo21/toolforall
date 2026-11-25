import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ToolForAll",
  description: "ToolForAll is a free collection of online tools for PDF, images, text, developers, SEO, finance and more.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-text-primary">About ToolForAll</h1>
      <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
        <p>ToolForAll is a free collection of online tools: PDF and image utilities, text and developer tools, calculators, converters, SEO helpers and more. You do not need an account to use them.</p>
        <p>Most tools run entirely in your browser, so the files and text you work with stay on your device. A few tools need a live lookup (for example the currency converter, the redirect and HTTP status checkers, and OCR language data) and say so on their page.</p>
        <p>The site is supported by ads. Tools are free to use, and we aim to keep each page useful on its own, with a short guide, an example and answers to common questions.</p>
        <p>Pages are also available in Spanish, German, French, Portuguese, Japanese, Italian, Russian, Arabic, Turkish and Korean. Those translations are machine-assisted and may contain mistakes.</p>
        <p>Found a bug or want a tool added? Open an issue at <a className="text-primary-600 underline" href="https://github.com/omarmayo21/toolforall/issues" rel="noopener noreferrer">github.com/omarmayo21/toolforall/issues</a>.</p>
      </div>
    </main>
  );
}
