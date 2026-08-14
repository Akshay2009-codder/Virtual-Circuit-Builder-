/**
 * Custom Shader Helper for Dynamic LED Emission Intensity
 */
export function getLedEmissiveMaterial(colorHex = 0xff0000, currentMilliAmps = 0) {
  const maxCurrent = 20.0;
  const intensity = Math.min(1.0, Math.max(0.0, currentMilliAmps / maxCurrent));
  return {
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: intensity * 2.5,
    roughness: 0.2
  };
}
