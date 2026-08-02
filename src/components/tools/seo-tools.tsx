"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  CopyButton,
  Field,
  OutputBox,
  Select,
  StatBadge,
  TextArea,
  TextInput,
  ToolCard,
} from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* ---------------- Meta Tag Generator ---------------- */
export function MetaTagGenerator() {
  const [title, setTitle] = useState("ToolForAll — Free Online Tools");
  const [desc, setDesc] = useState("100+ free browser-based tools for developers, marketers and designers.");
  const [keywords, setKeywords] = useState("free tools, online tools, developer tools");
  const [author, setAuthor] = useState("");

  const code = useMemo(
    () =>
      `<title>${title}</title>\n<meta name="description" content="${desc}">\n<meta name="keywords" content="${keywords}">\n${
        author ? `<meta name="author" content="${author}">\n` : ""
      }<meta name="viewport" content="width=device-width, initial-scale=1">`,
    [title, desc, keywords, author]
  );

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Page title" hint={`${title.length} characters (aim for ≤60)`}>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Author (optional)"><TextInput value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Meta description" hint={`${desc.length} characters (aim for ≤160)`}>
          <TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Keywords (comma-separated)"><TextInput value={keywords} onChange={(e) => setKeywords(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><OutputBox value={code} rows={6} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- Robots.txt Generator ---------------- */
interface RobotRule { agent: string; disallow: string; allow: string; }
export function RobotsTxtGenerator() {
  const [rules, setRules] = useState<RobotRule[]>([{ agent: "*", disallow: "/admin/", allow: "" }]);
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");

  const code = useMemo(() => {
    const blocks = rules
      .map((r) => {
        const lines = [`User-agent: ${r.agent}`];
        r.disallow.split("\n").filter(Boolean).forEach((d) => lines.push(`Disallow: ${d.trim()}`));
        r.allow.split("\n").filter(Boolean).forEach((a) => lines.push(`Allow: ${a.trim()}`));
        return lines.join("\n");
      })
      .join("\n\n");
    return `${blocks}${sitemap ? `\n\nSitemap: ${sitemap}` : ""}`;
  }, [rules, sitemap]);

  function update(i: number, key: keyof RobotRule, value: string) {
    setRules((r) => r.map((rule, idx) => (idx === i ? { ...rule, [key]: value } : rule)));
  }

  return (
    <ToolCard>
      {rules.map((rule, i) => (
        <div key={i} className="mb-4 grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-3 dark:border-slate-700">
          <Field label="User-agent"><TextInput value={rule.agent} onChange={(e) => update(i, "agent", e.target.value)} /></Field>
          <Field label="Disallow paths (one per line)"><TextArea rows={2} value={rule.disallow} onChange={(e) => update(i, "disallow", e.target.value)} /></Field>
          <Field label="Allow paths (one per line)"><TextArea rows={2} value={rule.allow} onChange={(e) => update(i, "allow", e.target.value)} /></Field>
        </div>
      ))}
      <div className="mb-4 flex gap-2">
        <Button variant="secondary" onClick={() => setRules((r) => [...r, { agent: "*", disallow: "", allow: "" }])}>+ Add rule block</Button>
        {rules.length > 1 ? <Button variant="ghost" onClick={() => setRules((r) => r.slice(0, -1))}>Remove last</Button> : null}
      </div>
      <Field label="Sitemap URL"><TextInput value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></Field>
      <div className="mt-4"><OutputBox value={code} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- XML Sitemap Generator ---------------- */
export function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const [freq, setFreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");
  const [output, setOutput] = useState("");

  function generate() {
    const today = new Date().toISOString().split("T")[0];
    const list = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const body = list
      .map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
      .join("\n");
    setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
  }

  return (
    <ToolCard>
      <Field label="URLs (one per line)"><TextArea rows={8} value={urls} onChange={(e) => setUrls(e.target.value)} /></Field>
      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <Field label="Change frequency">
          <Select value={freq} onChange={(e) => setFreq(e.target.value)}>
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </Field>
        <Field label="Priority"><TextInput value={priority} onChange={(e) => setPriority(e.target.value)} /></Field>
      </div>
      <Button onClick={generate}>Generate Sitemap</Button>
      {output ? (
        <div className="mt-4">
          <OutputBox value={output} rows={10} />
          <div className="mt-2 flex gap-2"><CopyButton getText={() => output} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Open Graph Tag Generator ---------------- */
export function OgTagGenerator() {
  const [title, setTitle] = useState("ToolForAll — Free Online Tools");
  const [desc, setDesc] = useState("100+ free browser-based tools for developers and marketers.");
  const [url, setUrl] = useState("https://example.com/");
  const [image, setImage] = useState("https://example.com/og-image.jpg");
  const [site, setSite] = useState("ToolForAll");
  const [type, setType] = useState("website");

  const code = `<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${image}">\n<meta property="og:site_name" content="${site}">\n<meta property="og:type" content="${type}">`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Site name"><TextInput value={site} onChange={(e) => setSite(e.target.value)} /></Field>
        <Field label="URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        <Field label="Image URL"><TextInput value={image} onChange={(e) => setImage(e.target.value)} /></Field>
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4"><Field label="Description"><TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field></div>
      <div className="mt-4"><OutputBox value={code} rows={6} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- Twitter Card Generator ---------------- */
export function TwitterCardGenerator() {
  const [card, setCard] = useState("summary_large_image");
  const [title, setTitle] = useState("ToolForAll — Free Online Tools");
  const [desc, setDesc] = useState("100+ free browser-based tools, no sign-up required.");
  const [image, setImage] = useState("https://example.com/card.jpg");
  const [handle, setHandle] = useState("@toolforall");

  const code = `<meta name="twitter:card" content="${card}">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">\n<meta name="twitter:image" content="${image}">\n<meta name="twitter:site" content="${handle}">`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Card type">
          <Select value={card} onChange={(e) => setCard(e.target.value)}>
            <option value="summary_large_image">summary_large_image</option>
            <option value="summary">summary</option>
          </Select>
        </Field>
        <Field label="@Username"><TextInput value={handle} onChange={(e) => setHandle(e.target.value)} /></Field>
        <Field label="Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Image URL"><TextInput value={image} onChange={(e) => setImage(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Field label="Description"><TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field></div>
      <div className="mt-4"><OutputBox value={code} rows={5} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- Schema Markup Generator ---------------- */
export function SchemaMarkupGenerator() {
  const [type, setType] = useState<"faq" | "article">("faq");
  const [faqs, setFaqs] = useState([{ q: "What is ToolForAll?", a: "A free collection of online tools." }]);
  const [headline, setHeadline] = useState("How to use online tools effectively");
  const [author, setAuthor] = useState("ToolForAll Team");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState("https://example.com/article.jpg");

  const code = useMemo(() => {
    if (type === "faq") {
      const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      };
      return JSON.stringify(schema, null, 2);
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      image: [image],
      datePublished: date,
      author: { "@type": "Person", name: author },
    };
    return JSON.stringify(schema, null, 2);
  }, [type, faqs, headline, author, date, image]);

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={type === "faq" ? "primary" : "ghost"} onClick={() => setType("faq")}>FAQPage</Button>
        <Button variant={type === "article" ? "primary" : "ghost"} onClick={() => setType("article")}>Article</Button>
      </div>
      {type === "faq" ? (
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <TextInput placeholder="Question" value={f.q} onChange={(e) => setFaqs((arr) => arr.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x)))} />
              <TextArea rows={2} placeholder="Answer" value={f.a} onChange={(e) => setFaqs((arr) => arr.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)))} />
            </div>
          ))}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setFaqs((f) => [...f, { q: "", a: "" }])}>+ Add Q&A</Button>
            {faqs.length > 1 ? <Button variant="ghost" onClick={() => setFaqs((f) => f.slice(0, -1))}>Remove last</Button> : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Headline"><TextInput value={headline} onChange={(e) => setHeadline(e.target.value)} /></Field>
          <Field label="Author"><TextInput value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
          <Field label="Date published"><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Image URL"><TextInput value={image} onChange={(e) => setImage(e.target.value)} /></Field>
        </div>
      )}
      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${code}\n</script>`} rows={10} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${code}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- Keyword Density Checker ---------------- */
export function KeywordDensityChecker() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const stop = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "is", "it", "for", "on", "with", "as", "are", "this", "that", "be", "by", "at"]);

  const words = useMemo(() => (text.toLowerCase().match(/[a-z0-9']+/g) || []), [text]);
  const total = words.length;

  const freq = useMemo(() => {
    const map = new Map<string, number>();
    words.forEach((w) => {
      if (stop.has(w)) return;
      map.set(w, (map.get(w) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 15);
  }, [words]);

  const targetCount = useMemo(() => {
    if (!target.trim()) return 0;
    const re = new RegExp(target.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    return (text.toLowerCase().match(re) || []).length;
  }, [target, text]);

  return (
    <ToolCard>
      <Field label="Paste your content"><TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <div className="my-4 grid gap-4 sm:grid-cols-3">
        <StatBadge label="Total words" value={total} />
        <Field label="Target keyword (optional)"><TextInput value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
        {target ? <StatBadge label={`"${target}" density`} value={total ? `${((targetCount / total) * 100).toFixed(2)}%` : "0%"} /> : null}
      </div>
      <div className="grid gap-1 text-sm">
        {freq.map(([w, c]) => (
          <div key={w} className="flex items-center justify-between rounded bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
            <span className="font-mono">{w}</span>
            <span>{c} occurrences · {total ? ((c / total) * 100).toFixed(2) : 0}%</span>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- SERP Preview ---------------- */
export function SerpPreview() {
  const [title, setTitle] = useState("ToolForAll — 100+ Free Online Tools");
  const [url, setUrl] = useState("https://toolforall.com");
  const [desc, setDesc] = useState("Free browser-based tools for developers, designers and marketers. No sign-up, no limits, 100% free forever.");

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" hint={`${title.length}/60 characters`}><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><Field label="Description" hint={`${desc.length}/160 characters`}><TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field></div>
      <div className="mt-6 max-w-xl rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <p className="truncate text-sm text-slate-600 dark:text-slate-400">{url}</p>
        <p className="mt-1 truncate text-xl text-blue-700 dark:text-blue-400">{title.slice(0, 70)}</p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">{desc.slice(0, 165)}</p>
      </div>
    </ToolCard>
  );
}

/* ---------------- Redirect Checker ---------------- */
interface Hop { url: string; status: number; statusText: string; }
export function RedirectChecker() {
  const [url, setUrl] = useState("https://example.com");
  const [hops, setHops] = useState<Hop[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    setError("");
    setHops([]);
    try {
      const res = await fetch(`/api/url-check?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      setHops(data.hops || []);
    } catch {
      setError("Could not reach the checking service.");
    }
    setLoading(false);
  }

  return (
    <ToolCard>
      <div className="flex gap-2">
        <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        <Button onClick={check} disabled={loading}>{loading ? "Checking…" : "Check Redirects"}</Button>
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {hops.length > 0 ? (
        <div className="mt-4 space-y-2">
          {hops.map((h, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
              <span className="font-mono">Step {i + 1}: {h.url}</span>
              <span className={`ml-2 font-semibold ${h.status < 300 ? "text-green-600" : h.status < 400 ? "text-amber-600" : "text-red-600"}`}>
                → {h.status} {h.statusText}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Hreflang Generator ---------------- */
interface HreflangRow { lang: string; url: string; }
export function HreflangGenerator() {
  const [rows, setRows] = useState<HreflangRow[]>([
    { lang: "en", url: "https://example.com/" },
    { lang: "ar", url: "https://example.com/ar/" },
  ]);
  const [xdefault, setXdefault] = useState("https://example.com/");

  const code = useMemo(
    () =>
      rows.map((r) => `<link rel="alternate" hreflang="${r.lang}" href="${r.url}" />`).join("\n") +
      (xdefault ? `\n<link rel="alternate" hreflang="x-default" href="${xdefault}" />` : ""),
    [rows, xdefault]
  );

  function update(i: number, key: keyof HreflangRow, v: string) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: v } : row)));
  }

  return (
    <ToolCard>
      {rows.map((r, i) => (
        <div key={i} className="mb-2 grid grid-cols-[100px_1fr] gap-2">
          <TextInput value={r.lang} onChange={(e) => update(i, "lang", e.target.value)} placeholder="en / ar-EG" />
          <TextInput value={r.url} onChange={(e) => update(i, "url", e.target.value)} placeholder="https://..." />
        </div>
      ))}
      <div className="mb-4 flex gap-2">
        <Button variant="secondary" onClick={() => setRows((r) => [...r, { lang: "", url: "" }])}>+ Add language</Button>
        {rows.length > 1 ? <Button variant="ghost" onClick={() => setRows((r) => r.slice(0, -1))}>Remove last</Button> : null}
      </div>
      <Field label="x-default URL"><TextInput value={xdefault} onChange={(e) => setXdefault(e.target.value)} /></Field>
      <div className="mt-4"><OutputBox value={code} rows={6} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- Canonical Tag Generator ---------------- */
export function CanonicalTagGenerator() {
  const [url, setUrl] = useState("https://example.com/shoes/red-sneakers");
  const code = `<link rel="canonical" href="${url}" />`;
  return (
    <ToolCard>
      <Field label="Canonical (preferred) URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      <div className="mt-4"><OutputBox value={code} rows={1} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- Domain Authority Assistant ---------------- */
export function DomainAuthorityAssistant() {
  const [age, setAge] = useState(3);
  const [backlinks, setBacklinks] = useState(50);
  const [pages, setPages] = useState(100);

  const score = useMemo(() => {
    const ageScore = Math.min(age * 4, 25);
    const linkScore = Math.min(Math.log10(backlinks + 1) * 15, 45);
    const pageScore = Math.min(Math.log10(pages + 1) * 10, 30);
    return Math.round(Math.min(ageScore + linkScore + pageScore, 100));
  }, [age, backlinks, pages]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Domain age (years)"><TextInput type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} /></Field>
        <Field label="Referring domains (backlinks)"><TextInput type="number" value={backlinks} onChange={(e) => setBacklinks(Number(e.target.value))} /></Field>
        <Field label="Indexed pages"><TextInput type="number" value={pages} onChange={(e) => setPages(Number(e.target.value))} /></Field>
      </div>
      <div className="mt-6 flex justify-center">
        <StatBadge label="Estimated Authority Score (0-100)" value={score} />
      </div>
      <div className="mt-4"><Alert type="info">This is an independent, transparent estimate — not the same metric as Moz Domain Authority, which relies on proprietary crawl data unavailable outside their paid tools.</Alert></div>
    </ToolCard>
  );
}

/* ---------------- Slug Generator ---------------- */
export function SlugGenerator() {
  const [input, setInput] = useState("10 Best Coffee Shops in Cairo (2024 Guide)!");
  const [removeStop, setRemoveStop] = useState(false);
  const stop = new Set(["a", "an", "the", "of", "in", "on", "and", "or", "to", "for"]);

  const slug = useMemo(() => {
    let words = input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .split(/\s+/);
    if (removeStop) words = words.filter((w) => !stop.has(w));
    return words.filter(Boolean).join("-").replace(/-+/g, "-");
  }, [input, removeStop]);

  return (
    <ToolCard>
      <Field label="Title or phrase"><TextInput value={input} onChange={(e) => setInput(e.target.value)} /></Field>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={removeStop} onChange={(e) => setRemoveStop(e.target.checked)} /> Remove stop words (a, the, of...)
      </label>
      <div className="mt-4"><OutputBox value={slug} rows={1} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => slug} /></div>
    </ToolCard>
  );
}

/* ---------------- Htaccess HTTPS Enforcer ---------------- */
export function HtaccessHttpsEnforcer() {
  const [proxy, setProxy] = useState(false);
  const code = proxy
    ? `RewriteEngine On\nRewriteCond %{HTTP:X-Forwarded-Proto} !https\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`
    : `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`;
  return (
    <ToolCard>
      <label className="mb-4 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={proxy} onChange={(e) => setProxy(e.target.checked)} /> My server is behind a load balancer / proxy
      </label>
      <OutputBox value={code} rows={4} />
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- HTTP Status Checker ---------------- */
export function HttpStatusChecker() {
  const [url, setUrl] = useState("https://example.com");
  const [result, setResult] = useState<{ status: number; statusText: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const explanations: Record<number, string> = {
    200: "OK — the page loaded successfully.",
    301: "Moved Permanently — this URL redirects permanently to a new location.",
    302: "Found — this URL redirects temporarily.",
    404: "Not Found — no page exists at this URL.",
    403: "Forbidden — access to this resource is denied.",
    500: "Internal Server Error — something went wrong on the server.",
    503: "Service Unavailable — the server is temporarily unable to handle the request.",
  };

  async function check() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/url-check?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.error && (!data.hops || !data.hops.length)) setError(data.error);
      else {
        const last = data.hops[data.hops.length - 1];
        setResult(last);
      }
    } catch {
      setError("Could not reach the checking service.");
    }
    setLoading(false);
  }

  return (
    <ToolCard>
      <div className="flex gap-2">
        <TextInput value={url} onChange={(e) => setUrl(e.target.value)} />
        <Button onClick={check} disabled={loading}>{loading ? "Checking…" : "Check Status"}</Button>
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {result ? (
        <div className="mt-4">
          <StatBadge label="Status Code" value={`${result.status} ${result.statusText}`} />
          <div className="mt-3"><Alert type="info">{explanations[result.status] || "Status returned by the server."}</Alert></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

export const seoComponents: ComponentRegistry = {
  MetaTagGenerator,
  RobotsTxtGenerator,
  SitemapGenerator,
  OgTagGenerator,
  TwitterCardGenerator,
  SchemaMarkupGenerator,
  KeywordDensityChecker,
  SerpPreview,
  RedirectChecker,
  HreflangGenerator,
  CanonicalTagGenerator,
  DomainAuthorityAssistant,
  SlugGenerator,
  HtaccessHttpsEnforcer,
  HttpStatusChecker,
};
