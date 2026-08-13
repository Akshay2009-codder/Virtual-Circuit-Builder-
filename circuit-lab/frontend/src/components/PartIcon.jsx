import { CATEGORY_COLOR } from "../constants/categoryColors";

const BOARD_GLYPHS = {
  arduino_uno: (c) => (
    <g stroke={c || "#00878f"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2" fill="color-mix(in srgb, #00878f 30%, transparent)" />
      <rect x="6" y="7" width="4" height="3" fill="#c9d1d9" stroke="#ffffff" />
      <rect x="6" y="14" width="4" height="3" fill="#15181c" />
      <rect x="12" y="10" width="6" height="4" rx="0.5" fill="#161b22" />
      <circle cx="16" cy="6.5" r="0.8" fill="#ff3838" />
    </g>
  ),
  uno: (c) => (
    <g stroke={c || "#00878f"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="2" fill="color-mix(in srgb, #00878f 30%, transparent)" />
      <rect x="6" y="7" width="4" height="3" fill="#c9d1d9" stroke="#ffffff" />
      <rect x="6" y="14" width="4" height="3" fill="#15181c" />
      <rect x="12" y="10" width="6" height="4" rx="0.5" fill="#161b22" />
      <circle cx="16" cy="6.5" r="0.8" fill="#ff3838" />
    </g>
  ),
  raspberry_pi_pico: (c) => (
    <g stroke={c || "#008040"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="2" fill="color-mix(in srgb, #008040 30%, transparent)" />
      <rect x="9.5" y="4" width="5" height="2" fill="#c9d1d9" />
      <rect x="9" y="11" width="6" height="6" rx="1" fill="#161b22" />
      <circle cx="12" cy="8" r="1" fill="#ffffff" />
    </g>
  ),
  pico: (c) => (
    <g stroke={c || "#008040"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="2" fill="color-mix(in srgb, #008040 30%, transparent)" />
      <rect x="9.5" y="4" width="5" height="2" fill="#c9d1d9" />
      <rect x="9" y="11" width="6" height="6" rx="1" fill="#161b22" />
      <circle cx="12" cy="8" r="1" fill="#ffffff" />
    </g>
  ),
  arduino_nano: (c) => (
    <g stroke={c || "#0077b6"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="4" width="10" height="16" rx="1.5" fill="color-mix(in srgb, #0077b6 30%, transparent)" />
      <rect x="9.5" y="4" width="5" height="2" fill="#c9d1d9" />
      <rect x="9" y="10" width="6" height="6" rx="1" transform="rotate(45 12 13)" fill="#161b22" />
    </g>
  ),
  nano: (c) => (
    <g stroke={c || "#0077b6"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="4" width="10" height="16" rx="1.5" fill="color-mix(in srgb, #0077b6 30%, transparent)" />
      <rect x="9.5" y="4" width="5" height="2" fill="#c9d1d9" />
      <rect x="9" y="10" width="6" height="6" rx="1" transform="rotate(45 12 13)" fill="#161b22" />
    </g>
  ),
  stm32: (c) => (
    <g stroke={c || "#1f5690"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="1.5" fill="color-mix(in srgb, #1f5690 30%, transparent)" />
      <rect x="9.5" y="4" width="5" height="2" fill="#c9d1d9" />
      <rect x="9" y="10" width="6" height="6" rx="1" fill="#161b22" />
      <rect x="7.5" y="7" width="2" height="2" fill="#ffd32a" stroke="none" />
      <rect x="7.5" y="9.5" width="2" height="2" fill="#ffd32a" stroke="none" />
    </g>
  ),
  nodemcu: (c) => (
    <g stroke={c || "#181c24"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="1.5" fill="color-mix(in srgb, #181c24 40%, transparent)" />
      <rect x="8" y="7" width="8" height="7" rx="1" fill="#a0a7b0" />
      <rect x="9.5" y="18" width="5" height="2" fill="#c9d1d9" />
    </g>
  ),
  esp32: (c) => (
    <g stroke={c || "#121820"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="1.5" fill="color-mix(in srgb, #121820 50%, transparent)" />
      <rect x="7.5" y="7" width="9" height="8" rx="1" fill="#a0a7b0" />
      <path d="M8 5.5h8" stroke="#d4af37" strokeWidth="1.5" />
    </g>
  ),
  microbit: (c) => (
    <g stroke={c || "#1e272e"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="14" rx="3" fill="color-mix(in srgb, #1e272e 40%, transparent)" />
      <circle cx="7" cy="12" r="1.5" fill="#f5f6fa" />
      <circle cx="17" cy="12" r="1.5" fill="#f5f6fa" />
      <rect x="10" y="9" width="4" height="6" fill="#ff3838" stroke="none" />
    </g>
  ),
  arduino_mega: (c) => (
    <g stroke={c || "#007d85"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="color-mix(in srgb, #007d85 30%, transparent)" />
      <rect x="4" y="7" width="4" height="3" fill="#c9d1d9" stroke="#ffffff" />
      <rect x="4" y="14" width="4" height="3" fill="#15181c" />
      <rect x="11" y="9.5" width="5" height="5" rx="0.5" transform="rotate(45 13.5 12)" fill="#161b22" />
      <rect x="18" y="7" width="2" height="10" fill="#0d1117" stroke="none" />
    </g>
  ),
  mega: (c) => (
    <g stroke={c || "#007d85"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="color-mix(in srgb, #007d85 30%, transparent)" />
      <rect x="4" y="7" width="4" height="3" fill="#c9d1d9" stroke="#ffffff" />
      <rect x="4" y="14" width="4" height="3" fill="#15181c" />
      <rect x="11" y="9.5" width="5" height="5" rx="0.5" transform="rotate(45 13.5 12)" fill="#161b22" />
      <rect x="18" y="7" width="2" height="10" fill="#0d1117" stroke="none" />
    </g>
  ),
  teensy: (c) => (
    <g stroke={c || "#4c1d95"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="4" width="10" height="16" rx="1.5" fill="color-mix(in srgb, #4c1d95 40%, transparent)" />
      <rect x="9.5" y="4" width="5" height="2" fill="#c9d1d9" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#161b22" />
      <circle cx="12" cy="16.5" r="1" fill="#f5f6fa" />
    </g>
  ),
  raspberry_pi_4: (c) => (
    <g stroke={c || "#008040"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="color-mix(in srgb, #008040 35%, transparent)" />
      <rect x="17" y="7" width="3" height="4" fill="#0077b6" stroke="none" />
      <rect x="17" y="13" width="3" height="4" fill="#111111" stroke="none" />
      <rect x="8" y="9" width="5" height="5" rx="1" fill="#a0a7b0" />
      <line x1="4" y1="7" x2="15" y2="7" stroke="#0d1117" strokeWidth="1.5" />
    </g>
  ),
  rpi4: (c) => (
    <g stroke={c || "#008040"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="color-mix(in srgb, #008040 35%, transparent)" />
      <rect x="17" y="7" width="3" height="4" fill="#0077b6" stroke="none" />
      <rect x="17" y="13" width="3" height="4" fill="#111111" stroke="none" />
      <rect x="8" y="9" width="5" height="5" rx="1" fill="#a0a7b0" />
      <line x1="4" y1="7" x2="15" y2="7" stroke="#0d1117" strokeWidth="1.5" />
    </g>
  ),
  esp32_cam: (c) => (
    <g stroke={c || "#181c24"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="12" height="16" rx="1.5" fill="color-mix(in srgb, #181c24 50%, transparent)" />
      <rect x="7.5" y="6" width="9" height="7" rx="1" fill="#a0a7b0" />
      <circle cx="12" cy="15.5" r="2.2" fill="#111111" stroke="#45d8c4" strokeWidth="1" />
      <rect x="7" y="14" width="1.5" height="1.5" fill="#ffffff" stroke="none" />
    </g>
  ),
  neopixel_ring: (c) => (
    <g stroke={c || "#d4af37"} strokeWidth="1.5" fill="none">
      <circle cx="12" cy="12" r="7" stroke="#d4af37" strokeWidth="1.5" fill="color-mix(in srgb, #1e272e 40%, transparent)" />
      <circle cx="12" cy="12" r="3.5" stroke="#d4af37" strokeWidth="1" />
      <circle cx="12" cy="5" r="1" fill="#32ff7e" />
      <circle cx="17" cy="10" r="1" fill="#ff3838" />
      <circle cx="14" cy="17" r="1" fill="#18dcff" />
      <circle cx="7" cy="14" r="1" fill="#ffd32a" />
    </g>
  ),
};

const GLYPHS = {
  passive: (c) => (
    <path d="M4 12h3l1.5-5 3 10 3-10 1.5 5H20" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  active: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h5l6-4v8l-6-4" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <line x1="19" y1="12" x2="19" y2="12" />
    </g>
  ),
  ic: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="7" width="12" height="10" rx="1.5" />
      <line x1="8" y1="7" x2="8" y2="4.5" />
      <line x1="12" y1="7" x2="12" y2="4.5" />
      <line x1="16" y1="7" x2="16" y2="4.5" />
      <line x1="8" y1="17" x2="8" y2="19.5" />
      <line x1="12" y1="17" x2="12" y2="19.5" />
      <line x1="16" y1="17" x2="16" y2="19.5" />
    </g>
  ),
  source: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="6" width="8" height="13" rx="1.5" />
      <line x1="11" y1="4" x2="11" y2="6" />
      <line x1="9.5" y1="10.5" x2="12.5" y2="10.5" />
      <line x1="11" y1="9" x2="11" y2="12" />
    </g>
  ),
  control: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="6" cy="15" r="1.4" fill={c} stroke="none" />
      <circle cx="18" cy="15" r="1.4" fill={c} stroke="none" />
      <line x1="6" y1="15" x2="14" y2="8" />
      <line x1="18" y1="15" x2="14.5" y2="15" />
    </g>
  ),
  output: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10v4h3l4 3V7l-4 3H6z" />
      <path d="M16 9.5c1 .8 1 4.2 0 5" />
      <path d="M18.3 8c1.6 1.4 1.6 6.6 0 8" />
    </g>
  ),
  sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c2.5-3.5 5.5-5 9-5s6.5 1.5 9 5c-2.5 3.5-5.5 5-9 5s-6.5-1.5-9-5z" />
      <circle cx="12" cy="12" r="2.2" fill={c} stroke="none" />
    </g>
  ),
  board: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="10" height="8" rx="1" />
      <circle cx="10" cy="13" r="1.5" fill={c} stroke="none" />
      <line x1="7" y1="9" x2="7" y2="6.5" />
      <line x1="10" y1="9" x2="10" y2="6.5" />
      <line x1="13" y1="9" x2="13" y2="6.5" />
      <line x1="5" y1="12" x2="2.5" y2="12" />
      <line x1="5" y1="15" x2="2.5" y2="15" />
      <path d="M16.5 8.5c1.6-1.6 4-1.6 5.5 0" strokeWidth="1.4" />
      <path d="M17.8 10c.9-.9 2.2-.9 3 0" strokeWidth="1.4" />
    </g>
  ),
};

export default function PartIcon({ category, partKey, size = 40 }) {
  const color = CATEGORY_COLOR[category] || "var(--primary)";
  const boardGlyph = partKey ? BOARD_GLYPHS[partKey] : null;
  const glyph = boardGlyph || GLYPHS[category] || GLYPHS.passive;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        background: `color-mix(in srgb, ${color} 16%, var(--surface-2))`,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        {glyph(color)}
      </svg>
    </div>
  );
}