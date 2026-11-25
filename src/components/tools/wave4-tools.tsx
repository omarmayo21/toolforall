"use client";
/* eslint-disable react/display-name, @next/next/no-img-element, react-hooks/set-state-in-effect */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Alert, Button, CopyButton, Dropzone, Field, Select, StatBadge, TextInput, ToolCard, downloadBlob } from "./ui";

const bytes = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`);
const loadUrl = (url: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Could not read this image.")); i.src = url; });
const loadImage = (f: File) => loadUrl(URL.createObjectURL(f));
const toBlob = (c: HTMLCanvasElement, type = "image/png", q?: number) => new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), type, q));
const mk = (w: number, h: number) => { const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
const base = (f: File) => f.name.replace(/\.[^.]+$/, "");
const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

/* ---------- generic canvas lab ---------- */
type Ctl = { k: string; label: string; def: string; type?: "range" | "select" | "text" | "color" | "number"; min?: number; max?: number; step?: number; options?: [string, string][] };
type P = Record<string, string>;
const nn = (p: P, k: string) => parseFloat(p[k]);

function ImgLab({ ctls = [], render, ext = "png", suffix = "edited", accept = "image/*", hint }: { ctls?: Ctl[]; render: (img: HTMLImageElement, p: P) => HTMLCanvasElement; ext?: "png" | "jpg"; suffix?: string; accept?: string; hint?: ReactNode }) {
  const [p, setP] = useState<P>(() => Object.fromEntries(ctls.map((c) => [c.k, c.def])));
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [err, setErr] = useState("");
  const [size, setSize] = useState("");
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!img || !ref.current) return;
    try {
      const c = render(img, p);
      const t = ref.current; t.width = c.width; t.height = c.height; t.getContext("2d")!.drawImage(c, 0, 0);
      setSize(`${c.width} x ${c.height}px`); setErr("");
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
  }, [img, p, render]);
  async function onFile(f: File) { try { setFile(f); setImg(await loadImage(f)); setErr(""); } catch (e) { setErr((e as Error).message); } }
  async function save() { if (!ref.current || !file) return; const b = await toBlob(ref.current, ext === "jpg" ? "image/jpeg" : "image/png", 0.92); downloadBlob(`${base(file)}-${suffix}.${ext}`, b); }
  return (
    <ToolCard>
      {ctls.length ? (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {ctls.map((c) => (
            <Field key={c.k} label={c.type === "range" ? `${c.label}: ${p[c.k]}` : c.label}>
              {c.type === "range" ? <input type="range" className="w-full" min={c.min} max={c.max} step={c.step ?? 1} value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })} />
                : c.type === "select" ? <Select value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })}>{c.options!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>
                : c.type === "color" ? <input type="color" className="h-10 w-full rounded" value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })} />
                : <TextInput type={c.type === "number" ? "number" : "text"} value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })} />}
            </Field>
          ))}
        </div>
      ) : null}
      <Dropzone accept={accept} onFiles={(f) => onFile(f[0])} label="Drop an image here, or click to choose one" />
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {img ? (
        <div className="mt-4 space-y-3">
          <div className="overflow-auto rounded-lg border border-border-default bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-2"><canvas ref={ref} className="mx-auto h-auto max-h-[28rem] max-w-full" /></div>
          <div className="flex flex-wrap items-center gap-3"><StatBadge label="Output size" value={size} /><Button onClick={save}>⬇️ Download {ext.toUpperCase()}</Button></div>
        </div>
      ) : null}
      <p className="mt-3 text-xs text-text-muted">{hint ?? "Your image never leaves your device. It is processed in your browser."}</p>
    </ToolCard>
  );
}

const pixels = (img: HTMLImageElement, fn: (d: Uint8ClampedArray) => void) => { const c = mk(img.naturalWidth, img.naturalHeight); const x = c.getContext("2d", { willReadFrequently: true })!; x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height); fn(d.data); x.putImageData(d, 0, 0); return c; };
const hexRgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/* ---------- filters ---------- */
const bw = (img: HTMLImageElement, p: P) => { const a = nn(p, "amt") / 100; return pixels(img, (d) => { for (let i = 0; i < d.length; i += 4) { const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; for (let j = 0; j < 3; j++) d[i + j] = d[i + j] + (g - d[i + j]) * a; } }); };
const sepia = (img: HTMLImageElement, p: P) => { const a = nn(p, "amt") / 100; return pixels(img, (d) => { for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2]; const s = [0.393 * r + 0.769 * g + 0.189 * b, 0.349 * r + 0.686 * g + 0.168 * b, 0.272 * r + 0.534 * g + 0.131 * b]; for (let j = 0; j < 3; j++) d[i + j] = clamp(d[i + j] + (s[j] - d[i + j]) * a); } }); };
const invert = (img: HTMLImageElement) => pixels(img, (d) => { for (let i = 0; i < d.length; i += 4) { d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2]; } });
const bc = (img: HTMLImageElement, p: P) => { const b = nn(p, "b") * 2.55, c = nn(p, "c"), f = (259 * (c + 255)) / (255 * (259 - c)); return pixels(img, (d) => { for (let i = 0; i < d.length; i += 4) for (let j = 0; j < 3; j++) d[i + j] = clamp(f * (d[i + j] + b - 128) + 128); }); };
const hs = (img: HTMLImageElement, p: P) => {
  const sat = 1 + nn(p, "s") / 100, hue = (nn(p, "h") * Math.PI) / 180, cos = Math.cos(hue), sin = Math.sin(hue);
  const m = [0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928, 0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.14, 0.072 - cos * 0.072 - sin * 0.283, 0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072];
  return pixels(img, (d) => { for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2]; const R = m[0] * r + m[1] * g + m[2] * b, G = m[3] * r + m[4] * g + m[5] * b, B = m[6] * r + m[7] * g + m[8] * b; const l = 0.299 * R + 0.587 * G + 0.114 * B; d[i] = clamp(l + (R - l) * sat); d[i + 1] = clamp(l + (G - l) * sat); d[i + 2] = clamp(l + (B - l) * sat); } });
};
const opacity = (img: HTMLImageElement, p: P) => { const c = mk(img.naturalWidth, img.naturalHeight); const x = c.getContext("2d")!; x.globalAlpha = nn(p, "o") / 100; x.drawImage(img, 0, 0); return c; };
const removeWhite = (img: HTMLImageElement, p: P) => { const t = nn(p, "t"); return pixels(img, (d) => { for (let i = 0; i < d.length; i += 4) { const m = Math.min(d[i], d[i + 1], d[i + 2]); const dist = 255 - m; if (dist <= t) d[i + 3] = 0; else if (dist <= t * 2) d[i + 3] = Math.round((d[i + 3] * (dist - t)) / t); } }); };
const pixelate = (img: HTMLImageElement, p: P) => { const s = Math.max(2, nn(p, "s")); const w = img.naturalWidth, h = img.naturalHeight; const sm = mk(w / s, h / s); sm.getContext("2d")!.drawImage(img, 0, 0, sm.width, sm.height); const c = mk(w, h); const x = c.getContext("2d")!; x.imageSmoothingEnabled = false; x.drawImage(sm, 0, 0, w, h); return c; };

/* ---------- layout / shape ---------- */
const border = (img: HTMLImageElement, p: P) => { const b = nn(p, "w") || 0, w = img.naturalWidth, h = img.naturalHeight; const c = mk(w + b * 2, h + b * 2); const x = c.getContext("2d")!; x.fillStyle = p.color; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, b, b); return c; };
const square = (img: HTMLImageElement, p: P) => { const s = Math.max(img.naturalWidth, img.naturalHeight); const c = mk(s, s); const x = c.getContext("2d")!; if (p.bg !== "transparent") { x.fillStyle = p.color; x.fillRect(0, 0, s, s); } x.drawImage(img, (s - img.naturalWidth) / 2, (s - img.naturalHeight) / 2); return c; };
const roundRect = (x: CanvasRenderingContext2D, w: number, h: number, r: number) => { x.beginPath(); x.moveTo(r, 0); x.arcTo(w, 0, w, h, r); x.arcTo(w, h, 0, h, r); x.arcTo(0, h, 0, 0, r); x.arcTo(0, 0, w, 0, r); x.closePath(); };
const rounded = (img: HTMLImageElement, p: P) => { const w = img.naturalWidth, h = img.naturalHeight; const c = mk(w, h); const x = c.getContext("2d")!; roundRect(x, w, h, (Math.min(w, h) / 2) * (nn(p, "r") / 100)); x.clip(); x.drawImage(img, 0, 0); return c; };
const circle = (img: HTMLImageElement) => { const s = Math.min(img.naturalWidth, img.naturalHeight); const c = mk(s, s); const x = c.getContext("2d")!; x.beginPath(); x.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2); x.clip(); x.drawImage(img, (s - img.naturalWidth) / 2, (s - img.naturalHeight) / 2); return c; };
const POS: [string, string][] = [["tl", "Top left"], ["tc", "Top center"], ["tr", "Top right"], ["ml", "Middle left"], ["mc", "Center"], ["mr", "Middle right"], ["bl", "Bottom left"], ["bc", "Bottom center"], ["br", "Bottom right"], ["tile", "Tiled across the image"]];
const watermark = (img: HTMLImageElement, p: P) => {
  const w = img.naturalWidth, h = img.naturalHeight; const c = mk(w, h); const x = c.getContext("2d")!; x.drawImage(img, 0, 0);
  const fs = Math.max(8, (Math.min(w, h) * nn(p, "size")) / 100); x.font = `bold ${fs}px sans-serif`; x.globalAlpha = nn(p, "o") / 100; x.fillStyle = p.color; x.textBaseline = "middle";
  const t = p.text || " "; const tw = x.measureText(t).width; const m = fs * 0.6;
  if (p.pos === "tile") { x.save(); x.translate(w / 2, h / 2); x.rotate(-Math.PI / 6); for (let yy = -h; yy < h; yy += fs * 3) for (let xx = -w; xx < w; xx += tw + fs * 2) x.fillText(t, xx, yy); x.restore(); return c; }
  const col = p.pos[1], row = p.pos[0]; const px = col === "l" ? m : col === "c" ? (w - tw) / 2 : w - tw - m; const py = row === "t" ? m + fs / 2 : row === "m" ? h / 2 : h - m - fs / 2; x.fillText(t, px, py); return c;
};
const cover = (img: HTMLImageElement, W: number, H: number, mode: string, bg: string) => { const c = mk(W, H); const x = c.getContext("2d")!; const iw = img.naturalWidth, ih = img.naturalHeight; if (mode === "stretch") { x.drawImage(img, 0, 0, W, H); return c; } const s = mode === "cover" ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih); if (mode === "contain") { x.fillStyle = bg; x.fillRect(0, 0, W, H); } x.imageSmoothingQuality = "high"; x.drawImage(img, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s); return c; };
const FIT: Ctl = { k: "fit", label: "Fit", def: "cover", type: "select", options: [["cover", "Fill and crop the edges"], ["contain", "Fit inside with background"], ["stretch", "Stretch"]] };
const BG: Ctl = { k: "bg", label: "Background (for Fit inside)", def: "#ffffff", type: "color" };
const PASS: [string, number, number][] = [["India passport / visa (35 x 45 mm)", 413, 531], ["US passport / visa (2 x 2 in)", 600, 600], ["UK / Schengen passport (35 x 45 mm)", 413, 531], ["China visa (33 x 48 mm)", 390, 567], ["Canada passport (50 x 70 mm)", 591, 827], ["Standard ID photo (4 x 6 cm)", 472, 709], ["Egypt ID photo (4 x 6 cm)", 472, 709], ["Small ID (25 x 35 mm)", 295, 413]];
const SOCIAL: [string, number, number][] = [["Instagram post, square (1080 x 1080)", 1080, 1080], ["Instagram portrait (1080 x 1350)", 1080, 1350], ["Instagram / TikTok story (1080 x 1920)", 1080, 1920], ["Facebook cover (820 x 312)", 820, 312], ["Facebook post (1200 x 630)", 1200, 630], ["X (Twitter) post (1600 x 900)", 1600, 900], ["X header (1500 x 500)", 1500, 500], ["YouTube thumbnail (1280 x 720)", 1280, 720], ["YouTube banner (2560 x 1440)", 2560, 1440], ["LinkedIn banner (1584 x 396)", 1584, 396], ["Pinterest pin (1000 x 1500)", 1000, 1500], ["WhatsApp profile (640 x 640)", 640, 640]];
const Presets = (list: [string, number, number][], suffix: string) => () => <ImgLab suffix={suffix} ctls={[{ k: "preset", label: "Size", def: "0", type: "select", options: list.map(([l], i) => [String(i), l]) }, FIT, BG]} render={(img, p) => { const [, W, H] = list[+p.preset]; return cover(img, W, H, p.fit, p.bg); }} />;

/* ---------- compress to KB ---------- */
function KbCompress({ kb }: { kb: number }) {
  const [res, setRes] = useState<{ blob: Blob; w: number; h: number; q: number } | null>(null);
  const [orig, setOrig] = useState(0);
  const [name, setName] = useState("image");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function run(f: File) {
    setBusy(true); setErr(""); setOrig(f.size); setName(base(f));
    try {
      const img = await loadImage(f); const target = kb * 1024; let scale = 1;
      for (let round = 0; round < 12; round++) {
        const c = mk(img.naturalWidth * scale, img.naturalHeight * scale); const x = c.getContext("2d")!; x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        let lo = 0.1, hi = 0.95, best: Blob | null = null, bq = 0;
        for (let i = 0; i < 7; i++) { const q = (lo + hi) / 2; const b = await toBlob(c, "image/jpeg", q); if (b.size <= target) { best = b; bq = q; lo = q; } else hi = q; }
        if (best) { setRes({ blob: best, w: c.width, h: c.height, q: bq }); setBusy(false); return; }
        scale *= 0.85;
      }
      setErr(`Could not reach ${kb} KB. Try a smaller image first.`);
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(f) => run(f[0])} label={`Drop an image to compress it under ${kb} KB`} />
      {busy ? <p className="mt-3 text-sm text-text-muted">Compressing...</p> : null}
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {res ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-3"><StatBadge label="Original" value={bytes(orig)} /><StatBadge label="Compressed" value={bytes(res.blob.size)} /><StatBadge label="Dimensions" value={`${res.w} x ${res.h}`} /></div>
          <Button onClick={() => downloadBlob(`${name}-${kb}kb.jpg`, res.blob)}>⬇️ Download JPG</Button>
        </div>
      ) : null}
      <p className="mt-3 text-xs text-text-muted">The tool lowers JPG quality first and shrinks the dimensions only if needed. Transparent areas become white. Your image stays on your device.</p>
    </ToolCard>
  );
}

/* ---------- info / pickers ---------- */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
function ImageInfo() {
  const [info, setInfo] = useState<{ n: string; t: string; s: number; w: number; h: number } | null>(null);
  const [err, setErr] = useState("");
  async function run(f: File) { try { const i = await loadImage(f); setInfo({ n: f.name, t: f.type || "unknown", s: f.size, w: i.naturalWidth, h: i.naturalHeight }); setErr(""); } catch (e) { setErr((e as Error).message); } }
  const g = info ? gcd(info.w, info.h) : 1;
  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(f) => run(f[0])} />
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {info ? <div className="mt-4 grid gap-3 sm:grid-cols-3"><StatBadge label="Width x height" value={`${info.w} x ${info.h} px`} /><StatBadge label="File size" value={bytes(info.s)} /><StatBadge label="Type" value={info.t} /><StatBadge label="Aspect ratio" value={`${info.w / g}:${info.h / g}`} /><StatBadge label="Megapixels" value={((info.w * info.h) / 1e6).toFixed(2) + " MP"} /><StatBadge label="Print at 300 DPI" value={`${(info.w / 300 * 2.54).toFixed(1)} x ${(info.h / 300 * 2.54).toFixed(1)} cm`} /></div> : null}
    </ToolCard>
  );
}
const toHex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
function ColorPicker() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hex, setHex] = useState("");
  const [ok, setOk] = useState(false);
  async function run(f: File) { const i = await loadImage(f); const c = ref.current!; const s = Math.min(1, 900 / i.naturalWidth); c.width = i.naturalWidth * s; c.height = i.naturalHeight * s; c.getContext("2d")!.drawImage(i, 0, 0, c.width, c.height); setOk(true); }
  function pick(e: React.MouseEvent<HTMLCanvasElement>) { const c = ref.current!; const r = c.getBoundingClientRect(); const x = Math.floor(((e.clientX - r.left) / r.width) * c.width), y = Math.floor(((e.clientY - r.top) / r.height) * c.height); const d = c.getContext("2d")!.getImageData(x, y, 1, 1).data; setHex(toHex(d[0], d[1], d[2])); }
  const rgb = hex ? hexRgb(hex) : [0, 0, 0];
  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(f) => run(f[0])} />
      <canvas ref={ref} onClick={pick} className={`mt-4 h-auto max-w-full cursor-crosshair rounded-lg border border-border-default ${ok ? "" : "hidden"}`} />
      {ok ? <p className="mt-2 text-xs text-text-muted">Click anywhere on the image to pick a color.</p> : null}
      {hex ? <div className="mt-3 flex flex-wrap items-center gap-3"><div className="h-12 w-12 rounded-lg border border-border-default" style={{ background: hex }} /><StatBadge label="HEX" value={hex.toUpperCase()} /><StatBadge label="RGB" value={`${rgb[0]}, ${rgb[1]}, ${rgb[2]}`} /><CopyButton getText={() => hex.toUpperCase()} label="Copy HEX" /></div> : null}
    </ToolCard>
  );
}
function Palette() {
  const [cols, setCols] = useState<{ hex: string; pct: number }[]>([]);
  const [url, setUrl] = useState("");
  async function run(f: File) {
    const i = await loadImage(f); setUrl(i.src); const s = Math.min(1, 200 / Math.max(i.naturalWidth, i.naturalHeight)); const c = mk(i.naturalWidth * s, i.naturalHeight * s); const x = c.getContext("2d", { willReadFrequently: true })!; x.drawImage(i, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height).data; const m = new Map<number, [number, number, number, number]>(); let tot = 0;
    for (let k = 0; k < d.length; k += 4) { if (d[k + 3] < 128) continue; const key = ((d[k] >> 4) << 8) | ((d[k + 1] >> 4) << 4) | (d[k + 2] >> 4); const e = m.get(key) ?? [0, 0, 0, 0]; e[0] += d[k]; e[1] += d[k + 1]; e[2] += d[k + 2]; e[3]++; m.set(key, e); tot++; }
    const arr = [...m.values()].sort((a, b) => b[3] - a[3]); const out: { hex: string; pct: number; rgb: number[] }[] = [];
    for (const e of arr) { const rgb = [e[0] / e[3], e[1] / e[3], e[2] / e[3]]; if (out.every((o) => Math.hypot(o.rgb[0] - rgb[0], o.rgb[1] - rgb[1], o.rgb[2] - rgb[2]) > 50)) out.push({ hex: toHex(Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])), pct: (e[3] / tot) * 100, rgb }); if (out.length === 8) break; }
    setCols(out);
  }
  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(f) => run(f[0])} />
      {url ? <img src={url} alt="Uploaded" className="mt-4 max-h-60 rounded-lg" /> : null}
      {cols.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{cols.map((c) => <button key={c.hex} type="button" onClick={() => navigator.clipboard?.writeText(c.hex.toUpperCase())} className="rounded-lg border border-border-default p-2 text-left"><div className="h-14 rounded" style={{ background: c.hex }} /><div className="mt-1 font-mono text-sm">{c.hex.toUpperCase()}</div><div className="text-xs text-text-muted">{c.pct.toFixed(0)}% - click to copy</div></button>)}</div> : null}
    </ToolCard>
  );
}

/* ---------- merge ---------- */
function Merge() {
  const [imgs, setImgs] = useState<HTMLImageElement[]>([]);
  const [dir, setDir] = useState("v"); const [gap, setGap] = useState("0"); const [bg, setBg] = useState("#ffffff");
  const [url, setUrl] = useState(""); const blobRef = useRef<Blob | null>(null);
  async function add(fs: File[]) { const l = await Promise.all(fs.map(loadImage)); setImgs((x) => [...x, ...l]); }
  useEffect(() => {
    if (imgs.length < 1) return; const g = Math.max(0, +gap || 0);
    const W = dir === "v" ? Math.max(...imgs.map((i) => i.naturalWidth)) : imgs.reduce((a, i) => a + i.naturalWidth, 0) + g * (imgs.length - 1);
    const H = dir === "h" ? Math.max(...imgs.map((i) => i.naturalHeight)) : imgs.reduce((a, i) => a + i.naturalHeight, 0) + g * (imgs.length - 1);
    const c = mk(W, H); const x = c.getContext("2d")!; x.fillStyle = bg; x.fillRect(0, 0, W, H); let o = 0;
    for (const i of imgs) { if (dir === "v") { x.drawImage(i, (W - i.naturalWidth) / 2, o); o += i.naturalHeight + g; } else { x.drawImage(i, o, (H - i.naturalHeight) / 2); o += i.naturalWidth + g; } }
    c.toBlob((b) => { if (b) { blobRef.current = b; setUrl((u) => { if (u) URL.revokeObjectURL(u); return URL.createObjectURL(b); }); } });
  }, [imgs, dir, gap, bg]);
  return (
    <ToolCard>
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Field label="Direction"><Select value={dir} onChange={(e) => setDir(e.target.value)}><option value="v">Top to bottom</option><option value="h">Left to right</option></Select></Field>
        <Field label="Gap (px)"><TextInput type="number" value={gap} onChange={(e) => setGap(e.target.value)} /></Field>
        <Field label="Background"><input type="color" className="h-10 w-full rounded" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
      </div>
      <Dropzone accept="image/*" multiple onFiles={add} label="Drop two or more images here (you can add more later)" />
      {imgs.length ? <div className="mt-3 flex items-center gap-3 text-sm"><span>{imgs.length} image(s)</span><Button variant="secondary" onClick={() => setImgs([])}>Clear</Button></div> : null}
      {url ? <div className="mt-4 space-y-3"><img src={url} alt="Merged result" className="max-h-96 rounded-lg border border-border-default" /><Button onClick={() => blobRef.current && downloadBlob("merged-images.png", blobRef.current)}>⬇️ Download PNG</Button></div> : null}
    </ToolCard>
  );
}

/* ---------- svg to png ---------- */
function SvgToPng() {
  const [svg, setSvg] = useState("");
  const [scale, setScale] = useState("2"); const [bg, setBg] = useState("transparent");
  const [err, setErr] = useState(""); const ref = useRef<HTMLCanvasElement>(null); const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!svg.trim()) { setReady(false); return; }
    let url = "";
    (async () => {
      try {
        url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })); const i = await loadUrl(url);
        const w = i.naturalWidth || 300, h = i.naturalHeight || 150, s = +scale; const c = ref.current!; c.width = Math.round(w * s); c.height = Math.round(h * s); const x = c.getContext("2d")!;
        if (bg === "white") { x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); } x.drawImage(i, 0, 0, c.width, c.height); setReady(true); setErr("");
      } catch { setReady(false); setErr("This is not a valid SVG. It must include the <svg> tag with a width and height or viewBox."); }
    })();
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [svg, scale, bg]);
  return (
    <ToolCard>
      <Dropzone accept=".svg,image/svg+xml" onFiles={async (f) => setSvg(await f[0].text())} label="Drop an SVG file, or paste the code below" />
      <div className="mt-3"><textarea rows={5} value={svg} onChange={(e) => setSvg(e.target.value)} placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; ...>" className="w-full rounded-lg border border-border-default bg-bg-default px-3 py-2 font-mono text-sm" /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Scale"><Select value={scale} onChange={(e) => setScale(e.target.value)}>{["1", "2", "3", "4", "8"].map((s) => <option key={s} value={s}>{s}x</option>)}</Select></Field><Field label="Background"><Select value={bg} onChange={(e) => setBg(e.target.value)}><option value="transparent">Transparent</option><option value="white">White</option></Select></Field></div>
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      <div className={`mt-4 space-y-3 ${ready ? "" : "hidden"}`}><div className="overflow-auto rounded-lg border border-border-default bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-2"><canvas ref={ref} className="mx-auto h-auto max-h-96 max-w-full" /></div><Button onClick={async () => ref.current && downloadBlob("image.png", await toBlob(ref.current))}>⬇️ Download PNG</Button></div>
    </ToolCard>
  );
}

/* ---------- EXIF remover ---------- */
function ExifRemover() {
  const [res, setRes] = useState<{ blob: Blob; name: string; before: number } | null>(null);
  const [err, setErr] = useState("");
  async function run(f: File) { try { const i = await loadImage(f); const c = mk(i.naturalWidth, i.naturalHeight); c.getContext("2d")!.drawImage(i, 0, 0); const png = f.type === "image/png"; const b = await toBlob(c, png ? "image/png" : "image/jpeg", 0.95); setRes({ blob: b, name: `${base(f)}-clean.${png ? "png" : "jpg"}`, before: f.size }); setErr(""); } catch (e) { setErr((e as Error).message); } }
  return (
    <ToolCard>
      <Dropzone accept="image/jpeg,image/png,image/webp" onFiles={(f) => run(f[0])} label="Drop a photo to strip GPS and camera data" />
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {res ? <div className="mt-4 space-y-3"><Alert type="success">Metadata removed. The image was redrawn, so location, camera model, date and other EXIF fields are not in the new file.</Alert><div className="grid grid-cols-2 gap-3"><StatBadge label="Before" value={bytes(res.before)} /><StatBadge label="After" value={bytes(res.blob.size)} /></div><Button onClick={() => downloadBlob(res.name, res.blob)}>⬇️ Download clean image</Button></div> : null}
      <p className="mt-3 text-xs text-text-muted">The photo is re-encoded in your browser. JPG quality is set to 95%. Nothing is uploaded.</p>
    </ToolCard>
  );
}

/* ---------- PDF helpers ---------- */
type PdfLib = typeof import("pdf-lib");
const parseRange = (s: string, n: number) => { const set = new Set<number>(); for (const part of s.split(/[,\s]+/).filter(Boolean)) { const m = part.match(/^(\d+)(?:-(\d+))?$/); if (!m) throw new Error(`"${part}" is not a valid page or range.`); const a = +m[1], b = m[2] ? +m[2] : a; if (a < 1 || b < a || b > n) throw new Error(`Page ${part} is outside this document (1-${n}).`); for (let i = a; i <= b; i++) set.add(i - 1); } return [...set].sort((a, b) => a - b); };
function PdfTool({ ctls = [], run, suffix, extra }: { ctls?: Ctl[]; run: (lib: PdfLib, buf: ArrayBuffer, p: P) => Promise<{ bytes: Uint8Array; msg: string }>; suffix: string; extra?: ReactNode }) {
  const [p, setP] = useState<P>(() => Object.fromEntries(ctls.map((c) => [c.k, c.def])));
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<{ blob: Blob; msg: string } | null>(null);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function go() {
    if (!file) return; setBusy(true); setErr(""); setOut(null);
    try { const lib = await import("pdf-lib"); const r = await run(lib, await file.arrayBuffer(), p); setOut({ blob: new Blob([r.bytes as BlobPart], { type: "application/pdf" }), msg: r.msg }); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not process this PDF. It may be damaged or password protected."); }
    setBusy(false);
  }
  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(f) => { setFile(f[0]); setOut(null); setErr(""); }} label={file ? `Selected: ${file.name}` : "Drop a PDF here, or click to choose one"} />
      {ctls.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{ctls.map((c) => <Field key={c.k} label={c.type === "range" ? `${c.label}: ${p[c.k]}` : c.label}>{c.type === "range" ? <input type="range" className="w-full" min={c.min} max={c.max} step={c.step ?? 1} value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })} /> : c.type === "select" ? <Select value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })}>{c.options!.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select> : <TextInput type={c.type === "number" ? "number" : "text"} value={p[c.k]} onChange={(e) => setP({ ...p, [c.k]: e.target.value })} />}</Field>)}</div> : null}
      {extra}
      <div className="mt-4"><Button onClick={go} disabled={!file || busy}>{busy ? "Working..." : "Run"}</Button></div>
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {out ? <div className="mt-4 space-y-3"><Alert type="success">{out.msg}</Alert><Button onClick={() => downloadBlob(`${base(file!)}-${suffix}.pdf`, out.blob)}>⬇️ Download PDF</Button></div> : null}
      <p className="mt-3 text-xs text-text-muted">Your PDF is processed in your browser and is not uploaded.</p>
    </ToolCard>
  );
}
const keepPages = async (lib: PdfLib, buf: ArrayBuffer, pick: (n: number, p: P) => number[], p: P) => {
  const src = await lib.PDFDocument.load(buf, { ignoreEncryption: true }); const n = src.getPageCount(); const idx = pick(n, p);
  if (!idx.length) throw new Error("No pages would be left in the result."); const dst = await lib.PDFDocument.create(); const pages = await dst.copyPages(src, idx); pages.forEach((pg) => dst.addPage(pg));
  return { bytes: await dst.save(), msg: `Done. The new PDF has ${idx.length} of ${n} pages.` };
};
const RANGE: Ctl = { k: "r", label: "Pages (for example 1,3,5-7)", def: "1", type: "text" };
const DeletePages = () => <PdfTool suffix="pages-deleted" ctls={[{ ...RANGE, label: "Pages to delete (for example 2,4-6)", def: "2" }]} run={(l, b, p) => keepPages(l, b, (n, q) => { const del = new Set(parseRange(q.r, n)); return Array.from({ length: n }, (_, i) => i).filter((i) => !del.has(i)); }, p)} />;
const ExtractPages = () => <PdfTool suffix="extracted" ctls={[{ ...RANGE, label: "Pages to keep (for example 1-3,8)", def: "1-3" }]} run={(l, b, p) => keepPages(l, b, (n, q) => parseRange(q.r, n), p)} />;
const ReversePages = () => <PdfTool suffix="reversed" run={(l, b, p) => keepPages(l, b, (n) => Array.from({ length: n }, (_, i) => n - 1 - i), p)} />;
const PdfWatermark = () => (
  <PdfTool suffix="watermarked" ctls={[{ k: "t", label: "Watermark text", def: "CONFIDENTIAL", type: "text" }, { k: "size", label: "Font size", def: "60", type: "range", min: 12, max: 160 }, { k: "o", label: "Opacity %", def: "25", type: "range", min: 5, max: 100 }, { k: "rot", label: "Angle", def: "45", type: "select", options: [["0", "Horizontal"], ["45", "Diagonal up"], ["-45", "Diagonal down"], ["90", "Vertical"]] }]}
    run={async (lib, buf, p) => {
      const doc = await lib.PDFDocument.load(buf, { ignoreEncryption: true }); const font = await doc.embedFont(lib.StandardFonts.HelveticaBold); const size = +p.size; const text = p.t.trim(); if (!text) throw new Error("Enter the watermark text.");
      try { font.widthOfTextAtSize(text, size); } catch { throw new Error("This text has characters the PDF font cannot draw. Use English letters, digits and common symbols."); }
      const w = font.widthOfTextAtSize(text, size), a = (+p.rot * Math.PI) / 180;
      for (const pg of doc.getPages()) { const { width, height } = pg.getSize(); const x = width / 2 - (w / 2) * Math.cos(a) + (size / 3) * Math.sin(a), y = height / 2 - (w / 2) * Math.sin(a) - (size / 3) * Math.cos(a); pg.drawText(text, { x, y, size, font, color: lib.rgb(0.5, 0.5, 0.5), opacity: +p.o / 100, rotate: lib.degrees(+p.rot) }); }
      return { bytes: await doc.save(), msg: `Watermark added to ${doc.getPageCount()} pages.` };
    }}
  />
);
const BlankPage = () => (
  <PdfTool suffix="with-blank" ctls={[{ k: "after", label: "Insert after page (0 = at the start)", def: "1", type: "number" }, { k: "cnt", label: "Number of blank pages", def: "1", type: "number" }]}
    run={async (lib, buf, p) => {
      const doc = await lib.PDFDocument.load(buf, { ignoreEncryption: true }); const n = doc.getPageCount(); const a = Math.floor(+p.after), c = Math.min(Math.max(Math.floor(+p.cnt) || 1, 1), 50);
      if (!(a >= 0 && a <= n)) throw new Error(`Choose a number from 0 to ${n}.`);
      const ref = doc.getPage(Math.min(Math.max(a - 1, 0), n - 1)).getSize(); for (let i = 0; i < c; i++) doc.insertPage(a + i, [ref.width, ref.height]);
      return { bytes: await doc.save(), msg: `Added ${c} blank page(s) after page ${a}. The PDF now has ${doc.getPageCount()} pages.` };
    }}
  />
);
const CropPdf = () => (
  <PdfTool suffix="cropped" ctls={[{ k: "t", label: "Top margin (mm)", def: "10", type: "number" }, { k: "b", label: "Bottom margin (mm)", def: "10", type: "number" }, { k: "l", label: "Left margin (mm)", def: "10", type: "number" }, { k: "r", label: "Right margin (mm)", def: "10", type: "number" }]}
    run={async (lib, buf, p) => {
      const doc = await lib.PDFDocument.load(buf, { ignoreEncryption: true }); const k = 72 / 25.4; const [t, b, l, r] = [p.t, p.b, p.l, p.r].map((v) => Math.max(0, +v || 0) * k);
      for (const pg of doc.getPages()) { const { width, height } = pg.getSize(); if (l + r >= width || t + b >= height) throw new Error("The margins are larger than the page."); pg.setCropBox(l, b, width - l - r, height - t - b); }
      return { bytes: await doc.save(), msg: `Cropped ${doc.getPageCount()} pages. The visible area was reduced by the margins you set.` };
    }}
  />
);
function PdfMeta() {
  const [file, setFile] = useState<File | null>(null); const [m, setM] = useState<P | null>(null); const [info, setInfo] = useState(""); const [err, setErr] = useState(""); const [out, setOut] = useState<Blob | null>(null);
  async function load(f: File) { try { setFile(f); setOut(null); const { PDFDocument } = await import("pdf-lib"); const d = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false }); setM({ title: d.getTitle() ?? "", author: d.getAuthor() ?? "", subject: d.getSubject() ?? "", keywords: d.getKeywords() ?? "", creator: d.getCreator() ?? "", producer: d.getProducer() ?? "" }); const s = d.getPage(0).getSize(); setInfo(`${d.getPageCount()} pages, first page ${(s.width / 72 * 25.4).toFixed(0)} x ${(s.height / 72 * 25.4).toFixed(0)} mm, ${bytes(f.size)}`); setErr(""); } catch { setErr("Could not read this PDF. It may be damaged or password protected."); } }
  async function save() { if (!file || !m) return; const { PDFDocument } = await import("pdf-lib"); const d = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false }); d.setTitle(m.title); d.setAuthor(m.author); d.setSubject(m.subject); d.setKeywords(m.keywords.split(",").map((x) => x.trim()).filter(Boolean)); d.setCreator(m.creator); d.setProducer(m.producer); const b = await d.save(); setOut(new Blob([b as BlobPart], { type: "application/pdf" })); }
  const labels: [string, string][] = [["title", "Title"], ["author", "Author"], ["subject", "Subject"], ["keywords", "Keywords (comma separated)"], ["creator", "Creator"], ["producer", "Producer"]];
  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(f) => load(f[0])} label="Drop a PDF to view and edit its properties" />
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {m ? <div className="mt-4 space-y-3"><p className="text-sm text-text-muted">{info}</p><div className="grid gap-3 sm:grid-cols-2">{labels.map(([k, l]) => <Field key={k} label={l}><TextInput type="text" value={m[k]} onChange={(e) => setM({ ...m, [k]: e.target.value })} /></Field>)}</div><Button onClick={save}>Apply changes</Button>{out ? <div><Button onClick={() => downloadBlob(`${base(file!)}-meta.pdf`, out)}>⬇️ Download PDF</Button></div> : null}</div> : null}
    </ToolCard>
  );
}
function PdfCounter() {
  const [r, setR] = useState<{ n: number; w: number; h: number; s: number; name: string } | null>(null); const [err, setErr] = useState("");
  async function run(f: File) { try { const { PDFDocument } = await import("pdf-lib"); const d = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false }); const s = d.getPage(0).getSize(); setR({ n: d.getPageCount(), w: s.width, h: s.height, s: f.size, name: f.name }); setErr(""); } catch { setErr("Could not read this PDF."); } }
  const sz = (w: number, h: number) => { const a = [w, h].sort((x, y) => x - y); const std: [string, number, number][] = [["A4", 595, 842], ["A3", 842, 1191], ["A5", 420, 595], ["Letter", 612, 792], ["Legal", 612, 1008]]; return std.find(([, x, y]) => Math.abs(x - a[0]) < 4 && Math.abs(y - a[1]) < 4)?.[0] ?? "Custom"; };
  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(f) => run(f[0])} label="Drop a PDF to count its pages" />
      {err ? <div className="mt-3"><Alert>{err}</Alert></div> : null}
      {r ? <div className="mt-4 grid gap-3 sm:grid-cols-4"><StatBadge label="Pages" value={r.n} /><StatBadge label="Page size" value={`${sz(r.w, r.h)} (${(r.w / 72 * 25.4).toFixed(0)} x ${(r.h / 72 * 25.4).toFixed(0)} mm)`} /><StatBadge label="File size" value={bytes(r.s)} /><StatBadge label="Average per page" value={bytes(Math.round(r.s / r.n))} /></div> : null}
    </ToolCard>
  );
}

const PCT = (k: string, label: string, def: string, min = 0, max = 100): Ctl => ({ k, label, def, type: "range", min, max });
const Lab = (render: (i: HTMLImageElement, p: P) => HTMLCanvasElement, suffix: string, ctls: Ctl[] = [], ext: "png" | "jpg" = "png") => () => <ImgLab render={render} suffix={suffix} ctls={ctls} ext={ext} />;

export const WAVE4: Record<string, () => ReactNode> = {
  "black-and-white-image-converter": Lab(bw, "bw", [PCT("amt", "Black and white amount %", "100")], "jpg"),
  "sepia-photo-filter": Lab(sepia, "sepia", [PCT("amt", "Sepia strength %", "100")], "jpg"),
  "invert-image-colors": Lab(invert, "inverted"),
  "image-brightness-contrast-editor": Lab(bc, "adjusted", [PCT("b", "Brightness", "0", -100, 100), PCT("c", "Contrast", "0", -100, 100)], "jpg"),
  "image-hue-saturation-editor": Lab(hs, "colors", [PCT("h", "Hue shift (degrees)", "0", -180, 180), PCT("s", "Saturation", "0", -100, 100)], "jpg"),
  "image-opacity-changer": Lab(opacity, "transparent", [PCT("o", "Opacity %", "60", 0, 100)]),
  "remove-white-background": Lab(removeWhite, "no-bg", [PCT("t", "Tolerance (how close to white)", "30", 1, 120)]),
  "pixelate-image": Lab(pixelate, "pixelated", [PCT("s", "Block size (px)", "16", 2, 80)]),
  "add-border-to-image": Lab(border, "border", [PCT("w", "Border width (px)", "30", 1, 300), { k: "color", label: "Border color", def: "#ffffff", type: "color" }]),
  "make-image-square": Lab(square, "square", [{ k: "bg", label: "Background", def: "solid", type: "select", options: [["solid", "Solid color"], ["transparent", "Transparent (PNG)"]] }, { k: "color", label: "Color", def: "#ffffff", type: "color" }]),
  "round-image-corners": Lab(rounded, "rounded", [PCT("r", "Roundness %", "30")]),
  "circle-crop-image": Lab(circle, "circle"),
  "add-watermark-to-image": Lab(watermark, "watermarked", [{ k: "text", label: "Watermark text", def: "© Your Name", type: "text" }, { k: "pos", label: "Position", def: "br", type: "select", options: POS }, PCT("size", "Text size (% of image)", "6", 2, 30), PCT("o", "Opacity %", "60", 5, 100), { k: "color", label: "Text color", def: "#ffffff", type: "color" }], "jpg"),
  "passport-photo-resizer": Presets(PASS, "passport"),
  "social-media-image-resizer": Presets(SOCIAL, "social"),
  "compress-image-to-50kb": () => <KbCompress kb={50} />,
  "compress-image-to-100kb": () => <KbCompress kb={100} />,
  "compress-image-to-200kb": () => <KbCompress kb={200} />,
  "image-size-checker": () => <ImageInfo />,
  "image-color-picker": () => <ColorPicker />,
  "image-color-palette-extractor": () => <Palette />,
  "merge-images": () => <Merge />,
  "svg-to-png-converter": () => <SvgToPng />,
  "remove-exif-data-from-image": () => <ExifRemover />,
  "delete-pdf-pages": DeletePages,
  "extract-pdf-pages": ExtractPages,
  "reverse-pdf-pages": ReversePages,
  "add-watermark-to-pdf": PdfWatermark,
  "add-blank-page-to-pdf": BlankPage,
  "crop-pdf-margins": CropPdf,
  "pdf-metadata-editor": () => <PdfMeta />,
  "pdf-page-counter": () => <PdfCounter />,
};
