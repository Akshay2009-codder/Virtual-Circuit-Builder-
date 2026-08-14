/**
 * 3D Selection Box Bounding Calculation
 */
export function getBoundingBoxForComponents(components) {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  components.forEach(c => {
    minX = Math.min(minX, c.position.x);
    minY = Math.min(minY, c.position.y);
    minZ = Math.min(minZ, c.position.z);
    maxX = Math.max(maxX, c.position.x);
    maxY = Math.max(maxY, c.position.y);
    maxZ = Math.max(maxZ, c.position.z);
  });

  return { min: { x: minX, y: minY, z: minZ }, max: { x: maxX, y: maxY, z: maxZ } };
}
