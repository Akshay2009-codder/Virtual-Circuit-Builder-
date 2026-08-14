# Circuit Schematic SVG to PNG Thumbnail Generator Helper

def generate_circuit_thumbnail_meta(circuit_data):
    component_count = len(circuit_data.get('components', []))
    wire_count = len(circuit_data.get('wires', []))
    return {
        "aspect_ratio": "16:9",
        "elements_rendered": component_count + wire_count,
        "status": "ready"
    }
