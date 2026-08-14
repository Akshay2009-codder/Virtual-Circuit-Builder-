/**
 * Fast Conductance Matrix Update Helper for MNA Engine
 */
export function updateNodeConductance(matrix, nodeA, nodeB, conductance) {
  if (nodeA >= 0) matrix[nodeA][nodeA] += conductance;
  if (nodeB >= 0) matrix[nodeB][nodeB] += conductance;
  if (nodeA >= 0 && nodeB >= 0) {
    matrix[nodeA][nodeB] -= conductance;
    matrix[nodeB][nodeA] -= conductance;
  }
}
