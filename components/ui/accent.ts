import type { CSSProperties } from "react";
import type { Accent } from "@/content/site";

/** Exposes an accent colour token to CSS as --accent. */
export const accentStyle = (accent: Accent) =>
  ({ "--accent": `var(--c-${accent})` }) as CSSProperties;
