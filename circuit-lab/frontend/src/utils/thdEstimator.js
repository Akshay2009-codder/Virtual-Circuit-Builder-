/**
 * Total Harmonic Distortion (THD) Estimator Helper
 */
export function calculateTHD(fundamentalAmplitude, harmonicAmplitudes) {
  if (fundamentalAmplitude <= 0) return 0;
  const sumHarmonicsSquared = harmonicAmplitudes.reduce((acc, amp) => acc + amp * amp, 0);
  return (Math.sqrt(sumHarmonicsSquared) / fundamentalAmplitude) * 100; // Percentage
}
