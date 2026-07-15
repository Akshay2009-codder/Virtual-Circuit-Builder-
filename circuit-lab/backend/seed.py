from models import db
from component_model import Component

CATALOG = [
    dict(
        key="resistor",
        name="Resistor",
        category="passive",
        description=(
            "Limits current flow and divides voltage. Value is set in ohms — "
            "higher resistance means less current for a given voltage, per Ohm's Law (V = IR)."
        ),
        model_type="resistor",
        unit="Ω",
        default_value=220,
        terminal_count=2,
        spec={"tolerance": "±5%", "power_rating": "0.25 W"},
    ),
    dict(
        key="capacitor",
        name="Capacitor",
        category="passive",
        description=(
            "Stores energy in an electric field and releases it when needed. Blocks DC once charged, "
            "passes AC — used for filtering, smoothing, and timing circuits."
        ),
        model_type="capacitor",
        unit="µF",
        default_value=100,
        terminal_count=2,
        spec={"voltage_rating": "16V", "type": "electrolytic"},
    ),
    dict(
        key="led",
        name="LED",
        category="active",
        description=(
            "Light-emitting diode — conducts current in one direction only and emits light when forward "
            "biased. Needs a current-limiting resistor in series or it burns out."
        ),
        model_type="led",
        unit="V",
        default_value=2.0,
        terminal_count=2,
        spec={"forward_voltage": "2.0V", "max_current": "20mA"},
    ),
    dict(
        key="battery",
        name="Battery",
        category="source",
        description=(
            "DC voltage source that powers the circuit. Current flows from the positive terminal through "
            "the circuit and back to the negative terminal."
        ),
        model_type="battery",
        unit="V",
        default_value=9.0,
        terminal_count=2,
        spec={"chemistry": "alkaline"},
    ),
    dict(
        key="switch",
        name="Switch",
        category="control",
        description=(
            "Mechanically opens or closes a circuit path. Open = infinite resistance, no current flows. "
            "Closed = near-zero resistance, current flows freely."
        ),
        model_type="switch",
        unit=None,
        default_value=None,
        terminal_count=2,
        spec={"type": "SPST"},
    ),
    dict(
        key="wire",
        name="Wire",
        category="passive",
        description=(
            "Connects two points with (ideally) zero resistance. In the builder, wires are what you draw "
            "between component terminals to complete a circuit."
        ),
        model_type="wire",
        unit=None,
        default_value=None,
        terminal_count=2,
        spec={},
    ),
]


def seed_components():
    if Component.query.first():
        return  # already seeded
    for item in CATALOG:
        db.session.add(Component(**item))
    db.session.commit()
