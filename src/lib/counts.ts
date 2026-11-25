import { ALL_TOOLS } from "./tools-data";

/** Exact number of tool pages (includes unit and currency converter pages). */
export const TOOL_COUNT = ALL_TOOLS.length;
/** Rounded down to the nearest 50 so it is always true ("700+" when we have 741). Computed at build time. */
export const TOOL_COUNT_LABEL = `${Math.floor(TOOL_COUNT / 50) * 50}+`;
