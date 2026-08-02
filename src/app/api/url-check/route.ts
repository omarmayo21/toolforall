import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
function checkRateLimit(ip: string, limit = 10, windowMs = 60000) {
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

interface Hop {
  url: string;
  status: number;
  statusText: string;
}

function isPrivateIP(hostname: string) {
  if (hostname === "localhost" || hostname === "::1" || hostname === "127.0.0.1") return true;
  return /^(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|169\.254\.\d+\.\d+)$/.test(hostname);
}

async function followRedirects(startUrl: string, maxHops = 10) {
  const hops: Hop[] = [];
  let current = startUrl;
  for (let i = 0; i < maxHops; i++) {
    try {
      const parsed = new URL(current);
      if (isPrivateIP(parsed.hostname)) {
        return { hops, error: "Access to internal networks is not permitted.", timeMs: 0 };
      }
    } catch {
       return { hops, error: "Invalid URL encountered in redirect chain.", timeMs: 0 };
    }

    let res: Response;
    const started = Date.now();
    try {
      res = await fetch(current, { method: "GET", redirect: "manual", headers: { "User-Agent": "ToolForAllBot/1.0" } });
    } catch {
      return { hops, error: "Could not reach this URL. Check that it's correct and publicly accessible.", timeMs: Date.now() - started };
    }
    hops.push({ url: current, status: res.status, statusText: res.statusText || "" });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current).toString();
      continue;
    }
    break;
  }
  return { hops, error: null };
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = `https://${normalized}`;
  try {
    const parsed = new URL(normalized);
    if (isPrivateIP(parsed.hostname)) {
      return NextResponse.json({ error: "Access to internal networks is not permitted." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  const started = Date.now();
  const { hops, error } = await followRedirects(normalized);
  const timeMs = Date.now() - started;
  if (error) return NextResponse.json({ error, hops, timeMs }, { status: 200 });
  return NextResponse.json({ hops, timeMs, error: null });
}
