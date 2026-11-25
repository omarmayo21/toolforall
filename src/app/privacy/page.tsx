import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ToolForAll handles your data, cookies, analytics and advertising.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-text-primary">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
        <p>Last updated: November 2026.</p>
        <h2 className="text-xl font-bold text-text-primary">Your files and text</h2>
        <p>Most tools process your input in your browser. That input is not sent to our servers. Exceptions are tools that need a live lookup: the currency converter (exchange rates), the redirect and HTTP status checkers (the URL you enter is requested by our server), and OCR, which downloads language data from a CDN. Those tool pages say so.</p>
        <h2 className="text-xl font-bold text-text-primary">Analytics</h2>
        <p>We use Google Analytics and Vercel Analytics to count visits and see which pages and tools are used. They may set cookies or collect standard data such as your approximate location, device, browser and the pages you view.</p>
        <h2 className="text-xl font-bold text-text-primary">Advertising</h2>
        <p>We show ads from third-party networks (currently Adsterra). These networks may use cookies and similar technologies to show and measure ads. You can limit this through your browser settings or an ad blocker.</p>
        <h2 className="text-xl font-bold text-text-primary">Preferences</h2>
        <p>Your theme choice is stored in your browser. We do not ask you to create an account and do not sell personal information.</p>
        <h2 className="text-xl font-bold text-text-primary">Contact</h2>
        <p>Questions about this policy: open an issue at <a className="text-primary-600 underline" href="https://github.com/omarmayo21/toolforall/issues" rel="noopener noreferrer">github.com/omarmayo21/toolforall/issues</a>.</p>
      </div>
    </main>
  );
}
