"use client";

import { useMemo, useState } from "react";
import { Button, Field, Select, StatBadge, TextInput, ToolCard } from "./ui";
import { FAMILIES, convert, fmt, resolvePair } from "@/lib/generated/units";

export default function UnitPairTool({ toolKey }: { toolKey: string }) {
  const init = resolvePair(toolKey);
  const [fromId, setFromId] = useState(init?.from.id ?? "");
  const [toId, setToId] = useState(init?.to.id ?? "");
  const [value, setValue] = useState("1");
  const fam = init ? init.fam : FAMILIES[0];
  const from = fam.units.find((x) => x.id === fromId) ?? fam.units[0];
  const to = fam.units.find((x) => x.id === toId) ?? fam.units[1];
  const num = Number(value);
  const result = useMemo(() => (value.trim() === "" || Number.isNaN(num) ? null : convert(fam, from, to, num)), [fam, from, to, num, value]);
  const rows = [1, 5, 10, 50, 100, 1000];

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <Field label="From">
          <Select value={from.id} onChange={(e) => setFromId(e.target.value)}>
            {fam.units.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.symbol})</option>)}
          </Select>
        </Field>
        <Button variant="ghost" onClick={() => { setFromId(to.id); setToId(from.id); }} aria-label="Swap units">⇄ Swap</Button>
        <Field label="To">
          <Select value={to.id} onChange={(e) => setToId(e.target.value)}>
            {fam.units.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.symbol})</option>)}
          </Select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label={`Value in ${from.name}`}>
          <TextInput type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-center">
        <StatBadge label={`${from.name} → ${to.name}`} value={result === null ? "-" : `${fmt(result)} ${to.symbol}`} />
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="text-text-muted"><th className="py-1 pr-4">{from.name}</th><th className="py-1">{to.name}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r} className="border-t border-border-default"><td className="py-1 pr-4">{fmt(r)} {from.symbol}</td><td className="py-1">{fmt(convert(fam, from, to, r))} {to.symbol}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolCard>
  );
}
