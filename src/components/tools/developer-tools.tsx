"use client";

import { useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import * as yaml from "js-yaml";
import { format as sqlFormat } from "sql-formatter";
import { diffLines, diffWords } from "diff";
import Papa from "papaparse";
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

  function convert() {
    try {
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

  function convert() {
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

  function run() {
    try {
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

  function toJson() {
    try {
      const obj = yaml.load(input);
      setOutput(JSON.stringify(obj, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid YAML");
    }
  }
  function toYaml() {
    try {
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
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const hash = useMemo(() => (text ? CryptoJS.SHA256(text).toString() : ""), [text]);

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
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const hash = useMemo(() => (text ? CryptoJS.MD5(text).toString() : ""), [text]);

  async function hashFile(f: File) {
    setFileName(f.name);
    const buf = await f.arrayBuffer();
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

  const parts = useMemo(() => (mode === "line" ? diffLines(a, b) : diffWords(a, b)), [a, b, mode]);

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
};
