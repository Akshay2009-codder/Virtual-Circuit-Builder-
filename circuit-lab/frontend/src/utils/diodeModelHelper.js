/**
 * Diode Shockley V-I Curve Calculation Helper
 */
export function calculateDiodeCurrent(voltage, saturationCurrent = 1e-12, thermalVoltage = 0.0259, idealityFactor = 1.0) {
  if (voltage < -5.0) return -saturationCurrent; // Breakdown threshold approximation
  return saturationCurrent * (Math.exp(voltage / (idealityFactor * thermalVoltage)) - 1);
}

export function calculateDiodeDynamicResistance(voltage, saturationCurrent = 1e-12, thermalVoltage = 0.0259) {
  const current = calculateDiodeCurrent(voltage, saturationCurrent, thermalVoltage);
  return thermalVoltage / (current + saturationCurrent);
}
