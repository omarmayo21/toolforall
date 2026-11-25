"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button, CopyButton, Field, StatBadge, TextArea, ToolCard } from "./ui";
import { Calc, TextXform, money, num, N, type Row } from "./calc-kit";

const today = () => new Date().toISOString().slice(0, 10);
const pct = (x: number, d = 2) => `${num(x, d)}%`;

/* ---------------- Finance ---------------- */
const ProfitMargin = () => (
  <Calc fields={[{ k: "c", label: "Cost", def: "60" }, { k: "r", label: "Revenue (selling price)", def: "100" }]}
    compute={(v) => { const c = N(v.c), r = N(v.r); if (!(r > 0)) return "Revenue must be above zero."; return [["Profit", money(r - c)], ["Profit margin", pct(((r - c) / r) * 100)], ["Markup", c > 0 ? pct(((r - c) / c) * 100) : "-"]]; }} />
);
const Markup = () => (
  <Calc fields={[{ k: "c", label: "Cost", def: "50" }, { k: "m", label: "Markup (%)", def: "40" }]}
    compute={(v) => { const c = N(v.c), m = N(v.m) / 100, p = c * (1 + m); return [["Selling price", money(p)], ["Profit", money(p - c)], ["Margin", p > 0 ? pct(((p - c) / p) * 100) : "-"]]; }} />
);
const BreakEven = () => (
  <Calc fields={[{ k: "f", label: "Fixed costs", def: "5000" }, { k: "p", label: "Price per unit", def: "25" }, { k: "v", label: "Variable cost per unit", def: "10" }]}
    compute={(v) => { const f = N(v.f), p = N(v.p), c = N(v.v); if (!(p > c)) return "Price must be higher than variable cost."; const u = f / (p - c); return [["Break-even units", String(Math.ceil(u))], ["Break-even revenue", money(Math.ceil(u) * p)], ["Contribution per unit", money(p - c)]]; }} />
);
const Inflation = () => (
  <Calc fields={[{ k: "a", label: "Amount today", def: "1000" }, { k: "r", label: "Average inflation (% per year)", def: "4" }, { k: "y", label: "Years", def: "10" }]}
    compute={(v) => { const a = N(v.a), r = N(v.r) / 100, y = N(v.y); return [["Same goods cost in the future", money(a * Math.pow(1 + r, y))], ["Buying power of today's amount then", money(a / Math.pow(1 + r, y))], ["Total price rise", pct((Math.pow(1 + r, y) - 1) * 100, 1)]]; }} />
);
const SavingsGoal = () => (
  <Calc fields={[{ k: "g", label: "Goal amount", def: "20000" }, { k: "s", label: "Already saved", def: "2000" }, { k: "y", label: "Years to reach it", def: "3" }, { k: "r", label: "Annual return (%)", def: "4" }]}
    compute={(v) => { const g = N(v.g), s = N(v.s), n = Math.round(N(v.y) * 12), i = N(v.r) / 1200; if (!(n > 0)) return "Enter the years."; const fvS = s * Math.pow(1 + i, n); const pmt = i === 0 ? (g - s) / n : ((g - fvS) * i) / (Math.pow(1 + i, n) - 1); return [["Save per month", money(Math.max(0, pmt))], ["Total you deposit", money(Math.max(0, pmt) * n)], ["Growth from interest", money(g - s - Math.max(0, pmt) * n)]]; }} />
);
const Rule72 = () => (
  <Calc fields={[{ k: "r", label: "Annual return (%)", def: "8" }]}
    compute={(v) => { const r = N(v.r); if (!(r > 0)) return "Enter a rate above zero."; return [["Rule of 72", `${num(72 / r, 1)} years`], ["Exact doubling time", `${num(Math.log(2) / Math.log(1 + r / 100), 1)} years`], ["Triple in", `${num(Math.log(3) / Math.log(1 + r / 100), 1)} years`]]; }} />
);
const SalaryRaise = () => (
  <Calc fields={[{ k: "s", label: "Current yearly salary", def: "50000" }, { k: "r", label: "Raise (%)", def: "5" }]}
    compute={(v) => { const s = N(v.s), n = s * (1 + N(v.r) / 100); return [["New yearly salary", money(n)], ["Increase per year", money(n - s)], ["Increase per month", money((n - s) / 12)], ["New monthly salary", money(n / 12)]]; }} />
);
const CardPayoff = () => (
  <Calc fields={[{ k: "b", label: "Card balance", def: "5000" }, { k: "a", label: "APR (%)", def: "24" }, { k: "p", label: "Monthly payment", def: "200" }]}
    compute={(v) => { let b = N(v.b); const i = N(v.a) / 1200, p = N(v.p); if (!(p > b * i)) return "Your payment must be higher than the monthly interest, or the balance never falls."; let m = 0, tot = 0; while (b > 0 && m < 1200) { const int = b * i; const pay = Math.min(p, b + int); b = b + int - pay; tot += pay; m++; } return [["Months to pay off", String(m)], ["Years", num(m / 12, 1)], ["Total interest", money(tot - N(v.b))], ["Total paid", money(tot)]]; }} />
);
const DownPayment = () => (
  <Calc fields={[{ k: "p", label: "Home price", def: "250000" }, { k: "d", label: "Down payment (%)", def: "20" }]}
    compute={(v) => { const p = N(v.p), d = p * N(v.d) / 100; return [["Down payment", money(d)], ["Loan amount", money(p - d)], ["Closing cost (about 3%)", money(p * 0.03)]]; }} />
);
const Retirement = () => (
  <Calc fields={[{ k: "a", label: "Current age", def: "30" }, { k: "ra", label: "Retirement age", def: "60" }, { k: "s", label: "Current savings", def: "10000" }, { k: "m", label: "Monthly contribution", def: "300" }, { k: "r", label: "Annual return (%)", def: "6" }]}
    compute={(v) => { const n = Math.round((N(v.ra) - N(v.a)) * 12), i = N(v.r) / 1200; if (!(n > 0)) return "Retirement age must be above your age."; let b = N(v.s); for (let k = 0; k < n; k++) b = b * (1 + i) + N(v.m); const put = N(v.s) + N(v.m) * n; return [["Balance at retirement", money(b)], ["You contributed", money(put)], ["Growth", money(b - put)], ["4% yearly withdrawal", money(b * 0.04)]]; }} />
);
const UnitPrice = () => (
  <Calc fields={[{ k: "pa", label: "Price of option A", def: "4.5" }, { k: "qa", label: "Quantity of A", def: "500" }, { k: "pb", label: "Price of option B", def: "8" }, { k: "qb", label: "Quantity of B", def: "1000" }]}
    compute={(v) => { const a = N(v.pa) / N(v.qa), b = N(v.pb) / N(v.qb); if (!Number.isFinite(a) || !Number.isFinite(b)) return "Enter all four values."; return [["A per unit", num(a, 5)], ["B per unit", num(b, 5)], ["Better deal", a === b ? "Same" : a < b ? "A" : "B"], ["Saving", pct((Math.abs(a - b) / Math.max(a, b)) * 100, 1)]]; }} />
);
const Commission = () => (
  <Calc fields={[{ k: "s", label: "Sales amount", def: "20000" }, { k: "r", label: "Commission rate (%)", def: "5" }, { k: "b", label: "Base salary (optional)", def: "0" }]}
    compute={(v) => { const c = N(v.s) * N(v.r) / 100; return [["Commission", money(c)], ["Total earnings", money(c + N(v.b))]]; }} />
);

/* ---------------- Health ---------------- */
const BodyFat = () => (
  <Calc fields={[{ k: "s", label: "Sex", def: "m", options: [["m", "Male"], ["f", "Female"]] }, { k: "h", label: "Height (cm)", def: "175" }, { k: "n", label: "Neck (cm)", def: "38" }, { k: "w", label: "Waist at navel (cm)", def: "85" }, { k: "hip", label: "Hip (cm, women)", def: "95" }]}
    compute={(v) => { const h = N(v.h), n = N(v.n), w = N(v.w), hip = N(v.hip); const bf = v.s === "m" ? 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450 : 495 / (1.29579 - 0.35004 * Math.log10(w + hip - n) + 0.221 * Math.log10(h)) - 450; if (!Number.isFinite(bf)) return "Check your measurements."; const cat = v.s === "m" ? (bf < 6 ? "Essential" : bf < 14 ? "Athletic" : bf < 18 ? "Fit" : bf < 25 ? "Average" : "Above average") : (bf < 14 ? "Essential" : bf < 21 ? "Athletic" : bf < 25 ? "Fit" : bf < 32 ? "Average" : "Above average"); return [["Body fat", pct(bf, 1)], ["Category", cat]]; }}
    note="US Navy method. An estimate within a few percent. Not medical advice." />
);
const Water = () => (
  <Calc fields={[{ k: "w", label: "Weight (kg)", def: "70" }, { k: "e", label: "Exercise (minutes per day)", def: "30" }]}
    compute={(v) => { const l = N(v.w) * 0.033 + (N(v.e) / 30) * 0.35; return [["Water per day", `${num(l, 1)} L`], ["Glasses (250 ml)", String(Math.round((l * 1000) / 250))], ["Ounces", `${num(l * 33.814, 0)} oz`]]; }}
    note="General estimate. Needs rise in hot weather and with illness. Ask a doctor if you have kidney or heart conditions." />
);
const OneRm = () => (
  <Calc fields={[{ k: "w", label: "Weight lifted", def: "80" }, { k: "r", label: "Reps performed", def: "8" }]}
    compute={(v) => { const w = N(v.w), r = N(v.r); if (!(r >= 1 && r < 37)) return "Reps must be 1 to 36."; const e = w * (1 + r / 30), b = (w * 36) / (37 - r); const a = (e + b) / 2; return [["Epley 1RM", num(e, 1)], ["Brzycki 1RM", num(b, 1)], ["Average 1RM", num(a, 1)], ["90% of 1RM", num(a * 0.9, 1)], ["80% of 1RM", num(a * 0.8, 1)], ["70% of 1RM", num(a * 0.7, 1)]]; }} />
);
const Macros = () => (
  <Calc fields={[{ k: "c", label: "Daily calories", def: "2200" }, { k: "g", label: "Split", def: "bal", options: [["bal", "Balanced 40 / 30 / 30"], ["low", "Low carb 25 / 35 / 40"], ["pro", "High protein 30 / 40 / 30"]] }]}
    compute={(v) => { const s = { bal: [0.4, 0.3, 0.3], low: [0.25, 0.35, 0.4], pro: [0.3, 0.4, 0.3] }[v.g as "bal"]; const c = N(v.c); return [["Carbs", `${Math.round((c * s[0]) / 4)} g`], ["Protein", `${Math.round((c * s[1]) / 4)} g`], ["Fat", `${Math.round((c * s[2]) / 9)} g`]]; }}
    note="Split order is carbs / protein / fat. Carbs and protein are 4 kcal per gram, fat is 9." />
);
const hms = (min: number) => { const s = Math.round(min * 60), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return `${h}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
const RunPace = () => (
  <Calc fields={[{ k: "d", label: "Distance (km)", def: "10" }, { k: "t", label: "Time (minutes)", def: "55" }]}
    compute={(v) => { const d = N(v.d), t = N(v.t); if (!(d > 0) || !(t > 0)) return "Enter distance and time."; const p = t / d; return [["Pace per km", `${Math.floor(p)}:${String(Math.round((p % 1) * 60)).padStart(2, "0")}`], ["Pace per mile", `${Math.floor(p * 1.609344)}:${String(Math.round(((p * 1.609344) % 1) * 60)).padStart(2, "0")}`], ["Speed", `${num(60 / p, 2)} km/h`], ["5K at this pace", hms(5 * p)], ["10K", hms(10 * p)], ["Half marathon", hms(21.0975 * p)], ["Marathon", hms(42.195 * p)]]; }} />
);
const HeartZones = () => (
  <Calc fields={[{ k: "a", label: "Age", def: "30" }]}
    compute={(v) => { const m = 220 - N(v.a); if (!(m > 0)) return "Enter a valid age."; const z = (a: number, b: number) => `${Math.round(m * a)}-${Math.round(m * b)} bpm`; return [["Max heart rate", `${m} bpm`], ["Zone 1 very light (50-60%)", z(0.5, 0.6)], ["Zone 2 fat burn (60-70%)", z(0.6, 0.7)], ["Zone 3 aerobic (70-80%)", z(0.7, 0.8)], ["Zone 4 threshold (80-90%)", z(0.8, 0.9)], ["Zone 5 maximum (90-100%)", z(0.9, 1)]]; }}
    note="Uses 220 minus age. Individuals vary by 10 bpm or more." />
);
const Whr = () => (
  <Calc fields={[{ k: "s", label: "Sex", def: "m", options: [["m", "Male"], ["f", "Female"]] }, { k: "w", label: "Waist (cm)", def: "85" }, { k: "h", label: "Hip (cm)", def: "100" }]}
    compute={(v) => { const r = N(v.w) / N(v.h); if (!Number.isFinite(r)) return "Enter both measurements."; const lim = v.s === "m" ? 0.9 : 0.85; return [["Waist-to-hip ratio", num(r, 2)], ["WHO risk", r > lim ? "Higher (abdominal obesity)" : "Within the normal range"], ["WHO limit", String(lim)]]; }} />
);
const Protein = () => (
  <Calc fields={[{ k: "w", label: "Weight (kg)", def: "70" }, { k: "g", label: "Goal", def: "1.2", options: [["0.8", "Minimum (sedentary)"], ["1.2", "Active / general fitness"], ["1.6", "Build muscle"], ["2.0", "Heavy training / cutting"]] }]}
    compute={(v) => { const g = N(v.w) * N(v.g); return [["Protein per day", `${Math.round(g)} g`], ["Per meal (4 meals)", `${Math.round(g / 4)} g`], ["Calories from protein", `${Math.round(g * 4)} kcal`]]; }} />
);

/* ---------------- Date & time ---------------- */
const dayName = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long" });
const isoWeek = (d: Date) => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dn = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dn); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return { w: Math.ceil(((+t - +y0) / 86400000 + 1) / 7), y: t.getUTCFullYear() }; };
const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const DayOfWeek = () => (
  <Calc fields={[{ k: "d", label: "Date", def: today(), type: "date" }]}
    compute={(v) => { const d = new Date(v.d + "T12:00:00"); if (isNaN(+d)) return "Pick a date."; const doy = Math.round((+d - +new Date(d.getFullYear(), 0, 0, 12)) / 86400000); return [["Day of the week", dayName(d)], ["Day of the year", String(doy)], ["Days left in year", String((isLeap(d.getFullYear()) ? 366 : 365) - doy)]]; }} />
);
const WeekNumber = () => (
  <Calc fields={[{ k: "d", label: "Date", def: today(), type: "date" }]}
    compute={(v) => { const d = new Date(v.d + "T12:00:00"); if (isNaN(+d)) return "Pick a date."; const w = isoWeek(d); return [["ISO week number", String(w.w)], ["ISO year", String(w.y)], ["Quarter", `Q${Math.floor(d.getMonth() / 3) + 1}`]]; }} />
);
const BusinessDays = () => (
  <Calc fields={[{ k: "d", label: "Start date", def: today(), type: "date" }, { k: "n", label: "Business days to add (negative to go back)", def: "10" }]}
    compute={(v) => { const d = new Date(v.d + "T12:00:00"); if (isNaN(+d)) return "Pick a date."; let n = Math.trunc(N(v.n)); const step = n < 0 ? -1 : 1; n = Math.abs(n); while (n > 0) { d.setDate(d.getDate() + step); const w = d.getDay(); if (w !== 0 && w !== 6) n--; } return [["Result", d.toDateString()], ["ISO date", d.toISOString().slice(0, 10)]]; }}
    note="Skips Saturdays and Sundays. Public holidays are not excluded." />
);
const LeapYear = () => (
  <Calc fields={[{ k: "y", label: "Year", def: String(new Date().getFullYear()), type: "number" }]}
    compute={(v) => { const y = Math.trunc(N(v.y)); if (!Number.isFinite(y)) return "Enter a year."; let nx = y + 1; while (!isLeap(nx)) nx++; return [[`${y}`, isLeap(y) ? "Leap year (366 days)" : "Not a leap year (365 days)"], ["Next leap year", String(nx)], ["February has", isLeap(y) ? "29 days" : "28 days"]]; }} />
);
const Hijri = () => (
  <Calc fields={[{ k: "d", label: "Gregorian date", def: today(), type: "date" }]}
    compute={(v) => { const d = new Date(v.d + "T12:00:00"); if (isNaN(+d)) return "Pick a date."; const f = (loc: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(loc, { timeZone: "UTC", ...o }).format(new Date(v.d + "T12:00:00Z")); return [["Hijri (Umm al-Qura)", f("en-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric" })], ["بالعربية", f("ar-SA-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "long", year: "numeric" })], ["Weekday", dayName(d)]]; }}
    note="Uses the Umm al-Qura calendar from your browser. Actual start of a month can differ by a day with moon sighting." />
);
const BirthdayCountdown = () => (
  <Calc fields={[{ k: "b", label: "Date of birth", def: "2000-06-15", type: "date" }]}
    compute={(v) => { const b = new Date(v.b + "T12:00:00"); if (isNaN(+b)) return "Pick your birth date."; const n = new Date(); n.setHours(12, 0, 0, 0); let nx = new Date(n.getFullYear(), b.getMonth(), b.getDate(), 12); if (+nx < +n) nx = new Date(n.getFullYear() + 1, b.getMonth(), b.getDate(), 12); const age = nx.getFullYear() - b.getFullYear(); return [["Days to next birthday", String(Math.round((+nx - +n) / 86400000))], ["Turning", String(age)], ["Falls on", dayName(nx)], ["Days lived so far", String(Math.floor((+n - +b) / 86400000))]]; }} />
);

/* ---------------- Education / math ---------------- */
const GRADE_PTS: Record<string, number> = { "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, "D-": 0.7, F: 0 };
const Gpa = () => <ToolCardText />;
function ToolCardText() {
  const [t, setT] = useState("A 3\nB+ 4\nA- 3\nC 2");
  const res = useMemo(() => { let pts = 0, cr = 0; for (const l of t.split("\n")) { const [g, c] = l.trim().split(/\s+/); const p = GRADE_PTS[(g ?? "").toUpperCase()], k = parseFloat(c); if (p === undefined || !Number.isFinite(k)) continue; pts += p * k; cr += k; } return cr ? { gpa: pts / cr, cr } : null; }, [t]);
  return (
    <ToolCard>
      <Field label="One course per line: grade then credits (example: A- 3)"><TextArea rows={8} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-6 flex justify-center gap-3"><StatBadge label="GPA (4.0 scale)" value={res ? num(res.gpa, 2) : "-"} /><StatBadge label="Total credits" value={res ? res.cr : "-"} /></div>
      <div className="mt-3 text-xs text-text-muted">Grades: A+ A A- B+ B B- C+ C C- D+ D D- F (A+ counts as 4.0).</div>
    </ToolCard>
  );
}
const GradeNeeded = () => (
  <Calc fields={[{ k: "c", label: "Current grade (%)", def: "82" }, { k: "w", label: "Final exam weight (%)", def: "30" }, { k: "d", label: "Grade you want (%)", def: "85" }]}
    compute={(v) => { const w = N(v.w) / 100, need = (N(v.d) - N(v.c) * (1 - w)) / w; if (!(w > 0 && w <= 1)) return "Weight must be between 0 and 100."; return [["You need on the final", pct(need, 1)], ["Possible?", need > 100 ? "Above 100%: needs extra credit" : need < 0 ? "You already reached it" : "Yes"]]; }} />
);
const Quadratic = () => (
  <Calc fields={[{ k: "a", label: "a", def: "1" }, { k: "b", label: "b", def: "-3" }, { k: "c", label: "c", def: "2" }]}
    compute={(v) => { const a = N(v.a), b = N(v.b), c = N(v.c); if (a === 0) return "a cannot be zero. Then it is a linear equation."; const D = b * b - 4 * a * c; const rows: Row[] = [["Discriminant", num(D, 6)]]; if (D >= 0) { rows.push(["x1", num((-b + Math.sqrt(D)) / (2 * a), 6)], ["x2", num((-b - Math.sqrt(D)) / (2 * a), 6)]); } else { const re = num(-b / (2 * a), 6), im = num(Math.sqrt(-D) / (2 * Math.abs(a)), 6); rows.push(["x1", `${re} + ${im}i`], ["x2", `${re} - ${im}i`]); } rows.push(["Vertex", `(${num(-b / (2 * a), 4)}, ${num(c - (b * b) / (4 * a), 4)})`]); return rows; }}
    note="Solves ax² + bx + c = 0." />
);
const Prime = () => (
  <Calc fields={[{ k: "n", label: "Number", def: "97", type: "number" }]}
    compute={(v) => { const n = Math.trunc(N(v.n)); if (!(n >= 2) || n > 1e12) return "Enter a whole number from 2 to 1,000,000,000,000."; const f: number[] = []; let m = n; for (let d = 2; d * d <= m; d++) while (m % d === 0) { f.push(d); m /= d; } if (m > 1) f.push(m); const prime = f.length === 1; return [[`${n}`, prime ? "Prime" : "Not prime"], ["Prime factors", prime ? String(n) : f.join(" x ")], ["Next prime", String(nextPrime(n))]]; }} />
);
function nextPrime(n: number) { let x = n + 1; for (;;) { let ok = x >= 2; for (let d = 2; d * d <= x; d++) if (x % d === 0) { ok = false; break; } if (ok) return x; x++; } }
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
const GcdLcm = () => (
  <Calc fields={[{ k: "l", label: "Numbers (comma or space separated)", def: "12, 18, 30", type: "text" }]}
    compute={(v) => { const xs = v.l.split(/[\s,;]+/).map(Number).filter((x) => Number.isInteger(x) && x > 0); if (xs.length < 2) return "Enter at least two positive whole numbers."; const g = xs.reduce(gcd); const l = xs.reduce((a, b) => (a / gcd(a, b)) * b); return [["GCD (HCF)", String(g)], ["LCM", String(l)]]; }} />
);
const Factorial = () => (
  <Calc fields={[{ k: "n", label: "n (0 to 1000)", def: "10", type: "number" }]}
    compute={(v) => { const n = Math.trunc(N(v.n)); if (!(n >= 0 && n <= 1000)) return "Enter a whole number from 0 to 1000."; let f = BigInt(1); for (let i = 2; i <= n; i++) f *= BigInt(i); const s = f.toString(); return [[`${n}!`, s.length > 60 ? s.slice(0, 30) + "..." + s.slice(-10) : s], ["Digits", String(s.length)], ["Scientific", s.length > 1 ? `${s[0]}.${s.slice(1, 6)} x 10^${s.length - 1}` : s]]; }} />
);
const Pythag = () => (
  <Calc fields={[{ k: "m", label: "Find", def: "c", options: [["c", "Hypotenuse c"], ["a", "Leg a"]] }, { k: "a", label: "a", def: "3" }, { k: "b", label: "b", def: "4" }, { k: "c", label: "c (when finding a leg)", def: "5" }]}
    compute={(v) => { const a = N(v.a), b = N(v.b), c = N(v.c); if (v.m === "c") { const h = Math.hypot(a, b); return [["Hypotenuse c", num(h, 6)], ["Area", num((a * b) / 2, 4)], ["Perimeter", num(a + b + h, 4)]]; } if (!(c > b)) return "c must be larger than b."; const l = Math.sqrt(c * c - b * b); return [["Leg a", num(l, 6)], ["Area", num((l * b) / 2, 4)]]; }} />
);
const Circle = () => (
  <Calc fields={[{ k: "r", label: "Radius", def: "5" }]}
    compute={(v) => { const r = N(v.r); if (!(r >= 0)) return "Radius must be positive."; return [["Diameter", num(2 * r, 4)], ["Circumference", num(2 * Math.PI * r, 4)], ["Area", num(Math.PI * r * r, 4)]]; }} />
);
const Ratio = () => (
  <Calc fields={[{ k: "a", label: "A", def: "3" }, { k: "b", label: "B", def: "4" }, { k: "c", label: "C", def: "9" }]}
    compute={(v) => { const a = N(v.a), b = N(v.b), c = N(v.c); if (a === 0) return "A cannot be zero."; const g = gcd(Math.round(a), Math.round(b)) || 1; return [["A : B = C : D, D =", num((b * c) / a, 6)], ["Simplified A : B", `${Math.round(a) / g} : ${Math.round(b) / g}`]]; }}
    note="Solves A / B = C / D for D." />
);
const SciNotation = () => (
  <TextXform rows={3} placeholder="123456 or 0.00042" fn={(s) => { const x = Number(s.replace(/,/g, "")); if (!Number.isFinite(x)) return "Enter a number."; if (x === 0) return "0 x 10^0"; const e = Math.floor(Math.log10(Math.abs(x))); const m = x / Math.pow(10, e); const ee = Math.floor(e / 3) * 3; return `Scientific: ${Number(m.toPrecision(10))} x 10^${e}\nE notation: ${x.toExponential()}\nEngineering: ${Number((x / Math.pow(10, ee)).toPrecision(10))} x 10^${ee}`; }} />
);

/* ---------------- Fun ---------------- */
const RandomColor = () => {
  const mk = () => Array.from({ length: 5 }, () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0").toUpperCase());
  const [c, setC] = useState<string[]>(mk());
  return (
    <ToolCard>
      <div className="grid grid-cols-5 overflow-hidden rounded-xl">{c.map((x) => <div key={x} style={{ background: x }} className="h-32" />)}</div>
      <div className="mt-3 grid grid-cols-5 gap-1 text-center text-xs font-mono">{c.map((x) => <span key={x}>{x}</span>)}</div>
      <div className="mt-4 flex gap-3"><Button onClick={() => setC(mk())}>Generate new colors</Button><CopyButton getText={() => c.join(", ")} label="Copy hex codes" /></div>
    </ToolCard>
  );
};
const YesNo = () => {
  const [r, setR] = useState("");
  return (
    <ToolCard>
      <div className="text-center text-5xl font-extrabold text-primary-500">{r || "?"}</div>
      <div className="mt-6 flex justify-center"><Button onClick={() => setR(["Yes", "No"][crypto.getRandomValues(new Uint8Array(1))[0] % 2])}>Decide for me</Button></div>
    </ToolCard>
  );
};

export const WAVE1: Record<string, () => ReactNode> = {
  "profit-margin-calculator": () => <ProfitMargin />, "markup-calculator": () => <Markup />, "break-even-calculator": () => <BreakEven />, "inflation-calculator": () => <Inflation />,
  "savings-goal-calculator": () => <SavingsGoal />, "rule-of-72-calculator": () => <Rule72 />, "salary-raise-calculator": () => <SalaryRaise />, "credit-card-payoff-calculator": () => <CardPayoff />,
  "down-payment-calculator": () => <DownPayment />, "retirement-savings-calculator": () => <Retirement />, "unit-price-calculator": () => <UnitPrice />, "sales-commission-calculator": () => <Commission />,
  "body-fat-calculator": () => <BodyFat />, "water-intake-calculator": () => <Water />, "one-rep-max-calculator": () => <OneRm />, "macro-calculator": () => <Macros />,
  "running-pace-calculator": () => <RunPace />, "heart-rate-zone-calculator": () => <HeartZones />, "waist-to-hip-ratio-calculator": () => <Whr />, "protein-intake-calculator": () => <Protein />,
  "day-of-week-calculator": () => <DayOfWeek />, "week-number-calculator": () => <WeekNumber />, "business-days-calculator": () => <BusinessDays />, "leap-year-checker": () => <LeapYear />,
  "gregorian-to-hijri-converter": () => <Hijri />, "birthday-countdown": () => <BirthdayCountdown />,
  "gpa-calculator": () => <Gpa />, "final-grade-calculator": () => <GradeNeeded />, "quadratic-equation-solver": () => <Quadratic />, "prime-number-checker": () => <Prime />,
  "gcd-lcm-calculator": () => <GcdLcm />, "factorial-calculator": () => <Factorial />, "pythagorean-theorem-calculator": () => <Pythag />, "circle-calculator": () => <Circle />,
  "ratio-calculator": () => <Ratio />, "scientific-notation-converter": () => <SciNotation />,
  "random-color-generator": () => <RandomColor />, "yes-or-no-picker": () => <YesNo />,
};
