# Developer Guide — ToolForAll

Welcome to the official developer handbook for ToolForAll. This document provides everything you need to understand, maintain, and expand this project.

---

## 1. Project Overview

* **Project Purpose:** A multi-tool hub offering over 100 free online utilities (Developer, SEO, Image, Math, PDF, Text, Security, AI, and Color tools) designed to run entirely in the web browser with complete privacy.
* **Overall Architecture:** A monolithic Next.js repository using the App Router. The project is highly modularized around a `TOOL_REGISTRY` that maps static data (metadata, articles, FAQs) to specific React components.
* **Technology Stack:**
  * Next.js 16.2.6 (App Router, Turbopack)
  * React 19
  * TypeScript
  * Tailwind CSS v4
* **Rendering Strategy:** 
  * **SSG (Static Site Generation):** All 116+ tool pages are pre-rendered at build time into static HTML using `generateStaticParams`.
  * **Server Components:** Used for global layouts, SEO meta tags, and static data routing.
  * **Client Components:** The actual tools run purely in the browser using the `"use client"` directive.

---

## 2. Folder Structure

* `src/app/` — The Next.js App Router backbone. Contains global layouts, API routes, and SEO handlers (`robots.ts`, `sitemap.ts`).
* `src/app/[category]/[slug]/` — The dynamic SSG route that acts as the template for every single tool page.
* `src/app/api/` — Serverless API routes for proxying external requests (e.g., Currency API) and performing SSRF-protected URL checks.
* `src/components/` — Reusable global components (`Header.tsx`, `Footer.tsx`).
* `src/components/tools/` — Contains the actual React logic for every tool, grouped by category (e.g., `developer-tools.tsx`), alongside the central `registry.ts`.
* `src/lib/` — Core utilities, types, and the `categories.ts` definition file.
* `src/lib/data/` — The static "database" of the app. Hardcoded TypeScript files containing metadata, descriptions, articles, and FAQs for every tool.

---

## 3. Project Flow

How a request travels from a URL to a rendered page:
1. A user requests `https://example.com/developer-tools/json-formatter-validator`.
2. Next.js router matches this to `src/app/[category]/[slug]/page.tsx`.
3. The server looks up the `category` and `slug` inside `src/lib/data/`.
4. The server retrieves the `ToolMeta` object (containing the article, FAQs, title, and `componentKey`).
5. The `componentKey` (e.g., `JsonFormatter`) is passed to `src/components/tools/registry.ts`.
6. `registry.ts` dynamically lazy-loads the specific React component chunk (`developer-tools.js`).
7. `ToolPageTemplate.tsx` renders the page framework (Breadcrumbs, H1, FAQs, Schema.org JSON-LD).
8. The React component renders the interactive tool UI inside the framework.

---

## 4. Tool Architecture

* **Where tool components live:** All tool logic lives inside `src/components/tools/`.
* **How the registry works:** `src/components/tools/registry.ts` uses `next/dynamic` to map a string key (like `JsonFormatter`) to a lazy-loaded React component. This prevents Next.js from bundling heavy dependencies (like `pdf-lib`) into unrelated pages.
* **How routing works:** Pages are completely dynamically generated. You never create a folder for a specific tool. You only define data in `src/lib/data/` and Next.js builds the route automatically.
* **How categories are organized:** Categories are defined in `src/lib/categories.ts`.

---

## 5. Adding a New Tool (Step by Step)

1. **Create the component:** Add your React component inside the appropriate category file in `src/components/tools/` (e.g., `text-tools.tsx`). Ensure it uses `"use client"`.
2. **Register it correctly:** Open `src/components/tools/registry.ts` and add your component using `next/dynamic`.
3. **Add metadata:** Open the corresponding data file in `src/lib/data/` (e.g., `text-tools.ts`). Create a new `ToolMeta` object. Define the `slug`, `title`, `shortDescription`, `metaDescription`, and `keywords`.
4. **Link the registry:** Set the `componentKey` in your `ToolMeta` object to match the key you used in `registry.ts`.
5. **Add SEO & FAQ:** Fill out the `faqs` array in the `ToolMeta` object with at least 2 relevant Q&A pairs.
6. **Add the article:** Write a comprehensive markdown-style string (using `\n\n` for paragraphs) in the `article` property.
7. **Add Schema.org markup:** This happens automatically! `ToolPageTemplate.tsx` generates valid `FAQPage` and `SoftwareApplication` JSON-LD based on your `ToolMeta`.
8. **Add related tools:** Define the `relatedTools` array using the slugs of 3-6 similar tools.
9. **Make it searchable:** The tool is automatically indexed by the site's internal search bar because it is exported within the `ALL_TOOLS` array.
10. **Verify SSG generation:** Run `npm run build` and ensure your tool's URL appears in the generated static pages list.
11. **Test functionality:** Run `npm run start` and navigate to your tool to test it.

---

## 6. SEO Guidelines

* **Metadata:** Defined strictly in `src/lib/data/`. Keep titles under 60 characters and descriptions under 160 characters.
* **Canonical & Open Graph / Twitter Cards:** These are handled globally by `layout.tsx` and dynamically overridden in `[category]/[slug]/page.tsx`. You do not need to add them manually to tools.
* **JSON-LD / FAQ Schema:** Managed globally by `ToolPageTemplate.tsx`.
* **Breadcrumb Schema:** Generated automatically by the `Breadcrumbs.tsx` component.
* **Google Policy Compliance:** **Never** add fabricated `aggregateRating`, `review`, or `reviewCount` properties to the `SoftwareApplication` schema. Doing so violates Google's Spammy Structured Data policies.

---

## 7. Best Practices

* **Zero Backend:** Keep tools 100% client-side whenever possible. Avoid adding API routes unless completely necessary (like proxying requests to bypass CORS).
* **UI Consistency:** Always use the predefined UI components from `src/components/tools/ui.tsx` (e.g., `ToolCard`, `TextInput`, `Button`, `OutputBox`) to ensure styling remains consistent across all 100+ tools.
* **Dependency Management:** Before adding a new npm package, check if an existing one can do the job. If you must add a heavy library, ensure the tool component is lazy-loaded in `registry.ts`.

---

## 8. Common Mistakes

* **Breaking SSG:** Using `cookies()`, `headers()`, or `searchParams` in a Server Component without a Suspense boundary will force dynamic rendering and break SSG.
* **Bloating the Registry:** Using static `import { Component } from './file'` inside `registry.ts` instead of `next/dynamic`. This will instantly bloat the First Load JS for every single page.
* **Fabricating SEO:** Adding fake ratings or invisible text to "boost" SEO.

---

## 9. Testing Checklist

Before considering a tool complete, verify:
- [ ] UI looks correct on Mobile and Desktop.
- [ ] Tool logic functions properly (handles edge cases, invalid input).
- [ ] SEO metadata (Title, Description) accurately describes the tool.
- [ ] FAQs are relevant and accurate.
- [ ] The article is at least 3 paragraphs long.
- [ ] The build succeeds (`npm run build`).

---

## 10. Future Expansion

When expanding past 200+ tools, maintaining the massive `src/lib/data/*.ts` files will become difficult. 
**Recommended Process:** Migrate the `ToolMeta` objects (Titles, Descriptions, FAQs, Articles) to a headless CMS like Sanity. The codebase should only retain the React component logic and the URL routing logic. During the SSG build step, Next.js will fetch the content from the CMS to generate the pages.

---

## 11. Final Verification

The following production checks have been successfully executed as of the latest audit:

| Verification Check | Result | Notes |
| --- | --- | --- |
| `npm run build` | **PASS** | Completes in ~12 seconds. All 116 routes pre-rendered successfully. |
| `npm run dev` | **PASS** | Bootstraps Turbopack dev server successfully. |
| `npm run start` | **PASS** | Serves optimized production build correctly on port 3000. |
| Unused Dependencies | **PASS** | `pg` and `drizzle-orm` successfully purged. |
| Environment Variables | **PASS** | None required. The project operates fully standalone. |
| `robots.txt` / `sitemap.xml` | **PASS** | Natively generated by Next.js app router files. |
| Route Integrity | **PASS** | No 404s detected across the 116 generated tool slugs. |
| Console Errors | **PASS** | Clean execution on client-side renders. |
| Hydration Errors | **PASS** | React mounts cleanly over the SSG HTML. |
| TypeScript | **PASS** | Zero type errors during `npm run build`. |
| Build Warnings | **PASS** | Zero linter or Next.js build warnings. |
| Vercel Readiness | **PASS** | 100% compliant with Vercel Edge and SSG requirements. |
