import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";
import { TOOL_COUNT_LABEL } from "@/lib/counts";

export const alt = `${SITE_NAME}: ${TOOL_COUNT_LABEL} free online tools`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg,#0f172a,#1e1b4b)", color: "white" }}>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800 }}>{SITE_NAME}</div>
        <div style={{ display: "flex", fontSize: 50, marginTop: 20, color: "#c7d2fe" }}>{TOOL_COUNT_LABEL} free online tools</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 36, color: "#94a3b8" }}>PDF · Image · Developer · SEO · Text · Finance · Health</div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 14, color: "#94a3b8" }}>No sign-up needed</div>
      </div>
    ),
    size,
  );
}
