/**
 * Matrix Singularity & High Resistance Parallel Resolver
 */
export function sanitizeConductanceMatrix(matrix, minDiagonal = 1e-12) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    if (Math.abs(matrix[i][i]) < minDiagonal) {
      matrix[i][i] = minDiagonal; // Add Gmin to prevent zero pivot singularity
    }
  }
  return matrix;
}
