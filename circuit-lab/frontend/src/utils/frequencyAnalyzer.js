/**
 * Step Response Frequency Analyzer for RLC Loops
 */
export function calculateResonantFrequency(inductanceHenry, capacitanceFarads) {
  if (inductanceHenry <= 0 || capacitanceFarads <= 0) return 0;
  return 1 / (2 * Math.PI * Math.sqrt(inductanceHenry * capacitanceFarads));
}

export function calculateQualityFactor(resistanceOhms, inductanceHenry, capacitanceFarads) {
  if (resistanceOhms <= 0 || capacitanceFarads <= 0) return Infinity;
  return (1 / resistanceOhms) * Math.sqrt(inductanceHenry / capacitanceFarads);
}
