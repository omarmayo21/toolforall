"use client";

import { useMemo, useState } from "react";
import { Alert, Button, CopyButton, Field, OutputBox, Select, TextInput, ToolCard } from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* ---------------- Password Generator ---------------- */
export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  function generate() {
    const sets = [
      upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
      lower ? "abcdefghijklmnopqrstuvwxyz" : "",
      numbers ? "0123456789" : "",
      symbols ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "",
    ].filter(Boolean);
    const all = sets.join("");
    if (!all) return;
    const result: string[] = [];
    for (let n = 0; n < 5; n++) {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      let pw = Array.from(arr, (v) => all[v % all.length]).join("");
      result.push(pw);
    }
    setPasswords(result);
  }

  function strength(pw: string) {
    let score = 0;
    if (pw.length >= 12) score++;
    if (pw.length >= 16) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return ["Weak", "Fair", "Good", "Strong", "Very Strong", "Excellent"][score];
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`Length: ${length}`}><input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full" /></Field>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> Uppercase</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> Lowercase</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> Numbers</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Symbols</label>
        </div>
      </div>
      <div className="mt-4"><Button onClick={generate}>Generate Passwords</Button></div>
      {passwords.length > 0 ? (
        <div className="mt-4 space-y-2">
          {passwords.map((p, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm dark:bg-slate-800">
              <span>{p}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{strength(p)}</span>
                <CopyButton getText={() => p} label="" />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Password Strength Checker ---------------- */
export function PasswordStrengthChecker() {
  const [pw, setPw] = useState("");
  const common = ["password", "123456", "qwerty", "letmein", "admin", "welcome", "iloveyou", "abc123", "111111", "password123"];

  const analysis = useMemo(() => {
    if (!pw) return null;
    let score = 0;
    const feedback: string[] = [];
    if (pw.length >= 8) score++; else feedback.push("Use at least 8 characters (12+ recommended).");
    if (pw.length >= 12) score++;
    if (pw.length >= 16) score++;
    if (/[A-Z]/.test(pw)) score++; else feedback.push("Add an uppercase letter.");
    if (/[a-z]/.test(pw)) score++; else feedback.push("Add a lowercase letter.");
    if (/[0-9]/.test(pw)) score++; else feedback.push("Add a number.");
    if (/[^A-Za-z0-9]/.test(pw)) score++; else feedback.push("Add a symbol.");
    if (/(.)\1\1/.test(pw)) { score -= 1; feedback.push("Avoid repeating the same character multiple times."); }
    if (common.some((c) => pw.toLowerCase().includes(c))) { score -= 2; feedback.push("Avoid common words or well-known passwords."); }
    if (/^(?:abc|123|qwe)/i.test(pw)) { score -= 1; feedback.push("Avoid predictable sequences like 'abc' or '123'."); }
    score = Math.max(0, Math.min(7, score));
    const labels = ["Very Weak", "Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong", "Excellent"];
    return { score, label: labels[score], feedback };
  }, [pw]);

  return (
    <ToolCard>
      <Field label="Type a password to test"><TextInput type="text" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
      {analysis ? (
        <div className="mt-4 space-y-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${(analysis.score / 7) * 100}%` }} />
          </div>
          <p className="font-semibold">{analysis.label}</p>
          {analysis.feedback.length ? (
            <ul className="list-inside list-disc text-sm text-slate-600 dark:text-slate-400">
              {analysis.feedback.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          ) : <Alert type="success">This password looks strong on all basic checks.</Alert>}
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Htpasswd Generator ---------------- */
function to64(v: number, n: number) {
  const itoa64 = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let s = "";
  let val = v;
  while (n-- > 0) {
    s += itoa64.charAt(val & 0x3f);
    val >>= 6;
  }
  return s;
}
function apr1InternalMd5(CryptoJS: any, str: string) {
  return CryptoJS.MD5(CryptoJS.enc.Latin1.parse(str)).toString(CryptoJS.enc.Latin1);
}
async function apr1(password: string, salt: string) {
  const { default: CryptoJS } = await import("crypto-js");
  const magic = "$apr1$";
  let ctx = password + magic + salt;
  let final = apr1InternalMd5(CryptoJS, password + salt + password);
  for (let pl = password.length; pl > 0; pl -= 16) {
    ctx += final.substring(0, pl > 16 ? 16 : pl);
  }
  for (let i = password.length; i; i >>= 1) {
    ctx += i & 1 ? String.fromCharCode(0) : password.charAt(0);
  }
  final = apr1InternalMd5(CryptoJS, ctx);
  for (let i = 0; i < 1000; i++) {
    let ctx1 = i & 1 ? password : final;
    if (i % 3) ctx1 += salt;
    if (i % 7) ctx1 += password;
    ctx1 += i & 1 ? final : password;
    final = apr1InternalMd5(CryptoJS, ctx1);
  }
  const c = (idx: number) => final.charCodeAt(idx);
  let result = "";
  result += to64((c(0) << 16) | (c(6) << 8) | c(12), 4);
  result += to64((c(1) << 16) | (c(7) << 8) | c(13), 4);
  result += to64((c(2) << 16) | (c(8) << 8) | c(14), 4);
  result += to64((c(3) << 16) | (c(9) << 8) | c(15), 4);
  result += to64((c(4) << 16) | (c(10) << 8) | c(5), 4);
  result += to64(c(11), 2);
  return `${magic}${salt}$${result}`;
}
function randomSalt(len: number) {
  const chars = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => chars[v % chars.length]).join("");
}

export function HtpasswdGenerator() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("changeme123");
  const [format, setFormat] = useState<"bcrypt" | "apr1" | "sha1">("bcrypt");
  const [result, setResult] = useState("");

  async function generate() {
    if (format === "bcrypt") {
      const { default: bcrypt } = await import("bcryptjs");
      const hash = bcrypt.hashSync(password, 10);
      setResult(`${username}:${hash}`);
    } else if (format === "apr1") {
      const hash = await apr1(password, randomSalt(8));
      setResult(`${username}:${hash}`);
    } else {
      const { default: CryptoJS } = await import("crypto-js");
      const hash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64);
      setResult(`${username}:{SHA}${hash}`);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Username"><TextInput value={username} onChange={(e) => setUsername(e.target.value)} /></Field>
        <Field label="Password"><TextInput value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <Field label="Hash format">
          <Select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="bcrypt">bcrypt (recommended)</option>
            <option value="apr1">MD5 (apr1, Apache legacy)</option>
            <option value="sha1">SHA-1 (legacy)</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4"><Button onClick={generate}>Generate htpasswd entry</Button></div>
      {result ? (
        <div className="mt-4">
          <OutputBox value={result} rows={2} />
          <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Bcrypt Tool ---------------- */
export function BcryptTool() {
  const [mode, setMode] = useState<"hash" | "verify">("hash");
  const [password, setPassword] = useState("correcthorsebattery");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function doHash() {
    setBusy(true);
    import("bcryptjs").then(({ default: bcrypt }) => {
      setHash(bcrypt.hashSync(password, rounds));
      setBusy(false);
    });
  }

  function doVerify() {
    setBusy(true);
    import("bcryptjs").then(({ default: bcrypt }) => {
      try {
        setResult(bcrypt.compareSync(password, verifyHash) ? "✅ Match — this password matches the hash." : "❌ No match — this password does not match the hash.");
      } catch {
        setResult("❌ Invalid bcrypt hash format.");
      }
      setBusy(false);
    });
  }

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === "hash" ? "primary" : "ghost"} onClick={() => setMode("hash")}>Hash</Button>
        <Button variant={mode === "verify" ? "primary" : "ghost"} onClick={() => setMode("verify")}>Verify</Button>
      </div>
      <Field label="Password"><TextInput value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      {mode === "hash" ? (
        <>
          <div className="mt-4"><Field label={`Cost factor (rounds): ${rounds}`}><input type="range" min={4} max={14} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className="w-full" /></Field></div>
          <div className="mt-4"><Button onClick={doHash} disabled={busy}>{busy ? "Hashing…" : "Generate bcrypt hash"}</Button></div>
          {hash ? (
            <div className="mt-4">
              <OutputBox value={hash} rows={2} />
              <div className="mt-2 flex gap-2"><CopyButton getText={() => hash} /></div>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="mt-4"><Field label="Bcrypt hash to verify against"><TextInput value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} placeholder="$2b$10$..." /></Field></div>
          <div className="mt-4"><Button onClick={doVerify} disabled={busy}>{busy ? "Checking…" : "Verify"}</Button></div>
          {result ? <div className="mt-4"><Alert type={result.startsWith("✅") ? "success" : "error"}>{result}</Alert></div> : null}
        </>
      )}
    </ToolCard>
  );
}

export const securityComponents: ComponentRegistry = {
  PasswordGenerator,
  PasswordStrengthChecker,
  HtpasswdGenerator,
  BcryptTool,
};
