"use client";

import { useCallback, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import { trackEvent, trackToolUsed } from "@/lib/analytics";

export function ToolCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-default bg-surface-default p-4 shadow-sm sm:p-6">
      {children}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-text-secondary">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", onChange, ...rest } = props;
  return (
    <input
      {...rest}
      onChange={(e) => {
        trackToolUsed();
        onChange?.(e);
      }}
      className={`w-full rounded-lg border border-border-default bg-surface-default px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${className}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", onChange, ...rest } = props;
  return (
    <textarea
      {...rest}
      onChange={(e) => {
        trackToolUsed();
        onChange?.(e);
      }}
      className={`w-full rounded-lg border border-border-default bg-surface-default px-3 py-2 font-mono text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${className}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, onChange, ...rest } = props;
  return (
    <select
      {...rest}
      onChange={(e) => {
        trackToolUsed();
        onChange?.(e);
      }}
      className={`w-full rounded-lg border border-border-default bg-surface-default px-3 py-2 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 ${className}`}
    >
      {children}
    </select>
  );
}

export function Button({
  className = "",
  variant = "primary",
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const variants = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-300 dark:disabled:bg-primary-900",
    secondary:
      "bg-surface-100 text-text-primary hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700",
    ghost:
      "border border-border-default text-text-secondary hover:bg-surface-50 dark:hover:bg-surface-800",
  };
  return (
    <button
      {...rest}
      onClick={(e) => {
        if (variant === "primary") trackToolUsed();
        onClick?.(e);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  );
}

export function CopyButton({ getText, label = "Copy" }: { getText: () => string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = useCallback(async () => {
    const text = getText();
    if (!text) return;
    trackEvent("copy_result");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [getText]);
  return (
    <Button type="button" variant="secondary" onClick={onClick}>
      {copied ? "✅ Copied!" : `📋 ${label}`}
    </Button>
  );
}

export function ShareButton({ title }: { title: string }) {
  const onClick = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }, [title]);
  return (
    <Button type="button" variant="ghost" onClick={onClick}>
      🔗 Share
    </Button>
  );
}

export function downloadText(filename: string, content: string, mime = "text/plain") {
  trackEvent("download_file", { file_type: mime || filename.split(".").pop() || "txt" });
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  downloadBlob(filename, blob, true);
}

export function downloadBlob(filename: string, blob: Blob, skipTrack = false) {
  if (!skipTrack) {
    trackEvent("download_file", { file_type: filename.split(".").pop() || "unknown" });
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function DownloadButton({
  getBlob,
  filename,
  label = "Download",
}: {
  getBlob: () => { blob: Blob; filename?: string } | null;
  filename: string;
  label?: string;
}) {
  const onClick = useCallback(() => {
    const result = getBlob();
    if (!result) return;
    downloadBlob(result.filename || filename, result.blob);
  }, [getBlob, filename]);
  return (
    <Button type="button" onClick={onClick}>
      ⬇️ {label}
    </Button>
  );
}

export function Alert({ type = "error", children }: { type?: "error" | "success" | "info"; children: ReactNode }) {
  const styles = {
    error: "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
    success:
      "border-green-300 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
    info: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  };
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>;
}

export function Dropzone({
  onFiles,
  accept,
  multiple = false,
  label = "Drag & drop a file here, or click to browse",
}: {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}) {
  const [isOver, setIsOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      trackToolUsed();
      trackEvent("upload_file", { file_type: files[0].name.split(".").pop() || "unknown" });
      onFiles(multiple ? files : [files[0]]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      trackToolUsed();
      trackEvent("upload_file", { file_type: files[0].name.split(".").pop() || "unknown" });
      onFiles(multiple ? files : [files[0]]);
    }
    e.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
        isOver
          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
          : "border-border-default bg-bg-default hover:border-primary-400"
      }`}
    >
      <span className="mb-2 text-3xl">📁</span>
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange} />
    </div>
  );
}

export function OutputBox({ value, rows = 10 }: { value: string; rows?: number }) {
  return (
    <textarea
      readOnly
      value={value}
      rows={rows}
      className="w-full rounded-lg border border-border-default bg-bg-default px-3 py-2 font-mono text-sm text-text-primary outline-none"
    />
  );
}

export function ResultActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function StatBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-default px-3 py-2 text-center">
      <div className="text-lg font-bold text-primary-500 dark:text-primary-400">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}
