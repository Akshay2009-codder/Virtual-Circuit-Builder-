/**
 * Three.js Thermal Heat Map Color Overlay Shader Spec
 */
export function getComponentHeatMapColor(powerWatts, maxPowerWatts = 1.0) {
  const ratio = Math.min(1.0, Math.max(0.0, powerWatts / maxPowerWatts));
  // Interpolate from Cyan (cool) to Red/Mag (hot)
  const r = Math.floor(ratio * 255);
  const g = Math.floor((1 - ratio) * 150);
  const b = Math.floor((1 - ratio) * 255);
  return (r << 16) | (g << 8) | b;
}
