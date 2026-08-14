/**
 * Kirchhoff's Current Law (KCL) Matrix Validation Unit Tests
 */
import { updateNodeConductance } from '../matrixUpdater.js';

describe('Conductance Matrix Updates', () => {
  test('correctly populates diagonal and off-diagonal terms', () => {
    const mat = [[0, 0], [0, 0]];
    updateNodeConductance(mat, 0, 1, 0.1);
    expect(mat[0][0]).toBe(0.1);
    expect(mat[1][1]).toBe(0.1);
    expect(mat[0][1]).toBe(-0.1);
    expect(mat[1][0]).toBe(-0.1);
  });
});
