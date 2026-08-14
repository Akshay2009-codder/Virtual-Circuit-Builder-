/**
 * MNA Matrix Indexer Unit Tests
 */
import { NodeMatrixIndexer } from '../matrixIndexer.js';

describe('NodeMatrixIndexer', () => {
  test('ground nodes map to -1', () => {
    const indexer = new NodeMatrixIndexer();
    expect(indexer.getOrAssignIndex('GND')).toBe(-1);
    expect(indexer.getOrAssignIndex('0')).toBe(-1);
  });

  test('assigns sequential indices to net nodes', () => {
    const indexer = new NodeMatrixIndexer();
    expect(indexer.getOrAssignIndex('N1')).toBe(0);
    expect(indexer.getOrAssignIndex('N2')).toBe(1);
    expect(indexer.getOrAssignIndex('N1')).toBe(0);
    expect(indexer.getMatrixDimension()).toBe(2);
  });
});
