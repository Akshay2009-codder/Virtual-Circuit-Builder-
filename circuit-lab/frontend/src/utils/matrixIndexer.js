/**
 * Node Matrix Indexer for MNA Circuit Solvers
 */
export class NodeMatrixIndexer {
  constructor() {
    self.nodeMap = new Map();
    self.currentIndex = 0;
  }

  getOrAssignIndex(nodeId) {
    if (nodeId === '0' || nodeId === 'GND' || nodeId === 'ground') return -1;
    if (!this.nodeMap.has(nodeId)) {
      this.nodeMap.set(nodeId, this.currentIndex++);
    }
    return this.nodeMap.get(nodeId);
  }

  getMatrixDimension() {
    return this.currentIndex;
  }
}
