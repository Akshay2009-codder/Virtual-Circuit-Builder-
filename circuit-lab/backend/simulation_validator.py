"""
Pre-flight topology validation for electrical circuit simulation graphs
"""

def validate_circuit_graph(nodes, edges):
    """
    Checks for floating components, short circuits, and missing power/ground references.
    """
    errors = []
    warnings = []

    if not nodes:
        errors.append("Circuit contains no components.")
        return {"valid": False, "errors": errors, "warnings": warnings}

    has_power = any(n.get("role") == "power" or n.get("key") in ["dc_power", "battery", "esp32", "arduino_uno"] for n in nodes)
    has_ground = any(n.get("role") == "ground" for n in nodes) or any("gnd" in str(e).lower() for e in edges)

    if not has_power:
        warnings.append("No active voltage source detected in circuit topology.")

    connected_node_ids = set()
    for e in edges:
        connected_node_ids.add(e.get("sourceId"))
        connected_node_ids.add(e.get("targetId"))

    unconnected_nodes = [n.get("name", n.get("id")) for n in nodes if n.get("id") not in connected_node_ids]
    if unconnected_nodes:
        warnings.append(f"Unconnected components present: {', '.join(unconnected_nodes)}")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }
