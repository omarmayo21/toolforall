export const SITE_NAME = "ToolForAll";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.toolsforall.cloud";
export const SITE_DESCRIPTION =
  "Free online tools for developers, designers, marketers and students: PDF, image, text, SEO, finance and more. No sign-up needed, and most tools run in your browser.";
/** Tools that call our server or a third party for part of their work, so they cannot claim to run fully in the browser. */
export const NETWORK_TOOLS = new Set(["redirect-checker", "http-status-code-checker", "currency-converter", "image-to-text-ocr"]);
