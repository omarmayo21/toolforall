"use client";

import { useMemo, useState } from "react";
import { Button, CopyButton, Field, OutputBox, Select, TextArea, TextInput, ToolCard } from "./ui";
import type { ComponentRegistry } from "@/lib/types";

/* ---------------- ChatGPT Prompt Generator ---------------- */
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

/* ---------------- Blog Outline Generator ---------------- */
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

/* ---------------- Meta Description Prompter ---------------- */
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

/* ---------------- Email Subject Line Generator ---------------- */
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
          <div key={i} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
            <span>{l}</span>
            <CopyButton getText={() => l} label="" />
          </div>
        ))}
      </div>
    </ToolCard>
  );
}

/* ---------------- YouTube Title & Tag Generator ---------------- */
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
          <div key={i} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
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

/* ---------------- Social Media Bio Generator ---------------- */
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

/* ---------------- Copywriting Bullet Generator ---------------- */
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
          <div key={i} className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">• {b}</div>
        ))}
      </div>
      <div className="mt-2 flex gap-2"><CopyButton getText={() => bullets.map((b) => `• ${b}`).join("\n")} /></div>
    </ToolCard>
  );
}

/* ---------------- SQL Prompt Generator ---------------- */
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

export const aiComponents: ComponentRegistry = {
  ChatGptPromptGenerator,
  BlogOutlineGenerator,
  MetaDescriptionPrompter,
  EmailSubjectLineGenerator,
  YoutubeTitleTagGenerator,
  SocialMediaBioGenerator,
  CopywritingBulletGenerator,
  SqlPromptGenerator,
};
