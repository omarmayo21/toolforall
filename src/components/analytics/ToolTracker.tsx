"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ToolTracker({ toolName, category }: { toolName: string; category: string }) {
  useEffect(() => {
    trackEvent("tool_open", { tool_name: toolName, category });
  }, [toolName, category]);
  return null;
}
