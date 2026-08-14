/**
 * Inductor Energy Storage & Inductive Reactance Solver
 */
export function calculateInductiveReactance(inductanceHenry, frequencyHz) {
  if (frequencyHz <= 0 || inductanceHenry <= 0) return 0;
  return 2 * Math.PI * frequencyHz * inductanceHenry;
}

export function calculateStoredEnergyJoules(inductanceHenry, currentAmps) {
  return 0.5 * inductanceHenry * Math.pow(currentAmps, 2);
}
