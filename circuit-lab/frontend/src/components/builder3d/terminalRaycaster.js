/**
 * Perspective Raycaster Terminal Hitbox Fine-Tuner
 */
export function findHoveredTerminal(raycaster, terminalMeshes) {
  const intersects = raycaster.intersectObjects(terminalMeshes, true);
  if (intersects.length > 0) {
    return intersects[0].object.userData.terminalId || null;
  }
  return null;
}
