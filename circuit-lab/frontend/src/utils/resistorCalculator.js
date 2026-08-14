/**
 * Extended Resistor Value & Thermal Coefficient Calculator
 */
export function calculateThermalResistance(baseResistance, temperatureCelsius, tempCoefficientPpm = 200) {
  const deltaT = temperatureCelsius - 25.0; // Reference 25C
  const factor = 1 + (tempCoefficientPpm * 1e-6) * deltaT;
  return Math.max(0.001, baseResistance * factor);
}

export function decodeColorCode(bands) {
  const colorMap = { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, grey: 8, white: 9 };
  if (bands.length < 3) return 0;
  const val = (colorMap[bands[0]] * 10 + colorMap[bands[1]]) * Math.pow(10, colorMap[bands[2]]);
  return val;
}
