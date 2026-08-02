"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Field, Select, StatBadge, TextInput, ToolCard, Alert } from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* ---------------- Percentage Calculator ---------------- */
export function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState(20);
  const [b, setB] = useState(150);

  const result = useMemo(() => {
    if (mode === "of") return (a / 100) * b;
    if (mode === "isWhat") return b !== 0 ? (a / b) * 100 : 0;
    return b !== 0 ? ((b - a) / a) * 100 : 0;
  }, [mode, a, b]);

  return (
    <ToolCard>
      <Field label="Calculation type">
        <Select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="of">What is X% of Y?</option>
          <option value="isWhat">X is what percent of Y?</option>
          <option value="change">Percentage change from X to Y</option>
        </Select>
      </Field>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Field label={mode === "change" ? "From (X)" : mode === "of" ? "X (%)" : "X"}><TextInput type="number" value={a} onChange={(e) => setA(Number(e.target.value))} /></Field>
        <Field label={mode === "change" ? "To (Y)" : "Y"}><TextInput type="number" value={b} onChange={(e) => setB(Number(e.target.value))} /></Field>
      </div>
      <div className="mt-6 flex justify-center">
        <StatBadge label="Result" value={mode === "of" ? result.toFixed(2) : `${result.toFixed(2)}%`} />
      </div>
    </ToolCard>
  );
}

/* ---------------- Unit Converter ---------------- */
const UNITS = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, t: 1000, lb: 0.453592, oz: 0.0283495 },
  speed: { "km/h": 1, "m/s": 3.6, mph: 1.60934, knot: 1.852 },
};

export function UnitConverter() {
  const [category, setCategory] = useState<"length" | "weight" | "speed" | "temperature">("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState(1);

  useEffect(() => {
    if (category === "temperature") { setFrom("c"); setTo("f"); }
    else { const keys = Object.keys(UNITS[category]); setFrom(keys[0]); setTo(keys[1]); }
  }, [category]);

  const result = useMemo(() => {
    if (category === "temperature") {
      let celsius = value;
      if (from === "f") celsius = ((value - 32) * 5) / 9;
      if (from === "k") celsius = value - 273.15;
      if (to === "c") return celsius;
      if (to === "f") return (celsius * 9) / 5 + 32;
      return celsius + 273.15;
    }
    const units = UNITS[category] as Record<string, number>;
    return (value * units[from]) / units[to];
  }, [category, from, to, value]);

  const unitKeys = category === "temperature" ? ["c", "f", "k"] : Object.keys(UNITS[category]);

  return (
    <ToolCard>
      <Field label="Category">
        <Select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="speed">Speed</option>
          <option value="temperature">Temperature</option>
        </Select>
      </Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Value"><TextInput type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></Field>
        <Field label="From">
          <Select value={from} onChange={(e) => setFrom(e.target.value)}>{unitKeys.map((u) => <option key={u} value={u}>{u}</option>)}</Select>
        </Field>
        <Field label="To">
          <Select value={to} onChange={(e) => setTo(e.target.value)}>{unitKeys.map((u) => <option key={u} value={u}>{u}</option>)}</Select>
        </Field>
      </div>
      <div className="mt-6 flex justify-center">
        <StatBadge label={`${value} ${from} =`} value={`${result.toFixed(4).replace(/\.?0+$/, "")} ${to}`} />
      </div>
    </ToolCard>
  );
}

/* ---------------- Currency Converter ---------------- */
export function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const currencies = ["USD", "EUR", "GBP", "JPY", "EGP", "SAR", "AED", "CAD", "AUD", "CNY", "INR", "CHF"];

  async function fetchRate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/currency?from=${from}&to=${to}`);
      const data = await res.json();
      if (data.rate) setRate(data.rate);
      else setError(data.error || "Could not fetch exchange rate.");
    } catch {
      setError("Could not fetch exchange rate.");
    }
    setLoading(false);
  }

  useEffect(() => { fetchRate(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [from, to]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Amount"><TextInput type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
        <Field label="From">
          <Select value={from} onChange={(e) => setFrom(e.target.value)}>{currencies.map((c) => <option key={c}>{c}</option>)}</Select>
        </Field>
        <Field label="To">
          <Select value={to} onChange={(e) => setTo(e.target.value)}>{currencies.map((c) => <option key={c}>{c}</option>)}</Select>
        </Field>
      </div>
      <div className="mt-2 flex justify-center">
        <Button variant="ghost" onClick={() => { const t = from; setFrom(to); setTo(t); }}>⇅ Swap</Button>
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {rate !== null ? (
        <div className="mt-4 flex flex-col items-center gap-2">
          <StatBadge label={`${amount} ${from} =`} value={`${(amount * rate).toFixed(2)} ${to}`} />
          <p className="text-xs text-slate-500">1 {from} = {rate.toFixed(4)} {to} {loading ? "(updating…)" : ""}</p>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- BMI Calculator ---------------- */
export function BmiCalculator() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(65);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(7);
  const [weightLb, setWeightLb] = useState(143);

  const bmi = useMemo(() => {
    if (units === "metric") return weightKg / (heightCm / 100) ** 2;
    const totalIn = heightFt * 12 + heightIn;
    return (weightLb / totalIn ** 2) * 703;
  }, [units, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={units === "metric" ? "primary" : "ghost"} onClick={() => setUnits("metric")}>Metric</Button>
        <Button variant={units === "imperial" ? "primary" : "ghost"} onClick={() => setUnits("imperial")}>Imperial</Button>
      </div>
      {units === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Height (cm)"><TextInput type="number" value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} /></Field>
          <Field label="Weight (kg)"><TextInput type="number" value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} /></Field>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Height (ft)"><TextInput type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} /></Field>
          <Field label="Height (in)"><TextInput type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} /></Field>
          <Field label="Weight (lb)"><TextInput type="number" value={weightLb} onChange={(e) => setWeightLb(Number(e.target.value))} /></Field>
        </div>
      )}
      <div className="mt-6 flex flex-col items-center gap-2">
        <StatBadge label="Your BMI" value={bmi.toFixed(1)} />
        <p className="font-semibold">{category}</p>
      </div>
      <div className="mt-3"><Alert type="info">BMI is a general screening tool, not an individual diagnosis. Consult a healthcare provider for personalized advice.</Alert></div>
    </ToolCard>
  );
}

/* ---------------- Age Calculator ---------------- */
export function AgeCalculator() {
  const [birth, setBirth] = useState("1990-03-15");
  const [asOf, setAsOf] = useState(new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    const start = new Date(birth);
    const end = new Date(asOf);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return null;
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((end.getTime() - start.getTime()) / 86400000);
    return { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7) };
  }, [birth, asOf]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Birth date (or start date)"><TextInput type="date" value={birth} onChange={(e) => setBirth(e.target.value)} /></Field>
        <Field label="As of date"><TextInput type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} /></Field>
      </div>
      {result ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBadge label="Years" value={result.years} />
          <StatBadge label="Months" value={result.months} />
          <StatBadge label="Days" value={result.days} />
          <StatBadge label="Total days" value={result.totalDays} />
        </div>
      ) : <Alert type="error">Please enter a valid date range.</Alert>}
    </ToolCard>
  );
}

/* ---------------- Aspect Ratio Calculator ---------------- */
export function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState(16);
  const [ratioH, setRatioH] = useState(9);
  const [width, setWidth] = useState(1920);

  const height = Math.round((width * ratioH) / ratioW);

  const [dimW, setDimW] = useState(2560);
  const [dimH, setDimH] = useState(1440);
  function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
  const g = gcd(dimW, dimH) || 1;

  return (
    <ToolCard>
      <p className="mb-2 text-sm font-semibold">Calculate dimension from ratio</p>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Ratio width"><TextInput type="number" value={ratioW} onChange={(e) => setRatioW(Number(e.target.value))} /></Field>
        <Field label="Ratio height"><TextInput type="number" value={ratioH} onChange={(e) => setRatioH(Number(e.target.value))} /></Field>
        <Field label="Known width (px)"><TextInput type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} /></Field>
      </div>
      <div className="mt-3 flex justify-center"><StatBadge label="Matching height" value={`${height}px`} /></div>

      <p className="mb-2 mt-8 text-sm font-semibold">Find ratio from dimensions</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Width"><TextInput type="number" value={dimW} onChange={(e) => setDimW(Number(e.target.value))} /></Field>
        <Field label="Height"><TextInput type="number" value={dimH} onChange={(e) => setDimH(Number(e.target.value))} /></Field>
      </div>
      <div className="mt-3 flex justify-center"><StatBadge label="Simplified ratio" value={`${dimW / g}:${dimH / g}`} /></div>
    </ToolCard>
  );
}

/* ---------------- PX to REM ---------------- */
export function PxRemConverter() {
  const [base, setBase] = useState(16);
  const [px, setPx] = useState(24);
  const [rem, setRem] = useState(1.5);

  return (
    <ToolCard>
      <Field label="Root font size (px)"><TextInput type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} /></Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Pixels (px)"><TextInput type="number" value={px} onChange={(e) => { setPx(Number(e.target.value)); setRem(Number(e.target.value) / base); }} /></Field>
        <Field label="Rem"><TextInput type="number" step="0.01" value={rem} onChange={(e) => { setRem(Number(e.target.value)); setPx(Number(e.target.value) * base); }} /></Field>
      </div>
      <div className="mt-4 flex justify-center"><StatBadge label="Equivalent" value={`${px}px = ${(px / base).toFixed(3).replace(/\.?0+$/, "")}rem`} /></div>
    </ToolCard>
  );
}

/* ---------------- Discount Calculator ---------------- */
export function DiscountCalculator() {
  const [mode, setMode] = useState<"discount" | "reverse">("discount");
  const [original, setOriginal] = useState(120);
  const [percent, setPercent] = useState(25);
  const [salePrice, setSalePrice] = useState(90);

  const discountAmount = (original * percent) / 100;
  const finalPrice = original - discountAmount;
  const reversePercent = original !== 0 ? ((original - salePrice) / original) * 100 : 0;

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === "discount" ? "primary" : "ghost"} onClick={() => setMode("discount")}>Calculate sale price</Button>
        <Button variant={mode === "reverse" ? "primary" : "ghost"} onClick={() => setMode("reverse")}>Find discount %</Button>
      </div>
      {mode === "discount" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Original price"><TextInput type="number" value={original} onChange={(e) => setOriginal(Number(e.target.value))} /></Field>
            <Field label="Discount (%)"><TextInput type="number" value={percent} onChange={(e) => setPercent(Number(e.target.value))} /></Field>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatBadge label="You save" value={discountAmount.toFixed(2)} />
            <StatBadge label="Final price" value={finalPrice.toFixed(2)} />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Original price"><TextInput type="number" value={original} onChange={(e) => setOriginal(Number(e.target.value))} /></Field>
            <Field label="Sale price"><TextInput type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} /></Field>
          </div>
          <div className="mt-4 flex justify-center"><StatBadge label="Discount applied" value={`${reversePercent.toFixed(1)}%`} /></div>
        </>
      )}
    </ToolCard>
  );
}

/* ---------------- CPM Calculator ---------------- */
export function CpmCalculator() {
  const [mode, setMode] = useState<"revenue" | "impressions">("revenue");
  const [impressions, setImpressions] = useState(500000);
  const [cpm, setCpm] = useState(4);
  const [targetRevenue, setTargetRevenue] = useState(1000);

  const revenue = (impressions / 1000) * cpm;
  const neededImpressions = cpm !== 0 ? (targetRevenue / cpm) * 1000 : 0;

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === "revenue" ? "primary" : "ghost"} onClick={() => setMode("revenue")}>Revenue from impressions</Button>
        <Button variant={mode === "impressions" ? "primary" : "ghost"} onClick={() => setMode("impressions")}>Impressions for target revenue</Button>
      </div>
      {mode === "revenue" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Total impressions"><TextInput type="number" value={impressions} onChange={(e) => setImpressions(Number(e.target.value))} /></Field>
            <Field label="CPM ($)"><TextInput type="number" value={cpm} onChange={(e) => setCpm(Number(e.target.value))} /></Field>
          </div>
          <div className="mt-4 flex justify-center"><StatBadge label="Estimated revenue" value={`$${revenue.toFixed(2)}`} /></div>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target revenue ($)"><TextInput type="number" value={targetRevenue} onChange={(e) => setTargetRevenue(Number(e.target.value))} /></Field>
            <Field label="CPM ($)"><TextInput type="number" value={cpm} onChange={(e) => setCpm(Number(e.target.value))} /></Field>
          </div>
          <div className="mt-4 flex justify-center"><StatBadge label="Impressions needed" value={Math.round(neededImpressions).toLocaleString()} /></div>
        </>
      )}
    </ToolCard>
  );
}

export const mathComponents: ComponentRegistry = {
  PercentageCalculator,
  UnitConverter,
  CurrencyConverter,
  BmiCalculator,
  AgeCalculator,
  AspectRatioCalculator,
  PxRemConverter,
  DiscountCalculator,
  CpmCalculator,
};
