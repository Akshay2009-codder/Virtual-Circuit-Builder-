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

const PART_GLYPHS = {
  // --- Passives ---
  resistor: (c) => (
    <path d="M3 12h3l1.5-5 3 10 3-10 1.5 5H21" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  ),
  resistor_variable: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h3l1.5-5 3 10 3-10 1.5 5H21" />
      <path d="M6 18l12-12" />
      <path d="M14 6h4v4" />
    </g>
  ),
  potentiometer: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14h3l1.5-5 3 10 3-10 1.5 5H21" />
      <path d="M12 5v4" />
      <path d="M10 7.5l2 2 2-2" fill={c} />
    </g>
  ),
  capacitor_electrolytic: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
      <line x1="9" y1="6" x2="9" y2="18" strokeWidth="2" />
      <path d="M15 6c-2 3-2 9 0 12" strokeWidth="2" fill="none" />
      <path d="M5 8h3M6.5 6.5v3" stroke={c} strokeWidth="1.2" />
    </g>
  ),
  capacitor_ceramic: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <line x1="3" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="21" y2="12" />
      <line x1="10" y1="6" x2="10" y2="18" strokeWidth="2" />
      <line x1="14" y1="6" x2="14" y2="18" strokeWidth="2" />
    </g>
  ),
  polyester_capacitor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="7" y="6" width="10" height="12" rx="1" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
      <line x1="10" y1="9" x2="10" y2="15" />
      <line x1="14" y1="9" x2="14" y2="15" />
    </g>
  ),
  varistor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="7" y="8" width="10" height="8" rx="1" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
      <line x1="6" y1="18" x2="18" y2="6" strokeWidth="1.8" />
      <line x1="6" y1="18" x2="6" y2="15" strokeWidth="1.8" />
    </g>
  ),
  inductor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M3 12h2c1-3 3-3 4 0s3 3 4 0 3-3 4 0 3 3 4 0h2" />
    </g>
  ),
  ferrite_bead: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
      <rect x="8" y="7" width="8" height="10" rx="3" fill={c} opacity="0.8" />
    </g>
  ),
  fuse: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="8" width="12" height="8" rx="1" strokeWidth="1.5" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21" y2="12" />
      <path d="M6 12c3-2 3 2 6 0s3 2 6 0" strokeDasharray="1 1" />
      <rect x="6" y="8" width="3" height="8" fill={c} />
      <rect x="15" y="8" width="3" height="8" fill={c} />
    </g>
  ),
  crystal_oscillator: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <line x1="9" y1="8" x2="9" y2="16" strokeWidth="2" />
      <line x1="15" y1="8" x2="15" y2="16" strokeWidth="2" />
      <rect x="11" y="9" width="2" height="6" fill={c} stroke="none" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21" y2="12" />
    </g>
  ),
  breadboard: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <line x1="3" y1="8" x2="21" y2="8" stroke="#ff3838" strokeWidth="1" />
      <line x1="3" y1="16" x2="21" y2="16" stroke="#0077b6" strokeWidth="1" />
      <circle cx="7" cy="11" r="0.8" fill={c} />
      <circle cx="10" cy="11" r="0.8" fill={c} />
      <circle cx="13" cy="11" r="0.8" fill={c} />
      <circle cx="16" cy="11" r="0.8" fill={c} />
      <circle cx="7" cy="13" r="0.8" fill={c} />
      <circle cx="10" cy="13" r="0.8" fill={c} />
      <circle cx="13" cy="13" r="0.8" fill={c} />
      <circle cx="16" cy="13" r="0.8" fill={c} />
    </g>
  ),
  terminal_block: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="4" y="6" width="16" height="12" rx="1.5" fill="#1a8a4a" opacity="0.4" />
      <circle cx="8" cy="12" r="2.2" stroke={c} />
      <circle cx="16" cy="12" r="2.2" stroke={c} />
      <line x1="7" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="17" y2="12" />
    </g>
  ),
  heat_sink: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 18V7h3v8h3V7h3v8h3V7h3v11H4z" fill="color-mix(in srgb, currentColor 25%, transparent)" />
    </g>
  ),
  wire: (c) => (
    <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M4 16c4-8 12 8 16-8" />
      <circle cx="4" cy="16" r="1.5" fill={c} />
      <circle cx="20" cy="8" r="1.5" fill={c} />
    </g>
  ),
  jumper_wire: (c) => (
    <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round">
      <path d="M4 15C8 5 16 5 20 15" />
      <rect x="2.5" y="15" width="3" height="4" fill={c} stroke="none" />
      <rect x="18.5" y="15" width="3" height="4" fill={c} stroke="none" />
    </g>
  ),

  // --- Active / Semiconductors ---
  led: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h6l6-4v8l-6-4" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <line x1="19" y1="12" x2="21" y2="12" />
      <path d="M14 6l3-3M17 6h-3v3" strokeWidth="1.2" />
      <path d="M10 5l3-3M13 5h-3v3" strokeWidth="1.2" />
    </g>
  ),
  rgb_led: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="7" stroke={c} fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <circle cx="9" cy="11" r="1.8" fill="#ff3838" stroke="none" />
      <circle cx="15" cy="11" r="1.8" fill="#2ed573" stroke="none" />
      <circle cx="12" cy="15" r="1.8" fill="#1e90ff" stroke="none" />
    </g>
  ),
  ir_led: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 12h6l6-4v8l-6-4" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <path d="M13 5c2-1 4-1 6 0M14 3c3-1 5-1 7 0" strokeDasharray="1.5 1.5" />
    </g>
  ),
  laser_diode: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="8" cy="12" r="5" stroke={c} />
      <line x1="13" y1="12" x2="22" y2="12" stroke="#ff3838" strokeWidth="2" />
      <polygon points="20,10 23,12 20,14" fill="#ff3838" stroke="none" />
    </g>
  ),
  diode: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h6l6-4v8l-6-4" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <line x1="16" y1="12" x2="20" y2="12" />
    </g>
  ),
  zener_diode: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h6l6-4v8l-6-4" />
      <path d="M14 8h2v8h2" />
      <line x1="16" y1="12" x2="20" y2="12" />
    </g>
  ),
  schottky_diode: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h6l6-4v8l-6-4" />
      <path d="M14 6v2h2v8h-2v2" />
      <line x1="16" y1="12" x2="20" y2="12" />
    </g>
  ),
  transistor_npn: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <line x1="4" y1="12" x2="10" y2="12" />
      <line x1="10" y1="7" x2="10" y2="17" strokeWidth="2.2" />
      <line x1="10" y1="9" x2="18" y2="5" />
      <line x1="10" y1="15" x2="18" y2="19" />
      <polygon points="15,16 18,19 14,19" fill={c} stroke="none" />
    </g>
  ),
  transistor_pnp: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <line x1="4" y1="12" x2="10" y2="12" />
      <line x1="10" y1="7" x2="10" y2="17" strokeWidth="2.2" />
      <line x1="10" y1="9" x2="18" y2="5" />
      <line x1="10" y1="15" x2="18" y2="19" />
      <polygon points="12,12 10,15 13,15" fill={c} stroke="none" />
    </g>
  ),
  mosfet: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="5" width="12" height="14" rx="1.5" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <rect x="9" y="3" width="6" height="2" fill={c} stroke="none" />
      <line x1="9" y1="19" x2="9" y2="21" />
      <line x1="12" y1="19" x2="12" y2="21" />
      <line x1="15" y1="19" x2="15" y2="21" />
    </g>
  ),
  bridge_rectifier: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <polygon points="12,4 20,12 12,20 4,12" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <text x="12" y="15" fontSize="8" textAnchor="middle" fill={c} fontWeight="bold">AC</text>
    </g>
  ),

  // --- ICs & Logic ---
  ic_555: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="5" width="12" height="14" rx="1.5" fill="#161b22" />
      <circle cx="12" cy="7" r="1" fill="#45d8c4" stroke="none" />
      <line x1="3" y1="8" x2="6" y2="8" />
      <line x1="3" y1="12" x2="6" y2="12" />
      <line x1="3" y1="16" x2="6" y2="16" />
      <line x1="18" y1="8" x2="21" y2="8" />
      <line x1="18" y1="12" x2="21" y2="12" />
      <line x1="18" y1="16" x2="21" y2="16" />
    </g>
  ),
  ic_opamp: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <polygon points="6,4 18,12 6,20" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <text x="9" y="9" fontSize="7" fill={c}>-</text>
      <text x="9" y="17" fontSize="7" fill={c}>+</text>
    </g>
  ),
  voltage_regulator: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="10" rx="1" fill="#161b22" />
      <rect x="8" y="4" width="8" height="2" fill="#c9d1d9" stroke="none" />
      <line x1="8" y1="16" x2="8" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
      <line x1="16" y1="16" x2="16" y2="20" />
    </g>
  ),
  microcontroller_atmega328: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="7" y="3" width="10" height="18" rx="1" fill="#161b22" />
      <path d="M10 3a2 2 0 0 1 4 0" stroke={c} fill="none" />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <line x1="4" y1={5 + i * 2.2} x2="7" y2={5 + i * 2.2} stroke="#d4af37" />
          <line x1="17" y1={5 + i * 2.2} x2="20" y2={5 + i * 2.2} stroke="#d4af37" />
        </g>
      ))}
    </g>
  ),
  eeprom_ic: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="12" rx="1.5" fill="#161b22" />
      <text x="12" y="14" fontSize="6" textAnchor="middle" fill="#3ddc84" fontWeight="bold">ROM</text>
    </g>
  ),
  adc_ic: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="12" rx="1.5" fill="#161b22" />
      <text x="12" y="14" fontSize="6" textAnchor="middle" fill="#45d8c4" fontWeight="bold">ADC</text>
    </g>
  ),
  ic_socket: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="5" width="12" height="14" rx="1" fill="none" strokeDasharray="2 1" />
      <circle cx="8" cy="8" r="1" fill={c} />
      <circle cx="8" cy="12" r="1" fill={c} />
      <circle cx="8" cy="16" r="1" fill={c} />
      <circle cx="16" cy="8" r="1" fill={c} />
      <circle cx="16" cy="12" r="1" fill={c} />
      <circle cx="16" cy="16" r="1" fill={c} />
    </g>
  ),
  logic_and: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M5 6h6a6 6 0 0 1 0 12H5V6z" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <line x1="2" y1="9" x2="5" y2="9" />
      <line x1="2" y1="15" x2="5" y2="15" />
      <line x1="17" y1="12" x2="21" y2="12" />
    </g>
  ),
  logic_or: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 6c3 0 7 1 12 6c-5 5-9 6-12 6c3-4 3-8 0-12z" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <line x1="2" y1="8" x2="6" y2="8" />
      <line x1="2" y1="16" x2="6" y2="16" />
      <line x1="16" y1="12" x2="21" y2="12" />
    </g>
  ),
  logic_xor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M6 6c3 0 7 1 12 6c-5 5-9 6-12 6c3-4 3-8 0-12z" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <path d="M3 6c3 4 3 8 0 12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </g>
  ),
  logic_nand: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 6h6a6 6 0 0 1 0 12H4V6z" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <circle cx="17" cy="12" r="1.5" stroke={c} />
      <line x1="18.5" y1="12" x2="21" y2="12" />
    </g>
  ),
  logic_nor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 6c3 0 6 1 11 6c-5 5-8 6-11 6c3-4 3-8 0-12z" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <circle cx="16.5" cy="12" r="1.5" stroke={c} />
      <line x1="18" y1="12" x2="21" y2="12" />
    </g>
  ),
  logic_not: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <polygon points="5,5 15,12 5,19" fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <circle cx="17" cy="12" r="1.5" stroke={c} />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="18.5" y1="12" x2="22" y2="12" />
    </g>
  ),
  flip_flop: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="5" width="12" height="14" rx="1" fill="#161b22" />
      <text x="8" y="10" fontSize="6" fill={c}>D</text>
      <text x="14" y="10" fontSize="6" fill={c}>Q</text>
      <text x="14" y="16" fontSize="6" fill={c}>Q'</text>
    </g>
  ),

  // --- Power Sources ---
  battery_9v: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="7" y="6" width="10" height="14" rx="1.5" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <rect x="9" y="3" width="2.5" height="3" fill="#c9d1d9" stroke="none" />
      <circle cx="14" cy="4.5" r="1.2" fill="#c9d1d9" stroke="none" />
      <text x="12" y="15" fontSize="7" textAnchor="middle" fill={c} fontWeight="bold">9V</text>
    </g>
  ),
  battery_aa: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="7" y="6" width="10" height="14" rx="2" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <rect x="10.5" y="3.5" width="3" height="2.5" fill="#d4af37" stroke="none" />
      <text x="12" y="15" fontSize="6" textAnchor="middle" fill={c} fontWeight="bold">1.5V</text>
    </g>
  ),
  lithium_battery: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="5" width="12" height="15" rx="3" fill="#1e90ff" opacity="0.4" />
      <rect x="10" y="3" width="4" height="2" fill="#c9d1d9" stroke="none" />
      <text x="12" y="14" fontSize="5" textAnchor="middle" fill="#ffffff" fontWeight="bold">18650</text>
    </g>
  ),
  coin_cell: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="8" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 1" />
      <text x="12" y="14" fontSize="6" textAnchor="middle" fill={c} fontWeight="bold">3V</text>
    </g>
  ),
  solar_panel: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="4" y="5" width="16" height="14" rx="1.5" fill="#1e272e" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="#45d8c4" />
      <line x1="12" y1="5" x2="12" y2="19" stroke="#45d8c4" />
      <line x1="8" y1="5" x2="8" y2="19" stroke="#45d8c4" strokeDasharray="1 1" />
      <line x1="16" y1="5" x2="16" y2="19" stroke="#45d8c4" strokeDasharray="1 1" />
    </g>
  ),
  power_bank: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="4" width="14" height="16" rx="2" fill="#181c24" />
      <rect x="8" y="6" width="8" height="2" fill="#3ddc84" stroke="none" />
      <circle cx="8" cy="17" r="0.8" fill="#3ddc84" />
      <circle cx="11" cy="17" r="0.8" fill="#3ddc84" />
      <circle cx="14" cy="17" r="0.8" fill="#3ddc84" />
      <circle cx="17" cy="17" r="0.8" fill="#3ddc84" />
    </g>
  ),
  bench_power_supply: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="4" y="4" width="16" height="16" rx="2" fill="#2d3436" />
      <rect x="6" y="6" width="12" height="5" fill="#000000" stroke="#3ddc84" />
      <circle cx="8" cy="15" r="1.5" fill="#ff3838" stroke="none" />
      <circle cx="16" cy="15" r="1.5" fill="#111111" stroke="none" />
    </g>
  ),
  usb_power: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="7" y="8" width="10" height="11" rx="1.5" fill="#c9d1d9" />
      <rect x="9" y="4" width="6" height="4" fill="#111111" stroke="none" />
      <line x1="10" y1="12" x2="10" y2="15" stroke="#111111" strokeWidth="2" />
      <line x1="14" y1="12" x2="14" y2="15" stroke="#111111" strokeWidth="2" />
    </g>
  ),

  // --- Control / Switches ---
  switch: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="6" cy="15" r="1.4" fill={c} stroke="none" />
      <circle cx="18" cy="15" r="1.4" fill={c} stroke="none" />
      <line x1="6" y1="15" x2="14" y2="8" />
      <line x1="18" y1="15" x2="14.5" y2="15" />
    </g>
  ),
  push_button: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="8" width="12" height="10" rx="2" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <circle cx="12" cy="13" r="3" fill="#ff3838" stroke="none" />
      <line x1="3" y1="10" x2="6" y2="10" />
      <line x1="3" y1="16" x2="6" y2="16" />
      <line x1="18" y1="10" x2="21" y2="10" />
      <line x1="18" y1="16" x2="21" y2="16" />
    </g>
  ),
  rocker_switch: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="5" width="12" height="14" rx="2" fill="#181c24" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="#45d8c4" />
      <text x="12" y="10" fontSize="5" textAnchor="middle" fill="#ffffff">I</text>
      <text x="12" y="17" fontSize="5" textAnchor="middle" fill="#ffffff">O</text>
    </g>
  ),
  slide_switch: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="8" width="14" height="8" rx="1.5" fill="#c9d1d9" />
      <rect x="6" y="7" width="4" height="10" fill={c} stroke="none" />
    </g>
  ),
  dip_switch: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="4" y="6" width="16" height="12" rx="1" fill="#ff3838" opacity="0.6" />
      <rect x="6" y="8" width="2.5" height="4" fill="#ffffff" stroke="none" />
      <rect x="10" y="12" width="2.5" height="4" fill="#ffffff" stroke="none" />
      <rect x="14" y="8" width="2.5" height="4" fill="#ffffff" stroke="none" />
    </g>
  ),
  limit_switch: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="10" width="12" height="8" rx="1" fill="#161b22" />
      <line x1="5" y1="10" x2="16" y2="4" strokeWidth="2" />
      <circle cx="16" cy="4" r="1.5" fill="#ffd32a" stroke="none" />
    </g>
  ),
  reed_switch: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <ellipse cx="12" cy="12" rx="7" ry="3.5" stroke="#45d8c4" fill="color-mix(in srgb, #45d8c4 20%, transparent)" />
      <line x1="3" y1="12" x2="11" y2="12" />
      <line x1="13" y1="12" x2="21" y2="12" />
    </g>
  ),
  relay: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="5" width="14" height="14" rx="2" fill="#1e90ff" opacity="0.3" />
      <path d="M8 8v8M8 12h4" />
      <circle cx="16" cy="9" r="1" fill={c} />
      <circle cx="16" cy="15" r="1" fill={c} />
      <line x1="12" y1="12" x2="16" y2="9" />
    </g>
  ),

  // --- Output / Actuators ---
  buzzer: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="7" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <circle cx="12" cy="12" r="3" fill="#111111" stroke="none" />
      <path d="M17 7c2 2 2 8 0 10" strokeWidth="1.4" />
    </g>
  ),
  dc_motor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="7" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <text x="12" y="15" fontSize="9" textAnchor="middle" fill={c} fontWeight="bold">M</text>
    </g>
  ),
  servo_motor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="7" width="14" height="10" rx="1.5" fill="#1e90ff" opacity="0.4" />
      <circle cx="9" cy="12" r="3" fill="#ffffff" stroke="none" />
      <line x1="9" y1="12" x2="16" y2="12" strokeWidth="2.5" stroke="#ffffff" />
    </g>
  ),
  stepper_motor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="5" width="14" height="14" rx="2" fill="#a0a7b0" opacity="0.3" />
      <circle cx="12" cy="12" r="4" fill="#111111" stroke={c} />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="none" />
    </g>
  ),
  speaker: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10v4h3l4 3V7l-4 3H6z" />
      <path d="M16 9.5c1 .8 1 4.2 0 5" />
      <path d="M18.3 8c1.6 1.4 1.6 6.6 0 8" />
    </g>
  ),
  fan: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke={c} />
      <circle cx="12" cy="12" r="2.5" fill={c} />
      <path d="M12 9.5c-2-3 2-4 2-1s-2 3-2 1z" fill={c} />
      <path d="M12 14.5c2 3-2 4-2 1s2-3 2-1z" fill={c} />
      <path d="M9.5 12c-3 2-4-2-1-2s3 2 1 2z" fill={c} />
      <path d="M14.5 12c3-2 4 2 1 2s-3-2-1-2z" fill={c} />
    </g>
  ),
  solenoid: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="4" y="7" width="10" height="10" rx="1" fill="#1e272e" />
      <rect x="14" y="10" width="7" height="4" fill="#c9d1d9" stroke="none" />
      <line x1="7" y1="7" x2="7" y2="17" stroke="#d4af37" />
      <line x1="11" y1="7" x2="11" y2="17" stroke="#d4af37" />
    </g>
  ),
  vibration_motor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="11" cy="12" r="6" fill="#c9d1d9" />
      <path d="M11 6a6 6 0 0 1 6 6h-6z" fill="#ff3838" stroke="none" />
      <path d="M19 9c2 2 2 4 0 6" strokeWidth="1.5" />
    </g>
  ),
  led_strip: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="3" y="9" width="18" height="6" rx="1" fill="#1e272e" />
      <circle cx="6" cy="12" r="1.5" fill="#ff3838" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="#32ff7e" stroke="none" />
      <circle cx="18" cy="12" r="1.5" fill="#18dcff" stroke="none" />
    </g>
  ),

  // --- Sensors ---
  ldr: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <circle cx="12" cy="12" r="7" stroke={c} fill="color-mix(in srgb, currentColor 15%, transparent)" />
      <path d="M7 10c2 3 3-3 5 0s3-3 5 0" strokeWidth="1.4" />
      <path d="M4 4l3 3M7 4H4v3" stroke="#ffd32a" strokeWidth="1.2" fill="none" />
      <path d="M8 2l3 3M11 2H8v3" stroke="#ffd32a" strokeWidth="1.2" fill="none" />
    </g>
  ),
  thermistor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M3 12h3l1.5-5 3 10 3-10 1.5 5H21" />
      <path d="M6 18l12-12h3" strokeWidth="1.4" />
      <text x="18" y="9" fontSize="6" fill={c}>T°</text>
    </g>
  ),
  temperature_sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M12 5a2 2 0 0 0-2 2v6a3.5 3.5 0 1 0 4 0V7a2 2 0 0 0-2-2z" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <circle cx="12" cy="14.5" r="1.8" fill="#ff3838" stroke="none" />
    </g>
  ),
  photodiode: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M4 12h6l6-4v8l-6-4" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <path d="M7 3l-3 3M4 3v3h3" stroke="#ffd32a" strokeWidth="1.2" fill="none" />
      <path d="M11 2l-3 3M8 2v3h3" stroke="#ffd32a" strokeWidth="1.2" fill="none" />
    </g>
  ),
  ultrasonic_sensor: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="3" y="7" width="18" height="10" rx="1.5" fill="#1f5690" opacity="0.4" />
      <circle cx="8" cy="12" r="3.2" fill="#111111" stroke="#c9d1d9" />
      <circle cx="16" cy="12" r="3.2" fill="#111111" stroke="#c9d1d9" />
    </g>
  ),
  ir_sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="9" width="12" height="9" rx="1" fill="#161b22" />
      <circle cx="9" cy="6" r="2" fill="#111111" stroke={c} />
      <circle cx="15" cy="6" r="2" fill="#45d8c4" stroke={c} />
    </g>
  ),
  pir_motion_sensor: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="4" y="6" width="16" height="12" rx="1.5" fill="#f5f6fa" opacity="0.3" />
      <circle cx="12" cy="12" r="4.5" fill="#ffffff" stroke={c} />
      <path d="M6 6c3-3 9-3 12 0" stroke="#ff3838" strokeWidth="1.2" />
    </g>
  ),
  gas_sensor: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="4" y="6" width="16" height="12" rx="1.5" fill="#1f5690" opacity="0.3" />
      <circle cx="12" cy="12" r="4.5" fill="#c9d1d9" stroke={c} />
      <circle cx="12" cy="12" r="2.5" fill="#111111" stroke="none" />
    </g>
  ),
  humidity_sensor: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="5" y="5" width="14" height="14" rx="2" fill="#0077b6" opacity="0.5" />
      <line x1="8" y1="8" x2="16" y2="8" stroke="#ffffff" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#ffffff" />
      <line x1="8" y1="16" x2="16" y2="16" stroke="#ffffff" />
    </g>
  ),
  hall_effect_sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <path d="M7 6h10v8H7z" fill="#161b22" />
      <text x="12" y="12" fontSize="6" textAnchor="middle" fill="#ffd32a" fontWeight="bold">B</text>
      <line x1="9" y1="14" x2="9" y2="19" />
      <line x1="12" y1="14" x2="12" y2="19" />
      <line x1="15" y1="14" x2="15" y2="19" />
    </g>
  ),
  touch_sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="5" width="14" height="14" rx="2" fill="#ff3838" opacity="0.3" />
      <circle cx="12" cy="12" r="4" stroke={c} strokeDasharray="2 1" />
    </g>
  ),
  accelerometer: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="6" width="12" height="12" rx="1.5" fill="#161b22" />
      <path d="M12 9v6M12 9l-2 2M12 9l2 2" stroke="#3ddc84" />
      <path d="M9 12h6M15 12l-2-2M15 12l-2 2" stroke="#ff3838" />
    </g>
  ),
  soil_moisture_sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="4" width="12" height="6" rx="1" fill="#161b22" />
      <path d="M8 10v9M16 10v9" stroke="#d4af37" strokeWidth="2" />
    </g>
  ),
  flame_sensor: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="6" y="8" width="12" height="10" rx="1" fill="#1f5690" opacity="0.4" />
      <circle cx="12" cy="5" r="2" fill="#111111" stroke="#ff3838" />
      <path d="M12 12c-1.5 0-2 1-2 2s1 2 2 2 2-1 2-2-0.5-2-2-2z" fill="#ff3838" stroke="none" />
    </g>
  ),
  water_level_sensor: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="7" y="4" width="10" height="16" rx="1" fill="#0077b6" opacity="0.3" />
      <line x1="9" y1="7" x2="9" y2="17" stroke="#d4af37" />
      <line x1="12" y1="7" x2="12" y2="17" stroke="#d4af37" />
      <line x1="15" y1="7" x2="15" y2="17" stroke="#d4af37" />
    </g>
  ),

  // --- Displays ---
  seven_segment_display: (c) => (
    <g stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round">
      <rect x="5" y="4" width="14" height="16" rx="1.5" fill="#111111" />
      <path d="M9 7h6M15 7v4M15 11v4M9 15h6M9 11v4M9 7v4M9 11h6" stroke="#ff3838" strokeWidth="1.4" />
    </g>
  ),
  lcd_display: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="#1f5690" />
      <rect x="5" y="7" width="14" height="10" fill="#32ff7e" opacity="0.8" stroke="none" />
      <line x1="6" y1="10" x2="18" y2="10" stroke="#111111" strokeDasharray="1 1" />
      <line x1="6" y1="14" x2="18" y2="14" stroke="#111111" strokeDasharray="1 1" />
    </g>
  ),
  oled_display: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <rect x="4" y="4" width="16" height="16" rx="1.5" fill="#181c24" />
      <rect x="6" y="8" width="12" height="10" fill="#111111" stroke="#18dcff" />
      <circle cx="8" cy="6" r="0.6" fill="#d4af37" stroke="none" />
      <circle cx="10.5" cy="6" r="0.6" fill="#d4af37" stroke="none" />
      <circle cx="13" cy="6" r="0.6" fill="#d4af37" stroke="none" />
      <circle cx="15.5" cy="6" r="0.6" fill="#d4af37" stroke="none" />
    </g>
  ),
  led_matrix: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="4" y="4" width="16" height="16" rx="1.5" fill="#111111" />
      {[7, 10, 13, 17].map((x) =>
        [7, 10, 13, 17].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#ff3838" stroke="none" />
        ))
      )}
    </g>
  ),
  rgb_led_display: (c) => (
    <g stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round">
      <rect x="3" y="8" width="18" height="8" rx="1" fill="#161b22" />
      <circle cx="6" cy="12" r="1.5" fill="#ff3838" stroke="none" />
      <circle cx="10" cy="12" r="1.5" fill="#ffd32a" stroke="none" />
      <circle cx="14" cy="12" r="1.5" fill="#32ff7e" stroke="none" />
      <circle cx="18" cy="12" r="1.5" fill="#18dcff" stroke="none" />
    </g>
  ),
  nixie_tube: (c) => (
    <g stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round">
      <ellipse cx="12" cy="6" rx="5" ry="2" stroke="#c9d1d9" fill="color-mix(in srgb, currentColor 20%, transparent)" />
      <line x1="7" y1="6" x2="7" y2="18" stroke="#c9d1d9" />
      <line x1="17" y1="6" x2="17" y2="18" stroke="#c9d1d9" />
      <ellipse cx="12" cy="18" rx="5" ry="2" stroke="#c9d1d9" />
      <text x="12" y="15" fontSize="8" textAnchor="middle" fill="#ffa801" fontWeight="bold">8</text>
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
  const partGlyph = partKey ? (PART_GLYPHS[partKey] || BOARD_GLYPHS[partKey]) : null;
  const glyph = partGlyph || GLYPHS[category] || GLYPHS.passive;

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