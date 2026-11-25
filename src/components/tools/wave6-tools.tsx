"use client";
/* eslint-disable react/display-name */

import { useMemo, useState, type ReactNode } from "react";
import { Button, CopyButton, Field, OutputBox, StatBadge, TextArea, TextInput, ToolCard } from "./ui";
import { Calc, TextXform, money, num, N, type Row } from "./calc-kit";

type FD = { k: string; label: string; def: string; options?: [string, string][]; type?: string; hint?: string };
const f = (k: string, label: string, def: string, hint?: string): FD => ({ k, label, def, hint });
const sel = (k: string, label: string, def: string, options: [string, string][]): FD => ({ k, label, def, options });
const txt = (k: string, label: string, def: string, hint?: string): FD => ({ k, label, def, type: "text", hint });
const C = (fields: FD[], compute: (v: Record<string, string>) => Row[] | string, note?: string) => () => <Calc fields={fields} compute={compute} note={note} />;
const pct = (n: number, d = 2) => num(n, d) + "%";
const nums = (s: string) => (s.replace(/,(?=\d{3})/g, "").match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
const BAD = "Enter positive numbers in every field.";

/* finance */
const salaryToHourly = (v: Record<string, string>): Row[] | string => { const a = N(v.a), h = N(v.h), w = N(v.w); if (!(a > 0 && h > 0 && w > 0)) return BAD; const hr = a / (h * w); return [["Hourly", money(hr)], ["Daily (8 h)", money(hr * 8)], ["Weekly", money(hr * h)], ["Monthly", money(a / 12)]]; };
const overtime = (v: Record<string, string>): Row[] | string => { const r = N(v.r), h = N(v.h), o = N(v.o), m = N(v.m); if (!(r > 0) || h < 0 || o < 0 || !(m >= 1)) return BAD; return [["Regular pay", money(r * h)], ["Overtime pay", money(r * m * o)], ["Total pay", money(r * h + r * m * o)], ["Overtime rate", money(r * m)]]; };
const salesTax = (v: Record<string, string>): Row[] | string => { const p = N(v.p), r = N(v.r) / 100; if (!(p >= 0) || !(r >= 0)) return BAD; if (v.mode === "add") return [["Sales tax", money(p * r)], ["Total with tax", money(p * (1 + r))]]; const pre = p / (1 + r); return [["Price before tax", money(pre)], ["Tax included", money(p - pre)]]; };
const gst = (v: Record<string, string>): Row[] | string => { const a = N(v.a), r = N(v.r) / 100; if (!(a >= 0) || !(r >= 0)) return BAD; const net = v.mode === "excl" ? a : a / (1 + r), g = net * r; return [["Net amount", money(net)], ["GST", money(g)], ["CGST + SGST (each)", money(g / 2)], ["Total with GST", money(net + g)]]; };
const dti = (v: Record<string, string>): Row[] | string => { const d = N(v.d), i = N(v.i); if (!(i > 0) || d < 0) return "Enter your monthly gross income and debt payments."; const r = (d / i) * 100; return [["Debt-to-income ratio", pct(r, 1)], ["Rating", r <= 36 ? "Healthy (36% or less)" : r <= 43 ? "Manageable (up to 43%)" : "High (above 43%)"]]; };
const zakat = (v: Record<string, string>): Row[] | string => { const cash = N(v.cash), g = N(v.g), gp = N(v.gp), inv = N(v.inv), rec = N(v.rec), debt = N(v.debt); if (![cash, g, gp, inv, rec, debt].every((x) => x >= 0) || !(gp > 0)) return "Enter amounts and the current price of 1 gram of gold."; const wealth = cash + g * gp + inv + rec - debt, nisab = 85 * gp; const due = wealth >= nisab ? wealth * 0.025 : 0; return [["Net zakatable wealth", money(wealth)], ["Nisab (85 g of gold)", money(nisab)], ["Zakat due (2.5%)", wealth >= nisab ? money(due) : "Below nisab, none due"]]; };

/* health */
const bmr = (v: Record<string, string>): Row[] | string => { const w = N(v.w), h = N(v.h), a = N(v.a); if (!(w > 0 && h > 0 && a > 0)) return BAD; const b = 10 * w + 6.25 * h - 5 * a + (v.s === "m" ? 5 : -161); return [["BMR", Math.round(b) + " kcal/day"], ["Sedentary (x1.2)", Math.round(b * 1.2) + " kcal"], ["Light activity (x1.375)", Math.round(b * 1.375) + " kcal"], ["Moderate (x1.55)", Math.round(b * 1.55) + " kcal"], ["Very active (x1.725)", Math.round(b * 1.725) + " kcal"]]; };
const hm = (m: number) => { const t = ((m % 1440) + 1440) % 1440; const h = Math.floor(t / 60), mm = t % 60; const ap = h >= 12 ? "PM" : "AM"; return `${h % 12 || 12}:${String(mm).padStart(2, "0")} ${ap}`; };
const sleep = (v: Record<string, string>): Row[] | string => { const m = v.t.match(/^(\d{1,2}):(\d{2})$/); if (!m) return "Enter a time like 07:00."; const t = +m[1] * 60 + +m[2]; if (+m[1] > 23 || +m[2] > 59) return "Enter a valid time."; if (v.mode === "wake") return [6, 5, 4, 3].map((c) => [`${c} cycles (${c * 1.5} h)`, `Go to bed at ${hm(t - c * 90 - 15)}`] as Row); return [6, 5, 4, 3].map((c) => [`${c} cycles (${c * 1.5} h)`, `Wake at ${hm(t + c * 90 + 15)}`] as Row); };
const fmtD = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const ovul = (v: Record<string, string>): Row[] | string => { const d = new Date(v.d + "T00:00:00Z"), c = N(v.c); if (isNaN(+d)) return "Pick the first day of your last period."; if (!(c >= 20 && c <= 45)) return "Cycle length is usually 21 to 35 days."; const add = (n: number) => new Date(+d + n * 864e5); const o = c - 14; return [["Ovulation (estimate)", fmtD(add(o))], ["Fertile window", `${fmtD(add(o - 5))} to ${fmtD(add(o + 1))}`], ["Next period", fmtD(add(c))], ["Pregnancy test from", fmtD(add(c + 1))]]; };
const MET: [string, number][] = [["Walking, 5 km/h", 3.5], ["Brisk walking, 6.5 km/h", 4.3], ["Running, 8 km/h", 8.3], ["Running, 10 km/h", 9.8], ["Cycling, moderate", 8], ["Swimming, laps", 6], ["Jump rope", 11], ["Yoga", 2.5], ["Weight training", 3.5], ["HIIT / circuit", 8], ["Football (soccer)", 7], ["Basketball", 6.5], ["Dancing", 5]];
const burn = (v: Record<string, string>): Row[] | string => { const w = N(v.w), m = N(v.m), met = N(v.met); if (!(w > 0 && m > 0)) return BAD; const k = (met * 3.5 * w) / 200 * m; return [["Calories burned", Math.round(k) + " kcal"], ["Per hour", Math.round((k / m) * 60) + " kcal"]]; };

/* math */
const pdiff = (v: Record<string, string>): Row[] | string => { const a = N(v.a), b = N(v.b); if (!Number.isFinite(a) || !Number.isFinite(b) || a + b === 0) return "Enter two numbers that do not add up to zero."; return [["Percentage difference", pct((Math.abs(a - b) / ((a + b) / 2)) * 100)], ["Absolute difference", num(Math.abs(a - b))], ["Percent change A to B", a ? pct(((b - a) / Math.abs(a)) * 100) : "-"]]; };
const stats = (v: Record<string, string>): Row[] | string => { const x = nums(v.l); if (!x.length) return "Enter some numbers separated by commas, spaces or new lines."; const s = [...x].sort((a, b) => a - b), n = x.length, sum = x.reduce((a, b) => a + b, 0); const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; const cnt = new Map<number, number>(); x.forEach((q) => cnt.set(q, (cnt.get(q) ?? 0) + 1)); const mx = Math.max(...cnt.values()); const mode = mx === 1 ? "No mode" : [...cnt].filter(([, c]) => c === mx).map(([k]) => k).join(", "); return [["Count", String(n)], ["Sum", num(sum)], ["Mean", num(sum / n)], ["Median", num(med)], ["Mode", mode], ["Min / Max", `${num(s[0])} / ${num(s[n - 1])}`], ["Range", num(s[n - 1] - s[0])]]; };
const sd = (v: Record<string, string>): Row[] | string => { const x = nums(v.l); if (x.length < 2) return "Enter at least two numbers."; const n = x.length, m = x.reduce((a, b) => a + b, 0) / n, ss = x.reduce((a, b) => a + (b - m) ** 2, 0); return [["Mean", num(m)], ["Sample std deviation (s)", num(Math.sqrt(ss / (n - 1)))], ["Population std deviation (σ)", num(Math.sqrt(ss / n))], ["Sample variance", num(ss / (n - 1))], ["Population variance", num(ss / n)]]; };
const bigFact = (n: number, to: number) => { let r = BigInt(1); for (let i = to + 1; i <= n; i++) r *= BigInt(i); return r; };
const perm = (v: Record<string, string>): Row[] | string => { const n = Math.floor(N(v.n)), r = Math.floor(N(v.r)); if (!(n >= 0 && r >= 0 && r <= n) || n > 500) return "Enter whole numbers with r not larger than n (n up to 500)."; const p = bigFact(n, n - r); let c = p; for (let i = 2; i <= r; i++) c /= BigInt(i); const fmt = (b: bigint) => (b.toString().length > 21 ? Number(b).toExponential(4) : b.toLocaleString("en-US")); return [[`Permutations P(${n},${r})`, fmt(p)], [`Combinations C(${n},${r})`, fmt(c)]]; };
const tri = (v: Record<string, string>): Row[] | string => { const out: Row[] = []; const b = N(v.b), h = N(v.h), a = N(v.a), bb = N(v.s2), c = N(v.s3); if (b > 0 && h > 0) out.push(["Area (base x height / 2)", num((b * h) / 2)]); if (a > 0 && bb > 0 && c > 0) { if (a + bb <= c || a + c <= bb || bb + c <= a) return "These three sides cannot form a triangle."; const s = (a + bb + c) / 2; out.push(["Area (Heron's formula)", num(Math.sqrt(s * (s - a) * (s - bb) * (s - c)))], ["Perimeter", num(a + bb + c)]); } return out.length ? out : "Enter a base and height, or all three sides."; };
const area = (v: Record<string, string>): Row[] | string => { const a = N(v.a), b = N(v.b), c = N(v.c); if (!(a > 0)) return "Enter the first dimension."; switch (v.s) { case "rect": if (!(b > 0)) return "Enter the width as the second value."; return [["Area", num(a * b)], ["Perimeter", num(2 * (a + b))]]; case "circle": return [["Area", num(Math.PI * a * a)], ["Circumference", num(2 * Math.PI * a)]]; case "tri": if (!(b > 0)) return "Enter the height as the second value."; return [["Area", num((a * b) / 2)]]; case "trap": if (!(b > 0 && c > 0)) return "Enter base 1 (first), base 2 (second) and height (third)."; return [["Area", num(((a + b) / 2) * c)]]; default: if (!(b > 0)) return "Enter the second radius."; return [["Area", num(Math.PI * a * b)]]; } };
const volume = (v: Record<string, string>): Row[] | string => { const a = N(v.a), b = N(v.b), c = N(v.c); if (!(a > 0)) return "Enter the first dimension."; switch (v.s) { case "box": if (!(b > 0 && c > 0)) return "Enter length, width and height."; return [["Volume", num(a * b * c)], ["Surface area", num(2 * (a * b + b * c + a * c))]]; case "cyl": if (!(b > 0)) return "Enter radius then height."; return [["Volume", num(Math.PI * a * a * b)], ["Surface area", num(2 * Math.PI * a * (a + b))]]; case "sph": return [["Volume", num((4 / 3) * Math.PI * a ** 3)], ["Surface area", num(4 * Math.PI * a * a)]]; default: if (!(b > 0)) return "Enter radius then height."; return [["Volume", num((Math.PI * a * a * b) / 3)], ["Slant height", num(Math.hypot(a, b))]]; } };

/* education */
const gradeLetter = (p: number) => (p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 60 ? "D" : "F");
const marks = (v: Record<string, string>): Row[] | string => { const m = N(v.m), t = N(v.t); if (!(t > 0) || m < 0 || m > t) return "Marks must be between 0 and the total."; const p = (m / t) * 100; return [["Percentage", pct(p)], ["Letter grade (US scale)", gradeLetter(p)], ["Marks lost", num(t - m)]]; };
const cgpa = (v: Record<string, string>): Row[] | string => { const c = N(v.c), sc = N(v.sc); if (!(c >= 0) || !(sc > 0) || c > sc) return "CGPA must be between 0 and the scale."; let p = 0; let how = ""; if (v.u === "cbse") { p = c * 9.5; how = "CGPA x 9.5"; } else if (v.u === "vtu") { p = (c - 0.75) * 10; how = "(CGPA - 0.75) x 10"; } else { p = (c / sc) * 100; how = "CGPA / scale x 100"; } return [["Percentage", pct(Math.max(0, p))], ["Formula", how]]; };
const weighted = (v: Record<string, string>): Row[] | string => { const rows = v.l.split("\n").map((l) => nums(l)).filter((r) => r.length >= 2); if (!rows.length) return "Enter one line per item: score, weight (for example 85, 30)."; const w = rows.reduce((a, r) => a + r[1], 0); if (!(w > 0)) return "Weights must add up to more than 0."; const g = rows.reduce((a, r) => a + r[0] * r[1], 0) / w; return [["Weighted average", num(g, 2)], ["Total weight", num(w)], ["Letter grade (US scale)", gradeLetter(g)]]; };

/* time */
const toMin = (s: string) => { const m = s.trim().match(/^(\d{1,2}):(\d{2})$/); return m ? +m[1] * 60 + +m[2] : NaN; };
const hmm = (m: number) => `${Math.floor(m / 60)} h ${Math.round(m % 60)} min`;
const duration = (v: Record<string, string>): Row[] | string => { const a = toMin(v.a), b = toMin(v.b); if (isNaN(a) || isNaN(b)) return "Enter times like 09:30 and 17:45."; let d = b - a; if (d < 0) d += 1440; return [["Duration", hmm(d)], ["Decimal hours", num(d / 60, 2)], ["Minutes", String(d)]]; };
const timecard = (s: string) => { const brk = 0; void brk; let total = 0; const lines = s.split("\n").filter((l) => l.trim()).map((l) => { const m = l.match(/(\d{1,2}:\d{2})\s*(?:-|to|–)\s*(\d{1,2}:\d{2})(?:\s*,?\s*(?:break)?\s*(\d+))?/i); if (!m) return `${l.trim()}  ->  could not read (use 09:00-17:30 or 09:00-17:30, 30)`; let d = toMin(m[2]) - toMin(m[1]); if (d < 0) d += 1440; d -= +(m[3] ?? 0); d = Math.max(0, d); total += d; return `${m[1]} - ${m[2]}${m[3] ? ` (break ${m[3]} min)` : ""}  =  ${hmm(d)}`; }); return `${lines.join("\n")}\n\nTotal: ${hmm(total)}  (${(total / 60).toFixed(2)} decimal hours)`; };

/* home */
const GRAMS: [string, number][] = [["All-purpose flour", 120], ["Bread flour", 127], ["Granulated sugar", 200], ["Brown sugar (packed)", 213], ["Powdered sugar", 120], ["Butter", 227], ["Vegetable oil", 218], ["Water", 237], ["Milk", 245], ["Honey", 340], ["Rice (uncooked)", 185], ["Rolled oats", 90], ["Cocoa powder", 85], ["Salt (table)", 288]];
const cups = (v: Record<string, string>): Row[] | string => { const n = N(v.n), g = N(v.i); if (!(n > 0)) return "Enter an amount above 0."; const mul = v.u === "cup" ? 1 : v.u === "tbsp" ? 1 / 16 : 1 / 48; const grams = n * mul * g; return [["Grams", num(grams, 1) + " g"], ["Ounces", num(grams / 28.3495, 2) + " oz"], ["Milliliters (volume)", num(n * mul * 236.588, 0) + " ml"]]; };
const paint = (v: Record<string, string>): Row[] | string => { const l = N(v.l), w = N(v.w), h = N(v.h), d = N(v.d), wi = N(v.wi), c = N(v.c), cov = N(v.cov); if (!(l > 0 && w > 0 && h > 0 && c > 0 && cov > 0)) return BAD; const walls = 2 * (l + w) * h - d * 1.9 - wi * 1.4; if (walls <= 0) return "Doors and windows cannot be larger than the walls."; const lit = (walls * c) / cov; return [["Paintable wall area", num(walls, 1) + " m²"], ["Paint needed", num(lit, 1) + " L"], ["With 10% extra", num(lit * 1.1, 1) + " L"]]; };
const tile = (v: Record<string, string>): Row[] | string => { const l = N(v.l), w = N(v.w), a = N(v.a), b = N(v.b), ws = N(v.ws) / 100; if (!(l > 0 && w > 0 && a > 0 && b > 0) || ws < 0) return BAD; const area = l * w, t = (a / 100) * (b / 100); const need = Math.ceil((area / t) * (1 + ws)); return [["Floor area", num(area, 2) + " m²"], ["Tiles needed", String(need)], ["Tile size", `${a} x ${b} cm`]]; };
const concrete = (v: Record<string, string>): Row[] | string => { const l = N(v.l), w = N(v.w), t = N(v.t) / 100; if (!(l > 0 && w > 0 && t > 0)) return BAD; const m3 = l * w * t; return [["Volume", num(m3, 3) + " m³"], ["With 10% extra", num(m3 * 1.1, 3) + " m³"], ["Cubic yards (with extra)", num(m3 * 1.1 * 1.30795, 2)]]; };
const fuel = (v: Record<string, string>): Row[] | string => { const d = N(v.d), e = N(v.e), p = N(v.p); if (!(d > 0 && e > 0 && p >= 0)) return BAD; let used = 0, unit = "L", cost = 0; if (v.u === "metric") { used = (d * e) / 100; cost = used * p; } else { used = d / e; unit = "gal"; cost = used * p; } return [["Fuel used", num(used, 2) + " " + unit], ["Trip cost", money(cost)], ["Cost per distance unit", money(cost / d)]]; };

/* fun */
function Coin() {
  const [r, setR] = useState<string[]>([]);
  const flip = () => { const a = new Uint8Array(1); crypto.getRandomValues(a); setR((x) => [a[0] % 2 ? "Heads" : "Tails", ...x].slice(0, 30)); };
  const h = r.filter((x) => x === "Heads").length;
  return (
    <ToolCard>
      <div className="flex flex-col items-center gap-4"><div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-500 bg-yellow-100 text-xl font-bold text-yellow-800">{r[0] ?? "Flip!"}</div><Button onClick={flip}>Flip the coin</Button></div>
      {r.length ? <div className="mt-4 flex flex-wrap justify-center gap-3"><StatBadge label="Flips" value={r.length} /><StatBadge label="Heads" value={h} /><StatBadge label="Tails" value={r.length - h} /></div> : null}
      {r.length ? <p className="mt-3 break-words text-center text-xs text-text-muted">{r.join(", ")}</p> : null}
    </ToolCard>
  );
}
const shuffle = <T,>(a: T[]) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const r = new Uint32Array(1); crypto.getRandomValues(r); const j = r[0] % (i + 1); [x[i], x[j]] = [x[j], x[i]]; } return x; };
function Teams() {
  const [names, setNames] = useState("Ahmed\nSara\nOmar\nLayla\nYoussef\nMona\nKhaled\nNour"); const [n, setN] = useState("2"); const [seed, setSeed] = useState(0);
  const teams = useMemo(() => { void seed; const list = names.split("\n").map((x) => x.trim()).filter(Boolean); const k = Math.min(Math.max(Math.floor(+n) || 2, 2), Math.max(2, list.length)); const t: string[][] = Array.from({ length: k }, () => []); (seed === 0 ? list : shuffle(list)).forEach((x, i) => t[i % k].push(x)); return t; }, [names, n, seed]);
  const out = teams.map((t, i) => `Team ${i + 1}: ${t.join(", ")}`).join("\n");
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3"><div className="sm:col-span-2"><Field label="Names (one per line)"><TextArea rows={8} value={names} onChange={(e) => setNames(e.target.value)} /></Field></div><Field label="Number of teams"><TextInput type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{teams.map((t, i) => <div key={i} className="rounded-lg border border-border-default p-3"><div className="mb-1 font-semibold">Team {i + 1}</div><ul className="text-sm">{t.map((x, j) => <li key={j}>{x}</li>)}</ul></div>)}</div>
      <div className="mt-3 flex gap-3"><Button onClick={() => setSeed(seed + 1)}>Shuffle again</Button><CopyButton getText={() => out} /></div>
    </ToolCard>
  );
}
function Lottery() {
  const [c, setC] = useState("6"), [m, setM] = useState("49"), [s, setS] = useState("5"), [seed, setSeed] = useState(0);
  const out = useMemo(() => { void seed; const C = Math.floor(+c), M = Math.floor(+m), S = Math.min(Math.max(Math.floor(+s) || 1, 1), 20); if (!(C >= 1 && M >= C && M <= 1000)) return "Pick count must be at most the highest number (up to 1000)."; if (seed === 0) return "Press Generate to get your numbers."; return Array.from({ length: S }, () => shuffle(Array.from({ length: M }, (_, i) => i + 1)).slice(0, C).sort((a, b) => a - b).join(" - ")).join("\n"); }, [c, m, s, seed]);
  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3"><Field label="Numbers per set"><TextInput type="number" value={c} onChange={(e) => setC(e.target.value)} /></Field><Field label="Highest number"><TextInput type="number" value={m} onChange={(e) => setM(e.target.value)} /></Field><Field label="Sets"><TextInput type="number" value={s} onChange={(e) => setS(e.target.value)} /></Field></div>
      <div className="mt-4"><OutputBox value={out} rows={6} /></div>
      <div className="mt-3 flex gap-3"><Button onClick={() => setSeed(seed + 1)}>Generate</Button><CopyButton getText={() => out} /></div>
      <p className="mt-3 text-xs text-text-muted">Numbers are random and unique within a set. No method can predict a lottery draw.</p>
    </ToolCard>
  );
}

const SHAPE = (opts: [string, string][], hint: string): FD[] => [sel("s", "Shape", opts[0][0], opts), f("a", "Value 1", "10", hint), f("b", "Value 2", "5"), f("c", "Value 3", "4")];

export const WAVE6: Record<string, () => ReactNode> = {
  "salary-to-hourly-calculator": C([f("a", "Annual salary", "60000"), f("h", "Hours per week", "40"), f("w", "Weeks per year", "52")], salaryToHourly),
  "overtime-pay-calculator": C([f("r", "Hourly rate", "20"), f("h", "Regular hours", "40"), f("o", "Overtime hours", "6"), f("m", "Overtime multiplier", "1.5")], overtime, "Many countries pay 1.5x for overtime. Your contract or local law decides the rate."),
  "sales-tax-calculator": C([f("p", "Price", "100"), f("r", "Tax rate %", "8"), sel("mode", "Mode", "add", [["add", "Add tax to price"], ["remove", "Price already includes tax"]])], salesTax),
  "gst-calculator": C([f("a", "Amount", "1000"), f("r", "GST rate %", "18"), sel("mode", "Amount is", "excl", [["excl", "Excluding GST"], ["incl", "Including GST"]])], gst, "Common GST slabs in India are 5, 12, 18 and 28 percent. CGST and SGST split the tax equally within a state."),
  "debt-to-income-ratio-calculator": C([f("d", "Monthly debt payments", "1500"), f("i", "Gross monthly income", "5000")], dti, "Lenders often look for 36 percent or less, and many mortgages allow up to 43 percent."),
  "zakat-calculator": C([f("cash", "Cash and savings", "10000"), f("g", "Gold owned (grams)", "50"), f("gp", "Price of 1 gram of gold", "70", "Use today's price in your currency"), f("inv", "Investments and business stock", "0"), f("rec", "Money owed to you (sure to be paid)", "0"), f("debt", "Debts due now", "0")], zakat, "Zakat is 2.5 percent of net wealth above the nisab, held for one lunar year. Scholars differ on details such as nisab (gold or silver), so confirm with a trusted scholar."),
  "bmr-calculator": C([sel("s", "Sex", "m", [["m", "Male"], ["f", "Female"]]), f("w", "Weight (kg)", "75"), f("h", "Height (cm)", "175"), f("a", "Age", "30")], bmr, "Mifflin-St Jeor equation. BMR is what you burn at rest. Multiplied by activity it estimates daily needs."),
  "sleep-calculator": C([sel("mode", "I want to", "wake", [["wake", "Wake up at a set time"], ["sleep", "Go to bed at a set time"]]), txt("t", "Time (24 h, HH:MM)", "07:00")], sleep, "Sleep cycles last about 90 minutes. The tool adds 15 minutes to fall asleep. Adults usually need 7 to 9 hours."),
  "ovulation-calculator": C([{ k: "d", label: "First day of last period", def: "2026-11-01", type: "date" }, f("c", "Average cycle length (days)", "28")], ovul, "An estimate for regular cycles, not medical advice and not a contraceptive method."),
  "calories-burned-calculator": () => <Calc fields={[f("w", "Weight (kg)", "70"), f("m", "Minutes", "30"), sel("met", "Activity", "3.5", MET.map(([n, m]) => [String(m), n]))]} compute={burn} note="Estimated with MET values: calories = MET x 3.5 x weight / 200 x minutes." />,
  "percentage-difference-calculator": C([f("a", "Value A", "50"), f("b", "Value B", "80")], pdiff, "Percentage difference = |A - B| / average of A and B x 100. It does not depend on which number is first."),
  "mean-median-mode-calculator": C([txt("l", "Numbers (commas, spaces or new lines)", "4, 8, 8, 15, 16, 23, 42")], stats),
  "standard-deviation-calculator": C([txt("l", "Numbers (commas, spaces or new lines)", "2, 4, 4, 4, 5, 5, 7, 9")], sd, "Use the sample value when your data is a sample of a larger group, and the population value when it is every member."),
  "permutation-combination-calculator": C([f("n", "Total items (n)", "10"), f("r", "Items chosen (r)", "3")], perm, "Permutations count ordered selections. Combinations count unordered ones."),
  "triangle-area-calculator": C([f("b", "Base", "10"), f("h", "Height", "6"), f("a", "Side a", ""), f("s2", "Side b", ""), f("s3", "Side c", "")], tri, "Fill base and height, or fill all three sides to use Heron's formula."),
  "area-calculator": C(SHAPE([["rect", "Rectangle (length, width)"], ["circle", "Circle (radius)"], ["tri", "Triangle (base, height)"], ["trap", "Trapezoid (base 1, base 2, height)"], ["ell", "Ellipse (radius 1, radius 2)"]], "Length, radius or base"), area, "Values by shape: rectangle length and width; circle radius; triangle base and height; trapezoid base 1, base 2, height; ellipse two radii."),
  "volume-calculator": C(SHAPE([["box", "Box (length, width, height)"], ["cyl", "Cylinder (radius, height)"], ["sph", "Sphere (radius)"], ["cone", "Cone (radius, height)"]], "Length or radius"), volume, "Use the same unit for all values. The result is in cubic units."),
  "grade-percentage-calculator": C([f("m", "Marks obtained", "412"), f("t", "Total marks", "500")], marks),
  "cgpa-to-percentage-calculator": C([f("c", "CGPA", "8.4"), f("sc", "CGPA scale (out of)", "10"), sel("u", "Method", "cbse", [["cbse", "CBSE (CGPA x 9.5)"], ["vtu", "VTU ((CGPA - 0.75) x 10)"], ["lin", "Simple (CGPA / scale x 100)"]])], cgpa, "Universities use different rules. Check the formula of your own university or employer."),
  "weighted-grade-calculator": () => <Calc fields={[{ k: "l", label: "One line per item: score, weight", def: "90, 20\n78, 30\n85, 50", type: "text" }]} compute={weighted} note="Enter lines such as 85, 30 meaning a score of 85 that counts for 30 percent." />,
  "time-card-calculator": () => <TextXform fn={timecard} placeholder={"09:00-17:30, 30\n08:45-16:15"} rows={8} outLabel="Hours worked" />,
  "time-duration-calculator": C([txt("a", "Start time (24 h)", "09:30"), txt("b", "End time (24 h)", "17:45")], duration, "If the end time is earlier than the start time, the tool assumes it is the next day."),
  "coin-flip": () => <Coin />,
  "random-team-generator": () => <Teams />,
  "lottery-number-generator": () => <Lottery />,
  "cups-to-grams-converter": () => <Calc fields={[f("n", "Amount", "1"), sel("u", "Unit", "cup", [["cup", "US cups"], ["tbsp", "Tablespoons"], ["tsp", "Teaspoons"]]), sel("i", "Ingredient", "120", GRAMS.map(([n, g]) => [String(g), n]))]} compute={cups} note="Weights are typical values. Flour packing and brands change them by 10 percent or more, so use a scale for baking." />,
  "paint-calculator": C([f("l", "Room length (m)", "5"), f("w", "Room width (m)", "4"), f("h", "Wall height (m)", "2.7"), f("d", "Doors", "1"), f("wi", "Windows", "2"), f("c", "Coats", "2"), f("cov", "Coverage (m² per liter)", "10")], paint, "Doors count as 1.9 m² and windows as 1.4 m². Check the coverage on your paint can."),
  "tile-calculator": C([f("l", "Floor length (m)", "5"), f("w", "Floor width (m)", "4"), f("a", "Tile length (cm)", "60"), f("b", "Tile width (cm)", "60"), f("ws", "Waste allowance %", "10")], tile, "Allow 10 percent for cuts and breakage, 15 for diagonal layouts."),
  "concrete-calculator": C([f("l", "Length (m)", "4"), f("w", "Width (m)", "3"), f("t", "Thickness (cm)", "10")], concrete, "Order a little extra for uneven ground and spillage."),
  "fuel-cost-calculator": C([sel("u", "Units", "metric", [["metric", "km, L/100 km, price per liter"], ["us", "miles, mpg, price per gallon"]]), f("d", "Distance", "300"), f("e", "Fuel consumption (L/100 km or mpg)", "7.5"), f("p", "Fuel price per liter or gallon", "1.5")], fuel),
};
void Field;
