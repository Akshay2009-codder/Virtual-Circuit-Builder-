/**
 * Three.js Object Culling Optimization Helper
 */
export function updateFrustumCulling(camera, meshGroup) {
  meshGroup.children.forEach(mesh => {
    mesh.frustumCulled = true;
  });
}
