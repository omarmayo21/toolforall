"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CopyButton, Field, OutputBox, Select, StatBadge, TextArea, TextInput, ToolCard } from "./ui";
import { TextXform, num, N } from "./calc-kit";

const X = (fn: (s: string) => string, placeholder: string, rows = 6) => () => <TextXform fn={fn} placeholder={placeholder} rows={rows} />;

function Modes({ modes, placeholder }: { modes: [string, string, (s: string) => string][]; placeholder: string }) {
  const [m, setM] = useState(modes[0][0]);
  const f = modes.find((x) => x[0] === m)![2];
  return (
    <div className="space-y-3">
      <Select value={m} onChange={(e) => setM(e.target.value)}>{modes.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Select>
      <TextXform key={m} fn={f} placeholder={placeholder} />
    </div>
  );
}

/* fancy text */
const mapRange = (s: string, up: number, lo: number, dg?: number) => [...s].map((c) => { const k = c.codePointAt(0)!; if (k >= 65 && k <= 90) return String.fromCodePoint(up + k - 65); if (k >= 97 && k <= 122) return String.fromCodePoint(lo + k - 97); if (dg !== undefined && k >= 48 && k <= 57) return String.fromCodePoint(dg + k - 48); return c; }).join("");
const SMALLCAPS: Record<string, string> = { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" };
const circled = (s: string) => [...s].map((c) => { const k = c.charCodeAt(0); if (k >= 65 && k <= 90) return String.fromCodePoint(0x24b6 + k - 65); if (k >= 97 && k <= 122) return String.fromCodePoint(0x24d0 + k - 97); if (k >= 49 && k <= 57) return String.fromCodePoint(0x2460 + k - 49); return c; }).join("");
const STYLES: [string, (s: string) => string][] = [
  ["Bold", (s) => mapRange(s, 0x1d400, 0x1d41a, 0x1d7ce)], ["Italic", (s) => mapRange(s, 0x1d434, 0x1d44e).replace(/h/g, "ℎ")], ["Bold italic", (s) => mapRange(s, 0x1d468, 0x1d482)],
  ["Script", (s) => mapRange(s, 0x1d49c, 0x1d4b6)], ["Bold script", (s) => mapRange(s, 0x1d4d0, 0x1d4ea)], ["Fraktur", (s) => mapRange(s, 0x1d504, 0x1d51e)],
  ["Double-struck", (s) => mapRange(s, 0x1d538, 0x1d552, 0x1d7d8)], ["Monospace", (s) => mapRange(s, 0x1d670, 0x1d68a, 0x1d7f6)], ["Sans bold", (s) => mapRange(s, 0x1d5d4, 0x1d5ee, 0x1d7ec)],
  ["Circled", circled], ["Small caps", (s) => [...s.toLowerCase()].map((c) => SMALLCAPS[c] ?? c).join("")], ["Strikethrough", (s) => [...s].map((c) => c + "\u0336").join("")], ["Underline", (s) => [...s].map((c) => c + "\u0332").join("")],
];
const Fancy = () => {
  const [t, setT] = useState("Hello World");
  return (
    <ToolCard>
      <Field label="Your text"><TextInput type="text" value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-4 space-y-2">{STYLES.map(([n, f]) => { const o = f(t); return <div key={n} className="flex items-center justify-between gap-3 rounded-lg border border-border-default px-3 py-2"><div className="min-w-0"><div className="text-xs text-text-muted">{n}</div><div className="break-words text-lg">{o}</div></div><CopyButton getText={() => o} label="" /></div>; })}</div>
    </ToolCard>
  );
};

/* extractors */
const uniq = (a: string[]) => [...new Set(a)];
const emails = (s: string) => uniq(s.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? []).join("\n");
const urls = (s: string) => uniq(s.match(/https?:\/\/[^\s<>"')]+/g) ?? []).join("\n");
const numbers = (s: string) => (s.replace(/,(?=\d{3})/g, "").match(/-?\d+(?:\.\d+)?/g) ?? []).join("\n");
const dupWords = (s: string) => { const seen = new Set<string>(); return s.split(/(\s+)/).filter((w) => { if (/^\s+$/.test(w)) return true; const k = w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""); if (!k) return true; if (seen.has(k)) return false; seen.add(k); return true; }).join("").replace(/ {2,}/g, " "); };
const listToComma = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean).join(", ");
const commaToList = (s: string) => s.split(/[,;]+/).map((x) => x.trim()).filter(Boolean).join("\n");
const addNumbers = (s: string) => s.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n");
const rmEmpty = (s: string) => s.split("\n").filter((l) => l.trim() !== "").join("\n");
const trimLines = (s: string) => s.split("\n").map((l) => l.trim()).join("\n");
const SMALLW = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "of", "in", "with", "as", "vs"]);
const titleCase = (s: string) => s.toLowerCase().replace(/[\p{L}][\p{L}']*/gu, (w, i) => (i > 0 && SMALLW.has(w) ? w : w[0].toUpperCase() + w.slice(1)));
const sentenceCase = (s: string) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
const words = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_\-]+/g, " ").trim().split(/\s+/).filter(Boolean).map((w) => w.toLowerCase());
const camel = (s: string) => words(s).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join("");

/* arabic */
const diacritics = (s: string) => s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "");
const toAr = (s: string) => s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
const toEn = (s: string) => s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,./", AR = "ضصثقفغعهخحجدشسيبلاتنمكطئءؤرلاىةوزظ";
const ARR = [..."ضصثقفغعهخحجدشسيبلاتنمكطئءؤر", "لا", ..."ىةوزظ"];
const enToAr = (s: string) => [...s].map((c) => { const i = EN.indexOf(c.toLowerCase()); return i >= 0 ? ARR[i] : c; }).join("");
const arToEn = (s: string) => { let o = ""; const chars = [...s]; for (let k = 0; k < chars.length; k++) { const c = chars[k]; if (c === "ل" && chars[k + 1] === "ا") { o += "b"; k++; continue; } const i = ARR.indexOf(c); o += i >= 0 ? EN[i] : c; } return o; };
void AR;

/* encoders */
const toHex = (s: string) => Array.from(new TextEncoder().encode(s)).map((b) => b.toString(16).padStart(2, "0")).join(" ");
const fromHex = (s: string) => new TextDecoder().decode(new Uint8Array(s.trim().split(/[\s,]+/).map((h) => parseInt(h.replace(/^0x/, ""), 16))));
const toAscii = (s: string) => [...s].map((c) => c.codePointAt(0)).join(" ");
const fromAscii = (s: string) => s.trim().split(/[\s,]+/).map((n) => String.fromCodePoint(parseInt(n, 10))).join("");
const uniEsc = (s: string) => [...s].map((c) => { const k = c.codePointAt(0)!; return k < 128 ? c : k > 0xffff ? `\\u{${k.toString(16)}}` : `\\u${k.toString(16).padStart(4, "0")}`; }).join("");
const uniUnesc = (s: string) => s.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_, a, b) => String.fromCodePoint(parseInt(a || b, 16)));
const rot = (s: string, n: number) => s.replace(/[a-z]/gi, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + n + 26 * 10) % 26) + b); });
const Caesar = () => {
  const [k, setK] = useState("3"), [mode, setMode] = useState("enc"), [t, setT] = useState("");
  const n = ((Math.trunc(N(k)) % 26) + 26) % 26, out = mode === "enc" ? rot(t, n) : rot(t, -n);
  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Shift (1-25)"><TextInput type="number" value={k} onChange={(e) => setK(e.target.value)} /></Field><Field label="Mode"><Select value={mode} onChange={(e) => setMode(e.target.value)}><option value="enc">Encrypt</option><option value="dec">Decrypt</option></Select></Field></div>
      <div className="mt-4"><Field label="Text"><TextArea rows={5} value={t} onChange={(e) => setT(e.target.value)} /></Field></div>
      <div className="mt-4"><OutputBox value={out} rows={5} /></div><div className="mt-3"><CopyButton getText={() => out} /></div>
    </ToolCard>
  );
};
const NATO: Record<string, string> = { a: "Alfa", b: "Bravo", c: "Charlie", d: "Delta", e: "Echo", f: "Foxtrot", g: "Golf", h: "Hotel", i: "India", j: "Juliett", k: "Kilo", l: "Lima", m: "Mike", n: "November", o: "Oscar", p: "Papa", q: "Quebec", r: "Romeo", s: "Sierra", t: "Tango", u: "Uniform", v: "Victor", w: "Whiskey", x: "X-ray", y: "Yankee", z: "Zulu", "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four", "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Niner" };
const nato = (s: string) => [...s.toLowerCase()].map((c) => (c === " " ? "/" : NATO[c] ?? c)).join(" ");
const pig = (s: string) => s.replace(/[A-Za-z]+/g, (w) => { const m = w.match(/^([^aeiouAEIOU]*)(.*)$/)!; const [, c, r] = m; if (!c) return w + "way"; const out = (r + c + "ay"); return w[0] === w[0].toUpperCase() ? out[0].toUpperCase() + out.slice(1).toLowerCase() : out; });
const LEET: Record<string, string> = { a: "4", e: "3", i: "1", o: "0", s: "5", t: "7", l: "1", b: "8", g: "9" };
const leet = (s: string) => [...s.toLowerCase()].map((c) => LEET[c] ?? c).join("");
const invisible = () => <InvisibleChars />;
function InvisibleChars() {
  const items: [string, string][] = [["Hangul filler (U+3164)", "\u3164"], ["Braille blank (U+2800)", "\u2800"], ["Zero-width space (U+200B)", "\u200B"], ["Zero-width non-joiner (U+200C)", "\u200C"], ["Em space (U+2003)", "\u2003"]];
  return <ToolCard><p className="mb-3 text-sm text-text-muted">Press Copy, then paste where you need a blank-looking character.</p><div className="space-y-2">{items.map(([n, c]) => <div key={n} className="flex items-center justify-between rounded-lg border border-border-default px-3 py-2"><span className="text-sm">{n}</span><CopyButton getText={() => c} /></div>)}</div></ToolCard>;
}
const isPal = (s: string) => { const t = [...s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")]; if (!t.length) return "Enter some text."; return t.join("") === [...t].reverse().join("") ? "Yes, this is a palindrome." : "No, this is not a palindrome."; };
const Anagram = () => {
  const [a, setA] = useState("listen"), [b, setB] = useState("silent");
  const n = (s: string) => [...s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")].sort().join("");
  const ok = n(a) !== "" && n(a) === n(b);
  return <ToolCard><div className="grid gap-4 sm:grid-cols-2"><Field label="First word or phrase"><TextInput type="text" value={a} onChange={(e) => setA(e.target.value)} /></Field><Field label="Second word or phrase"><TextInput type="text" value={b} onChange={(e) => setB(e.target.value)} /></Field></div><div className="mt-6 text-center text-xl font-bold text-primary-500">{ok ? "Yes, they are anagrams" : "No, not anagrams"}</div></ToolCard>;
};
const LetterFreq = () => {
  const [t, setT] = useState("");
  const rows = useMemo(() => { const m = new Map<string, number>(); for (const c of t.toLowerCase()) if (/\p{L}/u.test(c)) m.set(c, (m.get(c) ?? 0) + 1); return [...m].sort((a, b) => b[1] - a[1]); }, [t]);
  const total = rows.reduce((a, r) => a + r[1], 0), vow = rows.filter(([c]) => "aeiou".includes(c)).reduce((a, r) => a + r[1], 0);
  return <ToolCard><Field label="Your text"><TextArea rows={6} value={t} onChange={(e) => setT(e.target.value)} /></Field><div className="mt-4 flex flex-wrap gap-3"><StatBadge label="Letters" value={total} /><StatBadge label="Vowels (a e i o u)" value={vow} /><StatBadge label="Consonants" value={total - vow} /></div><div className="mt-4 flex flex-wrap gap-2">{rows.map(([c, n]) => <span key={c} className="rounded-md border border-border-default px-2 py-1 text-sm">{c}: {n}</span>)}</div></ToolCard>;
};
const Counter = ({ kind }: { kind: "sentence" | "paragraph" | "syllable" }) => {
  const [t, setT] = useState("");
  const sent = (t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? []).filter((x) => x.trim()).length, para = t.split(/\n\s*\n/).filter((x) => x.trim()).length, w = (t.match(/[\p{L}\p{N}']+/gu) ?? []).length;
  const sy = (t.toLowerCase().match(/[a-z]+/g) ?? []).reduce((a, x) => a + (x.length <= 3 ? 1 : Math.max(1, (x.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g) ?? []).length)), 0);
  return <ToolCard><Field label="Your text"><TextArea rows={8} value={t} onChange={(e) => setT(e.target.value)} /></Field><div className="mt-5 flex flex-wrap justify-center gap-3">{kind === "sentence" && <StatBadge label="Sentences" value={sent} />}{kind === "paragraph" && <StatBadge label="Paragraphs" value={para} />}{kind === "syllable" && <StatBadge label="Syllables (English)" value={sy} />}<StatBadge label="Words" value={w} /><StatBadge label="Characters" value={t.length} /></div></ToolCard>;
};
const ReadTime = ({ speak = false }: { speak?: boolean }) => {
  const [t, setT] = useState(""), [wpm, setWpm] = useState(speak ? "130" : "238");
  const w = (t.match(/[\p{L}\p{N}']+/gu) ?? []).length, mins = w / Math.max(1, N(wpm)), s = Math.round(mins * 60);
  return <ToolCard><Field label="Paste your text"><TextArea rows={8} value={t} onChange={(e) => setT(e.target.value)} /></Field><div className="mt-3 max-w-[12rem]"><Field label={speak ? "Speaking speed (words/min)" : "Reading speed (words/min)"}><TextInput type="number" value={wpm} onChange={(e) => setWpm(e.target.value)} /></Field></div><div className="mt-5 flex flex-wrap justify-center gap-3"><StatBadge label={speak ? "Speaking time" : "Reading time"} value={`${Math.floor(s / 60)} min ${s % 60} s`} /><StatBadge label="Words" value={w} /></div></ToolCard>;
};
const Wrap = () => {
  const [t, setT] = useState(""), [n, setN] = useState("60");
  const out = useMemo(() => { const m = Math.max(5, Math.floor(N(n)) || 60); return t.split("\n").map((p) => { const L: string[] = []; let cur = ""; for (const w of p.split(/\s+/).filter(Boolean)) { if ((cur + " " + w).trim().length > m && cur) { L.push(cur); cur = w; } else cur = (cur + " " + w).trim(); } L.push(cur); return L.join("\n"); }).join("\n"); }, [t, n]);
  return <ToolCard><div className="max-w-[12rem]"><Field label="Line width (characters)"><TextInput type="number" value={n} onChange={(e) => setN(e.target.value)} /></Field></div><div className="mt-4"><Field label="Text"><TextArea rows={6} value={t} onChange={(e) => setT(e.target.value)} /></Field></div><div className="mt-4"><OutputBox value={out} rows={6} /></div><div className="mt-3"><CopyButton getText={() => out} /></div></ToolCard>;
};
const Tabs = () => <Modes placeholder="Paste text..." modes={[["t2s", "Tabs to 4 spaces", (s) => s.replace(/\t/g, "    ")], ["s2t", "4 spaces to tabs", (s) => s.replace(/ {4}/g, "\t")]]} />;
const revWords = () => <Modes placeholder="Type a sentence..." modes={[["order", "Reverse word order", (s) => s.split(/\s+/).reverse().join(" ")], ["each", "Reverse letters in each word", (s) => s.split(" ").map((w) => [...w].reverse().join("")).join(" ")]]} />;

export const WAVE2: Record<string, () => ReactNode> = {
  "fancy-text-generator": () => <Fancy />, "email-extractor": X(emails, "Paste text containing email addresses..."), "url-extractor": X(urls, "Paste text containing links..."), "number-extractor": X(numbers, "Paste text containing numbers..."),
  "remove-duplicate-words": X(dupWords, "Paste text with repeated words..."), "list-to-comma-separated": X(listToComma, "One item per line..."), "comma-separated-to-list": X(commaToList, "apple, banana, cherry"),
  "add-line-numbers": X(addNumbers, "Paste lines of text..."), "remove-empty-lines": X(rmEmpty, "Paste text with blank lines..."), "trim-lines-whitespace": X(trimLines, "Paste text with extra spaces around lines..."),
  "title-case-converter": X(titleCase, "type a headline to capitalize..."), "sentence-case-converter": X(sentenceCase, "PASTE TEXT IN ALL CAPS..."),
  "camelcase-snake-case-converter": () => <Modes placeholder="user account name" modes={[["camel", "camelCase", camel], ["snake", "snake_case", (s) => words(s).join("_")], ["kebab", "kebab-case", (s) => words(s).join("-")], ["pascal", "PascalCase", (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1)).join("")], ["const", "CONSTANT_CASE", (s) => words(s).join("_").toUpperCase()]]} />,
  "arabic-diacritics-remover": X(diacritics, "الصق نصاً مشكولاً هنا..."), "arabic-numbers-converter": () => <Modes placeholder="2026 or ٢٠٢٦" modes={[["ar", "English to Arabic-Indic numerals", toAr], ["en", "Arabic-Indic to English numerals", toEn]]} />,
  "arabic-keyboard-converter": () => <Modes placeholder="Type text written with the wrong keyboard layout..." modes={[["en2ar", "English keys to Arabic (hgsghl)", enToAr], ["ar2en", "Arabic keys to English", arToEn]]} />,
  "text-to-hex-converter": () => <Modes placeholder="Hello" modes={[["enc", "Text to hex", toHex], ["dec", "Hex to text", fromHex]]} />,
  "text-to-ascii-converter": () => <Modes placeholder="Hello" modes={[["enc", "Text to ASCII/Unicode codes", toAscii], ["dec", "Codes to text", fromAscii]]} />,
  "unicode-escape-converter": () => <Modes placeholder="café 😀" modes={[["enc", "Text to \\u escapes", uniEsc], ["dec", "\\u escapes to text", uniUnesc]]} />,
  "caesar-cipher-tool": () => <Caesar />, "rot13-converter": X((s) => rot(s, 13), "Type text to ROT13 encode or decode..."), "nato-phonetic-alphabet-converter": X(nato, "Type letters to spell out..."),
  "pig-latin-translator": X(pig, "Type English text..."), "leetspeak-converter": X(leet, "Type text to convert to 1337..."), "invisible-character-generator": invisible,
  "palindrome-checker": X(isPal, "Type a word or phrase...", 3), "anagram-checker": () => <Anagram />, "letter-frequency-counter": () => <LetterFreq />,
  "sentence-counter": () => <Counter kind="sentence" />, "paragraph-counter": () => <Counter kind="paragraph" />, "syllable-counter": () => <Counter kind="syllable" />,
  "reading-time-calculator": () => <ReadTime />, "speaking-time-calculator": () => <ReadTime speak />, "text-wrapper": () => <Wrap />, "tabs-spaces-converter": () => <Tabs />, "reverse-words-tool": revWords,
};
void num;
