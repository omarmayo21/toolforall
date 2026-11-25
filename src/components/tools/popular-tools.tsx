"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Alert, Button, CopyButton, Field, OutputBox, Select, StatBadge, TextArea, TextInput, ToolCard, downloadBlob } from "./ui";

/* ---------- helpers ---------- */
const money = (n: number) => (Number.isFinite(n) ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-");
const num = (n: number, d = 4) => (Number.isFinite(n) ? String(Number(n.toFixed(d))) : "-");

type FieldDef = { k: string; label: string; def: string; options?: [string, string][]; type?: string; hint?: string };
type Row = [string, string];

function Calc({ fields, compute, note }: { fields: FieldDef[]; compute: (v: Record<string, string>) => Row[] | string; note?: ReactNode }) {
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

function TextXform({ fn, placeholder, outLabel = "Result", rows = 6 }: { fn: (s: string) => string; placeholder: string; outLabel?: string; rows?: number }) {
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

const N = (s: string) => parseFloat(s);

/* ---------- calculators ---------- */
const Emi = () => (
  <Calc
    fields={[{ k: "p", label: "Loan amount", def: "10000" }, { k: "r", label: "Annual interest rate (%)", def: "8" }, { k: "y", label: "Loan term (years)", def: "5" }]}
    compute={(v) => {
      const p = N(v.p), n = N(v.y) * 12, r = N(v.r) / 1200;
      if (!(p > 0) || !(n > 0) || r < 0) return "Enter a positive amount and term.";
      const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      return [["Monthly payment", money(emi)], ["Total paid", money(emi * n)], ["Total interest", money(emi * n - p)]];
    }}
  />
);
const Mortgage = () => (
  <Calc
    fields={[{ k: "price", label: "Home price", def: "300000" }, { k: "down", label: "Down payment", def: "60000" }, { k: "r", label: "Annual interest rate (%)", def: "6.5" }, { k: "y", label: "Term (years)", def: "30" }, { k: "tax", label: "Property tax per year", def: "3000" }, { k: "ins", label: "Home insurance per year", def: "1200" }]}
    compute={(v) => {
      const p = N(v.price) - N(v.down), n = N(v.y) * 12, r = N(v.r) / 1200;
      if (!(p > 0) || !(n > 0)) return "Down payment must be lower than the price.";
      const pi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const extra = (N(v.tax) + N(v.ins)) / 12;
      return [["Principal + interest / month", money(pi)], ["Tax + insurance / month", money(extra)], ["Total / month", money(pi + extra)], ["Total interest", money(pi * n - p)]];
    }}
  />
);
const Compound = () => (
  <Calc
    fields={[{ k: "p", label: "Starting amount", def: "1000" }, { k: "m", label: "Monthly contribution", def: "100" }, { k: "r", label: "Annual rate (%)", def: "7" }, { k: "y", label: "Years", def: "10" }, { k: "f", label: "Compounding", def: "12", options: [["1", "Yearly"], ["4", "Quarterly"], ["12", "Monthly"], ["365", "Daily"]] }]}
    compute={(v) => {
      const P = N(v.p), M = N(v.m), r = N(v.r) / 100, y = N(v.y), f = N(v.f);
      if (!(y > 0)) return "Enter the number of years.";
      let bal = P;
      const steps = Math.round(y * 12);
      const g = Math.pow(1 + r / f, f / 12) - 1;
      for (let i = 0; i < steps; i++) bal = bal * (1 + g) + M;
      const contributed = P + M * steps;
      return [["Final balance", money(bal)], ["Total contributed", money(contributed)], ["Interest earned", money(bal - contributed)]];
    }}
  />
);
const Simple = () => (
  <Calc
    fields={[{ k: "p", label: "Principal", def: "5000" }, { k: "r", label: "Annual rate (%)", def: "5" }, { k: "y", label: "Years", def: "3" }]}
    compute={(v) => { const i = (N(v.p) * N(v.r) * N(v.y)) / 100; return [["Interest", money(i)], ["Total amount", money(N(v.p) + i)]]; }}
  />
);
const Tip = () => (
  <Calc
    fields={[{ k: "b", label: "Bill amount", def: "80" }, { k: "t", label: "Tip (%)", def: "15" }, { k: "n", label: "Split between (people)", def: "2" }]}
    compute={(v) => { const b = N(v.b), tip = (b * N(v.t)) / 100, n = Math.max(1, Math.floor(N(v.n))); return [["Tip", money(tip)], ["Total", money(b + tip)], ["Per person", money((b + tip) / n)]]; }}
  />
);
const Vat = () => (
  <Calc
    fields={[{ k: "a", label: "Amount", def: "100" }, { k: "r", label: "VAT / GST / sales tax (%)", def: "14" }, { k: "m", label: "Amount is", def: "ex", options: [["ex", "Excluding tax (add tax)"], ["inc", "Including tax (remove tax)"]] }]}
    compute={(v) => {
      const a = N(v.a), r = N(v.r) / 100;
      if (v.m === "ex") return [["Net", money(a)], ["Tax", money(a * r)], ["Gross", money(a * (1 + r))]];
      const net = a / (1 + r);
      return [["Net", money(net)], ["Tax", money(a - net)], ["Gross", money(a)]];
    }}
  />
);
const Salary = () => (
  <Calc
    fields={[{ k: "h", label: "Hourly rate", def: "20" }, { k: "hw", label: "Hours per week", def: "40" }, { k: "w", label: "Weeks per year", def: "52" }]}
    compute={(v) => { const y = N(v.h) * N(v.hw) * N(v.w); return [["Yearly", money(y)], ["Monthly", money(y / 12)], ["Weekly", money(y / N(v.w))], ["Daily (5 days)", money(y / N(v.w) / 5)]]; }}
  />
);
const today = () => new Date().toISOString().slice(0, 10);
const DaysBetween = () => (
  <Calc
    fields={[{ k: "a", label: "Start date", def: today(), type: "date" }, { k: "b", label: "End date", def: today(), type: "date" }]}
    compute={(v) => {
      const a = new Date(v.a), b = new Date(v.b);
      if (isNaN(+a) || isNaN(+b)) return "Pick two dates.";
      const days = Math.round((+b - +a) / 86400000);
      let [x, y] = +a <= +b ? [a, b] : [b, a];
      let yrs = y.getFullYear() - x.getFullYear(), mo = y.getMonth() - x.getMonth(), d = y.getDate() - x.getDate();
      if (d < 0) { mo--; d += new Date(y.getFullYear(), y.getMonth(), 0).getDate(); }
      if (mo < 0) { yrs--; mo += 12; }
      return [["Days", String(days)], ["Weeks", num(days / 7, 2)], ["Years / months / days", `${yrs}y ${mo}m ${d}d`], ["Weekdays (Mon-Fri)", String(weekdays(x, y))]];
    }}
  />
);
function weekdays(a: Date, b: Date) { let c = 0; const d = new Date(a); while (d < b) { const w = d.getDay(); if (w !== 0 && w !== 6) c++; d.setDate(d.getDate() + 1); } return c; }
const DateAdd = () => (
  <Calc
    fields={[{ k: "a", label: "Start date", def: today(), type: "date" }, { k: "op", label: "Operation", def: "add", options: [["add", "Add"], ["sub", "Subtract"]] }, { k: "n", label: "Amount", def: "30" }, { k: "u", label: "Unit", def: "d", options: [["d", "Days"], ["w", "Weeks"], ["m", "Months"], ["y", "Years"]] }]}
    compute={(v) => {
      const d = new Date(v.a); if (isNaN(+d)) return "Pick a start date.";
      const s = v.op === "add" ? 1 : -1, n = N(v.n) * s;
      if (v.u === "d") d.setDate(d.getDate() + n); else if (v.u === "w") d.setDate(d.getDate() + 7 * n); else if (v.u === "m") d.setMonth(d.getMonth() + n); else d.setFullYear(d.getFullYear() + n);
      return [["Result", d.toDateString()], ["ISO date", d.toISOString().slice(0, 10)]];
    }}
  />
);
const Bmr = () => (
  <Calc
    fields={[{ k: "s", label: "Sex", def: "m", options: [["m", "Male"], ["f", "Female"]] }, { k: "a", label: "Age (years)", def: "25" }, { k: "h", label: "Height (cm)", def: "175" }, { k: "w", label: "Weight (kg)", def: "70" }, { k: "act", label: "Activity", def: "1.55", options: [["1.2", "Sedentary"], ["1.375", "Light (1-3 days/week)"], ["1.55", "Moderate (3-5 days/week)"], ["1.725", "Very active (6-7 days)"], ["1.9", "Extra active"]] }]}
    compute={(v) => {
      const bmr = 10 * N(v.w) + 6.25 * N(v.h) - 5 * N(v.a) + (v.s === "m" ? 5 : -161);
      const tdee = bmr * N(v.act);
      return [["BMR (kcal/day)", String(Math.round(bmr))], ["Maintenance (kcal/day)", String(Math.round(tdee))], ["Lose weight (-500)", String(Math.round(tdee - 500))], ["Gain weight (+500)", String(Math.round(tdee + 500))]];
    }}
    note="Uses the Mifflin-St Jeor equation. Estimates only, not medical advice."
  />
);
const IdealWeight = () => (
  <Calc
    fields={[{ k: "s", label: "Sex", def: "m", options: [["m", "Male"], ["f", "Female"]] }, { k: "h", label: "Height (cm)", def: "175" }]}
    compute={(v) => {
      const inch = N(v.h) / 2.54, over = Math.max(0, inch - 60);
      const dev = (v.s === "m" ? 50 : 45.5) + 2.3 * over;
      const rob = (v.s === "m" ? 52 : 49) + (v.s === "m" ? 1.9 : 1.7) * over;
      const hm = N(v.h) / 100;
      return [["Devine", `${num(dev, 1)} kg`], ["Robinson", `${num(rob, 1)} kg`], ["Healthy BMI range", `${num(18.5 * hm * hm, 1)} - ${num(24.9 * hm * hm, 1)} kg`]];
    }}
    note="General estimates. Body type and muscle mass change what is healthy for you."
  />
);
const Roi = () => (
  <Calc
    fields={[{ k: "c", label: "Amount invested", def: "1000" }, { k: "r", label: "Final value", def: "1400" }, { k: "y", label: "Years held (optional)", def: "2" }]}
    compute={(v) => {
      const c = N(v.c), r = N(v.r), y = N(v.y);
      if (!(c > 0)) return "Enter the amount invested.";
      const rows: Row[] = [["Profit", money(r - c)], ["ROI", `${num(((r - c) / c) * 100, 2)}%`]];
      if (y > 0 && r > 0) rows.push(["Annualized (CAGR)", `${num((Math.pow(r / c, 1 / y) - 1) * 100, 2)}%`]);
      return rows;
    }}
  />
);
const Cagr = () => (
  <Calc
    fields={[{ k: "s", label: "Starting value", def: "1000" }, { k: "e", label: "Ending value", def: "2000" }, { k: "y", label: "Years", def: "5" }]}
    compute={(v) => { const s = N(v.s), e = N(v.e), y = N(v.y); if (!(s > 0) || !(e > 0) || !(y > 0)) return "All values must be above zero."; return [["CAGR", `${num((Math.pow(e / s, 1 / y) - 1) * 100, 3)}%`], ["Total growth", `${num(((e - s) / s) * 100, 2)}%`]]; }}
  />
);
const PctIncrease = () => (
  <Calc
    fields={[{ k: "a", label: "Old value", def: "50" }, { k: "b", label: "New value", def: "65" }]}
    compute={(v) => { const a = N(v.a), b = N(v.b); if (a === 0) return "Old value cannot be zero."; const c = ((b - a) / Math.abs(a)) * 100; return [[c >= 0 ? "Increase" : "Decrease", `${num(Math.abs(c), 3)}%`], ["Difference", num(b - a)], ["Percent difference (symmetric)", `${num((Math.abs(b - a) / ((Math.abs(a) + Math.abs(b)) / 2)) * 100, 3)}%`]]; }}
  />
);
const Sdt = () => (
  <Calc
    fields={[{ k: "d", label: "Distance (km)", def: "120" }, { k: "t", label: "Time (hours)", def: "1.5" }]}
    compute={(v) => { const d = N(v.d), t = N(v.t); if (!(t > 0)) return "Time must be above zero."; const sp = d / t; return [["Speed", `${num(sp, 2)} km/h`], ["Speed", `${num(sp / 1.609344, 2)} mph`], ["Pace", `${num(60 / sp, 2)} min/km`]]; }}
    note="Change any value to work out the other two: speed = distance / time."
  />
);
const DueDate = () => (
  <Calc
    fields={[{ k: "l", label: "First day of last period", def: today(), type: "date" }, { k: "c", label: "Cycle length (days)", def: "28" }]}
    compute={(v) => {
      const l = new Date(v.l); if (isNaN(+l)) return "Pick a date.";
      const d = new Date(+l + (280 + (N(v.c) - 28)) * 86400000);
      const wk = Math.floor((Date.now() - +l) / 86400000 / 7);
      const conc = new Date(+l + (14 + (N(v.c) - 28)) * 86400000);
      return [["Estimated due date", d.toDateString()], ["Conception (approx.)", conc.toDateString()], ["Weeks now", wk >= 0 && wk <= 42 ? String(wk) : "-"]];
    }}
    note="Naegele's rule estimate. Only about 5% of babies arrive on the due date. Ask your doctor."
  />
);
const Fraction = () => (
  <Calc
    fields={[{ k: "a", label: "Fraction 1 numerator", def: "1" }, { k: "b", label: "Fraction 1 denominator", def: "2" }, { k: "op", label: "Operation", def: "+", options: [["+", "+"], ["-", "-"], ["*", "×"], ["/", "÷"]] }, { k: "c", label: "Fraction 2 numerator", def: "1" }, { k: "d", label: "Fraction 2 denominator", def: "3" }]}
    compute={(v) => {
      const [a, b, c, d] = [N(v.a), N(v.b), N(v.c), N(v.d)];
      if (b === 0 || d === 0) return "Denominators cannot be zero.";
      let n: number, m: number;
      if (v.op === "+") { n = a * d + c * b; m = b * d; } else if (v.op === "-") { n = a * d - c * b; m = b * d; } else if (v.op === "*") { n = a * c; m = b * d; } else { n = a * d; m = b * c; }
      if (m === 0) return "Cannot divide by zero.";
      const g = (x: number, y: number): number => (y === 0 ? Math.abs(x) : g(y, x % y));
      const k = g(n, m) || 1; n /= k; m /= k; if (m < 0) { n = -n; m = -m; }
      const whole = Math.trunc(n / m), rem = Math.abs(n % m);
      return [["Result", m === 1 ? String(n) : `${n}/${m}`], ["Mixed number", rem === 0 ? String(whole) : `${whole} ${rem}/${m}`], ["Decimal", num(n / m, 6)]];
    }}
  />
);
const Average = () => {
  const [t, setT] = useState("10, 20, 30, 40, 50");
  const xs = t.split(/[\s,;]+/).map(Number).filter((x) => t.trim() !== "" && Number.isFinite(x));
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  const mean = n ? s.reduce((a, b) => a + b, 0) / n : NaN;
  const med = n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN;
  const cnt = new Map<number, number>(); s.forEach((x) => cnt.set(x, (cnt.get(x) ?? 0) + 1));
  const mx = Math.max(0, ...cnt.values());
  const mode = mx > 1 ? [...cnt].filter(([, c]) => c === mx).map(([k]) => k).join(", ") : "none";
  const sd = n > 1 ? Math.sqrt(s.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)) : NaN;
  return (
    <ToolCard>
      <Field label="Numbers (separated by commas, spaces or new lines)"><TextArea rows={4} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <StatBadge label="Count" value={n} /><StatBadge label="Sum" value={n ? num(mean * n) : "-"} /><StatBadge label="Mean" value={num(mean)} /><StatBadge label="Median" value={num(med)} /><StatBadge label="Mode" value={mode} /><StatBadge label="Min / Max" value={n ? `${s[0]} / ${s[n - 1]}` : "-"} /><StatBadge label="Std. deviation" value={num(sd)} />
      </div>
    </ToolCard>
  );
};

/* ---------- random / fun ---------- */
const RandomNumber = () => {
  const [min, setMin] = useState("1"), [max, setMax] = useState("100"), [cnt, setCnt] = useState("1"), [uniq, setUniq] = useState(false);
  const [out, setOut] = useState<number[]>([]);
  const gen = () => {
    const a = Math.ceil(N(min)), b = Math.floor(N(max)), c = Math.min(1000, Math.max(1, Math.floor(N(cnt))));
    if (!(a <= b)) return setOut([]);
    const r = new Uint32Array(1), pick = () => { crypto.getRandomValues(r); return a + (r[0] % (b - a + 1)); };
    const res: number[] = []; const seen = new Set<number>();
    const lim = uniq ? Math.min(c, b - a + 1) : c;
    while (res.length < lim) { const x = pick(); if (uniq && seen.has(x)) continue; seen.add(x); res.push(x); }
    setOut(res);
  };
  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Minimum"><TextInput type="number" value={min} onChange={(e) => setMin(e.target.value)} /></Field>
        <Field label="Maximum"><TextInput type="number" value={max} onChange={(e) => setMax(e.target.value)} /></Field>
        <Field label="How many (max 1000)"><TextInput type="number" value={cnt} onChange={(e) => setCnt(e.target.value)} /></Field>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={uniq} onChange={(e) => setUniq(e.target.checked)} /> No repeats</label>
      <div className="mt-4"><Button onClick={gen}>Generate</Button></div>
      {out.length > 0 && <div className="mt-6"><div className="text-3xl font-bold text-primary-500">{out.length === 1 ? out[0] : ""}</div>{out.length > 1 && <OutputBox value={out.join(", ")} rows={4} />}<div className="mt-3"><CopyButton getText={() => out.join(", ")} /></div></div>}
    </ToolCard>
  );
};
const Dice = () => {
  const [n, setN] = useState("2"), [s, setS] = useState("6"), [res, setRes] = useState<number[]>([]);
  const roll = () => { const r = new Uint32Array(1); setRes(Array.from({ length: Math.min(50, Math.max(1, Math.floor(N(n)))) }, () => { crypto.getRandomValues(r); return 1 + (r[0] % Math.max(2, Math.floor(N(s)))); })); };
  const [coin, setCoin] = useState("");
  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Number of dice"><TextInput type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field>
        <Field label="Sides per die"><Select value={s} onChange={(e) => setS(e.target.value)}>{["4", "6", "8", "10", "12", "20", "100"].map((x) => <option key={x} value={x}>d{x}</option>)}</Select></Field>
      </div>
      <div className="mt-4 flex gap-3"><Button onClick={roll}>🎲 Roll</Button><Button variant="secondary" onClick={() => setCoin(crypto.getRandomValues(new Uint8Array(1))[0] % 2 ? "Heads" : "Tails")}>🪙 Flip a coin</Button></div>
      {res.length > 0 && <div className="mt-6 flex flex-wrap justify-center gap-3">{res.map((r, i) => <StatBadge key={i} label={`d${s}`} value={r} />)}<StatBadge label="Total" value={res.reduce((a, b) => a + b, 0)} /></div>}
      {coin && <div className="mt-6 text-center text-2xl font-bold text-primary-500">{coin}</div>}
    </ToolCard>
  );
};
const NamePicker = () => {
  const [t, setT] = useState("Alice\nBob\nCarol\nDave"), [w, setW] = useState("");
  const names = t.split("\n").map((x) => x.trim()).filter(Boolean);
  const pick = () => { if (names.length) setW(names[crypto.getRandomValues(new Uint32Array(1))[0] % names.length]); };
  const shuffle = () => { const a = [...names]; for (let i = a.length - 1; i > 0; i--) { const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } setT(a.join("\n")); };
  return (
    <ToolCard>
      <Field label="One name or item per line"><TextArea rows={8} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={pick}>Pick a winner</Button><Button variant="secondary" onClick={shuffle}>Shuffle list</Button></div>
      {w && <div className="mt-6 text-center text-3xl font-bold text-primary-500">🎉 {w}</div>}
      <div className="mt-2 text-xs text-text-muted">{names.length} entries</div>
    </ToolCard>
  );
};
const fmtT = (ms: number, cs = false) => { const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}${cs ? "." + String(Math.floor((ms % 1000) / 10)).padStart(2, "0") : ""}`; };
const Stopwatch = () => {
  const [ms, setMs] = useState(0), [run, setRun] = useState(false), [laps, setLaps] = useState<number[]>([]);
  const base = useRef(0);
  useEffect(() => { if (!run) return; const st = Date.now() - ms; base.current = st; const id = setInterval(() => setMs(Date.now() - base.current), 30); return () => clearInterval(id); }, [run]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <ToolCard>
      <div className="text-center font-mono text-5xl font-bold text-primary-500">{fmtT(ms, true)}</div>
      <div className="mt-6 flex justify-center gap-3"><Button onClick={() => setRun(!run)}>{run ? "Pause" : "Start"}</Button><Button variant="secondary" onClick={() => setLaps([...laps, ms])} disabled={!run}>Lap</Button><Button variant="ghost" onClick={() => { setRun(false); setMs(0); setLaps([]); }}>Reset</Button></div>
      {laps.length > 0 && <ol className="mt-4 space-y-1 text-center text-sm">{laps.map((l, i) => <li key={i}>Lap {i + 1}: {fmtT(l, true)}</li>)}</ol>}
    </ToolCard>
  );
};
const Countdown = ({ pomodoro = false }: { pomodoro?: boolean }) => {
  const [mins, setMins] = useState(pomodoro ? "25" : "5"), [left, setLeft] = useState<number | null>(null), [run, setRun] = useState(false), [phase, setPhase] = useState("Focus");
  const endAt = useRef(0);
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => {
      const l = endAt.current - Date.now();
      if (l <= 0) {
        setRun(false); setLeft(0);
        try { const c = new AudioContext(), o = c.createOscillator(); o.connect(c.destination); o.start(); setTimeout(() => o.stop(), 600); } catch {}
        if (pomodoro) { const next = phase === "Focus" ? "Break" : "Focus"; setPhase(next); setMins(next === "Focus" ? "25" : "5"); setLeft(null); }
      } else setLeft(l);
    }, 250);
    return () => clearInterval(id);
  }, [run, phase, pomodoro]);
  const start = () => { const base = left && left > 0 ? left : N(mins) * 60000; if (!(base > 0)) return; endAt.current = Date.now() + base; setLeft(base); setRun(true); };
  useEffect(() => { document.title = run && left ? `${fmtT(left)} - ToolForAll` : document.title; }, [left, run]);
  return (
    <ToolCard>
      {pomodoro && <div className="mb-2 text-center text-sm font-medium text-text-secondary">{phase} session</div>}
      <div className="text-center font-mono text-6xl font-bold text-primary-500">{fmtT(left ?? N(mins) * 60000)}</div>
      <div className="mx-auto mt-4 max-w-xs"><Field label="Minutes"><TextInput type="number" value={mins} onChange={(e) => { setMins(e.target.value); setLeft(null); setRun(false); }} /></Field></div>
      <div className="mt-6 flex justify-center gap-3"><Button onClick={() => (run ? setRun(false) : start())}>{run ? "Pause" : "Start"}</Button><Button variant="ghost" onClick={() => { setRun(false); setLeft(null); }}>Reset</Button></div>
      {left === 0 && <div className="mt-4"><Alert type="success">Time is up.</Alert></div>}
    </ToolCard>
  );
};

/* ---------- text tools ---------- */
const MORSE: Record<string, string> = { a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.", ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.", "@": ".--.-.", "'": ".----." };
const MORSE_R = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
const toMorse = (s: string) => s.toLowerCase().split("").map((c) => (c === " " ? "/" : MORSE[c] ?? "")).filter(Boolean).join(" ");
const fromMorse = (s: string) => s.trim().split(/\s+/).map((c) => (c === "/" ? " " : MORSE_R[c] ?? "?")).join("");
const MorseTool = () => {
  const [mode, setMode] = useState("enc");
  return (
    <div className="space-y-3">
      <Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="enc">Text to Morse code</option><option value="dec">Morse code to text</option></Select>
      <TextXform key={mode} fn={mode === "enc" ? toMorse : fromMorse} placeholder={mode === "enc" ? "Type text..." : "Paste Morse (dots and dashes, / between words)"} />
    </div>
  );
};
const BinaryTool = () => {
  const [mode, setMode] = useState("enc");
  const enc = (s: string) => Array.from(new TextEncoder().encode(s)).map((b) => b.toString(2).padStart(8, "0")).join(" ");
  const dec = (s: string) => new TextDecoder().decode(new Uint8Array(s.trim().split(/\s+/).map((b) => parseInt(b, 2))));
  return (
    <div className="space-y-3">
      <Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="enc">Text to binary</option><option value="dec">Binary to text</option></Select>
      <TextXform key={mode} fn={mode === "enc" ? enc : dec} placeholder={mode === "enc" ? "Type text..." : "01001000 01101001"} />
    </div>
  );
};
const ROMANS: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const RomanTool = () => {
  const fn = (s: string) => {
    const t = s.trim().toUpperCase();
    if (/^\d+$/.test(t)) { let n = parseInt(t, 10); if (n < 1 || n > 3999) return "Enter a number from 1 to 3999."; let o = ""; for (const [v, r] of ROMANS) while (n >= v) { o += r; n -= v; } return o; }
    if (/^[IVXLCDM]+$/.test(t)) { let n = 0, i = 0; for (const [v, r] of ROMANS) while (t.startsWith(r, i)) { n += v; i += r.length; } return i === t.length ? String(n) : "Not a valid Roman numeral."; }
    return "Enter a number (1-3999) or a Roman numeral.";
  };
  return <TextXform fn={fn} placeholder="2026 or MMXXVI" rows={3} />;
};
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALE = ["", "thousand", "million", "billion", "trillion"];
function words(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + words(n % 100) : "");
  let i = 0, parts: string[] = [], x = n;
  while (x > 0) { const c = x % 1000; if (c) parts.unshift(words(c) + (SCALE[i] ? " " + SCALE[i] : "")); x = Math.floor(x / 1000); i++; }
  return parts.join(", ");
}
const NumberToWords = () => (
  <TextXform rows={3} placeholder="1234.56" fn={(s) => {
    const t = s.replace(/,/g, "").trim(); const x = Number(t);
    if (!Number.isFinite(x) || Math.abs(x) >= 1e15) return "Enter a number below one quadrillion.";
    const [i, d] = t.replace("-", "").split("."); let o = (x < 0 ? "minus " : "") + words(parseInt(i || "0", 10));
    if (d) o += " point " + d.split("").map((c) => ONES[+c]).join(" ");
    return o;
  }} />
);
const Repeater = () => {
  const [t, setT] = useState(""), [n, setN] = useState("5"), [sep, setSep] = useState("\\n");
  const out = t ? Array.from({ length: Math.min(10000, Math.max(1, Math.floor(N(n)))) }, () => t).join(sep.replace(/\\n/g, "\n").replace(/\\t/g, "\t")) : "";
  return (
    <ToolCard>
      <Field label="Text to repeat"><TextArea rows={3} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Times (max 10,000)"><TextInput type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field><Field label="Separator (\n = new line)"><TextInput type="text" value={sep} onChange={(e) => setSep(e.target.value)} /></Field></div>
      <div className="mt-4"><OutputBox value={out} rows={8} /></div><div className="mt-3"><CopyButton getText={() => out} /></div>
    </ToolCard>
  );
};
const RemovePunct = () => <TextXform placeholder="Paste text with punctuation..." fn={(s) => s.replace(/[\p{P}\p{S}]/gu, "").replace(/[ \t]{2,}/g, " ")} />;
const UpsideDown = () => {
  const from = "abcdefghijklmnopqrstuvwxyz?!.,'()[]_&;123456789", to = "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz¿¡˙'‘)(][‾⅋؛ƖᄅƐㄣϛ9ㄥ86";
  const map: Record<string, string> = {}; [...from].forEach((c, i) => (map[c] = [...to][i]));
  return <TextXform placeholder="Type text to flip..." fn={(s) => [...s.toLowerCase()].reverse().map((c) => map[c] ?? c).join("")} />;
};
const WordFreq = () => {
  const [t, setT] = useState(""), [min, setMin] = useState("1");
  const rows = useMemo(() => { const m = new Map<string, number>(); (t.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []).forEach((w) => m.set(w, (m.get(w) ?? 0) + 1)); return [...m].filter(([, c]) => c >= N(min)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 100); }, [t, min]);
  const total = rows.reduce((a, [, c]) => a + c, 0);
  return (
    <ToolCard>
      <Field label="Paste your text"><TextArea rows={8} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-3 max-w-[10rem]"><Field label="Minimum count"><TextInput type="number" value={min} onChange={(e) => setMin(e.target.value)} /></Field></div>
      {rows.length > 0 && <div className="mt-4 max-h-96 overflow-auto"><table className="w-full text-left text-sm"><thead><tr className="text-text-muted"><th>Word</th><th>Count</th><th>%</th></tr></thead><tbody>{rows.map(([w, c]) => <tr key={w} className="border-t border-border-default"><td className="py-1">{w}</td><td>{c}</td><td>{num((c / Math.max(1, total)) * 100, 1)}</td></tr>)}</tbody></table></div>}
    </ToolCard>
  );
};
const syl = (w: string) => { const s = w.toLowerCase().replace(/[^a-z]/g, ""); if (s.length <= 3) return s ? 1 : 0; return Math.max(1, (s.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g) ?? []).length); };
const Readability = () => {
  const [t, setT] = useState("");
  const w = t.match(/[\p{L}\p{N}'-]+/gu) ?? [], s = (t.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).filter((x) => x.trim()).length;
  const sy = w.reduce((a, x) => a + syl(x), 0);
  const fre = w.length && s ? 206.835 - 1.015 * (w.length / s) - 84.6 * (sy / w.length) : NaN;
  const fk = w.length && s ? 0.39 * (w.length / s) + 11.8 * (sy / w.length) - 15.59 : NaN;
  const level = !Number.isFinite(fre) ? "-" : fre >= 90 ? "Very easy" : fre >= 70 ? "Easy" : fre >= 60 ? "Standard" : fre >= 50 ? "Fairly hard" : fre >= 30 ? "Hard" : "Very hard";
  return (
    <ToolCard>
      <Field label="Paste your text (English)"><TextArea rows={8} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-6 flex flex-wrap justify-center gap-3"><StatBadge label="Flesch reading ease" value={num(fre, 1)} /><StatBadge label="Level" value={level} /><StatBadge label="Grade level" value={num(fk, 1)} /><StatBadge label="Words" value={w.length} /><StatBadge label="Sentences" value={s} /><StatBadge label="Reading time" value={`${Math.max(1, Math.round(w.length / 238))} min`} /></div>
    </ToolCard>
  );
};
const BaseConv = () => (
  <Calc
    fields={[{ k: "v", label: "Number", def: "255", type: "text" }, { k: "b", label: "From base", def: "10", options: [["2", "Binary (2)"], ["8", "Octal (8)"], ["10", "Decimal (10)"], ["16", "Hexadecimal (16)"], ["36", "Base 36"]] }]}
    compute={(v) => {
      const b = parseInt(v.b, 10), t = v.v.trim().toLowerCase();
      if (!t || !/^[0-9a-z]+$/.test(t)) return "Enter digits valid for the chosen base.";
      let x = BigInt(0); for (const c of t) { const d = parseInt(c, 36); if (d >= b) return "That digit is not valid in this base."; x = x * BigInt(b) + BigInt(d); }
      return [["Binary", x.toString(2)], ["Octal", x.toString(8)], ["Decimal", x.toString(10)], ["Hex", x.toString(16).toUpperCase()]];
    }}
  />
);
const JsonMin = () => <TextXform placeholder='{ "a": 1, "b": [1, 2] }' fn={(s) => JSON.stringify(JSON.parse(s))} />;
const SortLines = () => {
  const [mode, setMode] = useState("az");
  const fn = (s: string) => { const l = s.split("\n"); if (mode === "az") return l.sort((a, b) => a.localeCompare(b)).join("\n"); if (mode === "za") return l.sort((a, b) => b.localeCompare(a)).join("\n"); if (mode === "num") return l.sort((a, b) => parseFloat(a) - parseFloat(b)).join("\n"); if (mode === "len") return l.sort((a, b) => a.length - b.length).join("\n"); if (mode === "rev") return l.reverse().join("\n"); return l.map((x) => [Math.random(), x] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]).join("\n"); };
  return (
    <div className="space-y-3">
      <Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="az">A to Z</option><option value="za">Z to A</option><option value="num">Numeric (low to high)</option><option value="len">By length</option><option value="rev">Reverse order</option><option value="rand">Random shuffle</option></Select>
      <TextXform key={mode} fn={fn} placeholder="One item per line..." />
    </div>
  );
};
const TextToPdf = () => {
  const [t, setT] = useState(""), [title, setTitle] = useState("document"), [busy, setBusy] = useState(false);
  const make = async () => {
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts } = await import("pdf-lib");
      const doc = await PDFDocument.create(), font = await doc.embedFont(StandardFonts.Helvetica), size = 12, W = 595, H = 842, M = 56, maxW = W - 2 * M;
      const lines: string[] = [];
      for (const para of t.replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "?").split("\n")) {
        let cur = ""; for (const word of para.split(" ")) { const tryL = cur ? cur + " " + word : word; if (font.widthOfTextAtSize(tryL, size) > maxW && cur) { lines.push(cur); cur = word; } else cur = tryL; } lines.push(cur);
      }
      let page = doc.addPage([W, H]), y = H - M;
      for (const l of lines) { if (y < M) { page = doc.addPage([W, H]); y = H - M; } page.drawText(l, { x: M, y, size, font }); y -= size * 1.5; }
      const bytes = await doc.save();
      downloadBlob(`${title || "document"}.pdf`, new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } finally { setBusy(false); }
  };
  return (
    <ToolCard>
      <Field label="File name"><TextInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <div className="mt-4"><Field label="Text" hint="Latin characters only. Runs in your browser, nothing is uploaded."><TextArea rows={10} value={t} onChange={(e) => setT(e.target.value)} /></Field></div>
      <div className="mt-4"><Button onClick={make} disabled={!t.trim() || busy}>{busy ? "Creating..." : "Download PDF"}</Button></div>
    </ToolCard>
  );
};
const ZONES = ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow", "Africa/Cairo", "Africa/Lagos", "Asia/Dubai", "Asia/Riyadh", "Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Jakarta", "Asia/Singapore", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul", "Australia/Sydney", "Pacific/Auckland"];
const TimeZone = () => {
  const nowLocal = () => { const d = new Date(); d.setSeconds(0, 0); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
  const [dt, setDt] = useState(nowLocal()), [from, setFrom] = useState("UTC");
  const rows = useMemo(() => {
    const [d, tm] = dt.split("T"); if (!d || !tm) return [];
    const [y, mo, da] = d.split("-").map(Number), [h, mi] = tm.split(":").map(Number);
    const fmt = (z: string, ms: number) => new Intl.DateTimeFormat("en-GB", { timeZone: z, dateStyle: "medium", timeStyle: "short" }).format(ms);
    let guess = Date.UTC(y, mo - 1, da, h, mi);
    const off = (z: string, ms: number) => { const p = new Intl.DateTimeFormat("en-US", { timeZone: z, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(ms).reduce<Record<string, number>>((a, x) => { if (x.type !== "literal") a[x.type] = +x.value; return a; }, {}); return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - ms; };
    guess -= off(from, guess); guess = Date.UTC(y, mo - 1, da, h, mi) - off(from, guess);
    return ZONES.map((z) => [z, fmt(z, guess)] as const);
  }, [dt, from]);
  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Date and time"><TextInput type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} /></Field><Field label="In time zone"><Select value={from} onChange={(e) => setFrom(e.target.value)}>{ZONES.map((z) => <option key={z}>{z}</option>)}</Select></Field></div>
      <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><tbody>{rows.map(([z, t]) => <tr key={z} className="border-t border-border-default"><td className="py-1 pr-4 text-text-muted">{z}</td><td>{t}</td></tr>)}</tbody></table></div>
    </ToolCard>
  );
};

export const POPULAR: Record<string, () => ReactNode> = {
  "loan-emi-calculator": () => <Emi />, "mortgage-calculator": () => <Mortgage />, "compound-interest-calculator": () => <Compound />, "simple-interest-calculator": () => <Simple />,
  "tip-calculator": () => <Tip />, "vat-calculator": () => <Vat />, "hourly-to-salary-calculator": () => <Salary />, "days-between-dates-calculator": () => <DaysBetween />,
  "date-calculator": () => <DateAdd />, "calorie-calculator": () => <Bmr />, "ideal-weight-calculator": () => <IdealWeight />, "roi-calculator": () => <Roi />, "cagr-calculator": () => <Cagr />,
  "percentage-increase-calculator": () => <PctIncrease />, "speed-distance-time-calculator": () => <Sdt />, "pregnancy-due-date-calculator": () => <DueDate />, "fraction-calculator": () => <Fraction />,
  "average-calculator": () => <Average />, "random-number-generator": () => <RandomNumber />, "dice-roller": () => <Dice />, "random-name-picker": () => <NamePicker />,
  "stopwatch": () => <Stopwatch />, "countdown-timer": () => <Countdown />, "pomodoro-timer": () => <Countdown pomodoro />, "morse-code-translator": () => <MorseTool />,
  "text-to-binary": () => <BinaryTool />, "roman-numeral-converter": () => <RomanTool />, "number-to-words-converter": () => <NumberToWords />, "text-repeater": () => <Repeater />,
  "remove-punctuation": () => <RemovePunct />, "upside-down-text-generator": () => <UpsideDown />, "word-frequency-counter": () => <WordFreq />, "readability-score-checker": () => <Readability />,
  "number-base-converter": () => <BaseConv />, "json-minifier": () => <JsonMin />, "sort-lines-alphabetically": () => <SortLines />, "text-to-pdf": () => <TextToPdf />, "time-zone-converter": () => <TimeZone />,
};

export default function PopularTool({ id }: { id: string }) {
  const r = POPULAR[id];
  return <>{r ? r() : null}</>;
}
