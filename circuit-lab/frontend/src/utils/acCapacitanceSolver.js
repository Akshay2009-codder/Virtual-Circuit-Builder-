/**
 * AC Capacitance Transient State Solver
 * Computes charge accumulation and AC reactance across capacitive components.
 */
export function calculateCapacitiveReactance(capacitanceFarads, frequencyHz) {
  if (frequencyHz <= 0 || capacitanceFarads <= 0) return Infinity;
  return 1 / (2 * Math.PI * frequencyHz * capacitanceFarads);
}

export function updateCapacitorTransientState(currentCharge, currentAmps, timeStepSec) {
  return currentCharge + currentAmps * timeStepSec;
}
