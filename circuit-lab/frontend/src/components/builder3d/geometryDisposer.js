/**
 * Three.js Mesh Memory Leak & Geometry Disposer Utility
 */
export function disposeThreeObject(object3D) {
  if (!object3D) return;
  if (object3D.geometry) {
    object3D.geometry.dispose();
  }
  if (object3D.material) {
    if (Array.isArray(object3D.material)) {
      object3D.material.forEach(mat => mat.dispose());
    } else {
      object3D.material.dispose();
    }
  }
}
