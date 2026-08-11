"""
Unit tests for Modified Nodal Analysis (MNA) Circuit Solver Engine
"""
import pytest
import math
import sys
import os

# Add parent directory to python path for importing mna_solver
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from mna_solver import solve_circuit


def test_simple_voltage_divider():
    """Test 5V source with two 1k ohm resistors in series."""
    nodes = [
        {"id": "v1", "key": "dc_power", "default_value": 5.0},
        {"id": "r1", "key": "resistor", "default_value": 1000.0},
        {"id": "r2", "key": "resistor", "default_value": 1000.0},
    ]
    edges = [
        {"id": "e1", "sourceId": "v1", "sourceTerminal": "pos", "targetId": "r1", "targetTerminal": "pin1"},
        {"id": "e2", "sourceId": "r1", "sourceTerminal": "pin2", "targetId": "r2", "targetTerminal": "pin1"},
        {"id": "e3", "sourceId": "r2", "sourceTerminal": "pin2", "targetId": "v1", "targetTerminal": "neg"},
    ]

    result = solve_circuit(nodes, edges)
    assert result["status"] == "success"
    assert "v1" in result["poweredIds"]
    assert "r1" in result["poweredIds"]
    assert "r2" in result["poweredIds"]


def test_open_circuit():
    """Test disconnected component circuit."""
    nodes = [
        {"id": "v1", "key": "dc_power", "default_value": 3.3},
        {"id": "r1", "key": "resistor", "default_value": 220.0},
    ]
    edges = []  # No connections

    result = solve_circuit(nodes, edges)
    assert result["status"] == "success"
    assert len(result["poweredIds"]) == 0
