/**
 * Three.js Pin Shadow & Metallic Specular Lighting Configurator
 */
export function setupComponentPinLighting(scene, renderer) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = 2; // PCFSoftShadowMap

  const pinLight = {
    color: 0xffffff,
    intensity: 1.2,
    castShadow: true,
    shadowBias: -0.0001
  };
  return pinLight;
}
