import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the free tools on ToolForAll.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-text-primary">Terms of Use</h1>
      <div className="mt-6 space-y-4 text-text-secondary leading-relaxed">
        <p>Last updated: November 2026.</p>
        <p>ToolForAll is provided free of charge and as is, without warranties of any kind. Results from calculators, converters and generators are for general information. Check important results (financial, medical, legal) with a qualified professional.</p>
        <p>You are responsible for the content you process and for having the right to use it. Do not use the tools for anything unlawful or to attack other systems.</p>
        <p>We may change, add or remove tools at any time. To the extent the law allows, we are not liable for losses from using the site.</p>
      </div>
    </main>
  );
}
