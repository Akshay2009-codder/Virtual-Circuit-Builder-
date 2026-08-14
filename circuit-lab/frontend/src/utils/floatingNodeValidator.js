/**
 * Floating Node & High Impedance Node Detector
 */
export function detectFloatingNodes(components, connections) {
  const nodeConnections = new Map();
  connections.forEach(conn => {
    nodeConnections.set(conn.fromNode, (nodeConnections.get(conn.fromNode) || 0) + 1);
    nodeConnections.set(conn.toNode, (nodeConnections.get(conn.toNode) || 0) + 1);
  });

  const floatingNodes = [];
  nodeConnections.forEach((count, node) => {
    if (count < 2 && node !== 'GND') {
      floatingNodes.push(node);
    }
  });
  return floatingNodes;
}
