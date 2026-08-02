"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { diffLines, diffWords } from "diff";
import {
  Alert,
  Button,
  CopyButton,
  Field,
  OutputBox,
  Select,
  StatBadge,
  TextArea,
  TextInput,
  ToolCard,
  downloadText,
} from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* ---------------- Word Counter ---------------- */
export function WordCounter() {
  const [text, setText] = useState("");
  const words = (text.trim().match(/\S+/g) || []).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const readingMin = Math.max(1, Math.round(words / 220));

  return (
    <ToolCard>
      <TextArea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing or paste your text…" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        <StatBadge label="Words" value={words} />
        <StatBadge label="Characters" value={chars} />
        <StatBadge label="No spaces" value={charsNoSpace} />
        <StatBadge label="Sentences" value={sentences} />
        <StatBadge label="Paragraphs" value={paragraphs} />
        <StatBadge label="Reading time" value={`${readingMin} min`} />
      </div>
    </ToolCard>
  );
}

/* ---------------- Case Converter ---------------- */
export function CaseConverter() {
  const [text, setText] = useState("The Quick Brown Fox");
  const [result, setResult] = useState("");

  function convert(kind: string) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    switch (kind) {
      case "upper": setResult(text.toUpperCase()); break;
      case "lower": setResult(text.toLowerCase()); break;
      case "title": setResult(words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")); break;
      case "sentence": setResult(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (m) => m.toUpperCase())); break;
      case "camel": setResult(words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join("")); break;
      case "pascal": setResult(words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("")); break;
      case "snake": setResult(words.map((w) => w.toLowerCase()).join("_")); break;
      case "kebab": setResult(words.map((w) => w.toLowerCase()).join("-")); break;
    }
  }

  return (
    <ToolCard>
      <Field label="Input text"><TextArea rows={5} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <div className="my-4 flex flex-wrap gap-2">
        {[
          ["upper", "UPPERCASE"], ["lower", "lowercase"], ["title", "Title Case"], ["sentence", "Sentence case"],
          ["camel", "camelCase"], ["pascal", "PascalCase"], ["snake", "snake_case"], ["kebab", "kebab-case"],
        ].map(([k, l]) => (
          <Button key={k} variant="secondary" onClick={() => convert(k)}>{l}</Button>
        ))}
      </div>
      <OutputBox value={result} rows={5} />
      <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
    </ToolCard>
  );
}

/* ---------------- Remove Duplicate Lines ---------------- */
export function RemoveDuplicateLines() {
  const [text, setText] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [trim, setTrim] = useState(true);
  const [result, setResult] = useState("");
  const [removedCount, setRemovedCount] = useState(0);

  function run() {
    const lines = text.split("\n");
    const seen = new Set<string>();
    const out: string[] = [];
    let removed = 0;
    for (const raw of lines) {
      const line = trim ? raw.trim() : raw;
      const key = caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) { removed++; continue; }
      seen.add(key);
      out.push(line);
    }
    setResult(out.join("\n"));
    setRemovedCount(removed);
  }

  return (
    <ToolCard>
      <TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…" />
      <div className="my-3 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} /> Case-insensitive</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim whitespace</label>
      </div>
      <Button onClick={run}>Remove Duplicates</Button>
      {result || removedCount > 0 ? (
        <div className="mt-4">
          <StatBadge label="Duplicates removed" value={removedCount} />
          <div className="mt-2"><OutputBox value={result} rows={10} /></div>
          <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Line Sorter ---------------- */
export function LineSorter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  function sort(mode: string) {
    let lines = text.split("\n");
    if (mode === "az") lines = lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    else if (mode === "za") lines = lines.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    else if (mode === "numeric") lines = lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
    else if (mode === "length") lines = lines.sort((a, b) => a.length - b.length);
    else if (mode === "random") lines = lines.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);
    setResult(lines.join("\n"));
  }

  return (
    <ToolCard>
      <TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…" />
      <div className="my-3 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => sort("az")}>A → Z</Button>
        <Button variant="secondary" onClick={() => sort("za")}>Z → A</Button>
        <Button variant="secondary" onClick={() => sort("numeric")}>Numeric</Button>
        <Button variant="secondary" onClick={() => sort("length")}>By length</Button>
        <Button variant="secondary" onClick={() => sort("random")}>Random shuffle</Button>
      </div>
      <OutputBox value={result} rows={10} />
      <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
    </ToolCard>
  );
}

/* ---------------- Text Diff Checker ---------------- */
export function TextDiffChecker() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [mode, setMode] = useState<"line" | "word">("word");
  const parts = useMemo(() => (mode === "line" ? diffLines(a, b) : diffWords(a, b)), [a, b, mode]);

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Original text"><TextArea rows={10} value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="Revised text"><TextArea rows={10} value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </div>
      <div className="my-4 flex gap-2">
        <Button variant={mode === "word" ? "primary" : "ghost"} onClick={() => setMode("word")}>Word diff</Button>
        <Button variant={mode === "line" ? "primary" : "ghost"} onClick={() => setMode("line")}>Line diff</Button>
      </div>
      <div className="whitespace-pre-wrap rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700">
        {parts.map((p, i) => (
          <span key={i} className={p.added ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : p.removed ? "bg-red-100 text-red-800 line-through dark:bg-red-950 dark:text-red-300" : ""}>
            {p.value}
          </span>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- Markdown to HTML ---------------- */
export function MarkdownToHtml() {
  const [md, setMd] = useState("## Getting Started\n\nInstall with `npm install example`.\n\n- Fast\n- Simple\n- **Free**");
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Markdown"><TextArea rows={12} value={md} onChange={(e) => setMd(e.target.value)} /></Field>
        <Field label="HTML output"><OutputBox value={html} rows={12} /></Field>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">Live preview</p>
        <div className="prose max-w-none rounded-lg border border-slate-200 p-4 dark:border-slate-700 dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => html} />
        <Button onClick={() => downloadText("converted.html", html, "text/html")}>⬇️ Download</Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- HTML to Markdown ---------------- */
export function HtmlToMarkdown() {
  const [html, setHtml] = useState("<h2>Getting Started</h2><p>Install with <code>npm install example</code>.</p>");
  const md = useMemo(() => {
    try {
      const service = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
      return service.turndown(html);
    } catch {
      return "";
    }
  }, [html]);

  return (
    <ToolCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="HTML"><TextArea rows={12} value={html} onChange={(e) => setHtml(e.target.value)} /></Field>
        <Field label="Markdown output"><OutputBox value={md} rows={12} /></Field>
      </div>
      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => md} />
        <Button onClick={() => downloadText("converted.md", md)}>⬇️ Download</Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- Reverse Text ---------------- */
export function ReverseTextGenerator() {
  const [text, setText] = useState("Hello World");
  const [mode, setMode] = useState<"char" | "word" | "line">("char");

  const result = useMemo(() => {
    if (mode === "char") return text.split("").reverse().join("");
    if (mode === "word") return text.split(/\s+/).reverse().join(" ");
    return text.split("\n").reverse().join("\n");
  }, [text, mode]);

  return (
    <ToolCard>
      <TextArea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="my-3 flex gap-2">
        <Button variant={mode === "char" ? "primary" : "ghost"} onClick={() => setMode("char")}>By character</Button>
        <Button variant={mode === "word" ? "primary" : "ghost"} onClick={() => setMode("word")}>By word</Button>
        <Button variant={mode === "line" ? "primary" : "ghost"} onClick={() => setMode("line")}>By line</Button>
      </div>
      <OutputBox value={result} rows={6} />
      <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
    </ToolCard>
  );
}

/* ---------------- Lorem Ipsum Generator ---------------- */
const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function loremSentence() {
  const len = 6 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
function loremParagraph() {
  const sentences = 4 + Math.floor(Math.random() * 3);
  return Array.from({ length: sentences }, loremSentence).join(" ");
}

export function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState("");

  function generate() {
    if (unit === "words") {
      setResult(Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(" "));
    } else if (unit === "sentences") {
      setResult(Array.from({ length: count }, loremSentence).join(" "));
    } else {
      setResult(Array.from({ length: count }, loremParagraph).join("\n\n"));
    }
  }

  return (
    <ToolCard>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Field label="Unit">
          <Select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </Select>
        </Field>
        <Field label="Count"><TextInput type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} /></Field>
        <div className="flex items-end"><Button onClick={generate}>Generate</Button></div>
      </div>
      <OutputBox value={result} rows={10} />
      <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
    </ToolCard>
  );
}

/* ---------------- Find and Replace ---------------- */
export function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [result, setResult] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  function run() {
    try {
      let n = 0;
      if (useRegex) {
        const re = new RegExp(find, caseSensitive ? "g" : "gi");
        setResult(text.replace(re, (...args) => { n++; return replace; }));
      } else {
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(escaped, caseSensitive ? "g" : "gi");
        setResult(text.replace(re, () => { n++; return replace; }));
      }
      setCount(n);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid pattern");
    }
  }

  return (
    <ToolCard>
      <TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text…" />
      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <Field label="Find"><TextInput value={find} onChange={(e) => setFind(e.target.value)} /></Field>
        <Field label="Replace with"><TextInput value={replace} onChange={(e) => setReplace(e.target.value)} /></Field>
      </div>
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} /> Case-sensitive</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} /> Use regex</label>
      </div>
      <Button onClick={run}>Replace All</Button>
      {error ? <div className="mt-3"><Alert type="error">{error}</Alert></div> : null}
      {count !== null ? (
        <div className="mt-4">
          <StatBadge label="Replacements made" value={count} />
          <div className="mt-2"><OutputBox value={result} rows={10} /></div>
          <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Remove Extra Spaces ---------------- */
export function RemoveExtraSpaces() {
  const [text, setText] = useState("");
  const [collapseSpaces, setCollapseSpaces] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [collapseBlank, setCollapseBlank] = useState(true);
  const [removeBlank, setRemoveBlank] = useState(false);
  const [result, setResult] = useState("");

  function clean() {
    let lines = text.split("\n");
    if (trimLines) lines = lines.map((l) => l.trim());
    if (collapseSpaces) lines = lines.map((l) => l.replace(/[ \t]+/g, " "));
    let out = lines.join("\n");
    if (removeBlank) out = out.split("\n").filter((l) => l.trim()).join("\n");
    else if (collapseBlank) out = out.replace(/\n{3,}/g, "\n\n");
    setResult(out);
  }

  return (
    <ToolCard>
      <TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="my-3 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={collapseSpaces} onChange={(e) => setCollapseSpaces(e.target.checked)} /> Collapse multiple spaces</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} /> Trim line whitespace</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={collapseBlank} onChange={(e) => setCollapseBlank(e.target.checked)} /> Collapse blank lines</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={removeBlank} onChange={(e) => setRemoveBlank(e.target.checked)} /> Remove blank lines entirely</label>
      </div>
      <Button onClick={clean}>Clean Text</Button>
      {result ? (
        <div className="mt-4">
          <OutputBox value={result} rows={10} />
          <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

/* ---------------- Line Break Remover ---------------- */
export function LineBreakRemover() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"remove" | "space" | "comma">("space");
  const [preserveParagraphs, setPreserveParagraphs] = useState(true);
  const [result, setResult] = useState("");

  function run() {
    let value = text;
    if (preserveParagraphs) {
      const paragraphs = value.split(/\n\s*\n/);
      const joiner = mode === "remove" ? "" : mode === "comma" ? ", " : " ";
      value = paragraphs.map((p) => p.split("\n").join(joiner)).join("\n\n");
    } else {
      const joiner = mode === "remove" ? "" : mode === "comma" ? ", " : " ";
      value = value.split("\n").join(joiner);
    }
    setResult(value);
  }

  return (
    <ToolCard>
      <TextArea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <Field label="Replace line breaks with">
          <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option value="space">Space</option>
            <option value="comma">Comma</option>
            <option value="remove">Nothing (remove)</option>
          </Select>
        </Field>
        <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={preserveParagraphs} onChange={(e) => setPreserveParagraphs(e.target.checked)} /> Preserve paragraph breaks</label>
      </div>
      <Button onClick={run}>Convert</Button>
      {result ? (
        <div className="mt-4">
          <OutputBox value={result} rows={8} />
          <div className="mt-2 flex gap-2"><CopyButton getText={() => result} /></div>
        </div>
      ) : null}
    </ToolCard>
  );
}

export const textComponents: ComponentRegistry = {
  WordCounter,
  CaseConverter,
  RemoveDuplicateLines,
  LineSorter,
  TextDiffChecker,
  MarkdownToHtml,
  HtmlToMarkdown,
  ReverseTextGenerator,
  LoremIpsumGenerator,
  FindReplace,
  RemoveExtraSpaces,
  LineBreakRemover,
};
