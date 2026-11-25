"use client";
/* eslint-disable react/display-name, @next/next/no-img-element */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Alert, Button, CopyButton, Dropzone, Field, OutputBox, Select, TextArea, TextInput, ToolCard, downloadBlob } from "./ui";

const dl = (name: string, text: string, mime: string) => downloadBlob(name, new Blob([text], { type: mime }));
const clean = (s: string) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...").replace(/[^\x09\x0A\x20-\x7E\xA0-\xFF]/g, "?");

/* ---------- tiny PDF text layout with pdf-lib ---------- */
type Ln = { t: string; size?: number; bold?: boolean; x?: number; gap?: number; right?: boolean };
async function textPdf(lines: Ln[]) {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595, H = 842, M = 50;
  let page = doc.addPage([W, H]), y = H - M;
  for (const l of lines) {
    const size = l.size ?? 10.5, font = l.bold ? bold : reg, max = W - M * 2 - (l.x ?? 0);
    const words = clean(l.t).split(/\s+/); let cur = ""; const out: string[] = [];
    if (!clean(l.t).trim()) out.push("");
    for (const w of words) { const t = cur ? cur + " " + w : w; if (font.widthOfTextAtSize(t, size) > max && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur);
    for (const o of out) {
      if (y < M + size) { page = doc.addPage([W, H]); y = H - M; }
      if (o) { const x = l.right ? W - M - font.widthOfTextAtSize(o, size) : M + (l.x ?? 0); page.drawText(o, { x, y: y - size, size, font, color: rgb(0.1, 0.1, 0.12) }); }
      y -= size * 1.4;
    }
    y -= l.gap ?? 0;
  }
  return new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
}

/* ---------- Resume builder ---------- */
const Resume = () => {
  const [v, setV] = useState({ name: "Your Name", title: "Software Engineer", email: "you@email.com", phone: "+1 555 0100", loc: "City, Country", summary: "Results-driven professional with 5 years of experience delivering reliable products and working well in small teams.", exp: "Senior Developer | Acme Inc | 2022 - Present\n- Led a team of 4 and shipped a new checkout that raised conversion by 12%\n- Cut page load time from 4s to 1.5s\n\nDeveloper | Beta Ltd | 2019 - 2022\n- Built internal tools used by 200 staff", edu: "BSc Computer Science | State University | 2015 - 2019", skills: "JavaScript, TypeScript, React, Node.js, SQL, Git" });
  const [busy, setBusy] = useState(false);
  const set = (k: string, x: string) => setV((p) => ({ ...p, [k]: x }));
  const lines = (): Ln[] => {
    const L: Ln[] = [{ t: v.name, size: 24, bold: true }, { t: v.title, size: 13 }, { t: [v.email, v.phone, v.loc].filter(Boolean).join("  |  "), size: 9.5, gap: 10 }];
    const sec = (h: string, body: string) => { if (!body.trim()) return; L.push({ t: h.toUpperCase(), size: 11, bold: true, gap: 2 }); body.split("\n").forEach((r) => L.push(/^\s*[-*•]/.test(r) ? { t: "- " + r.replace(/^\s*[-*•]\s*/, ""), x: 10 } : /\|/.test(r) ? { t: r, bold: true } : { t: r })); L.push({ t: "", gap: 4 }); };
    sec("Summary", v.summary); sec("Experience", v.exp); sec("Education", v.edu); sec("Skills", v.skills); return L;
  };
  const html = () => `<!doctype html><meta charset="utf-8"><title>${v.name}</title><body style="font-family:Arial;max-width:760px;margin:30px auto;color:#111"><h1>${v.name}</h1><p>${v.title}<br><small>${[v.email, v.phone, v.loc].filter(Boolean).join(" | ")}</small></p>${[["Summary", v.summary], ["Experience", v.exp], ["Education", v.edu], ["Skills", v.skills]].map(([h, b]) => `<h3>${h}</h3><p style="white-space:pre-wrap">${b.replace(/</g, "&lt;")}</p>`).join("")}</body>`;
  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        {([["name", "Full name"], ["title", "Job title"], ["email", "Email"], ["phone", "Phone"], ["loc", "Location"]] as const).map(([k, l]) => <Field key={k} label={l}><TextInput value={v[k]} onChange={(e) => set(k, e.target.value)} /></Field>)}
      </div>
      {([["summary", "Summary", 3], ["exp", "Experience (use | between title, company, dates; start bullets with -)", 9], ["edu", "Education", 3], ["skills", "Skills", 2]] as const).map(([k, l, r]) => <Field key={k} label={l}><TextArea rows={r} value={v[k]} onChange={(e) => set(k, e.target.value)} /></Field>)}
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={async () => { setBusy(true); downloadBlob("resume.pdf", await textPdf(lines())); setBusy(false); }}>{busy ? "Building..." : "Download PDF"}</Button>
        <Button variant="secondary" onClick={() => dl("resume.html", html(), "text/html")}>Download HTML</Button>
        <Button variant="secondary" onClick={() => dl("resume.txt", lines().map((l) => l.t).join("\n"), "text/plain")}>Download TXT</Button>
      </div>
      <p className="text-sm text-text-secondary">Free PDF, no watermark, no account. Your details stay in your browser.</p>
    </ToolCard>
  );
};

/* ---------- Invoice generator ---------- */
type Item = { d: string; q: string; p: string };
const Invoice = () => {
  const [h, setH] = useState({ no: "INV-001", date: new Date().toISOString().slice(0, 10), due: "", from: "Your Business\nyou@email.com", to: "Client Name\nclient@email.com", cur: "$", tax: "0", disc: "0", notes: "Thank you for your business." });
  const [items, setItems] = useState<Item[]>([{ d: "Design work", q: "10", p: "50" }, { d: "Hosting", q: "1", p: "120" }]);
  const set = (k: string, x: string) => setH((p) => ({ ...p, [k]: x }));
  const sub = items.reduce((a, i) => a + (+i.q || 0) * (+i.p || 0), 0), disc = sub * ((+h.disc || 0) / 100), tax = (sub - disc) * ((+h.tax || 0) / 100), total = sub - disc + tax;
  const m = (n: number) => h.cur + n.toFixed(2);
  const build = async () => {
    const L: Ln[] = [{ t: "INVOICE", size: 26, bold: true }, { t: `No: ${h.no}   Date: ${h.date}${h.due ? "   Due: " + h.due : ""}`, gap: 10 }, { t: "FROM", bold: true, size: 9 }, ...h.from.split("\n").map((t) => ({ t })), { t: "", gap: 4 }, { t: "BILL TO", bold: true, size: 9 }, ...h.to.split("\n").map((t) => ({ t })), { t: "", gap: 8 }, { t: "DESCRIPTION  x  QTY  x  PRICE  =  AMOUNT", bold: true, size: 9, gap: 2 }];
    items.forEach((i) => L.push({ t: `${i.d}  -  ${i.q} x ${m(+i.p || 0)}  =  ${m((+i.q || 0) * (+i.p || 0))}` }));
    L.push({ t: "", gap: 6 }, { t: `Subtotal: ${m(sub)}`, right: true });
    if (disc) L.push({ t: `Discount (${h.disc}%): -${m(disc)}`, right: true });
    if (tax) L.push({ t: `Tax (${h.tax}%): ${m(tax)}`, right: true });
    L.push({ t: `TOTAL: ${m(total)}`, bold: true, size: 14, right: true, gap: 12 }, { t: h.notes });
    downloadBlob(`${h.no || "invoice"}.pdf`, await textPdf(L));
  };
  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Invoice number"><TextInput value={h.no} onChange={(e) => set("no", e.target.value)} /></Field>
        <Field label="Date"><TextInput type="date" value={h.date} onChange={(e) => set("date", e.target.value)} /></Field>
        <Field label="Due date"><TextInput type="date" value={h.due} onChange={(e) => set("due", e.target.value)} /></Field>
        <Field label="Currency symbol"><TextInput value={h.cur} onChange={(e) => set("cur", e.target.value)} /></Field>
        <Field label="Tax %"><TextInput type="number" value={h.tax} onChange={(e) => set("tax", e.target.value)} /></Field>
        <Field label="Discount %"><TextInput type="number" value={h.disc} onChange={(e) => set("disc", e.target.value)} /></Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="From"><TextArea rows={3} value={h.from} onChange={(e) => set("from", e.target.value)} /></Field>
        <Field label="Bill to"><TextArea rows={3} value={h.to} onChange={(e) => set("to", e.target.value)} /></Field>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_90px_auto] gap-2">
            <TextInput aria-label="Description" value={it.d} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, d: e.target.value } : x)))} />
            <TextInput aria-label="Quantity" type="number" value={it.q} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
            <TextInput aria-label="Price" type="number" value={it.p} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, p: e.target.value } : x)))} />
            <Button variant="ghost" onClick={() => setItems(items.filter((_, j) => j !== i))}>x</Button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => setItems([...items, { d: "", q: "1", p: "0" }])}>Add item</Button>
      </div>
      <Field label="Notes"><TextArea rows={2} value={h.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
      <div className="rounded-lg bg-surface-50 p-4 text-sm dark:bg-surface-800">Subtotal {m(sub)} | Tax {m(tax)} | Discount {m(disc)} | <strong>Total {m(total)}</strong></div>
      <Button onClick={build}>Download invoice PDF</Button>
    </ToolCard>
  );
};

/* ---------- Mock data generator ---------- */
const FN = ["Olivia", "Liam", "Emma", "Noah", "Ava", "Omar", "Sofia", "Lucas", "Mia", "Ethan", "Layla", "Adam", "Nora", "Yusuf", "Chloe", "Leo"], LN = ["Smith", "Johnson", "Brown", "Garcia", "Miller", "Ali", "Davis", "Martin", "Lee", "Khan", "Walker", "Young", "Hall", "Allen"];
const CITY = ["New York", "London", "Cairo", "Berlin", "Tokyo", "Paris", "Toronto", "Sydney", "Dubai", "Madrid", "Mumbai", "Lagos"], CO = ["US", "UK", "EG", "DE", "JP", "FR", "CA", "AU", "AE", "ES", "IN", "NG"], DOM = ["example.com", "mail.test", "demo.org", "sample.net"], WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)], ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const hex = (n: number) => Array.from({ length: n }, () => ri(0, 15).toString(16)).join("");
const GEN: Record<string, [string, () => string | number | boolean]> = {
  id: ["Row number", () => 0], uuid: ["UUID", () => `${hex(8)}-${hex(4)}-4${hex(3)}-${pick(["8", "9", "a", "b"])}${hex(3)}-${hex(12)}`], first: ["First name", () => pick(FN)], last: ["Last name", () => pick(LN)],
  email: ["Email", () => `${pick(FN).toLowerCase()}.${pick(LN).toLowerCase()}${ri(1, 99)}@${pick(DOM)}`], phone: ["Phone", () => `+1 ${ri(200, 999)} ${ri(100, 999)} ${ri(1000, 9999)}`], city: ["City", () => pick(CITY)], country: ["Country code", () => pick(CO)],
  int: ["Integer 1-1000", () => ri(1, 1000)], price: ["Price", () => +(ri(100, 99900) / 100).toFixed(2)], bool: ["Boolean", () => Math.random() < 0.5], date: ["Date (past 5 years)", () => new Date(Date.now() - ri(0, 1825) * 864e5).toISOString().slice(0, 10)],
  word: ["Short text", () => Array.from({ length: ri(3, 7) }, () => pick(WORDS)).join(" ")], ip: ["IPv4 address", () => `${ri(1, 254)}.${ri(0, 255)}.${ri(0, 255)}.${ri(1, 254)}`], color: ["Hex color", () => "#" + hex(6)], user: ["Username", () => pick(FN).toLowerCase() + ri(10, 9999)],
};
const MockData = () => {
  const [keys, setKeys] = useState<string[]>(["id", "uuid", "first", "last", "email", "city", "price", "date"]);
  const [n, setN] = useState("100"), [fmt, setFmt] = useState("json"), [out, setOut] = useState(""), [full, setFull] = useState(""), [err, setErr] = useState("");
  const toggle = (k: string) => setKeys((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const run = () => {
    const c = Math.floor(+n); if (!(c >= 1 && c <= 200000)) return setErr("Rows must be between 1 and 200,000."); if (!keys.length) return setErr("Pick at least one field."); setErr("");
    const rows = Array.from({ length: c }, (_, i) => Object.fromEntries(keys.map((k) => [k, k === "id" ? i + 1 : GEN[k][1]()])));
    let s = "";
    if (fmt === "json") s = JSON.stringify(rows, null, 2);
    else if (fmt === "csv") { const q = (x: unknown) => { const t = String(x); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; }; s = keys.join(",") + "\n" + rows.map((r) => keys.map((k) => q(r[k])).join(",")).join("\n"); }
    else { const q = (x: unknown) => (typeof x === "number" ? x : typeof x === "boolean" ? (x ? 1 : 0) : `'${String(x).replace(/'/g, "''")}'`); s = rows.map((r) => `INSERT INTO mock_data (${keys.join(", ")}) VALUES (${keys.map((k) => q(r[k])).join(", ")});`).join("\n"); }
    setFull(s); setOut(s.length > 6000 ? s.slice(0, 6000) + `\n... preview only, download for all ${c} rows` : s);
  };
  return (
    <ToolCard>
      <div className="flex flex-wrap gap-2">{Object.entries(GEN).map(([k, [l]]) => <label key={k} className="flex items-center gap-1 rounded border border-border-default px-2 py-1 text-sm"><input type="checkbox" checked={keys.includes(k)} onChange={() => toggle(k)} />{l}</label>)}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Rows (up to 200,000, no daily limit)"><TextInput type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field>
        <Field label="Format"><Select value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="json">JSON</option><option value="csv">CSV</option><option value="sql">SQL INSERT</option></Select></Field>
      </div>
      <Button onClick={run}>Generate</Button>
      {err && <Alert>{err}</Alert>}
      {out && <><OutputBox value={out} rows={14} /><div className="flex gap-2"><CopyButton getText={() => full} /><Button variant="secondary" onClick={() => dl(`mock-data.${fmt}`, full, "text/plain")}>Download file</Button></div></>}
    </ToolCard>
  );
};

/* ---------- Sign PDF / add text to PDF ---------- */
const SignPdf = ({ mode }: { mode: "sign" | "text" }) => {
  const [file, setFile] = useState<File | null>(null), [pages, setPages] = useState(0), [pg, setPg] = useState(1), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const [sig, setSig] = useState<string>(""), [typed, setTyped] = useState(mode === "sign" ? "Your Name" : "Text to add"), [size, setSize] = useState("22");
  const [marks, setMarks] = useState<{ pg: number; x: number; y: number; kind: "img" | "txt"; v: string; size: number }[]>([]);
  const cv = useRef<HTMLCanvasElement>(null), pad = useRef<HTMLCanvasElement>(null), pdfRef = useRef<ArrayBuffer | null>(null), dim = useRef({ w: 1, h: 1, scale: 1 }), drawing = useRef(false);
  const render = async (n: number, buf: ArrayBuffer) => {
    const lib = await import("pdfjs-dist"); lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.mjs`;
    const doc = await lib.getDocument({ data: buf.slice(0) }).promise; setPages(doc.numPages);
    const p = await doc.getPage(n), vp = p.getViewport({ scale: 1.2 }), c = cv.current!; c.width = vp.width; c.height = vp.height; dim.current = { w: vp.width, h: vp.height, scale: 1.2 };
    await p.render({ canvas: c, canvasContext: c.getContext("2d")!, viewport: vp }).promise;
  };
  useEffect(() => { if (pdfRef.current) render(pg, pdfRef.current).catch(() => setErr("Could not display this PDF.")); }, [pg, file]); // eslint-disable-line
  const load = async (f: File) => { setErr(""); setMarks([]); setPg(1); try { pdfRef.current = await f.arrayBuffer(); setFile(f); } catch { setErr("Could not read this file."); } };
  const pp = (e: React.PointerEvent<HTMLCanvasElement>) => { const r = pad.current!.getBoundingClientRect(); return [(e.clientX - r.left) * (pad.current!.width / r.width), (e.clientY - r.top) * (pad.current!.height / r.height)]; };
  const down = (e: React.PointerEvent<HTMLCanvasElement>) => { drawing.current = true; const c = pad.current!.getContext("2d")!; const [x, y] = pp(e); c.lineWidth = 3; c.lineCap = "round"; c.beginPath(); c.moveTo(x, y); };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => { if (!drawing.current) return; const c = pad.current!.getContext("2d")!; const [x, y] = pp(e); c.lineTo(x, y); c.stroke(); };
  const up = () => { drawing.current = false; setSig(pad.current!.toDataURL("image/png")); };
  const place = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = cv.current!.getBoundingClientRect(), x = ((e.clientX - r.left) * dim.current.w) / r.width, y = ((e.clientY - r.top) * dim.current.h) / r.height;
    if (mode === "sign" && sig) setMarks((m) => [...m, { pg, x, y, kind: "img", v: sig, size: 160 }]);
    else if (typed) setMarks((m) => [...m, { pg, x, y, kind: "txt", v: typed, size: +size || 16 }]);
    else setErr("Draw a signature or type text first.");
  };
  const save = async () => {
    if (!pdfRef.current || !marks.length) return setErr("Click on the page to place at least one item first."); setBusy(true); setErr("");
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib"); const doc = await PDFDocument.load(pdfRef.current.slice(0)), font = await doc.embedFont(StandardFonts.Helvetica);
      for (const m of marks) { const p = doc.getPage(m.pg - 1), { width, height } = p.getSize(), s = width / dim.current.w;
        if (m.kind === "img") { const img = await doc.embedPng(m.v), w = m.size * s, h = (img.height / img.width) * w; p.drawImage(img, { x: m.x * s, y: height - m.y * s - h / 2, width: w, height: h }); }
        else p.drawText(clean(m.v), { x: m.x * s, y: height - m.y * s, size: m.size * s, font, color: rgb(0, 0, 0) }); }
      downloadBlob((file?.name.replace(/\.pdf$/i, "") || "document") + (mode === "sign" ? "-signed.pdf" : "-edited.pdf"), new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" }));
    } catch { setErr("Saving failed. The PDF may be encrypted."); } setBusy(false);
  };
  return (
    <ToolCard>
      {!file ? <Dropzone accept="application/pdf" onFiles={(f) => load(f[0])} label="Drop a PDF here, or click to browse" /> : (
        <>
          {mode === "sign" && <div><p className="mb-1 text-sm font-medium">Draw your signature, then click the page to place it</p><canvas ref={pad} width={400} height={120} className="w-full max-w-md touch-none rounded border border-border-default bg-white" onPointerDown={down} onPointerMove={move} onPointerUp={up} /><div className="mt-1"><Button variant="ghost" onClick={() => { pad.current!.getContext("2d")!.clearRect(0, 0, 400, 120); setSig(""); }}>Clear</Button></div></div>}
          {mode === "text" && <div className="grid gap-4 md:grid-cols-2"><Field label="Text to place"><TextInput value={typed} onChange={(e) => setTyped(e.target.value)} /></Field><Field label="Font size"><TextInput type="number" value={size} onChange={(e) => setSize(e.target.value)} /></Field></div>}
          {mode === "sign" && <Field label="Or place typed text instead"><TextInput value={typed} onChange={(e) => setTyped(e.target.value)} /></Field>}
          <div className="flex items-center gap-2 text-sm"><Button variant="ghost" disabled={pg <= 1} onClick={() => setPg(pg - 1)}>Prev</Button>Page {pg} of {pages}<Button variant="ghost" disabled={pg >= pages} onClick={() => setPg(pg + 1)}>Next</Button><span className="text-text-secondary">{marks.length} item(s) placed</span><Button variant="ghost" onClick={() => setMarks((m) => m.slice(0, -1))}>Undo</Button></div>
          <div className="relative overflow-auto"><canvas ref={cv} onClick={place} className="max-w-full cursor-crosshair border border-border-default" /></div>
          <div className="flex gap-2"><Button disabled={busy} onClick={save}>{busy ? "Saving..." : "Download PDF"}</Button><Button variant="secondary" onClick={() => { setFile(null); pdfRef.current = null; setMarks([]); }}>Choose another file</Button></div>
        </>
      )}
      {err && <Alert>{err}</Alert>}
    </ToolCard>
  );
};

/* ---------- OCR ---------- */
const Ocr = () => {
  const [lang, setLang] = useState("eng"), [out, setOut] = useState(""), [prog, setProg] = useState(0), [busy, setBusy] = useState(false), [err, setErr] = useState(""), [url, setUrl] = useState("");
  const run = async (f: File) => {
    setBusy(true); setErr(""); setOut(""); setProg(0); setUrl(URL.createObjectURL(f));
    try { const T = await import("tesseract.js"); const w = await T.createWorker(lang, 1, { logger: (m: { status: string; progress: number }) => { if (m.status === "recognizing text") setProg(Math.round(m.progress * 100)); } }); const r = await w.recognize(f); setOut(r.data.text.trim() || "No text found."); await w.terminate(); }
    catch { setErr("Text recognition failed. Check your connection (the language data is downloaded once) and try a clearer image."); }
    setBusy(false);
  };
  return (
    <ToolCard>
      <Field label="Language in the image"><Select value={lang} onChange={(e) => setLang(e.target.value)}>{[["eng", "English"], ["ara", "Arabic"], ["spa", "Spanish"], ["fra", "French"], ["deu", "German"], ["ita", "Italian"], ["por", "Portuguese"], ["rus", "Russian"], ["tur", "Turkish"], ["hin", "Hindi"], ["chi_sim", "Chinese (Simplified)"], ["jpn", "Japanese"]].map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Select></Field>
      <Dropzone accept="image/*" onFiles={(f) => run(f[0])} label="Drop an image or screenshot here, or click to browse" />
      {busy && <p className="text-sm">Reading text... {prog}%</p>}
      {err && <Alert>{err}</Alert>}
      {url && <img src={url} alt="Uploaded" className="max-h-48 rounded border border-border-default" />}
      {out && <><OutputBox value={out} rows={12} /><div className="flex gap-2"><CopyButton getText={() => out} /><Button variant="secondary" onClick={() => dl("text.txt", out, "text/plain")}>Download .txt</Button></div></>}
    </ToolCard>
  );
};

/* ---------- HEIC to JPG ---------- */
const Heic = () => {
  const [res, setRes] = useState<{ name: string; blob: Blob }[]>([]), [busy, setBusy] = useState(false), [err, setErr] = useState(""), [fmt, setFmt] = useState("image/jpeg"), [q, setQ] = useState("0.9");
  const run = async (files: File[]) => {
    setBusy(true); setErr(""); setRes([]); const out: { name: string; blob: Blob }[] = [];
    try { const h = (await import("heic2any")).default; for (const f of files) { const r = await h({ blob: f, toType: fmt, quality: +q }); const b = Array.isArray(r) ? r[0] : r; out.push({ name: f.name.replace(/\.(heic|heif)$/i, "") + (fmt === "image/png" ? ".png" : ".jpg"), blob: b }); } setRes(out); }
    catch { setErr("One of the files could not be converted. Make sure it is a real HEIC or HEIF photo."); }
    setBusy(false);
  };
  const zip = async () => { const Z = (await import("jszip")).default, z = new Z(); res.forEach((r) => z.file(r.name, r.blob)); downloadBlob("converted-photos.zip", await z.generateAsync({ type: "blob" })); };
  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Output"><Select value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></Select></Field>
        <Field label="JPG quality"><Select value={q} onChange={(e) => setQ(e.target.value)}><option value="1">Maximum</option><option value="0.9">High</option><option value="0.7">Medium</option></Select></Field>
      </div>
      <Dropzone multiple accept=".heic,.heif,image/heic,image/heif" onFiles={run} label="Drop HEIC photos here (many at once, no daily limit)" />
      {busy && <p className="text-sm">Converting...</p>}
      {err && <Alert>{err}</Alert>}
      {res.length > 0 && <div className="space-y-2">{res.map((r) => <div key={r.name} className="flex items-center justify-between rounded border border-border-default p-2 text-sm"><span>{r.name}</span><Button variant="secondary" onClick={() => downloadBlob(r.name, r.blob)}>Download</Button></div>)}{res.length > 1 && <Button onClick={zip}>Download all as ZIP</Button>}</div>}
    </ToolCard>
  );
};

/* ---------- Mermaid ---------- */
const SAMPLE = `flowchart TD\n  A[Start] --> B{Is it working?}\n  B -- Yes --> C[Ship it]\n  B -- No --> D[Debug]\n  D --> B`;
const Mermaid = () => {
  const [src, setSrc] = useState(SAMPLE), [svg, setSvg] = useState(""), [err, setErr] = useState("");
  useEffect(() => {
    let dead = false; const t = setTimeout(async () => {
      try { const m = (await import("mermaid")).default; m.initialize({ startOnLoad: false, securityLevel: "strict" }); const r = await m.render("mm" + Date.now(), src); if (!dead) { setSvg(r.svg); setErr(""); } }
      catch (e) { if (!dead) setErr(String((e as Error).message || "Syntax error").split("\n")[0]); document.querySelectorAll("[id^=dmm]").forEach((n) => n.remove()); }
    }, 400); return () => { dead = true; clearTimeout(t); };
  }, [src]);
  const png = () => { const img = new Image(); img.onload = () => { const c = document.createElement("canvas"); c.width = img.width * 2; c.height = img.height * 2; const x = c.getContext("2d")!; x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height); c.toBlob((b) => b && downloadBlob("diagram.png", b)); }; const el = new DOMParser().parseFromString(svg, "image/svg+xml").documentElement; const vb = el.getAttribute("viewBox")?.split(" ").map(Number); if (vb) { el.setAttribute("width", String(vb[2])); el.setAttribute("height", String(vb[3])); } img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(el)); };
  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Mermaid code"><TextArea rows={16} value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} /></Field>
        <div><p className="mb-1 text-sm font-medium">Preview</p>{err ? <Alert>{err}</Alert> : <div className="overflow-auto rounded border border-border-default bg-white p-2" dangerouslySetInnerHTML={{ __html: svg }} />}</div>
      </div>
      <div className="flex flex-wrap gap-2"><Button disabled={!svg || !!err} onClick={() => dl("diagram.svg", svg, "image/svg+xml")}>Download SVG</Button><Button variant="secondary" disabled={!svg || !!err} onClick={png}>Download PNG</Button><CopyButton getText={() => src} label="Copy code" />
        {[["Flowchart", SAMPLE], ["Sequence", "sequenceDiagram\n  Alice->>Bob: Hello\n  Bob-->>Alice: Hi"], ["Gantt", "gantt\n  title Plan\n  dateFormat YYYY-MM-DD\n  section A\n  Task 1 :a1, 2026-01-01, 7d\n  Task 2 :after a1, 5d"], ["Pie", 'pie title Pets\n  "Dogs" : 40\n  "Cats" : 35\n  "Fish" : 25'], ["Class", "classDiagram\n  Animal <|-- Dog\n  Animal : +name\n  Dog : +bark()"]].map(([l, s]) => <Button key={l} variant="ghost" onClick={() => setSrc(s)}>{l}</Button>)}</div>
    </ToolCard>
  );
};

export const WAVE7: Record<string, () => ReactNode> = {
  "resume-builder": () => <Resume />, "invoice-generator": () => <Invoice />, "mock-data-generator": () => <MockData />,
  "sign-pdf-online": () => <SignPdf mode="sign" />, "add-text-to-pdf": () => <SignPdf mode="text" />, "image-to-text-ocr": () => <Ocr />,
  "heic-to-jpg-converter": () => <Heic />, "mermaid-diagram-editor": () => <Mermaid />,
};
