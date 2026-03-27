/**
 * Curated palette of vibrant, visually distinct colors — all readable with white text.
 * Colors are spread across the hue wheel and hand-picked to avoid muddy/clashing combos.
 */
const SKILL_PALETTE = [
  "#c1121f", // vivid red
  "#e76f51", // warm coral
  "#ca6702", // amber
  "#606c38", // olive green
  "#386641", // forest green
  "#2a9d8f", // teal
  "#0077b6", // ocean blue
  "#023e8a", // deep navy
  "#4361ee", // bright indigo
  "#7209b7", // violet
  "#b5179e", // fuchsia
  "#9b2226", // dark crimson
  "#005f73", // dark cyan
  "#457b9d", // steel blue
  "#6a4c93", // medium purple
  "#d62598", // hot pink
];

/**
 * Deterministically maps a skill/domain/tag name to a color from the curated palette.
 * Same name → same color, always. Discrete palette ensures no two colors look similar.
 */
export function skillColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SKILL_PALETTE[Math.abs(hash) % SKILL_PALETTE.length];
}
