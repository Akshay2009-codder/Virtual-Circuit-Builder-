/**
 * 3D Grid Snap & Component Alignment Helper
 */
export function snapVectorToGrid(position, gridSize = 0.5) {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: position.y,
    z: Math.round(position.z / gridSize) * gridSize
  };
}

export function snapRotation90Degrees(rotationY) {
  const halfPi = Math.PI / 2;
  return Math.round(rotationY / halfPi) * halfPi;
}
