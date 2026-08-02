"use client";

import { useMemo, useState } from "react";
import chroma from "chroma-js";
import { Button, CopyButton, Field, OutputBox, Select, TextInput, ToolCard, Alert } from "./ui";
import type { ComponentRegistry } from "@/lib/types";

function Swatch({ color, label }: { color: string; label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-16 w-16 rounded-lg border border-slate-200 shadow-sm dark:border-slate-700" style={{ backgroundColor: color }} />
      {label ? <span className="font-mono text-xs">{label}</span> : null}
    </div>
  );
}

/* ---------------- Color Picker ---------------- */
export function ColorPickerTool() {
  const [color, setColor] = useState("#4f46e5");
  const c = useMemo(() => {
    try { return chroma(color); } catch { return chroma("#000000"); }
  }, [color]);
  const rgb = c.rgb();
  const hsl = c.hsl().map((v, i) => (i === 0 ? Math.round(v || 0) : Math.round(v * 100)));

  return (
    <ToolCard>
      <div className="flex flex-wrap items-center gap-6">
        <input type="color" value={c.hex()} onChange={(e) => setColor(e.target.value)} className="h-24 w-24 cursor-pointer rounded-lg border border-slate-200" />
        <div className="space-y-3">
          <Field label="HEX"><div className="flex gap-2"><TextInput value={c.hex()} onChange={(e) => setColor(e.target.value)} /><CopyButton getText={() => c.hex()} label="" /></div></Field>
          <Field label="RGB"><div className="flex gap-2"><OutputBox value={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`} rows={1} /><CopyButton getText={() => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`} label="" /></div></Field>
          <Field label="HSL"><div className="flex gap-2"><OutputBox value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} rows={1} /><CopyButton getText={() => `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} label="" /></div></Field>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- Color Palette Generator ---------------- */
export function ColorPaletteGenerator() {
  const [base, setBase] = useState("#4f46e5");
  const [type, setType] = useState("analogous");

  const palette = useMemo(() => {
    try {
      const [h, s, l] = chroma(base).hsl();
      const hue = isNaN(h) ? 0 : h;
      if (type === "analogous") return [-40, -20, 0, 20, 40].map((d) => chroma.hsl((hue + d + 360) % 360, s || 0.6, l || 0.5).hex());
      if (type === "complementary") return [0, 15, -15, 180, 165].map((d) => chroma.hsl((hue + d + 360) % 360, s || 0.6, l || 0.5).hex());
      if (type === "triadic") return [0, 120, 240, 60, 300].map((d) => chroma.hsl((hue + d + 360) % 360, s || 0.6, l || 0.5).hex());
      return [0.2, 0.35, 0.5, 0.65, 0.8].map((lt) => chroma.hsl(hue, s || 0.5, lt).hex());
    } catch {
      return ["#000000", "#333333", "#666666", "#999999", "#cccccc"];
    }
  }, [base, type]);

  return (
    <ToolCard>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Field label="Base color"><input type="color" value={base} onChange={(e) => setBase(e.target.value)} className="h-10 w-full rounded" /></Field>
        <Field label="Harmony type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="monochromatic">Monochromatic</option>
          </Select>
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        {palette.map((c, i) => (
          <div key={i} className="text-center">
            <Swatch color={c} label={c} />
            <div className="mt-1"><CopyButton getText={() => c} label="" /></div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- CSS Gradient Generator ---------------- */
export function CssGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([
    { color: "#4f46e5", pos: 0 },
    { color: "#06b6d4", pos: 100 },
  ]);

  const css = useMemo(() => {
    const stopStr = stops.map((s) => `${s.color} ${s.pos}%`).join(", ");
    return type === "linear" ? `linear-gradient(${angle}deg, ${stopStr})` : `radial-gradient(circle, ${stopStr})`;
  }, [type, angle, stops]);

  function update(i: number, key: "color" | "pos", v: string) {
    setStops((arr) => arr.map((s, idx) => (idx === i ? { ...s, [key]: key === "pos" ? Number(v) : v } : s)));
  }

  return (
    <ToolCard>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </Select>
        </Field>
        {type === "linear" ? (
          <Field label={`Angle: ${angle}°`}><input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full" /></Field>
        ) : null}
      </div>
      <div className="space-y-2">
        {stops.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="h-9 w-14 rounded" />
            <input type="range" min={0} max={100} value={s.pos} onChange={(e) => update(i, "pos", e.target.value)} className="flex-1" />
            <span className="w-10 text-sm">{s.pos}%</span>
            {stops.length > 2 ? <Button variant="ghost" onClick={() => setStops((arr) => arr.filter((_, idx) => idx !== i))}>✕</Button> : null}
          </div>
        ))}
        <Button variant="secondary" onClick={() => setStops((arr) => [...arr, { color: "#ffffff", pos: 50 }])}>+ Add color stop</Button>
      </div>
      <div className="mt-4 h-32 rounded-xl border border-slate-200 dark:border-slate-700" style={{ background: css }} />
      <div className="mt-4"><OutputBox value={`background: ${css};`} rows={2} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `background: ${css};`} /></div>
    </ToolCard>
  );
}

/* ---------------- CSS Box Shadow Generator ---------------- */
export function CssBoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(0.25);
  const [inset, setInset] = useState(false);

  const rgba = useMemo(() => {
    const c = chroma(color).rgb();
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${opacity})`;
  }, [color, opacity]);
  const css = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Horizontal offset: ${x}px`}><input type="range" min={-50} max={50} value={x} onChange={(e) => setX(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Vertical offset: ${y}px`}><input type="range" min={-50} max={50} value={y} onChange={(e) => setY(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Blur radius: ${blur}px`}><input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Spread radius: ${spread}px`}><input type="range" min={-30} max={30} value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full" /></Field>
        <Field label="Color"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full rounded" /></Field>
        <Field label={`Opacity: ${opacity}`}><input type="range" min={0} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" /></Field>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} /> Inset</label>
      <div className="mt-6 flex justify-center rounded-xl bg-slate-100 p-10 dark:bg-slate-800">
        <div className="h-24 w-24 rounded-xl bg-white dark:bg-slate-700" style={{ boxShadow: css }} />
      </div>
      <div className="mt-4"><OutputBox value={`box-shadow: ${css};`} rows={2} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `box-shadow: ${css};`} /></div>
    </ToolCard>
  );
}

/* ---------------- CSS Border Radius Generator ---------------- */
export function CssBorderRadiusGenerator() {
  const [tl, setTl] = useState(50);
  const [tr, setTr] = useState(50);
  const [br, setBr] = useState(50);
  const [bl, setBl] = useState(50);
  const css = `${tl}% ${tr}% ${br}% ${bl}% / ${tl}% ${tr}% ${br}% ${bl}%`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Top-left: ${tl}%`}><input type="range" min={0} max={100} value={tl} onChange={(e) => setTl(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Top-right: ${tr}%`}><input type="range" min={0} max={100} value={tr} onChange={(e) => setTr(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Bottom-right: ${br}%`}><input type="range" min={0} max={100} value={br} onChange={(e) => setBr(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Bottom-left: ${bl}%`}><input type="range" min={0} max={100} value={bl} onChange={(e) => setBl(Number(e.target.value))} className="w-full" /></Field>
      </div>
      <div className="mt-6 flex justify-center bg-slate-100 p-10 dark:bg-slate-800">
        <div className="h-32 w-32 bg-indigo-500" style={{ borderRadius: css }} />
      </div>
      <div className="mt-4"><OutputBox value={`border-radius: ${css};`} rows={2} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `border-radius: ${css};`} /></div>
    </ToolCard>
  );
}

/* ---------------- CSS Glassmorphism Generator ---------------- */
export function CssGlassmorphismGenerator() {
  const [bgOpacity, setBgOpacity] = useState(0.18);
  const [blur, setBlur] = useState(12);
  const [borderOpacity, setBorderOpacity] = useState(0.3);
  const [radius, setRadius] = useState(16);

  const css = `background: rgba(255, 255, 255, ${bgOpacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, ${borderOpacity});\nborder-radius: ${radius}px;`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Background opacity: ${bgOpacity}`}><input type="range" min={0} max={1} step={0.02} value={bgOpacity} onChange={(e) => setBgOpacity(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Blur: ${blur}px`}><input type="range" min={0} max={30} value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Border opacity: ${borderOpacity}`}><input type="range" min={0} max={1} step={0.02} value={borderOpacity} onChange={(e) => setBorderOpacity(Number(e.target.value))} className="w-full" /></Field>
        <Field label={`Corner radius: ${radius}px`}><input type="range" min={0} max={40} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" /></Field>
      </div>
      <div
        className="relative mt-6 flex h-48 items-center justify-center rounded-xl bg-cover bg-center p-6"
        style={{ backgroundImage: "linear-gradient(135deg, #f97316, #ec4899, #6366f1)" }}
      >
        <div
          className="flex h-28 w-56 items-center justify-center text-white"
          style={{
            background: `rgba(255,255,255,${bgOpacity})`,
            backdropFilter: `blur(${blur}px)`,
            border: `1px solid rgba(255,255,255,${borderOpacity})`,
            borderRadius: radius,
          }}
        >
          Glass panel
        </div>
      </div>
      <div className="mt-4"><OutputBox value={css} rows={5} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => css} /></div>
    </ToolCard>
  );
}

/* ---------------- HEX <-> RGB ---------------- */
export function HexRgbConverter() {
  const [hex, setHex] = useState("#4f46e5");
  const [r, setR] = useState(79);
  const [g, setG] = useState(70);
  const [b, setB] = useState(229);
  const [error, setError] = useState("");

  function fromHex(v: string) {
    setHex(v);
    try {
      const c = chroma(v).rgb();
      setR(c[0]); setG(c[1]); setB(c[2]);
      setError("");
    } catch {
      setError("Invalid HEX code");
    }
  }
  function fromRgb(nr: number, ng: number, nb: number) {
    setR(nr); setG(ng); setB(nb);
    try {
      setHex(chroma(nr, ng, nb).hex());
      setError("");
    } catch {
      setError("Invalid RGB values");
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Field label="HEX"><TextInput value={hex} onChange={(e) => fromHex(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Field label="R"><TextInput type="number" value={r} onChange={(e) => fromRgb(Number(e.target.value), g, b)} /></Field>
          <Field label="G"><TextInput type="number" value={g} onChange={(e) => fromRgb(r, Number(e.target.value), b)} /></Field>
          <Field label="B"><TextInput type="number" value={b} onChange={(e) => fromRgb(r, g, Number(e.target.value))} /></Field>
        </div>
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      <div className="mt-4 flex items-center gap-4">
        <Swatch color={hex} />
        <div className="space-y-1 text-sm">
          <p>HEX: <span className="font-mono">{hex}</span></p>
          <p>RGB: <span className="font-mono">rgb({r}, {g}, {b})</span></p>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- Color Contrast Checker ---------------- */
export function ColorContrastChecker() {
  const [fg, setFg] = useState("#333333");
  const [bg, setBg] = useState("#ffffff");
  const ratio = useMemo(() => {
    try { return chroma.contrast(fg, bg); } catch { return 0; }
  }, [fg, bg]);

  const passAA = ratio >= 4.5;
  const passAALarge = ratio >= 3;
  const passAAA = ratio >= 7;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Text color"><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-full rounded" /></Field>
        <Field label="Background color"><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-full rounded" /></Field>
      </div>
      <div className="mt-6 rounded-xl p-8 text-center" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-2xl font-bold">Sample Heading Text</p>
        <p className="mt-2">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"><p className="text-lg font-bold">{ratio.toFixed(2)}:1</p><p>Contrast Ratio</p></div>
        <div className={`rounded-lg border p-3 ${passAA ? "border-green-400 bg-green-50 dark:bg-green-950" : "border-red-400 bg-red-50 dark:bg-red-950"}`}>{passAA ? "✅" : "❌"} AA (normal text)</div>
        <div className={`rounded-lg border p-3 ${passAAA ? "border-green-400 bg-green-50 dark:bg-green-950" : "border-red-400 bg-red-50 dark:bg-red-950"}`}>{passAAA ? "✅" : "❌"} AAA (normal text)</div>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">{passAALarge ? "✅" : "❌"} Passes AA for large text (≥3:1)</p>
    </ToolCard>
  );
}

/* ---------------- CSS Clamp Calculator ---------------- */
export function CssClampCalculator() {
  const [minSize, setMinSize] = useState(24);
  const [maxSize, setMaxSize] = useState(48);
  const [minWidth, setMinWidth] = useState(375);
  const [maxWidth, setMaxWidth] = useState(1440);

  const result = useMemo(() => {
    const minRem = minSize / 16;
    const maxRem = maxSize / 16;
    const slope = (maxSize - minSize) / (maxWidth - minWidth);
    const intersection = -minWidth * slope + minSize;
    const vw = (slope * 100).toFixed(4);
    const rem = (intersection / 16).toFixed(4);
    return `clamp(${minRem}rem, ${rem}rem + ${vw}vw, ${maxRem}rem)`;
  }, [minSize, maxSize, minWidth, maxWidth]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Minimum font size (px)"><TextInput type="number" value={minSize} onChange={(e) => setMinSize(Number(e.target.value))} /></Field>
        <Field label="Maximum font size (px)"><TextInput type="number" value={maxSize} onChange={(e) => setMaxSize(Number(e.target.value))} /></Field>
        <Field label="Minimum viewport width (px)"><TextInput type="number" value={minWidth} onChange={(e) => setMinWidth(Number(e.target.value))} /></Field>
        <Field label="Maximum viewport width (px)"><TextInput type="number" value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} /></Field>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg bg-slate-100 p-6 text-center dark:bg-slate-800">
        <p style={{ fontSize: `clamp(${minSize / 16}rem, 1rem + 2vw, ${maxSize / 16}rem)` }} className="font-bold">Fluid Heading Preview</p>
      </div>
      <div className="mt-4"><OutputBox value={`font-size: ${result};`} rows={2} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => `font-size: ${result};`} /></div>
    </ToolCard>
  );
}

export const colorComponents: ComponentRegistry = {
  ColorPickerTool,
  ColorPaletteGenerator,
  CssGradientGenerator,
  CssBoxShadowGenerator,
  CssBorderRadiusGenerator,
  CssGlassmorphismGenerator,
  HexRgbConverter,
  ColorContrastChecker,
  CssClampCalculator,
};
