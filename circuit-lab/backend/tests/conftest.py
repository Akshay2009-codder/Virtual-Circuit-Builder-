# Pytest Shared Fixtures for Backend Tests
import pytest

@pytest.fixture
def sample_circuit_payload():
    return {
        "title": "Test RC Filter Circuit",
        "components": [
            {"type": "RESISTOR", "value": 1000},
            {"type": "CAPACITOR", "value": 1e-6}
        ]
    }
