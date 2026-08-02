import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
function checkRateLimit(ip: string, limit = 30, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }
  record.count++;
  rateLimitMap.set(ip, record);
  return record.count <= limit;
}

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, EGP: 48.5, SAR: 3.75, AED: 3.67,
  CAD: 1.36, AUD: 1.52, CNY: 7.24, INR: 83.3, CHF: 0.88,
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const from = (req.nextUrl.searchParams.get("from") || "USD").toUpperCase();
  const to = (req.nextUrl.searchParams.get("to") || "EUR").toUpperCase();

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const rate = data?.rates?.[to];
      if (typeof rate === "number") return NextResponse.json({ rate, source: "frankfurter" });
    }
  } catch {
    // fall through to fallback rates
  }

  if (FALLBACK_RATES[from] && FALLBACK_RATES[to]) {
    const rate = FALLBACK_RATES[to] / FALLBACK_RATES[from];
    return NextResponse.json({ rate, source: "fallback" });
  }

  return NextResponse.json({ error: "Exchange rate unavailable for this currency pair." }, { status: 200 });
}
