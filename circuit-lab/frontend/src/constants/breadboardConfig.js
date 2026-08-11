// 830-Point Solderless Breadboard Grid Geometry & Rail Constants

export const BREADBOARD_GRID = {
  ROWS: 63,
  COLUMNS_TOP: ["A", "B", "C", "D", "E"],
  COLUMNS_BOTTOM: ["F", "G", "H", "I", "J"],
  PITCH_MM: 2.54, // 0.1 inch standard pin pitch
  X_START: -2.8,
  Z_DIVIDER: 0.0,
};

export const POWER_RAILS = {
  TOP_POSITIVE: { label: "+ (5V/VCC)", color: "#ff3838", zOffset: -0.85 },
  TOP_NEGATIVE: { label: "- (GND)", color: "#1e272e", zOffset: -0.72 },
  BOTTOM_POSITIVE: { label: "+ (5V/VCC)", color: "#ff3838", zOffset: 0.72 },
  BOTTOM_NEGATIVE: { label: "- (GND)", color: "#1e272e", zOffset: 0.85 },
};

/**
 * Calculates 3D world coordinates for a breadboard pin coordinate (e.g. Row 15, Column C)
 */
export function getBreadboardHoleCoords(row, col) {
  const x = BREADBOARD_GRID.X_START + row * 0.088;
  const colIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].indexOf(col.toUpperCase());
  let z = 0;
  if (colIndex < 5) {
    z = -0.45 + colIndex * 0.075;
  } else {
    z = 0.15 + (colIndex - 5) * 0.075;
  }
  return { x, y: 0.16, z };
}
