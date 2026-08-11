import { validateImportedCircuit } from "../circuitIO";

describe("circuitIO utility tests", () => {
  test("validates properly structured circuit JSON", () => {
    const data = {
      circuit_json: {
        nodes: [{ id: "n1", key: "resistor" }],
        edges: [{ id: "e1", sourceId: "n1", targetId: "n2" }],
      },
    };
    const result = validateImportedCircuit(data);
    expect(result.valid).toBe(true);
    expect(result.nodes.length).toBe(1);
    expect(result.edges.length).toBe(1);
  });

  test("rejects malformed circuit JSON missing nodes", () => {
    const data = { circuit_json: { edges: [] } };
    const result = validateImportedCircuit(data);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Missing or invalid nodes array");
  });
});
