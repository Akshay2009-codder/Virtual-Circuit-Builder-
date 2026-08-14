/**
 * Realistic Wire PVC Insulation & Specular Gloss Material Config
 */
export function createWireMaterialSpec(colorHex) {
  return {
    color: colorHex,
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1
  };
}
