// Circuit import and export utilities for JSON file save/load

export function exportCircuitToJSON(nodes, edges, title = "circuit-export") {
  const payload = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    title,
    circuit_json: {
      nodes: nodes.map((n) => ({
        id: n.id,
        key: n.key,
        name: n.name,
        category: n.category,
        x: n.x,
        z: n.z,
        pins: n.pins || [],
        default_value: n.default_value,
      })),
      edges: edges.map((e) => ({
        id: e.id,
        sourceId: e.sourceId,
        sourceTerminal: e.sourceTerminal,
        targetId: e.targetId,
        targetTerminal: e.targetTerminal,
        color: e.color || "#00d2d3",
      })),
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function validateImportedCircuit(jsonObj) {
  if (!jsonObj || typeof jsonObj !== "object") return { valid: false, error: "Invalid JSON format" };
  const circuit = jsonObj.circuit_json || jsonObj;
  if (!Array.isArray(circuit.nodes)) return { valid: false, error: "Missing or invalid nodes array" };
  if (!Array.isArray(circuit.edges)) return { valid: false, error: "Missing or invalid edges array" };
  return { valid: true, nodes: circuit.nodes, edges: circuit.edges };
}
