"use client";
/* eslint-disable react/display-name */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as yaml from "js-yaml";
import { CopyButton, Field, OutputBox, Select, TextArea, TextInput, ToolCard } from "./ui";
import { Calc, TextXform, num, N } from "./calc-kit";

const X = (fn: (s: string) => string, placeholder: string, rows = 8) => () => <TextXform fn={fn} placeholder={placeholder} rows={rows} />;
function Modes({ modes, placeholder }: { modes: [string, string, (s: string) => string][]; placeholder: string }) {
  const [m, setM] = useState(modes[0][0]);
  const f = modes.find((x) => x[0] === m)![2];
  return (
    <div className="space-y-3">
      <Select value={m} onChange={(e) => setM(e.target.value)}>{modes.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Select>
      <TextXform key={m} fn={f} placeholder={placeholder} />
    </div>
  );
}
const enc = new TextEncoder();
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b as ArrayBuffer)].map((x) => x.toString(16).padStart(2, "0")).join("");

/* hashes */
function Hash({ algo, hmac }: { algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"; hmac?: boolean }) {
  const [t, setT] = useState("");
  const [k, setK] = useState("secret");
  const [out, setOut] = useState("");
  useEffect(() => {
    let off = false;
    (async () => {
      if (!t) return setOut("");
      try {
        if (hmac) {
          const key = await crypto.subtle.importKey("raw", enc.encode(k), { name: "HMAC", hash: algo }, false, ["sign"]);
          const r = await crypto.subtle.sign("HMAC", key, enc.encode(t));
          if (!off) setOut(hex(r));
        } else {
          const r = await crypto.subtle.digest(algo, enc.encode(t));
          if (!off) setOut(hex(r));
        }
      } catch { if (!off) setOut("Hashing is not supported in this browser."); }
    })();
    return () => { off = true; };
  }, [t, k, algo, hmac]);
  return (
    <ToolCard>
      <Field label="Text"><TextArea rows={5} value={t} placeholder="Type or paste text..." onChange={(e) => setT(e.target.value)} /></Field>
      {hmac ? <div className="mt-3"><Field label="Secret key"><TextInput type="text" value={k} onChange={(e) => setK(e.target.value)} /></Field></div> : null}
      <div className="mt-4"><div className="mb-1.5 text-sm font-medium text-text-secondary">{hmac ? `HMAC-${algo}` : algo} (hex)</div><OutputBox value={out} rows={3} /></div>
      <div className="mt-3"><CopyButton getText={() => out} /></div>
    </ToolCard>
  );
}
const CRC_T = (() => { const t: number[] = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t.push(c >>> 0); } return t; })();
const crc32 = (s: string) => { let c = 0xffffffff; for (const b of enc.encode(s)) c = CRC_T[(c ^ b) & 255] ^ (c >>> 8); const v = (c ^ 0xffffffff) >>> 0; return `Hex: ${v.toString(16).padStart(8, "0")}\nDecimal: ${v}`; };

/* base32 / base64url */
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const b32enc = (s: string) => { let bits = "", o = ""; for (const b of enc.encode(s)) bits += b.toString(2).padStart(8, "0"); for (let i = 0; i < bits.length; i += 5) o += B32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)]; while (o.length % 8) o += "="; return o; };
const b32dec = (s: string) => { let bits = ""; for (const c of s.toUpperCase().replace(/=+$/, "").replace(/\s/g, "")) { const i = B32.indexOf(c); if (i < 0) throw new Error("bad"); bits += i.toString(2).padStart(5, "0"); } const b: number[] = []; for (let i = 0; i + 8 <= bits.length; i += 8) b.push(parseInt(bits.slice(i, i + 8), 2)); return new TextDecoder().decode(new Uint8Array(b)); };
const b64u = (s: string) => { let bin = ""; enc.encode(s).forEach((b) => (bin += String.fromCharCode(b))); return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const b64ud = (s: string) => { const p = s.trim().replace(/-/g, "+").replace(/_/g, "/"); const bin = atob(p + "=".repeat((4 - (p.length % 4)) % 4)); return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))); };

/* html entities */
const ENT: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "©": "&copy;", "®": "&reg;", "™": "&trade;", "€": "&euro;", "£": "&pound;", "¥": "&yen;", "°": "&deg;", "—": "&mdash;", "–": "&ndash;", "…": "&hellip;", "\u00a0": "&nbsp;", "«": "&laquo;", "»": "&raquo;", "×": "&times;", "÷": "&divide;" };
const entEnc = (s: string) => [...s].map((c) => ENT[c] ?? (c.codePointAt(0)! > 127 ? `&#${c.codePointAt(0)};` : c)).join("");
const REV = Object.fromEntries(Object.entries(ENT).map(([k, v]) => [v, k]));
const entDec = (s: string) => s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&[a-z]+;/gi, (m) => REV[m.toLowerCase()] ?? m);

/* json helpers */
const pj = (s: string) => JSON.parse(s);
const jsonToYaml = (s: string) => yaml.dump(pj(s), { indent: 2, lineWidth: 100 });
const sortKeys = (v: unknown): unknown => Array.isArray(v) ? v.map(sortKeys) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])])) : v;
const jsonSort = (s: string) => JSON.stringify(sortKeys(pj(s)), null, 2);
const flat = (v: unknown, p = "", o: Record<string, unknown> = {}): Record<string, unknown> => { if (v && typeof v === "object") { const e = Object.entries(v as object); if (!e.length) o[p] = Array.isArray(v) ? [] : {}; for (const [k, x] of e) flat(x, p ? (Array.isArray(v) ? `${p}[${k}]` : `${p}.${k}`) : k, o); } else o[p] = v; return o; };
const jsonFlatten = (s: string) => JSON.stringify(flat(pj(s)), null, 2);
const jsonStr = (s: string) => JSON.stringify(s);
const jsonUnstr = (s: string) => { const r = JSON.parse(s.trim().startsWith('"') ? s.trim() : `"${s.trim()}"`); return String(r); };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const pas = (k: string) => k.split(/[^A-Za-z0-9]+/).filter(Boolean).map(cap).join("") || "Item";
function tsType(v: unknown, name: string, out: string[], ind = ""): string {
  if (v === null) return "null";
  if (Array.isArray(v)) { if (!v.length) return "unknown[]"; const ts = [...new Set(v.map((x) => tsType(x, name + "Item", out)))]; return (ts.length > 1 ? `(${ts.join(" | ")})` : ts[0]) + "[]"; }
  if (typeof v === "object") {
    const lines = Object.entries(v as object).map(([k, x]) => `  ${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${tsType(x, pas(k), out)};`);
    const n = name; out.push(`export interface ${n} {\n${lines.join("\n")}\n}`); return n;
  }
  return typeof v;
}
const jsonToTs = (s: string) => { const out: string[] = []; const v = pj(s); const t = tsType(Array.isArray(v) ? v[0] ?? {} : v, "Root", out); void t; return out.join("\n\n") + (Array.isArray(v) ? "\n\nexport type RootList = Root[];" : ""); };
function goType(v: unknown, name: string, out: string[]): string {
  if (v === null) return "interface{}";
  if (Array.isArray(v)) return "[]" + (v.length ? goType(v[0], name + "Item", out) : "interface{}");
  if (typeof v === "object") {
    const lines = Object.entries(v as object).map(([k, x]) => `\t${pas(k)} ${goType(x, pas(k), out)} \`json:"${k}"\``);
    out.push(`type ${name} struct {\n${lines.join("\n")}\n}`); return name;
  }
  return typeof v === "number" ? (Number.isInteger(v) ? "int" : "float64") : typeof v === "boolean" ? "bool" : "string";
}
const jsonToGo = (s: string) => { const out: string[] = []; const v = pj(s); goType(Array.isArray(v) ? v[0] ?? {} : v, "Root", out); return out.join("\n\n"); };
const qsToJson = (s: string) => { const q = s.trim().replace(/^.*\?/, "").replace(/#.*$/, ""); const o: Record<string, string | string[]> = {}; new URLSearchParams(q).forEach((v, k) => { const c = o[k]; o[k] = c === undefined ? v : Array.isArray(c) ? [...c, v] : [c, v]; }); return JSON.stringify(o, null, 2); };
const jsonToQs = (s: string) => { const p = new URLSearchParams(); for (const [k, v] of Object.entries(pj(s))) (Array.isArray(v) ? v : [v]).forEach((x) => p.append(k, String(x))); return p.toString(); };

/* minifiers */
const cssMin = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>~])\s*/g, "$1").replace(/;}/g, "}").trim();
const sqlMin = (s: string) => s.replace(/--[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([(),;=])\s*/g, "$1").trim();
const xmlMin = (s: string) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").trim();

/* sql helpers */
const sqlVal = (v: string) => (v === "" ? "NULL" : /^-?\d+(\.\d+)?$/.test(v) ? v : `'${v.replace(/'/g, "''")}'`);
function parseCsv(s: string): string[][] { const rows: string[][] = []; let r: string[] = [], f = "", q = false; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ",") { r.push(f); f = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; r.push(f); rows.push(r); r = []; f = ""; } else f += c; } if (f || r.length) { r.push(f); rows.push(r); } return rows.filter((x) => x.some((y) => y !== "")); }
const csvToInsert = (s: string) => { const [h, ...b] = parseCsv(s); if (!h || !b.length) throw new Error("x"); const cols = h.map((c) => c.trim().replace(/\W+/g, "_")); return b.map((r) => `INSERT INTO my_table (${cols.join(", ")}) VALUES (${cols.map((_, i) => sqlVal(r[i] ?? "")).join(", ")});`).join("\n"); };
const jsonToInsert = (s: string) => { const a = pj(s); const arr: Record<string, unknown>[] = Array.isArray(a) ? a : [a]; const cols = [...new Set(arr.flatMap((o) => Object.keys(o)))]; return arr.map((o) => `INSERT INTO my_table (${cols.join(", ")}) VALUES (${cols.map((c) => { const v = o[c]; return v == null ? "NULL" : typeof v === "number" || typeof v === "boolean" ? String(v) : sqlVal(typeof v === "object" ? JSON.stringify(v) : String(v)); }).join(", ")});`).join("\n"); };
const sqlIn = (s: string) => { const items = s.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean); return `IN (${items.map(sqlVal).join(", ")})`; };
const sqlEscape = (s: string) => s.replace(/'/g, "''");
const mdTable = (s: string) => { const rows = (s.includes("\t") ? s.split(/\r?\n/).filter(Boolean).map((l) => l.split("\t")) : parseCsv(s)); if (rows.length < 1) throw new Error("x"); const w = Math.max(...rows.map((r) => r.length)); const n = rows.map((r) => Array.from({ length: w }, (_, i) => (r[i] ?? "").trim().replace(/\|/g, "\\|"))); const line = (r: string[]) => `| ${r.join(" | ")} |`; return [line(n[0]), line(Array(w).fill("---")), ...n.slice(1).map(line)].join("\n"); };

/* random generators */
const rnd = (n: number) => { const a = new Uint32Array(n); crypto.getRandomValues(a); return a; };
const CROCK = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ulid = () => { let t = Date.now(), ts = ""; for (let i = 0; i < 10; i++) { ts = CROCK[t % 32] + ts; t = Math.floor(t / 32); } const r = rnd(16); return ts + [...r].map((x) => CROCK[x % 32]).join(""); };
const nano = (len: number) => { const A = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"; return [...rnd(len)].map((x) => A[x % 64]).join(""); };
function Gen({ make, label, lenDefault }: { make: (len: number) => string; label: string; lenDefault?: number }) {
  const [len, setLen] = useState(String(lenDefault ?? 21));
  const [cnt, setCnt] = useState("5");
  const [seed, setSeed] = useState(0);
  const out = useMemo(() => { void seed; const L = Math.min(Math.max(parseInt(len) || 1, 1), 256); const C = Math.min(Math.max(parseInt(cnt) || 1, 1), 100); if (typeof crypto === "undefined") return ""; return Array.from({ length: C }, () => make(L)).join("\n"); }, [len, cnt, seed, make]);
  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        {lenDefault !== undefined ? <Field label={label}><TextInput type="number" value={len} onChange={(e) => setLen(e.target.value)} /></Field> : null}
        <Field label="How many"><TextInput type="number" value={cnt} onChange={(e) => setCnt(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><OutputBox value={out} rows={8} /></div>
      <div className="mt-3 flex gap-3"><button type="button" className="rounded-lg bg-accent-default px-4 py-2 text-sm font-medium text-white" onClick={() => setSeed(seed + 1)}>Generate again</button><CopyButton getText={() => out} /></div>
    </ToolCard>
  );
}
const RS_SETS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const randStr = (len: number) => [...rnd(len)].map((x) => RS_SETS[x % RS_SETS.length]).join("");
const macGen = () => [...rnd(6)].map((x, i) => (i === 0 ? (x % 256) & 0xfc : x % 256).toString(16).padStart(2, "0")).join(":");

/* networking */
const ip2n = (s: string) => { const p = s.trim().split("."); if (p.length !== 4 || p.some((x) => !/^\d+$/.test(x) || +x > 255)) throw new Error("bad"); return p.reduce((a, x) => a * 256 + +x, 0); };
const n2ip = (n: number) => [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join(".");
const ipConv = (s: string) => { const t = s.trim(); if (/^\d+$/.test(t)) { const n = +t; if (n > 4294967295) throw new Error("x"); return `IPv4: ${n2ip(n)}\nHex: 0x${n.toString(16).toUpperCase().padStart(8, "0")}`; } const n = ip2n(t); return `Decimal: ${n}\nHex: 0x${n.toString(16).toUpperCase().padStart(8, "0")}\nBinary: ${t.split(".").map((x) => (+x).toString(2).padStart(8, "0")).join(".")}`; };
function subnet(v: Record<string, string>): [string, string][] | string {
  const ip = ip2n(v.ip), p = Math.floor(N(v.prefix));
  if (!(p >= 0 && p <= 32)) return "Prefix must be between 0 and 32.";
  const size = 2 ** (32 - p), net = Math.floor(ip / size) * size, bc = net + size - 1;
  const mask = p === 0 ? 0 : 2 ** 32 - size;
  const usable = p >= 31 ? size : size - 2;
  return [["Network", n2ip(net)], ["Broadcast", n2ip(bc)], ["Subnet mask", n2ip(mask)], ["Wildcard mask", n2ip(2 ** 32 - 1 - mask)], ["First host", n2ip(p >= 31 ? net : net + 1)], ["Last host", n2ip(p >= 31 ? bc : bc - 1)], ["Usable hosts", usable.toLocaleString("en-US")], ["Total addresses", size.toLocaleString("en-US")]];
}
const cidrRange = (s: string) => { const [a, b] = s.trim().split("/"); const r = subnet({ ip: a, prefix: b }); if (typeof r === "string") return r; return r.map(([k, x]) => `${k}: ${x}`).join("\n"); };
const ipCheck = (s: string) => s.split("\n").filter((l) => l.trim()).map((l) => { const t = l.trim(); const v4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(t); let v6 = false; if (!v4 && t.includes(":")) { try { v6 = new URL(`http://[${t}]/`).hostname.length > 0; } catch { v6 = false; } } return `${t}: ${v4 ? "valid IPv4" : v6 ? "valid IPv6" : "not a valid IP address"}`; }).join("\n");
const PORTS: [number, string, string][] = [[20, "FTP data", "TCP"], [21, "FTP control", "TCP"], [22, "SSH / SFTP", "TCP"], [23, "Telnet", "TCP"], [25, "SMTP mail", "TCP"], [53, "DNS", "TCP/UDP"], [67, "DHCP server", "UDP"], [68, "DHCP client", "UDP"], [69, "TFTP", "UDP"], [80, "HTTP", "TCP"], [110, "POP3", "TCP"], [123, "NTP time", "UDP"], [143, "IMAP", "TCP"], [161, "SNMP", "UDP"], [389, "LDAP", "TCP"], [443, "HTTPS", "TCP"], [465, "SMTPS", "TCP"], [587, "SMTP submission", "TCP"], [636, "LDAPS", "TCP"], [993, "IMAPS", "TCP"], [995, "POP3S", "TCP"], [1433, "Microsoft SQL Server", "TCP"], [1521, "Oracle DB", "TCP"], [3000, "Node/React dev server", "TCP"], [3306, "MySQL / MariaDB", "TCP"], [3389, "Remote Desktop (RDP)", "TCP"], [5000, "Flask dev server", "TCP"], [5432, "PostgreSQL", "TCP"], [5672, "RabbitMQ", "TCP"], [5900, "VNC", "TCP"], [6379, "Redis", "TCP"], [8000, "Django dev server", "TCP"], [8080, "HTTP alternate / proxy", "TCP"], [8443, "HTTPS alternate", "TCP"], [9000, "PHP-FPM / SonarQube", "TCP"], [9200, "Elasticsearch", "TCP"], [27017, "MongoDB", "TCP"]];
const MIMES: [string, string][] = [["html", "text/html"], ["css", "text/css"], ["js", "text/javascript"], ["mjs", "text/javascript"], ["json", "application/json"], ["xml", "application/xml"], ["csv", "text/csv"], ["txt", "text/plain"], ["md", "text/markdown"], ["pdf", "application/pdf"], ["zip", "application/zip"], ["gz", "application/gzip"], ["tar", "application/x-tar"], ["7z", "application/x-7z-compressed"], ["rar", "application/vnd.rar"], ["doc", "application/msword"], ["docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], ["xls", "application/vnd.ms-excel"], ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], ["ppt", "application/vnd.ms-powerpoint"], ["pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation"], ["png", "image/png"], ["jpg", "image/jpeg"], ["jpeg", "image/jpeg"], ["gif", "image/gif"], ["webp", "image/webp"], ["avif", "image/avif"], ["svg", "image/svg+xml"], ["ico", "image/x-icon"], ["bmp", "image/bmp"], ["tiff", "image/tiff"], ["mp3", "audio/mpeg"], ["wav", "audio/wav"], ["ogg", "audio/ogg"], ["m4a", "audio/mp4"], ["flac", "audio/flac"], ["mp4", "video/mp4"], ["webm", "video/webm"], ["mov", "video/quicktime"], ["avi", "video/x-msvideo"], ["mkv", "video/x-matroska"], ["woff", "font/woff"], ["woff2", "font/woff2"], ["ttf", "font/ttf"], ["otf", "font/otf"], ["wasm", "application/wasm"], ["apk", "application/vnd.android.package-archive"], ["exe", "application/vnd.microsoft.portable-executable"], ["epub", "application/epub+zip"], ["yaml", "application/yaml"], ["ics", "text/calendar"], ["rtf", "application/rtf"], ["sql", "application/sql"], ["php", "application/x-httpd-php"], ["sh", "application/x-sh"]];
function Lookup({ rows, cols, placeholder }: { rows: string[][]; cols: string[]; placeholder: string }) {
  const [q, setQ] = useState("");
  const f = rows.filter((r) => !q.trim() || r.some((c) => c.toLowerCase().includes(q.trim().toLowerCase().replace(/^\./, ""))));
  return (
    <ToolCard>
      <Field label="Search"><TextInput type="text" value={q} placeholder={placeholder} onChange={(e) => setQ(e.target.value)} /></Field>
      <div className="mt-4 max-h-96 overflow-auto rounded-lg border border-border-default">
        <table className="w-full text-left text-sm"><thead className="sticky top-0 bg-bg-subtle"><tr>{cols.map((c) => <th key={c} className="px-3 py-2 font-medium">{c}</th>)}</tr></thead>
          <tbody>{f.map((r, i) => <tr key={i} className="border-t border-border-default">{r.map((c, j) => <td key={j} className="px-3 py-1.5 break-all">{c}</td>)}</tr>)}{!f.length ? <tr><td className="px-3 py-3 text-text-muted" colSpan={cols.length}>No match.</td></tr> : null}</tbody></table>
      </div>
    </ToolCard>
  );
}

/* css units + generators */
const Px = (mode: "px2rem" | "px2em" | "rem2px") => () => (
  <Calc
    fields={[{ k: "v", label: mode === "rem2px" ? "Value in rem" : mode === "px2em" ? "Value in px" : "Value in px", def: "24" }, { k: "base", label: "Base font size (px)", def: "16" }]}
    compute={(v) => { const x = N(v.v), b = N(v.base); if (!Number.isFinite(x) || !(b > 0)) return "Enter a value and a base size above 0."; return mode === "rem2px" ? [["Pixels", num(x * b) + " px"], ["Value", num(x) + " rem"]] : [[mode === "px2rem" ? "rem" : "em", num(x / b) + (mode === "px2rem" ? " rem" : " em")]]; }}
    note="1rem equals the root font size, 16px by default in most browsers. em is relative to the parent element."
  />
);
function Clamp() {
  return (
    <Calc
      fields={[{ k: "min", label: "Min size (px)", def: "16" }, { k: "max", label: "Max size (px)", def: "32" }, { k: "vmin", label: "Min viewport (px)", def: "375" }, { k: "vmax", label: "Max viewport (px)", def: "1280" }]}
      compute={(v) => { const a = N(v.min), b = N(v.max), x = N(v.vmin), y = N(v.vmax); if (![a, b, x, y].every(Number.isFinite) || y <= x) return "Max viewport must be larger than min viewport."; const slope = (b - a) / (y - x); const base = a - slope * x; return [["CSS", `clamp(${num(a / 16)}rem, ${num(base / 16)}rem + ${num(slope * 100)}vw, ${num(b / 16)}rem)`]]; }}
      note="Fluid type: the size scales linearly between the two viewport widths and stays within the min and max."
    />
  );
}
function Visual({ fields, css, prop }: { fields: { k: string; label: string; def: string; min: number; max: number }[]; css: (v: Record<string, number>) => string; prop: "box-shadow" | "text-shadow" | "border-radius" }) {
  const [v, setV] = useState<Record<string, number>>(() => Object.fromEntries(fields.map((f) => [f.k, +f.def])));
  const val = css(v);
  const style: React.CSSProperties = prop === "text-shadow" ? { textShadow: val } : prop === "box-shadow" ? { boxShadow: val } : { borderRadius: val };
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-2">{fields.map((f) => <label key={f.k} className="text-sm"><span className="mb-1 flex justify-between text-text-secondary"><span>{f.label}</span><span>{v[f.k]}</span></span><input type="range" className="w-full" min={f.min} max={f.max} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: +e.target.value })} /></label>)}</div>
      <div className="mt-5 flex h-40 items-center justify-center rounded-xl bg-bg-subtle"><div className="flex h-24 w-40 items-center justify-center bg-white text-2xl font-bold text-gray-800" style={style}>Preview</div></div>
      <div className="mt-4"><OutputBox value={`${prop}: ${val};`} rows={2} /></div>
      <div className="mt-3"><CopyButton getText={() => `${prop}: ${val};`} /></div>
    </ToolCard>
  );
}
const TextShadow = () => <Visual prop="text-shadow" fields={[{ k: "x", label: "Horizontal", def: "3", min: -30, max: 30 }, { k: "y", label: "Vertical", def: "3", min: -30, max: 30 }, { k: "b", label: "Blur", def: "6", min: 0, max: 40 }, { k: "a", label: "Opacity %", def: "40", min: 0, max: 100 }]} css={(v) => `${v.x}px ${v.y}px ${v.b}px rgba(0, 0, 0, ${v.a / 100})`} />;
function Flex() {
  const [dir, setDir] = useState("row"), [jc, setJc] = useState("flex-start"), [ai, setAi] = useState("stretch"), [wrap, setWrap] = useState("nowrap"), [gap, setGap] = useState("8"), [n, setN] = useState("4");
  const css = `display: flex;\nflex-direction: ${dir};\njustify-content: ${jc};\nalign-items: ${ai};\nflex-wrap: ${wrap};\ngap: ${gap}px;`;
  const sel = (label: string, val: string, set: (s: string) => void, opts: string[]) => <Field label={label}><Select value={val} onChange={(e) => set(e.target.value)}>{opts.map((o) => <option key={o}>{o}</option>)}</Select></Field>;
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">{sel("flex-direction", dir, setDir, ["row", "row-reverse", "column", "column-reverse"])}{sel("justify-content", jc, setJc, ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"])}{sel("align-items", ai, setAi, ["stretch", "flex-start", "center", "flex-end", "baseline"])}{sel("flex-wrap", wrap, setWrap, ["nowrap", "wrap", "wrap-reverse"])}<Field label="gap (px)"><TextInput type="number" value={gap} onChange={(e) => setGap(e.target.value)} /></Field><Field label="Items"><TextInput type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field></div>
      <div className="mt-5 h-48 overflow-auto rounded-xl border border-border-default bg-bg-subtle p-2"><div style={{ display: "flex", flexDirection: dir as "row", justifyContent: jc, alignItems: ai, flexWrap: wrap as "wrap", gap: +gap || 0, minHeight: "100%" }}>{Array.from({ length: Math.min(Math.max(+n || 1, 1), 12) }, (_, i) => <div key={i} className="rounded bg-accent-default px-4 py-3 text-sm font-bold text-white" style={{ height: i % 2 ? 40 : 56 }}>{i + 1}</div>)}</div></div>
      <div className="mt-4"><OutputBox value={css} rows={6} /></div><div className="mt-3"><CopyButton getText={() => css} /></div>
    </ToolCard>
  );
}
function Grid() {
  const [c, setC] = useState("3"), [r, setR] = useState("2"), [gap, setGap] = useState("12"), [unit, setUnit] = useState("1fr");
  const C = Math.min(Math.max(+c || 1, 1), 12), R = Math.min(Math.max(+r || 1, 1), 12);
  const css = `display: grid;\ngrid-template-columns: repeat(${C}, ${unit});\ngrid-template-rows: repeat(${R}, auto);\ngap: ${gap}px;`;
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-4"><Field label="Columns"><TextInput type="number" value={c} onChange={(e) => setC(e.target.value)} /></Field><Field label="Rows"><TextInput type="number" value={r} onChange={(e) => setR(e.target.value)} /></Field><Field label="Gap (px)"><TextInput type="number" value={gap} onChange={(e) => setGap(e.target.value)} /></Field><Field label="Column size"><Select value={unit} onChange={(e) => setUnit(e.target.value)}>{["1fr", "auto", "minmax(0, 1fr)", "100px", "200px"].map((o) => <option key={o}>{o}</option>)}</Select></Field></div>
      <div className="mt-5 rounded-xl border border-border-default bg-bg-subtle p-2"><div style={{ display: "grid", gridTemplateColumns: `repeat(${C}, ${unit})`, gap: +gap || 0 }}>{Array.from({ length: C * R }, (_, i) => <div key={i} className="rounded bg-accent-default py-4 text-center text-sm font-bold text-white">{i + 1}</div>)}</div></div>
      <div className="mt-4"><OutputBox value={css} rows={5} /></div><div className="mt-3"><CopyButton getText={() => css} /></div>
    </ToolCard>
  );
}
function specificity(sel: string) {
  const s = sel.replace(/:not\(([^)]*)\)/g, " $1 ").replace(/"[^"]*"|'[^']*'/g, "");
  const ids = (s.match(/#[\w-]+/g) ?? []).length;
  const attrs = (s.match(/\[[^\]]*\]/g) ?? []).length, cls = (s.match(/\.[\w-]+/g) ?? []).length;
  const pseudoEl = (s.match(/::[\w-]+/g) ?? []).length;
  const pseudoCl = (s.replace(/::[\w-]+/g, "").match(/:[\w-]+(?:\([^)]*\))?/g) ?? []).filter((p) => !/^:(where)/.test(p)).length;
  const stripped = s.replace(/\[[^\]]*\]|#[\w-]+|\.[\w-]+|::?[\w-]+(\([^)]*\))?/g, " ");
  const el = (stripped.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length + pseudoEl;
  return [ids, attrs + cls + pseudoCl, el];
}
const specOut = (s: string) => s.split("\n").filter((l) => l.trim()).map((l) => { const [a, b, c] = specificity(l.trim()); return `${l.trim()}\n  specificity (${a}, ${b}, ${c})`; }).join("\n\n");
function semver(v: Record<string, string>): [string, string][] | string {
  const m = v.ver.trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)(?:-([\w.]+))?$/);
  if (!m) return "Enter a version like 1.4.2 or 2.0.0-beta.1.";
  const [a, b, c] = [+m[1], +m[2], +m[3]];
  return [["Patch", `${a}.${b}.${c + 1}`], ["Minor", `${a}.${b + 1}.0`], ["Major", `${a + 1}.0.0`], ["Premajor", `${a + 1}.0.0-0`]];
}
const SemverTool = () => <Calc fields={[{ k: "ver", label: "Current version", def: "1.4.2", type: "text" }]} compute={semver} note="Patch for bug fixes, minor for backward compatible features, major for breaking changes." />;
const Subnet = () => <Calc fields={[{ k: "ip", label: "IPv4 address", def: "192.168.1.10", type: "text" }, { k: "prefix", label: "Prefix length (/n)", def: "24" }]} compute={subnet} />;

export const WAVE3: Record<string, () => ReactNode> = {
  "sha1-hash-generator": () => <Hash algo="SHA-1" />,
  "sha512-hash-generator": () => <Hash algo="SHA-512" />,
  "sha384-hash-generator": () => <Hash algo="SHA-384" />,
  "hmac-generator": () => <Hash algo="SHA-256" hmac />,
  "crc32-calculator": X(crc32, "Type text to get its CRC32 checksum...", 4),
  "base32-encode-decode": () => <Modes placeholder="Text or Base32" modes={[["e", "Encode to Base32", b32enc], ["d", "Decode from Base32", b32dec]]} />,
  "base64url-encode-decode": () => <Modes placeholder="Text or Base64URL" modes={[["e", "Encode to Base64URL", b64u], ["d", "Decode from Base64URL", b64ud]]} />,
  "html-entities-encoder-decoder": () => <Modes placeholder="<p>Tom & Jerry © 2026</p>" modes={[["e", "Encode to HTML entities", entEnc], ["d", "Decode HTML entities", entDec]]} />,
  "json-to-yaml-converter": X(jsonToYaml, '{"name": "app", "ports": [80, 443]}'),
  "json-sort-keys": X(jsonSort, '{"b": 1, "a": {"d": 1, "c": 2}}'),
  "json-flatten-tool": X(jsonFlatten, '{"user": {"name": "Sam", "tags": ["a", "b"]}}'),
  "json-stringify-escape": () => <Modes placeholder='Paste text or a JSON string' modes={[["e", "Escape text as a JSON string", jsonStr], ["d", "Unescape a JSON string", jsonUnstr]]} />,
  "json-to-typescript": X(jsonToTs, '{"id": 1, "name": "Sam", "tags": ["a"]}'),
  "json-to-go-struct": X(jsonToGo, '{"id": 1, "name": "Sam", "active": true}'),
  "json-to-sql-insert": X(jsonToInsert, '[{"id": 1, "name": "Sam"}, {"id": 2, "name": "Lea"}]'),
  "csv-to-sql-insert": X(csvToInsert, "id,name\n1,Sam\n2,Lea"),
  "sql-in-clause-generator": X(sqlIn, "one item per line or comma separated", 6),
  "sql-escape-string": X(sqlEscape, "It's a string with 'quotes'", 4),
  "csv-to-markdown-table": X(mdTable, "name,role\nSam,Dev\nLea,Designer"),
  "query-string-to-json": X(qsToJson, "https://example.com/?a=1&b=2&b=3", 6),
  "json-to-query-string": X(jsonToQs, '{"q": "tools", "page": 2}', 4),
  "css-minifier": X(cssMin, "Paste CSS to minify..."),
  "sql-minifier": X(sqlMin, "SELECT *\nFROM users\nWHERE id = 1;"),
  "xml-minifier": X(xmlMin, "<root>\n  <a>1</a>\n</root>"),
  "ulid-generator": () => <Gen make={ulid} label="" />,
  "nanoid-generator": () => <Gen make={nano} label="Length" lenDefault={21} />,
  "random-string-generator": () => <Gen make={randStr} label="Length" lenDefault={16} />,
  "mac-address-generator": () => <Gen make={macGen} label="" />,
  "subnet-calculator": Subnet,
  "cidr-to-ip-range": X(cidrRange, "192.168.0.0/22", 4),
  "ip-to-decimal-converter": X(ipConv, "192.168.1.1 or 3232235777", 4),
  "ip-address-validator": X(ipCheck, "One IP address per line", 6),
  "port-numbers-lookup": () => <Lookup cols={["Port", "Service", "Protocol"]} rows={PORTS.map((p) => [String(p[0]), p[1], p[2]])} placeholder="Port or service, e.g. 5432 or redis" />,
  "mime-types-lookup": () => <Lookup cols={["Extension", "MIME type"]} rows={MIMES.map((m) => ["." + m[0], m[1]])} placeholder="Extension or type, e.g. webp or video" />,
  "px-to-rem-converter": Px("px2rem"),
  "px-to-em-converter": Px("px2em"),
  "rem-to-px-converter": Px("rem2px"),
  "css-clamp-generator": () => <Clamp />,
  "css-text-shadow-generator": TextShadow,
  "css-flexbox-generator": () => <Flex />,
  "css-grid-generator": () => <Grid />,
  "css-specificity-calculator": X(specOut, ".nav ul li a:hover\n#header .logo", 6),
  "semver-bump-calculator": SemverTool,
};
