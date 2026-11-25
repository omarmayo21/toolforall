"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Alert, CopyButton, Field, OutputBox, Select, StatBadge, TextArea, TextInput, ToolCard } from "./ui";

export const money = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-");
export const num = (n: number, d = 4) => (Number.isFinite(n) ? String(Number(n.toFixed(d))) : "-");

export type FieldDef = { k: string; label: string; def: string; options?: [string, string][]; type?: string; hint?: string };
export type Row = [string, string];

export function Calc({ fields, compute, note }: { fields: FieldDef[]; compute: (v: Record<string, string>) => Row[] | string; note?: ReactNode }) {
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.k, f.def])));
  const out = useMemo(() => {
    try { return compute(v); } catch { return "Check your inputs."; }
  }, [v, compute]);
  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.k} label={f.label} hint={f.hint}>
            {f.options ? (
              <Select value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })}>
                {f.options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
              </Select>
            ) : (
              <TextInput type={f.type ?? "number"} inputMode={f.type ? undefined : "decimal"} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />
            )}
          </Field>
        ))}
      </div>
      <div className="mt-6">
        {typeof out === "string" ? <Alert type="info">{out}</Alert> : (
          <div className="flex flex-wrap justify-center gap-3">{out.map(([l, val]) => <StatBadge key={l} label={l} value={val} />)}</div>
        )}
      </div>
      {note ? <div className="mt-4 text-xs text-text-muted">{note}</div> : null}
    </ToolCard>
  );
}

export function TextXform({ fn, placeholder, outLabel = "Result", rows = 6 }: { fn: (s: string) => string; placeholder: string; outLabel?: string; rows?: number }) {
  const [t, setT] = useState("");
  const out = useMemo(() => { try { return t ? fn(t) : ""; } catch { return "Could not convert this input."; } }, [t, fn]);
  return (
    <ToolCard>
      <Field label="Input"><TextArea rows={rows} value={t} placeholder={placeholder} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-4"><div className="mb-1.5 text-sm font-medium text-text-secondary">{outLabel}</div><OutputBox value={out} rows={rows} /></div>
      <div className="mt-3"><CopyButton getText={() => out} /></div>
    </ToolCard>
  );
}

export const N = (s: string) => parseFloat(s);

