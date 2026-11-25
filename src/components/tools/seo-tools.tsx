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
  const [desc, setDesc] = useState("Free browser-based tools for developers, marketers and designers.");
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
  const [desc, setDesc] = useState("Free browser-based tools for developers and marketers.");
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
  const [desc, setDesc] = useState("Free browser-based tools, no sign-up required.");
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
  const [title, setTitle] = useState("ToolForAll: Free Online Tools");
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


/* ---------------- 1. SEO Analyzer ---------------- */
export function SeoAnalyzer() {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Free Online Developer & SEO Tools — ToolForAll</title>
  <meta name="description" content="Explore over 200 free browser-based tools for developers, designers, and SEO specialists. Fast, secure, and client-side.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="https://toolforall.com">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="ToolForAll Suite">
  <meta property="og:description" content="Free Online Tools">
  <meta property="og:image" content="https://toolforall.com/og.jpg">
</head>
<body>
  <h1>All-in-One Online Web Utilities Hub</h1>
  <h2>Developer & SEO Utilities</h2>
  <img src="/logo.png" alt="ToolForAll Official Logo" width="200" height="50">
  <a href="/tools/json-formatter">JSON Formatter</a>
  <a href="https://google.com" rel="noopener noreferrer" target="_blank">Google Search</a>
</body>
</html>`);

  const analysis = useMemo(() => {
    if (!html.trim()) return null;
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    
    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const desc = descMatch ? descMatch[1].trim() : "";

    // Extract canonical
    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) ||
                       html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
    const canonical = canonMatch ? canonMatch[1].trim() : "";

    // Extract robots
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']robots["']/i);
    const robots = robotsMatch ? robotsMatch[1].trim() : "";

    // Extract viewport
    const viewportMatch = html.match(/<meta[^>]*name=["']viewport["']/i);

    // Extract OG tags
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["']/i);
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["']/i);
    const ogImage = html.match(/<meta[^>]*property=["']og:image["']/i);

    // Headings
    const h1s = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || []);
    const h2s = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []);
    const h3s = (html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || []);

    // Images
    const imgMatches = [...html.matchAll(/<img([^>]*)>/gi)];
    let missingAltCount = 0;
    let emptyAltCount = 0;
    imgMatches.forEach(m => {
      const attrs = m[1];
      if (!attrs.includes("alt=")) {
        missingAltCount++;
      } else if (/alt=["']\s*["']/.test(attrs)) {
        emptyAltCount++;
      }
    });

    // Links
    const linkMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>/gi)];
    let internalLinks = 0;
    let externalLinks = 0;
    linkMatches.forEach(m => {
      const href = m[1];
      if (href.startsWith("http://") || href.startsWith("https://")) {
        externalLinks++;
      } else if (href.startsWith("/") || href.startsWith("#") || !href.includes("://")) {
        internalLinks++;
      }
    });

    // Calculate score
    let score = 0;
    const checks: { label: string; pass: boolean; note: string }[] = [];

    // 1. Title
    if (title.length >= 30 && title.length <= 65) {
      score += 15;
      checks.push({ label: "Title Tag Length", pass: true, note: `Good length (${title.length} chars)` });
    } else if (title.length > 0) {
      score += 8;
      checks.push({ label: "Title Tag Length", pass: false, note: `${title.length} chars (aim for 50-60)` });
    } else {
      checks.push({ label: "Title Tag", pass: false, note: "Missing <title> tag" });
    }

    // 2. Meta Description
    if (desc.length >= 100 && desc.length <= 165) {
      score += 15;
      checks.push({ label: "Meta Description", pass: true, note: `Optimal length (${desc.length} chars)` });
    } else if (desc.length > 0) {
      score += 8;
      checks.push({ label: "Meta Description", pass: false, note: `${desc.length} chars (aim for 120-160)` });
    } else {
      checks.push({ label: "Meta Description", pass: false, note: "Missing meta description" });
    }

    // 3. H1
    if (h1s.length === 1) {
      score += 15;
      checks.push({ label: "H1 Heading", pass: true, note: "Exactly 1 H1 tag found" });
    } else if (h1s.length === 0) {
      checks.push({ label: "H1 Heading", pass: false, note: "No H1 tag detected" });
    } else {
      score += 5;
      checks.push({ label: "H1 Heading", pass: false, note: `Multiple H1 tags detected (${h1s.length})` });
    }

    // 4. Canonical
    if (canonical) {
      score += 10;
      checks.push({ label: "Canonical Link", pass: true, note: `Present: ${canonical}` });
    } else {
      checks.push({ label: "Canonical Link", pass: false, note: "Missing rel=canonical tag" });
    }

    // 5. Viewport
    if (viewportMatch) {
      score += 10;
      checks.push({ label: "Mobile Viewport", pass: true, note: "Responsive viewport meta tag configured" });
    } else {
      checks.push({ label: "Mobile Viewport", pass: false, note: "Missing viewport meta tag" });
    }

    // 6. Open Graph
    if (ogTitle && ogDesc && ogImage) {
      score += 15;
      checks.push({ label: "Open Graph Tags", pass: true, note: "Complete OG metadata found (title, desc, image)" });
    } else if (ogTitle || ogDesc || ogImage) {
      score += 8;
      checks.push({ label: "Open Graph Tags", pass: false, note: "Partial Open Graph metadata" });
    } else {
      checks.push({ label: "Open Graph Tags", pass: false, note: "Missing social Open Graph tags" });
    }

    // 7. Image Alts
    if (imgMatches.length > 0) {
      if (missingAltCount === 0 && emptyAltCount === 0) {
        score += 10;
        checks.push({ label: "Image Alt Attributes", pass: true, note: `All ${imgMatches.length} images have alt tags` });
      } else {
        checks.push({ label: "Image Alt Attributes", pass: false, note: `${missingAltCount + emptyAltCount} of ${imgMatches.length} images missing descriptive alt` });
      }
    } else {
      score += 10;
      checks.push({ label: "Image Alt Attributes", pass: true, note: "No images to audit" });
    }

    // 8. Robots Tag
    if (robots) {
      score += 10;
      checks.push({ label: "Robots Meta Directives", pass: !robots.includes("noindex"), note: `Directives: ${robots}` });
    } else {
      score += 10;
      checks.push({ label: "Robots Meta Tag", pass: true, note: "Default index/follow applied" });
    }

    return {
      title,
      desc,
      canonical,
      robots: robots || "index, follow (default)",
      h1Count: h1s.length,
      h2Count: h2s.length,
      h3Count: h3s.length,
      totalImages: imgMatches.length,
      missingAltCount,
      internalLinks,
      externalLinks,
      score: Math.min(score, 100),
      checks,
    };
  }, [html]);

  return (
    <ToolCard>
      <Field label="Paste Webpage HTML Source Code">
        <TextArea rows={8} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<!DOCTYPE html>..." />
      </Field>
      {analysis && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">SEO Health Score: {analysis.score}/100</div>
              <p className="text-xs text-slate-500">Based on on-page SEO signals and Google best practices</p>
            </div>
            <div className="flex gap-2">
              <StatBadge label="H1 Headings" value={analysis.h1Count} />
              <StatBadge label="Images" value={analysis.totalImages} />
              <StatBadge label="Links" value={analysis.internalLinks + analysis.externalLinks} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {analysis.checks.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${c.pass ? "border-green-200 bg-green-50/50 dark:border-green-950 dark:bg-green-950/20" : "border-amber-200 bg-amber-50/50 dark:border-amber-950 dark:bg-amber-950/20"}`}>
                <span className="text-lg">{c.pass ? "✅" : "⚠️"}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{c.label}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{c.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 p-4 text-xs dark:border-slate-800">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Detailed On-Page Summary:</div>
            <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>• <strong>Title:</strong> {analysis.title || "(Missing)"}</li>
              <li>• <strong>Description:</strong> {analysis.desc || "(Missing)"}</li>
              <li>• <strong>Canonical:</strong> {analysis.canonical || "(None)"}</li>
              <li>• <strong>Headings Hierarchy:</strong> {analysis.h1Count}x H1, {analysis.h2Count}x H2, {analysis.h3Count}x H3</li>
              <li>• <strong>Links:</strong> {analysis.internalLinks} internal, {analysis.externalLinks} external</li>
              <li>• <strong>Image Alt Status:</strong> {analysis.missingAltCount} missing alt tags</li>
            </ul>
          </div>
        </div>
      )}
    </ToolCard>
  );
}



/* ---------------- 2. SEO Title Checker ---------------- */
export function SeoTitleChecker() {
  const [title, setTitle] = useState("Best SEO Tools & Webmaster Utilities (2026 Free Guide)");
  const [keyword, setKeyword] = useState("SEO Tools");
  const [brand, setBrand] = useState("ToolForAll");

  const fullTitle = useMemo(() => {
    if (!brand.trim()) return title;
    return `${title} | ${brand}`;
  }, [title, brand]);

  const length = fullTitle.length;
  const pixelWidth = Math.round(length * 9.5);

  const keywordFound = useMemo(() => {
    if (!keyword.trim()) return true;
    return fullTitle.toLowerCase().includes(keyword.trim().toLowerCase());
  }, [fullTitle, keyword]);

  const keywordAtStart = useMemo(() => {
    if (!keyword.trim()) return true;
    return fullTitle.toLowerCase().indexOf(keyword.trim().toLowerCase()) < 15;
  }, [fullTitle, keyword]);

  const powerWords = ["best", "top", "guide", "free", "review", "complete", "checklist", "2026", "how to", "fast", "easy"];
  const foundPowerWords = powerWords.filter(w => fullTitle.toLowerCase().includes(w));

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="Page Title" hint="Aim for 50-60 characters">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
        </div>
        <Field label="Brand / Site Suffix">
          <TextInput value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. BrandName" />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Target Primary Keyword (optional)">
          <TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. SEO Tools" />
        </Field>
      </div>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Character Count" value={`${length} / 60`} />
        <StatBadge label="Est. Pixel Width" value={`${pixelWidth} / 580px`} />
        <StatBadge label="Keyword Status" value={!keyword ? "N/A" : keywordFound ? (keywordAtStart ? "✅ Early" : "⚠️ Late") : "❌ Missing"} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Google SERP Desktop Preview</div>
        <div className="mt-2 max-w-xl rounded bg-white p-3 shadow-sm dark:bg-slate-950">
          <div className="truncate text-xs text-slate-600 dark:text-slate-400">https://example.com &rsaquo; blog</div>
          <div className="mt-1 truncate text-lg font-medium text-blue-700 hover:underline dark:text-blue-400">
            {fullTitle.length > 60 ? fullTitle.slice(0, 60) + "..." : fullTitle}
          </div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Preview how search engine crawlers and users will see your page title in search listings...
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>{length >= 45 && length <= 60 ? "✅" : length > 60 ? "⚠️" : "ℹ️"}</span>
          <span><strong>Length:</strong> {length <= 60 ? "Within safe display boundaries" : "Title exceeds 60 characters and may be truncated on desktop SERPs"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{foundPowerWords.length > 0 ? "✅" : "ℹ️"}</span>
          <span><strong>Power/Intent Words:</strong> {foundPowerWords.length > 0 ? foundPowerWords.join(", ") : "Consider adding engaging terms like 'Guide', 'Best', '2026' to boost CTR"}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => fullTitle} label="Copy Full Title" />
      </div>
    </ToolCard>
  );
}



/* ---------------- 3. Meta Description Checker ---------------- */
export function MetaDescriptionChecker() {
  const [desc, setDesc] = useState("Discover the top free SEO tools and webmaster utilities to audit headings, validate schemas, optimize metadata, and boost organic search traffic today.");
  const [keyword, setKeyword] = useState("free SEO tools");

  const len = desc.length;
  const kwMatches = useMemo(() => {
    if (!keyword.trim()) return false;
    return desc.toLowerCase().includes(keyword.trim().toLowerCase());
  }, [desc, keyword]);

  const ctaWords = ["discover", "learn", "get", "try", "explore", "boost", "find", "check", "audit", "start", "download", "free"];
  const foundCta = ctaWords.filter(w => desc.toLowerCase().includes(w));

  return (
    <ToolCard>
      <Field label="Meta Description" hint={`${len} characters (ideal: 120-160 for desktop, ~120 for mobile)`}>
        <TextArea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
      </Field>
      <div className="mt-3">
        <Field label="Target Keyword (optional)"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
      </div>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Characters" value={`${len} / 160`} />
        <StatBadge label="Keyword Presence" value={!keyword ? "N/A" : kwMatches ? "✅ Included" : "❌ Missing"} />
        <StatBadge label="Action CTAs" value={foundCta.length > 0 ? `${foundCta.length} CTAs` : "None"} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-semibold text-slate-500">Live Search Result Snippet</div>
        <div className="mt-2 max-w-xl rounded bg-white p-3 shadow-sm dark:bg-slate-950">
          <div className="truncate text-xs text-slate-500">https://example.com</div>
          <div className="text-base font-semibold text-blue-700 dark:text-blue-400">Example Page Title — ToolForAll</div>
          <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
            {desc.length > 160 ? desc.slice(0, 158) + "..." : desc}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => desc} label="Copy Description" />
      </div>
    </ToolCard>
  );
}



/* ---------------- 4. Heading Checker ---------------- */
export function HeadingChecker() {
  const [content, setContent] = useState(`<h1>Ultimate Guide to Technical SEO in 2026</h1>
<p>Intro paragraph here.</p>
<h2>1. Crawlability & Indexing</h2>
<h3>Robots.txt Best Practices</h3>
<h3>XML Sitemap Structure</h3>
<h2>2. On-Page Optimization</h2>
<h3>Title Tags and Descriptions</h3>
<h3>Image SEO and Alt Text</h3>
<h2>3. Structured Data</h2>
<h3>JSON-LD Schemas</h3>`);

  const headings = useMemo(() => {
    const list: { level: number; text: string }[] = [];
    const regex = new RegExp("<(h[1-6])[^>]*>([\\s\\S]*?)<\\/\\1>", "gi");
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1].substring(1), 10);
      const text = match[2].replace(/<[^>]+>/g, "").trim();
      list.push({ level, text });
    }
    return list;
  }, [content]);

  const h1Count = headings.filter(h => h.level === 1).length;
  const outline = headings.map(h => `${"  ".repeat(h.level - 1)}- H${h.level}: ${h.text}`).join("\n");

  return (
    <ToolCard>
      <Field label="Paste HTML or Document Text with Heading Tags (<h1-h6>)">
        <TextArea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Total Headings" value={headings.length} />
        <StatBadge label="H1 Count" value={h1Count} />
        <StatBadge label="Structure Health" value={h1Count === 1 ? "✅ Perfect (1 H1)" : h1Count === 0 ? "❌ Missing H1" : "⚠️ Multiple H1s"} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-semibold text-slate-500">Document Heading Hierarchy</div>
        {headings.length === 0 ? (
          <p className="mt-2 text-xs text-slate-400">No &lt;h1&gt;-&lt;h6&gt; tags detected.</p>
        ) : (
          <div className="mt-3 space-y-1.5 font-mono text-xs">
            {headings.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded bg-white px-2.5 py-1.5 shadow-sm dark:bg-slate-950"
                style={{ marginLeft: `${(h.level - 1) * 16}px` }}
              >
                <span className={`rounded px-1.5 py-0.5 font-bold text-[10px] ${
                  h.level === 1 ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" :
                  h.level === 2 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" :
                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}>
                  H{h.level}
                </span>
                <span className="truncate text-slate-800 dark:text-slate-200">{h.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => outline} label="Copy Outline" />
      </div>
    </ToolCard>
  );
}



/* ---------------- 5. Image SEO Checker ---------------- */
export function ImageSeoChecker() {
  const [html, setHtml] = useState(`<img src="/hero-banner.webp" alt="Developer using ToolForAll workspace on laptop" width="1200" height="630" loading="lazy">
<img src="/icons/star.png" alt="">
<img src="/photo-102.jpg">
<img src="/diagram.svg" alt="SEO Architecture Diagram" width="800" height="400">`);

  const images = useMemo(() => {
    const list: { src: string; alt: string; hasAlt: boolean; width: string; height: string; loading: string; issues: string[] }[] = [];
    const matches = [...html.matchAll(/<img([^>]*)>/gi)];
    matches.forEach(m => {
      const attrs = m[1];
      const src = (attrs.match(/src=["']([^"']*)["']/i) || [])[1] || "unknown";
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
      const hasAlt = attrs.includes("alt=");
      const alt = altMatch ? altMatch[1] : "";
      const width = (attrs.match(/width=["']([^"']*)["']/i) || [])[1] || "";
      const height = (attrs.match(/height=["']([^"']*)["']/i) || [])[1] || "";
      const loading = (attrs.match(/loading=["']([^"']*)["']/i) || [])[1] || "";

      const issues: string[] = [];
      if (!hasAlt) issues.push("Missing alt attribute");
      else if (!alt.trim()) issues.push("Empty alt='' (purely decorative)");
      else if (alt.length < 5) issues.push("Alt text too short/non-descriptive");
      else if (alt.length > 125) issues.push("Alt text overly long (>125 chars)");

      if (!width || !height) issues.push("Missing explicit width/height (causes CLS)");
      if (!loading && !src.includes("hero")) issues.push("Missing loading='lazy'");

      list.push({ src, alt, hasAlt, width, height, loading, issues });
    });
    return list;
  }, [html]);

  return (
    <ToolCard>
      <Field label="Paste HTML with <img> Tags">
        <TextArea rows={5} value={html} onChange={(e) => setHtml(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Total Images" value={images.length} />
        <StatBadge label="Missing Alt" value={images.filter(i => !i.hasAlt || !i.alt.trim()).length} />
        <StatBadge label="Explicit Dimensions" value={images.filter(i => i.width && i.height).length} />
      </div>

      <div className="space-y-2">
        {images.map((img, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-800">
            <div className="flex items-center justify-between font-mono font-medium text-slate-900 dark:text-white">
              <span className="truncate">{img.src}</span>
              <span className={img.issues.length === 0 ? "text-green-600" : "text-amber-600"}>
                {img.issues.length === 0 ? "✅ SEO Ready" : `⚠️ ${img.issues.length} Suggestion(s)`}
              </span>
            </div>
            <div className="mt-1 text-slate-500">
              <strong>Alt Text:</strong> {img.alt ? `"${img.alt}"` : "(None)"} · <strong>Dimensions:</strong> {img.width && img.height ? `${img.width}x${img.height}` : "(Unset)"}
            </div>
            {img.issues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {img.issues.map((iss, j) => (
                  <span key={j} className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {iss}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}



/* ---------------- 6. Internal Link Analyzer ---------------- */
export function InternalLinkAnalyzer() {
  const [domain, setDomain] = useState("toolforall.com");
  const [html, setHtml] = useState(`<a href="/">Home</a>
<a href="/tools/seo-analyzer">SEO Analyzer</a>
<a href="/tools/json-formatter">JSON Tools</a>
<a href="https://toolforall.com/pricing">Pricing</a>
<a href="/contact"></a>
<a href="https://external-blog.com">External Blog</a>`);

  const links = useMemo(() => {
    const list: { href: string; text: string; isInternal: boolean; isEmpty: boolean }[] = [];
    const matches = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    matches.forEach(m => {
      const href = m[1].trim();
      const text = m[2].replace(/<[^>]+>/g, "").trim();
      const isInternal = !href.startsWith("http") || (domain && href.includes(domain)) || href.startsWith("/");
      const isEmpty = !text;
      list.push({ href, text: text || "(Empty Anchor)", isInternal, isEmpty });
    });
    return list;
  }, [html, domain]);

  const internalLinks = links.filter(l => l.isInternal);
  const emptyAnchors = internalLinks.filter(l => l.isEmpty);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your Website Domain">
          <TextInput value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Paste HTML with Anchor Tags">
          <TextArea rows={6} value={html} onChange={(e) => setHtml(e.target.value)} />
        </Field>
      </div>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Internal Links" value={internalLinks.length} />
        <StatBadge label="External Links" value={links.length - internalLinks.length} />
        <StatBadge label="Empty Anchors" value={emptyAnchors.length} />
      </div>

      <div className="space-y-1.5 font-mono text-xs">
        {internalLinks.map((l, i) => (
          <div key={i} className="flex items-center justify-between rounded border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2 truncate">
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">Internal</span>
              <span className="font-sans font-semibold text-slate-800 dark:text-slate-200">"{l.text}"</span>
              <span className="truncate text-slate-500">→ {l.href}</span>
            </div>
            {l.isEmpty && <span className="text-amber-600">⚠️ Empty Anchor</span>}
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 7. External Link Analyzer ---------------- */
export function ExternalLinkAnalyzer() {
  const [domain, setDomain] = useState("toolforall.com");
  const [html, setHtml] = useState(`<a href="https://google.com" target="_blank" rel="noopener noreferrer">Google</a>
<a href="https://partner-network.com/ref" rel="sponsored">Affiliate Partner</a>
<a href="https://user-comment-site.com" rel="ugc">Forum Link</a>
<a href="http://insecure-external.com" target="_blank">Insecure Site</a>`);

  const extLinks = useMemo(() => {
    const list: { href: string; text: string; rel: string; isSecure: boolean; hasNofollow: boolean; hasSponsored: boolean }[] = [];
    const matches = [...html.matchAll(/<a([^>]*)href=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/a>/gi)];
    matches.forEach(m => {
      const allAttrs = m[1] + " " + m[3];
      const href = m[2].trim();
      const text = m[4].replace(/<[^>]+>/g, "").trim();
      const isInternal = !href.startsWith("http") || (domain && href.includes(domain));
      if (!isInternal) {
        const relMatch = allAttrs.match(/rel=["']([^"']*)["']/i);
        const rel = relMatch ? relMatch[1] : "";
        const targetBlank = allAttrs.includes('target="_blank"') || allAttrs.includes("target='_blank'");
        const isSecure = !targetBlank || (rel.includes("noopener") || rel.includes("noreferrer"));
        list.push({
          href,
          text: text || href,
          rel: rel || "(None)",
          isSecure,
          hasNofollow: rel.includes("nofollow"),
          hasSponsored: rel.includes("sponsored") || rel.includes("ugc")
        });
      }
    });
    return list;
  }, [html, domain]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your Domain (to filter out internal)"><TextInput value={domain} onChange={(e) => setDomain(e.target.value)} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Paste Webpage HTML"><TextArea rows={5} value={html} onChange={(e) => setHtml(e.target.value)} /></Field>
      </div>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="External Links" value={extLinks.length} />
        <StatBadge label="Sponsored / UGC" value={extLinks.filter(l => l.hasSponsored).length} />
        <StatBadge label="Target Security" value={extLinks.every(l => l.isSecure) ? "✅ 100% Safe" : "⚠️ Insecure Target"} />
      </div>

      <div className="space-y-2 text-xs">
        {extLinks.map((l, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-center justify-between font-mono">
              <span className="font-semibold text-slate-900 dark:text-white truncate">{l.href}</span>
              <span className="text-slate-500">rel="{l.rel}"</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400">Anchor: "{l.text}"</span>
              {!l.isSecure && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700 dark:bg-red-950 dark:text-red-300">Missing noopener</span>}
              {l.href.startsWith("http://") && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">HTTP Insecure</span>}
            </div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 8. Broken Link Checker ---------------- */
export function BrokenLinkChecker() {
  const [urls, setUrls] = useState("https://toolforall.com\nhttps://example.com\nhttps://invalid-non-existent-domain-xyz987.com");
  const [results, setResults] = useState<{ url: string; status: "pending" | "valid" | "failed"; note: string }[]>([]);

  function checkBatch() {
    const list = urls.split("\n").map(u => u.trim()).filter(Boolean);
    const parsed = list.map(u => {
      let isValidUrl = true;
      try { new URL(u); } catch { isValidUrl = false; }
      return {
        url: u,
        status: isValidUrl ? ("valid" as const) : ("failed" as const),
        note: isValidUrl ? "Valid URL format (Click to verify live destination)" : "Malformed URL syntax"
      };
    });
    setResults(parsed);
  }

  return (
    <ToolCard>
      <Field label="URLs to Audit (one per line)">
        <TextArea rows={6} value={urls} onChange={(e) => setUrls(e.target.value)} />
      </Field>
      <div className="mt-3 flex gap-2">
        <Button onClick={checkBatch}>Audit URL List</Button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="my-2 grid gap-3 sm:grid-cols-2">
            <StatBadge label="Total Links" value={results.length} />
            <StatBadge label="Syntax Valid" value={results.filter(r => r.status === "valid").length} />
          </div>
          <Alert type="info">
            Browsers restrict automated cross-origin header scans (CORS). You can test any external destination instantly in a secure new tab below.
          </Alert>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-800">
                <span className="font-mono text-slate-800 dark:text-slate-200 truncate">{r.url}</span>
                <div className="flex items-center gap-2">
                  <span className={r.status === "valid" ? "text-green-600" : "text-red-600"}>{r.note}</span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="rounded bg-slate-100 px-2 py-1 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
                    Open ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 9. URL SEO Analyzer ---------------- */
export function UrlSeoAnalyzer() {
  const [url, setUrl] = useState("https://toolforall.com/blog/2026/best-seo-tools-guide?ref=newsletter#top");
  const [keyword, setKeyword] = useState("seo tools");

  const analysis = useMemo(() => {
    try {
      const parsed = new URL(url);
      const isHttps = parsed.protocol === "https:";
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const depth = pathParts.length;
      const slug = pathParts[pathParts.length - 1] || "";
      const hasUnderscores = slug.includes("_");
      const isLowercase = slug === slug.toLowerCase();
      const hasParams = parsed.search.length > 0;
      const kwMatch = keyword ? slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, "-")) : true;

      let score = 100;
      const issues: string[] = [];
      if (!isHttps) { score -= 25; issues.push("Insecure protocol: HTTP should redirect to HTTPS"); }
      if (depth > 3) { score -= 15; issues.push(`Deep directory nesting (${depth} levels). Flat URLs rank faster.`); }
      if (hasUnderscores) { score -= 15; issues.push("Underscores detected. Use hyphens (-) instead."); }
      if (!isLowercase) { score -= 10; issues.push("URL contains uppercase letters. Use lowercase only."); }
      if (hasParams) { score -= 10; issues.push("URL contains tracking query parameters (?ref=...). Clean canonical URLs shouldn't have params."); }
      if (!kwMatch) { score -= 15; issues.push(`Target keyword "${keyword}" not found in URL slug.`); }

      return {
        protocol: parsed.protocol,
        host: parsed.host,
        pathname: parsed.pathname,
        slug,
        depth,
        score: Math.max(0, score),
        issues
      };
    } catch {
      return null;
    }
  }, [url, keyword]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="URL to Analyze"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        </div>
        <Field label="Target Keyword (optional)"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
      </div>

      {analysis ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatBadge label="URL SEO Score" value={`${analysis.score} / 100`} />
            <StatBadge label="Folder Depth" value={`${analysis.depth} Levels`} />
            <StatBadge label="Slug Health" value={analysis.issues.length === 0 ? "✅ Clean" : "⚠️ Needs Polish"} />
          </div>

          <div className="rounded-lg border border-slate-200 p-4 text-xs dark:border-slate-800">
            <div className="font-semibold text-slate-900 dark:text-white">URL Breakdown:</div>
            <div className="mt-2 space-y-1 font-mono text-slate-600 dark:text-slate-400">
              <div><strong>Host:</strong> {analysis.host}</div>
              <div><strong>Path:</strong> {analysis.pathname}</div>
              <div><strong>Slug:</strong> {analysis.slug || "/"}</div>
            </div>
            {analysis.issues.length > 0 ? (
              <div className="mt-3 space-y-1 text-amber-600">
                <div className="font-semibold">Optimization Suggestions:</div>
                {analysis.issues.map((iss, i) => <div key={i}>• {iss}</div>)}
              </div>
            ) : (
              <div className="mt-3 text-green-600 font-semibold">✅ Perfect URL structure for search engine crawlability!</div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4"><Alert type="error">Please enter a valid absolute URL (e.g. https://example.com/slug)</Alert></div>
      )}
    </ToolCard>
  );
}

/* ---------------- 10. URL Length Checker ---------------- */
export function UrlLengthChecker() {
  const [urls, setUrls] = useState("https://toolforall.com/tools/seo-webmaster-tools/seo-analyzer\nhttps://toolforall.com/tools/very-long-url-path-that-goes-on-and-on-with-excessive-parameters?session=12345&tracking=campaign_source_google_adwords_2026");

  const items = useMemo(() => {
    const list = urls.split("\n").map(u => u.trim()).filter(Boolean);
    return list.map(u => {
      const chars = u.length;
      const bytes = new TextEncoder().encode(u).length;
      let status = "✅ Optimal (<75)";
      if (chars > 120) status = "⚠️ Long (>120)";
      else if (chars > 75) status = "ℹ️ Moderate (75-120)";
      return { url: u, chars, bytes, status };
    });
  }, [urls]);

  return (
    <ToolCard>
      <Field label="Batch URL List (one per line)">
        <TextArea rows={5} value={urls} onChange={(e) => setUrls(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Total URLs" value={items.length} />
        <StatBadge label="Avg Length" value={items.length ? Math.round(items.reduce((acc, x) => acc + x.chars, 0) / items.length) + " chars" : "0"} />
        <StatBadge label="Max Length" value={items.length ? Math.max(...items.map(x => x.chars)) + " chars" : "0"} />
      </div>

      <div className="space-y-2 text-xs font-mono">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <span className="truncate max-w-md text-slate-800 dark:text-slate-200">{it.url}</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700 dark:text-slate-300">{it.chars} chars ({it.bytes}B)</span>
              <span className={it.chars <= 75 ? "text-green-600" : "text-amber-600"}>{it.status}</span>
            </div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 11. Noindex / Nofollow Checker ---------------- */
export function NoindexNofollowChecker() {
  const [headHtml, setHeadHtml] = useState(`<meta name="robots" content="noindex, follow">
<meta name="googlebot" content="max-snippet:-1, max-image-preview:large">`);

  const directives = useMemo(() => {
    const list: { bot: string; content: string; isNoindex: boolean; isNofollow: boolean; isNosnippet: boolean }[] = [];
    const matches = [...headHtml.matchAll(/<meta[^>]*name=["'](robots|googlebot|bingbot|slurp)["'][^>]*content=["']([^"']*)["']/gi)];
    matches.forEach(m => {
      const bot = m[1].toLowerCase();
      const content = m[2].toLowerCase();
      list.push({
        bot,
        content,
        isNoindex: content.includes("noindex"),
        isNofollow: content.includes("nofollow"),
        isNosnippet: content.includes("nosnippet")
      });
    });
    return list;
  }, [headHtml]);

  const hasCriticalNoindex = directives.some(d => d.isNoindex);

  return (
    <ToolCard>
      <Field label="Paste HTML <head> with Robots Meta Tags">
        <TextArea rows={4} value={headHtml} onChange={(e) => setHeadHtml(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-3 sm:grid-cols-2">
        <StatBadge label="Directives Found" value={directives.length} />
        <StatBadge label="Indexation Status" value={hasCriticalNoindex ? "⚠️ NOINDEX ACTIVE" : "✅ Indexable"} />
      </div>

      {hasCriticalNoindex && (
        <Alert type="error">
          <strong>Warning:</strong> A 'noindex' directive instructs search engines NOT to show this page in organic search results. Ensure this is intentional (e.g. for staging or private pages).
        </Alert>
      )}

      <div className="mt-4 space-y-2 text-xs">
        {directives.map((d, i) => (
          <div key={i} className="rounded border border-slate-200 p-3 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white capitalize">{d.bot} crawler directive:</div>
            <div className="mt-1 font-mono text-slate-600 dark:text-slate-400">content="{d.content}"</div>
            <div className="mt-2 flex gap-2">
              <span className={`rounded px-2 py-0.5 font-semibold ${d.isNoindex ? "bg-red-100 text-red-700 dark:bg-red-950" : "bg-green-100 text-green-700 dark:bg-green-950"}`}>
                {d.isNoindex ? "Blocked (noindex)" : "Indexed"}
              </span>
              <span className={`rounded px-2 py-0.5 font-semibold ${d.isNofollow ? "bg-amber-100 text-amber-700 dark:bg-amber-950" : "bg-green-100 text-green-700 dark:bg-green-950"}`}>
                {d.isNofollow ? "Links Not Followed (nofollow)" : "Followed"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 12. Canonical URL Checker ---------------- */
export function CanonicalUrlChecker() {
  const [currentUrl, setCurrentUrl] = useState("https://toolforall.com/tools/seo-webmaster-tools");
  const [html, setHtml] = useState(`<link rel="canonical" href="https://toolforall.com/tools/seo-webmaster-tools">`);

  const canonicals = useMemo(() => {
    const matches = [...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/gi)];
    return matches.map(m => m[1]);
  }, [html]);

  const status = useMemo(() => {
    if (canonicals.length === 0) return { ok: false, msg: "Missing canonical tag! Adding a canonical link prevents duplicate content issues." };
    if (canonicals.length > 1) return { ok: false, msg: "Multiple canonical tags detected! Google will ignore conflicting canonicals." };
    const canon = canonicals[0];
    if (canon === currentUrl) return { ok: true, msg: "Self-referencing canonical perfectly configured." };
    return { ok: true, msg: `Cross-page canonical pointing to: ${canon}` };
  }, [canonicals, currentUrl]);

  return (
    <ToolCard>
      <Field label="Current Page URL"><TextInput value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} /></Field>
      <div className="mt-3">
        <Field label="Paste HTML <head>"><TextArea rows={3} value={html} onChange={(e) => setHtml(e.target.value)} /></Field>
      </div>

      <div className="my-4">
        <StatBadge label="Canonical Tags Found" value={canonicals.length} />
      </div>

      <Alert type={status.ok ? (canonicals[0] === currentUrl ? "success" : "info") : "error"}>
        {status.msg}
      </Alert>
    </ToolCard>
  );
}

/* ---------------- 13. Robots Meta Tag Checker ---------------- */
export function RobotsMetaChecker() {
  const [index, setIndex] = useState(true);
  const [follow, setFollow] = useState(true);
  const [noarchive, setNoarchive] = useState(false);
  const [nosnippet, setNosnippet] = useState(false);
  const [maxImage, setMaxImage] = useState("large");

  const code = useMemo(() => {
    const parts = [
      index ? "index" : "noindex",
      follow ? "follow" : "nofollow",
    ];
    if (noarchive) parts.push("noarchive");
    if (nosnippet) parts.push("nosnippet");
    if (maxImage !== "none") parts.push(`max-image-preview:${maxImage}`);
    return `<meta name="robots" content="${parts.join(", ")}">`;
  }, [index, follow, noarchive, nosnippet, maxImage]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={index} onChange={(e) => setIndex(e.target.checked)} />
          <strong>Allow Indexing</strong> (index)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={follow} onChange={(e) => setFollow(e.target.checked)} />
          <strong>Follow Links</strong> (follow)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={noarchive} onChange={(e) => setNoarchive(e.target.checked)} />
          Block Cached Copies (noarchive)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={nosnippet} onChange={(e) => setNosnippet(e.target.checked)} />
          Block Text Snippets (nosnippet)
        </label>
      </div>
      <div className="mt-4">
        <Field label="Max Image Preview Size">
          <Select value={maxImage} onChange={(e) => setMaxImage(e.target.value)}>
            <option value="large">large (Recommended for Google Discover)</option>
            <option value="standard">standard</option>
            <option value="none">none</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4"><OutputBox value={code} rows={2} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}



/* ---------------- 14. Keyword Clustering Tool ---------------- */
export function KeywordClustering() {
  const [input, setInput] = useState(`best seo tools
free seo tools
top seo tools
seo audit checklist
technical seo audit
on-page seo checklist
schema markup generator
json-ld schema generator
faq schema generator
free json formatter
json validator online
json to csv converter`);

  const clusters = useMemo(() => {
    const list = input.split("\n").map(k => k.trim()).filter(Boolean);
    const map = new Map<string, string[]>();
    
    // Common stems / themes
    const themes = ["seo", "schema", "json", "audit", "generator", "converter", "tools", "checklist", "free", "formatter"];
    
    list.forEach(kw => {
      const lower = kw.toLowerCase();
      let matchedTheme = "General / Miscellaneous";
      for (const t of themes) {
        if (lower.includes(t)) {
          matchedTheme = t.toUpperCase() + " Group";
          break;
        }
      }
      if (!map.has(matchedTheme)) map.set(matchedTheme, []);
      map.get(matchedTheme)!.push(kw);
    });

    return Array.from(map.entries()).map(([clusterName, items]) => ({ clusterName, items }));
  }, [input]);

  return (
    <ToolCard>
      <Field label="Paste Keywords to Cluster (one per line)">
        <TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>

      <div className="my-4">
        <StatBadge label="Thematic Clusters" value={clusters.length} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {clusters.map((c, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>{c.clusterName}</span>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">{c.items.length} terms</span>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              {c.items.map((it, j) => <li key={j}>• {it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 15. Keyword Intent Classifier ---------------- */
export function KeywordIntentClassifier() {
  const [input, setInput] = useState(`how to optimize title tags
best keyword research tools
buy seo software
toolforall login
what is canonical tag
seo pricing plans
technical seo checklist`);

  const classified = useMemo(() => {
    const list = input.split("\n").map(k => k.trim()).filter(Boolean);
    const infoWords = ["how", "what", "why", "who", "guide", "tutorial", "tips", "checklist", "example"];
    const commWords = ["best", "top", "vs", "review", "comparison", "alternative", "tools", "software"];
    const transWords = ["buy", "pricing", "plans", "discount", "coupon", "hire", "service", "order", "cost"];
    const navWords = ["login", "signin", "portal", "website", "official", "toolforall", "support"];

    return list.map(kw => {
      const lower = kw.toLowerCase();
      let intent: "Informational" | "Commercial" | "Transactional" | "Navigational" = "Informational";
      if (transWords.some(w => lower.includes(w))) intent = "Transactional";
      else if (navWords.some(w => lower.includes(w))) intent = "Navigational";
      else if (commWords.some(w => lower.includes(w))) intent = "Commercial";
      else if (infoWords.some(w => lower.includes(w))) intent = "Informational";

      return { keyword: kw, intent };
    });
  }, [input]);

  const countByIntent = {
    Informational: classified.filter(c => c.intent === "Informational").length,
    Commercial: classified.filter(c => c.intent === "Commercial").length,
    Transactional: classified.filter(c => c.intent === "Transactional").length,
    Navigational: classified.filter(c => c.intent === "Navigational").length,
  };

  return (
    <ToolCard>
      <Field label="Keywords (one per line)">
        <TextArea rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-2 sm:grid-cols-4">
        <StatBadge label="Informational (I)" value={countByIntent.Informational} />
        <StatBadge label="Commercial (C)" value={countByIntent.Commercial} />
        <StatBadge label="Transactional (T)" value={countByIntent.Transactional} />
        <StatBadge label="Navigational (N)" value={countByIntent.Navigational} />
      </div>

      <div className="space-y-1.5 text-xs font-mono">
        {classified.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded border border-slate-200 p-2.5 dark:border-slate-800">
            <span className="text-slate-800 dark:text-slate-200">{c.keyword}</span>
            <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${
              c.intent === "Informational" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
              c.intent === "Commercial" ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" :
              c.intent === "Transactional" ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" :
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}>
              {c.intent}
            </span>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 16. Long-Tail Keyword Generator ---------------- */
export function LongTailKeywordGenerator() {
  const [seed, setSeed] = useState("seo tools");
  const [niche, setNiche] = useState("beginners");

  const longTails = useMemo(() => {
    if (!seed.trim()) return [];
    const s = seed.trim();
    const n = niche.trim();
    const list = [
      `best ${s} for ${n || "small business"}`,
      `free ${s} online without registration`,
      `how to use ${s} step by step`,
      `top 10 ${s} in 2026`,
      `affordable ${s} for ${n || "startups"}`,
      `${s} vs alternatives comparison`,
      `complete ${s} guide for ${n || "marketers"}`,
      `why do you need ${s} for website growth`,
      `open source ${s} tools list`,
      `best practices for ${s} in 2026`,
      `how to choose the right ${s}`,
      `easy to use ${s} for beginners`,
    ];
    return list;
  }, [seed, niche]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Seed Keyword"><TextInput value={seed} onChange={(e) => setSeed(e.target.value)} /></Field>
        <Field label="Target Audience / Niche (optional)"><TextInput value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g. beginners, ecommerce" /></Field>
      </div>

      <div className="my-4">
        <StatBadge label="Generated Long-Tail Queries" value={longTails.length} />
      </div>

      <div className="space-y-1 text-xs font-mono">
        {longTails.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded bg-slate-50 p-2.5 dark:bg-slate-900">
            <span className="text-slate-800 dark:text-slate-200">🔍 {item}</span>
            <CopyButton getText={() => item} label="Copy" />
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 17. Keyword Combination Generator ---------------- */
export function KeywordCombinationGenerator() {
  const [list1, setList1] = useState("best\nfree\ntop");
  const [list2, setList2] = useState("seo tools\nwebmaster tools");
  const [list3, setList3] = useState("for beginners\nin 2026");
  const [matchType, setMatchType] = useState<"broad" | "phrase" | "exact">("broad");

  const combos = useMemo(() => {
    const a = list1.split("\n").map(s => s.trim()).filter(Boolean);
    const b = list2.split("\n").map(s => s.trim()).filter(Boolean);
    const c = list3.split("\n").map(s => s.trim()).filter(Boolean);
    const res: string[] = [];

    const format = (str: string) => {
      if (matchType === "phrase") return `"${str}"`;
      if (matchType === "exact") return `[${str}]`;
      return str;
    };

    a.forEach(x => {
      b.forEach(y => {
        if (c.length === 0) res.push(format(`${x} ${y}`));
        else {
          c.forEach(z => {
            res.push(format(`${x} ${y} ${z}`));
          });
        }
      });
    });
    return res;
  }, [list1, list2, list3, matchType]);

  const output = combos.join("\n");

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Prefixes (List 1)"><TextArea rows={4} value={list1} onChange={(e) => setList1(e.target.value)} /></Field>
        <Field label="Core Keywords (List 2)"><TextArea rows={4} value={list2} onChange={(e) => setList2(e.target.value)} /></Field>
        <Field label="Suffixes (List 3)"><TextArea rows={4} value={list3} onChange={(e) => setList3(e.target.value)} /></Field>
      </div>

      <div className="my-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant={matchType === "broad" ? "primary" : "ghost"} onClick={() => setMatchType("broad")}>Broad</Button>
          <Button variant={matchType === "phrase" ? "primary" : "ghost"} onClick={() => setMatchType("phrase")}>"Phrase"</Button>
          <Button variant={matchType === "exact" ? "primary" : "ghost"} onClick={() => setMatchType("exact")}>[Exact]</Button>
        </div>
        <StatBadge label="Total Combinations" value={combos.length} />
      </div>

      <OutputBox value={output} rows={6} />
      <div className="mt-2 flex gap-2">
        <CopyButton getText={() => output} label="Copy All Combinations" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 18. Keyword Question Generator ---------------- */
export function KeywordQuestionGenerator() {
  const [topic, setTopic] = useState("canonical tag");

  const questions = useMemo(() => {
    if (!topic.trim()) return [];
    const t = topic.trim();
    return [
      `What is a ${t} and why is it important?`,
      `How do you implement a ${t} in HTML?`,
      `Why does Google ignore a ${t} sometimes?`,
      `When should you use a ${t} vs a 301 redirect?`,
      `Where do you place the ${t} in webpage code?`,
      `Who needs a ${t} on their website?`,
      `Can a ${t} point to a different domain?`,
      `Is a self-referencing ${t} necessary for SEO?`,
      `What happens if you have duplicate ${t} tags?`,
      `How to audit ${t} tags across an entire site?`,
    ];
  }, [topic]);

  const text = questions.join("\n");

  return (
    <ToolCard>
      <Field label="Seed Topic or Keyword">
        <TextInput value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. schema markup, backlinks" />
      </Field>

      <div className="my-4">
        <StatBadge label="Generated Search Questions" value={questions.length} />
      </div>

      <div className="space-y-1.5 text-xs font-mono">
        {questions.map((q, i) => (
          <div key={i} className="flex items-center justify-between rounded border border-slate-200 p-2.5 dark:border-slate-800">
            <span className="text-slate-800 dark:text-slate-200">❓ {q}</span>
            <CopyButton getText={() => q} label="Copy" />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => text} label="Copy All Questions" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 19. Keyword List Cleaner ---------------- */
export function KeywordListCleaner() {
  const [input, setInput] = useState(`Best SEO Tools
best seo tools
  1. Free SEO Tools!  
top seo tools 2026
best seo tools`);
  const [lowercase, setLowercase] = useState(true);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [removePunct, setRemovePunct] = useState(true);

  const cleaned = useMemo(() => {
    let list = input.split("\n").map(k => k.trim()).filter(Boolean);
    if (lowercase) list = list.map(k => k.toLowerCase());
    if (removeNumbers) list = list.map(k => k.replace(/[0-9]/g, "").trim());
    if (removePunct) list = list.map(k => k.replace(/[^a-zA-Z0-9\s]/g, "").trim());
    // Deduplicate
    const unique = Array.from(new Set(list.filter(Boolean)));
    return unique.sort();
  }, [input, lowercase, removeNumbers, removePunct]);

  const output = cleaned.join("\n");

  return (
    <ToolCard>
      <Field label="Raw Keyword List">
        <TextArea rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>

      <div className="my-3 flex flex-wrap gap-4 text-xs">
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /> Lowercase all</label>
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={removePunct} onChange={(e) => setRemovePunct(e.target.checked)} /> Strip punctuation</label>
        <label className="flex items-center gap-1.5"><input type="checkbox" checked={removeNumbers} onChange={(e) => setRemoveNumbers(e.target.checked)} /> Strip numbers</label>
      </div>

      <div className="my-4">
        <StatBadge label="Cleaned & Deduplicated Count" value={cleaned.length} />
      </div>

      <OutputBox value={output} rows={5} />
      <div className="mt-2 flex gap-2">
        <CopyButton getText={() => output} label="Copy Cleaned List" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 20. Google Search Operators Generator ---------------- */
export function GoogleSearchOperators() {
  const [site, setSite] = useState("toolforall.com");
  const [keyword, setKeyword] = useState("seo tools");
  const [filetype, setFiletype] = useState("");
  const [operator, setOperator] = useState("site");

  const query = useMemo(() => {
    let q = "";
    if (site.trim()) q += `site:${site.trim()} `;
    if (operator === "intitle" && keyword) q += `intitle:"${keyword}" `;
    else if (operator === "inurl" && keyword) q += `inurl:"${keyword}" `;
    else if (keyword) q += `"${keyword}" `;
    if (filetype) q += `filetype:${filetype} `;
    return q.trim();
  }, [site, keyword, filetype, operator]);

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Domain (site:)"><TextInput value={site} onChange={(e) => setSite(e.target.value)} /></Field>
        <Field label="Search Operator">
          <Select value={operator} onChange={(e) => setOperator(e.target.value)}>
            <option value="site">site: + Keyword</option>
            <option value="intitle">intitle: (In page title)</option>
            <option value="inurl">inurl: (In URL path)</option>
          </Select>
        </Field>
        <Field label="Filetype (optional)">
          <Select value={filetype} onChange={(e) => setFiletype(e.target.value)}>
            <option value="">Any file</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="doc">Word (.doc)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </Select>
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Keywords / Phrase"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-xs font-semibold text-slate-500">Constructed Search Query:</div>
        <div className="mt-1 font-mono text-sm font-bold text-blue-700 dark:text-blue-400">{query || "(Empty Query)"}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => query} label="Copy Query" />
        <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Search Google ↗
        </a>
      </div>
    </ToolCard>
  );
}

/* ---------------- 21. Keyword Permutation Generator ---------------- */
export function KeywordPermutationGenerator() {
  const [words, setWords] = useState("seo\ntools\nfree");

  const permutations = useMemo(() => {
    const list = words.split("\n").map(w => w.trim()).filter(Boolean);
    if (list.length === 0 || list.length > 5) return [];

    function permute(arr: string[]): string[][] {
      if (arr.length === 0) return [[]];
      const result: string[][] = [];
      for (let i = 0; i < arr.length; i++) {
        const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const sub = permute(rest);
        for (const s of sub) {
          result.push([arr[i], ...s]);
        }
      }
      return result;
    }

    return permute(list).map(p => p.join(" "));
  }, [words]);

  const output = permutations.join("\n");

  return (
    <ToolCard>
      <Field label="Keywords to Permute (up to 5 terms)">
        <TextArea rows={4} value={words} onChange={(e) => setWords(e.target.value)} />
      </Field>

      <div className="my-4">
        <StatBadge label="Total Permutations" value={permutations.length} />
      </div>

      <OutputBox value={output} rows={6} />
      <div className="mt-2 flex gap-2">
        <CopyButton getText={() => output} label="Copy Permutations" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 22. Keyword Map Generator ---------------- */
interface MapItem { url: string; primary: string; secondary: string; intent: string; }
export function KeywordMapGenerator() {
  const [items, setItems] = useState<MapItem[]>([
    { url: "/tools/seo-analyzer", primary: "seo analyzer", secondary: "seo audit, page checker", intent: "Commercial" },
    { url: "/tools/json-formatter", primary: "json formatter", secondary: "json beautifier, json validator", intent: "Transactional" },
  ]);

  function update(i: number, key: keyof MapItem, val: string) {
    setItems(items.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  // Detect duplicate primary keywords
  const primaryKws = items.map(it => it.primary.toLowerCase().trim()).filter(Boolean);
  const duplicates = primaryKws.filter((item, index) => primaryKws.indexOf(item) !== index);

  return (
    <ToolCard>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">SEO Content Keyword Map</div>
        <Button variant="secondary" onClick={() => setItems([...items, { url: "", primary: "", secondary: "", intent: "Informational" }])}>
          + Add Target Page
        </Button>
      </div>

      {duplicates.length > 0 && (
        <div className="mb-4">
          <Alert type="error">
            <strong>Cannibalization Alert:</strong> Multiple pages target the exact same primary keyword ("{duplicates[0]}"). Consolidate or differentiate targets.
          </Alert>
        </div>
      )}

      <div className="space-y-3">
        {items.map((row, i) => (
          <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-4 dark:border-slate-800">
            <Field label="Page URL"><TextInput value={row.url} onChange={(e) => update(i, "url", e.target.value)} placeholder="/page-path" /></Field>
            <Field label="Primary Keyword"><TextInput value={row.primary} onChange={(e) => update(i, "primary", e.target.value)} /></Field>
            <Field label="Secondary Keywords"><TextInput value={row.secondary} onChange={(e) => update(i, "secondary", e.target.value)} /></Field>
            <Field label="Search Intent">
              <Select value={row.intent} onChange={(e) => update(i, "intent", e.target.value)}>
                <option value="Informational">Informational</option>
                <option value="Commercial">Commercial</option>
                <option value="Transactional">Transactional</option>
                <option value="Navigational">Navigational</option>
              </Select>
            </Field>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}



/* ---------------- 23. FAQ Schema Validator ---------------- */
export function FaqSchemaValidator() {
  const [json, setJson] = useState(`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are the tools completely free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the tools are free to use, with no subscription or sign-up required."
      }
    }
  ]
}`);

  const result = useMemo(() => {
    try {
      const obj = JSON.parse(json);
      const isFaq = obj["@type"] === "FAQPage";
      const hasEntities = Array.isArray(obj.mainEntity) && obj.mainEntity.length > 0;
      const validQuestions = hasEntities && obj.mainEntity.every((q: any) => q["@type"] === "Question" && q.name && q.acceptedAnswer?.text);
      return {
        validJson: true,
        isFaq,
        count: hasEntities ? obj.mainEntity.length : 0,
        validStructure: isFaq && validQuestions,
        questions: hasEntities ? obj.mainEntity : []
      };
    } catch (e: any) {
      return { validJson: false, error: e.message, count: 0, validStructure: false, questions: [] };
    }
  }, [json]);

  return (
    <ToolCard>
      <Field label="Paste FAQ JSON-LD Code">
        <TextArea rows={6} value={json} onChange={(e) => setJson(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-3 sm:grid-cols-2">
        <StatBadge label="JSON Syntax" value={result.validJson ? "✅ Valid JSON" : "❌ Invalid Syntax"} />
        <StatBadge label="FAQ Schema Health" value={result.validStructure ? `✅ Valid (${result.count} FAQs)` : "⚠️ Schema Issues"} />
      </div>

      {result.validStructure && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-semibold text-slate-500">Google Rich Result Accordion Preview:</div>
          <div className="mt-2 space-y-2">
            {result.questions.map((q: any, i: number) => (
              <div key={i} className="rounded border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="font-semibold text-blue-700 dark:text-blue-400">Q: {q.name}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">A: {q.acceptedAnswer?.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 24. Article Schema Generator ---------------- */
export function ArticleSchemaGenerator() {
  const [headline, setHeadline] = useState("Complete SEO Guide for Modern Web Apps");
  const [desc, setDesc] = useState("Master on-page SEO, heading structure, and schema markup.");
  const [author, setAuthor] = useState("ToolForAll Team");
  const [pubDate, setPubDate] = useState("2026-09-01");
  const [image, setImage] = useState("https://toolforall.com/article.jpg");

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": headline,
      "description": desc,
      "image": [image],
      "datePublished": pubDate,
      "dateModified": pubDate,
      "author": {
        "@type": "Person",
        "name": author
      }
    }, null, 2);
  }, [headline, desc, author, pubDate, image]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Article Headline"><TextInput value={headline} onChange={(e) => setHeadline(e.target.value)} /></Field>
        <Field label="Author Name"><TextInput value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
        <Field label="Date Published"><TextInput type="date" value={pubDate} onChange={(e) => setPubDate(e.target.value)} /></Field>
        <Field label="Hero Image URL"><TextInput value={image} onChange={(e) => setImage(e.target.value)} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Article Description"><TextArea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 25. Product Schema Generator ---------------- */
export function ProductSchemaGenerator() {
  const [name, setName] = useState("Wireless Noise-Canceling Headphones");
  const [desc, setDesc] = useState("Premium high-fidelity audio with active noise cancellation.");
  const [price, setPrice] = useState("199.99");
  const [currency, setCurrency] = useState("USD");
  const [sku, setSku] = useState("TECH-HP-001");
  const [brand, setBrand] = useState("AudioPro");
  const [availability, setAvailability] = useState("https://schema.org/InStock");

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": name,
      "description": desc,
      "sku": sku,
      "brand": {
        "@type": "Brand",
        "name": brand
      },
      "offers": {
        "@type": "Offer",
        "url": "https://example.com/product",
        "priceCurrency": currency,
        "price": price,
        "availability": availability,
        "itemCondition": "https://schema.org/NewCondition"
      }
    }, null, 2);
  }, [name, desc, price, currency, sku, brand, availability]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Product Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Brand"><TextInput value={brand} onChange={(e) => setBrand(e.target.value)} /></Field>
        <Field label="SKU"><TextInput value={sku} onChange={(e) => setSku(e.target.value)} /></Field>
        <Field label="Price"><TextInput type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Currency">
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EGP">EGP</option>
            <option value="SAR">SAR</option>
          </Select>
        </Field>
        <Field label="Availability">
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="https://schema.org/InStock">In Stock</option>
            <option value="https://schema.org/OutOfStock">Out of Stock</option>
            <option value="https://schema.org/PreOrder">Pre-Order</option>
          </Select>
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Description"><TextArea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 26. Breadcrumb Schema Generator ---------------- */
interface BreadcrumbItem { name: string; url: string; }
export function BreadcrumbSchemaGenerator() {
  const [items, setItems] = useState<BreadcrumbItem[]>([
    { name: "Home", url: "https://toolforall.com" },
    { name: "SEO Tools", url: "https://toolforall.com/seo-webmaster-tools" },
    { name: "SEO Analyzer", url: "https://toolforall.com/seo-webmaster-tools/seo-analyzer" },
  ]);

  function update(i: number, key: keyof BreadcrumbItem, val: string) {
    setItems(items.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((it, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": it.name,
        "item": it.url
      }))
    }, null, 2);
  }, [items]);

  return (
    <ToolCard>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">Breadcrumb Navigation Trail</div>
        <Button variant="secondary" onClick={() => setItems([...items, { name: "", url: "" }])}>+ Add Step</Button>
      </div>

      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-500">#{i + 1}</span>
            <TextInput value={it.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Title" />
            <TextInput value={it.url} onChange={(e) => update(i, "url", e.target.value)} placeholder="https://..." />
            {items.length > 1 && (
              <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 text-xs px-2">✕</button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={7} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 27. Local Business Schema Generator ---------------- */
export function LocalBusinessSchemaGenerator() {
  const [name, setName] = useState("Cairo Tech Solutions");
  const [type, setType] = useState("LocalBusiness");
  const [street, setStreet] = useState("123 Tahrir Square");
  const [city, setCity] = useState("Cairo");
  const [country, setCountry] = useState("EG");
  const [phone, setPhone] = useState("+20 100 000 0000");

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      "name": name,
      "telephone": phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": street,
        "addressLocality": city,
        "addressCountry": country
      }
    }, null, 2);
  }, [name, type, street, city, country, phone]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Business Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Business Type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="LocalBusiness">LocalBusiness</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Store">Store</option>
            <option value="Dentist">Dentist</option>
            <option value="LegalService">LegalService</option>
          </Select>
        </Field>
        <Field label="Phone"><TextInput value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="Street Address"><TextInput value={street} onChange={(e) => setStreet(e.target.value)} /></Field>
        <Field label="City"><TextInput value={city} onChange={(e) => setCity(e.target.value)} /></Field>
        <Field label="Country Code"><TextInput value={country} onChange={(e) => setCountry(e.target.value)} /></Field>
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 28. Organization Schema Generator ---------------- */
export function OrganizationSchemaGenerator() {
  const [name, setName] = useState("ToolForAll");
  const [url, setUrl] = useState("https://toolforall.com");
  const [logo, setLogo] = useState("https://toolforall.com/logo.png");
  const [socials, setSocials] = useState("https://twitter.com/toolforall\nhttps://github.com/toolforall");

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": name,
      "url": url,
      "logo": logo,
      "sameAs": socials.split("\n").map(s => s.trim()).filter(Boolean)
    }, null, 2);
  }, [name, url, logo, socials]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Organization Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Website URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        <Field label="Logo URL"><TextInput value={logo} onChange={(e) => setLogo(e.target.value)} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Social Profile URLs (one per line)"><TextArea rows={3} value={socials} onChange={(e) => setSocials(e.target.value)} /></Field>
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 29. WebSite Schema Generator ---------------- */
export function WebSiteSchemaGenerator() {
  const [name, setName] = useState("ToolForAll");
  const [url, setUrl] = useState("https://toolforall.com");
  const [searchUrl, setSearchUrl] = useState("https://toolforall.com/search?q={search_term_string}");

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": name,
      "url": url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": searchUrl
        },
        "query-input": "required name=search_term_string"
      }
    }, null, 2);
  }, [name, url, searchUrl]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Website Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Website URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Sitelinks Searchbox URL Template (with {search_term_string})">
          <TextInput value={searchUrl} onChange={(e) => setSearchUrl(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 30. Event Schema Generator ---------------- */
export function EventSchemaGenerator() {
  const [name, setName] = useState("Global Web & SEO Summit 2026");
  const [startDate, setStartDate] = useState("2026-11-15T09:00");
  const [endDate, setEndDate] = useState("2026-11-15T18:00");
  const [mode, setMode] = useState("https://schema.org/OnlineEventAttendanceMode");
  const [locationName, setLocationName] = useState("Virtual Stream");

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": name,
      "startDate": startDate,
      "endDate": endDate,
      "eventAttendanceMode": mode,
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "VirtualLocation",
        "name": locationName,
        "url": "https://example.com/stream"
      }
    }, null, 2);
  }, [name, startDate, endDate, mode, locationName]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Event Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Platform / Venue Name"><TextInput value={locationName} onChange={(e) => setLocationName(e.target.value)} /></Field>
        <Field label="Start Time"><TextInput type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Field>
        <Field label="End Time"><TextInput type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></Field>
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}



/* ---------------- 31. HowTo Schema Generator ---------------- */
export function HowToSchemaGenerator() {
  const [name, setName] = useState("How to Validate JSON-LD Schema");
  const [desc, setDesc] = useState("Step-by-step instructions for testing structured data for rich search results.");
  const [totalTime, setTotalTime] = useState("PT10M");
  const [steps, setSteps] = useState([
    { name: "Generate Markup", text: "Use ToolForAll Schema Markup Generator to build your JSON-LD code." },
    { name: "Paste Script in Head", text: "Add the script block inside your webpage <head> section." },
    { name: "Test in Rich Results Tool", text: "Run Google Rich Results Test to confirm syntax and eligibility." }
  ]);

  function updateStep(i: number, key: "name" | "text", val: string) {
    setSteps(steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }

  const schema = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": name,
      "description": desc,
      "totalTime": totalTime,
      "step": steps.map((s, idx) => ({
        "@type": "HowToStep",
        "position": idx + 1,
        "name": s.name,
        "text": s.text
      }))
    }, null, 2);
  }, [name, desc, totalTime, steps]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="How-To Title"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Total Time (ISO 8601 e.g. PT15M)"><TextInput value={totalTime} onChange={(e) => setTotalTime(e.target.value)} /></Field>
      </div>
      <div className="mt-3">
        <Field label="Description"><TextArea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      </div>

      <div className="my-4 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">Tutorial Steps</div>
        <Button variant="secondary" onClick={() => setSteps([...steps, { name: "", text: "" }])}>+ Add Step</Button>
      </div>

      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="font-bold text-xs text-slate-500 mb-1">Step {i + 1}</div>
            <TextInput value={s.name} onChange={(e) => updateStep(i, "name", e.target.value)} placeholder="Step Title" className="mb-2" />
            <TextArea rows={2} value={s.text} onChange={(e) => updateStep(i, "text", e.target.value)} placeholder="Step Details" />
          </div>
        ))}
      </div>

      <div className="mt-4"><OutputBox value={`<script type="application/ld+json">\n${schema}\n</script>`} rows={8} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `<script type="application/ld+json">\n${schema}\n</script>`} /></div>
    </ToolCard>
  );
}

/* ---------------- 32. JSON-LD Validator ---------------- */
export function JsonLdValidator() {
  const [json, setJson] = useState(`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ToolForAll",
  "url": "https://toolforall.com"
}`);

  const validation = useMemo(() => {
    try {
      const obj = JSON.parse(json);
      const hasContext = Boolean(obj["@context"]);
      const hasType = Boolean(obj["@type"]);
      const type = obj["@type"] || "Unknown";
      return {
        valid: true,
        hasContext,
        hasType,
        type,
        keysCount: Object.keys(obj).length,
        error: null
      };
    } catch (e: any) {
      return {
        valid: false,
        hasContext: false,
        hasType: false,
        type: "Error",
        keysCount: 0,
        error: e.message
      };
    }
  }, [json]);

  return (
    <ToolCard>
      <Field label="Paste JSON-LD Object or Script">
        <TextArea rows={6} value={json} onChange={(e) => setJson(e.target.value)} />
      </Field>

      <div className="my-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="JSON Syntax" value={validation.valid ? "✅ Valid" : "❌ Error"} />
        <StatBadge label="Schema @type" value={validation.type} />
        <StatBadge label="@context" value={validation.hasContext ? "✅ schema.org" : "⚠️ Missing"} />
      </div>

      {validation.valid ? (
        <Alert type="success">
          Valid JSON-LD schema with <strong>{validation.keysCount} properties</strong> detected. Ready for web insertion!
        </Alert>
      ) : (
        <Alert type="error">
          JSON Syntax Error: {validation.error}
        </Alert>
      )}
    </ToolCard>
  );
}

/* ---------------- 33. SEO Content Brief Generator ---------------- */
export function SeoContentBrief() {
  const [topic, setTopic] = useState("Best Developer Tools 2026");
  const [keyword, setKeyword] = useState("free developer tools");
  const [audience, setAudience] = useState("Software engineers and web developers");
  const [wordCount, setWordCount] = useState("1500 - 2000 words");

  const brief = useMemo(() => {
    return `# SEO Content Brief: ${topic}

## 1. Overview & Search Intent
- Primary Target Keyword: ${keyword}
- Target Audience: ${audience}
- Recommended Word Count: ${wordCount}
- Search Intent: Commercial / Informational

## 2. Metadata Recommendations
- Suggested Title Tag: ${topic} — Complete Guide & Reviews
- Suggested Meta Description: Discover the ${keyword} to streamline your coding workflow. Fast, browser-based, and 100% free.

## 3. Recommended Heading Structure (H2 / H3)
- H1: ${topic}
- H2: Why Browser-Based Developer Tools Matter in 2026
- H2: Core Tool Categories Every Developer Needs
  - H3: JSON Formatting & Validation
  - H3: Encoding, Decoding & Base64
  - H3: Security & Password Generators
- H2: Top 10 Recommended Free Tools
- H2: How to Integrate These Tools into Your Daily Workflow
- H2: Frequently Asked Questions (FAQ)

## 4. Key Questions to Answer (PAA)
- Are these developer tools free to use?
- Does any code leave my local browser?
- What are the fastest tools for JSON manipulation?`;
  }, [topic, keyword, audience, wordCount]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Content Topic / Article Subject"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Primary Target Keyword"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
        <Field label="Target Audience"><TextInput value={audience} onChange={(e) => setAudience(e.target.value)} /></Field>
        <Field label="Target Word Count"><TextInput value={wordCount} onChange={(e) => setWordCount(e.target.value)} /></Field>
      </div>

      <div className="mt-4"><OutputBox value={brief} rows={10} /></div>
      <div className="mt-2 flex gap-2">
        <CopyButton getText={() => brief} label="Copy Content Brief" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 34. Google SERP URL Generator ---------------- */
export function GoogleSerpUrlGenerator() {
  const [query, setQuery] = useState("seo analyzer tool");
  const [country, setCountry] = useState("us");
  const [lang, setLang] = useState("en");
  const [num, setNum] = useState("10");

  const url = useMemo(() => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}&gl=${country}&hl=${lang}&num=${num}`;
  }, [query, country, lang, num]);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Field label="Search Query"><TextInput value={query} onChange={(e) => setQuery(e.target.value)} /></Field>
        </div>
        <Field label="Country / Region (gl)">
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="us">United States (us)</option>
            <option value="uk">United Kingdom (uk)</option>
            <option value="eg">Egypt (eg)</option>
            <option value="sa">Saudi Arabia (sa)</option>
            <option value="de">Germany (de)</option>
            <option value="fr">France (fr)</option>
          </Select>
        </Field>
        <Field label="Language (hl)">
          <Select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English (en)</option>
            <option value="ar">Arabic (ar)</option>
            <option value="es">Spanish (es)</option>
            <option value="de">German (de)</option>
            <option value="fr">French (fr)</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-3 font-mono text-xs text-blue-700 dark:border-slate-800 dark:text-blue-400 break-all">
        {url}
      </div>

      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => url} label="Copy SERP URL" />
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Open Localized SERP ↗
        </a>
      </div>
    </ToolCard>
  );
}

/* ---------------- 35. UTM URL Builder ---------------- */
export function UtmUrlBuilder() {
  const [baseUrl, setBaseUrl] = useState("https://toolforall.com/seo-webmaster-tools");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("launch_2026");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("cta_button");

  const fullUrl = useMemo(() => {
    try {
      const u = new URL(baseUrl);
      if (source) u.searchParams.set("utm_source", source);
      if (medium) u.searchParams.set("utm_medium", medium);
      if (campaign) u.searchParams.set("utm_campaign", campaign);
      if (term) u.searchParams.set("utm_term", term);
      if (content) u.searchParams.set("utm_content", content);
      return u.toString();
    } catch {
      return baseUrl;
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  return (
    <ToolCard>
      <Field label="Website Target URL"><TextInput value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} /></Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Campaign Source (utm_source)" hint="e.g. google, newsletter, twitter">
          <TextInput value={source} onChange={(e) => setSource(e.target.value)} />
        </Field>
        <Field label="Campaign Medium (utm_medium)" hint="e.g. cpc, email, banner">
          <TextInput value={medium} onChange={(e) => setMedium(e.target.value)} />
        </Field>
        <Field label="Campaign Name (utm_campaign)" hint="e.g. spring_sale, launch">
          <TextInput value={campaign} onChange={(e) => setCampaign(e.target.value)} />
        </Field>
        <Field label="Campaign Term (utm_term, optional)" hint="e.g. running+shoes">
          <TextInput value={term} onChange={(e) => setTerm(e.target.value)} />
        </Field>
        <Field label="Campaign Content (utm_content, optional)" hint="e.g. top_banner, link_a">
          <TextInput value={content} onChange={(e) => setContent(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4"><OutputBox value={fullUrl} rows={2} /></div>
      <div className="mt-2 flex gap-2">
        <CopyButton getText={() => fullUrl} label="Copy UTM URL" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 36. OG Image Preview ---------------- */
export function OgImagePreview() {
  const [title, setTitle] = useState("ToolForAll: Free Online Web & Developer Tools");
  const [desc, setDesc] = useState("Explore lightning-fast, private browser utilities for developers, designers, and marketers.");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80");
  const [site, setSite] = useState("toolforall.com");

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Page Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Domain / Site Name"><TextInput value={site} onChange={(e) => setSite(e.target.value)} /></Field>
        <div className="sm:col-span-2">
          <Field label="OG Image URL (Recommended 1200x630)"><TextInput value={image} onChange={(e) => setImage(e.target.value)} /></Field>
        </div>
      </div>
      <div className="mt-3">
        <Field label="Description"><TextArea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Simulated Facebook / Twitter Card Preview</div>
        <div className="max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow dark:border-slate-800 dark:bg-slate-900">
          <div className="aspect-[1.91/1] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img src={image} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as any).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'%3E%3Crect fill='%23334155' width='1200' height='630'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='48' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E1200 x 630 Preview%3C/text%3E%3C/svg%3E"; }} />
          </div>
          <div className="p-3">
            <div className="text-[11px] uppercase text-slate-500">{site}</div>
            <div className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">{title}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{desc}</div>
          </div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 37. SEO Keyword-to-URL Checker ---------------- */
export function KeywordUrlChecker() {
  const [keyword, setKeyword] = useState("seo tools");
  const [slug, setSlug] = useState("best-free-seo-tools-2026");
  const [title, setTitle] = useState("Best Free SEO Tools for Marketers in 2026");
  const [h1, setH1] = useState("10 Best Free SEO Tools to Grow Your Traffic");

  const kwWords = keyword.toLowerCase().split(/\s+/).filter(Boolean);

  const slugMatch = kwWords.every(w => slug.toLowerCase().includes(w));
  const titleMatch = kwWords.every(w => title.toLowerCase().includes(w));
  const h1Match = kwWords.every(w => h1.toLowerCase().includes(w));

  const score = (slugMatch ? 35 : 0) + (titleMatch ? 35 : 0) + (h1Match ? 30 : 0);

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Primary Target Keyword"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
        <Field label="URL Slug"><TextInput value={slug} onChange={(e) => setSlug(e.target.value)} /></Field>
        <Field label="Page Title Tag"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Main H1 Heading"><TextInput value={h1} onChange={(e) => setH1(e.target.value)} /></Field>
      </div>

      <div className="my-4">
        <StatBadge label="Keyword Prominence Score" value={`${score} / 100`} />
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between rounded border border-slate-200 p-2.5 dark:border-slate-800">
          <span>URL Slug Keyword Match</span>
          <span className={slugMatch ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{slugMatch ? "✅ Matched (+35)" : "⚠️ Missing words"}</span>
        </div>
        <div className="flex items-center justify-between rounded border border-slate-200 p-2.5 dark:border-slate-800">
          <span>Title Tag Keyword Match</span>
          <span className={titleMatch ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{titleMatch ? "✅ Matched (+35)" : "⚠️ Missing words"}</span>
        </div>
        <div className="flex items-center justify-between rounded border border-slate-200 p-2.5 dark:border-slate-800">
          <span>H1 Heading Keyword Match</span>
          <span className={h1Match ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{h1Match ? "✅ Matched (+30)" : "⚠️ Missing words"}</span>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 38. AI Search Visibility Checklist ---------------- */
export function AiSearchVisibilityChecker() {
  const [checks, setChecks] = useState([
    { text: "Robots.txt allows AI crawlers (GPTBot, PerplexityBot, CCBot)", checked: true },
    { text: "Direct 40-60 word concise summary answer provided below main H2", checked: true },
    { text: "Valid JSON-LD structured data (Article, Organization, Author) implemented", checked: true },
    { text: "Author credentials and transparent E-E-A-T signals published", checked: true },
    { text: "Clear publish date and 'Last Modified' timestamp visible in markup", checked: true },
    { text: "FAQ section answering high-intent conversational queries included", checked: false },
    { text: "Primary sources, original research, or statistics cited with external links", checked: false },
    { text: "Content formatted with structured bullet points and markdown tables", checked: true }
  ]);

  function toggle(i: number) {
    setChecks(checks.map((c, idx) => idx === i ? { ...c, checked: !c.checked } : c));
  }

  const passed = checks.filter(c => c.checked).length;
  const score = Math.round((passed / checks.length) * 100);

  return (
    <ToolCard>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">AI Search Readiness: {score}%</div>
          <p className="text-xs text-slate-500">Optimizing for ChatGPT Search, Perplexity, and Google AI Overviews</p>
        </div>
        <StatBadge label="Audit Progress" value={`${passed} / ${checks.length}`} />
      </div>

      <div className="space-y-2 text-xs">
        {checks.map((c, i) => (
          <label key={i} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50">
            <input type="checkbox" checked={c.checked} onChange={() => toggle(i)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <span className={c.checked ? "text-slate-900 font-medium dark:text-white" : "text-slate-500"}>{c.text}</span>
          </label>
        ))}
      </div>
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
  SeoAnalyzer,
  SeoTitleChecker,
  MetaDescriptionChecker,
  HeadingChecker,
  ImageSeoChecker,
  InternalLinkAnalyzer,
  ExternalLinkAnalyzer,
  BrokenLinkChecker,
  UrlSeoAnalyzer,
  UrlLengthChecker,
  NoindexNofollowChecker,
  CanonicalUrlChecker,
  RobotsMetaChecker,
  KeywordClustering,
  KeywordIntentClassifier,
  LongTailKeywordGenerator,
  KeywordCombinationGenerator,
  KeywordQuestionGenerator,
  KeywordListCleaner,
  GoogleSearchOperators,
  KeywordPermutationGenerator,
  KeywordMapGenerator,
  FaqSchemaValidator,
  ArticleSchemaGenerator,
  ProductSchemaGenerator,
  BreadcrumbSchemaGenerator,
  LocalBusinessSchemaGenerator,
  OrganizationSchemaGenerator,
  WebSiteSchemaGenerator,
  EventSchemaGenerator,
  HowToSchemaGenerator,
  JsonLdValidator,
  SeoContentBrief,
  GoogleSerpUrlGenerator,
  UtmUrlBuilder,
  OgImagePreview,
  KeywordUrlChecker,
  AiSearchVisibilityChecker,
};
