/**
 * Waveform Generator Utility for Virtual Circuit Builder.
 * Calculates theoretical instantaneous voltages for AC signal sources,
 * function generators, and PWM signals.
 */

/**
 * Calculates instantaneous voltage for a sine wave.
 * @param {number} t Time in seconds
 * @param {number} amplitude Peak voltage in Volts
 * @param {number} frequency Frequency in Hertz
 * @param {number} phaseOffset Phase offset in radians (default 0)
 * @param {number} dcOffset DC offset voltage in Volts (default 0)
 * @returns {number} Instantaneous voltage
 */
export function generateSineWave(t, amplitude, frequency, phaseOffset = 0, dcOffset = 0) {
  return dcOffset + amplitude * Math.sin(2 * Math.PI * frequency * t + phaseOffset);
}

/**
 * Calculates instantaneous voltage for a square wave.
 * @param {number} t Time in seconds
 * @param {number} amplitude Peak voltage in Volts
 * @param {number} frequency Frequency in Hertz
 * @param {number} dutyCycle Duty cycle percentage (0.0 to 1.0, default 0.5)
 * @param {number} dcOffset DC offset voltage in Volts (default 0)
 * @returns {number} Instantaneous voltage
 */
export function generateSquareWave(t, amplitude, frequency, dutyCycle = 0.5, dcOffset = 0) {
  if (frequency <= 0) return dcOffset;
  const period = 1 / frequency;
  const timeInPeriod = (t % period + period) % period;
  const isHigh = timeInPeriod / period < dutyCycle;
  return dcOffset + (isHigh ? amplitude : -amplitude);
}

/**
 * Calculates instantaneous voltage for a triangle wave.
 * @param {number} t Time in seconds
 * @param {number} amplitude Peak voltage in Volts
 * @param {number} frequency Frequency in Hertz
 * @param {number} dcOffset DC offset voltage in Volts (default 0)
 * @returns {number} Instantaneous voltage
 */
export function generateTriangleWave(t, amplitude, frequency, dcOffset = 0) {
  if (frequency <= 0) return dcOffset;
  const period = 1 / frequency;
  const timeInPeriod = (t % period + period) % period;
  const normalized = timeInPeriod / period;
  
  if (normalized < 0.5) {
    return dcOffset - amplitude + 4 * amplitude * normalized;
  } else {
    return dcOffset + 3 * amplitude - 4 * amplitude * normalized;
  }
}

/**
 * Calculates PWM (Pulse Width Modulation) voltage output (0V to VCC).
 * @param {number} t Time in seconds
 * @param {number} vcc Peak voltage level (e.g. 3.3V or 5.0V)
 * @param {number} frequency PWM frequency in Hertz
 * @param {number} dutyCycle Duty cycle (0.0 to 1.0)
 * @returns {number} Voltage level (0 or VCC)
 */
export function generatePWM(t, vcc, frequency, dutyCycle) {
  if (frequency <= 0) return 0;
  const period = 1 / frequency;
  const timeInPeriod = (t % period + period) % period;
  return timeInPeriod / period < dutyCycle ? vcc : 0;
}
