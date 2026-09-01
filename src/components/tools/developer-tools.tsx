"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Button,
  CopyButton,
  DownloadButton,
  Field,
  OutputBox,
  ResultActions,
  Select,
  ShareButton,
  StatBadge,
  TextArea,
  TextInput,
  ToolCard,
  downloadText,
} from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* ---------------- JSON Formatter / Validator ---------------- */
export function JsonFormatter() {
  const [input, setInput] = useState('{\n  "name": "Ana",\n  "age": 29,\n  "skills": ["js", "css"]\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function locate(msg: string, text: string) {
    const m = msg.match(/position (\d+)/);
    if (!m) return "";
    const pos = parseInt(m[1], 10);
    const upto = text.slice(0, pos);
    const line = upto.split("\n").length;
    const col = pos - upto.lastIndexOf("\n");
    return ` (line ${line}, column ${col})`;
  }

  function run(mode: "format" | "minify") {
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "format" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed));
      setError("");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      setError(`Invalid JSON: ${msg}${locate(msg, input)}`);
      setOutput("");
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste JSON">
          <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Field label="Result">
          <OutputBox value={output} rows={14} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => run("format")}>Format JSON</Button>
        <Button variant="secondary" onClick={() => run("minify")}>Minify</Button>
        <CopyButton getText={() => output} />
        <DownloadButton getBlob={() => (output ? { blob: new Blob([output]) } : null)} filename="data.json" />
        <ShareButton title="JSON Formatter" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- JSON to CSV ---------------- */
export function JsonToCsv() {
  const [input, setInput] = useState('[{"name":"Ana","city":"Cairo"},{"name":"Sam","city":"Dubai","vip":true}]');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function convert() {
    try {
      const { default: Papa } = await import("papaparse");
      const parsed = JSON.parse(input);
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const csv = Papa.unparse(arr);
      setOutput(csv);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste JSON array of objects">
          <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Field label="CSV result">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={convert}>Convert to CSV</Button>
        <CopyButton getText={() => output} />
        <DownloadButton getBlob={() => (output ? { blob: new Blob([output], { type: "text/csv" }) } : null)} filename="data.csv" />
        <ShareButton title="JSON to CSV" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- CSV to JSON ---------------- */
export function CsvToJson() {
  const [input, setInput] = useState("name,age,city\nAna,29,Cairo\nSam,34,Dubai");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState("");

  async function convert() {
    const { default: Papa } = await import("papaparse");
    const result = Papa.parse(input.trim(), { header: true, delimiter, dynamicTyping: true, skipEmptyLines: true });
    if (result.errors.length) {
      setError(result.errors[0].message);
      setOutput("");
      return;
    }
    setOutput(JSON.stringify(result.data, null, 2));
    setError("");
  }

  return (
    <ToolCard>
      <div className="mb-4 max-w-xs">
        <Field label="Delimiter">
          <Select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste CSV (with header row)">
          <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Field label="JSON result">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={convert}>Convert to JSON</Button>
        <CopyButton getText={() => output} />
        <DownloadButton getBlob={() => (output ? { blob: new Blob([output], { type: "application/json" }) } : null)} filename="data.json" />
        <ShareButton title="CSV to JSON" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- JSON to XML ---------------- */
function jsonToXmlNode(key: string, value: unknown, indent: string): string {
  if (key.startsWith("@")) return "";
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tag = key.replace(/[^a-zA-Z0-9_-]/g, "_") || "item";
  if (Array.isArray(value)) {
    return value.map((v) => jsonToXmlNode(tag, v, indent)).join("\n");
  }
  if (value === null || value === undefined) {
    return `${indent}<${tag}/>`;
  }
  if (typeof value === "object") {
    const attrs = Object.entries(value as Record<string, unknown>)
      .filter(([k]) => k.startsWith("@"))
      .map(([k, v]) => ` ${k.slice(1)}="${esc(String(v))}"`)
      .join("");
    const children = Object.entries(value as Record<string, unknown>)
      .filter(([k]) => !k.startsWith("@"))
      .map(([k, v]) => jsonToXmlNode(k, v, indent + "  "))
      .join("\n");
    return `${indent}<${tag}${attrs}>\n${children}\n${indent}</${tag}>`;
  }
  return `${indent}<${tag}>${esc(String(value))}</${tag}>`;
}

export function JsonToXml() {
  const [input, setInput] = useState('{"user":{"name":"Ana","tags":["admin","editor"]}}');
  const [root, setRoot] = useState("root");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    try {
      const parsed = JSON.parse(input);
      const body = Object.entries(parsed)
        .map(([k, v]) => jsonToXmlNode(k, v, "  "))
        .join("\n");
      setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n<${root}>\n${body}\n</${root}>`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  return (
    <ToolCard>
      <div className="mb-4 max-w-xs">
        <Field label="Root element name">
          <TextInput value={root} onChange={(e) => setRoot(e.target.value || "root")} />
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste JSON">
          <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Field label="XML result">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={convert}>Convert to XML</Button>
        <CopyButton getText={() => output} />
        <DownloadButton getBlob={() => (output ? { blob: new Blob([output], { type: "application/xml" }) } : null)} filename="data.xml" />
        <ShareButton title="JSON to XML" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- XML to JSON ---------------- */
function xmlNodeToJson(node: Element): unknown {
  const obj: Record<string, unknown> = {};
  for (const attr of Array.from(node.attributes)) {
    obj[`@${attr.name}`] = attr.value;
  }
  const children = Array.from(node.children);
  if (children.length === 0) {
    const text = node.textContent?.trim() || "";
    if (Object.keys(obj).length === 0) return text;
    if (text) obj["#text"] = text;
    return obj;
  }
  for (const child of children) {
    const value = xmlNodeToJson(child);
    if (obj[child.tagName] !== undefined) {
      if (Array.isArray(obj[child.tagName])) (obj[child.tagName] as unknown[]).push(value);
      else obj[child.tagName] = [obj[child.tagName], value];
    } else {
      obj[child.tagName] = value;
    }
  }
  return obj;
}

export function XmlToJson() {
  const [input, setInput] = useState('<user id="1"><name>Ana</name><role>admin</role><role>editor</role></user>');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      const errNode = doc.querySelector("parsererror");
      if (errNode) throw new Error("Malformed XML");
      const root = doc.documentElement;
      const result = { [root.tagName]: xmlNodeToJson(root) };
      setOutput(JSON.stringify(result, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid XML");
      setOutput("");
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste XML">
          <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Field label="JSON result">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={convert}>Convert to JSON</Button>
        <CopyButton getText={() => output} />
        <DownloadButton getBlob={() => (output ? { blob: new Blob([output], { type: "application/json" }) } : null)} filename="data.json" />
        <ShareButton title="XML to JSON" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- Base64 Encode/Decode ---------------- */
export function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, World!");
  const [error, setError] = useState("");

  const output = useMemo(() => {
    try {
      setError("");
      if (mode === "encode") {
        return btoa(unescape(encodeURIComponent(input)));
      }
      const normalized = input.trim().replace(/-/g, "+").replace(/_/g, "/");
      return decodeURIComponent(escape(atob(normalized)));
    } catch {
      setError("Invalid input for this mode.");
      return "";
    }
  }, [input, mode]);

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === "encode" ? "primary" : "ghost"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "primary" : "ghost"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={mode === "encode" ? "Plain text" : "Base64 text"}>
          <TextArea rows={10} value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Field label="Result">
          <OutputBox value={output} rows={10} />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton getText={() => output} />
        <ShareButton title="Base64 Encode/Decode" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- JWT Decoder ---------------- */
function b64urlDecode(str: string) {
  const norm = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return decodeURIComponent(escape(atob(norm)));
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{ header: string; payload: string; exp?: string; expired?: boolean } | null>(null);
  const [error, setError] = useState("");

  function decode() {
    try {
      const parts = token.trim().split(".");
      if (parts.length < 2) throw new Error("Token must have at least a header and payload segment");
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      let exp: string | undefined;
      let expired: boolean | undefined;
      if (payload.exp) {
        const date = new Date(payload.exp * 1000);
        exp = date.toLocaleString();
        expired = date.getTime() < Date.now();
      }
      setResult({ header: JSON.stringify(header, null, 2), payload: JSON.stringify(payload, null, 2), exp, expired });
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JWT");
      setResult(null);
    }
  }

  return (
    <ToolCard>
      <Field label="Paste JWT token">
        <TextArea rows={4} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOi..." />
      </Field>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={decode}>Decode Token</Button>
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {result ? (
        <div className="mt-4 space-y-4">
          {result.exp ? (
            <Alert type={result.expired ? "error" : "success"}>
              Expires: {result.exp} {result.expired ? "(already expired)" : "(still valid)"}
            </Alert>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Header"><OutputBox value={result.header} rows={8} /></Field>
            <Field label="Payload"><OutputBox value={result.payload} rows={8} /></Field>
          </div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- UUID Generator ---------------- */
export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<"lower" | "upper" | "nodash">("lower");
  const [list, setList] = useState<string[]>([]);

  function generate() {
    const arr = Array.from({ length: Math.min(Math.max(count, 1), 1000) }, () => crypto.randomUUID());
    setList(
      arr.map((u) => {
        if (format === "upper") return u.toUpperCase();
        if (format === "nodash") return u.replace(/-/g, "");
        return u;
      })
    );
  }

  const text = list.join("\n");

  return (
    <ToolCard>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Field label="How many?">
          <TextInput type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </Field>
        <Field label="Format">
          <Select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}>
            <option value="lower">Lowercase with dashes</option>
            <option value="upper">Uppercase with dashes</option>
            <option value="nodash">No dashes</option>
          </Select>
        </Field>
        <div className="flex items-end"><Button onClick={generate}>Generate</Button></div>
      </div>
      <OutputBox value={text} rows={10} />
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton getText={() => text} />
        <DownloadButton getBlob={() => (text ? { blob: new Blob([text]) } : null)} filename="uuids.txt" />
        <ShareButton title="UUID Generator" />
      </div>
    </ToolCard>
  );
}

/* ---------------- URL Encode/Decode ---------------- */
export function UrlEncodeDecode() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [scope, setScope] = useState<"component" | "full">("component");
  const [input, setInput] = useState("https://example.com/search?q=coffee & tea");
  const [error, setError] = useState("");

  const output = useMemo(() => {
    try {
      setError("");
      if (mode === "encode") return scope === "component" ? encodeURIComponent(input) : encodeURI(input);
      return scope === "component" ? decodeURIComponent(input) : decodeURI(input);
    } catch {
      setError("Could not process this input — check for invalid percent-encoding.");
      return "";
    }
  }, [input, mode, scope]);

  return (
    <ToolCard>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={mode === "encode" ? "primary" : "ghost"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "primary" : "ghost"} onClick={() => setMode("decode")}>Decode</Button>
        <span className="mx-2 w-px bg-slate-300 dark:bg-slate-700" />
        <Button variant={scope === "component" ? "primary" : "ghost"} onClick={() => setScope("component")}>Component</Button>
        <Button variant={scope === "full" ? "primary" : "ghost"} onClick={() => setScope("full")}>Full URL</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input"><TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Field label="Result"><OutputBox value={output} rows={8} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton getText={() => output} />
        <ShareButton title="URL Encode/Decode" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- HTML Encode/Decode ---------------- */
const HTML_ENTITIES: [RegExp, string][] = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&#39;"],
];

export function HtmlEncodeDecode() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState('<b>Hello & "World"</b>');

  const output = useMemo(() => {
    if (mode === "encode") {
      return HTML_ENTITIES.reduce((acc, [re, rep]) => acc.replace(re, rep), input);
    }
    const el = document.createElement("textarea");
    el.innerHTML = input;
    return el.value;
  }, [input, mode]);

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        <Button variant={mode === "encode" ? "primary" : "ghost"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "primary" : "ghost"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input"><TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Field label="Result"><OutputBox value={output} rows={8} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton getText={() => output} />
        <ShareButton title="HTML Encode/Decode" />
      </div>
    </ToolCard>
  );
}

/* ---------------- SQL Formatter ---------------- */
export function SqlFormatter() {
  const [input, setInput] = useState("select id,name,email from users where active=1 and created_at>'2024-01-01' order by created_at desc");
  const [dialect, setDialect] = useState("sql");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function run() {
    try {
      const { format: sqlFormat } = await import("sql-formatter");
      setOutput(sqlFormat(input, { language: dialect as never, keywordCase: "upper" }));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not format SQL");
    }
  }

  return (
    <ToolCard>
      <div className="mb-4 max-w-xs">
        <Field label="Dialect">
          <Select value={dialect} onChange={(e) => setDialect(e.target.value)}>
            <option value="sql">Standard SQL</option>
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
            <option value="mariadb">MariaDB</option>
            <option value="tsql">SQL Server (T-SQL)</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste SQL"><TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Field label="Formatted SQL"><OutputBox value={output} rows={12} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={run}>Format SQL</Button>
        <CopyButton getText={() => output} />
        <ShareButton title="SQL Formatter" />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- Regex Tester ---------------- */
export function RegexTester() {
  const [pattern, setPattern] = useState("\\b[\\w.-]+@[\\w-]+\\.[a-zA-Z]{2,}\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or support@toolforall.com for help.");
  const [error, setError] = useState("");

  const matches = useMemo(() => {
    try {
      setError("");
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      return Array.from(text.matchAll(re));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regular expression");
      return [];
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!matches.length) return text;
    let result = "";
    let last = 0;
    for (const m of matches) {
      if (m.index === undefined) continue;
      result += text.slice(last, m.index);
      result += `[[${m[0]}]]`;
      last = m.index + m[0].length;
    }
    result += text.slice(last);
    return result;
  }, [matches, text]);

  return (
    <ToolCard>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Field label="Pattern">
          <TextInput value={pattern} onChange={(e) => setPattern(e.target.value)} />
        </Field>
        <Field label="Flags" hint="g, i, m, s">
          <TextInput value={flags} onChange={(e) => setFlags(e.target.value)} />
        </Field>
        <StatBadge label="Matches found" value={matches.length} />
      </div>
      <Field label="Test text">
        <TextArea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : (
        <Field label="Highlighted matches (wrapped in [[ ]])">
          <OutputBox value={highlighted} rows={6} />
        </Field>
      )}
      {matches.length > 0 ? (
        <div className="mt-4 space-y-1 text-sm">
          {matches.slice(0, 20).map((m, i) => (
            <div key={i} className="rounded bg-slate-100 px-2 py-1 font-mono dark:bg-slate-800">
              #{i + 1}: "{m[0]}" at index {m.index}
              {m.length > 1 ? ` — groups: ${JSON.stringify(m.slice(1))}` : ""}
            </div>
          ))}
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Cron Generator ---------------- */
export function CronGenerator() {
  const [type, setType] = useState("daily");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [every, setEvery] = useState("15");
  const [days, setDays] = useState("1-5");
  const [dom, setDom] = useState("1");
  const [reverse, setReverse] = useState("");

  const expr = useMemo(() => {
    if (type === "minutes") return `*/${every} * * * *`;
    if (type === "hours") return `0 */${every} * * *`;
    if (type === "daily") return `${minute} ${hour} * * *`;
    if (type === "weekly") return `${minute} ${hour} * * ${days}`;
    if (type === "monthly") return `${minute} ${hour} ${dom} * *`;
    return "* * * * *";
  }, [type, minute, hour, every, days, dom]);

  function explain(cron: string) {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return "A cron expression needs exactly 5 fields: minute hour day month weekday.";
    const [mi, ho, d, mo, wd] = parts;
    const time = mi === "*" || ho === "*" ? "every minute" : `at ${ho.padStart(2, "0")}:${mi.padStart(2, "0")}`;
    const dayPart = d === "*" ? "" : ` on day ${d} of the month`;
    const monthPart = mo === "*" ? "" : ` in month ${mo}`;
    const wdPart = wd === "*" ? "" : ` on weekday(s) ${wd} (0=Sun..6=Sat)`;
    return `Runs ${time}${dayPart}${monthPart}${wdPart}.`;
  }

  return (
    <ToolCard>
      <div className="mb-4 max-w-xs">
        <Field label="Schedule type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="minutes">Every N minutes</option>
            <option value="hours">Every N hours</option>
            <option value="daily">Daily at a time</option>
            <option value="weekly">Weekly on specific days</option>
            <option value="monthly">Monthly on a date</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {type === "minutes" || type === "hours" ? (
          <Field label={`Every N ${type === "minutes" ? "minutes" : "hours"}`}>
            <TextInput value={every} onChange={(e) => setEvery(e.target.value)} />
          </Field>
        ) : null}
        {(type === "daily" || type === "weekly" || type === "monthly") && (
          <>
            <Field label="Hour (0-23)"><TextInput value={hour} onChange={(e) => setHour(e.target.value)} /></Field>
            <Field label="Minute (0-59)"><TextInput value={minute} onChange={(e) => setMinute(e.target.value)} /></Field>
          </>
        )}
        {type === "weekly" ? (
          <Field label="Days (0=Sun..6=Sat)" hint="e.g. 1-5 for weekdays"><TextInput value={days} onChange={(e) => setDays(e.target.value)} /></Field>
        ) : null}
        {type === "monthly" ? (
          <Field label="Day of month"><TextInput value={dom} onChange={(e) => setDom(e.target.value)} /></Field>
        ) : null}
      </div>
      <div className="mt-4">
        <Field label="Generated cron expression"><OutputBox value={expr} rows={1} /></Field>
      </div>
      <div className="mt-2"><Alert type="info">{explain(expr)}</Alert></div>
      <div className="mt-4 flex flex-wrap gap-2">
        <CopyButton getText={() => expr} />
      </div>
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Field label="Reverse lookup: paste a cron expression to explain it" hint="e.g. 0 9 * * 1-5">
          <TextInput value={reverse} onChange={(e) => setReverse(e.target.value)} />
        </Field>
        {reverse ? <div className="mt-2"><Alert type="info">{explain(reverse)}</Alert></div> : null}
      </div>
    </ToolCard>
  );
}

/* ---------------- HTML/CSS/JS Minifier ---------------- */
function minifyCss(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}
function minifyJs(js: string) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/\n\s*/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}
function minifyHtml(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function CodeMinifier() {
  const [lang, setLang] = useState<"html" | "css" | "js">("css");
  const [input, setInput] = useState("body {\n  color: red; /* main color */\n  margin: 0;\n}\n");
  const [output, setOutput] = useState("");

  function run() {
    const fn = lang === "css" ? minifyCss : lang === "js" ? minifyJs : minifyHtml;
    setOutput(fn(input));
  }

  const saved = input.length ? Math.max(0, Math.round((1 - output.length / input.length) * 100)) : 0;

  return (
    <ToolCard>
      <div className="mb-4 flex gap-2">
        {(["html", "css", "js"] as const).map((l) => (
          <Button key={l} variant={lang === l ? "primary" : "ghost"} onClick={() => setLang(l)}>{l.toUpperCase()}</Button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input"><TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Field label="Minified output"><OutputBox value={output} rows={12} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={run}>Minify</Button>
        <CopyButton getText={() => output} />
        <DownloadButton getBlob={() => (output ? { blob: new Blob([output]) } : null)} filename={`minified.${lang}`} />
        {output ? <StatBadge label="Size reduced" value={`${saved}%`} /> : null}
      </div>
    </ToolCard>
  );
}

/* ---------------- YAML <-> JSON ---------------- */
export function YamlJsonConverter() {
  const [input, setInput] = useState("name: web\nports:\n  - 80\n  - 443\n");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function toJson() {
    try {
      const yaml = await import("js-yaml");
      const obj = yaml.load(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
    }
  }
  async function toYaml() {
    try {
      const yaml = await import("js-yaml");
      const obj = JSON.parse(input);
      setOutput(yaml.dump(obj));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="YAML or JSON input"><TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Field label="Result"><OutputBox value={output} rows={12} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={toJson}>YAML → JSON</Button>
        <Button variant="secondary" onClick={toYaml}>JSON → YAML</Button>
        <CopyButton getText={() => output} />
      </div>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
    </ToolCard>
  );
}

/* ---------------- SHA256 ---------------- */
export function Sha256Generator() {
  const [text, setText] = useState("hello");
  const [hash, setHash] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!text) { setHash(""); return; }
    import("crypto-js").then(({ default: CryptoJS }) => {
      setHash(CryptoJS.SHA256(text).toString());
    });
  }, [text]);

  async function hashFile(f: File) {
    setFileName(f.name);
    const buf = await f.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buf);
    const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
    setFileHash(hex);
  }

  return (
    <ToolCard>
      <Field label="Text input">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="mt-2"><OutputBox value={hash} rows={1} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => hash} /></div>
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Field label="Or hash a file (never uploaded)">
          <input type="file" onChange={(e) => e.target.files?.[0] && hashFile(e.target.files[0])} className="text-sm" />
        </Field>
        {fileHash ? (
          <div className="mt-2">
            <p className="text-sm text-slate-500">{fileName}</p>
            <OutputBox value={fileHash} rows={1} />
            <div className="mt-2"><CopyButton getText={() => fileHash} /></div>
          </div>
        ) : null}
      </div>
    </ToolCard>
  );
}

/* ---------------- MD5 ---------------- */
export function Md5Generator() {
  const [text, setText] = useState("hello");
  const [hash, setHash] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!text) { setHash(""); return; }
    import("crypto-js").then(({ default: CryptoJS }) => {
      setHash(CryptoJS.MD5(text).toString());
    });
  }, [text]);

  async function hashFile(f: File) {
    setFileName(f.name);
    const buf = await f.arrayBuffer();
    const { default: CryptoJS } = await import("crypto-js");
    const wordArray = CryptoJS.lib.WordArray.create(buf as unknown as number[]);
    setFileHash(CryptoJS.MD5(wordArray).toString());
  }

  return (
    <ToolCard>
      <Field label="Text input">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="mt-2"><OutputBox value={hash} rows={1} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => hash} /></div>
      <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Field label="Or hash a file (never uploaded)">
          <input type="file" onChange={(e) => e.target.files?.[0] && hashFile(e.target.files[0])} className="text-sm" />
        </Field>
        {fileHash ? (
          <div className="mt-2">
            <p className="text-sm text-slate-500">{fileName}</p>
            <OutputBox value={fileHash} rows={1} />
            <div className="mt-2"><CopyButton getText={() => fileHash} /></div>
          </div>
        ) : null}
      </div>
    </ToolCard>
  );
}

/* ---------------- Curl to Fetch/Axios ---------------- */
export function CurlConverter() {
  const [curl, setCurl] = useState(`curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"Ana"}'`);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"fetch" | "axios">("fetch");

  function parseCurl(cmd: string) {
    const tokens = cmd.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    let method = "GET";
    let url = "";
    const headers: Record<string, string> = {};
    let data = "";
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i].replace(/^curl\s*/, "");
      if (!t) continue;
      const clean = (s: string) => s.replace(/^["']|["']$/g, "");
      if (t === "-X" || t === "--request") method = clean(tokens[++i]);
      else if (t === "-H" || t === "--header") {
        const h = clean(tokens[++i]);
        const idx = h.indexOf(":");
        if (idx > -1) headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
      } else if (t === "-d" || t === "--data" || t === "--data-raw") {
        data = clean(tokens[++i]);
        if (method === "GET") method = "POST";
      } else if (t === "-u" || t === "--user") {
        headers["Authorization"] = `Basic ${btoa(clean(tokens[++i]))}`;
      } else if (t.startsWith("http")) {
        url = clean(t);
      } else if (!t.startsWith("-") && !url) {
        url = clean(t);
      }
    }
    return { method, url, headers, data };
  }

  function convert() {
    const { method, url, headers, data } = parseCurl(curl);
    let body = "";
    try {
      body = data ? JSON.stringify(JSON.parse(data)) : "";
    } catch {
      body = JSON.stringify(data);
    }
    if (mode === "fetch") {
      const headerLines = Object.entries(headers).map(([k, v]) => `    "${k}": "${v}"`).join(",\n");
      setOutput(
        `fetch("${url}", {\n  method: "${method}",\n${headerLines ? `  headers: {\n${headerLines}\n  },\n` : ""}${
          data ? `  body: JSON.stringify(${body || "{}"}),\n` : ""
        }})\n  .then((res) => res.json())\n  .then((json) => console.log(json));`
      );
    } else {
      const headerLines = Object.entries(headers).map(([k, v]) => `    "${k}": "${v}"`).join(",\n");
      setOutput(
        `axios({\n  method: "${method.toLowerCase()}",\n  url: "${url}",\n${headerLines ? `  headers: {\n${headerLines}\n  },\n` : ""}${
          data ? `  data: ${body || "{}"},\n` : ""
        }}).then((res) => console.log(res.data));`
      );
    }
  }

  return (
    <ToolCard>
      <Field label="Paste a curl command">
        <TextArea rows={5} value={curl} onChange={(e) => setCurl(e.target.value)} />
      </Field>
      <div className="my-4 flex gap-2">
        <Button variant={mode === "fetch" ? "primary" : "ghost"} onClick={() => setMode("fetch")}>fetch()</Button>
        <Button variant={mode === "axios" ? "primary" : "ghost"} onClick={() => setMode("axios")}>Axios</Button>
      </div>
      <div className="flex flex-wrap gap-2"><Button onClick={convert}>Convert</Button></div>
      {output ? (
        <div className="mt-4">
          <OutputBox value={output} rows={10} />
          <div className="mt-2 flex gap-2"><CopyButton getText={() => output} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- GraphQL Formatter ---------------- */
export function GraphqlFormatter() {
  const [input, setInput] = useState("query{user(id:1){name email posts{title comments{text}}}}");
  const [output, setOutput] = useState("");

  function format() {
    let result = "";
    let indent = 0;
    let i = 0;
    const push = (s: string) => (result += s);
    while (i < input.length) {
      const c = input[i];
      if (c === "{") {
        push("{\n");
        indent++;
        push("  ".repeat(indent));
        i++;
        while (input[i] === " ") i++;
      } else if (c === "}") {
        indent = Math.max(0, indent - 1);
        push("\n" + "  ".repeat(indent) + "}");
        i++;
      } else if (/\s/.test(c)) {
        if (input[i + 1] && /[a-zA-Z0-9_(]/.test(input[i + 1]) && result[result.length - 1] !== "\n" && result[result.length - 1] !== " ") {
          push(" ");
        }
        i++;
      } else {
        push(c);
        i++;
        if ((c === " " || /[a-zA-Z0-9_)]/.test(c)) && input[i] && /[a-zA-Z_]/.test(input[i]) && !/[a-zA-Z0-9_]/.test(input[i - 1] || "")) {
          // no-op, spacing handled elsewhere
        }
      }
    }
    // Add newline + indent after each field name before next field on same line
    const lines = result.split("\n").map((l) => l.trimEnd());
    setOutput(lines.join("\n"));
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Paste GraphQL query"><TextArea rows={10} value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Field label="Formatted output"><OutputBox value={output} rows={10} /></Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={format}>Format</Button>
        <CopyButton getText={() => output} />
      </div>
    </ToolCard>
  );
}

/* ---------------- Chmod Calculator ---------------- */
export function ChmodCalculator() {
  const [perms, setPerms] = useState({
    ownerR: true, ownerW: true, ownerX: false,
    groupR: true, groupW: false, groupX: false,
    otherR: true, otherW: false, otherX: false,
  });

  function toOctal(r: boolean, w: boolean, x: boolean) {
    return (r ? 4 : 0) + (w ? 2 : 0) + (x ? 1 : 0);
  }
  const owner = toOctal(perms.ownerR, perms.ownerW, perms.ownerX);
  const group = toOctal(perms.groupR, perms.groupW, perms.groupX);
  const other = toOctal(perms.otherR, perms.otherW, perms.otherX);
  const octal = `${owner}${group}${other}`;
  const symbolic = [
    [perms.ownerR, perms.ownerW, perms.ownerX],
    [perms.groupR, perms.groupW, perms.groupX],
    [perms.otherR, perms.otherW, perms.otherX],
  ]
    .map(([r, w, x]) => `${r ? "r" : "-"}${w ? "w" : "-"}${x ? "x" : "-"}`)
    .join("");

  function Group({ title, prefix }: { title: string; prefix: "owner" | "group" | "other" }) {
    return (
      <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <p className="mb-2 text-sm font-semibold">{title}</p>
        {(["R", "W", "X"] as const).map((k) => (
          <label key={k} className="mr-3 inline-flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={perms[`${prefix}${k}` as keyof typeof perms]}
              onChange={(e) => setPerms((p) => ({ ...p, [`${prefix}${k}`]: e.target.checked }))}
            />
            {k === "R" ? "Read" : k === "W" ? "Write" : "Execute"}
          </label>
        ))}
      </div>
    );
  }

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-3">
        <Group title="Owner" prefix="owner" />
        <Group title="Group" prefix="group" />
        <Group title="Others" prefix="other" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatBadge label="Octal" value={octal} />
        <StatBadge label="Symbolic" value={symbolic} />
        <StatBadge label="Command" value={`chmod ${octal}`} />
      </div>
      <div className="mt-4 flex gap-2"><CopyButton getText={() => `chmod ${octal} filename`} /></div>
    </ToolCard>
  );
}

/* ---------------- Htaccess Redirect Generator ---------------- */
export function HtaccessRedirectGenerator() {
  const [type, setType] = useState("page");
  const [status, setStatus] = useState("301");
  const [from, setFrom] = useState("/old-page.html");
  const [to, setTo] = useState("https://example.com/new-page");
  const [domain, setDomain] = useState("example.com");

  const code = useMemo(() => {
    if (type === "page") return `Redirect ${status} ${from} ${to}`;
    if (type === "domain") return `RewriteEngine On\nRewriteRule ^(.*)$ ${to}/$1 [R=${status},L]`;
    if (type === "www") return `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.${domain} [NC]\nRewriteRule ^(.*)$ https://${domain}/$1 [R=301,L]`;
    if (type === "nonwww") return `RewriteEngine On\nRewriteCond %{HTTP_HOST} ^${domain} [NC]\nRewriteRule ^(.*)$ https://www.${domain}/$1 [R=301,L]`;
    if (type === "https") return `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]`;
    return "";
  }, [type, status, from, to, domain]);

  return (
    <ToolCard>
      <div className="mb-4 max-w-xs">
        <Field label="Redirect type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="page">Single page redirect</option>
            <option value="domain">Whole domain redirect</option>
            <option value="www">www → non-www</option>
            <option value="nonwww">non-www → www</option>
            <option value="https">Force HTTPS</option>
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {type === "page" ? (
          <>
            <Field label="From path"><TextInput value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
            <Field label="To URL"><TextInput value={to} onChange={(e) => setTo(e.target.value)} /></Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="301">301 (Permanent)</option>
                <option value="302">302 (Temporary)</option>
              </Select>
            </Field>
          </>
        ) : null}
        {type === "domain" ? <Field label="New domain (with https://)"><TextInput value={to} onChange={(e) => setTo(e.target.value)} /></Field> : null}
        {(type === "www" || type === "nonwww") ? <Field label="Domain (without www)"><TextInput value={domain} onChange={(e) => setDomain(e.target.value)} /></Field> : null}
      </div>
      <div className="mt-4"><OutputBox value={code} rows={5} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => code} /></div>
    </ToolCard>
  );
}

/* ---------------- Diff Checker ---------------- */
export function DiffChecker() {
  const [a, setA] = useState("Hello world.\nThis is line two.\nUnchanged line.");
  const [b, setB] = useState("Hello there.\nThis is line two.\nUnchanged line.\nA new line added.");
  const [mode, setMode] = useState<"line" | "word">("line");
  const [parts, setParts] = useState<{ value: string; added?: boolean; removed?: boolean }[]>([]);

  useEffect(() => {
    import("diff").then(({ diffLines, diffWords }) => {
      setParts(mode === "line" ? diffLines(a, b) : diffWords(a, b));
    });
  }, [a, b, mode]);

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Original"><TextArea rows={10} value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="Changed"><TextArea rows={10} value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      <div className="my-4 flex gap-2">
        <Button variant={mode === "line" ? "primary" : "ghost"} onClick={() => setMode("line")}>Line diff</Button>
        <Button variant={mode === "word" ? "primary" : "ghost"} onClick={() => setMode("word")}>Word diff</Button>
      </div>
      <div className="whitespace-pre-wrap rounded-lg border border-slate-200 p-3 font-mono text-sm dark:border-slate-700">
        {parts.map((p, i) => (
          <span
            key={i}
            className={
              p.added
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                : p.removed
                ? "bg-red-100 text-red-800 line-through dark:bg-red-950 dark:text-red-300"
                : ""
            }
          >
            {p.value}
          </span>
        ))}
      </div>
    </ToolCard>
  );
}


/* ---------------- 23. HTML Formatter / Beautifier ---------------- */
export function HtmlFormatter() {
  const [input, setInput] = useState(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Sample Page</title><style>body{font-family:sans-serif;}</style></head>
<body><header><h1>Welcome to ToolForAll</h1><nav><a href="#home">Home</a><a href="#about">About</a></nav></header>
<main><section class="intro"><p>Instant client-side developer utilities.</p><ul><li>Fast</li><li>Reliable</li><li>Private</li></ul></section></main>
<footer><p>&copy; 2026 ToolForAll</p></footer></body></html>`);
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [wrapAttributes, setWrapAttributes] = useState("auto");
  const [removeComments, setRemoveComments] = useState(false);
  const [error, setError] = useState("");

  function formatHtml(html: string, spaces: number) {
    let clean = html.trim();
    if (removeComments) {
      clean = clean.replace(/<!--[\s\S]*?-->/g, "");
    }
    // Simple robust tokenizer for formatting
    const tokens = clean.replace(/>\s*</g, "><").replace(/</g, "~#~<").split("~#~").filter((x): x is string => Boolean(x));
    let pad = 0;
    const indent = " ".repeat(spaces);
    const selfClosing = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|!doctype)/i;
    const formatted: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
      let node = tokens[i].trim();
      if (!node) continue;

      if (node.startsWith("</")) {
        pad = Math.max(0, pad - 1);
        formatted.push(indent.repeat(pad) + node);
      } else if (node.startsWith("<") && !node.startsWith("<!--")) {
        const tagMatch = node.match(/^<([a-zA-Z0-9!-]+)/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
        const isSelfClosing = selfClosing.test(tagName) || node.endsWith("/>");

        formatted.push(indent.repeat(pad) + node);
        if (!isSelfClosing && !node.includes(`</${tagName}>`)) {
          pad++;
        }
      } else {
        formatted.push(indent.repeat(pad) + node);
      }
    }
    return formatted.join("\n");
  }

  function handleFormat() {
    try {
      const sp = parseInt(indentSize, 10);
      const res = formatHtml(input, isNaN(sp) ? 2 : sp);
      setOutput(res);
      setError("");
    } catch (e) {
      setError("Error formatting HTML: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  function handleMinify() {
    try {
      const min = input
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .replace(/>\s+</g, "><")
        .trim();
      setOutput(min);
      setError("");
    } catch (e) {
      setError("Error minifying HTML: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input HTML">
          <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML code here..." />
        </Field>
        <Field label="Formatted Output">
          <OutputBox value={output} rows={14} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
            <option value="2">2 Spaces Indent</option>
            <option value="4">4 Spaces Indent</option>
            <option value="8">8 Spaces Indent</option>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={removeComments} onChange={(e) => setRemoveComments(e.target.checked)} className="rounded" />
          Strip Comments
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleFormat}>Format / Beautify</Button>
        <Button variant="secondary" onClick={handleMinify}>Minify HTML</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {output && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className="flex gap-2">
            <StatBadge label="Lines" value={output.split("\n").length} />
            <StatBadge label="Characters" value={output.length} />
          </div>
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => output} /><Button type="button" variant="secondary" onClick={() => downloadText(output, "beautified.html", "text/html")}>⬇️ Download</Button></div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 24. CSS Formatter / Beautifier ---------------- */
export function CssFormatter() {
  const [input, setInput] = useState(`.card{background:#ffffff;border-radius:8px;padding:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);display:flex;flex-direction:column;gap:12px;}.card:hover{transform:translateY(-2px);transition:all 0.2s ease;}@media (max-width:768px){.card{padding:12px;}}`);
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [sortProperties, setSortProperties] = useState(false);
  const [error, setError] = useState("");

  function formatCss(css: string, spaces: number) {
    let clean = css.trim().replace(/\r\n/g, "\n");
    // normalize spaces
    clean = clean.replace(/\/\*[\s\S]*?\*\//g, (m) => m); // preserve comments
    clean = clean.replace(/\s*{\s*/g, " {\n").replace(/;\s*/g, ";\n").replace(/\s*}\s*/g, "\n}\n");

    const lines = clean.split("\n").map(l => l.trim()).filter((x): x is string => Boolean(x));
    const indent = " ".repeat(spaces);
    let depth = 0;
    const result: string[] = [];
    let currentProperties: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.endsWith("}")) {
        if (sortProperties && currentProperties.length > 0) {
          currentProperties.sort();
          result.push(...currentProperties);
          currentProperties = [];
        }
        depth = Math.max(0, depth - 1);
        result.push(indent.repeat(depth) + "}");
      } else if (line.endsWith("{")) {
        result.push(indent.repeat(depth) + line);
        depth++;
      } else if (line.includes(":") && !line.startsWith("@")) {
        const formattedProp = line.replace(/\s*:\s*/, ": ");
        if (sortProperties) {
          currentProperties.push(indent.repeat(depth) + formattedProp);
        } else {
          result.push(indent.repeat(depth) + formattedProp);
        }
      } else {
        result.push(indent.repeat(depth) + line);
      }
    }
    return result.join("\n");
  }

  function handleFormat() {
    try {
      const sp = parseInt(indentSize, 10);
      const res = formatCss(input, isNaN(sp) ? 2 : sp);
      setOutput(res);
      setError("");
    } catch (e) {
      setError("Error formatting CSS: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  function handleMinify() {
    try {
      const min = input
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .replace(/;}/g, "}")
        .trim();
      setOutput(min);
      setError("");
    } catch (e) {
      setError("Error minifying CSS: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input CSS">
          <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste CSS code here..." />
        </Field>
        <Field label="Formatted Output">
          <OutputBox value={output} rows={14} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
            <option value="2">2 Spaces Indent</option>
            <option value="4">4 Spaces Indent</option>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={sortProperties} onChange={(e) => setSortProperties(e.target.checked)} className="rounded" />
          Alphabetize Properties
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={handleFormat}>Format / Beautify CSS</Button>
        <Button variant="secondary" onClick={handleMinify}>Minify CSS</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {output && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className="flex gap-2">
            <StatBadge label="Lines" value={output.split("\n").length} />
            <StatBadge label="Characters" value={output.length} />
          </div>
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => output} /><Button type="button" variant="secondary" onClick={() => downloadText(output, "styles.css", "text/css")}>⬇️ Download</Button></div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 25. JavaScript Formatter / Beautifier ---------------- */
export function JavascriptFormatter() {
  const [input, setInput] = useState(`function calculateTax(amount,rate=0.08){if(amount<=0){return 0;}const total=amount*(1+rate);console.log("Calculated total:",total);return Number(total.toFixed(2));}`);
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [error, setError] = useState("");

  function formatJs(code: string, spaces: number) {
    let text = code.trim();
    // Normalize semicolons and braces
    text = text.replace(/\s*{\s*/g, " {\n")
      .replace(/;\s*/g, ";\n")
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\s*else\s*/g, " else ")
      .replace(/\s*catch\s*/g, " catch ");

    const lines = text.split("\n").map(l => l.trim()).filter((x): x is string => Boolean(x));
    const indent = " ".repeat(spaces);
    let depth = 0;
    const formatted: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("}") || line.startsWith("]")) {
        depth = Math.max(0, depth - 1);
      }
      formatted.push(indent.repeat(depth) + line);
      if (line.endsWith("{") || line.endsWith("[")) {
        depth++;
      }
    }
    return formatted.join("\n");
  }

  function handleFormat() {
    try {
      const sp = parseInt(indentSize, 10);
      const res = formatJs(input, isNaN(sp) ? 2 : sp);
      setOutput(res);
      setError("");
    } catch (e) {
      setError("Error formatting JavaScript: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input JavaScript">
          <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JavaScript code here..." />
        </Field>
        <Field label="Formatted JavaScript">
          <OutputBox value={output} rows={14} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
            <option value="2">2 Spaces Indent</option>
            <option value="4">4 Spaces Indent</option>
          </Select>
        </div>
        <Button variant="primary" onClick={handleFormat}>Format JavaScript</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {output && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className="flex gap-2">
            <StatBadge label="Lines" value={output.split("\n").length} />
            <StatBadge label="Characters" value={output.length} />
          </div>
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => output} /><Button type="button" variant="secondary" onClick={() => downloadText(output, "script.js", "application/javascript")}>⬇️ Download</Button></div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 26. TypeScript Formatter ---------------- */
export function TypescriptFormatter() {
  const [input, setInput] = useState(`export interface User<T=string>{id:number;username:string;email:string;metadata?:T;isActive:boolean;roles:Array<"admin"|"editor"|"viewer">;}export type ApiResponse<T>={data:T;status:number;message:string;};`);
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [error, setError] = useState("");

  function formatTs(code: string, spaces: number) {
    let text = code.trim();
    text = text.replace(/\s*{\s*/g, " {\n")
      .replace(/;\s*/g, ";\n")
      .replace(/\s*}\s*/g, "\n}\n");

    const lines = text.split("\n").map(l => l.trim()).filter((x): x is string => Boolean(x));
    const indent = " ".repeat(spaces);
    let depth = 0;
    const formatted: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("}")) {
        depth = Math.max(0, depth - 1);
      }
      formatted.push(indent.repeat(depth) + line);
      if (line.endsWith("{")) {
        depth++;
      }
    }
    return formatted.join("\n");
  }

  function handleFormat() {
    try {
      const sp = parseInt(indentSize, 10);
      const res = formatTs(input, isNaN(sp) ? 2 : sp);
      setOutput(res);
      setError("");
    } catch (e) {
      setError("Error formatting TypeScript: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input TypeScript / Interfaces">
          <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste TypeScript code, types, or interfaces here..." />
        </Field>
        <Field label="Formatted TypeScript">
          <OutputBox value={output} rows={14} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
            <option value="2">2 Spaces Indent</option>
            <option value="4">4 Spaces Indent</option>
          </Select>
        </div>
        <Button variant="primary" onClick={handleFormat}>Format TypeScript</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {output && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className="flex gap-2">
            <StatBadge label="Lines" value={output.split("\n").length} />
            <StatBadge label="Characters" value={output.length} />
          </div>
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => output} /><Button type="button" variant="secondary" onClick={() => downloadText(output, "types.ts", "text/plain")}>⬇️ Download</Button></div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 27. JSON Schema Validator ---------------- */
export function JsonSchemaValidator() {
  const [jsonInput, setJsonInput] = useState(`{\n  "name": "Sarah Jenkins",\n  "email": "sarah@example.com",\n  "age": 28,\n  "roles": ["admin", "developer"]\n}`);
  const [schemaInput, setSchemaInput] = useState(`{\n  "type": "object",\n  "required": ["name", "email", "age"],\n  "properties": {\n    "name": { "type": "string", "minLength": 2 },\n    "email": { "type": "string", "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },\n    "age": { "type": "integer", "minimum": 18 },\n    "roles": { "type": "array", "items": { "type": "string" } }\n  }\n}`);
  const [results, setResults] = useState<{ valid: boolean; errors: string[] } | null>(null);

  function validateSchema(data: any, schema: any, path = "#"): string[] {
    const errors: string[] = [];
    if (!schema || typeof schema !== "object") return errors;

    if (schema.type) {
      const type = schema.type;
      if (type === "string" && typeof data !== "string") errors.push(`${path}: Expected string, received ${typeof data}`);
      if (type === "number" && typeof data !== "number") errors.push(`${path}: Expected number, received ${typeof data}`);
      if (type === "integer" && (!Number.isInteger(data) || typeof data !== "number")) errors.push(`${path}: Expected integer, received ${data}`);
      if (type === "boolean" && typeof data !== "boolean") errors.push(`${path}: Expected boolean, received ${typeof data}`);
      if (type === "array" && !Array.isArray(data)) errors.push(`${path}: Expected array, received ${typeof data}`);
      if (type === "object" && (typeof data !== "object" || data === null || Array.isArray(data))) errors.push(`${path}: Expected object, received ${typeof data}`);
    }

    if (typeof data === "string") {
      if (typeof schema.minLength === "number" && data.length < schema.minLength) {
        errors.push(`${path}: String length ${data.length} is less than minLength ${schema.minLength}`);
      }
      if (typeof schema.maxLength === "number" && data.length > schema.maxLength) {
        errors.push(`${path}: String length ${data.length} exceeds maxLength ${schema.maxLength}`);
      }
      if (schema.pattern) {
        try {
          const reg = new RegExp(schema.pattern);
          if (!reg.test(data)) errors.push(`${path}: String does not match pattern ${schema.pattern}`);
        } catch (e) {}
      }
    }

    if (typeof data === "number") {
      if (typeof schema.minimum === "number" && data < schema.minimum) {
        errors.push(`${path}: Value ${data} is less than minimum ${schema.minimum}`);
      }
      if (typeof schema.maximum === "number" && data > schema.maximum) {
        errors.push(`${path}: Value ${data} is greater than maximum ${schema.maximum}`);
      }
    }

    if (schema.enum && Array.isArray(schema.enum)) {
      if (!schema.enum.includes(data)) {
        errors.push(`${path}: Value must be one of ${JSON.stringify(schema.enum)}`);
      }
    }

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      if (Array.isArray(schema.required)) {
        for (const req of schema.required) {
          if (!(req in data)) {
            errors.push(`${path}: Missing required property "${req}"`);
          }
        }
      }
      if (schema.properties && typeof schema.properties === "object") {
        for (const key in schema.properties) {
          if (key in data) {
            errors.push(...validateSchema(data[key], schema.properties[key], `${path}/${key}`));
          }
        }
      }
    }

    if (Array.isArray(data) && schema.items) {
      data.forEach((item, idx) => {
        errors.push(...validateSchema(item, schema.items, `${path}[${idx}]`));
      });
    }

    return errors;
  }

  function handleValidate() {
    try {
      const data = JSON.parse(jsonInput);
      const schema = JSON.parse(schemaInput);
      const errors = validateSchema(data, schema);
      setResults({ valid: errors.length === 0, errors });
    } catch (e) {
      setResults({
        valid: false,
        errors: ["Syntax Error: " + (e instanceof Error ? e.message : String(e))]
      });
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="JSON Data">
          <TextArea rows={12} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder="Paste JSON data to validate..." />
        </Field>
        <Field label="JSON Schema">
          <TextArea rows={12} value={schemaInput} onChange={(e) => setSchemaInput(e.target.value)} placeholder="Paste JSON Schema definition..." />
        </Field>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={handleValidate}>Validate JSON Against Schema</Button>
      </div>

      {results && (
        <div className="mt-4">
          {results.valid ? (
            <Alert type="success">✓ JSON is 100% valid according to the provided JSON Schema.</Alert>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
              <h4 className="font-semibold text-red-800 dark:text-red-300">Schema Validation Errors ({results.errors.length}):</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm font-mono text-red-700 dark:text-red-400">
                {results.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 28. JSON Path Tester ---------------- */
export function JsonPathTester() {
  const [jsonInput, setJsonInput] = useState(`{\n  "store": {\n    "book": [\n      { "category": "fiction", "author": "Herman Melville", "title": "Moby Dick", "price": 8.99 },\n      { "category": "fiction", "author": "J. R. R. Tolkien", "title": "The Lord of the Rings", "isbn": "0-395-19395-8", "price": 22.99 },\n      { "category": "technology", "author": "Martin Fowler", "title": "Refactoring", "price": 45.00 }\n    ],\n    "bicycle": { "color": "red", "price": 19.95 }\n  }\n}`);
  const [pathQuery, setPathQuery] = useState("$.store.book[*].title");
  const [output, setOutput] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  function evaluateJsonPath(obj: any, path: string): any[] {
    // Basic resilient client-side JSONPath evaluator
    const cleanPath = path.replace(/^\$\.?/, "");
    if (!cleanPath) return [obj];

    const segments = cleanPath.split(/\.(?![^\[]*\])/);
    let current: any[] = [obj];

    for (const seg of segments) {
      const arrayMatch = seg.match(/^([a-zA-Z0-9_-]+)?\[(.*?)\]$/);
      if (arrayMatch) {
        const prop = arrayMatch[1];
        const indexExpr = arrayMatch[2];
        const next: any[] = [];

        for (const item of current) {
          const target = prop ? item?.[prop] : item;
          if (Array.isArray(target)) {
            if (indexExpr === "*") {
              next.push(...target);
            } else if (!isNaN(Number(indexExpr))) {
              const idx = parseInt(indexExpr, 10);
              if (target[idx] !== undefined) next.push(target[idx]);
            } else if (indexExpr.startsWith("?")) {
              // basic filter e.g. @.price < 30
              const filterBody = indexExpr.slice(1).replace(/@\./g, "item.");
              try {
                const fn = new Function("item", `try { return ${filterBody}; } catch(e) { return false; }`);
                next.push(...target.filter((item: any) => fn(item)));
              } catch (e) {
                next.push(...target);
              }
            }
          }
        }
        current = next;
      } else if (seg === "*") {
        const next: any[] = [];
        for (const item of current) {
          if (typeof item === "object" && item !== null) {
            next.push(...Object.values(item));
          }
        }
        current = next;
      } else {
        const next: any[] = [];
        for (const item of current) {
          if (item && typeof item === "object" && seg in item) {
            next.push(item[seg]);
          }
        }
        current = next;
      }
    }
    return current;
  }

  function handleEvaluate() {
    try {
      const data = JSON.parse(jsonInput);
      const matches = evaluateJsonPath(data, pathQuery);
      setOutput(JSON.stringify(matches, null, 2));
      setMatchCount(matches.length);
      setError("");
    } catch (e) {
      setError("Evaluation error: " + (e instanceof Error ? e.message : String(e)));
      setOutput("");
      setMatchCount(null);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="JSON Payload">
          <TextArea rows={12} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder="Paste JSON data..." />
        </Field>
        <Field label="Matching Results">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[260px]">
          <TextInput value={pathQuery} onChange={(e) => setPathQuery(e.target.value)} placeholder="e.g. $.store.book[*].title or $.store.bicycle.price" />
        </div>
        <Button variant="primary" onClick={handleEvaluate}>Evaluate JSONPath</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 self-center">Presets:</span>
        <button type="button" onClick={() => { setPathQuery("$.store.book[*].title"); }} className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">All Book Titles</button>
        <button type="button" onClick={() => { setPathQuery("$.store.book[0]"); }} className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">First Book</button>
        <button type="button" onClick={() => { setPathQuery("$.store.book[?(@.price < 25)]"); }} className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">Books Under $25</button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {matchCount !== null && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
          <StatBadge label="Matches Found" value={matchCount} />
          <CopyButton getText={() => output} label="Copy Matches" />
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 29. XML Formatter / Beautifier ---------------- */
export function XmlFormatter() {
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book></catalog>`);
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const [error, setError] = useState("");

  function formatXml(xml: string, spaces: number) {
    let clean = xml.replace(/>\s*</g, "><").trim();
    let pad = 0;
    const indent = " ".repeat(spaces);
    const lines = clean.replace(/</g, "~#~<").split("~#~").filter((x): x is string => Boolean(x));
    const formatted: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const node = lines[i].trim();
      if (!node) continue;

      if (node.startsWith("</")) {
        pad = Math.max(0, pad - 1);
        formatted.push(indent.repeat(pad) + node);
      } else if (node.startsWith("<?") || node.startsWith("<!")) {
        formatted.push(indent.repeat(pad) + node);
      } else if (node.startsWith("<")) {
        const isSelfClosing = node.endsWith("/>") || node.includes("</");
        formatted.push(indent.repeat(pad) + node);
        if (!isSelfClosing) {
          pad++;
        }
      } else {
        formatted.push(indent.repeat(pad) + node);
      }
    }
    return formatted.join("\n");
  }

  function handleFormat() {
    try {
      const sp = parseInt(indentSize, 10);
      const res = formatXml(input, isNaN(sp) ? 2 : sp);
      setOutput(res);
      setError("");
    } catch (e) {
      setError("Error formatting XML: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input XML">
          <TextArea rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste XML here..." />
        </Field>
        <Field label="Formatted Output">
          <OutputBox value={output} rows={14} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-40">
          <Select value={indentSize} onChange={(e) => setIndentSize(e.target.value)}>
            <option value="2">2 Spaces Indent</option>
            <option value="4">4 Spaces Indent</option>
          </Select>
        </div>
        <Button variant="primary" onClick={handleFormat}>Format / Beautify XML</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {output && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <div className="flex gap-2">
            <StatBadge label="Lines" value={output.split("\n").length} />
            <StatBadge label="Characters" value={output.length} />
          </div>
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => output} /><Button type="button" variant="secondary" onClick={() => downloadText(output, "document.xml", "application/xml")}>⬇️ Download</Button></div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 30. XML Validator ---------------- */
export function XmlValidator() {
  const [input, setInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <user id="101">\n    <name>Elena Rostova</name>\n    <email>elena@example.com</email>\n  </user>\n</root>`);
  const [result, setResult] = useState<{ valid: boolean; message: string; line?: number; column?: number } | null>(null);

  function handleValidate() {
    if (typeof window === "undefined") return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      const parserError = doc.querySelector("parsererror");
      if (parserError) {
        const errorText = parserError.textContent || "Unknown XML parsing error";
        const lineMatch = errorText.match(/line\s*(\d+)/i);
        const colMatch = errorText.match(/column\s*(\d+)/i);
        setResult({
          valid: false,
          message: errorText.split("\n")[0] || errorText,
          line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
          column: colMatch ? parseInt(colMatch[1], 10) : undefined
        });
      } else {
        setResult({
          valid: true,
          message: "XML is well-formed and valid according to standard XML syntax rules."
        });
      }
    } catch (e) {
      setResult({
        valid: false,
        message: "Parsing Exception: " + (e instanceof Error ? e.message : String(e))
      });
    }
  }

  return (
    <ToolCard>
      <Field label="XML Document">
        <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste XML to validate..." />
      </Field>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={handleValidate}>Validate XML</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setResult(null); }}>Clear</Button>
      </div>

      {result && (
        <div className="mt-4">
          {result.valid ? (
            <Alert type="success">✓ {result.message}</Alert>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
              <h4 className="font-semibold text-red-800 dark:text-red-300">XML Syntax Error</h4>
              <p className="mt-1 text-sm font-mono text-red-700 dark:text-red-400">{result.message}</p>
              {(result.line || result.column) && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  Location: Line {result.line ?? "?"}, Column {result.column ?? "?"}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 31. XPath Tester ---------------- */
export function XpathTester() {
  const [xmlInput, setXmlInput] = useState(`<?xml version="1.0" encoding="UTF-8"?>\n<bookstore>\n  <book category="COOKING">\n    <title lang="en">Everyday Italian</title>\n    <author>Giada De Laurentiis</author>\n    <year>2005</year>\n    <price>30.00</price>\n  </book>\n  <book category="CHILDREN">\n    <title lang="en">Harry Potter</title>\n    <author>J. K. Rowling</author>\n    <year>2005</year>\n    <price>29.99</price>\n  </book>\n  <book category="WEB">\n    <title lang="en">Learning XML</title>\n    <author>Erik T. Ray</author>\n    <year>2003</year>\n    <price>39.95</price>\n  </book>\n</bookstore>`);
  const [xpathQuery, setXpathQuery] = useState("//book[price < 35]/title");
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleEvaluate() {
    if (typeof window === "undefined") return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlInput, "application/xml");
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        setError("Invalid XML: " + (parseError.textContent || "Parser error"));
        setResults([]);
        return;
      }

      const evaluator = new XPathEvaluator();
      const xResult = evaluator.evaluate(xpathQuery, doc, null, XPathResult.ANY_TYPE, null);
      const matches: string[] = [];

      let node: Node | null = null;
      if (xResult.resultType === XPathResult.NUMBER_TYPE) {
        matches.push(String(xResult.numberValue));
      } else if (xResult.resultType === XPathResult.STRING_TYPE) {
        matches.push(xResult.stringValue);
      } else if (xResult.resultType === XPathResult.BOOLEAN_TYPE) {
        matches.push(String(xResult.booleanValue));
      } else {
        while ((node = xResult.iterateNext())) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            matches.push((node as Element).outerHTML);
          } else if (node.nodeType === Node.ATTRIBUTE_NODE) {
            matches.push(`${(node as Attr).name}="${(node as Attr).value}"`);
          } else if (node.nodeType === Node.TEXT_NODE) {
            matches.push(node.nodeValue?.trim() || "");
          }
        }
      }

      setResults(matches.filter((x): x is string => Boolean(x)));
      setError("");
    } catch (e) {
      setError("XPath Error: " + (e instanceof Error ? e.message : String(e)));
      setResults([]);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="XML Document">
          <TextArea rows={12} value={xmlInput} onChange={(e) => setXmlInput(e.target.value)} placeholder="Paste XML data..." />
        </Field>
        <Field label="XPath Evaluation Results">
          <div className="h-[288px] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-800 dark:bg-slate-950">
            {results.length > 0 ? (
              <ul className="space-y-2">
                {results.map((res, i) => (
                  <li key={i} className="rounded bg-white p-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Match #{i + 1}:</span>
                    <pre className="mt-1 whitespace-pre-wrap">{res}</pre>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400">Click "Evaluate XPath" to view matching elements.</p>
            )}
          </div>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[260px]">
          <TextInput value={xpathQuery} onChange={(e) => setXpathQuery(e.target.value)} placeholder="e.g. //book/title or //book[@category='WEB']" />
        </div>
        <Button variant="primary" onClick={handleEvaluate}>Evaluate XPath</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {results.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
          <StatBadge label="Matches Count" value={results.length} />
          <CopyButton getText={() => results.join("\n\n")} label="Copy All Matches" />
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 32. HTML Validator ---------------- */
export function HtmlValidator() {
  const [input, setInput] = useState(`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Sample</title>\n</head>\n<body>\n  <div id="main">\n    <h1>Welcome\n    <img src="avatar.jpg">\n    <a href="">Click here</a>\n  </div>\n  <div id="main">Duplicate ID</div>\n</body>\n</html>`);
  const [issues, setIssues] = useState<Array<{ type: "error" | "warning" | "info"; msg: string }>>([]);

  function checkHtml(html: string) {
    const findings: Array<{ type: "error" | "warning" | "info"; msg: string }> = [];

    if (!html.includes("<!DOCTYPE html") && !html.includes("<!doctype html")) {
      findings.push({ type: "warning", msg: "Missing <!DOCTYPE html> declaration at the beginning of document." });
    }
    if (!html.includes("<title>") && !html.includes("<title ")) {
      findings.push({ type: "warning", msg: "Missing <title> tag inside <head>." });
    }

    // Check duplicate IDs
    const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)];
    const seenIds = new Set<string>();
    const dupIds = new Set<string>();
    for (const m of idMatches) {
      const id = m[1];
      if (seenIds.has(id)) dupIds.add(id);
      seenIds.add(id);
    }
    dupIds.forEach((id) => {
      findings.push({ type: "error", msg: `Duplicate element ID found: id="${id}". IDs must be unique across the DOM.` });
    });

    // Check images missing alt
    const imgMatches = [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)];
    if (imgMatches.length > 0) {
      findings.push({ type: "warning", msg: `Found ${imgMatches.length} <img> tag(s) missing the required 'alt' accessibility attribute.` });
    }

    // Check empty links
    const emptyLinks = [...html.matchAll(/<a\b[^>]*\bhref=["']{2}[^>]*>/gi)];
    if (emptyLinks.length > 0) {
      findings.push({ type: "info", msg: `Found ${emptyLinks.length} <a> link(s) with empty href="".` });
    }

    // Check unclosed tags (basic stack check)
    const selfClosing = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|!doctype)/i;
    const tagMatches = [...html.matchAll(/<(\/?)([a-zA-Z0-9-]+)[^>]*>/g)];
    const stack: string[] = [];

    for (const match of tagMatches) {
      const isClosing = match[1] === "/";
      const tag = match[2].toLowerCase();
      if (selfClosing.test(tag)) continue;

      if (!isClosing) {
        stack.push(tag);
      } else {
        const last = stack.pop();
        if (last && last !== tag) {
          findings.push({ type: "error", msg: `Mismatched closing tag: expected </${last}>, found </${tag}>.` });
        }
      }
    }

    if (stack.length > 0) {
      findings.push({ type: "error", msg: `Unclosed tag(s) detected: ${stack.map(t => `<${t}>`).join(", ")}.` });
    }

    if (findings.length === 0) {
      findings.push({ type: "info", msg: "✓ No structural issues detected. HTML markup conforms to standard guidelines." });
    }

    setIssues(findings);
  }

  return (
    <ToolCard>
      <Field label="HTML Markup">
        <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML markup to inspect..." />
      </Field>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={() => checkHtml(input)}>Validate HTML Structure</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setIssues([]); }}>Clear</Button>
      </div>

      {issues.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Validation Results ({issues.length}):</h4>
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-3 text-sm flex items-start gap-2 ${
                issue.type === "error"
                  ? "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900"
                  : issue.type === "warning"
                  ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                  : "bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
              }`}
            >
              <span className="font-bold uppercase text-xs">[{issue.type}]</span>
              <span>{issue.msg}</span>
            </div>
          ))}
        </div>
      )}
    </ToolCard>
  );
}



/* ---------------- 33. CSS Selector Tester ---------------- */
export function CssSelectorTester() {
  const [htmlInput, setHtmlInput] = useState(`<div class="container">\n  <header class="header">\n    <h1 id="title" class="main-heading">Product Catalog</h1>\n    <nav class="nav-bar">\n      <a href="#home" class="nav-link active">Home</a>\n      <a href="#shop" class="nav-link">Shop</a>\n      <a href="#contact" class="nav-link">Contact</a>\n    </nav>\n  </header>\n  <main class="content">\n    <div class="card" data-featured="true">\n      <h2 class="card-title">Pro Plan</h2>\n      <span class="price">$29/mo</span>\n      <button class="btn btn-primary">Subscribe</button>\n    </div>\n    <div class="card">\n      <h2 class="card-title">Enterprise Plan</h2>\n      <span class="price">$99/mo</span>\n      <button class="btn btn-secondary">Contact Sales</button>\n    </div>\n  </main>\n</div>`);
  const [selector, setSelector] = useState(".nav-link.active, .card[data-featured='true']");
  const [matches, setMatches] = useState<Array<{ tag: string; id: string; classes: string; outerHtml: string }>>([]);
  const [error, setError] = useState("");

  function handleTest() {
    if (typeof window === "undefined") return;
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div id="sandbox-root">${htmlInput}</div>`, "text/html");
      const root = doc.getElementById("sandbox-root");
      if (!root) return;

      const elements = root.querySelectorAll(selector);
      const list: Array<{ tag: string; id: string; classes: string; outerHtml: string }> = [];

      elements.forEach((el) => {
        list.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          classes: el.className || "",
          outerHtml: el.outerHTML
        });
      });

      setMatches(list);
      setError("");
    } catch (e) {
      setError("CSS Selector Error: " + (e instanceof Error ? e.message : String(e)));
      setMatches([]);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="HTML Document Snippet">
          <TextArea rows={12} value={htmlInput} onChange={(e) => setHtmlInput(e.target.value)} placeholder="Paste HTML markup to test against..." />
        </Field>
        <Field label="Matching Elements">
          <div className="h-[288px] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-800 dark:bg-slate-950">
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map((m, i) => (
                  <div key={i} className="rounded border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-2 font-sans text-xs">
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">&lt;{m.tag}&gt;</span>
                      {m.id && <span className="text-amber-600 dark:text-amber-400">#{m.id}</span>}
                      {m.classes && <span className="text-slate-500">.{m.classes.split(" ").join(".")}</span>}
                    </div>
                    <pre className="mt-1.5 overflow-x-auto text-[11px] text-slate-700 dark:text-slate-300">{m.outerHtml}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Enter a selector and click "Test CSS Selector" to inspect matches.</p>
            )}
          </div>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[260px]">
          <TextInput value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="e.g. .card > h2 or a.nav-link[href^='#']" />
        </div>
        <Button variant="primary" onClick={handleTest}>Test CSS Selector</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="text-slate-500 self-center">Quick Selectors:</span>
        <button type="button" onClick={() => setSelector(".nav-link")} className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">All Nav Links</button>
        <button type="button" onClick={() => setSelector(".card:first-of-type")} className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">First Card</button>
        <button type="button" onClick={() => setSelector("button.btn-primary")} className="rounded bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">Primary Buttons</button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {matches.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
          <StatBadge label="Total Matches" value={matches.length} />
          <CopyButton getText={() => matches.map(m => m.outerHtml).join("\n\n")} label="Copy Matches Outer HTML" />
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 34. JavaScript Escape / Unescape ---------------- */
export function JavascriptEscape() {
  const [input, setInput] = useState("Hello \"World\"!\nThis is a multiline string with tab:\t\${name} & special char: 🚀");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [targetType, setTargetType] = useState<"double" | "single" | "template" | "json">("double");

  function processText() {
    if (mode === "escape") {
      let res = input;
      if (targetType === "double") {
        res = res
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t");
      } else if (targetType === "single") {
        res = res
          .replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t");
      } else if (targetType === "template") {
        res = res
          .replace(/\\/g, "\\\\")
          .replace(/\`/g, "\\\\`")
          .replace(/\$/g, "\\$");
      } else if (targetType === "json") {
        res = JSON.stringify(input);
      }
      setOutput(res);
    } else {
      // Unescape
      let res = input;
      if (targetType === "json") {
        try {
          res = JSON.parse(input);
        } catch (e) {
          res = input.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\\\/g, "\\");
        }
      } else {
        res = res
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\`/g, "`")
          .replace(/\\\$/g, "$")
          .replace(/\\\\/g, "\\");
      }
      setOutput(res);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Input String">
          <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text..." />
        </Field>
        <Field label={mode === "escape" ? "Escaped String" : "Unescaped String"}>
          <OutputBox value={output} rows={12} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${mode === "escape" ? "bg-white text-blue-600 shadow dark:bg-slate-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-300"}`}
            onClick={() => setMode("escape")}
          >
            Escape
          </button>
          <button
            type="button"
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${mode === "unescape" ? "bg-white text-blue-600 shadow dark:bg-slate-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-300"}`}
            onClick={() => setMode("unescape")}
          >
            Unescape
          </button>
        </div>

        <div className="w-52">
          <Select value={targetType} onChange={(e) => setTargetType(e.target.value as any)}>
            <option value="double">Double Quotes (")</option>
            <option value="single">Single Quotes (')</option>
            <option value="template">Template Literal (` `) &amp; $</option>
            <option value="json">JSON String Literal</option>
          </Select>
        </div>

        <Button variant="primary" onClick={processText}>Process Text</Button>
      </div>

      {output && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
          <StatBadge label="Output Characters" value={output.length} />
          <CopyButton getText={() => output} label="Copy Processed String" />
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 35. URL Parser ---------------- */
export function UrlParser() {
  const [urlInput, setUrlInput] = useState("https://user:password@api.example.com:8443/v2/users/search?role=developer&status=active&limit=25#results-section");
  const [parsed, setParsed] = useState<{
    protocol: string;
    hostname: string;
    port: string;
    pathname: string;
    hash: string;
    origin: string;
    username: string;
    password: string;
    params: Array<{ key: string; value: string }>;
  } | null>(null);
  const [error, setError] = useState("");

  function parseUrl(raw: string) {
    try {
      const u = new URL(raw.trim());
      const params: Array<{ key: string; value: string }> = [];
      u.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      setParsed({
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        hash: u.hash,
        origin: u.origin,
        username: u.username,
        password: u.password,
        params,
      });
      setError("");
    } catch (e) {
      setError("Invalid URL format. Make sure to include protocol like https://");
      setParsed(null);
    }
  }

  return (
    <ToolCard>
      <Field label="URL to Parse">
        <TextInput value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/path?key=value" />
      </Field>

      <div className="mt-3 flex gap-2">
        <Button variant="primary" onClick={() => parseUrl(urlInput)}>Parse URL</Button>
        <Button variant="ghost" onClick={() => { setUrlInput(""); setParsed(null); setError(""); }}>Clear</Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {parsed && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase">Protocol</span>
              <p className="mt-1 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{parsed.protocol}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase">Hostname</span>
              <p className="mt-1 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{parsed.hostname}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase">Port</span>
              <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{parsed.port || "(Default)"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase">Pathname</span>
              <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{parsed.pathname}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase">Hash / Anchor</span>
              <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{parsed.hash || "(None)"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
              <span className="text-xs font-semibold text-slate-500 uppercase">Origin</span>
              <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{parsed.origin}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Query Parameters ({parsed.params.length}):</h4>
            {parsed.params.length > 0 ? (
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="p-2">Key</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {parsed.params.map((p, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-blue-600 dark:text-blue-400">{p.key}</td>
                        <td className="p-2 text-slate-700 dark:text-slate-300">{p.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-1 text-xs text-slate-400">No query parameters found in this URL.</p>
            )}
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 36. User-Agent Parser ---------------- */
export function UserAgentParser() {
  const [uaInput, setUaInput] = useState("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
  const [info, setInfo] = useState<{
    browser: string;
    version: string;
    os: string;
    deviceType: string;
    engine: string;
  } | null>(null);

  function parseUA(ua: string) {
    let browser = "Unknown Browser";
    let version = "Unknown";
    let os = "Unknown OS";
    let deviceType = "Desktop";
    let engine = "Unknown Engine";

    // Detect Engine
    if (ua.includes("AppleWebKit")) engine = "WebKit / Blink";
    else if (ua.includes("Gecko") && ua.includes("Firefox")) engine = "Gecko";
    else if (ua.includes("Trident")) engine = "Trident";

    // Detect OS
    if (/Windows NT 10.0/i.test(ua)) os = "Windows 10 / 11";
    else if (/Windows NT 6.3/i.test(ua)) os = "Windows 8.1";
    else if (/Windows NT 6.1/i.test(ua)) os = "Windows 7";
    else if (/Mac OS X 10[._](\d+)/i.test(ua)) os = "macOS";
    else if (/iPhone|iPad|iPod/i.test(ua)) { os = "iOS"; deviceType = /iPad/i.test(ua) ? "Tablet" : "Mobile"; }
    else if (/Android/i.test(ua)) { os = "Android"; deviceType = /Mobile/i.test(ua) ? "Mobile" : "Tablet"; }
    else if (/Linux/i.test(ua)) os = "Linux";

    // Detect Browser
    if (/Edg\/([\d.]+)/i.test(ua)) {
      browser = "Microsoft Edge";
      version = ua.match(/Edg\/([\d.]+)/i)?.[1] || "";
    } else if (/Chrome\/([\d.]+)/i.test(ua)) {
      browser = "Google Chrome";
      version = ua.match(/Chrome\/([\d.]+)/i)?.[1] || "";
    } else if (/Safari\/([\d.]+)/i.test(ua) && !ua.includes("Chrome")) {
      browser = "Apple Safari";
      version = ua.match(/Version\/([\d.]+)/i)?.[1] || "";
    } else if (/Firefox\/([\d.]+)/i.test(ua)) {
      browser = "Mozilla Firefox";
      version = ua.match(/Firefox\/([\d.]+)/i)?.[1] || "";
    } else if (/Opera|OPR\/([\d.]+)/i.test(ua)) {
      browser = "Opera";
      version = ua.match(/OPR\/([\d.]+)/i)?.[1] || "";
    }

    if (/bot|googlebot|crawler|spider|robot|crawling/i.test(ua)) {
      deviceType = "Bot / Web Crawler";
    }

    setInfo({ browser, version, os, deviceType, engine });
  }

  return (
    <ToolCard>
      <Field label="User-Agent String">
        <TextArea rows={4} value={uaInput} onChange={(e) => setUaInput(e.target.value)} placeholder="Paste user-agent string..." />
      </Field>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => parseUA(uaInput)}>Parse User-Agent</Button>
        <Button
          variant="secondary"
          onClick={() => {
            if (typeof navigator !== "undefined") {
              setUaInput(navigator.userAgent);
              parseUA(navigator.userAgent);
            }
          }}
        >
          Use My Browser's User-Agent
        </Button>
      </div>

      {info && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Browser</span>
            <p className="mt-1 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{info.browser}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Version</span>
            <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{info.version}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Operating System</span>
            <p className="mt-1 font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{info.os}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Device Type</span>
            <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{info.deviceType}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-500 uppercase">Rendering Engine</span>
            <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{info.engine}</p>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 37. Unix Timestamp Converter ---------------- */
export function UnixTimestampConverter() {
  const [timestampInput, setTimestampInput] = useState("1714567890");
  const [dateInput, setDateInput] = useState("");
  const [results, setResults] = useState<{
    utc: string;
    local: string;
    relative: string;
    seconds: number;
    millis: number;
  } | null>(null);

  function convertFromTimestamp(val: string) {
    const num = parseInt(val.trim(), 10);
    if (isNaN(num)) return;
    const isMs = num > 1e11;
    const d = new Date(isMs ? num : num * 1000);

    const now = Date.now();
    const diffSec = Math.round((now - d.getTime()) / 1000);
    let relative = "";
    if (Math.abs(diffSec) < 60) relative = "just now";
    else if (diffSec > 0) relative = `${Math.floor(diffSec / 60)} minutes ago`;
    else relative = `in ${Math.floor(Math.abs(diffSec) / 60)} minutes`;

    setResults({
      utc: d.toUTCString() + " (" + d.toISOString() + ")",
      local: d.toString(),
      relative,
      seconds: Math.floor(d.getTime() / 1000),
      millis: d.getTime()
    });
  }

  function convertFromDate(dStr: string) {
    const d = new Date(dStr);
    if (isNaN(d.getTime())) return;
    convertFromTimestamp(String(Math.floor(d.getTime() / 1000)));
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Field label="Unix Timestamp (Seconds or Milliseconds)">
            <TextInput value={timestampInput} onChange={(e) => setTimestampInput(e.target.value)} placeholder="e.g. 1714567890" />
          </Field>
          <div className="mt-2 flex gap-2">
            <Button variant="primary" onClick={() => convertFromTimestamp(timestampInput)}>Convert Timestamp</Button>
            <Button variant="secondary" onClick={() => { const now = Math.floor(Date.now() / 1000); setTimestampInput(String(now)); convertFromTimestamp(String(now)); }}>Now</Button>
          </div>
        </div>

        <div>
          <Field label="Or Pick Date / Time">
            <TextInput type="datetime-local" value={dateInput} onChange={(e) => { setDateInput(e.target.value); convertFromDate(e.target.value); }} />
          </Field>
          <p className="mt-2 text-xs text-slate-500">Pick any date to convert directly into a Unix timestamp.</p>
        </div>
      </div>

      {results && (
        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500 uppercase">UTC Date &amp; ISO-8601</span>
              <p className="mt-1 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{results.utc}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500 uppercase">Local Timezone</span>
              <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{results.local}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500 uppercase">Seconds (Unix Epoch)</span>
              <p className="mt-1 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{results.seconds}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500 uppercase">Milliseconds</span>
              <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{results.millis}</p>
            </div>
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 38. Unix Timestamp Generator ---------------- */
export function UnixTimestampGenerator() {
  const [currentSec, setCurrentSec] = useState(0);
  const [currentMs, setCurrentMs] = useState(0);
  const [offsetValue, setOffsetValue] = useState("1");
  const [offsetUnit, setOffsetUnit] = useState<"hours" | "days" | "weeks" | "months">("days");
  const [offsetResult, setOffsetResult] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      setCurrentMs(now);
      setCurrentSec(Math.floor(now / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  function calculateOffset() {
    const count = parseInt(offsetValue, 10) || 0;
    const now = Date.now();
    let delta = 0;
    if (offsetUnit === "hours") delta = count * 3600 * 1000;
    else if (offsetUnit === "days") delta = count * 86400 * 1000;
    else if (offsetUnit === "weeks") delta = count * 7 * 86400 * 1000;
    else if (offsetUnit === "months") delta = count * 30 * 86400 * 1000;

    setOffsetResult(Math.floor((now + delta) / 1000));
  }

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider dark:text-blue-300">Live Timestamp (Seconds)</span>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">{currentSec}</span>
            <CopyButton getText={() => String(currentSec)} label="Copy" />
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider dark:text-emerald-300">Live Timestamp (Milliseconds)</span>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-2xl font-bold text-slate-900 dark:text-white">{currentMs}</span>
            <CopyButton getText={() => String(currentMs)} label="Copy" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Calculate Relative Timestamp Offset</h4>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-400">Current Time +</span>
          <div className="w-24">
            <TextInput type="number" value={offsetValue} onChange={(e) => setOffsetValue(e.target.value)} />
          </div>
          <div className="w-36">
            <Select value={offsetUnit} onChange={(e) => setOffsetUnit(e.target.value as any)}>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </Select>
          </div>
          <Button variant="primary" onClick={calculateOffset}>Calculate</Button>
        </div>

        {offsetResult !== null && (
          <div className="mt-3 flex items-center justify-between rounded bg-slate-100 p-3 dark:bg-slate-800">
            <div className="text-xs font-mono">
              <span className="font-bold text-blue-600 dark:text-blue-400">{offsetResult}</span>
              <span className="text-slate-500 ml-2">({new Date(offsetResult * 1000).toUTCString()})</span>
            </div>
            <CopyButton getText={() => String(offsetResult)} label="Copy Offset" />
          </div>
        )}
      </div>
    </ToolCard>
  );
}

/* ---------------- 39. HTTP Headers Parser ---------------- */
export function HttpHeadersParser() {
  const [input, setInput] = useState(`HTTP/2 200 OK\ncontent-type: application/json; charset=utf-8\ncache-control: public, max-age=3600, s-maxage=86400\ncontent-security-policy: default-src 'self'\nstrict-transport-security: max-age=31536000; includeSubDomains; preload\nx-content-type-options: nosniff\nx-frame-options: DENY\nserver: cloudflare\nx-ray-id: 84a329df0123`);
  const [headers, setHeaders] = useState<Array<{ name: string; value: string; category: string }>>([]);
  const [missingSecurity, setMissingSecurity] = useState<string[]>([]);

  function parseHeaders() {
    const lines = input.split("\n").map(l => l.trim()).filter((x): x is string => Boolean(x));
    const parsed: Array<{ name: string; value: string; category: string }> = [];

    const foundNames = new Set<string>();

    for (const line of lines) {
      if (line.startsWith("HTTP/")) continue;
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;

      const name = line.slice(0, colonIdx).trim().toLowerCase();
      const value = line.slice(colonIdx + 1).trim();
      foundNames.add(name);

      let category = "General";
      if (/content-security-policy|strict-transport-security|x-frame-options|x-content-type-options|permissions-policy/i.test(name)) {
        category = "Security";
      } else if (/cache-control|etag|expires|age|last-modified/i.test(name)) {
        category = "Caching";
      } else if (/content-type|content-length|content-encoding|access-control/i.test(name)) {
        category = "CORS & Content";
      } else if (/authorization|cookie|set-cookie/i.test(name)) {
        category = "Authentication";
      }

      parsed.push({ name, value, category });
    }

    const standardSec = ["strict-transport-security", "content-security-policy", "x-content-type-options", "x-frame-options"];
    const missing = standardSec.filter(s => !foundNames.has(s));

    setHeaders(parsed);
    setMissingSecurity(missing);
  }

  return (
    <ToolCard>
      <Field label="Raw HTTP Headers">
        <TextArea rows={8} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste response or request headers here..." />
      </Field>

      <div className="mt-3 flex gap-2">
        <Button variant="primary" onClick={parseHeaders}>Parse HTTP Headers</Button>
        <Button variant="ghost" onClick={() => { setInput(""); setHeaders([]); setMissingSecurity([]); }}>Clear</Button>
      </div>

      {headers.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-2.5">Header Name</th>
                  <th className="p-2.5">Value</th>
                  <th className="p-2.5">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {headers.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{h.name}</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300 break-all">{h.value}</td>
                    <td className="p-2.5">
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-sans font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {h.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {missingSecurity.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
              <span className="font-bold">Missing Recommended Security Headers: </span>
              {missingSecurity.join(", ")}
            </div>
          )}
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 40. HTTP Request Generator ---------------- */
export function HttpRequestGenerator() {
  const [method, setMethod] = useState("POST");
  const [url, setUrl] = useState("https://api.example.com/v1/users");
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer YOUR_TOKEN"\n}');
  const [body, setBody] = useState('{\n  "name": "Jane Doe",\n  "email": "jane@example.com"\n}');
  const [activeTab, setActiveTab] = useState<"fetch" | "axios" | "curl" | "python">("fetch");

  function generateCode(): string {
    let parsedHeaders: Record<string, string> = {};
    try { parsedHeaders = JSON.parse(headers); } catch (e) {}

    if (activeTab === "fetch") {
      return `fetch("${url}", {\n  method: "${method}",\n  headers: ${JSON.stringify(parsedHeaders, null, 4)},\n${method !== "GET" && body ? `  body: JSON.stringify(${body})\n` : ""}})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));`;
    } else if (activeTab === "axios") {
      return `import axios from "axios";\n\naxios({\n  method: "${method.toLowerCase()}",\n  url: "${url}",\n  headers: ${JSON.stringify(parsedHeaders, null, 4)},\n${method !== "GET" && body ? `  data: ${body}\n` : ""}})\n  .then(response => console.log(response.data))\n  .catch(error => console.error(error));`;
    } else if (activeTab === "curl") {
      let cmd = `curl -X ${method} "${url}"`;
      for (const [k, v] of Object.entries(parsedHeaders)) {
        cmd += ` \\\n  -H "${k}: ${v}"`;
      }
      if (method !== "GET" && body) {
        cmd += ` \\\n  -d '${body.replace(/\n/g, "")}'`;
      }
      return cmd;
    } else if (activeTab === "python") {
      return `import requests\n\nurl = "${url}"\nheaders = ${JSON.stringify(parsedHeaders, null, 4)}\n${method !== "GET" && body ? `payload = ${body}\n\nresponse = requests.${method.toLowerCase()}(url, json=payload, headers=headers)\n` : `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)\n`}print(response.status_code)\nprint(response.json())`;
    }
    return "";
  }

  const snippet = generateCode();

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="w-full">
          <Field label="HTTP Method">
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </Select>
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Endpoint URL">
            <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint" />
          </Field>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Headers (JSON)">
          <TextArea rows={6} value={headers} onChange={(e) => setHeaders(e.target.value)} />
        </Field>
        <Field label="Request Body (JSON)">
          <TextArea rows={6} value={body} onChange={(e) => setBody(e.target.value)} disabled={method === "GET"} />
        </Field>
      </div>

      <div className="mt-4">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {(["fetch", "axios", "curl", "python"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab === "python" ? "Python requests" : tab}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <OutputBox value={snippet} rows={10} />
        </div>

        <div className="mt-3 flex justify-end">
          <CopyButton getText={() => snippet} label="Copy Snippet" />
        </div>
      </div>
    </ToolCard>
  );
}



/* ---------------- 41. API Endpoint Tester ---------------- */
export function ApiEndpointTester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState("GET");
  const [headersInput, setHeadersInput] = useState('{\n  "Accept": "application/json"\n}');
  const [bodyInput, setBodyInput] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }
    setLoading(true);
    setError("");
    setStatus(null);
    setResponseBody("");

    let headers: Record<string, string> = {};
    try {
      if (headersInput.trim()) headers = JSON.parse(headersInput);
    } catch (e) {
      setError("Invalid headers JSON");
      setLoading(false);
      return;
    }

    const startTime = performance.now();
    try {
      const options: RequestInit = {
        method,
        headers,
      };
      if (method !== "GET" && method !== "HEAD" && bodyInput.trim()) {
        options.body = bodyInput;
      }

      const res = await fetch(url, options);
      const duration = Math.round(performance.now() - startTime);
      setResponseTime(duration);
      setStatus(res.status);
      setStatusText(res.statusText || (res.status === 200 ? "OK" : ""));

      const hdrs: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        hdrs[key] = val;
      });
      setResponseHeaders(hdrs);

      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResponseBody(JSON.stringify(json, null, 2));
      } catch (e) {
        setResponseBody(text);
      }
    } catch (e) {
      setError("Request failed: " + (e instanceof Error ? e.message : String(e)) + " (Note: Cross-Origin CORS restrictions may block in-browser requests to APIs that do not allow CORS).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <Field label="Method">
            <Select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </Select>
          </Field>
        </div>
        <div className="sm:col-span-3">
          <Field label="Endpoint URL">
            <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/data" />
          </Field>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Request Headers (JSON)">
          <TextArea rows={5} value={headersInput} onChange={(e) => setHeadersInput(e.target.value)} />
        </Field>
        <Field label="Request Body (for POST / PUT / PATCH)">
          <TextArea rows={5} value={bodyInput} onChange={(e) => setBodyInput(e.target.value)} disabled={method === "GET"} placeholder='{"key": "value"}' />
        </Field>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="primary" onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send HTTP Request"}
        </Button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {status !== null && (
        <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                status >= 200 && status < 300
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : status >= 400
                  ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
              }`}
            >
              Status: {status} {statusText}
            </span>
            {responseTime !== null && <StatBadge label="Time" value={`${responseTime} ms`} />}
          </div>

          <Field label="Response Payload">
            <OutputBox value={responseBody} rows={12} />
          </Field>

          <div className="flex justify-end">
            <CopyButton getText={() => responseBody} label="Copy Response Body" />
          </div>
        </div>
      )}
    </ToolCard>
  );
}

/* ---------------- 42. Git Command Generator ---------------- */
export function GitCommandGenerator() {
  const [actionCategory, setActionCategory] = useState<"branch" | "undo" | "stash" | "remote" | "log">("branch");
  const [branchName, setBranchName] = useState("feature/user-auth");
  const [baseBranch, setBaseBranch] = useState("main");
  const [commitHash, setCommitHash] = useState("HEAD~1");
  const [remoteName, setRemoteName] = useState("origin");
  const [stashMessage, setStashMessage] = useState("WIP changes");

  function generateGitCommand() {
    if (actionCategory === "branch") {
      return `# Create and switch to a new branch\ngit checkout -b ${branchName || "feature/my-branch"}\n\n# Or using modern git switch\ngit switch -c ${branchName || "feature/my-branch"}\n\n# Push branch and set upstream tracking\ngit push -u ${remoteName} ${branchName || "feature/my-branch"}`;
    } else if (actionCategory === "undo") {
      return `# Undo last commit but keep changes in working directory (soft reset)\ngit reset --soft ${commitHash || "HEAD~1"}\n\n# Discard all local uncommitted changes completely (hard reset)\ngit reset --hard ${commitHash || "HEAD"}\n\n# Revert a published commit by creating a new inverse commit\ngit revert ${commitHash || "HEAD"}`;
    } else if (actionCategory === "stash") {
      return `# Save uncommitted changes with a descriptive message\ngit stash save "${stashMessage || "work-in-progress"}"\n\n# List all current stashes\ngit stash list\n\n# Apply the latest stash and keep it in stash list\ngit stash apply\n\n# Apply latest stash and remove it from stash list\ngit stash pop`;
    } else if (actionCategory === "remote") {
      return `# View configured remote repositories\ngit remote -v\n\n# Fetch all branches and prune deleted remote tracking branches\ngit fetch ${remoteName} --prune\n\n# Pull latest changes with rebase\ngit pull --rebase ${remoteName} ${baseBranch || "main"}`;
    } else if (actionCategory === "log") {
      return `# Visual one-line commit history graph\ngit log --graph --oneline --decorate --all\n\n# Show commits authored by author\ngit log --author="name" --stat\n\n# Show last 5 commits with file change summaries\ngit log -n 5 --stat`;
    }
    return "";
  }

  const cmd = generateGitCommand();

  return (
    <ToolCard>
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(["branch", "undo", "stash", "remote", "log"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActionCategory(cat)}
            className={`border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
              actionCategory === cat
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {cat === "branch" ? "Branch & Push" : cat === "undo" ? "Undo & Reset" : cat === "stash" ? "Stashing" : cat === "remote" ? "Remote & Sync" : "Log & History"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {actionCategory === "branch" && (
          <>
            <Field label="Branch Name">
              <TextInput value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="feature/new-ui" />
            </Field>
            <Field label="Remote Name">
              <TextInput value={remoteName} onChange={(e) => setRemoteName(e.target.value)} placeholder="origin" />
            </Field>
          </>
        )}

        {actionCategory === "undo" && (
          <>
            <Field label="Commit Target / Reference">
              <TextInput value={commitHash} onChange={(e) => setCommitHash(e.target.value)} placeholder="HEAD~1 or commit-hash" />
            </Field>
          </>
        )}

        {actionCategory === "stash" && (
          <>
            <Field label="Stash Description / Message">
              <TextInput value={stashMessage} onChange={(e) => setStashMessage(e.target.value)} placeholder="WIP auth implementation" />
            </Field>
          </>
        )}

        {actionCategory === "remote" && (
          <>
            <Field label="Remote Name">
              <TextInput value={remoteName} onChange={(e) => setRemoteName(e.target.value)} placeholder="origin" />
            </Field>
            <Field label="Base Branch">
              <TextInput value={baseBranch} onChange={(e) => setBaseBranch(e.target.value)} placeholder="main" />
            </Field>
          </>
        )}
      </div>

      <div className="mt-4">
        <Field label="Generated Git Commands">
          <OutputBox value={cmd} rows={8} />
        </Field>
        <div className="mt-3 flex justify-end">
          <CopyButton getText={() => cmd} label="Copy Commands" />
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 43. Gitignore Generator ---------------- */
export function GitignoreGenerator() {
  const templates: Record<string, string> = {
    "Node.js / Next.js": `# Node.js & Dependencies\nnode_modules/\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\n.pnpm-store/\n\n# Next.js & Build output\n.next/\nout/\nbuild/\ndist/\n\n# Environment files\n.env*.local\n.env.local\n.env.development.local\n.env.test.local\n.env.production.local\n\n# Vercel\n.vercel/\n\n# TypeScript cache\n*.tsbuildinfo\nnext-env.d.ts`,
    "Python": `# Python Byte-compiled\n__pycache__/\n*.py[cod]\n*$py.class\n\n# Virtual environments\nvirtualenv/\nenv/\nvenv/\nENV/\n.venv/\n\n# Distribution / packaging\nbuild/\ndist/\n*.egg-info/\n.installed.cfg\n*.egg\n\n# Unit test / coverage reports\n.coverage\nhtmlcov/\n.pytest_cache/\n.mypy_cache/`,
    "React / Vite": `# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\npnpm-debug.log*\n\n# Dependencies\nnode_modules/\n\n# Production build\ndist/\ndist-ssr/\n*.local\n\n# Editor directories\n.vscode/*\n!.vscode/extensions.json\n.idea\n*.suo\n*.ntvs*\n*.njsproj\n*.sln\n*.sw?`,
    "Java / Maven / Gradle": `# Compiled class file\n*.class\n\n# Log file\n*.log\n\n# Package Files #\n*.jar\n*.war\n*.nar\n*.ear\n*.zip\n*.tar.gz\n*.rar\n\n# Maven\ntarget/\npom.xml.tag\npom.xml.releaseBackup\n\n# Gradle\n.gradle/\nbuild/`,
    "Go": `# Binaries for programs and plugins\n*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n\n# Test binary, built with go test -c\n*.test\n\n# Output of the go coverage tool\n*.out\n\n# Dependency directories\nvendor/\nbin/`,
    "Rust": `# Generated by Cargo\n/target/\n\n# Backup files\n**/*.rs.bk\n\n# MSVC Windows\n*.pdb`,
    "OS (macOS, Windows, Linux)": `# macOS\n.DS_Store\n.AppleDouble\n.LSOverride\nIcon\r\r\n._*\n\n# Windows\nThumbs.db\nThumbs.db:encryptable\nehthumbs.db\nehthumbs_vista.db\n[Dd]esktop.ini\n$RECYCLE.BIN/\n\n# Linux\n*~\n.fuse_hidden*\n.directory`,
    "IDEs (VS Code & JetBrains)": `# Visual Studio Code\n.vscode/*\n!.vscode/settings.json\n!.vscode/tasks.json\n!.vscode/launch.json\n!.vscode/extensions.json\n.history/\n*.code-workspace\n\n# JetBrains (IntelliJ, WebStorm, PyCharm)\n.idea/\n*.iws\n*.iml\n*.ipr`,
    "Docker & Terraform": `# Docker\n.dockerignore\n*.local\n\n# Terraform\n.terraform/\n*.tfstate\n*.tfstate.*\ncrash.log\noverride.tf\noverride.tf.json\n*_override.tf\n*_override.tf.json\n.terraform.tfstate.lock.info`
  };

  const [selected, setSelected] = useState<string[]>(["Node.js / Next.js", "OS (macOS, Windows, Linux)", "IDEs (VS Code & JetBrains)"]);
  const [customRules, setCustomRules] = useState("# Custom project ignores\n.secrets/\n*.backup");

  function toggle(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const generated = selected
    .map((k) => `# =========================================================================\n# ${k}\n# =========================================================================\n${templates[k]}`)
    .concat(customRules.trim() ? [`# =========================================================================\n# Custom Rules\n# =========================================================================\n${customRules.trim()}`] : [])
    .join("\n\n");

  return (
    <ToolCard>
      <Field label="Select Stacks &amp; Environments to Ignore">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {Object.keys(templates).map((key) => {
            const isChecked = selected.includes(key);
            return (
              <label
                key={key}
                className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-semibold cursor-pointer transition ${
                  isChecked
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <input type="checkbox" checked={isChecked} onChange={() => toggle(key)} className="rounded" />
                {key}
              </label>
            );
          })}
        </div>
      </Field>

      <div className="mt-4">
        <Field label="Custom Rules">
          <TextArea rows={3} value={customRules} onChange={(e) => setCustomRules(e.target.value)} placeholder="Add any custom rules..." />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Generated .gitignore File">
          <OutputBox value={generated} rows={12} />
        </Field>

        <div className="mt-3 flex items-center justify-between">
          <StatBadge label="Rulesets Included" value={selected.length} />
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => generated} /><Button type="button" variant="secondary" onClick={() => downloadText(generated, ".gitignore", "text/plain")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 44. Git Commit Message Generator ---------------- */
export function GitCommitMessageGenerator() {
  const [type, setType] = useState("feat");
  const [scope, setScope] = useState("auth");
  const [subject, setSubject] = useState("add oauth2 login integration with Google and GitHub");
  const [body, setBody] = useState("Implements passport-based token exchange and adds automated session refresh cookies.");
  const [isBreaking, setIsBreaking] = useState(false);
  const [breakingDesc, setBreakingDesc] = useState("");
  const [issueRef, setIssueRef] = useState("Fixes #142");

  function buildCommit(): string {
    const scopePart = scope.trim() ? `(${scope.trim()})` : "";
    const breakingMark = isBreaking ? "!" : "";
    const header = `${type}${scopePart}${breakingMark}: ${subject.trim()}`;

    const parts = [header];
    if (body.trim()) {
      parts.push(body.trim());
    }
    if (isBreaking && breakingDesc.trim()) {
      parts.push(`BREAKING CHANGE: ${breakingDesc.trim()}`);
    }
    if (issueRef.trim()) {
      parts.push(issueRef.trim());
    }

    return parts.join("\n\n");
  }

  const commitMsg = buildCommit();
  const gitCmd = `git commit -m "${commitMsg.replace(/"/g, '\\"')}"`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Field label="Commit Type">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="feat">feat: A new feature</option>
              <option value="fix">fix: A bug fix</option>
              <option value="docs">docs: Documentation only</option>
              <option value="style">style: Code formatting / whitespace</option>
              <option value="refactor">refactor: Code restructuring</option>
              <option value="perf">perf: Performance improvements</option>
              <option value="test">test: Adding or fixing tests</option>
              <option value="build">build: Build system / dependencies</option>
              <option value="ci">ci: CI/CD workflow changes</option>
              <option value="chore">chore: Maintenance tasks</option>
            </Select>
          </Field>
        </div>
        <div>
          <Field label="Scope (Optional)">
            <TextInput value={scope} onChange={(e) => setScope(e.target.value)} placeholder="e.g. api, ui, db, auth" />
          </Field>
        </div>
        <div>
          <Field label="Issue Reference (Optional)">
            <TextInput value={issueRef} onChange={(e) => setIssueRef(e.target.value)} placeholder="e.g. Closes #123" />
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <Field label={`Short Description (${subject.length}/50 chars recommended)`}>
          <TextInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="imperative, lower-case, no period at end" />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Detailed Body / Motivation (Optional)">
          <TextArea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Explain the context and what problem this change solves..." />
        </Field>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <input type="checkbox" checked={isBreaking} onChange={(e) => setIsBreaking(e.target.checked)} className="rounded" />
          This is a Breaking Change
        </label>
        {isBreaking && (
          <div className="mt-2">
            <TextInput value={breakingDesc} onChange={(e) => setBreakingDesc(e.target.value)} placeholder="Describe breaking changes and migration steps..." />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Field label="Formatted Conventional Commit Message">
          <OutputBox value={commitMsg} rows={6} />
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
        <CopyButton getText={() => gitCmd} label="Copy git commit Command" />
        <CopyButton getText={() => commitMsg} label="Copy Raw Message" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 45. README Generator ---------------- */
export function ReadmeGenerator() {
  const [name, setName] = useState("AwesomeProject");
  const [desc, setDesc] = useState("A blazing-fast, modern developer toolbox and utilities hub.");
  const [license, setLicense] = useState("MIT");
  const [techStack, setTechStack] = useState("TypeScript, React, Next.js, Tailwind CSS");
  const [installCmd, setInstallCmd] = useState("npm install");
  const [startCmd, setStartCmd] = useState("npm run dev");
  const [features, setFeatures] = useState("100% Client-Side Privacy\nZero Latency Processing\nDark Mode & Responsive UI");

  function generateReadme(): string {
    const featureList = features.split("\n").filter((x): x is string => Boolean(x)).map(f => `- **${f}**`).join("\n");
    const techBadges = techStack.split(",").map(t => t.trim()).filter((x): x is string => Boolean(x)).map(t => "\`" + t + "\`").join(" · ");

    return `# ${name}

> ${desc}

[![License: ${license}](https://img.shields.io/badge/License-${license}-blue.svg)](LICENSE)
[![Status: Active](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](#)

---

## 🚀 Tech Stack
${techBadges}

---

## ✨ Features
${featureList}

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm package manager

### Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/username/${name.toLowerCase()}.git

# Navigate to project directory
cd ${name.toLowerCase()}

# Install dependencies
${installCmd}
\`\`\`

### Running Locally
\`\`\`bash
${startCmd}
\`\`\`

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

---

## 📄 License
This project is licensed under the **${license}** License.`;
  }

  const readme = generateReadme();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="License">
          <Select value={license} onChange={(e) => setLicense(e.target.value)}>
            <option value="MIT">MIT License</option>
            <option value="Apache-2.0">Apache 2.0</option>
            <option value="GPL-3.0">GNU GPL v3</option>
            <option value="BSD-3-Clause">BSD 3-Clause</option>
            <option value="ISC">ISC License</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Short Tagline / Description">
          <TextInput value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Tech Stack (comma-separated)">
          <TextInput value={techStack} onChange={(e) => setTechStack(e.target.value)} />
        </Field>
        <Field label="Features (one per line)">
          <TextArea rows={3} value={features} onChange={(e) => setFeatures(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Install Command">
          <TextInput value={installCmd} onChange={(e) => setInstallCmd(e.target.value)} />
        </Field>
        <Field label="Start Command">
          <TextInput value={startCmd} onChange={(e) => setStartCmd(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Generated README.md">
          <OutputBox value={readme} rows={12} />
        </Field>

        <div className="mt-3 flex items-center justify-between">
          <StatBadge label="Sections" value={6} />
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => readme} /><Button type="button" variant="secondary" onClick={() => downloadText(readme, "README.md", "text/markdown")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 46. Dockerfile Generator ---------------- */
export function DockerfileGenerator() {
  const [stack, setStack] = useState<"nextjs" | "node" | "python" | "go" | "nginx">("nextjs");
  const [port, setPort] = useState("3000");
  const [pkgManager, setPkgManager] = useState<"npm" | "pnpm" | "yarn">("pnpm");
  const [nodeVersion, setNodeVersion] = useState("20-alpine");

  function generateDockerfile(): string {
    if (stack === "nextjs") {
      return `# Multi-stage optimized Dockerfile for Next.js Standalone
FROM node:${nodeVersion} AS base

# Step 1: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ${pkgManager === "pnpm" ? "pnpm-lock.yaml" : pkgManager === "yarn" ? "yarn.lock" : "package-lock.json"} ./
${pkgManager === "pnpm" ? "RUN npm install -g pnpm && pnpm i --frozen-lockfile" : pkgManager === "yarn" ? "RUN yarn --frozen-lockfile" : "RUN npm ci"}

# Step 2: Build the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN ${pkgManager === "pnpm" ? "npm i -g pnpm && pnpm build" : pkgManager === "yarn" ? "yarn build" : "npm run build"}

# Step 3: Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=${port}
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE ${port}
CMD ["node", "server.js"]`;
    } else if (stack === "node") {
      return `FROM node:${nodeVersion} AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=${port}
EXPOSE ${port}
USER node
CMD ["npm", "start"]`;
    } else if (stack === "python") {
      return `# Python FastAPI / Flask Dockerfile
FROM python:3.11-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE ${port}
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${port}"]`;
    } else if (stack === "go") {
      return `# Multi-stage Go binary build
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
EXPOSE ${port}
CMD ["./server"]`;
    } else if (stack === "nginx") {
      return `# Static Website Nginx hosting
FROM nginx:alpine
COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE ${port}
CMD ["nginx", "-g", "daemon off;"]`;
    }
    return "";
  }

  const dockerfile = generateDockerfile();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Field label="Application Stack">
            <Select value={stack} onChange={(e) => setStack(e.target.value as any)}>
              <option value="nextjs">Next.js (Standalone Multi-stage)</option>
              <option value="node">Node.js Express / API</option>
              <option value="python">Python (FastAPI / Flask)</option>
              <option value="go">Go Binary (Alpine)</option>
              <option value="nginx">Static Site (Nginx Alpine)</option>
            </Select>
          </Field>
        </div>
        <div>
          <Field label="Port">
            <TextInput value={port} onChange={(e) => setPort(e.target.value)} placeholder="3000" />
          </Field>
        </div>
        <div>
          <Field label="Package Manager">
            <Select value={pkgManager} onChange={(e) => setPkgManager(e.target.value as any)}>
              <option value="pnpm">pnpm</option>
              <option value="npm">npm</option>
              <option value="yarn">yarn</option>
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <Field label="Generated Dockerfile">
          <OutputBox value={dockerfile} rows={14} />
        </Field>

        <div className="mt-3 flex justify-end">
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => dockerfile} /><Button type="button" variant="secondary" onClick={() => downloadText(dockerfile, "Dockerfile", "text/plain")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 47. Docker Compose Generator ---------------- */
export function DockerComposeGenerator() {
  const [appName, setAppName] = useState("web");
  const [appPort, setAppPort] = useState("3000");
  const [db, setDb] = useState<"postgres" | "mysql" | "mongo" | "none">("postgres");
  const [includeRedis, setIncludeRedis] = useState(true);
  const [includeNginx, setIncludeNginx] = useState(false);

  function generateCompose(): string {
    let services = `services:
  ${appName}:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "${appPort}:${appPort}"
    environment:
      - PORT=${appPort}
      - NODE_ENV=production`;

    if (db === "postgres") {
      services += `
      - DATABASE_URL=postgres://postgres:secretpassword@postgres:5432/${appName}_db
    depends_on:
      - postgres`;
    } else if (db === "mysql") {
      services += `
      - DATABASE_URL=mysql://root:secretpassword@mysql:3306/${appName}_db
    depends_on:
      - mysql`;
    }

    if (includeRedis) {
      services += `
      - REDIS_URL=redis://redis:6379`;
    }

    if (db === "postgres") {
      services += `

  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: ${appName}_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data`;
    } else if (db === "mysql") {
      services += `

  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: secretpassword
      MYSQL_DATABASE: ${appName}_db
    ports:
      - "3306:3306"
    volumes:
      - mysqldata:/var/lib/mysql`;
    } else if (db === "mongo") {
      services += `

  mongo:
    image: mongo:latest
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db`;
    }

    if (includeRedis) {
      services += `

  redis:
    image: redis:alpine
    restart: always
    ports:
      - "6379:6379"`;
    }

    if (includeNginx) {
      services += `

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - ${appName}`;
    }

    let volumes = "";
    if (db === "postgres") volumes = `\nvolumes:\n  pgdata:`;
    else if (db === "mysql") volumes = `\nvolumes:\n  mysqldata:`;
    else if (db === "mongo") volumes = `\nvolumes:\n  mongodata:`;

    return services + volumes;
  }

  const compose = generateCompose();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="App Service Name">
          <TextInput value={appName} onChange={(e) => setAppName(e.target.value)} />
        </Field>
        <Field label="App Port">
          <TextInput value={appPort} onChange={(e) => setAppPort(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Database Service">
          <Select value={db} onChange={(e) => setDb(e.target.value as any)}>
            <option value="postgres">PostgreSQL 16</option>
            <option value="mysql">MySQL 8.0</option>
            <option value="mongo">MongoDB</option>
            <option value="none">None</option>
          </Select>
        </Field>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={includeRedis} onChange={(e) => setIncludeRedis(e.target.checked)} className="rounded" />
            Include Redis Cache
          </label>
        </div>
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={includeNginx} onChange={(e) => setIncludeNginx(e.target.checked)} className="rounded" />
            Include Nginx Reverse Proxy
          </label>
        </div>
      </div>

      <div className="mt-4">
        <Field label="Generated docker-compose.yml">
          <OutputBox value={compose} rows={14} />
        </Field>

        <div className="mt-3 flex justify-end">
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => compose} /><Button type="button" variant="secondary" onClick={() => downloadText(compose, "docker-compose.yml", "text/yaml")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 48. Nginx Config Generator ---------------- */
export function NginxConfigGenerator() {
  const [domain, setDomain] = useState("example.com");
  const [type, setType] = useState<"proxy" | "spa" | "static">("proxy");
  const [backendPort, setBackendPort] = useState("3000");
  const [rootPath, setRootPath] = useState("/var/www/html");
  const [enableSsl, setEnableSsl] = useState(true);
  const [enableGzip, setEnableGzip] = useState(true);

  function generateNginx(): string {
    let conf = "";
    if (enableSsl) {
      conf += `# HTTP Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${domain} www.${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${domain} www.${domain};

    # SSL Certificates (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
`;
    } else {
      conf += `server {
    listen 80;
    listen [::]:80;
    server_name ${domain} www.${domain};
`;
    }

    if (enableGzip) {
      conf += `
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/json;
`;
    }

    if (type === "proxy") {
      conf += `
    location / {
        proxy_pass http://127.0.0.1:${backendPort};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }`;
    } else if (type === "spa") {
      conf += `
    root ${rootPath};
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public";
    }`;
    } else {
      conf += `
    root ${rootPath};
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }`;
    }

    conf += `
}`;
    return conf;
  }

  const nginxConf = generateNginx();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Domain Name">
          <TextInput value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
        </Field>
        <Field label="Configuration Mode">
          <Select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="proxy">Reverse Proxy (Node/Next/Python App)</option>
            <option value="spa">Single Page App (React / Vue with HTML5 routing)</option>
            <option value="static">Static HTML Site</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {type === "proxy" ? (
          <Field label="Backend Upstream Port">
            <TextInput value={backendPort} onChange={(e) => setBackendPort(e.target.value)} placeholder="3000" />
          </Field>
        ) : (
          <Field label="Web Root Directory">
            <TextInput value={rootPath} onChange={(e) => setRootPath(e.target.value)} placeholder="/var/www/html" />
          </Field>
        )}

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={enableSsl} onChange={(e) => setEnableSsl(e.target.checked)} className="rounded" />
            Enable HTTPS / SSL Block
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={enableGzip} onChange={(e) => setEnableGzip(e.target.checked)} className="rounded" />
            Enable Gzip
          </label>
        </div>
      </div>

      <div className="mt-4">
        <Field label="Generated Nginx Configuration">
          <OutputBox value={nginxConf} rows={14} />
        </Field>

        <div className="mt-3 flex justify-end">
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => nginxConf} /><Button type="button" variant="secondary" onClick={() => downloadText(nginxConf, "nginx.conf", "text/plain")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 49. GitHub Actions Workflow Generator ---------------- */
export function GithubActionsGenerator() {
  const [workflowName, setWorkflowName] = useState("CI / CD Pipeline");
  const [branch, setBranch] = useState("main");
  const [stack, setStack] = useState<"node" | "python" | "go" | "docker">("node");
  const [runTests, setRunTests] = useState(true);
  const [runLint, setRunLint] = useState(true);
  const [runBuild, setRunBuild] = useState(true);

  function generateWorkflow(): string {
    let steps = "";
    if (stack === "node") {
      steps = `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci`;

      if (runLint) {
        steps += `\n\n      - name: Run Linter\n        run: npm run lint`;
      }
      if (runTests) {
        steps += `\n\n      - name: Run Tests\n        run: npm test`;
      }
      if (runBuild) {
        steps += `\n\n      - name: Build Project\n        run: npm run build`;
      }
    } else if (stack === "python") {
      steps = `      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt`;

      if (runLint) steps += `\n\n      - name: Lint with flake8\n        run: flake8 .`;
      if (runTests) steps += `\n\n      - name: Test with pytest\n        run: pytest`;
    } else if (stack === "go") {
      steps = `      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true

      - name: Build and Test
        run: |
          go test -v ./...
          go build -v ./...`;
    } else if (stack === "docker") {
      steps = `      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: app:latest`;
    }

    return `name: ${workflowName}

on:
  push:
    branches: [ ${branch} ]
  pull_request:
    branches: [ ${branch} ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

${steps}`;
  }

  const workflow = generateWorkflow();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Field label="Workflow Name">
            <TextInput value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
          </Field>
        </div>
        <div>
          <Field label="Target Branch">
            <TextInput value={branch} onChange={(e) => setBranch(e.target.value)} />
          </Field>
        </div>
        <div>
          <Field label="Stack / Runner Setup">
            <Select value={stack} onChange={(e) => setStack(e.target.value as any)}>
              <option value="node">Node.js (npm / TypeScript)</option>
              <option value="python">Python (pip / pytest)</option>
              <option value="go">Go (Go Modules)</option>
              <option value="docker">Docker Buildx</option>
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={runLint} onChange={(e) => setRunLint(e.target.checked)} className="rounded" />
          Run Linter Step
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={runTests} onChange={(e) => setRunTests(e.target.checked)} className="rounded" />
          Run Automated Tests
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={runBuild} onChange={(e) => setRunBuild(e.target.checked)} className="rounded" />
          Run Production Build
        </label>
      </div>

      <div className="mt-4">
        <Field label="Generated .github/workflows/ci.yml">
          <OutputBox value={workflow} rows={14} />
        </Field>

        <div className="mt-3 flex justify-end">
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => workflow} /><Button type="button" variant="secondary" onClick={() => downloadText(workflow, "ci.yml", "text/yaml")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 50. Kubernetes YAML Generator ---------------- */
export function KubernetesYamlGenerator() {
  const [appName, setAppName] = useState("web-service");
  const [image, setImage] = useState("myregistry/web-service:v1.0.0");
  const [replicas, setReplicas] = useState("3");
  const [containerPort, setContainerPort] = useState("3000");
  const [serviceType, setServiceType] = useState<"ClusterIP" | "NodePort" | "LoadBalancer">("ClusterIP");
  const [includeIngress, setIncludeIngress] = useState(true);
  const [ingressHost, setIngressHost] = useState("api.example.com");

  function generateK8s(): string {
    let yaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  labels:
    app: ${appName}
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${image}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: ${containerPort}
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: ${containerPort}
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /api/health
            port: ${containerPort}
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-service
spec:
  type: ${serviceType}
  selector:
    app: ${appName}
  ports:
    - protocol: TCP
      port: 80
      targetPort: ${containerPort}`;

    if (includeIngress) {
      yaml += `
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${appName}-ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - ${ingressHost}
    secretName: ${appName}-tls
  rules:
  - host: ${ingressHost}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${appName}-service
            port:
              number: 80`;
    }

    return yaml;
  }

  const k8s = generateK8s();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="App / Deployment Name">
          <TextInput value={appName} onChange={(e) => setAppName(e.target.value)} />
        </Field>
        <Field label="Container Image">
          <TextInput value={image} onChange={(e) => setImage(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Replica Count">
          <TextInput type="number" value={replicas} onChange={(e) => setReplicas(e.target.value)} />
        </Field>
        <Field label="Container Port">
          <TextInput value={containerPort} onChange={(e) => setContainerPort(e.target.value)} />
        </Field>
        <Field label="Service Type">
          <Select value={serviceType} onChange={(e) => setServiceType(e.target.value as any)}>
            <option value="ClusterIP">ClusterIP (Internal)</option>
            <option value="LoadBalancer">LoadBalancer (Cloud Provider)</option>
            <option value="NodePort">NodePort</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          <input type="checkbox" checked={includeIngress} onChange={(e) => setIncludeIngress(e.target.checked)} className="rounded" />
          Include Ingress Manifest with TLS
        </label>
        {includeIngress && (
          <div className="mt-2">
            <TextInput value={ingressHost} onChange={(e) => setIngressHost(e.target.value)} placeholder="app.example.com" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <Field label="Generated Kubernetes Manifest">
          <OutputBox value={k8s} rows={14} />
        </Field>

        <div className="mt-3 flex justify-end">
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => k8s} /><Button type="button" variant="secondary" onClick={() => downloadText(k8s, "deployment.yaml", "text/yaml")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 51. Package.json Generator ---------------- */
export function PackageJsonGenerator() {
  const [pkgName, setPkgName] = useState("my-app");
  const [version, setVersion] = useState("1.0.0");
  const [description, setDescription] = useState("A modern web application");
  const [author, setAuthor] = useState("Jane Developer <jane@example.com>");
  const [license, setLicense] = useState("MIT");
  const [type, setType] = useState<"module" | "commonjs">("module");
  const [includeTs, setIncludeTs] = useState(true);
  const [includeLint, setIncludeLint] = useState(true);

  function generatePackageJson(): string {
    const pkgObj: Record<string, any> = {
      name: pkgName.trim() || "unnamed-project",
      version: version.trim() || "1.0.0",
      description: description.trim(),
      type: type,
      main: type === "module" ? "dist/index.js" : "index.js",
      scripts: {
        dev: "tsx watch src/index.ts",
        build: "tsc",
        start: "node dist/index.js",
      },
      keywords: ["utility", "web"],
      author: author.trim(),
      license: license,
      dependencies: {
        "dotenv": "^16.4.5"
      },
      devDependencies: {}
    };

    if (includeTs) {
      pkgObj.devDependencies["typescript"] = "^5.4.5";
      pkgObj.devDependencies["@types/node"] = "^20.12.7";
      pkgObj.devDependencies["tsx"] = "^4.7.2";
    }

    if (includeLint) {
      pkgObj.scripts["lint"] = "eslint .";
      pkgObj.devDependencies["eslint"] = "^9.0.0";
    }

    return JSON.stringify(pkgObj, null, 2);
  }

  const pkgJson = generatePackageJson();

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Field label="Package Name">
            <TextInput value={pkgName} onChange={(e) => setPkgName(e.target.value)} />
          </Field>
        </div>
        <div>
          <Field label="Version">
            <TextInput value={version} onChange={(e) => setVersion(e.target.value)} />
          </Field>
        </div>
        <div>
          <Field label="Module Type">
            <Select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="module">ES Modules ("type": "module")</option>
              <option value="commonjs">CommonJS</option>
            </Select>
          </Field>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Description">
          <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <Field label="Author">
          <TextInput value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={includeTs} onChange={(e) => setIncludeTs(e.target.checked)} className="rounded" />
          Include TypeScript &amp; Types
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={includeLint} onChange={(e) => setIncludeLint(e.target.checked)} className="rounded" />
          Include ESLint
        </label>
      </div>

      <div className="mt-4">
        <Field label="Generated package.json">
          <OutputBox value={pkgJson} rows={12} />
        </Field>

        <div className="mt-3 flex justify-end">
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => pkgJson} /><Button type="button" variant="secondary" onClick={() => downloadText(pkgJson, "package.json", "application/json")}>⬇️ Download</Button></div>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 52. Environment Variables Generator / Formatter ---------------- */
export function EnvGenerator() {
  const [input, setInput] = useState(`# Server Config\nPORT=3000\nNODE_ENV=production\n\n# Database Secrets\nDATABASE_URL="postgres://user:super_secret_pw@localhost:5432/mydb"\nDB_PASSWORD=mysecretpassword123\n\n# API Keys\nOPENAI_API_KEY=sk-proj-abc123xyz456\nSTRIPE_SECRET_KEY=sk_test_51Abcdef`);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"example" | "sort" | "json">("example");

  function processEnv() {
    const lines = input.split("\n");
    if (mode === "example") {
      const sanitized = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return line;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) return line;
        const key = trimmed.slice(0, eqIdx);
        let placeholder = "your_" + key.toLowerCase();
        if (/secret|key|token|password|pwd|auth/i.test(key)) {
          placeholder = "YOUR_" + key.toUpperCase();
        } else if (/port/i.test(key)) {
          placeholder = "3000";
        } else if (/url|uri|host/i.test(key)) {
          placeholder = "https://example.com";
        }
        return `${key}=${placeholder}`;
      });
      setOutput(sanitized.join("\n"));
    } else if (mode === "sort") {
      const vars: string[] = [];
      const comments: string[] = [];
      lines.forEach((l) => {
        const t = l.trim();
        if (t.startsWith("#")) comments.push(l);
        else if (t.includes("=")) vars.push(t);
      });
      vars.sort();
      setOutput(vars.join("\n"));
    } else if (mode === "json") {
      const obj: Record<string, string> = {};
      lines.forEach((l) => {
        const t = l.trim();
        if (!t || t.startsWith("#")) return;
        const eqIdx = t.indexOf("=");
        if (eqIdx !== -1) {
          const k = t.slice(0, eqIdx).trim();
          let v = t.slice(eqIdx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          obj[k] = v;
        }
      });
      setOutput(JSON.stringify(obj, null, 2));
    }
  }

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Raw .env Content">
          <TextArea rows={12} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste .env file contents..." />
        </Field>
        <Field label="Processed Output">
          <OutputBox value={output} rows={12} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-64">
          <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="example">Generate Safe .env.example (Mask Secrets)</option>
            <option value="sort">Sort Alphabetically</option>
            <option value="json">Export as JSON</option>
          </Select>
        </div>
        <Button variant="primary" onClick={processEnv}>Process .env</Button>
      </div>

      {output && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
          <StatBadge label="Variables Processed" value={output.split("\n").filter(l => l.includes("=")).length} />
          <div className="flex flex-wrap gap-2"><CopyButton getText={() => output} /><Button type="button" variant="secondary" onClick={() => downloadText(output, mode === "example" ? ".env.example" : mode === "json" ? "env.json" : ".env", "text/plain")}>⬇️ Download</Button></div>
        </div>
      )}
    </ToolCard>
  );
}


export const developerComponents: ComponentRegistry = {
  JsonFormatter,
  JsonToCsv,
  CsvToJson,
  JsonToXml,
  XmlToJson,
  Base64Tool,
  JwtDecoder,
  UuidGenerator,
  UrlEncodeDecode,
  HtmlEncodeDecode,
  SqlFormatter,
  RegexTester,
  CronGenerator,
  CodeMinifier,
  YamlJsonConverter,
  Sha256Generator,
  Md5Generator,
  CurlConverter,
  GraphqlFormatter,
  ChmodCalculator,
  HtaccessRedirectGenerator,
  DiffChecker,
  HtmlFormatter,
  CssFormatter,
  JavascriptFormatter,
  TypescriptFormatter,
  JsonSchemaValidator,
  JsonPathTester,
  XmlFormatter,
  XmlValidator,
  XpathTester,
  HtmlValidator,
  CssSelectorTester,
  JavascriptEscape,
  UrlParser,
  UserAgentParser,
  UnixTimestampConverter,
  UnixTimestampGenerator,
  HttpHeadersParser,
  HttpRequestGenerator,
  ApiEndpointTester,
  GitCommandGenerator,
  GitignoreGenerator,
  GitCommitMessageGenerator,
  ReadmeGenerator,
  DockerfileGenerator,
  DockerComposeGenerator,
  NginxConfigGenerator,
  GithubActionsGenerator,
  KubernetesYamlGenerator,
  PackageJsonGenerator,
  EnvGenerator,
};
