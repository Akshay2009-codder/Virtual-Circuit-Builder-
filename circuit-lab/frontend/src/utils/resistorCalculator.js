// Resistor 4-band and 5-band color code calculation utilities

const COLOR_MAP = {
  black: { digit: 0, multiplier: 1, colorHex: "#1e272e" },
  brown: { digit: 1, multiplier: 10, tolerance: 1, colorHex: "#a55eea" },
  red: { digit: 2, multiplier: 100, tolerance: 2, colorHex: "#ff3838" },
  orange: { digit: 3, multiplier: 1000, colorHex: "#ff9f1a" },
  yellow: { digit: 4, multiplier: 10000, colorHex: "#fff200" },
  green: { digit: 5, multiplier: 100000, tolerance: 0.5, colorHex: "#2ed573" },
  blue: { digit: 6, multiplier: 1000000, tolerance: 0.25, colorHex: "#1e90ff" },
  violet: { digit: 7, multiplier: 10000000, tolerance: 0.1, colorHex: "#9c88ff" },
  grey: { digit: 8, multiplier: 100000000, tolerance: 0.05, colorHex: "#808e9b" },
  white: { digit: 9, multiplier: 1000000000, colorHex: "#ffffff" },
  gold: { multiplier: 0.1, tolerance: 5, colorHex: "#ffdd59" },
  silver: { multiplier: 0.01, tolerance: 10, colorHex: "#d2dae2" },
};

export function calculateResistorValue(band1, band2, multiplierBand, toleranceBand = "gold") {
  const b1 = COLOR_MAP[band1]?.digit ?? 0;
  const b2 = COLOR_MAP[band2]?.digit ?? 0;
  const mult = COLOR_MAP[multiplierBand]?.multiplier ?? 1;
  const tol = COLOR_MAP[toleranceBand]?.tolerance ?? 5;

  const valueOhms = (b1 * 10 + b2) * mult;
  return {
    valueOhms,
    tolerance: tol,
    formatted: formatOhms(valueOhms),
  };
}

export function formatOhms(ohms) {
  if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(1)} MΩ`;
  if (ohms >= 1000) return `${(ohms / 1000).toFixed(1)} kΩ`;
  return `${ohms} Ω`;
}
