"use client";

import { useState } from "react";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
import JSZip from "jszip";
import {
  Alert,
  Button,
  Dropzone,
  Field,
  OutputBox,
  Select,
  StatBadge,
  TextInput,
  ToolCard,
  downloadBlob,
  downloadText,
} from "./ui";
import type { ComponentRegistry } from "@/lib/types";

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function getPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  return pdfjsLib;
}

/* ---------------- PDF Compressor ---------------- */
export function PdfCompressor() {
  const [original, setOriginal] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState<"light" | "medium" | "strong">("medium");

  const qualityMap = { light: 0.8, medium: 0.55, strong: 0.35 };
  const scaleMap = { light: 1.5, medium: 1.2, strong: 0.9 };

  async function run(f: File) {
    setBusy(true);
    setError("");
    setResult(null);
    setOriginal(f.size);
    try {
      const pdfjsLib = await getPdfjs();
      const buf = await f.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: buf }).promise;
      const outDoc = await PDFDocument.create();
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: scaleMap[level] });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const jpegUrl = canvas.toDataURL("image/jpeg", qualityMap[level]);
        const jpegBytes = await fetch(jpegUrl).then((r) => r.arrayBuffer());
        const img = await outDoc.embedJpg(jpegBytes);
        const newPage = outDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
      }
      const bytesOut = await outDoc.save();
      setResult(new Blob([bytesOut.buffer as ArrayBuffer], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not compress this PDF");
    }
    setBusy(false);
  }

  return (
    <ToolCard>
      <Field label="Compression level">
        <Select value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
          <option value="light">Light (best quality)</option>
          <option value="medium">Medium (recommended)</option>
          <option value="strong">Strong (smallest size)</option>
        </Select>
      </Field>
      <div className="mt-4"><Dropzone accept="application/pdf" onFiles={(files) => run(files[0])} label="Drag & drop a PDF file" /></div>
      {busy ? <div className="mt-3"><Alert type="info">Compressing your PDF, this can take a moment for larger files…</Alert></div> : null}
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {result ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <StatBadge label="Original" value={bytes(original)} />
            <StatBadge label="Compressed" value={bytes(result.size)} />
            <StatBadge label="Saved" value={`${Math.max(0, Math.round((1 - result.size / original) * 100))}%`} />
          </div>
          <Button onClick={() => downloadBlob("compressed.pdf", result)}>⬇️ Download compressed PDF</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Merge PDF ---------------- */
export function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function addFiles(newFiles: File[]) {
    setFiles((f) => [...f, ...newFiles]);
  }
  function move(i: number, dir: -1 | 1) {
    setFiles((f) => {
      const arr = [...f];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  async function merge() {
    if (files.length < 2) {
      setError("Add at least two PDF files to merge.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const outDoc = await PDFDocument.create();
      for (const f of files) {
        const bytesIn = await f.arrayBuffer();
        const src = await PDFDocument.load(bytesIn);
        const pages = await outDoc.copyPages(src, src.getPageIndices());
        pages.forEach((p) => outDoc.addPage(p));
      }
      const out = await outDoc.save();
      downloadBlob("merged.pdf", new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not merge these PDFs");
    }
    setBusy(false);
  }

  return (
    <ToolCard>
      <Dropzone accept="application/pdf" multiple onFiles={addFiles} label="Drag & drop two or more PDF files" />
      {files.length > 0 ? (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              <span>{i + 1}. {f.name} ({bytes(f.size)})</span>
              <div className="flex gap-1">
                <Button variant="ghost" onClick={() => move(i, -1)}>↑</Button>
                <Button variant="ghost" onClick={() => move(i, 1)}>↓</Button>
                <Button variant="ghost" onClick={() => setFiles((arr) => arr.filter((_, idx) => idx !== i))}>✕</Button>
              </div>
            </div>
          ))}
          <Button onClick={merge} disabled={busy}>{busy ? "Merging…" : "Merge PDFs"}</Button>
        </div>
      ) : null}
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- Split PDF ---------------- */
export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFile(f: File) {
    setFile(f);
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
  }

  function parseRange(r: string, max: number) {
    const [a, b] = r.split("-").map((s) => parseInt(s.trim(), 10));
    const start = Math.max(1, a || 1);
    const end = Math.min(max, b || a || max);
    return { start, end };
  }

  async function splitRange() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const { start, end } = parseRange(range, doc.getPageCount());
      const outDoc = await PDFDocument.create();
      const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
      const pages = await outDoc.copyPages(doc, indices);
      pages.forEach((p) => outDoc.addPage(p));
      const out = await outDoc.save();
      downloadBlob(`pages-${start}-${end}.pdf`, new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not split this PDF");
    }
    setBusy(false);
  }

  async function splitAll() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const zip = new JSZip();
      for (let i = 0; i < doc.getPageCount(); i++) {
        const outDoc = await PDFDocument.create();
        const [page] = await outDoc.copyPages(doc, [i]);
        outDoc.addPage(page);
        const out = await outDoc.save();
        zip.file(`page-${i + 1}.pdf`, out);
      }
      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob("split-pages.zip", content);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not split this PDF");
    }
    setBusy(false);
  }

  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(files) => onFile(files[0])} />
      {file ? (
        <div className="mt-4 space-y-4">
          <StatBadge label="Total pages" value={pageCount} />
          <Button onClick={splitAll} disabled={busy}>{busy ? "Working…" : "Split into individual pages (.zip)"}</Button>
          <div className="flex items-end gap-2">
            <Field label="Custom page range (e.g. 3-7)"><TextInput value={range} onChange={(e) => setRange(e.target.value)} placeholder="3-7" /></Field>
            <Button variant="secondary" onClick={splitRange} disabled={busy}>Extract range</Button>
          </div>
        </div>
      ) : null}
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- JPG to PDF ---------------- */
export function JpgToPdf() {
  const [images, setImages] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("a4");
  const [busy, setBusy] = useState(false);

  function move(i: number, dir: -1 | 1) {
    setImages((f) => {
      const arr = [...f];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  async function convert() {
    setBusy(true);
    try {
      const doc = await PDFDocument.create();
      for (const file of images) {
        const bytesIn = await file.arrayBuffer();
        const isPng = file.type === "image/png";
        const img = isPng ? await doc.embedPng(bytesIn) : await doc.embedJpg(bytesIn);
        let pw = img.width, ph = img.height;
        if (pageSize === "a4") { pw = 595.28; ph = 841.89; }
        if (pageSize === "letter") { pw = 612; ph = 792; }
        const page = doc.addPage([pw, ph]);
        if (pageSize === "fit") {
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        } else {
          const scale = Math.min(pw / img.width, ph / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
        }
      }
      const out = await doc.save();
      downloadBlob("images.pdf", new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolCard>
      <Field label="Page size">
        <Select value={pageSize} onChange={(e) => setPageSize(e.target.value as typeof pageSize)}>
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="fit">Fit to image</option>
        </Select>
      </Field>
      <div className="mt-4"><Dropzone accept="image/jpeg,image/png" multiple onFiles={(f) => setImages((arr) => [...arr, ...f])} label="Drag & drop one or more images" /></div>
      {images.length > 0 ? (
        <div className="mt-4 space-y-2">
          {images.map((f, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
              <span>{i + 1}. {f.name}</span>
              <div className="flex gap-1">
                <Button variant="ghost" onClick={() => move(i, -1)}>↑</Button>
                <Button variant="ghost" onClick={() => move(i, 1)}>↓</Button>
                <Button variant="ghost" onClick={() => setImages((arr) => arr.filter((_, idx) => idx !== i))}>✕</Button>
              </div>
            </div>
          ))}
          <Button onClick={convert} disabled={busy}>{busy ? "Converting…" : "Convert to PDF"}</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- PDF to JPG ---------------- */
export function PdfToJpg() {
  const [pages, setPages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [scale, setScale] = useState(2);

  async function run(f: File) {
    setBusy(true);
    try {
      const pdfjsLib = await getPdfjs();
      const doc = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      const out: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        out.push(canvas.toDataURL("image/jpeg", 0.9));
      }
      setPages(out);
    } finally {
      setBusy(false);
    }
  }

  async function downloadAll() {
    const zip = new JSZip();
    for (let i = 0; i < pages.length; i++) {
      const data = pages[i].split(",")[1];
      zip.file(`page-${i + 1}.jpg`, data, { base64: true });
    }
    downloadBlob("pdf-pages.zip", await zip.generateAsync({ type: "blob" }));
  }

  return (
    <ToolCard>
      <Field label="Resolution scale">
        <Select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
          <option value={1}>Standard (1x)</option>
          <option value={2}>High (2x)</option>
          <option value={3}>Very high (3x)</option>
        </Select>
      </Field>
      <div className="mt-4"><Dropzone accept="application/pdf" onFiles={(files) => run(files[0])} /></div>
      {busy ? <div className="mt-3"><Alert type="info">Rendering pages…</Alert></div> : null}
      {pages.length > 0 ? (
        <div className="mt-4 space-y-4">
          <Button onClick={downloadAll}>⬇️ Download all as .zip</Button>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {pages.map((p, i) => (
              <div key={i} className="text-center">
                <img src={p} alt={`page ${i + 1}`} className="rounded border border-slate-200 dark:border-slate-700" />
                <a href={p} download={`page-${i + 1}.jpg`} className="mt-1 block text-xs text-indigo-600 hover:underline">Download page {i + 1}</a>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Extract Images from PDF ---------------- */
export const ExtractImagesFromPdf = PdfToJpg;

/* ---------------- Rotate PDF ---------------- */
export function RotatePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [globalRotation, setGlobalRotation] = useState(90);
  const [busy, setBusy] = useState(false);

  async function onFile(f: File) {
    setFile(f);
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
  }

  async function apply() {
    if (!file) return;
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + globalRotation) % 360)));
      const out = await doc.save();
      downloadBlob("rotated.pdf", new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(files) => onFile(files[0])} />
      {file ? (
        <div className="mt-4 space-y-4">
          <StatBadge label="Total pages" value={pageCount} />
          <Field label="Rotate all pages by">
            <Select value={globalRotation} onChange={(e) => setGlobalRotation(Number(e.target.value))}>
              <option value={90}>90° clockwise</option>
              <option value={180}>180°</option>
              <option value={270}>270° (90° counter-clockwise)</option>
            </Select>
          </Field>
          <Button onClick={apply} disabled={busy}>{busy ? "Rotating…" : "Rotate & Download"}</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Unlock PDF ---------------- */
export function UnlockPdf() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(f: File) {
    setBusy(true);
    setError("");
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      const out = await doc.save();
      downloadBlob("unlocked.pdf", new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not process this PDF. It may require an open password, which cannot be bypassed.");
    }
    setBusy(false);
  }

  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(files) => run(files[0])} label="Drag & drop a restricted PDF (opens without a password)" />
      {busy ? <div className="mt-3"><Alert type="info">Processing…</Alert></div> : null}
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      <div className="mt-3"><Alert type="info">This only removes print/copy/edit restrictions from PDFs that already open without a password. It cannot crack a genuine open-password.</Alert></div>
    </ToolCard>
  );
}

/* ---------------- Extract Text from PDF ---------------- */
export function ExtractTextFromPdf() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(f: File) {
    setBusy(true);
    setError("");
    try {
      const pdfjsLib = await getPdfjs();
      const doc = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      let out = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((it) => ("str" in it ? it.str : "")).join(" ");
        out += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      setText(out.trim());
      if (!out.replace(/---.*?---/g, "").trim()) {
        setError("No text found — this PDF is likely a scanned image without a text layer (OCR would be required).");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not extract text");
    }
    setBusy(false);
  }

  return (
    <ToolCard>
      <Dropzone accept="application/pdf" onFiles={(files) => run(files[0])} />
      {busy ? <div className="mt-3"><Alert type="info">Extracting text…</Alert></div> : null}
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {text ? (
        <div className="mt-4 space-y-2">
          <OutputBox value={text} rows={14} />
          <div className="flex gap-2">
            <Button onClick={() => navigator.clipboard.writeText(text)}>📋 Copy</Button>
            <Button variant="secondary" onClick={() => downloadText("extracted.txt", text)}>⬇️ Download .txt</Button>
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- PDF Page Numberer ---------------- */
export function PdfPageNumberer() {
  const [position, setPosition] = useState("bottom-center");
  const [startAt, setStartAt] = useState(1);
  const [format, setFormat] = useState<"n" | "page-n" | "n-of-total">("n-of-total");
  const [busy, setBusy] = useState(false);

  async function run(f: File) {
    setBusy(true);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;
      pages.forEach((page, idx) => {
        const num = startAt + idx;
        const label = format === "n" ? `${num}` : format === "page-n" ? `Page ${num}` : `${num} of ${startAt + total - 1}`;
        const { width, height } = page.getSize();
        const size = 10;
        const textWidth = font.widthOfTextAtSize(label, size);
        let x = width / 2 - textWidth / 2;
        let y = 20;
        if (position.includes("left")) x = 30;
        if (position.includes("right")) x = width - textWidth - 30;
        if (position.includes("top")) y = height - 30;
        page.drawText(label, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) });
      });
      const out = await doc.save();
      downloadBlob("numbered.pdf", new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Position">
          <Select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="bottom-center">Bottom center</option>
            <option value="bottom-left">Bottom left</option>
            <option value="bottom-right">Bottom right</option>
            <option value="top-center">Top center</option>
            <option value="top-left">Top left</option>
            <option value="top-right">Top right</option>
          </Select>
        </Field>
        <Field label="Start at"><TextInput type="number" value={startAt} onChange={(e) => setStartAt(Number(e.target.value))} /></Field>
        <Field label="Format">
          <Select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="n">1</option>
            <option value="page-n">Page 1</option>
            <option value="n-of-total">1 of 12</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4"><Dropzone accept="application/pdf" onFiles={(files) => run(files[0])} /></div>
      {busy ? <div className="mt-3"><Alert type="info">Adding page numbers…</Alert></div> : null}
    </ToolCard>
  );
}

export const pdfComponents: ComponentRegistry = {
  PdfCompressor,
  MergePdf,
  SplitPdf,
  JpgToPdf,
  PdfToJpg,
  ExtractImagesFromPdf,
  RotatePdfPages,
  UnlockPdf,
  ExtractTextFromPdf,
  PdfPageNumberer,
};
