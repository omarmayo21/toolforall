"use client";
/* eslint-disable react/display-name, @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Alert, Button, CopyButton, Field, OutputBox, Select, StatBadge, TextArea, TextInput, ToolCard, downloadBlob } from "./ui";
import { Calc, TextXform, num, N, type Row } from "./calc-kit";

type F = { k: string; label: string; def: string; type?: "text" | "area" | "select" | "number"; options?: [string, string][]; hint?: string };

function DocGen({ fields, gen, rows = 10, preview }: { fields: F[]; gen: (v: Record<string, string>) => string; rows?: number; preview?: (out: string) => ReactNode }) {
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.k, f.def])));
  const out = useMemo(() => { try { return gen(v); } catch (e) { return e instanceof Error ? e.message : "Check your inputs."; } }, [v, gen]);
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.k} className={f.type === "area" ? "sm:col-span-2" : ""}>
            <Field label={f.label} hint={f.hint}>
              {f.type === "select" ? <Select value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })}>{f.options!.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</Select>
                : f.type === "area" ? <TextArea rows={4} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />
                : <TextInput type={f.type === "number" ? "number" : "text"} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />}
            </Field>
          </div>
        ))}
      </div>
      <div className="mt-4"><OutputBox value={out} rows={rows} /></div>
      <div className="mt-3 flex flex-wrap gap-3"><CopyButton getText={() => out} /><Button variant="secondary" onClick={() => downloadBlob("result.txt", new Blob([out], { type: "text/plain" }))}>Download .txt</Button></div>
      {preview ? <div className="mt-4">{preview(out)}</div> : null}
    </ToolCard>
  );
}

/* ---------- links ---------- */
const digits = (s: string) => s.replace(/[^\d]/g, "");
const waLink = (v: Record<string, string>) => { const n = digits(v.phone); if (n.length < 7) throw new Error("Enter the full number with country code, e.g. 201001234567."); return `https://wa.me/${n}${v.msg.trim() ? `?text=${encodeURIComponent(v.msg)}` : ""}`; };
const tgLink = (v: Record<string, string>) => { const u = v.user.trim().replace(/^@/, "").replace(/^https?:\/\/t\.me\//, ""); if (!/^[A-Za-z0-9_]{4,32}$/.test(u)) throw new Error("Telegram usernames use 5 to 32 letters, digits or underscores."); return `https://t.me/${u}${v.msg.trim() ? `?text=${encodeURIComponent(v.msg)}` : ""}`; };
const mailto = (v: Record<string, string>) => { if (!/^\S+@\S+\.\S+$/.test(v.to.trim())) throw new Error("Enter a valid email address."); const q = [["cc", v.cc], ["bcc", v.bcc], ["subject", v.subject], ["body", v.body]].filter(([, x]) => x.trim()).map(([k, x]) => `${k}=${encodeURIComponent(x).replace(/%40/g, "@")}`).join("&"); return `mailto:${v.to.trim()}${q ? "?" + q : ""}`; };
const ytId = (s: string) => { const m = s.trim().match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/) ?? s.trim().match(/^([\w-]{11})$/); return m ? m[1] : ""; };
function YtThumb() {
  const [u, setU] = useState("");
  const id = ytId(u);
  const sizes: [string, string][] = [["maxresdefault", "Max resolution (1280x720)"], ["sddefault", "Standard (640x480)"], ["hqdefault", "High quality (480x360)"], ["mqdefault", "Medium (320x180)"]];
  return (
    <ToolCard>
      <Field label="YouTube video link or ID"><TextInput type="text" value={u} placeholder="https://www.youtube.com/watch?v=..." onChange={(e) => setU(e.target.value)} /></Field>
      {u && !id ? <div className="mt-3"><Alert>Could not find a video ID in this link.</Alert></div> : null}
      {id ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{sizes.map(([k, l]) => <div key={k} className="rounded-lg border border-border-default p-2"><img src={`https://img.youtube.com/vi/${id}/${k}.jpg`} alt={l} className="w-full rounded" loading="lazy" /><div className="mt-2 flex items-center justify-between text-sm"><span>{l}</span><a className="text-accent-default underline" href={`https://img.youtube.com/vi/${id}/${k}.jpg`} target="_blank" rel="noopener noreferrer">Open image</a></div></div>)}</div> : null}
      {id ? <p className="mt-3 text-xs text-text-muted">Open an image, then right click or long press to save it. Max resolution is not available for every video. Thumbnails belong to their creators.</p> : null}
    </ToolCard>
  );
}
const ytTime = (v: Record<string, string>) => { const id = ytId(v.url); if (!id) throw new Error("Enter a YouTube link."); const s = (+v.h || 0) * 3600 + (+v.m || 0) * 60 + (+v.s || 0); return `https://youtu.be/${id}${s > 0 ? `?t=${s}` : ""}`; };
const igBreaks = (s: string) => s.split("\n").map((l) => (l.trim() === "" ? "\u2800" : l)).join("\n");

/* ---------- character counter ---------- */
const LIMITS: [string, number, string][] = [["X (Twitter) post", 280, "Links count as 23 characters"], ["Instagram caption", 2200, "Only the first ~125 show before 'more'"], ["Instagram bio", 150, ""], ["Facebook post", 63206, "Posts under 80 characters often do best"], ["LinkedIn post", 3000, "About 210 show before 'see more'"], ["TikTok caption", 4000, ""], ["YouTube title", 100, "About 60 show in search"], ["YouTube description", 5000, "First 150 show before 'more'"], ["Pinterest pin description", 500, ""], ["Google title tag", 60, "Measured in pixels, 60 is a safe guide"], ["Google meta description", 160, "Measured in pixels, 160 is a safe guide"], ["SMS (one segment)", 160, "70 if it contains Arabic or emoji"]];
function CharCounter() {
  const [t, setT] = useState("");
  const len = [...t.replace(/https?:\/\/\S+/g, "x".repeat(0))].length;
  const xLen = [...t.replace(/https?:\/\/\S+/g, "x".repeat(23))].length;
  return (
    <ToolCard>
      <Field label="Your text"><TextArea rows={6} value={t} placeholder="Type or paste your caption, post or title..." onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-4 grid gap-2">{LIMITS.map(([n, lim, note]) => { const c = n.startsWith("X") ? xLen : [...t].length; const over = c > lim; return <div key={n} className="rounded-lg border border-border-default px-3 py-2"><div className="flex items-center justify-between text-sm"><span>{n}</span><span className={over ? "font-semibold text-red-600" : ""}>{c} / {lim}</span></div><div className="mt-1 h-1.5 rounded bg-bg-subtle"><div className={`h-1.5 rounded ${over ? "bg-red-500" : "bg-accent-default"}`} style={{ width: `${Math.min(100, (c / lim) * 100)}%` }} /></div>{note ? <div className="mt-1 text-xs text-text-muted">{note}</div> : null}</div>; })}</div>
      <p className="mt-3 text-xs text-text-muted">Characters without links removed: {len}. Limits change from time to time, so check the platform if you are close.</p>
    </ToolCard>
  );
}

/* ---------- QR ---------- */
function Qr({ fields, gen, name }: { fields: F[]; gen: (v: Record<string, string>) => string; name: string }) {
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.k, f.def])));
  const ref = useRef<HTMLCanvasElement>(null); const [err, setErr] = useState("");
  useEffect(() => {
    (async () => {
      try { const text = gen(v); const { default: QRCode } = await import("qrcode"); await QRCode.toCanvas(ref.current!, text, { width: 300, margin: 2, errorCorrectionLevel: "M" }); setErr(""); }
      catch (e) { setErr(e instanceof Error ? e.message : "Could not create the QR code."); }
    })();
  }, [v, gen]);
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">{fields.map((f) => <Field key={f.k} label={f.label} hint={f.hint}>{f.type === "select" ? <Select value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })}>{f.options!.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</Select> : <TextInput type="text" value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />}</Field>)}</div>
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      <div className="mt-4 flex flex-col items-center gap-3"><canvas ref={ref} className="rounded-lg border border-border-default" /><Button onClick={() => ref.current?.toBlob((b) => b && downloadBlob(`${name}.png`, b))}>⬇️ Download PNG</Button></div>
    </ToolCard>
  );
}
const wifiEsc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");
const wifiStr = (v: Record<string, string>) => { if (!v.ssid.trim()) throw new Error("Enter the network name."); return `WIFI:T:${v.sec};S:${wifiEsc(v.ssid)};${v.sec === "nopass" ? "" : `P:${wifiEsc(v.pass)};`}${v.hidden === "1" ? "H:true;" : ""};`; };
const vcardStr = (v: Record<string, string>) => { if (!v.name.trim()) throw new Error("Enter a name."); const [fn, ...ln] = v.name.trim().split(/\s+/); return ["BEGIN:VCARD", "VERSION:3.0", `N:${ln.join(" ")};${fn};;;`, `FN:${v.name.trim()}`, v.org && `ORG:${v.org}`, v.title && `TITLE:${v.title}`, v.phone && `TEL;TYPE=CELL:${v.phone}`, v.email && `EMAIL:${v.email}`, v.url && `URL:${v.url}`, "END:VCARD"].filter(Boolean).join("\n"); };

/* ---------- webmaster files ---------- */
const adsTxt = (v: Record<string, string>) => { const lines = v.lines.split("\n").map((l) => l.trim()).filter(Boolean); if (!lines.length) throw new Error("Add at least one line."); const pid = v.pid.trim(); const net = v.net; const known: Record<string, [string, string]> = { adsense: ["google.com", `pub-${pid.replace(/^pub-/, "")}, DIRECT, f08c47fec0942fa0`], adsterra: ["adsterra.com", ""], other: ["", ""] }; void known; const out: string[] = []; if (net === "adsense") { if (!/^(pub-)?\d{10,20}$/.test(pid)) throw new Error("AdSense publisher IDs look like pub-1234567890123456."); out.push(`google.com, pub-${pid.replace(/^pub-/, "")}, DIRECT, f08c47fec0942fa0`); } out.push(...lines); return out.join("\n"); };
const llmsTxt = (v: Record<string, string>) => `# ${v.name}\n\n> ${v.sum}\n\n${v.details ? v.details + "\n\n" : ""}## Main pages\n\n${v.links.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [t, u, d] = l.split("|").map((x) => x.trim()); return `- [${t}](${u})${d ? `: ${d}` : ""}`; }).join("\n")}\n`;
const secTxt = (v: Record<string, string>) => { const exp = new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d+Z$/, "Z"); return `Contact: ${v.contact.includes("@") && !v.contact.startsWith("mailto:") ? "mailto:" + v.contact : v.contact}\nExpires: ${exp}\n${v.pol ? `Policy: ${v.pol}\n` : ""}Preferred-Languages: ${v.lang}\n${v.canon ? `Canonical: ${v.canon}\n` : ""}`; };
const manifest = (v: Record<string, string>) => JSON.stringify({ name: v.name, short_name: v.short, description: v.desc || undefined, start_url: v.start, display: v.display, background_color: v.bg, theme_color: v.theme, icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] }, null, 2);
type Rule = { type: "allow" | "disallow"; path: string };
const rx = (p: string) => new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\\\$$/, "$"));
function robotsTest(txt: string, agent: string, path: string) {
  const groups: { agents: string[]; rules: Rule[] }[] = []; let cur: { agents: string[]; rules: Rule[] } | null = null; let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) { const l = raw.replace(/#.*/, "").trim(); const i = l.indexOf(":"); if (i < 0) continue; const k = l.slice(0, i).trim().toLowerCase(), val = l.slice(i + 1).trim();
    if (k === "user-agent") { if (!cur || !lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(val.toLowerCase()); lastWasAgent = true; }
    else if ((k === "allow" || k === "disallow") && cur) { cur.rules.push({ type: k, path: val }); lastWasAgent = false; } else lastWasAgent = false; }
  const a = agent.toLowerCase(); let g = groups.filter((x) => x.agents.some((n) => n !== "*" && a.includes(n))); if (!g.length) g = groups.filter((x) => x.agents.includes("*"));
  const rules = g.flatMap((x) => x.rules).filter((r) => r.path !== ""); let best: Rule | null = null, bl = -1;
  for (const r of rules) if (rx(r.path).test(path) && (r.path.length > bl || (r.path.length === bl && r.type === "allow"))) { best = r; bl = r.path.length; }
  return { allowed: !best || best.type === "allow", rule: best, groups: g.length };
}
function RobotsTester() {
  const [txt, setTxt] = useState("User-agent: *\nDisallow: /admin/\nAllow: /admin/help\n\nUser-agent: Googlebot-Image\nDisallow: /private/");
  const [ua, setUa] = useState("Googlebot"); const [paths, setPaths] = useState("/\n/admin/\n/admin/help\n/blog/post-1");
  const rows = paths.split("\n").map((p) => p.trim()).filter(Boolean).map((p) => ({ p: p.startsWith("/") ? p : "/" + p })).map((x) => ({ ...x, r: robotsTest(txt, ua, x.p) }));
  return (
    <ToolCard>
      <Field label="robots.txt content"><TextArea rows={8} value={txt} onChange={(e) => setTxt(e.target.value)} /></Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="User agent"><TextInput type="text" value={ua} onChange={(e) => setUa(e.target.value)} /></Field><Field label="Paths to test (one per line)"><TextArea rows={4} value={paths} onChange={(e) => setPaths(e.target.value)} /></Field></div>
      <div className="mt-4 space-y-2">{rows.map(({ p, r }) => <div key={p} className="flex items-center justify-between rounded-lg border border-border-default px-3 py-2 text-sm"><span className="font-mono">{p}</span><span className={r.allowed ? "font-semibold text-green-600" : "font-semibold text-red-600"}>{r.allowed ? "Allowed" : "Blocked"}{r.rule ? <span className="ml-2 font-normal text-text-muted">({r.rule.type}: {r.rule.path})</span> : null}</span></div>)}</div>
      <p className="mt-3 text-xs text-text-muted">Uses Google style matching: the longest matching rule wins, * matches any text and $ matches the end. A named user agent group replaces the * group.</p>
    </ToolCard>
  );
}
const domains = (s: string) => { const out = new Set<string>(); for (const m of s.matchAll(/(?:https?:\/\/)?(?:www\.)?([a-z0-9][a-z0-9.-]*\.[a-z]{2,})(?::\d+)?(?:[/?#][^\s]*)?/gi)) out.add(m[1].toLowerCase()); return [...out].join("\n"); };
function PixelWidth() {
  const [t, setT] = useState(""); const [d, setD] = useState("");
  const w = (s: string, font: string) => { const c = document.createElement("canvas").getContext("2d")!; c.font = font; return Math.round(c.measureText(s).width); };
  const tw = t ? w(t, "20px Arial, sans-serif") : 0, dw = d ? w(d, "14px Arial, sans-serif") : 0;
  const bar = (px: number, max: number) => <div className="mt-1 h-2 rounded bg-bg-subtle"><div className={`h-2 rounded ${px > max ? "bg-red-500" : "bg-accent-default"}`} style={{ width: `${Math.min(100, (px / max) * 100)}%` }} /></div>;
  return (
    <ToolCard>
      <Field label="Page title"><TextInput type="text" value={t} onChange={(e) => setT(e.target.value)} placeholder="Your page title | Brand" /></Field>
      <div className="mt-1 text-sm">{tw} px of about 580 px {bar(tw, 580)}</div>
      <div className="mt-4"><Field label="Meta description"><TextArea rows={3} value={d} onChange={(e) => setD(e.target.value)} /></Field></div>
      <div className="mt-1 text-sm">{dw} px of about 920 px (desktop) {bar(dw, 920)}</div>
      <p className="mt-3 text-xs text-text-muted">Google cuts titles by width, not by characters. These limits are estimates measured in Arial. Wide letters such as W and M use more space than i or l.</p>
    </ToolCard>
  );
}
const emailSig = (v: Record<string, string>) => `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.4"><tr><td style="padding-right:14px;border-right:3px solid ${v.color}"><div style="font-size:17px;font-weight:bold;color:#111">${v.name}</div><div>${v.title}${v.company ? " | " + v.company : ""}</div></td><td style="padding-left:14px">${v.phone ? `<div>Phone: <a href="tel:${v.phone.replace(/[^\d+]/g, "")}" style="color:${v.color};text-decoration:none">${v.phone}</a></div>` : ""}${v.email ? `<div>Email: <a href="mailto:${v.email}" style="color:${v.color};text-decoration:none">${v.email}</a></div>` : ""}${v.web ? `<div>Web: <a href="https://${v.web.replace(/^https?:\/\//, "")}" style="color:${v.color};text-decoration:none">${v.web.replace(/^https?:\/\//, "")}</a></div>` : ""}</td></tr></table>`;

/* ---------- legal templates ---------- */
const NOTE = "This is a general template and not legal advice. Laws differ by country. Have a lawyer review it before you rely on it.";
const privacy = (v: Record<string, string>) => `Privacy Policy for ${v.site}\nLast updated: ${new Date().toISOString().slice(0, 10)}\n\n${v.site} (${v.url}) respects your privacy. This policy explains what information we collect and how we use it.\n\n1. Information we collect\n- Information you give us, such as your name and email address when you contact us${v.forms === "yes" ? " or submit a form" : ""}.\n- Information collected automatically, such as your IP address, browser type, device type and the pages you visit.\n${v.tools === "yes" ? "- Files and text you enter into our tools are processed in your browser and are not uploaded to our servers.\n" : ""}\n2. Cookies and similar technologies\nWe use cookies to make the site work and to understand how it is used.${v.analytics === "yes" ? " We use analytics services such as Google Analytics to measure traffic." : ""}${v.ads === "yes" ? " We show ads from third party networks such as Google AdSense or Adsterra. These networks may use cookies to show ads based on your visits to this and other sites. You can manage ad personalization in your browser settings or through your ad settings." : ""}\n\n3. How we use information\nTo run and improve the site, to respond to messages, to keep the site secure and to follow the law.\n\n4. Sharing\nWe do not sell your personal information. We may share data with service providers who help us run the site, and when the law requires it.\n\n5. Your rights\nDepending on where you live, you may have the right to access, correct or delete your personal data, and to object to or limit its use. To use these rights, email ${v.email}.\n\n6. Children\nThe site is not directed to children under 13 and we do not knowingly collect their data.\n\n7. Changes\nWe may update this policy. The date at the top shows the latest version.\n\n8. Contact\n${v.email}\n\n${NOTE}`;
const terms = (v: Record<string, string>) => `Terms and Conditions for ${v.site}\nLast updated: ${new Date().toISOString().slice(0, 10)}\n\nBy using ${v.url} you agree to these terms. If you do not agree, please do not use the site.\n\n1. Use of the site\nYou may use ${v.site} for lawful purposes. You must not misuse it, try to break its security, or copy it in bulk without permission.\n\n2. Content and ownership\nThe design, text and code of the site belong to ${v.owner} unless noted. ${v.ugc === "yes" ? "If you submit content, you keep ownership but give us a license to display it on the site." : "The site does not accept public content submissions."}\n\n3. No warranty\nThe site and its tools are provided as is, without any promise that results are accurate, complete or always available.\n\n4. Limitation of liability\nTo the extent the law allows, ${v.owner} is not liable for any loss caused by using the site or relying on its results.\n\n5. Third party links and ads\nThe site may link to or show ads from other parties. We are not responsible for their content or practices.\n\n6. Changes\nWe may change these terms at any time. Using the site after a change means you accept it.\n\n7. Governing law\nThese terms are governed by the laws of ${v.country}.\n\n8. Contact\n${v.email}\n\n${NOTE}`;
const affiliate = (v: Record<string, string>) => `Affiliate Disclosure\n\n${v.site} participates in ${v.program || "affiliate programs"}. When you click some links on this site and buy something, we may earn a commission at no extra cost to you.\n\nWe only recommend products or services that we believe are useful. Commissions do not change our opinions, but you should know about them so you can decide for yourself.\n\nShort version for the top of a post:\n"Disclosure: This post contains affiliate links. If you buy through them, I may earn a small commission at no extra cost to you."\n\nQuestions? Email ${v.email}.\n\n${NOTE}`;

/* ---------- marketing calculators ---------- */
const pct = (n: number, d = 2) => (Number.isFinite(n) ? num(n, d) + "%" : "-");
const cur = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-");
const ctr = (v: Record<string, string>): Row[] | string => { const c = N(v.c), i = N(v.i); if (!(i > 0) || c < 0 || c > i) return "Impressions must be above 0 and clicks cannot be higher than impressions."; return [["CTR", pct((c / i) * 100)], ["Clicks per 1,000 views", num((c / i) * 1000, 1)]]; };
const cpc = (v: Record<string, string>): Row[] | string => { const s = N(v.s), c = N(v.c); if (!(c > 0) || s < 0) return "Enter spend and a click count above 0."; return [["Cost per click (CPC)", cur(s / c)], ["Clicks per 100 spent", num((c / s) * 100, 1)]]; };
const roas = (v: Record<string, string>): Row[] | string => { const r = N(v.r), s = N(v.s), m = N(v.m) / 100; if (!(s > 0)) return "Ad spend must be above 0."; const out: Row[] = [["ROAS", num(r / s, 2) + "x"], ["Revenue per 1 spent", cur(r / s)], ["Profit after ad spend", cur(r * m - s)]]; if (m > 0) out.push(["Break-even ROAS", num(1 / m, 2) + "x"]); return out; };
const conv = (v: Record<string, string>): Row[] | string => { const c = N(v.c), vi = N(v.v); if (!(vi > 0) || c < 0 || c > vi) return "Visitors must be above 0 and conversions cannot be higher than visitors."; const out: Row[] = [["Conversion rate", pct((c / vi) * 100)], ["Visitors per conversion", num(vi / c, 1)]]; const price = N(v.p); if (price > 0) out.push(["Revenue per visitor", cur((c * price) / vi)]); return out; };
const adsense = (v: Record<string, string>): Row[] | string => { const pv = N(v.pv), ctrv = N(v.ctr) / 100, cpcv = N(v.cpc), ap = N(v.ap); if (![pv, ctrv, cpcv, ap].every((x) => x >= 0)) return "Enter positive numbers."; const day = pv * ap * ctrv * cpcv; return [["Estimated per day", cur(day)], ["Per month", cur(day * 30)], ["Per year", cur(day * 365)], ["Page RPM", cur((ap * ctrv * cpcv) * 1000)]]; };
const ytMoney = (v: Record<string, string>): Row[] | string => { const views = N(v.v), lo = N(v.lo), hi = N(v.hi); if (!(views >= 0) || !(lo >= 0) || !(hi >= lo)) return "Enter views and an RPM range where the high value is not lower than the low value."; return [["Low estimate", cur((views / 1000) * lo)], ["High estimate", cur((views / 1000) * hi)], ["Midpoint", cur((views / 1000) * (lo + hi) / 2)]]; };
const erf = (x: number) => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
const cdf = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
const abtest = (v: Record<string, string>): Row[] | string => { const na = N(v.na), ca = N(v.ca), nb = N(v.nb), cb = N(v.cb); if (![na, nb].every((x) => x > 0) || ca < 0 || cb < 0 || ca > na || cb > nb) return "Check your numbers: conversions cannot exceed visitors."; const pa = ca / na, pb = cb / nb, p = (ca + cb) / (na + nb), se = Math.sqrt(p * (1 - p) * (1 / na + 1 / nb)); if (se === 0) return "Both groups have the same result, so there is nothing to compare."; const z = (pb - pa) / se, pv = 2 * (1 - cdf(Math.abs(z))); const conf = (1 - pv) * 100; return [["Rate A", pct(pa * 100)], ["Rate B", pct(pb * 100)], ["Relative lift", pa ? pct(((pb - pa) / pa) * 100, 1) : "-"], ["p-value", num(pv, 4)], ["Confidence", pct(conf, 1)], ["Verdict", pv < 0.05 ? (pb > pa ? "B wins (significant)" : "A wins (significant)") : "Not significant yet"]]; };
const ltv = (v: Record<string, string>): Row[] | string => { const arpu = N(v.a), m = N(v.m) / 100, life = N(v.l), cac = N(v.c); if (!(arpu >= 0) || !(life > 0) || !(m >= 0)) return "Enter revenue per month, margin and a lifetime in months above 0."; const l = arpu * m * life; const out: Row[] = [["Customer lifetime value", cur(l)]]; if (cac > 0) { out.push(["LTV : CAC", num(l / cac, 2) + " : 1"], ["Months to pay back CAC", arpu * m > 0 ? num(cac / (arpu * m), 1) : "-"]); } return out; };
const engage = (v: Record<string, string>): Row[] | string => { const e = N(v.l) + N(v.c) + N(v.s) + N(v.sv || "0"), f = N(v.f), r = N(v.r); if (!(f > 0)) return "Followers must be above 0."; const out: Row[] = [["Total interactions", num(e, 0)], ["Engagement rate (per followers)", pct((e / f) * 100)]]; if (r > 0) out.push(["Engagement rate (per reach)", pct((e / r) * 100)]); return out; };

const cl = (k: string, label: string, def: string, hint?: string) => ({ k, label, def, hint });
const C = (fields: { k: string; label: string; def: string; hint?: string; type?: string }[], compute: (v: Record<string, string>) => Row[] | string, note?: string) => () => <Calc fields={fields} compute={compute} note={note} />;
const T = (fn: (s: string) => string, ph: string, rows = 6) => () => <TextXform fn={fn} placeholder={ph} rows={rows} />;
const D = (fields: F[], gen: (v: Record<string, string>) => string, rows?: number, preview?: (o: string) => ReactNode) => () => <DocGen fields={fields} gen={gen} rows={rows} preview={preview} />;
const tx = (k: string, label: string, def: string, extra: Partial<F> = {}): F => ({ k, label, def, type: "text", ...extra });
const yn = (k: string, label: string, def = "yes"): F => ({ k, label, def, type: "select", options: [["yes", "Yes"], ["no", "No"]] });

export const WAVE5: Record<string, () => ReactNode> = {
  "whatsapp-link-generator": D([tx("phone", "Phone number with country code", "201001234567", { hint: "Digits only, no + or leading zeros" }), { k: "msg", label: "Pre-filled message (optional)", def: "Hello, I am interested in your service.", type: "area" }], waLink, 3),
  "telegram-link-generator": D([tx("user", "Telegram username", "durov"), { k: "msg", label: "Pre-filled message (optional)", def: "", type: "area" }], tgLink, 3),
  "mailto-link-generator": D([tx("to", "To", "hello@example.com"), tx("cc", "CC (optional)", ""), tx("bcc", "BCC (optional)", ""), tx("subject", "Subject", "Question about your service"), { k: "body", label: "Body", def: "Hi,\n\nI would like to know more.", type: "area" }], mailto, 5),
  "youtube-thumbnail-grabber": () => <YtThumb />,
  "youtube-timestamp-link-generator": D([tx("url", "YouTube video link", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"), { k: "h", label: "Hours", def: "0", type: "number" }, { k: "m", label: "Minutes", def: "1", type: "number" }, { k: "s", label: "Seconds", def: "30", type: "number" }], ytTime, 3),
  "instagram-line-break-generator": T(igBreaks, "Write your caption with blank lines between paragraphs...", 8),
  "social-media-character-counter": () => <CharCounter />,
  "wifi-qr-code-generator": () => <Qr name="wifi-qr" gen={wifiStr} fields={[tx("ssid", "Network name (SSID)", "MyWiFi"), tx("pass", "Password", "password123"), { k: "sec", label: "Security", def: "WPA", type: "select", options: [["WPA", "WPA / WPA2 / WPA3"], ["WEP", "WEP"], ["nopass", "No password"]] }, { k: "hidden", label: "Hidden network", def: "0", type: "select", options: [["0", "No"], ["1", "Yes"]] }]} />,
  "vcard-qr-code-generator": () => <Qr name="contact-qr" gen={vcardStr} fields={[tx("name", "Full name", "Omar Ali"), tx("org", "Company", ""), tx("title", "Job title", ""), tx("phone", "Phone", "+201001234567"), tx("email", "Email", "hello@example.com"), tx("url", "Website", "https://example.com")]} />,
  "whatsapp-qr-code-generator": () => <Qr name="whatsapp-qr" gen={waLink} fields={[tx("phone", "Phone number with country code", "201001234567"), tx("msg", "Pre-filled message (optional)", "Hello!")]} />,
  "ads-txt-generator": D([{ k: "net", label: "Include Google AdSense line", def: "adsense", type: "select", options: [["adsense", "Yes, add my AdSense ID"], ["none", "No, only my own lines"]] }, tx("pid", "AdSense publisher ID", "pub-0000000000000000"), { k: "lines", label: "Other lines (one per line, as given by your ad network)", def: "adsterra.com, 1234567, DIRECT", type: "area" }], adsTxt, 6),
  "llms-txt-generator": D([tx("name", "Site name", "ToolsForAll"), tx("sum", "One sentence summary", "Free online tools for text, images, PDF, SEO and calculators."), { k: "details", label: "Extra details (optional)", def: "", type: "area" }, { k: "links", label: "Links, one per line: title | url | description", def: "Text tools | https://example.com/text-tools | Word counter, case converter and more\nPDF tools | https://example.com/pdf-tools | Merge, split and compress PDFs", type: "area" }], llmsTxt, 10),
  "security-txt-generator": D([tx("contact", "Security contact (email or URL)", "security@example.com"), tx("pol", "Policy URL (optional)", ""), tx("lang", "Languages", "en, ar"), tx("canon", "Canonical URL (optional)", "https://example.com/.well-known/security.txt")], secTxt, 7),
  "manifest-json-generator": D([tx("name", "App name", "My Web App"), tx("short", "Short name", "MyApp"), tx("desc", "Description", ""), tx("start", "Start URL", "/"), { k: "display", label: "Display mode", def: "standalone", type: "select", options: [["standalone", "Standalone"], ["fullscreen", "Fullscreen"], ["minimal-ui", "Minimal UI"], ["browser", "Browser"]] }, tx("bg", "Background color", "#ffffff"), tx("theme", "Theme color", "#2563eb")], manifest, 16),
  "robots-txt-tester": () => <RobotsTester />,
  "email-signature-generator": D([tx("name", "Name", "Omar Ali"), tx("title", "Job title", "Web Developer"), tx("company", "Company", ""), tx("phone", "Phone", "+20 100 123 4567"), tx("email", "Email", "hello@example.com"), tx("web", "Website", "example.com"), tx("color", "Accent color (hex)", "#2563eb")], emailSig, 8, (o) => <div><div className="mb-1 text-sm font-medium text-text-secondary">Preview</div><div className="rounded-lg border border-border-default bg-white p-4" dangerouslySetInnerHTML={{ __html: o }} /><p className="mt-2 text-xs text-text-muted">Copy the HTML into your email client&apos;s signature settings (HTML or source mode).</p></div>),
  "domain-extractor-from-urls": T(domains, "Paste URLs or text with links...", 8),
  "meta-title-pixel-width-checker": () => <PixelWidth />,
  "privacy-policy-generator": D([tx("site", "Site name", "ToolsForAll"), tx("url", "Website URL", "https://example.com"), tx("email", "Contact email", "hello@example.com"), yn("forms", "Do you have contact forms?"), yn("tools", "Do tools run in the browser only?"), yn("analytics", "Do you use analytics?"), yn("ads", "Do you show ads (AdSense, Adsterra)?")], privacy, 18),
  "terms-and-conditions-generator": D([tx("site", "Site name", "ToolsForAll"), tx("url", "Website URL", "https://example.com"), tx("owner", "Owner or company", "Your Name"), tx("country", "Governing country", "Egypt"), tx("email", "Contact email", "hello@example.com"), yn("ugc", "Can users submit content?", "no")], terms, 18),
  "affiliate-disclosure-generator": D([tx("site", "Site name", "ToolsForAll"), tx("program", "Programs (optional)", "Amazon Associates"), tx("email", "Contact email", "hello@example.com")], affiliate, 12),
  "ctr-calculator": C([cl("c", "Clicks", "250"), cl("i", "Impressions", "10000")], ctr, "CTR = clicks / impressions x 100."),
  "cpc-calculator": C([cl("s", "Ad spend", "500"), cl("c", "Clicks", "400")], cpc, "CPC = spend / clicks."),
  "roas-calculator": C([cl("r", "Revenue from ads", "5000"), cl("s", "Ad spend", "1000"), cl("m", "Profit margin on sales %", "40", "Optional, for break-even")], roas, "ROAS = revenue / ad spend. A 4x ROAS means 4 earned per 1 spent."),
  "conversion-rate-calculator": C([cl("c", "Conversions", "50"), cl("v", "Visitors", "2500"), cl("p", "Average order value (optional)", "40")], conv),
  "adsense-earnings-calculator": C([cl("pv", "Page views per day", "1000"), cl("ap", "Ads per page", "3"), cl("ctr", "Ad CTR %", "1"), cl("cpc", "Average CPC", "0.25")], adsense, "Earnings = page views x ads per page x CTR x CPC. Real income varies by country, niche and season."),
  "ab-test-significance-calculator": C([cl("na", "Visitors A", "5000"), cl("ca", "Conversions A", "250"), cl("nb", "Visitors B", "5000"), cl("cb", "Conversions B", "290")], abtest, "Two-sided z-test for two proportions. Decide the sample size before the test and avoid stopping early."),
  "ltv-cac-calculator": C([cl("a", "Revenue per customer per month", "30"), cl("m", "Gross margin %", "70"), cl("l", "Customer lifetime (months)", "18"), cl("c", "Cost to acquire a customer (CAC)", "120")], ltv, "A common healthy LTV:CAC ratio is 3:1 or more."),
  "engagement-rate-calculator": C([cl("l", "Likes", "320"), cl("c", "Comments", "24"), cl("s", "Shares", "10"), cl("sv", "Saves (optional)", "15"), cl("f", "Followers", "8000"), cl("r", "Reach (optional)", "")], engage, "Instagram and TikTok engagement of 1 to 5 percent is common."),
  "youtube-money-calculator": C([cl("v", "Views", "100000"), cl("lo", "RPM low", "1"), cl("hi", "RPM high", "5")], ytMoney, "RPM is revenue per 1,000 views after YouTube's share. It varies widely by niche and audience country."),
};
void Select;
