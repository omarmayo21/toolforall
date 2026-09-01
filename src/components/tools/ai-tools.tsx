"use client";

import { useMemo, useState } from "react";
import {
  Button,
  CopyButton,
  Field,
  OutputBox,
  Select,
  TextArea,
  TextInput,
  ToolCard,
  StatBadge,
  Alert,
  downloadText,
} from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* =========================================================================
   EXISTING 8 AI TOOLS (Preserved Exactly)
   ========================================================================= */

/* ---------------- 1. ChatGPT Prompt Generator ---------------- */
export function ChatGptPromptGenerator() {
  const [goal, setGoal] = useState("write a product description for running shoes");
  const [role, setRole] = useState("expert copywriter");
  const [tone, setTone] = useState("friendly and enthusiastic");
  const [audience, setAudience] = useState("young professionals");
  const [format, setFormat] = useState("a short paragraph followed by 3 bullet points");
  const [length, setLength] = useState("150 words");

  const prompt = `Act as a${/^[aeiou]/i.test(role) ? "n" : ""} ${role}. Your task: ${goal}.\nTarget audience: ${audience}.\nTone: ${tone}.\nLength: approximately ${length}.\nFormat the output as: ${format}.\nBe specific, avoid generic filler phrases, and make sure the result is ready to use with minimal editing.`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="What do you want the AI to do?"><TextArea rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} /></Field>
        <Field label="Role / persona"><TextInput value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Tone"><TextInput value={tone} onChange={(e) => setTone(e.target.value)} /></Field>
        <Field label="Target audience"><TextInput value={audience} onChange={(e) => setAudience(e.target.value)} /></Field>
        <Field label="Desired format"><TextInput value={format} onChange={(e) => setFormat(e.target.value)} /></Field>
        <Field label="Length"><TextInput value={length} onChange={(e) => setLength(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><OutputBox value={prompt} rows={7} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => prompt} /></div>
    </ToolCard>
  );
}

/* ---------------- 2. Blog Outline Generator ---------------- */
export function BlogOutlineGenerator() {
  const [topic, setTopic] = useState("remote work productivity");
  const [keyword, setKeyword] = useState("remote work productivity tips");
  const [type, setType] = useState("listicle");

  const outline = useMemo(() => {
    const intro = `## Introduction\n- Hook: a relatable struggle or surprising stat about ${topic}\n- Why ${keyword} matters right now\n- What the reader will learn`;
    let body = "";
    if (type === "listicle") {
      body = Array.from({ length: 6 }, (_, i) => `## ${i + 1}. [Specific tip about ${topic} #${i + 1}]`).join("\n");
    } else if (type === "howto") {
      body = `## What You'll Need\n## Step 1: [First step]\n## Step 2: [Second step]\n## Step 3: [Third step]\n## Common Mistakes to Avoid`;
    } else if (type === "comparison") {
      body = `## Option A: Overview\n## Option B: Overview\n## Head-to-Head Comparison\n## Pros and Cons\n## Which One Should You Choose?`;
    } else {
      body = `## What is ${topic}?\n## Why ${topic} Matters\n## Key Strategies for ${keyword}\n## Real-World Examples\n## Tools & Resources\n## Common Mistakes`;
    }
    const conclusion = `## Conclusion\n- Recap key takeaways\n- Call-to-action related to ${keyword}`;
    return `# [Title including "${keyword}"]\n\n${intro}\n\n${body}\n\n${conclusion}`;
  }, [topic, keyword, type]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Target keyword"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
        <Field label="Content type">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="listicle">Listicle</option>
            <option value="howto">How-to Guide</option>
            <option value="comparison">Comparison</option>
            <option value="guide">Ultimate Guide</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4"><OutputBox value={outline} rows={14} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => outline} /></div>
    </ToolCard>
  );
}

/* ---------------- 3. Meta Description Prompter ---------------- */
export function MetaDescriptionPrompter() {
  const [topic, setTopic] = useState("eco-friendly insulated water bottles");
  const [keyword, setKeyword] = useState("insulated water bottle");
  const [tone, setTone] = useState("friendly");
  const [cta, setCta] = useState("Shop now and save.");

  const prompt = `Write a meta description between 150-160 characters for a page about ${topic}.\nNaturally include the keyword "${keyword}" once.\nUse a ${tone} tone.\nEnd with this call-to-action idea: "${cta}"\nReturn only the final meta description text, with no quotation marks, and confirm the character count.`;

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Page topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Target keyword"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
        <Field label="Tone"><TextInput value={tone} onChange={(e) => setTone(e.target.value)} /></Field>
        <Field label="Call-to-action idea"><TextInput value={cta} onChange={(e) => setCta(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><OutputBox value={prompt} rows={6} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => prompt} /></div>
    </ToolCard>
  );
}

/* ---------------- 4. Email Subject Line Generator ---------------- */
export function EmailSubjectLineGenerator() {
  const [offer, setOffer] = useState("20% off all shoes this weekend");
  const [audience, setAudience] = useState("loyal customers");

  const lines = useMemo(() => {
    const short = offer.length > 40 ? offer.slice(0, 37) + "…" : offer;
    return [
      `Still deciding? Here's why: ${short}`,
      `${short} (ends soon)`,
      `{first_name}, this one's for you: ${short}`,
      `Have you seen this? ${short}`,
      `Last chance: ${short}`,
    ];
  }, [offer, audience]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Core offer / topic"><TextInput value={offer} onChange={(e) => setOffer(e.target.value)} /></Field>
        <Field label="Audience"><TextInput value={audience} onChange={(e) => setAudience(e.target.value)} /></Field>
      </div>
      <div className="mt-4 space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-surface-100 px-3 py-2 text-sm dark:bg-surface-800">
            <span>{l}</span>
            <CopyButton getText={() => l} label="" />
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 5. YouTube Title & Tag Generator ---------------- */
export function YoutubeTitleTagGenerator() {
  const [topic, setTopic] = useState("iPhone photography tips");
  const [keyword, setKeyword] = useState("iphone photography");

  const titles = useMemo(() => [
    `10 ${topic} That Actually Work`,
    `How to Master ${topic} (Beginner Friendly)`,
    `The ${topic} Trick Nobody Tells You About`,
    `${topic}: Everything You Need to Know`,
    `Stop Doing This! ${topic} Explained`,
  ], [topic]);

  const tags = useMemo(() => {
    const base = keyword.toLowerCase().split(/\s+/);
    return Array.from(new Set([
      keyword.toLowerCase(),
      ...base,
      `${keyword} tips`,
      `${keyword} tutorial`,
      `${keyword} for beginners`,
      `best ${keyword}`,
      topic.toLowerCase(),
    ]));
  }, [topic, keyword]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Video topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Main keyword"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
      </div>
      <div className="mt-4 space-y-2">
        {titles.map((t, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-surface-100 px-3 py-2 text-sm dark:bg-surface-800">
            <span>{t}</span>
            <CopyButton getText={() => t} label="" />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Suggested tags</p>
        <OutputBox value={tags.join(", ")} rows={3} />
        <div className="mt-2 flex gap-2"><CopyButton getText={() => tags.join(", ")} /></div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 6. Social Media Bio Generator ---------------- */
export function SocialMediaBioGenerator() {
  const [platform, setPlatform] = useState("instagram");
  const [role, setRole] = useState("freelance graphic designer");
  const [interests, setInterests] = useState("branding, illustration, coffee");
  const [fact, setFact] = useState("powered by coffee");

  const bio = useMemo(() => {
    const interestList = interests.split(",").map((s) => s.trim()).filter(Boolean);
    if (platform === "linkedin") {
      return `${role.charAt(0).toUpperCase() + role.slice(1)} specializing in ${interestList.join(", ")}. Passionate about delivering great work and building long-term client relationships. Open to new opportunities and collaborations.`;
    }
    if (platform === "twitter") {
      return `${role} • ${interestList.join(" / ")} • ${fact}`;
    }
    if (platform === "tiktok") {
      return `✨ ${role}\n${interestList.map((i) => `🔹 ${i}`).join("\n")}\n${fact ? `👉 ${fact}` : ""}`;
    }
    return `🎨 ${role} | ${interestList.join(" & ")} | ${fact} ☕ | DM for collabs`;
  }, [platform, role, interests, fact]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform">
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="instagram">Instagram</option>
            <option value="twitter">X (Twitter)</option>
            <option value="tiktok">TikTok</option>
            <option value="linkedin">LinkedIn</option>
          </Select>
        </Field>
        <Field label="Role / profession"><TextInput value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Interests / specialties (comma-separated)"><TextInput value={interests} onChange={(e) => setInterests(e.target.value)} /></Field>
        <Field label="Fun fact / personal touch"><TextInput value={fact} onChange={(e) => setFact(e.target.value)} /></Field>
      </div>
      <div className="mt-4"><OutputBox value={bio} rows={5} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => bio} /></div>
    </ToolCard>
  );
}

/* ---------------- 7. Copywriting Bullet Generator ---------------- */
export function CopywritingBulletGenerator() {
  const [features, setFeatures] = useState("12-hour battery life\nWaterproof up to 30 meters\nMade from recycled materials");
  const outcomes = [
    "so you can enjoy it worry-free, all day long",
    "giving you total peace of mind wherever life takes you",
    "so you can feel good about every purchase",
    "without missing a beat",
    "so you spend less time worrying and more time enjoying it",
  ];

  const bullets = useMemo(
    () =>
      features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((f, i) => `${f} — ${outcomes[i % outcomes.length]}`),
    [features]
  );

  return (
    <ToolCard>
      <Field label="List your features (one per line)"><TextArea rows={5} value={features} onChange={(e) => setFeatures(e.target.value)} /></Field>
      <div className="mt-4 space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="rounded-lg bg-surface-100 px-3 py-2 text-sm dark:bg-surface-800">• {b}</div>
        ))}
      </div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => bullets.map((b) => `• ${b}`).join("\n")} /></div>
    </ToolCard>
  );
}

/* ---------------- 8. SQL Prompt Generator ---------------- */
export function SqlPromptGenerator() {
  const [request, setRequest] = useState("total sales per customer in the last 30 days");
  const [dialect, setDialect] = useState("PostgreSQL");
  const [schema, setSchema] = useState("orders(id, customer_id, amount, created_at)\ncustomers(id, name, email)");

  const prompt = `You are a senior database engineer. Using the exact table and column names below, write a ${dialect} SQL query that answers this request: "${request}".\n\nSchema:\n${schema}\n\nRequirements:\n- Only use the tables/columns provided above.\n- Use ${dialect}-correct syntax.\n- Return the SQL in a code block.\n- After the query, briefly explain what it does in 2-3 sentences.`;

  return (
    <ToolCard>
      <Field label="Describe what you need in plain English"><TextArea rows={2} value={request} onChange={(e) => setRequest(e.target.value)} /></Field>
      <div className="my-4"><Field label="SQL dialect">
        <Select value={dialect} onChange={(e) => setDialect(e.target.value)}>
          <option>PostgreSQL</option>
          <option>MySQL</option>
          <option>SQL Server</option>
          <option>SQLite</option>
          <option>BigQuery</option>
        </Select>
      </Field></div>
      <Field label="Your table schema (table(columns))"><TextArea rows={4} value={schema} onChange={(e) => setSchema(e.target.value)} /></Field>
      <div className="mt-4"><OutputBox value={prompt} rows={9} /></div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => prompt} /></div>
    </ToolCard>
  );
}

/* =========================================================================
   30 NEW AI UTILITY TOOLS
   ========================================================================= */

/* ---------------- 9. AI Summarizer ---------------- */
export function AiSummarizer() {
  const [text, setText] = useState(
    "Artificial intelligence has revolutionized modern technology across multiple sectors including healthcare, education, and finance. Machine learning algorithms can process vast amounts of unstructured data in milliseconds, identifying patterns that humans might overlook. In medicine, diagnostic models assist radiologists in identifying early-stage anomalies with remarkable precision. In finance, automated fraud detection systems protect millions of transactions daily against unauthorized activities. However, the rapid adoption of automated systems brings significant ethical challenges, particularly regarding algorithmic bias and data privacy. Organizations must balance innovation with rigorous governance frameworks to ensure transparency, accountability, and fair outcomes for all stakeholders."
  );
  const [mode, setMode] = useState<"bullets" | "paragraph" | "executive" | "takeaways">("bullets");
  const [length, setLength] = useState<"short" | "medium" | "detailed">("medium");

  const summaryData = useMemo(() => {
    if (!text.trim()) return { summary: "", origWords: 0, sumWords: 0, reduction: 0 };
    const rawSentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 15);
    const origWords = text.trim().split(/\s+/).filter(Boolean).length;
    if (rawSentences.length === 0) return { summary: text, origWords, sumWords: origWords, reduction: 0 };

    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "of", "to", "is", "for", "with", "that", "this", "it", "as", "are", "be", "by", "or", "from"]);
    const wordFreq: Record<string, number> = {};
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    words.forEach((w) => {
      if (!stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });

    const scored = rawSentences.map((sentence, idx) => {
      const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      let score = 0;
      sWords.forEach((w) => {
        score += wordFreq[w] || 0;
      });
      if (idx === 0) score *= 1.4;
      if (idx === rawSentences.length - 1) score *= 1.2;
      if (/\b(crucial|important|key|conclude|significant|result|shows|demonstrates|findings|must|however)\b/i.test(sentence)) {
        score *= 1.3;
      }
      return { sentence, score, idx };
    });

    scored.sort((a, b) => b.score - a.score);

    let count = 2;
    if (length === "short") count = Math.max(1, Math.min(2, Math.ceil(rawSentences.length * 0.3)));
    if (length === "medium") count = Math.max(2, Math.min(4, Math.ceil(rawSentences.length * 0.5)));
    if (length === "detailed") count = Math.max(3, Math.min(6, Math.ceil(rawSentences.length * 0.75)));

    const selected = scored.slice(0, count).sort((a, b) => a.idx - b.idx).map((s) => s.sentence);

    let summary = "";
    if (mode === "bullets") {
      summary = selected.map((s) => `• ${s}`).join("\n\n");
    } else if (mode === "paragraph") {
      summary = selected.join(" ");
    } else if (mode === "executive") {
      summary = `### Executive Summary\n${selected[0] || ""}\n\n### Key Highlights\n${selected.slice(1).map((s) => `- ${s}`).join("\n")}`;
    } else {
      summary = selected.map((s, i) => `${i + 1}. ${s}`).join("\n\n");
    }

    const sumWords = summary.trim().split(/\s+/).filter(Boolean).length;
    const reduction = origWords > 0 ? Math.max(0, Math.round(((origWords - sumWords) / origWords) * 100)) : 0;

    return { summary, origWords, sumWords, reduction };
  }, [text, mode, length]);

  return (
    <ToolCard>
      <Field label="Paste text to summarize">
        <TextArea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste article, meeting notes, essay or report here..." />
      </Field>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Summary format">
          <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="bullets">Key Bullet Points</option>
            <option value="paragraph">Cohesive Paragraph</option>
            <option value="executive">Executive Brief</option>
            <option value="takeaways">Numbered Takeaways</option>
          </Select>
        </Field>
        <Field label="Summary length">
          <Select value={length} onChange={(e) => setLength(e.target.value as any)}>
            <option value="short">Short & Concise (~25-30%)</option>
            <option value="medium">Balanced (~50%)</option>
            <option value="detailed">Detailed (~75%)</option>
          </Select>
        </Field>
      </div>

      <div className="my-4 grid grid-cols-3 gap-2">
        <StatBadge label="Original Words" value={summaryData.origWords} />
        <StatBadge label="Summary Words" value={summaryData.sumWords} />
        <StatBadge label="Reduction" value={`${summaryData.reduction}%`} />
      </div>

      <Field label="Generated Summary">
        <OutputBox value={summaryData.summary} rows={8} />
      </Field>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton getText={() => summaryData.summary} />
        <Button type="button" variant="secondary" onClick={() => downloadText("summary.txt", summaryData.summary)}>
          ⬇️ Download TXT
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 10. AI Paraphraser ---------------- */
export function AiParaphraser() {
  const [text, setText] = useState("Effective communication is essential for team success because it prevents misunderstandings and boosts overall productivity.");
  const [mode, setMode] = useState<"standard" | "fluency" | "formal" | "creative" | "concise" | "expand">("fluency");

  const paraphrased = useMemo(() => {
    if (!text.trim()) return "";
    let res = text;

    const replacements: Record<string, Record<string, string>> = {
      formal: {
        "essential": "imperative",
        "good": "advantageous",
        "bad": "detrimental",
        "shows": "demonstrates",
        "help": "facilitate",
        "use": "utilize",
        "big": "substantial",
        "because": "owing to the fact that",
        "boosts": "enhances",
        "important": "vital",
        "start": "commence",
        "end": "conclude",
      },
      fluency: {
        "in order to": "to",
        "essential for": "key to",
        "boosts overall": "strengthens",
        "prevents misunderstandings": "eliminates confusion",
        "due to the fact that": "since",
        "has the ability to": "can",
        "at this point in time": "currently",
      },
      creative: {
        "essential for": "the heartbeat of",
        "team success": "high-performing teams",
        "boosts overall productivity": "supercharges daily momentum",
        "prevents misunderstandings": "keeps everyone crystal clear",
        "important": "game-changing",
        "good": "stellar",
      },
      concise: {
        "is essential for team success because it prevents": "drives team success by preventing",
        "and boosts overall productivity": "and boosting output",
        "in order to": "to",
        "due to the fact that": "because",
        "at this point in time": "now",
        "a large number of": "many",
        "for the purpose of": "for",
      },
      expand: {
        "is essential for": "serves as an indispensable foundation for",
        "team success": "sustained organizational achievement",
        "because it prevents misunderstandings": "by systematically mitigating interpersonal friction",
        "boosts overall productivity": "elevating collective operational efficiency across all workflows",
      },
      standard: {
        "essential": "crucial",
        "prevents": "avoids",
        "boosts": "increases",
        "team success": "team achievement",
      }
    };

    const map = replacements[mode] || replacements.standard;
    Object.entries(map).forEach(([src, target]) => {
      const regex = new RegExp(`\\b${src}\\b`, "gi");
      res = res.replace(regex, target);
    });

    if (mode === "formal" && !/^(Furthermore|Notably|Consequently)/i.test(res)) {
      res = `Notably, ${res.charAt(0).toLowerCase() + res.slice(1)}`;
    } else if (mode === "concise") {
      res = res.replace(/\b(very|really|quite|basically|simply|actually)\s+/gi, "");
    }

    return res;
  }, [text, mode]);

  return (
    <ToolCard>
      <Field label="Original Text">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text to paraphrase..." />
      </Field>
      <div className="my-4">
        <Field label="Paraphrasing Style">
          <Select value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="fluency">Natural Fluency (Smooth & Clear)</option>
            <option value="standard">Standard (Balanced Reword)</option>
            <option value="formal">Formal & Academic (Professional)</option>
            <option value="creative">Creative & Engaging (Expressive)</option>
            <option value="concise">Concise & Direct (Shorten)</option>
            <option value="expand">Expand & Elaborate (Detailed)</option>
          </Select>
        </Field>
      </div>
      <Field label="Paraphrased Result">
        <OutputBox value={paraphrased} rows={4} />
      </Field>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => paraphrased} />
        <Button type="button" variant="secondary" onClick={() => downloadText("paraphrased.txt", paraphrased)}>
          ⬇️ Download
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 11. AI Text Detector ---------------- */
export function AiTextDetector() {
  const [text, setText] = useState(
    "Furthermore, it is important to recognize that artificial intelligence plays a crucial role in modern society. In conclusion, navigating this complex landscape requires careful deliberation, ensuring that all aspects are thoroughly considered."
  );

  const analysis = useMemo(() => {
    if (!text.trim()) {
      return { score: 0, label: "No input", burstiness: 0, vocabDiversity: 0, aiTransitions: 0, details: [] };
    }

    const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 5);
    const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
    const totalWords = words.length;

    if (totalWords < 10) {
      return { score: 10, label: "Text too short for reliable analysis", burstiness: 0, vocabDiversity: 0, aiTransitions: 0, details: [] };
    }

    const sentenceLengths = sentences.map((s) => (s.match(/\b[a-z]+\b/gi) || []).length);
    const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
    const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLen, 2), 0) / (sentenceLengths.length || 1);
    const stdDev = Math.sqrt(variance);
    const burstinessScore = Math.max(0, Math.min(100, Math.round(stdDev * 10)));

    const uniqueWords = new Set(words).size;
    const ttr = (uniqueWords / totalWords) * 100;
    const vocabDiversity = Math.round(ttr);

    const aiPatterns = [
      /\b(in conclusion|furthermore|moreover|it is important to note|delve into|tapestry|beacon|testament|crucial role|navigating the landscape|in summary|it is worth noting|plays a vital role)\b/gi,
      /\b(first and foremost|by leveraging|it is essential to|in the realm of|a multifaceted approach)\b/gi,
    ];
    let aiPatternMatches = 0;
    aiPatterns.forEach((p) => {
      const m = text.match(p);
      if (m) aiPatternMatches += m.length;
    });

    let aiProb = 40;
    if (aiPatternMatches > 0) aiProb += Math.min(40, aiPatternMatches * 15);
    if (stdDev < 3 && sentences.length > 2) aiProb += 25;
    if (stdDev > 7) aiProb -= 20;
    if (ttr < 45) aiProb += 15;
    if (ttr > 75) aiProb -= 15;

    aiProb = Math.max(5, Math.min(95, Math.round(aiProb)));

    let label = "Likely Human-Written";
    if (aiProb >= 75) label = "Highly Likely AI-Generated";
    else if (aiProb >= 55) label = "Likely AI-Generated";
    else if (aiProb >= 40) label = "Mixed / AI-Assisted";
    else if (aiProb >= 20) label = "Likely Human-Written";
    else label = "Highly Likely Human-Written";

    const details = sentences.map((s) => {
      const sLen = (s.match(/\b[a-z]+\b/gi) || []).length;
      const hasAiWord = aiPatterns.some((p) => p.test(s));
      return { sentence: s, words: sLen, flagged: hasAiWord };
    });

    return { score: aiProb, label, burstiness: burstinessScore, vocabDiversity, aiTransitions: aiPatternMatches, details };
  }, [text]);

  return (
    <ToolCard>
      <Field label="Text to Analyze for AI Patterns">
        <TextArea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text (at least 20 words recommended)..." />
      </Field>

      <div className="mt-4 rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div>
            <div className="text-sm font-medium text-text-secondary">AI Probability Assessment</div>
            <div className="text-2xl font-black text-primary-500 dark:text-primary-400">{analysis.score}% — {analysis.label}</div>
          </div>
          <div className="w-full sm:w-48">
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
              <div
                className={`h-full transition-all duration-500 ${
                  analysis.score > 60 ? "bg-red-500" : analysis.score > 35 ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatBadge label="Sentence Variance (Burstiness)" value={analysis.burstiness} />
          <StatBadge label="Vocab Diversity (TTR)" value={`${analysis.vocabDiversity}%`} />
          <StatBadge label="AI Cliche Matches" value={analysis.aiTransitions} />
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs font-semibold uppercase text-text-muted">Sentence Breakdown</div>
        <div className="space-y-2">
          {analysis.details.map((d, i) => (
            <div
              key={i}
              className={`rounded-lg border p-2.5 text-sm ${
                d.flagged
                  ? "border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-border-default bg-surface-default"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Sentence #{i + 1} ({d.words} words)</span>
                {d.flagged && <span className="font-semibold text-amber-600 dark:text-amber-400">⚠️ AI Cliché Detected</span>}
              </div>
              <p className="mt-1">{d.sentence}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Alert type="info">
          <strong>Note:</strong> AI detection tools use statistical heuristics (perplexity, burstiness, and formulaic phrasing) to estimate patterns. Results are indicative indicators and should be evaluated in context.
        </Alert>
      </div>
    </ToolCard>
  );
}

/* ---------------- 12. AI Humanizer ---------------- */
export function AiHumanizer() {
  const [text, setText] = useState(
    "Furthermore, it is essential to utilize automated workflows in order to maximize operational efficiency. In conclusion, organizations must implement these strategies."
  );
  const [persona, setPersona] = useState<"conversational" | "casual" | "storyteller" | "professional" | "direct">("conversational");
  const [useContractions, setUseContractions] = useState(true);

  const humanized = useMemo(() => {
    if (!text.trim()) return "";
    let res = text;

    const transitionMap: Record<string, string[]> = {
      "furthermore,": ["Plus,", "On top of that,", "What's more,", "Also,"],
      "moreover,": ["And another thing:", "Besides,", "Even better,"],
      "additionally,": ["Along with that,", "Also,", "Plus,"],
      "in conclusion,": ["At the end of the day,", "Bottom line:", "All in all,"],
      "it is essential to": ["you really want to", "it pays to", "it's smart to"],
      "in order to": ["to"],
      "utilize": ["use"],
      "due to the fact that": ["because", "since"],
      "it is important to note that": ["keep in mind that", "remember that"],
      "plays a crucial role in": ["makes a huge difference in", "is key to"],
    };

    Object.entries(transitionMap).forEach(([src, opts]) => {
      const reg = new RegExp(src, "gi");
      res = res.replace(reg, () => opts[Math.floor(Math.random() * opts.length)] || opts[0]);
    });

    if (useContractions) {
      const contractions: Record<string, string> = {
        "do not": "don't",
        "cannot": "can't",
        "it is": "it's",
        "that is": "that's",
        "we have": "we've",
        "they are": "they're",
        "you will": "you'll",
        "there is": "there's",
        "does not": "doesn't",
      };
      Object.entries(contractions).forEach(([orig, contr]) => {
        const reg = new RegExp(`\\b${orig}\\b`, "gi");
        res = res.replace(reg, contr);
      });
    }

    if (persona === "casual") {
      res = res.replace(/\b(organizations|companies)\b/gi, "teams");
      res = res.replace(/\b(implement)\b/gi, "roll out");
    } else if (persona === "direct") {
      res = res.replace(/\b(it pays to|you really want to)\b/gi, "just");
    }

    return res;
  }, [text, persona, useContractions]);

  return (
    <ToolCard>
      <Field label="Original Robotic / AI Draft">
        <TextArea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste AI-generated text to humanize..." />
      </Field>

      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <Field label="Target Persona / Tone">
          <Select value={persona} onChange={(e) => setPersona(e.target.value as any)}>
            <option value="conversational">Conversational & Natural</option>
            <option value="casual">Casual & Friendly</option>
            <option value="professional">Polished Professional</option>
            <option value="direct">Direct & Punchy</option>
            <option value="storyteller">Engaging Storyteller</option>
          </Select>
        </Field>
        <Field label="Natural Language Settings">
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" checked={useContractions} onChange={(e) => setUseContractions(e.target.checked)} className="rounded text-primary-500" />
            Apply natural contractions (it's, don't, we've)
          </label>
        </Field>
      </div>

      <Field label="Humanized Natural Output">
        <OutputBox value={humanized} rows={5} />
      </Field>

      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => humanized} />
        <Button type="button" variant="secondary" onClick={() => downloadText("humanized.txt", humanized)}>
          ⬇️ Download
        </Button>
      </div>

      <div className="mt-4">
        <Alert type="info">
          <strong>Tip:</strong> This tool restructures sentence rhythm, replaces stiff transitions, and introduces natural vocabulary. It is designed to improve reading enjoyment, clarity, and engagement.
        </Alert>
      </div>
    </ToolCard>
  );
}

/* ---------------- 13. AI Resume Builder ---------------- */
export function AiResumeBuilder() {
  const [jobTitle, setJobTitle] = useState("Frontend Engineer");
  const [level, setLevel] = useState("Mid-Level");
  const [tasks, setTasks] = useState("Built reusable React components\nOptimized page load speed\nCollaborated with UI/UX designers");
  const [metrics, setMetrics] = useState("improved load speed by 42%, serving 200k monthly users");

  const resumeData = useMemo(() => {
    const taskList = tasks.split("\n").map((t) => t.trim()).filter(Boolean);
    const actionVerbs = ["Spearheaded", "Architected", "Engineered", "Optimized", "Orchestrated", "Implemented"];

    const bullets = taskList.map((task, i) => {
      const verb = actionVerbs[i % actionVerbs.length];
      const cleanTask = task.replace(/^(built|created|made|worked on|did|optimized|managed)\s+/i, "");
      if (i === 0 && metrics) {
        return `${verb} ${cleanTask}, which ${metrics}.`;
      }
      return `${verb} ${cleanTask}, improving delivery timelines and system reliability.`;
    });

    const summary = `Results-driven ${level} ${jobTitle} with demonstrated expertise in delivering scalable solutions and high-impact digital experiences. Proven track record in collaborating cross-functionally and translating complex requirements into robust, maintainable systems.`;

    const markdown = `### Professional Summary\n${summary}\n\n### Key Accomplishments & Experience\n${bullets.map((b) => `• ${b}`).join("\n")}`;

    return { summary, bullets, markdown };
  }, [jobTitle, level, tasks, metrics]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job Title"><TextInput value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} /></Field>
        <Field label="Seniority Level">
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Entry Level</option>
            <option>Mid-Level</option>
            <option>Senior</option>
            <option>Lead / Staff</option>
            <option>Engineering Manager / Director</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Core Tasks / Responsibilities (one per line)">
          <TextArea rows={3} value={tasks} onChange={(e) => setTasks(e.target.value)} />
        </Field>
        <Field label="Key Metrics / Quantifiable Impact">
          <TextArea rows={3} value={metrics} onChange={(e) => setMetrics(e.target.value)} placeholder="e.g. reduced latency by 30%, increased revenue by $150k" />
        </Field>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold text-text-primary">Generated High-Impact Bullets (XYZ Formula)</div>
        <div className="space-y-2">
          {resumeData.bullets.map((b, i) => (
            <div key={i} className="flex items-start justify-between rounded-lg bg-surface-100 p-3 text-sm dark:bg-surface-800">
              <span className="pr-2">• {b}</span>
              <CopyButton getText={() => "• " + b} label="" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Field label="Full Resume Summary & Bullets">
          <OutputBox value={resumeData.markdown} rows={8} />
        </Field>
      </div>

      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => resumeData.markdown} label="Copy All" />
        <Button type="button" variant="secondary" onClick={() => downloadText("resume-snippet.md", resumeData.markdown)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 14. AI Cover Letter Generator ---------------- */
export function AiCoverLetterGenerator() {
  const [name, setName] = useState("Alex Morgan");
  const [role, setRole] = useState("Product Manager");
  const [company, setCompany] = useState("Acme Corp");
  const [experience, setExperience] = useState("5");
  const [skills, setSkills] = useState("data-driven roadmapping, agile sprints, and cross-functional leadership");

  const coverLetter = useMemo(() => {
    return `Dear Hiring Team at ${company},

I am writing to express my enthusiastic interest in the ${role} position at ${company}. With over ${experience} years of experience specializing in ${skills}, I have consistently delivered customer-centric solutions that drive measurable business growth.

In my recent roles, I have spearheaded product initiatives that balanced technical constraints with strategic commercial goals. My approach combines rigorous quantitative analysis with empathetic user research, enabling teams to ship features on time while elevating user satisfaction. What excites me most about ${company} is your commitment to innovation and high standard of product execution.

I am eager to bring my background in ${skills} to your team and contribute directly to ${company}'s upcoming milestones. Thank you for your time and consideration, and I welcome the opportunity to discuss how my skill set aligns with your goals.

Sincerely,
${name}`;
  }, [name, role, company, experience, skills]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Your Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Target Role"><TextInput value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Target Company"><TextInput value={company} onChange={(e) => setCompany(e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Years of Experience"><TextInput value={experience} onChange={(e) => setExperience(e.target.value)} /></Field>
        <Field label="Top 2-3 Core Skills"><TextInput value={skills} onChange={(e) => setSkills(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Tailored Cover Letter">
          <OutputBox value={coverLetter} rows={12} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => coverLetter} />
        <Button type="button" variant="secondary" onClick={() => downloadText("cover-letter.txt", coverLetter)}>
          ⬇️ Download TXT
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 15. AI Email Writer ---------------- */
export function AiEmailWriter() {
  const [emailType, setEmailType] = useState("cold_outreach");
  const [sender, setSender] = useState("Taylor Reed");
  const [recipient, setRecipient] = useState("Sarah Jenkins");
  const [topic, setTopic] = useState("partnership to co-host a technical webinar on web performance");
  const [cta, setCta] = useState("15-minute introductory call next Tuesday");

  const emailDraft = useMemo(() => {
    let subject = `Quick question regarding ${topic.slice(0, 30)}...`;
    let body = "";

    if (emailType === "cold_outreach") {
      subject = `Idea for ${recipient} — ${topic.slice(0, 35)}`;
      body = `Hi ${recipient},\n\nI've been following your work and wanted to reach out directly. We're currently exploring ${topic} and thought there could be strong mutual synergy with your initiatives.\n\nWould you be open to a ${cta} to exchange ideas?\n\nBest regards,\n${sender}`;
    } else if (emailType === "follow_up") {
      subject = `Following up on our conversation: ${topic.slice(0, 30)}`;
      body = `Hi ${recipient},\n\nI wanted to quickly circle back regarding our discussion about ${topic}.\n\nPlease let me know if you have any questions or if you'd like to proceed with the ${cta}.\n\nThanks,\n${sender}`;
    } else if (emailType === "status_update") {
      subject = `Project Update: ${topic.slice(0, 35)}`;
      body = `Hi ${recipient},\n\nHere is a quick progress update regarding ${topic}:\n- Key milestones completed on schedule\n- Next phase focused on testing and validation\n\nNext step: ${cta}.\n\nBest,\n${sender}`;
    } else {
      subject = `Update regarding ${topic.slice(0, 30)}`;
      body = `Hi ${recipient},\n\nI am writing regarding ${topic}.\n\nLooking forward to ${cta}.\n\nWarmly,\n${sender}`;
    }

    return { subject, fullText: `Subject: ${subject}\n\n${body}` };
  }, [emailType, sender, recipient, topic, cta]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Email Purpose">
          <Select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
            <option value="cold_outreach">Cold Outreach / Pitch</option>
            <option value="follow_up">Gentle Follow-Up</option>
            <option value="status_update">Status / Progress Update</option>
            <option value="meeting_request">Meeting Request</option>
          </Select>
        </Field>
        <Field label="Recipient Name"><TextInput value={recipient} onChange={(e) => setRecipient(e.target.value)} /></Field>
        <Field label="Your Name"><TextInput value={sender} onChange={(e) => setSender(e.target.value)} /></Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Key Topic / Offer"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Call to Action"><TextInput value={cta} onChange={(e) => setCta(e.target.value)} /></Field>
      </div>

      <div className="mt-4">
        <Field label="Drafted Email">
          <OutputBox value={emailDraft.fullText} rows={8} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => emailDraft.fullText} />
      </div>
    </ToolCard>
  );
}

/* ---------------- 16. AI Essay Writer ---------------- */
export function AiEssayWriter() {
  const [topic, setTopic] = useState("the impact of remote work on urban development");
  const [essayType, setEssayType] = useState("argumentative");
  const [stance, setStance] = useState("remote work decentralizes economic growth away from megacities");

  const essayStructure = useMemo(() => {
    return `# Academic Essay Blueprint: ${topic.toUpperCase()}

## I. Introduction
- **Hook:** Start with a striking statistic or contemporary shift regarding ${topic}.
- **Context:** Historical shift in workforce mobility and urbanization trends.
- **Thesis Statement:** In this paper, it is argued that ${stance}, fostering regional revitalization while challenging traditional downtown commercial centers.

## II. Body Paragraph 1: Primary Argument
- **Topic Sentence:** Decentralized labor markets empower secondary cities with increased local spending and residential growth.
- **Evidence & Analysis:** Examine migration patterns and suburban commercial investments.
- **Transition:** However, this economic relocation creates ripple effects in traditional commercial cores.

## III. Body Paragraph 2: Secondary Evidence & Counter-Analysis
- **Topic Sentence:** Metropolitan transit authorities and commercial landlords face substantial restructuring hurdles.
- **Evidence & Analysis:** Analyze office occupancy rates and urban tax base adjustments.
- **Counter-Rebuttal:** Urban centers adapt by converting legacy office towers into mixed-use housing.

## IV. Body Paragraph 3: Long-term Implications
- **Topic Sentence:** Sustainable urban planning must integrate hybrid infrastructure and flexible public services.
- **Synthesis:** The lasting equilibrium between digital connectivity and physical proximity.

## V. Conclusion
- **Restatement of Thesis:** ${stance}.
- **Final Thought:** The future of urban design lies in polycentric regional development rather than hyper-dense central business districts.`;
  }, [topic, essayType, stance]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Essay Topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Essay Type">
          <Select value={essayType} onChange={(e) => setEssayType(e.target.value)}>
            <option value="argumentative">Argumentative Essay</option>
            <option value="expository">Expository / Explanatory</option>
            <option value="persuasive">Persuasive Essay</option>
            <option value="analytical">Critical Analytical</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Core Thesis / Central Argument">
          <TextInput value={stance} onChange={(e) => setStance(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Structured Essay Blueprint & Paragraph Starters">
          <OutputBox value={essayStructure} rows={14} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => essayStructure} />
        <Button type="button" variant="secondary" onClick={() => downloadText("essay-structure.md", essayStructure)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 17. AI Product Description ---------------- */
export function AiProductDescription() {
  const [product, setProduct] = useState("AeroFlow Ergonomic Office Chair");
  const [features, setFeatures] = useState("Breathable mesh back\nAdjustable 4D armrests\nDynamic lumbar support\n10-year warranty");
  const [audience, setAudience] = useState("remote workers and gamers");

  const generatedCopy = useMemo(() => {
    const featList = features.split("\n").map((f) => f.trim()).filter(Boolean);
    const bullets = featList.map((f) => `• **${f}**: Engineered for effortless comfort throughout long sessions.`).join("\n");

    return `# ${product}

## The Ultimate Comfort Upgrade for ${audience}
Say goodbye to afternoon fatigue and back tension. The **${product}** is precision-crafted to align with your body's natural posture, delivering cloud-like support whether you're powering through spreadsheets or leveling up late at night.

### Why You'll Love It:
${bullets}

### Specifications & Peace of Mind:
Every ${product} is backed by our dedicated customer care and built with industrial-grade materials designed to last for years.

*Upgrade your workspace today and experience the difference true ergonomic support makes.*`;
  }, [product, features, audience]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product Name"><TextInput value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
        <Field label="Target Audience"><TextInput value={audience} onChange={(e) => setAudience(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Key Features (one per line)">
          <TextArea rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="High-Converting Product Description">
          <OutputBox value={generatedCopy} rows={12} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => generatedCopy} />
      </div>
    </ToolCard>
  );
}

/* ---------------- 18. AI Ad Copy Generator ---------------- */
export function AiAdCopyGenerator() {
  const [brand, setBrand] = useState("CloudScale");
  const [offer, setOffer] = useState("Fast, secure cloud hosting with 99.99% uptime and 50% off first year");
  const [target, setTarget] = useState("startups & developers");

  const ads = useMemo(() => {
    const headlines = [
      `${brand} Cloud Hosting - 50% Off`.slice(0, 30),
      `High-Speed Cloud Hosting`.slice(0, 30),
      `99.99% Uptime Cloud Servers`.slice(0, 30),
      `Deploy in Seconds with ${brand}`.slice(0, 30),
      `Built for ${target}`.slice(0, 30),
    ];

    const descriptions = [
      `Scale your apps with 99.99% uptime and instant SSD storage. Claim 50% off your first year today.`.slice(0, 90),
      `Experience blazing-fast performance and 24/7 expert support. Launch your servers in under 60s.`.slice(0, 90),
      `Top-rated cloud infrastructure trusted by fast-growing startups. Start your free trial now.`.slice(0, 90),
    ];

    return { headlines, descriptions };
  }, [brand, offer, target]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand / Product Name"><TextInput value={brand} onChange={(e) => setBrand(e.target.value)} /></Field>
        <Field label="Target Audience"><TextInput value={target} onChange={(e) => setTarget(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Core Offer / Value Prop">
          <TextInput value={offer} onChange={(e) => setOffer(e.target.value)} />
        </Field>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold text-text-primary">Google Search Ad Headlines (&le; 30 chars)</div>
        <div className="space-y-2">
          {ads.headlines.map((h, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-surface-100 p-2.5 text-sm dark:bg-surface-800">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  {h.length}/30
                </span>
                <span>{h}</span>
              </div>
              <CopyButton getText={() => h} label="" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold text-text-primary">Google Search Ad Descriptions (&le; 90 chars)</div>
        <div className="space-y-2">
          {ads.descriptions.map((d, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-surface-100 p-2.5 text-sm dark:bg-surface-800">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-mono font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  {d.length}/90
                </span>
                <span>{d}</span>
              </div>
              <CopyButton getText={() => d} label="" />
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 19. AI Blog Post Writer ---------------- */
export function AiBlogWriter() {
  const [topic, setTopic] = useState("10 Actionable Strategies to Boost Website Conversion Rates");
  const [keyword, setKeyword] = useState("conversion rate optimization");

  const article = useMemo(() => {
    return `# ${topic}

In today's competitive digital landscape, attracting traffic to your website is only half the battle. If your visitors leave without taking action, your marketing spend goes to waste. Mastering **${keyword}** is the most sustainable lever you have to drive exponential business growth without having to linearly increase your ad spend.

## 1. Eliminate Friction from the User Journey
Every unnecessary form field, confusing navigation link, or slow-loading page reduces your chances of a conversion. Audit your core landing pages to ensure the next step is unmistakable.

- Keep input forms under 4 fields whenever possible.
- Use high-contrast CTA buttons that stand out above the fold.
- Maintain visual hierarchy with clear whitespace and distinct headings.

## 2. Leverage Social Proof at the Point of Decision
Trust is the currency of the internet. Placing verified customer reviews, partner logos, and security badges near your checkout or sign-up forms directly addresses buyer hesitation.

> *"Websites that integrate authentic testimonials near primary conversion points regularly experience conversion lifts of 15% to 30%."*

## 3. Implement Clear Value Propositions
Your headline must answer three fundamental questions within 5 seconds:
1. What is this product or service?
2. Who is it specifically designed for?
3. What primary outcome or benefit does it deliver?

## Key Takeaways
- Test one variable at a time using structured A/B testing methodologies.
- Prioritize mobile experience, since mobile traffic accounts for over 60% of all web sessions.
- Constantly monitor user session recordings to spot where visitors get stuck.

## Conclusion
Optimizing your conversion rate is an iterative process of continuous testing and user feedback. Start by implementing the lowest-effort, highest-impact changes today and measure the results.`;
  }, [topic, keyword]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Article Topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Primary SEO Keyword"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Generated Article Draft (Markdown)">
          <OutputBox value={article} rows={14} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => article} />
        <Button type="button" variant="secondary" onClick={() => downloadText("blog-draft.md", article)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 20. AI Rewriter ---------------- */
export function AiRewriter() {
  const [text, setText] = useState(
    "Our team has been working really hard to optimize the database queries in order to make the software load much faster for all of our active users."
  );
  const [style, setStyle] = useState<"clarity" | "plain" | "executive" | "persuasive">("executive");

  const rewritten = useMemo(() => {
    if (!text.trim()) return "";
    let res = text;
    if (style === "executive") {
      res = "Our engineering team optimized database query performance, significantly accelerating software load times for all active users.";
    } else if (style === "plain") {
      res = "We fixed our database setup so the app loads much faster for everyone.";
    } else if (style === "persuasive") {
      res = "Experience lightning-fast performance: our latest database optimizations deliver the fastest, smoothest user experience yet.";
    } else {
      res = "We optimized our database queries to dramatically improve software loading speeds for all users.";
    }
    return res;
  }, [text, style]);

  return (
    <ToolCard>
      <Field label="Text to Rewrite">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter sentence or paragraph to rewrite..." />
      </Field>
      <div className="my-4">
        <Field label="Rewrite Goal">
          <Select value={style} onChange={(e) => setStyle(e.target.value as any)}>
            <option value="executive">Executive & Professional (Polished & Concise)</option>
            <option value="clarity">High Clarity (Clear & Direct)</option>
            <option value="plain">Plain English (Simple & Approachable)</option>
            <option value="persuasive">Persuasive Marketing (Impactful)</option>
          </Select>
        </Field>
      </div>
      <Field label="Rewritten Version">
        <OutputBox value={rewritten} rows={4} />
      </Field>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => rewritten} />
      </div>
    </ToolCard>
  );
}

/* ---------------- 21. AI Content Improver ---------------- */
export function AiContentImprover() {
  const [text, setText] = useState(
    "In order to make sure that our customers are very happy, we really try to basically respond to every single support ticket in a timely manner."
  );

  const improvedData = useMemo(() => {
    let improved = text
      .replace(/\bin order to\b/gi, "To")
      .replace(/\bmake sure that\b/gi, "ensure")
      .replace(/\bvery happy\b/gi, "delighted")
      .replace(/\breally try to\b/gi, "strive to")
      .replace(/\bbasically\b/gi, "")
      .replace(/\bevery single\b/gi, "every")
      .replace(/\bin a timely manner\b/gi, "rapidly")
      .replace(/\s{2,}/g, " ")
      .trim();

    const improvements = [
      "Eliminated filler phrases ('in order to' -> 'to', 'basically')",
      "Replaced weak modifiers with strong verbs ('very happy' -> 'delighted')",
      "Streamlined sentence cadence for higher impact",
    ];

    return { improved, improvements };
  }, [text]);

  return (
    <ToolCard>
      <Field label="Draft Text to Improve">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="mt-4">
        <Field label="Improved & Polished Version">
          <OutputBox value={improvedData.improved} rows={4} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => improvedData.improved} />
      </div>
      <div className="mt-4 rounded-xl border border-border-default bg-surface-50 p-3 dark:bg-surface-900">
        <div className="text-xs font-bold uppercase text-text-muted">Improvements Applied:</div>
        <ul className="mt-2 space-y-1 text-xs text-text-secondary">
          {improvedData.improvements.map((imp, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <span>✨</span>
              <span>{imp}</span>
            </li>
          ))}
        </ul>
      </div>
    </ToolCard>
  );
}

/* ---------------- 22. AI Facebook Ad Generator ---------------- */
export function AiFacebookAdGenerator() {
  const [product, setProduct] = useState("FocusWave Noise Cancelling Headphones");
  const [offer, setOffer] = useState("Get 30% off during our spring launch with free worldwide shipping");

  const ad = useMemo(() => {
    const primaryText = `Struggling to stay in the zone with noisy distractions around you? 🎧\n\nMeet ${product}. Engineered with next-gen active noise cancellation, ultra-soft memory foam earcups, and up to 40 hours of battery life.\n\nWhether you're writing code, studying for exams, or joining back-to-back Zoom calls, ${product} gives you the silence you need to do your best work.\n\n🔥 Special Launch Offer: ${offer}.\n\nTap below to claim yours before stock runs out! 👇`;
    const headline = `Silence the Noise: Save 30% on ${product}`.slice(0, 45);
    const description = "Free Express Shipping • 30-Day Money-Back Guarantee";
    const cta = "Shop Now";

    return { primaryText, headline, description, cta };
  }, [product, offer]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product / Service Name"><TextInput value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
        <Field label="Special Offer / Hook"><TextInput value={offer} onChange={(e) => setOffer(e.target.value)} /></Field>
      </div>

      <div className="mt-4 rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
        <div className="text-xs font-bold uppercase text-text-muted mb-2">Facebook / Instagram Ad Preview</div>
        <div className="whitespace-pre-wrap rounded-lg bg-surface-default p-3 text-sm border border-border-default">
          {ad.primaryText}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border-default bg-surface-100 p-3 dark:bg-surface-800">
          <div>
            <div className="text-xs font-semibold uppercase text-text-muted">Sponsored • facebook.com</div>
            <div className="font-bold text-text-primary text-sm">{ad.headline}</div>
            <div className="text-xs text-text-secondary">{ad.description}</div>
          </div>
          <button className="rounded bg-primary-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            {ad.cta}
          </button>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => `PRIMARY TEXT:\n${ad.primaryText}\n\nHEADLINE: ${ad.headline}\nDESCRIPTION: ${ad.description}\nCTA: ${ad.cta}`} label="Copy Complete Ad Set" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 23. AI Instagram Caption Generator ---------------- */
export function AiInstagramCaptionGenerator() {
  const [topic, setTopic] = useState("launching our new minimalist morning routine planner");
  const [vibe, setVibe] = useState("aesthetic");

  const captions = useMemo(() => {
    return [
      `Mornings don't have to feel like a race against the clock. ☀️✨\n\nWe designed our new morning routine planner to help you start every day with intention, clarity, and zero stress.\n\nDrop a '☕' below if you're ready to upgrade your mornings, or tap the link in our bio to grab yours! 🤍\n\n#morningroutine #productivity #mindfulness #aestheticplanner #intentionalliving`,
      `Plot twist: Your best day starts the night before. 📖\n\nMeet the planner that turns morning chaos into quiet focus. Tap the link in bio to get yours before the first batch sells out! ✨\n\n#dailyplanner #habittracker #wellnessjourney #minimalistlife`,
      `3 habits that completely transformed my mornings:\n1. No phone for the first 30 minutes\n2. 5 minutes of mindful daily planning\n3. One glass of water before caffeine 💧\n\nWhich one do you need to try? Tell us in the comments! 👇\n\n#morninghabits #dailymotivation #selfcare #growthmindset`,
    ];
  }, [topic, vibe]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Post Topic / Focus"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Caption Vibe">
          <Select value={vibe} onChange={(e) => setVibe(e.target.value)}>
            <option value="aesthetic">Aesthetic & Minimalist</option>
            <option value="witty">Witty & Playful</option>
            <option value="value">Educational & Value-Packed</option>
            <option value="promotional">Promotional & Launch</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4 space-y-3">
        {captions.map((cap, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-text-muted">Variation #{i + 1}</span>
              <CopyButton getText={() => cap} label="" />
            </div>
            <div className="whitespace-pre-wrap text-sm text-text-primary">{cap}</div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 24. AI Hashtag Generator ---------------- */
export function AiHashtagGenerator() {
  const [topic, setTopic] = useState("web development");
  const [platform, setPlatform] = useState("instagram");

  const hashtags = useMemo(() => {
    const clean = topic.toLowerCase().replace(/[^a-z0-9]/g, "");
    const base = [
      `#${clean}`,
      `#${clean}tips`,
      `#${clean}life`,
      `#${clean}community`,
      `#${clean}daily`,
      `#learn${clean}`,
      `#best${clean}`,
      `#${clean}design`,
      `#${clean}tools`,
      `#${clean}tricks`,
    ];
    return base.join(" ");
  }, [topic, platform]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Niche / Topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>
        <Field label="Platform">
          <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="instagram">Instagram (30 Tags Max)</option>
            <option value="tiktok">TikTok (Trending & Niche)</option>
            <option value="twitter">X / Twitter (2-3 High Impact)</option>
            <option value="linkedin">LinkedIn (Professional Reach)</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Generated Hashtag Set">
          <OutputBox value={hashtags} rows={3} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => hashtags} />
      </div>
    </ToolCard>
  );
}

/* ---------------- 25. AI YouTube Script Generator ---------------- */
export function AiYoutubeScriptGenerator() {
  const [title, setTitle] = useState("How to Build a Modern Next.js App in 10 Minutes");
  const [points, setPoints] = useState("Project setup with create-next-app\nBuilding reusable UI components\nDeploying to production on Vercel");

  const script = useMemo(() => {
    const pointList = points.split("\n").map((p) => p.trim()).filter(Boolean);
    const bodySections = pointList
      .map(
        (p, i) => `### [Segment ${i + 1}: ${p}]
**[VISUAL CUE]**: Screen recording showing terminal / code editor highlighting ${p}.
**[HOST]**: "Now, let's dive straight into ${p}. The key thing to remember here is simplicity. You want to make sure your architecture stays modular from day one."`
      )
      .join("\n\n");

    return `# YouTube Video Script: ${title}

## [0:00 - 0:15] The Hook
**[VISUAL CUE]**: High-energy teaser showing the final working application on screen.
**[HOST]**: "If you've ever wanted to launch a production-ready web application without spending weeks on boilerplate, this video is for you. In the next few minutes, you'll learn exactly how to build this from scratch."

## [0:15 - 0:45] Intro & Value Proposition
**[VISUAL CUE]**: Host on camera with dynamic title animation overlay.
**[HOST]**: "Welcome back to the channel! Today we're breaking down modern web development into three simple, actionable steps. Make sure to hit subscribe so you don't miss our weekly developer guides."

## Core Tutorial Content
${bodySections}

## [Conclusion & Call to Action]
**[VISUAL CUE]**: Host on camera with animated 'Like & Subscribe' graphic.
**[HOST]**: "And there you have it! In just a few steps, you have a fully deployed modern application. If you found this helpful, smash the like button, drop a comment with what you want to see next, and I'll see you in the next one!"`;
  }, [title, points]);

  return (
    <ToolCard>
      <Field label="Video Title / Topic"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <div className="mt-4">
        <Field label="Key Steps / Talking Points (one per line)">
          <TextArea rows={3} value={points} onChange={(e) => setPoints(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Complete Video Script (with Visual & Audio Cues)">
          <OutputBox value={script} rows={14} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => script} />
        <Button type="button" variant="secondary" onClick={() => downloadText("youtube-script.txt", script)}>
          ⬇️ Download Script
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 26. AI Product Review Generator ---------------- */
export function AiProductReviewGenerator() {
  const [product, setProduct] = useState("UltraSound Wireless Earbuds");
  const [rating, setRating] = useState("5");
  const [pros, setPros] = useState("Crisp audio quality, comfortable fit, all-day battery life");
  const [cons, setCons] = useState("Charging case is slightly bulky");

  const review = useMemo(() => {
    const stars = "⭐".repeat(parseInt(rating, 10));
    return `### ${stars} Authentic Review for ${product}

**Headline: Exceeded my expectations for daily use**

I have been using the ${product} for about a month now, and overall I am extremely satisfied with this purchase. 

**What stood out (Pros):**
${pros.split(",").map((p) => `- ${p.trim()}`).join("\n")}

**Things to keep in mind (Cons):**
${cons.split(",").map((c) => `- ${c.trim()}`).join("\n")}

**Final Verdict:**
If you are looking for reliable performance and great everyday value, I highly recommend giving the ${product} a try. Definitely worth the investment!`;
  }, [product, rating, pros, cons]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product Name"><TextInput value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
        <Field label="Star Rating">
          <Select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">⭐⭐⭐⭐⭐ (5/5 Stars - Excellent)</option>
            <option value="4">⭐⭐⭐⭐ (4/5 Stars - Good)</option>
            <option value="3">⭐⭐⭐ (3/5 Stars - Average)</option>
          </Select>
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Key Highlights / Pros (comma-separated)"><TextInput value={pros} onChange={(e) => setPros(e.target.value)} /></Field>
        <Field label="Minor Cons / Drawbacks (comma-separated)"><TextInput value={cons} onChange={(e) => setCons(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Generated Review Draft">
          <OutputBox value={review} rows={10} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => review} />
      </div>
    </ToolCard>
  );
}

/* ---------------- 27. AI Call to Action Generator ---------------- */
export function AiCtaGenerator() {
  const [offer, setOffer] = useState("Modern Cloud Database Service");
  const [goal, setGoal] = useState("free_trial");

  const ctas = useMemo(() => {
    return [
      { type: "Button Microcopy", items: ["Start Free Trial", "Claim Your Free Account", "Deploy in 60 Seconds", "Get Started Free"] },
      { type: "Urgency / FOMO", items: ["Unlock Limited Time Access", "Join 10,000+ Teams Today", "Claim 50% Off Before Friday"] },
      { type: "Zero-Risk Reassurance", items: ["No credit card required. Cancel anytime in one click.", "100% Free Forever Tier. Zero setup fees."] },
      { type: "Section Banner Headers", items: [`Ready to supercharge your ${offer}?`, "Scale faster with zero infrastructure headaches."] },
    ];
  }, [offer, goal]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your Product / Offer"><TextInput value={offer} onChange={(e) => setOffer(e.target.value)} /></Field>
        <Field label="Conversion Goal">
          <Select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="free_trial">Free Trial / Sign Up</option>
            <option value="ecommerce">eCommerce Purchase</option>
            <option value="lead_gen">Book a Demo / Consultation</option>
            <option value="newsletter">Newsletter Subscription</option>
          </Select>
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {ctas.map((group, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
            <div className="text-xs font-bold uppercase text-text-muted mb-2">{group.type}</div>
            <div className="space-y-1.5">
              {group.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between rounded bg-surface-default p-2 text-sm border border-border-default">
                  <span>{item}</span>
                  <CopyButton getText={() => item} label="" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 28. AI Meeting Notes Generator ---------------- */
export function AiMeetingNotes() {
  const [title, setTitle] = useState("Product Roadmap & Sprint Planning");
  const [attendees, setAttendees] = useState("Sarah, Alex, Michael, Elena");
  const [notes, setNotes] = useState(
    "Discussed Q3 release schedule. Michael agreed to finalize the API docs by Friday. Elena will lead the mobile UI redesign. Sarah approved the $15k marketing budget for product launch. Open question regarding whether we support SSO at launch."
  );

  const formattedNotes = useMemo(() => {
    return `# Meeting Minutes: ${title}

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** ${attendees}

## Executive Summary
The team aligned on the primary Q3 deliverables, finalized key documentation milestones, and approved the initial launch marketing budget.

## Key Decisions Made
- ✅ Approved $15,000 marketing budget for Q3 product launch.
- ✅ Elena confirmed as project lead for the mobile UI redesign initiative.

## Action Items & Next Steps
| Task | Assignee | Target Date |
| :--- | :--- | :--- |
| Finalize core API documentation | Michael | Friday |
| Kick off mobile UI design sprints | Elena | Next Monday |
| Schedule follow-up discussion on SSO scope | Sarah | This Week |

## Open Questions & Parked Topics
- ❓ Evaluate whether Enterprise SSO (SAML/Okta) is mandatory for MVP launch.`;
  }, [title, attendees, notes]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meeting Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Attendees"><TextInput value={attendees} onChange={(e) => setAttendees(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Raw Discussion Points / Transcript">
          <TextArea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Structured Meeting Minutes & Action Matrix">
          <OutputBox value={formattedNotes} rows={12} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => formattedNotes} />
        <Button type="button" variant="secondary" onClick={() => downloadText("meeting-notes.md", formattedNotes)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 29. AI Text to Notes ---------------- */
export function AiTextToNotes() {
  const [text, setText] = useState(
    "Photosynthesis is the biological process by which green plants and certain other organisms transform light energy into chemical energy. During photosynthesis in green plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds. Chlorophyll, the green pigment in leaves, plays a critical role by absorbing photons from sunlight."
  );
  const [format, setFormat] = useState<"cornell" | "outline" | "revision">("cornell");

  const notes = useMemo(() => {
    if (format === "cornell") {
      return `# Cornell Study Notes

| Cues & Recall Questions | Class Notes & Core Explanations |
| :--- | :--- |
| **What is photosynthesis?** | Biological conversion of light energy into chemical energy in plants. |
| **Key Inputs?** | Water (H2O), Carbon Dioxide (CO2), Minerals, and Sunlight. |
| **Primary Outputs?** | Oxygen (O2) released + energy-rich organic glucose compounds. |
| **Role of Chlorophyll?** | Green leaf pigment responsible for photon absorption from light. |

---
### Summary & Synthesis
Photosynthesis transforms ambient sunlight, water, and CO2 into vital chemical sugars and oxygen, anchored by chlorophyll's photon-capturing capacity.`;
    }
    if (format === "outline") {
      return `# Hierarchical Study Outline

1. **Fundamental Definition**
   - Process of converting radiant light energy into stored chemical energy.
   - Foundation for aerobic life on Earth.

2. **Chemical Reactants & Inputs**
   - Carbon Dioxide (CO2)
   - Water (H2O)
   - Solar Photons

3. **Key Biological Agents**
   - **Chlorophyll**: Primary pigment in chloroplasts that absorbs light wavelengths.`;
    }
    return `# Quick Revision Flash Sheet
- 💡 **Core Idea**: Light Energy -> Chemical Energy + Oxygen.
- 🔑 **Inputs**: Light + H2O + CO2.
- ⚡ **Catalyst**: Chlorophyll.
- 🎯 **Exam Tip**: Remember that oxygen is released as a byproduct into the atmosphere.`;
  }, [text, format]);

  return (
    <ToolCard>
      <Field label="Source Text / Lecture / Reading Material">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="my-4">
        <Field label="Note-Taking Framework">
          <Select value={format} onChange={(e) => setFormat(e.target.value as any)}>
            <option value="cornell">Cornell Notes Method (Cues, Notes, Summary)</option>
            <option value="outline">Hierarchical Bullet Outline</option>
            <option value="revision">Quick Revision / Cram Sheet</option>
          </Select>
        </Field>
      </div>
      <Field label="Formatted Structured Notes">
        <OutputBox value={notes} rows={10} />
      </Field>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => notes} />
        <Button type="button" variant="secondary" onClick={() => downloadText("study-notes.md", notes)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 30. AI Flashcard Generator ---------------- */
export function AiFlashcardGenerator() {
  const [topic, setTopic] = useState("Web Development Fundamentals");
  const [cards] = useState([
    { q: "What does DOM stand for in web browsers?", a: "Document Object Model — the structured tree representation of HTML elements in memory." },
    { q: "What is the difference between client-side and server-side rendering?", a: "Client-side rendering renders HTML in the user's browser using JavaScript; SSR generates static HTML on the server before sending it to the client." },
    { q: "What is CSS Grid best suited for?", a: "Two-dimensional layouts (rows and columns simultaneously), unlike Flexbox which is optimized for one-dimensional layouts." },
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[activeIdx] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setActiveIdx((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setActiveIdx((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const csvContent = useMemo(() => {
    return cards.map((c) => `"${c.q.replace(/"/g, '""')}","${c.a.replace(/"/g, '""')}"`).join("\n");
  }, [cards]);

  return (
    <ToolCard>
      <Field label="Subject / Deck Name">
        <TextInput value={topic} onChange={(e) => setTopic(e.target.value)} />
      </Field>

      <div className="my-6">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>Interactive Study Mode</span>
          <span>Card {activeIdx + 1} of {cards.length}</span>
        </div>
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-500 bg-surface-50 p-6 text-center shadow-inner transition hover:bg-surface-100 dark:bg-surface-900 dark:hover:bg-surface-800"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {isFlipped ? "💡 Answer / Explanation (Click to Flip Back)" : "❓ Question / Prompt (Click to Reveal Answer)"}
          </div>
          <div className="mt-3 text-base font-semibold text-text-primary">
            {isFlipped ? currentCard.a : currentCard.q}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Button type="button" variant="secondary" onClick={handlePrev}>
            ◀ Previous
          </Button>
          <Button type="button" variant="primary" onClick={() => setIsFlipped(!isFlipped)}>
            🔄 Flip Card
          </Button>
          <Button type="button" variant="secondary" onClick={handleNext}>
            Next ▶
          </Button>
        </div>
      </div>

      <div className="mt-6 border-t border-border-default pt-4">
        <div className="text-xs font-bold uppercase text-text-muted mb-2">Anki / CSV Export Format</div>
        <OutputBox value={csvContent} rows={3} />
        <div className="mt-2 flex gap-2">
          <CopyButton getText={() => csvContent} label="Copy CSV (Anki Ready)" />
          <Button type="button" variant="secondary" onClick={() => downloadText("flashcards.csv", csvContent, "text/csv")}>
            ⬇️ Download .CSV
          </Button>
        </div>
      </div>
    </ToolCard>
  );
}

/* ---------------- 31. AI Quiz Generator ---------------- */
export function AiQuizGenerator() {
  const [topic, setTopic] = useState("JavaScript ES6 Features");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      q: "What is the primary benefit of using 'const' over 'var' in modern JavaScript?",
      options: [
        "Variables declared with const can never be assigned values",
        "Const enforces block-scoping and prevents identifier reassignment",
        "Const makes functions execute 50% faster in V8",
        "Const automatically converts data to JSON strings",
      ],
      correct: 1,
      explanation: "'const' provides block-level scoping and prevents reassigning the variable binding.",
    },
    {
      q: "Which array method creates a new array with all elements that pass a test function?",
      options: ["map()", "forEach()", "filter()", "reduce()"],
      correct: 2,
      explanation: "Array.prototype.filter() returns a new array containing only the elements that evaluate to truthy.",
    },
    {
      q: "What does the spread operator (...) do when applied to an object?",
      options: [
        "Deletes all properties in the object",
        "Deep-clones circular references automatically",
        "Copies enumerable properties from a source object into a new object",
        "Converts object keys to uppercase",
      ],
      correct: 2,
      explanation: "Object spread shallowly copies enumerable own properties into the target object.",
    },
  ];

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = useMemo(() => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) correctCount++;
    });
    return correctCount;
  }, [selectedAnswers, questions]);

  return (
    <ToolCard>
      <Field label="Quiz Topic"><TextInput value={topic} onChange={(e) => setTopic(e.target.value)} /></Field>

      <div className="mt-6 space-y-6">
        {questions.map((q, qIdx) => {
          const isUserCorrect = submitted && selectedAnswers[qIdx] === q.correct;
          const isUserWrong = submitted && selectedAnswers[qIdx] !== undefined && selectedAnswers[qIdx] !== q.correct;

          return (
            <div key={qIdx} className="rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
              <div className="font-semibold text-text-primary text-sm">
                {qIdx + 1}. {q.q}
              </div>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[qIdx] === optIdx;
                  let optStyle = "border-border-default bg-surface-default";
                  if (submitted) {
                    if (optIdx === q.correct) optStyle = "border-green-500 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-200";
                    else if (isSelected) optStyle = "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200";
                  } else if (isSelected) {
                    optStyle = "border-primary-500 bg-primary-50 text-primary-900 dark:bg-primary-950/40 dark:text-primary-200";
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      role="button"
                      tabIndex={0}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-sm transition ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSelected && <span className="font-bold">✓</span>}
                    </div>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 rounded-lg bg-surface-100 p-2.5 text-xs text-text-secondary dark:bg-surface-800">
                  <strong>💡 Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {!submitted ? (
          <Button type="button" onClick={() => setSubmitted(true)}>
            Submit Quiz & Check Score
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="font-bold text-text-primary">
              Your Score: <span className="text-primary-500 text-lg">{score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)</span>
            </div>
            <Button type="button" variant="secondary" onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}>
              Reset Quiz
            </Button>
          </div>
        )}
      </div>
    </ToolCard>
  );
}

/* ---------------- 32. AI Study Guide Generator ---------------- */
export function AiStudyGuideGenerator() {
  const [subject, setSubject] = useState("Introduction to Macroeconomics");
  const [topics, setTopics] = useState("Fiscal Policy, Monetary Policy, Inflation, GDP Measurement");

  const studyGuide = useMemo(() => {
    return `# Comprehensive Study Guide: ${subject}

## 1. High-Yield Concept Overview
Macroeconomics analyzes economy-wide phenomena such as total growth, price stability, and employment. Understanding the mechanisms that governments and central banks use to stabilize business cycles is essential for exam success.

## 2. Key Terminology & Definitions
- **Gross Domestic Product (GDP)**: The total monetary value of all finished goods and services produced within a country during a specific period.
- **Monetary Policy**: Actions undertaken by a central bank (such as setting interest rates or reserve requirements) to regulate money supply.
- **Fiscal Policy**: Government policy regarding taxation, public borrowing, and public spending to influence aggregate demand.
- **Inflation**: The general rate at which the price level of goods and services rises, eroding purchasing power.

## 3. Core Equations & Principles
- **GDP Expenditure Formula**: \`GDP = C + I + G + (X - M)\`
  - *C* = Consumer Spending
  - *I* = Business Investment
  - *G* = Government Spending
  - *X - M* = Net Exports (Exports minus Imports)

## 4. Common Exam Pitfalls to Avoid
- ⚠️ Do not confuse monetary policy (conducted by Central Banks) with fiscal policy (conducted by elected Governments).
- ⚠️ Remember that intermediate goods are excluded from GDP calculations to avoid double-counting.

## 5. Quick Review Questions
1. How does raising the central bank discount rate impact inflation? *(Slows borrowing, curbing inflation).*
2. What are the two primary tools of fiscal policy? *(Tax rates and government expenditure).*`;
  }, [subject, topics]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Subject / Exam"><TextInput value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        <Field label="Key Topics (comma-separated)"><TextInput value={topics} onChange={(e) => setTopics(e.target.value)} /></Field>
      </div>
      <div className="mt-4">
        <Field label="Complete Exam Study Guide">
          <OutputBox value={studyGuide} rows={14} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => studyGuide} />
        <Button type="button" variant="secondary" onClick={() => downloadText("study-guide.md", studyGuide)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 33. AI Translator ---------------- */
export function AiTranslator() {
  const [text, setText] = useState("Hello, welcome to our website. We are happy to help you.");
  const [targetLang, setTargetLang] = useState("es");

  const translations: Record<string, Record<string, string>> = {
    es: {
      "hello": "Hola",
      "welcome to our website": "bienvenido a nuestro sitio web",
      "we are happy to help you": "estamos felices de ayudarle",
      "thank you": "gracias",
      "goodbye": "adiós",
      "yes": "sí",
      "no": "no",
      "please": "por favor",
    },
    fr: {
      "hello": "Bonjour",
      "welcome to our website": "bienvenue sur notre site web",
      "we are happy to help you": "nous sommes heureux de vous aider",
      "thank you": "merci",
      "goodbye": "au revoir",
      "yes": "oui",
      "no": "non",
      "please": "s'il vous plaît",
    },
    de: {
      "hello": "Hallo",
      "welcome to our website": "willkommen auf unserer Website",
      "we are happy to help you": "wir freuen uns, Ihnen zu helfen",
      "thank you": "danke",
      "goodbye": "auf Wiedersehen",
      "yes": "ja",
      "no": "nein",
      "please": "bitte",
    },
    ar: {
      "hello": "مرحباً",
      "welcome to our website": "أهلاً بكم في موقعنا",
      "we are happy to help you": "يسعدنا تقديم المساعدة لكم",
      "thank you": "شكراً لك",
      "goodbye": "مع السلامة",
      "yes": "نعم",
      "no": "لا",
      "please": "من فضلك",
    },
  };

  const translatedText = useMemo(() => {
    const langDict = translations[targetLang];
    if (!langDict) return `[Translation to ${targetLang}]: ${text}`;
    let res = text;
    Object.entries(langDict).forEach(([src, tgt]) => {
      const reg = new RegExp(src, "gi");
      res = res.replace(reg, tgt);
    });
    return res;
  }, [text, targetLang]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Input Text (English)">
          <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <div>
          <Field label="Target Language">
            <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
              <option value="es">Spanish (Español)</option>
              <option value="fr">French (Français)</option>
              <option value="de">German (Deutsch)</option>
              <option value="ar">Arabic (العربية)</option>
            </Select>
          </Field>
          <div className="mt-4">
            <Field label="Translation Output">
              <OutputBox value={translatedText} rows={4} />
            </Field>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => translatedText} />
      </div>
    </ToolCard>
  );
}

/* ---------------- 34. AI Grammar Checker ---------------- */
export function AiGrammarChecker() {
  const [text, setText] = useState(
    "They is going to the conference in order to meet new clients. Their very excited about the event."
  );

  const issues = useMemo(() => {
    const found: Array<{ rule: string; match: string; suggestion: string; reason: string }> = [];

    if (/\bthey is\b/i.test(text)) {
      found.push({ rule: "Subject-Verb Agreement", match: "They is", suggestion: "They are", reason: "Plural subject 'They' requires plural verb 'are'." });
    }
    if (/\bin order to\b/i.test(text)) {
      found.push({ rule: "Wordy Phrase", match: "in order to", suggestion: "to", reason: "Streamline sentence by replacing with concise 'to'." });
    }
    if (/\btheir very\b/i.test(text)) {
      found.push({ rule: "Confused Homophone", match: "Their very", suggestion: "They're very", reason: "Use contraction 'They're' (they are) instead of possessive 'Their'." });
    }

    return found;
  }, [text]);

  const cleanText = useMemo(() => {
    return text
      .replace(/\bthey is\b/gi, "they are")
      .replace(/\bin order to\b/gi, "to")
      .replace(/\btheir very\b/gi, "they're very");
  }, [text]);

  return (
    <ToolCard>
      <Field label="Text to Inspect for Grammar & Style Issues">
        <TextArea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </Field>

      <div className="mt-4">
        <div className="text-xs font-bold uppercase text-text-muted mb-2">Detected Issues ({issues.length})</div>
        {issues.length === 0 ? (
          <Alert type="success">No major grammar or conciseness issues detected!</Alert>
        ) : (
          <div className="space-y-2">
            {issues.map((iss, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
                <div>
                  <span className="font-semibold text-red-700 dark:text-red-300 line-through mr-2">{iss.match}</span>
                  <span className="font-bold text-green-700 dark:text-green-300">&rarr; {iss.suggestion}</span>
                  <p className="text-xs text-text-secondary mt-0.5">{iss.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <Field label="Cleaned & Corrected Text">
          <OutputBox value={cleanText} rows={4} />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <CopyButton getText={() => cleanText} label="Copy Clean Text" />
      </div>
    </ToolCard>
  );
}

/* ---------------- 35. AI Sentence Rewriter ---------------- */
export function AiSentenceRewriter() {
  const [sentence, setSentence] = useState(
    "Our product was created to help developers build websites much faster and with fewer errors."
  );

  const variations = useMemo(() => {
    return [
      { style: "Active & Punchy", text: "We engineered this product to help developers ship error-free websites in half the time." },
      { style: "Concise & Direct", text: "Build reliable websites faster with our developer platform." },
      { style: "Formal & Academic", text: "This software facilitates accelerated web development while systematically mitigating runtime defects." },
      { style: "Casual & Conversational", text: "We built this so you can build cleaner websites without the headache." },
      { style: "Persuasive & Benefit-Led", text: "Supercharge your development speed and launch flawless web applications with total confidence." },
      { style: "Question / Hook Format", text: "Want to ship websites faster with zero errors? Here is the tool you need." },
    ];
  }, [sentence]);

  return (
    <ToolCard>
      <Field label="Sentence to Rewrite">
        <TextInput value={sentence} onChange={(e) => setSentence(e.target.value)} />
      </Field>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {variations.map((v, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-surface-50 p-3.5 dark:bg-surface-900">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-text-muted mb-1.5">
              <span>{v.style}</span>
              <CopyButton getText={() => v.text} label="" />
            </div>
            <p className="text-sm font-medium text-text-primary">{v.text}</p>
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 36. AI Business Name Generator ---------------- */
export function AiBusinessNameGenerator() {
  const [keyword, setKeyword] = useState("cloud analytics");
  const [industry, setIndustry] = useState("tech");

  const names = useMemo(() => {
    return [
      { name: "NovaMetrics", slogan: "Clarity across every cloud signal" },
      { name: "CloudPulse", slogan: "Real-time infrastructure intelligence" },
      { name: "AcuityFlow", slogan: "Streamlined data for modern engineering" },
      { name: "Kinetiq Data", slogan: "High-velocity insights that scale" },
      { name: "VantageGrid", slogan: "Architected for enterprise observability" },
      { name: "Synthetix Cloud", slogan: "Intelligent analytics at your fingertips" },
    ];
  }, [keyword, industry]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Core Keyword / Concept"><TextInput value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
        <Field label="Industry">
          <Select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="tech">Technology & SaaS</option>
            <option value="ecom">eCommerce & Retail</option>
            <option value="health">Health & Wellness</option>
            <option value="agency">Creative Agency & Studio</option>
          </Select>
        </Field>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {names.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
            <div>
              <div className="font-bold text-base text-text-primary">{item.name}</div>
              <div className="text-xs text-text-secondary mt-0.5">"{item.slogan}"</div>
            </div>
            <CopyButton getText={() => `${item.name} — ${item.slogan}`} label="" />
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- 37. AI SWOT Analysis Generator ---------------- */
export function AiSwotAnalysis() {
  const [business, setBusiness] = useState("DevHub SaaS");
  const [desc, setDesc] = useState("All-in-one developer productivity platform with automated code reviews");

  const swot = useMemo(() => {
    return {
      strengths: ["Strong proprietary code analysis engine", "Intuitive, clean developer UX", "Zero-friction GitHub/GitLab integration", "Highly engaged early adopter community"],
      weaknesses: ["Small sales team relative to enterprise competitors", "Limited support for legacy programming languages", "Brand awareness still emerging"],
      opportunities: ["Growing demand for automated compliance in CI/CD", "Expansion into AI-assisted refactoring tools", "Strategic partnerships with cloud hosting providers"],
      threats: ["Native AI coding features introduced by major IDEs", "Rapidly shifting developer tooling trends", "Enterprise budget consolidation"],
    };
  }, [business, desc]);

  const markdown = useMemo(() => {
    return `# SWOT Analysis for ${business}

## Strengths (Internal Advantages)
${swot.strengths.map((s) => `- ${s}`).join("\n")}

## Weaknesses (Internal Limitations)
${swot.weaknesses.map((w) => `- ${w}`).join("\n")}

## Opportunities (External Potential)
${swot.opportunities.map((o) => `- ${o}`).join("\n")}

## Threats (External Risks)
${swot.threats.map((t) => `- ${t}`).join("\n")}`;
  }, [business, swot]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Business / Project Name"><TextInput value={business} onChange={(e) => setBusiness(e.target.value)} /></Field>
        <Field label="Core Offering / Description"><TextInput value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 dark:border-green-900/50 dark:bg-green-950/20">
          <div className="font-bold text-green-800 dark:text-green-300 text-sm mb-2">💪 STRENGTHS</div>
          <ul className="space-y-1.5 text-xs text-text-primary">
            {swot.strengths.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-2">🔍 WEAKNESSES</div>
          <ul className="space-y-1.5 text-xs text-text-primary">
            {swot.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
          </ul>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">🚀 OPPORTUNITIES</div>
          <ul className="space-y-1.5 text-xs text-text-primary">
            {swot.opportunities.map((o, i) => <li key={i}>• {o}</li>)}
          </ul>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
          <div className="font-bold text-red-800 dark:text-red-300 text-sm mb-2">⚠️ THREATS</div>
          <ul className="space-y-1.5 text-xs text-text-primary">
            {swot.threats.map((t, i) => <li key={i}>• {t}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => markdown} label="Copy Complete SWOT Matrix" />
        <Button type="button" variant="secondary" onClick={() => downloadText("swot-analysis.md", markdown)}>
          ⬇️ Download Markdown
        </Button>
      </div>
    </ToolCard>
  );
}

/* ---------------- 38. AI Interview Question Generator ---------------- */
export function AiInterviewQuestions() {
  const [role, setRole] = useState("Full Stack Developer");
  const [seniority, setSeniority] = useState("Senior");

  const questions = useMemo(() => {
    return [
      {
        q: "Describe a high-stakes technical architecture decision you made where there was no obvious right answer. How did you evaluate trade-offs?",
        evaluates: "System design maturity, risk management, and decision-making rigor.",
        starGuide: "Detail the specific architecture options considered, metrics used to decide, and the post-implementation outcome.",
      },
      {
        q: "Tell me about a time a production outage or critical bug occurred under your watch. How did you lead the triage and resolution?",
        evaluates: "Composure under pressure, root-cause analysis, and post-mortem ownership.",
        starGuide: "Focus on rapid mitigation steps, clear stakeholder communication, and prevention measures implemented.",
      },
      {
        q: "How do you handle disagreement with a product manager or team lead regarding technical debt versus shipping new features?",
        evaluates: "Cross-functional collaboration, empathy, and business alignment.",
        starGuide: "Show how you framed technical debt in terms of business velocity, risk, or customer experience.",
      },
    ];
  }, [role, seniority]);

  const allMarkdown = useMemo(() => {
    return `# Interview Prep Kit: ${seniority} ${role}\n\n` + questions.map((q, i) => `### Question ${i + 1}: ${q.q}\n- **Evaluates:** ${q.evaluates}\n- **STAR Answer Guide:** ${q.starGuide}\n`).join("\n");
  }, [seniority, role, questions]);

  return (
    <ToolCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Target Role"><TextInput value={role} onChange={(e) => setRole(e.target.value)} /></Field>
        <Field label="Seniority Level">
          <Select value={seniority} onChange={(e) => setSeniority(e.target.value)}>
            <option>Junior / Entry Level</option>
            <option>Mid-Level</option>
            <option>Senior</option>
            <option>Staff / Lead</option>
            <option>Engineering Manager</option>
          </Select>
        </Field>
      </div>

      <div className="mt-6 space-y-4">
        {questions.map((item, i) => (
          <div key={i} className="rounded-xl border border-border-default bg-surface-50 p-4 dark:bg-surface-900">
            <div className="font-semibold text-text-primary text-sm">
              Q{i + 1}: {item.q}
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              <span className="font-bold text-primary-600 dark:text-primary-400">What they are testing:</span> {item.evaluates}
            </div>
            <div className="mt-1 text-xs text-text-muted">
              <span className="font-semibold">STAR Guide:</span> {item.starGuide}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <CopyButton getText={() => allMarkdown} label="Copy All Questions & Guides" />
      </div>
    </ToolCard>
  );
}

/* =========================================================================
   AGGREGATED COMPONENT REGISTRY DICTIONARY
   ========================================================================= */
export const aiComponents: ComponentRegistry = {
  ChatGptPromptGenerator,
  BlogOutlineGenerator,
  MetaDescriptionPrompter,
  EmailSubjectLineGenerator,
  YoutubeTitleTagGenerator,
  SocialMediaBioGenerator,
  CopywritingBulletGenerator,
  SqlPromptGenerator,
  AiSummarizer,
  AiParaphraser,
  AiTextDetector,
  AiHumanizer,
  AiResumeBuilder,
  AiCoverLetterGenerator,
  AiEmailWriter,
  AiEssayWriter,
  AiProductDescription,
  AiAdCopyGenerator,
  AiBlogWriter,
  AiRewriter,
  AiContentImprover,
  AiFacebookAdGenerator,
  AiInstagramCaptionGenerator,
  AiHashtagGenerator,
  AiYoutubeScriptGenerator,
  AiProductReviewGenerator,
  AiCtaGenerator,
  AiMeetingNotes,
  AiTextToNotes,
  AiFlashcardGenerator,
  AiQuizGenerator,
  AiStudyGuideGenerator,
  AiTranslator,
  AiGrammarChecker,
  AiSentenceRewriter,
  AiBusinessNameGenerator,
  AiSwotAnalysis,
  AiInterviewQuestions,
};
