"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import JSZip from "jszip";
import {
  Alert,
  Button,
  CopyButton,
  Dropzone,
  Field,
  Select,
  StatBadge,
  TextArea,
  TextInput,
  ToolCard,
  downloadBlob,
  downloadText,
} from "./ui";
import type { ComponentRegistry } from "@/lib/types";

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not export image"))), type, quality);
  });
}

function bytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/* ---------------- Image Compressor ---------------- */
export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [quality, setQuality] = useState(0.75);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(f: File) {
    setFile(f);
    setBusy(true);
    setError("");
    try {
      const compressed = await imageCompression(f, {
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        fileType: format,
        initialQuality: quality,
      });
      setResult({ blob: compressed, url: URL.createObjectURL(compressed) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed");
    }
    setBusy(false);
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => run(files[0])} label="Drag & drop an image (JPG, PNG, WEBP)" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Output format">
          <Select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WEBP</option>
          </Select>
        </Field>
        <Field label={`Quality: ${Math.round(quality * 100)}%`}>
          <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
        </Field>
      </div>
      {file ? <div className="mt-3"><Button onClick={() => run(file)} disabled={busy}>{busy ? "Compressing…" : "Re-compress with these settings"}</Button></div> : null}
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {result ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatBadge label="Original" value={bytes(file!.size)} />
            <StatBadge label="Compressed" value={bytes(result.blob.size)} />
            <StatBadge label="Saved" value={`${Math.max(0, Math.round((1 - result.blob.size / file!.size) * 100))}%`} />
          </div>
          <img src={result.url} alt="Compressed preview" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob(`compressed.${format.split("/")[1]}`, result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- PNG <-> JPG ---------------- */
export function PngJpgConverter() {
  const [target, setTarget] = useState<"image/png" | "image/jpeg">("image/jpeg");
  const [bg, setBg] = useState("#ffffff");
  const [quality, setQuality] = useState(0.9);
  const [result, setResult] = useState<{ url: string; blob: Blob; size: number } | null>(null);
  const [original, setOriginal] = useState<number>(0);

  async function run(f: File) {
    setOriginal(f.size);
    const img = await loadImage(f);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    if (target === "image/jpeg") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, target, target === "image/jpeg" ? quality : undefined);
    setResult({ url: URL.createObjectURL(blob), blob, size: blob.size });
  }

  return (
    <ToolCard>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Field label="Convert to">
          <Select value={target} onChange={(e) => setTarget(e.target.value as typeof target)}>
            <option value="image/jpeg">JPG</option>
            <option value="image/png">PNG</option>
          </Select>
        </Field>
        {target === "image/jpeg" ? (
          <>
            <Field label="Background (for transparency)"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded" /></Field>
            <Field label={`Quality: ${Math.round(quality * 100)}%`}>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
            </Field>
          </>
        ) : null}
      </div>
      <Dropzone accept="image/png,image/jpeg" onFiles={(files) => run(files[0])} />
      {result ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <StatBadge label="Original" value={bytes(original)} />
            <StatBadge label="Converted" value={bytes(result.size)} />
          </div>
          <img src={result.url} alt="Converted preview" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob(`converted.${target.split("/")[1]}`, result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Image to WEBP ---------------- */
export function ImageToWebp() {
  const [quality, setQuality] = useState(0.85);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [original, setOriginal] = useState(0);

  async function run(f: File) {
    setOriginal(f.size);
    const img = await loadImage(f);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/webp", quality);
    setResult({ url: URL.createObjectURL(blob), blob });
  }

  return (
    <ToolCard>
      <Field label={`Quality: ${Math.round(quality * 100)}%`}>
        <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" />
      </Field>
      <div className="mt-4"><Dropzone accept="image/png,image/jpeg" onFiles={(files) => run(files[0])} /></div>
      {result ? (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <StatBadge label="Original" value={bytes(original)} />
            <StatBadge label="WEBP size" value={bytes(result.blob.size)} />
          </div>
          <img src={result.url} alt="WEBP preview" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob("converted.webp", result.blob)}>⬇️ Download WEBP</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- WEBP to PNG/JPG ---------------- */
export function WebpToPngJpg() {
  const [target, setTarget] = useState<"image/png" | "image/jpeg">("image/png");
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);

  async function run(f: File) {
    const img = await loadImage(f);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    if (target === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, target, 0.92);
    setResult({ url: URL.createObjectURL(blob), blob });
  }

  return (
    <ToolCard>
      <Field label="Convert to">
        <Select value={target} onChange={(e) => setTarget(e.target.value as typeof target)}>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPG</option>
        </Select>
      </Field>
      <div className="mt-4"><Dropzone accept="image/webp" onFiles={(files) => run(files[0])} label="Drag & drop a WEBP file" /></div>
      {result ? (
        <div className="mt-4 space-y-3">
          <img src={result.url} alt="preview" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob(`converted.${target.split("/")[1]}`, result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Image Resizer ---------------- */
export function ImageResizer() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [w, setW] = useState(800);
  const [h, setH] = useState(600);
  const [lock, setLock] = useState(true);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);
  const ratio = useRef(1);

  async function onFile(f: File) {
    const image = await loadImage(f);
    setImg(image);
    ratio.current = image.width / image.height;
    setW(image.width);
    setH(image.height);
  }

  function setWidth(v: number) {
    setW(v);
    if (lock) setH(Math.round(v / ratio.current));
  }
  function setHeight(v: number) {
    setH(v);
    if (lock) setW(Math.round(v * ratio.current));
  }

  async function apply() {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const blob = await canvasToBlob(canvas, "image/png");
    setResult({ url: URL.createObjectURL(blob), blob });
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => onFile(files[0])} />
      {img ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-500">Original: {img.width} × {img.height}px</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Width (px)"><TextInput type="number" value={w} onChange={(e) => setWidth(Number(e.target.value))} /></Field>
            <Field label="Height (px)"><TextInput type="number" value={h} onChange={(e) => setHeight(Number(e.target.value))} /></Field>
            <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} /> Lock aspect ratio</label>
          </div>
          <Button onClick={apply}>Resize</Button>
        </div>
      ) : null}
      {result ? (
        <div className="mt-4 space-y-3">
          <img src={result.url} alt="resized" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob("resized.png", result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Image Cropper ---------------- */
export function ImageCropper() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [cw, setCw] = useState(200);
  const [ch, setCh] = useState(200);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);

  async function onFile(f: File) {
    const image = await loadImage(f);
    setImg(image);
    setX(0);
    setY(0);
    setCw(Math.round(image.width / 2));
    setCh(Math.round(image.height / 2));
  }

  function preset(ratio: number) {
    if (!img) return;
    const width = Math.min(img.width, img.height * ratio);
    const height = width / ratio;
    setCw(Math.round(width));
    setCh(Math.round(height));
    setX(Math.round((img.width - width) / 2));
    setY(Math.round((img.height - height) / 2));
  }

  async function apply() {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    canvas.getContext("2d")!.drawImage(img, x, y, cw, ch, 0, 0, cw, ch);
    const blob = await canvasToBlob(canvas, "image/png");
    setResult({ url: URL.createObjectURL(blob), blob });
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => onFile(files[0])} />
      {img ? (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-500">Original: {img.width} × {img.height}px</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => preset(1)}>1:1</Button>
            <Button variant="secondary" onClick={() => preset(4 / 3)}>4:3</Button>
            <Button variant="secondary" onClick={() => preset(16 / 9)}>16:9</Button>
            <Button variant="secondary" onClick={() => preset(3 / 2)}>3:2</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="X"><TextInput type="number" value={x} onChange={(e) => setX(Number(e.target.value))} /></Field>
            <Field label="Y"><TextInput type="number" value={y} onChange={(e) => setY(Number(e.target.value))} /></Field>
            <Field label="Width"><TextInput type="number" value={cw} onChange={(e) => setCw(Number(e.target.value))} /></Field>
            <Field label="Height"><TextInput type="number" value={ch} onChange={(e) => setCh(Number(e.target.value))} /></Field>
          </div>
          <Button onClick={apply}>Crop</Button>
        </div>
      ) : null}
      {result ? (
        <div className="mt-4 space-y-3">
          <img src={result.url} alt="cropped" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob("cropped.png", result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- SVG Color/Optimizer ---------------- */
export function SvgColorOptimizer() {
  const [input, setInput] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#000000" d="M12 2L2 22h20L12 2z"/></svg>');
  const [color, setColor] = useState("#4f46e5");
  const [optimize, setOptimize] = useState(true);

  const output = useMemo(() => {
    let svg = input.replace(/fill="(?!none)[^"]*"/g, `fill="${color}"`).replace(/stroke="(?!none)[^"]*"/g, `stroke="${color}"`);
    if (optimize) {
      svg = svg
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .replace(/> </g, "><")
        .trim();
    }
    return svg;
  }, [input, color, optimize]);

  const dataUrl = useMemo(() => `data:image/svg+xml;utf8,${encodeURIComponent(output)}`, [output]);

  return (
    <ToolCard>
      <Field label="Paste SVG markup"><TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <Field label="New color"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded" /></Field>
        <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={optimize} onChange={(e) => setOptimize(e.target.checked)} /> Optimize / minify markup</label>
      </div>
      <div className="mb-4 flex justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
        <img src={dataUrl} alt="SVG preview" className="h-24 w-24" />
      </div>
      <TextArea rows={6} value={output} readOnly className="font-mono" />
      <div className="mt-2 flex gap-2">
        <CopyButton getText={() => output} />
        <Button onClick={() => downloadText("icon.svg", output, "image/svg+xml")}>⬇️ Download</Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- QR Code Generator ---------------- */
export function QrCodeGenerator() {
  const [text, setText] = useState("https://toolforall.com");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState("");

  async function render() {
    if (!canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text || " ", {
        width: 400,
        margin: 2,
        errorCorrectionLevel: ecLevel,
        color: { dark: fg, light: bg },
      });
      if (logo) {
        const ctx = canvasRef.current.getContext("2d")!;
        const size = 400 * 0.2;
        const pos = (400 - size) / 2;
        ctx.fillStyle = "#fff";
        ctx.fillRect(pos - 4, pos - 4, size + 8, size + 8);
        ctx.drawImage(logo, pos, pos, size, size);
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate QR code");
    }
  }

  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fg, bg, ecLevel, logo]);

  async function onLogo(f: File) {
    const img = await loadImage(f);
    setLogo(img);
  }

  function download() {
    canvasRef.current?.toBlob((blob) => blob && downloadBlob("qrcode.png", blob));
  }

  return (
    <ToolCard>
      <Field label="Text or URL to encode"><TextInput value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <div className="my-4 grid gap-4 sm:grid-cols-4">
        <Field label="Foreground"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-full rounded" /></Field>
        <Field label="Background"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded" /></Field>
        <Field label="Error correction">
          <Select value={ecLevel} onChange={(e) => setEcLevel(e.target.value as typeof ecLevel)}>
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H) — best with logo</option>
          </Select>
        </Field>
        <Field label="Logo (optional)"><input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onLogo(e.target.files[0])} className="text-sm" /></Field>
      </div>
      {error ? <Alert type="error">{error}</Alert> : null}
      <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700">
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 flex justify-center"><Button onClick={download}>⬇️ Download PNG</Button></div>
    </ToolCard>
  );
}

/* ---------------- Barcode Generator ---------------- */
export function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      JsBarcode(canvasRef.current, value || " ", { format, width: 2, height: 100, displayValue: true });
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate this barcode — check the value matches the format's requirements.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format]);

  function download() {
    canvasRef.current?.toBlob((blob) => blob && downloadBlob("barcode.png", blob));
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Value"><TextInput value={value} onChange={(e) => setValue(e.target.value)} /></Field>
        <Field label="Format">
          <Select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="CODE128">CODE128</option>
            <option value="EAN13">EAN-13</option>
            <option value="UPC">UPC-A</option>
            <option value="CODE39">CODE39</option>
          </Select>
        </Field>
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      <div className="mt-4 flex justify-center overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700">
        <canvas ref={canvasRef} />
      </div>
      <div className="mt-4 flex justify-center"><Button onClick={download}>⬇️ Download PNG</Button></div>
    </ToolCard>
  );
}

/* ---------------- Favicon Generator ---------------- */
const FAVICON_SIZES = [16, 32, 48, 180, 192, 512];
export function FaviconGenerator() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function onFile(f: File) {
    const image = await loadImage(f);
    setImg(image);
    const p = FAVICON_SIZES.map((size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d")!.drawImage(image, 0, 0, size, size);
      return { size, url: canvas.toDataURL("image/png") };
    });
    setPreviews(p);
  }

  async function downloadZip() {
    if (!img) return;
    setBusy(true);
    const zip = new JSZip();
    for (const size of FAVICON_SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d")!.drawImage(img, 0, 0, size, size);
      const blob = await canvasToBlob(canvas, "image/png");
      zip.file(`favicon-${size}x${size}.png`, blob);
    }
    const canvas32 = document.createElement("canvas");
    canvas32.width = 32;
    canvas32.height = 32;
    canvas32.getContext("2d")!.drawImage(img, 0, 0, 32, 32);
    const icoBlob = await canvasToBlob(canvas32, "image/png");
    zip.file("favicon.ico", icoBlob);
    const html = FAVICON_SIZES.map((s) => `<link rel="icon" type="image/png" sizes="${s}x${s}" href="/favicon-${s}x${s}.png">`).join("\n");
    zip.file("favicon-tags.html", html);
    const content = await zip.generateAsync({ type: "blob" });
    downloadBlob("favicons.zip", content);
    setBusy(false);
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => onFile(files[0])} label="Upload a square logo (512×512px recommended)" />
      {previews.length ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            {previews.map((p) => (
              <div key={p.size} className="text-center">
                <img src={p.url} alt={`${p.size}px`} style={{ width: Math.min(p.size, 64), height: Math.min(p.size, 64) }} className="mx-auto rounded border border-slate-200 dark:border-slate-700" />
                <p className="mt-1 text-xs text-slate-500">{p.size}px</p>
              </div>
            ))}
          </div>
          <Button onClick={downloadZip} disabled={busy}>{busy ? "Zipping…" : "⬇️ Download all sizes (.zip)"}</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Image to Base64 ---------------- */
export function ImageToBase64() {
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");

  function onFile(f: File) {
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => setResult(reader.result as string);
    reader.readAsDataURL(f);
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => onFile(files[0])} />
      {result ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-500">{fileName} — {bytes(result.length)}</p>
          <img src={result} alt="preview" className="max-h-40 rounded border border-slate-200 dark:border-slate-700" />
          <TextArea rows={8} value={result} readOnly className="font-mono text-xs" />
          <CopyButton getText={() => result} />
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Image Blur ---------------- */
export function ImageBlurTool() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [blur, setBlur] = useState(8);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);

  async function onFile(f: File) {
    setImg(await loadImage(f));
  }

  async function apply() {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.filter = `blur(${blur}px)`;
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/png");
    setResult({ url: URL.createObjectURL(blob), blob });
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => onFile(files[0])} />
      {img ? (
        <div className="mt-4 space-y-4">
          <Field label={`Blur intensity: ${blur}px`}>
            <input type="range" min={0} max={30} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" />
          </Field>
          <Button onClick={apply}>Apply Blur</Button>
        </div>
      ) : null}
      {result ? (
        <div className="mt-4 space-y-3">
          <img src={result.url} alt="blurred" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob("blurred.png", result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Flip/Rotate ---------------- */
export function FlipRotateImage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [result, setResult] = useState<{ url: string; blob: Blob } | null>(null);

  async function onFile(f: File) {
    setImg(await loadImage(f));
    setAngle(0);
    setFlipH(false);
    setFlipV(false);
  }

  async function apply() {
    if (!img) return;
    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = img.width * cos + img.height * sin;
    const h = img.width * sin + img.height * cos;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    const blob = await canvasToBlob(canvas, "image/png");
    setResult({ url: URL.createObjectURL(blob), blob });
  }

  return (
    <ToolCard>
      <Dropzone accept="image/*" onFiles={(files) => onFile(files[0])} />
      {img ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setAngle((a) => (a + 90) % 360)}>Rotate 90°</Button>
            <Button variant="secondary" onClick={() => setAngle((a) => (a + 180) % 360)}>Rotate 180°</Button>
            <Button variant="secondary" onClick={() => setFlipH((v) => !v)}>Flip Horizontal</Button>
            <Button variant="secondary" onClick={() => setFlipV((v) => !v)}>Flip Vertical</Button>
          </div>
          <Field label={`Custom angle: ${angle}°`}>
            <input type="range" min={0} max={359} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" />
          </Field>
          <Button onClick={apply}>Apply</Button>
        </div>
      ) : null}
      {result ? (
        <div className="mt-4 space-y-3">
          <img src={result.url} alt="transformed" className="max-h-80 rounded-lg border border-slate-200 dark:border-slate-700" />
          <Button onClick={() => downloadBlob("transformed.png", result.blob)}>⬇️ Download</Button>
        </div>
      ) : null}
    </ToolCard>
  );
}

export const imageComponents: ComponentRegistry = {
  ImageCompressor,
  PngJpgConverter,
  ImageToWebp,
  WebpToPngJpg,
  ImageResizer,
  ImageCropper,
  SvgColorOptimizer,
  QrCodeGenerator,
  BarcodeGenerator,
  FaviconGenerator,
  ImageToBase64,
  ImageBlurTool,
  FlipRotateImage,
};
