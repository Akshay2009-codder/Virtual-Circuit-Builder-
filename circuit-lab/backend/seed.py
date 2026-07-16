from models import db
from component_model import Component

# model_type controls which 3D builder3d the frontend uses (components/3d/PartModels.jsx).
# Several catalog entries intentionally share a model_type because those real
# parts look near-identical (e.g. a zener diode and a rectifier diode both
# ship in the same glass/black axial body).

CATALOG = [
    # ---------------- Passive ----------------
    dict(
        key="resistor", name="Resistor", category="passive",
        description="Limits current flow and divides voltage. Higher resistance means less current for a given voltage, per Ohm's Law (V = IR).",
        model_type="resistor", unit="Ω", default_value=220, terminal_count=2,
        spec={"tolerance": "±5%", "power_rating": "0.25 W"},
    ),
    dict(
        key="capacitor_electrolytic", name="Electrolytic Capacitor", category="passive",
        description="Polarized capacitor with high capacitance in a small package. Stores charge for smoothing and filtering — must be wired the right way round or it can fail.",
        model_type="capacitor_electrolytic", unit="µF", default_value=100, terminal_count=2,
        spec={"voltage_rating": "16V", "polarized": "yes"},
    ),
    dict(
        key="capacitor_ceramic", name="Ceramic Capacitor", category="passive",
        description="Small, unpolarized disc capacitor used for decoupling and high-frequency filtering. Can be wired either way round.",
        model_type="capacitor_ceramic", unit="nF", default_value=100, terminal_count=2,
        spec={"voltage_rating": "50V", "polarized": "no"},
    ),
    dict(
        key="inductor", name="Inductor", category="passive",
        description="Coil of wire that resists changes in current by storing energy in a magnetic field. Used in filters, converters, and chokes.",
        model_type="inductor", unit="mH", default_value=10, terminal_count=2,
        spec={"core": "ferrite"},
    ),
    dict(
        key="potentiometer", name="Potentiometer", category="passive",
        description="A variable resistor with a rotating wiper — turning the knob changes resistance, commonly used for volume or brightness control.",
        model_type="potentiometer", unit="kΩ", default_value=10, terminal_count=3,
        spec={"taper": "linear"},
    ),
    dict(
        key="fuse", name="Fuse", category="passive",
        description="Sacrificial link that melts and breaks the circuit if current exceeds a safe limit, protecting the rest of the components from damage.",
        model_type="fuse", unit="A", default_value=1, terminal_count=2,
        spec={"type": "fast-blow"},
    ),
    dict(
        key="wire", name="Wire", category="passive",
        description="Connects two points with (ideally) zero resistance. In the builder3d, wires are what you draw between component terminals to complete a circuit.",
        model_type="wire", unit=None, default_value=None, terminal_count=2,
        spec={},
    ),

    # ---------------- Active / semiconductors ----------------
    dict(
        key="led", name="LED", category="active",
        description="Light-emitting diode — conducts current in one direction only and emits light when forward biased. Needs a current-limiting resistor in series or it burns out.",
        model_type="led", unit="V", default_value=2.0, terminal_count=2,
        spec={"forward_voltage": "2.0V", "max_current": "20mA"},
    ),
    dict(
        key="diode", name="Diode", category="active",
        description="Allows current to flow in only one direction. Used for rectification, protection against reverse voltage, and signal steering.",
        model_type="diode", unit="V", default_value=0.7, terminal_count=2,
        spec={"forward_voltage": "0.7V", "type": "silicon rectifier"},
    ),
    dict(
        key="zener_diode", name="Zener Diode", category="active",
        description="A diode designed to conduct in reverse once a specific breakdown voltage is reached — used to hold a steady reference voltage.",
        model_type="diode", unit="V", default_value=5.1, terminal_count=2,
        spec={"zener_voltage": "5.1V"},
    ),
    dict(
        key="transistor_npn", name="NPN Transistor", category="active",
        description="Three-terminal switch/amplifier. A small current into the base lets a much larger current flow from collector to emitter.",
        model_type="transistor", unit=None, default_value=None, terminal_count=3,
        spec={"package": "TO-92", "type": "NPN (e.g. 2N2222)"},
    ),
    dict(
        key="transistor_pnp", name="PNP Transistor", category="active",
        description="Like an NPN transistor but with current flow reversed — conducts when the base is pulled low relative to the emitter.",
        model_type="transistor", unit=None, default_value=None, terminal_count=3,
        spec={"package": "TO-92", "type": "PNP (e.g. 2N3906)"},
    ),
    dict(
        key="mosfet", name="MOSFET", category="active",
        description="Voltage-controlled switch used for higher-power switching than a regular transistor — the basis of most modern power electronics.",
        model_type="mosfet", unit=None, default_value=None, terminal_count=3,
        spec={"package": "TO-220", "type": "N-channel"},
    ),

    # ---------------- Integrated circuits ----------------
    dict(
        key="ic_555", name="555 Timer IC", category="ic",
        description="Classic general-purpose timer chip used to build oscillators, delays, and pulse generators — a staple of beginner electronics.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=8,
        spec={"package": "DIP-8"},
    ),
    dict(
        key="ic_opamp", name="Op-Amp IC", category="ic",
        description="Operational amplifier — a high-gain voltage amplifier used for signal conditioning, filtering, and comparison circuits.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=8,
        spec={"package": "DIP-8", "type": "e.g. LM358"},
    ),
    dict(
        key="voltage_regulator", name="Voltage Regulator", category="ic",
        description="Takes a variable input voltage and outputs a fixed, stable voltage — e.g. a 7805 turns anything from ~7-25V into a clean 5V.",
        model_type="mosfet", unit="V", default_value=5.0, terminal_count=3,
        spec={"package": "TO-220", "type": "7805 (5V fixed)"},
    ),

    # ---------------- Power sources ----------------
    dict(
        key="battery_9v", name="9V Battery", category="source",
        description="Rectangular DC voltage source with snap terminals, commonly used to power small breadboard circuits.",
        model_type="battery_9v", unit="V", default_value=9.0, terminal_count=2,
        spec={"chemistry": "alkaline"},
    ),
    dict(
        key="battery_aa", name="AA Battery", category="source",
        description="Cylindrical 1.5V cell. Combine several in series to build up higher voltages for a circuit.",
        model_type="battery_aa", unit="V", default_value=1.5, terminal_count=2,
        spec={"chemistry": "alkaline"},
    ),
    dict(
        key="solar_panel", name="Solar Panel", category="source",
        description="Converts light into DC voltage via the photovoltaic effect. Output varies with how much light is hitting it.",
        model_type="solar_panel", unit="V", default_value=6.0, terminal_count=2,
        spec={"type": "polycrystalline"},
    ),

    # ---------------- Control / input ----------------
    dict(
        key="switch", name="Switch", category="control",
        description="Mechanically opens or closes a circuit path. Open = infinite resistance, no current flows. Closed = near-zero resistance, current flows freely.",
        model_type="switch", unit=None, default_value=None, terminal_count=2,
        spec={"type": "SPST"},
    ),
    dict(
        key="push_button", name="Push Button", category="control",
        description="Momentary switch — only closes the circuit while it's physically held down, then springs back open.",
        model_type="push_button", unit=None, default_value=None, terminal_count=2,
        spec={"type": "momentary, normally-open"},
    ),
    dict(
        key="relay", name="Relay", category="control",
        description="An electromagnetic switch — a small control current energizes a coil that mechanically closes a separate, often higher-power, circuit.",
        model_type="relay", unit="V", default_value=5.0, terminal_count=4,
        spec={"coil_voltage": "5V"},
    ),
    dict(
        key="dip_switch", name="DIP Switch", category="control",
        description="A bank of small individual on/off switches in one package, often used to set configuration options on a board.",
        model_type="dip_switch", unit=None, default_value=None, terminal_count=2,
        spec={"positions": 4},
    ),

    # ---------------- Output ----------------
    dict(
        key="buzzer", name="Buzzer", category="output",
        description="Piezoelectric component that produces a tone when voltage is applied — commonly used for alerts and simple feedback.",
        model_type="buzzer", unit="V", default_value=5.0, terminal_count=2,
        spec={"type": "piezo"},
    ),
    dict(
        key="dc_motor", name="DC Motor", category="output",
        description="Converts electrical energy into rotational motion. Speed roughly scales with applied voltage.",
        model_type="dc_motor", unit="V", default_value=6.0, terminal_count=2,
        spec={"type": "brushed"},
    ),
    dict(
        key="speaker", name="Speaker", category="output",
        description="Converts an electrical audio signal into sound via a vibrating cone driven by a magnet and coil.",
        model_type="speaker", unit="Ω", default_value=8, terminal_count=2,
        spec={"impedance": "8Ω"},
    ),

    # ---------------- Sensors ----------------
    dict(
        key="ldr", name="Photoresistor (LDR)", category="sensor",
        description="Light-dependent resistor — its resistance drops as more light hits it, commonly used to detect brightness or darkness.",
        model_type="ldr", unit="kΩ", default_value=10, terminal_count=2,
        spec={"dark_resistance": "~1MΩ", "light_resistance": "~1kΩ"},
    ),
    dict(
        key="thermistor", name="Thermistor", category="sensor",
        description="Temperature-dependent resistor — resistance changes predictably with temperature, used to build simple temperature sensors.",
        model_type="thermistor", unit="kΩ", default_value=10, terminal_count=2,
        spec={"type": "NTC"},
    ),

    # ---------------- Microcontroller boards ----------------
    dict(
        key="esp32", name="ESP32 Dev Board", category="board",
        description="A 32-bit dual-core microcontroller board with built-in Wi-Fi and Bluetooth — the go-to choice for IoT projects that need wireless connectivity.",
        model_type="dev_board", unit="V", default_value=3.3, terminal_count=30,
        spec={"cpu": "dual-core 240MHz", "wifi": "802.11 b/g/n", "flash": "4MB", "gpio_pins": 30},
    ),
    dict(
        key="arduino_uno", name="Arduino Uno", category="board",
        description="The classic beginner-friendly microcontroller board built around the ATmega328P chip — simple, well-documented, and everywhere in tutorials.",
        model_type="dev_board", unit="V", default_value=5.0, terminal_count=20,
        spec={"microcontroller": "ATmega328P", "digital_pins": 14, "analog_pins": 6, "clock_speed": "16MHz"},
    ),
    dict(
        key="raspberry_pi_pico", name="Raspberry Pi Pico", category="board",
        description="A tiny, low-cost microcontroller board built around the RP2040 chip, with a generous number of GPIO pins and dual-core processing.",
        model_type="dev_board", unit="V", default_value=3.3, terminal_count=26,
        spec={"chip": "RP2040", "gpio_pins": 26, "clock_speed": "133MHz"},
    ),
]


def seed_components():
    existing = {c.key for c in Component.query.all()}
    for item in CATALOG:
        if item["key"] not in existing:
            db.session.add(Component(**item))
    db.session.commit()