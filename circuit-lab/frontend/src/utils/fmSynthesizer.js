/**
 * Frequency Modulation (FM) AC Signal Synthesizer
 */
export function generateFMSignalValue(timeSec, carrierFreqHz, modFreqHz, modIndex) {
  const modSignal = Math.sin(2 * Math.PI * modFreqHz * timeSec);
  return Math.sin(2 * Math.PI * carrierFreqHz * timeSec + modIndex * modSignal);
}
