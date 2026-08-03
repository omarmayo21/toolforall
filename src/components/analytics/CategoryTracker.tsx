"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function CategoryTracker({ category }: { category: string }) {
  useEffect(() => {
    trackEvent("category_open", { category });
  }, [category]);
  return null;
}
