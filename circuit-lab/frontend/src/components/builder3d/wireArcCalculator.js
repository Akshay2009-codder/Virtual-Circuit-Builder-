/**
 * Parametric Curved Wire Arc Point Generator for 3D Jumper Wires
 */
export function generateWireBezierPoints(startPt, endPt, arcHeight = 1.5, numPoints = 20) {
  const points = [];
  const midX = (startPt.x + endPt.x) / 2;
  const midY = Math.max(startPt.y, endPt.y) + arcHeight;
  const midZ = (startPt.z + endPt.z) / 2;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = (1 - t) * (1 - t) * startPt.x + 2 * (1 - t) * t * midX + t * t * endPt.x;
    const y = (1 - t) * (1 - t) * startPt.y + 2 * (1 - t) * t * midY + t * t * endPt.y;
    const z = (1 - t) * (1 - t) * startPt.z + 2 * (1 - t) * t * midZ + t * t * endPt.z;
    points.push({ x, y, z });
  }
  return points;
}
