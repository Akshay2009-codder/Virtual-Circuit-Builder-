/**
 * Operational Amplifier Open-Loop Gain & Saturation Model
 */
export function calculateOpAmpOutput(vPlus, vMinus, vSupplyPos = 15.0, vSupplyNeg = -15.0, openLoopGain = 100000) {
  const vDiff = vPlus - vMinus;
  const rawVout = vDiff * openLoopGain;
  return Math.min(vSupplyPos, Math.max(vSupplyNeg, rawVout));
}
