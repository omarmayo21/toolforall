"use client";

import { useEffect } from "react";

export default function ClarityAnalytics() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) return;

    void import("@microsoft/clarity").then(({ default: Clarity }) => {
      Clarity.init(projectId);
    });
  }, []);

  return null;
}
