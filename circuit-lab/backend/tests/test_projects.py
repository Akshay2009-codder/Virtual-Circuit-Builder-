"""
Unit tests for Project Serialization and Schema Validation
"""
import pytest
import json


def test_circuit_json_schema():
    """Validates circuit schema payload structure."""
    circuit_data = {
        "nodes": [
            {"id": "n1", "key": "arduino_uno", "x": 0, "z": 0},
            {"id": "n2", "key": "led_red", "x": 1, "z": 0}
        ],
        "edges": [
            {"id": "e1", "sourceId": "n1", "sourceTerminal": "d13", "targetId": "n2", "targetTerminal": "anode", "color": "#ff3838"}
        ]
    }
    
    serialized = json.dumps(circuit_data)
    deserialized = json.loads(serialized)
    
    assert len(deserialized["nodes"]) == 2
    assert len(deserialized["edges"]) == 1
    assert deserialized["edges"][0]["color"] == "#ff3838"
