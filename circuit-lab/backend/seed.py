from models import db
from component_model import Component

# model_type controls which 3D builder the frontend uses (components/3d/PartModels.jsx).
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
        description="Connects two points with (ideally) zero resistance. In the builder, wires are what you draw between component terminals to complete a circuit.",
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
        model_type="esp32", unit="V", default_value=3.3, terminal_count=30,
        spec={
            "cpu": "dual-core 240MHz", "wifi": "802.11 b/g/n", "flash": "4MB", "gpio_pins": 30,
            "pins": [
                {"terminal": "3v3", "label": "3V3", "role": "power", "side": "left", "order": 0, "gpio": None, "volts": 3.3},
                {"terminal": "gnd1", "label": "GND", "role": "ground", "side": "left", "order": 1, "gpio": None, "volts": 0},
                {"terminal": "gpio36", "label": "GPIO36", "role": "gpio", "side": "left", "order": 2, "gpio": 36, "volts": None},
                {"terminal": "gpio39", "label": "GPIO39", "role": "gpio", "side": "left", "order": 3, "gpio": 39, "volts": None},
                {"terminal": "gpio34", "label": "GPIO34", "role": "gpio", "side": "left", "order": 4, "gpio": 34, "volts": None},
                {"terminal": "gpio35", "label": "GPIO35", "role": "gpio", "side": "left", "order": 5, "gpio": 35, "volts": None},
                {"terminal": "gpio32", "label": "GPIO32", "role": "gpio", "side": "left", "order": 6, "gpio": 32, "volts": None},
                {"terminal": "gpio33", "label": "GPIO33", "role": "gpio", "side": "left", "order": 7, "gpio": 33, "volts": None},
                {"terminal": "gpio25", "label": "GPIO25", "role": "gpio", "side": "left", "order": 8, "gpio": 25, "volts": None},
                {"terminal": "gpio26", "label": "GPIO26", "role": "gpio", "side": "left", "order": 9, "gpio": 26, "volts": None},
                {"terminal": "gpio27", "label": "GPIO27", "role": "gpio", "side": "left", "order": 10, "gpio": 27, "volts": None},
                {"terminal": "gpio14", "label": "GPIO14", "role": "gpio", "side": "left", "order": 11, "gpio": 14, "volts": None},
                {"terminal": "gpio12", "label": "GPIO12", "role": "gpio", "side": "left", "order": 12, "gpio": 12, "volts": None},
                {"terminal": "gpio13", "label": "GPIO13", "role": "gpio", "side": "left", "order": 13, "gpio": 13, "volts": None},
                {"terminal": "gpio15", "label": "GPIO15", "role": "gpio", "side": "left", "order": 14, "gpio": 15, "volts": None},
                {"terminal": "gpio2", "label": "GPIO2", "role": "gpio", "side": "right", "order": 0, "gpio": 2, "volts": None},
                {"terminal": "gpio4", "label": "GPIO4", "role": "gpio", "side": "right", "order": 1, "gpio": 4, "volts": None},
                {"terminal": "gpio16", "label": "GPIO16", "role": "gpio", "side": "right", "order": 2, "gpio": 16, "volts": None},
                {"terminal": "gpio17", "label": "GPIO17", "role": "gpio", "side": "right", "order": 3, "gpio": 17, "volts": None},
                {"terminal": "gpio5", "label": "GPIO5", "role": "gpio", "side": "right", "order": 4, "gpio": 5, "volts": None},
                {"terminal": "gpio18", "label": "GPIO18", "role": "gpio", "side": "right", "order": 5, "gpio": 18, "volts": None},
                {"terminal": "gpio19", "label": "GPIO19", "role": "gpio", "side": "right", "order": 6, "gpio": 19, "volts": None},
                {"terminal": "gpio21", "label": "GPIO21", "role": "gpio", "side": "right", "order": 7, "gpio": 21, "volts": None},
                {"terminal": "gpio22", "label": "GPIO22", "role": "gpio", "side": "right", "order": 8, "gpio": 22, "volts": None},
                {"terminal": "gpio23", "label": "GPIO23", "role": "gpio", "side": "right", "order": 9, "gpio": 23, "volts": None},
                {"terminal": "gpio1", "label": "TX0", "role": "gpio", "side": "right", "order": 10, "gpio": 1, "volts": None},
                {"terminal": "gpio3", "label": "RX0", "role": "gpio", "side": "right", "order": 11, "gpio": 3, "volts": None},
                {"terminal": "gpio0", "label": "GPIO0", "role": "gpio", "side": "right", "order": 12, "gpio": 0, "volts": None},
                {"terminal": "vin", "label": "VIN (5V)", "role": "power", "side": "right", "order": 13, "gpio": None, "volts": 5.0},
                {"terminal": "gnd2", "label": "GND", "role": "ground", "side": "right", "order": 14, "gpio": None, "volts": 0},
            ]
        },
    ),
    dict(
        key="microbit", name="BBC micro:bit", category="board",
        description="Pocket-sized microcontroller with 5x5 LED matrix, motion sensing, Bluetooth, and easy ring pin connectors.",
        model_type="microbit", unit="V", default_value=3.3, terminal_count=5,
        spec={
            "pins": [
                {"terminal": "gnd", "label": "GND", "role": "ground", "xOffset": -0.65, "zOffset": 0.42, "volts": 0},
                {"terminal": "3v", "label": "3V", "role": "power", "xOffset": 0.65, "zOffset": 0.42, "volts": 3.3},
                {"terminal": "p0", "label": "P0", "role": "gpio", "xOffset": -0.32, "zOffset": 0.42, "gpio": 0},
                {"terminal": "p1", "label": "P1", "role": "gpio", "xOffset": 0.0, "zOffset": 0.42, "gpio": 1},
                {"terminal": "p2", "label": "P2", "role": "gpio", "xOffset": 0.32, "zOffset": 0.42, "gpio": 2},
            ]
        },
    ),
    dict(
        key="arduino_uno", name="Arduino Uno R3", category="board",
        description="Classic ATmega328P 8-bit microcontroller board with 14 digital I/O pins, 6 analog inputs, and USB interface — the industry standard for learning electronics.",
        model_type="arduino_uno", unit="V", default_value=5.0, terminal_count=20,
        spec={
            "microcontroller": "ATmega328P", "clock_speed": "16MHz", "flash": "32KB", "operating_voltage": "5V",
            "pins": [
                {"terminal": "5v", "label": "5V", "role": "power", "side": "left", "order": 0, "volts": 5.0, "xOffset": -0.28, "zOffset": 0.2},
                {"terminal": "3v3", "label": "3V3", "role": "power", "side": "left", "order": 1, "volts": 3.3, "xOffset": -0.28, "zOffset": 0.14},
                {"terminal": "gnd1", "label": "GND", "role": "ground", "side": "left", "order": 2, "volts": 0, "xOffset": -0.28, "zOffset": 0.08},
                {"terminal": "gnd2", "label": "GND", "role": "ground", "side": "left", "order": 3, "volts": 0, "xOffset": -0.28, "zOffset": 0.02},
                {"terminal": "vin", "label": "VIN", "role": "power", "side": "left", "order": 4, "volts": 9.0, "xOffset": -0.28, "zOffset": -0.04},
                {"terminal": "a0", "label": "A0", "role": "gpio", "side": "left", "order": 5, "xOffset": -0.28, "zOffset": -0.1},
                {"terminal": "a1", "label": "A1", "role": "gpio", "side": "left", "order": 6, "xOffset": -0.28, "zOffset": -0.16},
                {"terminal": "a2", "label": "A2", "role": "gpio", "side": "left", "order": 7, "xOffset": -0.28, "zOffset": -0.22},
                {"terminal": "d2", "label": "D2", "role": "gpio", "side": "right", "order": 0, "gpio": 2, "xOffset": 0.28, "zOffset": -0.3},
                {"terminal": "d3", "label": "D3 (~PWM)", "role": "gpio", "side": "right", "order": 1, "gpio": 3, "xOffset": 0.28, "zOffset": -0.24},
                {"terminal": "d4", "label": "D4", "role": "gpio", "side": "right", "order": 2, "gpio": 4, "xOffset": 0.28, "zOffset": -0.18},
                {"terminal": "d5", "label": "D5 (~PWM)", "role": "gpio", "side": "right", "order": 3, "gpio": 5, "xOffset": 0.28, "zOffset": -0.12},
                {"terminal": "d6", "label": "D6 (~PWM)", "role": "gpio", "side": "right", "order": 4, "gpio": 6, "xOffset": 0.28, "zOffset": -0.06},
                {"terminal": "d7", "label": "D7", "role": "gpio", "side": "right", "order": 5, "gpio": 7, "xOffset": 0.28, "zOffset": 0.0},
                {"terminal": "d8", "label": "D8", "role": "gpio", "side": "right", "order": 6, "gpio": 8, "xOffset": 0.28, "zOffset": 0.06},
                {"terminal": "d9", "label": "D9 (~PWM)", "role": "gpio", "side": "right", "order": 7, "gpio": 9, "xOffset": 0.28, "zOffset": 0.12},
                {"terminal": "d10", "label": "D10 (~PWM)", "role": "gpio", "side": "right", "order": 8, "gpio": 10, "xOffset": 0.28, "zOffset": 0.18},
                {"terminal": "d11", "label": "D11 (~PWM)", "role": "gpio", "side": "right", "order": 9, "gpio": 11, "xOffset": 0.28, "zOffset": 0.24},
                {"terminal": "d12", "label": "D12", "role": "gpio", "side": "right", "order": 10, "gpio": 12, "xOffset": 0.28, "zOffset": 0.3},
                {"terminal": "d13", "label": "D13 (LED)", "role": "gpio", "side": "right", "order": 11, "gpio": 13, "xOffset": 0.28, "zOffset": 0.36},
            ]
        },
    ),
    dict(
        key="raspberry_pi_pico", name="Raspberry Pi Pico", category="board",
        description="High-performance board powered by RP2040 dual-core ARM Cortex-M0+ processor with flexible digital interfaces.",
        model_type="raspberry_pi_pico", unit="V", default_value=3.3, terminal_count=40,
        spec={
            "processor": "RP2040 Dual-Core 133MHz", "sram": "264KB", "flash": "2MB",
            "pins": [
                {"terminal": "gp0", "label": "GP0 (TX)", "role": "gpio", "side": "left", "order": 0, "gpio": 0, "xOffset": -0.2, "zOffset": -0.34},
                {"terminal": "gp1", "label": "GP1 (RX)", "role": "gpio", "side": "left", "order": 1, "gpio": 1, "xOffset": -0.2, "zOffset": -0.30},
                {"terminal": "gnd1", "label": "GND", "role": "ground", "side": "left", "order": 2, "volts": 0, "xOffset": -0.2, "zOffset": -0.26},
                {"terminal": "gp2", "label": "GP2", "role": "gpio", "side": "left", "order": 3, "gpio": 2, "xOffset": -0.2, "zOffset": -0.22},
                {"terminal": "gp3", "label": "GP3", "role": "gpio", "side": "left", "order": 4, "gpio": 3, "xOffset": -0.2, "zOffset": -0.18},
                {"terminal": "3v3", "label": "3V3 (OUT)", "role": "power", "side": "right", "order": 0, "volts": 3.3, "xOffset": 0.2, "zOffset": -0.34},
                {"terminal": "vbus", "label": "VBUS (5V)", "role": "power", "side": "right", "order": 1, "volts": 5.0, "xOffset": 0.2, "zOffset": -0.30},
                {"terminal": "gnd2", "label": "GND", "role": "ground", "side": "right", "order": 2, "volts": 0, "xOffset": 0.2, "zOffset": -0.26},
                {"terminal": "gp25", "label": "GP25 (LED)", "role": "gpio", "side": "right", "order": 3, "gpio": 25, "xOffset": 0.2, "zOffset": -0.22},
            ]
        },
    ),
    dict(
        key="arduino_nano", name="Arduino Nano", category="board",
        description="Compact breadboard-friendly microcontroller board based on ATmega328P with mini-USB port.",
        model_type="arduino_nano", unit="V", default_value=5.0, terminal_count=30,
        spec={
            "microcontroller": "ATmega328P", "clock_speed": "16MHz", "operating_voltage": "5V",
            "pins": [
                {"terminal": "d1", "label": "TX1", "role": "gpio", "side": "left", "order": 0, "gpio": 1, "xOffset": -0.16, "zOffset": -0.3},
                {"terminal": "d0", "label": "RX0", "role": "gpio", "side": "left", "order": 1, "gpio": 0, "xOffset": -0.16, "zOffset": -0.24},
                {"terminal": "rst", "label": "RESET", "role": "gpio", "side": "left", "order": 2, "xOffset": -0.16, "zOffset": -0.18},
                {"terminal": "gnd1", "label": "GND", "role": "ground", "side": "left", "order": 3, "volts": 0, "xOffset": -0.16, "zOffset": -0.12},
                {"terminal": "d2", "label": "D2", "role": "gpio", "side": "left", "order": 4, "gpio": 2, "xOffset": -0.16, "zOffset": -0.06},
                {"terminal": "d3", "label": "D3 (~PWM)", "role": "gpio", "side": "left", "order": 5, "gpio": 3, "xOffset": -0.16, "zOffset": 0.0},
                {"terminal": "5v", "label": "5V", "role": "power", "side": "right", "order": 0, "volts": 5.0, "xOffset": 0.16, "zOffset": -0.3},
                {"terminal": "3v3", "label": "3V3", "role": "power", "side": "right", "order": 1, "volts": 3.3, "xOffset": 0.16, "zOffset": -0.24},
                {"terminal": "gnd2", "label": "GND", "role": "ground", "side": "right", "order": 2, "volts": 0, "xOffset": 0.16, "zOffset": -0.18},
                {"terminal": "a0", "label": "A0", "role": "gpio", "side": "right", "order": 3, "xOffset": 0.16, "zOffset": -0.12},
            ]
        },
    ),
    dict(
        key="neopixel_ring", name="NeoPixel RGB Ring", category="output",
        description="Circular module with 12 individually addressable RGB LEDs — produce vivid multi-color animations with just one microcontroller data pin.",
        model_type="neopixel_ring", unit="V", default_value=5.0, terminal_count=4,
        spec={
            "led_count": 12,
            "pins": [
                {"terminal": "vcc", "label": "5V / VCC", "role": "power", "xOffset": -0.28, "zOffset": 0.55, "volts": 5.0},
                {"terminal": "din", "label": "DIN (Data In)", "role": "gpio", "xOffset": -0.09, "zOffset": 0.58, "gpio": None},
                {"terminal": "gnd", "label": "GND", "role": "ground", "xOffset": 0.09, "zOffset": 0.58, "volts": 0},
                {"terminal": "dout", "label": "DOUT (Data Out)", "role": "gpio", "xOffset": 0.28, "zOffset": 0.55, "gpio": None},
            ]
        },
    ),
    dict(
        key="stm32", name="STM32 Blue Pill", category="board",
        description="ARM Cortex-M3 32-bit development board featuring STM32F103C8T6 microcontroller with 72MHz clock and dual BOOT jumpers.",
        model_type="stm32", unit="V", default_value=3.3, terminal_count=40,
        spec={
            "microcontroller": "STM32F103C8T6", "core": "ARM Cortex-M3", "clock_speed": "72MHz", "flash": "64KB",
            "pins": [
                {"terminal": "3v3", "label": "3.3V", "role": "power", "side": "left", "order": 0, "volts": 3.3, "xOffset": -0.176, "zOffset": -0.323},
                {"terminal": "gnd1", "label": "GND", "role": "ground", "side": "left", "order": 1, "volts": 0, "xOffset": -0.176, "zOffset": -0.289},
                {"terminal": "pb12", "label": "PB12", "role": "gpio", "side": "left", "order": 2, "gpio": 12, "xOffset": -0.176, "zOffset": -0.255},
                {"terminal": "pb13", "label": "PB13", "role": "gpio", "side": "left", "order": 3, "gpio": 13, "xOffset": -0.176, "zOffset": -0.221},
                {"terminal": "pa8", "label": "PA8", "role": "gpio", "side": "left", "order": 4, "gpio": 8, "xOffset": -0.176, "zOffset": -0.187},
                {"terminal": "pa9", "label": "PA9 (TX1)", "role": "gpio", "side": "left", "order": 5, "gpio": 9, "xOffset": -0.176, "zOffset": -0.153},
                {"terminal": "pa10", "label": "PA10 (RX1)", "role": "gpio", "side": "left", "order": 6, "gpio": 10, "xOffset": -0.176, "zOffset": -0.119},
                {"terminal": "5v", "label": "5V", "role": "power", "side": "right", "order": 0, "volts": 5.0, "xOffset": 0.176, "zOffset": -0.323},
                {"terminal": "gnd2", "label": "GND", "role": "ground", "side": "right", "order": 1, "volts": 0, "xOffset": 0.176, "zOffset": -0.289},
                {"terminal": "pc13", "label": "PC13 (LED)", "role": "gpio", "side": "right", "order": 2, "gpio": 13, "xOffset": 0.176, "zOffset": -0.255},
                {"terminal": "pb0", "label": "PB0", "role": "gpio", "side": "right", "order": 3, "gpio": 0, "xOffset": 0.176, "zOffset": -0.221},
                {"terminal": "pb1", "label": "PB1", "role": "gpio", "side": "right", "order": 4, "gpio": 1, "xOffset": 0.176, "zOffset": -0.187},
            ]
        },
    ),
    dict(
        key="nodemcu", name="NodeMCU ESP8266", category="board",
        description="Open-source Wi-Fi development board built around ESP-12E module with CP2102 USB-to-UART converter.",
        model_type="nodemcu", unit="V", default_value=3.3, terminal_count=30,
        spec={
            "chip": "ESP8266EX", "module": "ESP-12E", "wifi": "802.11 b/g/n", "clock_speed": "80MHz",
            "pins": [
                {"terminal": "3v3", "label": "3V3", "role": "power", "side": "left", "order": 0, "volts": 3.3, "xOffset": -0.217, "zOffset": -0.306},
                {"terminal": "gnd1", "label": "GND", "role": "ground", "side": "left", "order": 1, "volts": 0, "xOffset": -0.217, "zOffset": -0.262},
                {"terminal": "d1", "label": "D1 (GPIO5)", "role": "gpio", "side": "left", "order": 2, "gpio": 5, "xOffset": -0.217, "zOffset": -0.218},
                {"terminal": "d2", "label": "D2 (GPIO4)", "role": "gpio", "side": "left", "order": 3, "gpio": 4, "xOffset": -0.217, "zOffset": -0.174},
                {"terminal": "d3", "label": "D3 (GPIO0)", "role": "gpio", "side": "left", "order": 4, "gpio": 0, "xOffset": -0.217, "zOffset": -0.13},
                {"terminal": "d4", "label": "D4 (LED)", "role": "gpio", "side": "left", "order": 5, "gpio": 2, "xOffset": -0.217, "zOffset": -0.086},
                {"terminal": "vin", "label": "VIN (5V)", "role": "power", "side": "right", "order": 0, "volts": 5.0, "xOffset": 0.217, "zOffset": -0.306},
                {"terminal": "gnd2", "label": "GND", "role": "ground", "side": "right", "order": 1, "volts": 0, "xOffset": 0.217, "zOffset": -0.262},
                {"terminal": "d5", "label": "D5 (SCK)", "role": "gpio", "side": "right", "order": 2, "gpio": 14, "xOffset": 0.217, "zOffset": -0.218},
                {"terminal": "d6", "label": "D6 (MISO)", "role": "gpio", "side": "right", "order": 3, "gpio": 12, "xOffset": 0.217, "zOffset": -0.174},
                {"terminal": "d7", "label": "D7 (MOSI)", "role": "gpio", "side": "right", "order": 4, "gpio": 13, "xOffset": 0.217, "zOffset": -0.13},
                {"terminal": "d8", "label": "D8 (CS)", "role": "gpio", "side": "right", "order": 5, "gpio": 15, "xOffset": 0.217, "zOffset": -0.086},
            ]
        },
    ),

    # ---------------- Power (additional) ----------------
    dict(
        key="coin_cell", name="Coin Cell (CR2032)", category="source",
        description="A small flat 3V lithium battery commonly used to power low-drain circuits like clocks and small sensor boards.",
        model_type="coin_cell", unit="V", default_value=3.0, terminal_count=2,
        spec={"chemistry": "lithium", "size": "CR2032"},
    ),
    dict(
        key="bench_power_supply", name="Bench Power Supply", category="source",
        description="A lab instrument that provides an adjustable, regulated DC voltage — used for testing circuits without a battery.",
        model_type="bench_psu", unit="V", default_value=12.0, terminal_count=2,
        spec={"adjustable": "0-30V", "current_limit": "3A"},
    ),
    dict(
        key="usb_power", name="USB Power", category="source",
        description="A standard USB port supplying a regulated 5V — the most common way to power small microcontroller projects.",
        model_type="usb_power", unit="V", default_value=5.0, terminal_count=2,
        spec={"connector": "USB-A/C"},
    ),

    # ---------------- Diodes (additional) ----------------
    dict(
        key="schottky_diode", name="Schottky Diode", category="active",
        description="A fast-switching diode with a lower forward-voltage drop than a standard silicon diode — common in power supply and protection circuits.",
        model_type="diode", unit="V", default_value=0.3, terminal_count=2,
        spec={"forward_voltage": "0.3V", "type": "fast recovery"},
    ),
    dict(
        key="bridge_rectifier", name="Bridge Rectifier", category="active",
        description="Four diodes arranged to convert AC into pulsing DC — the first stage of most simple power supplies.",
        model_type="bridge_rectifier", unit=None, default_value=None, terminal_count=4,
        spec={"package": "4-pin bridge"},
    ),
    dict(
        key="rgb_led", name="RGB LED", category="active",
        description="An LED with red, green, and blue elements in one package, mixed to produce any color — usually needs a resistor per channel just like a regular LED.",
        model_type="rgb_led", unit="V", default_value=2.0, terminal_count=2,
        spec={"type": "common cathode"},
    ),

    # ---------------- Switches (additional) ----------------
    dict(
        key="rocker_switch", name="Rocker Switch", category="control",
        description="A rectangular rocker-style ON/OFF switch, commonly seen on the back of power supplies and appliances.",
        model_type="rocker_switch", unit=None, default_value=None, terminal_count=2,
        spec={"type": "SPST"},
    ),
    dict(
        key="slide_switch", name="Slide Switch", category="control",
        description="A small switch toggled by sliding a lever from one side to the other — common on battery compartments.",
        model_type="slide_switch", unit=None, default_value=None, terminal_count=2,
        spec={"type": "SPDT"},
    ),

    # ---------------- Sensors (additional) ----------------
    dict(
        key="temperature_sensor", name="Temperature Sensor", category="sensor",
        description="Outputs a voltage or digital signal proportional to temperature — e.g. an LM35 or DS18B20, used to build thermometers and thermostats.",
        model_type="to92_sensor", unit=None, default_value=None, terminal_count=3,
        spec={"package": "TO-92", "type": "e.g. LM35 / DS18B20"},
    ),
    dict(
        key="ultrasonic_sensor", name="Ultrasonic Sensor", category="sensor",
        description="Measures distance by timing an ultrasonic pulse's echo — the classic HC-SR04 module used in robotics for obstacle detection.",
        model_type="ultrasonic_sensor", unit=None, default_value=None, terminal_count=4,
        spec={"range": "2cm - 4m", "type": "HC-SR04"},
    ),
    dict(
        key="ir_sensor", name="IR Sensor", category="sensor",
        description="Detects infrared light — used for line-following robots, remote control receivers, and simple proximity detection.",
        model_type="ir_sensor", unit=None, default_value=None, terminal_count=3,
        spec={"type": "reflective IR pair"},
    ),
    dict(
        key="pir_motion_sensor", name="PIR Motion Sensor", category="sensor",
        description="Detects movement by sensing changes in infrared radiation from warm bodies — the sensor behind most motion-activated lights.",
        model_type="pir_sensor", unit=None, default_value=None, terminal_count=3,
        spec={"range": "~7m", "type": "passive infrared"},
    ),
    dict(
        key="gas_sensor", name="Gas Sensor", category="sensor",
        description="Detects the concentration of gases like smoke, LPG, or CO in the air — commonly an MQ-series module.",
        model_type="gas_sensor", unit=None, default_value=None, terminal_count=4,
        spec={"type": "MQ-series"},
    ),
    dict(
        key="humidity_sensor", name="Humidity Sensor", category="sensor",
        description="Measures relative humidity (and often temperature too) — a DHT11/DHT22 is the classic beginner module for this.",
        model_type="humidity_sensor", unit=None, default_value=None, terminal_count=3,
        spec={"type": "DHT11/DHT22"},
    ),
    dict(
        key="hall_effect_sensor", name="Hall Effect Sensor", category="sensor",
        description="Detects the presence and strength of a magnetic field — used for contactless switches, speed sensing, and position detection.",
        model_type="to92_sensor", unit=None, default_value=None, terminal_count=3,
        spec={"package": "TO-92"},
    ),
    dict(
        key="touch_sensor", name="Touch Sensor", category="sensor",
        description="Detects a touch via capacitive sensing on a small pad — used as a simple button replacement with no moving parts.",
        model_type="touch_sensor", unit=None, default_value=None, terminal_count=3,
        spec={"type": "capacitive"},
    ),

    # ---------------- Logic ICs ----------------
    dict(
        key="logic_and", name="AND Gate IC", category="ic",
        description="Outputs high only when all its inputs are high — a fundamental digital logic building block, typically a 74-series chip.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7408"},
    ),
    dict(
        key="logic_or", name="OR Gate IC", category="ic",
        description="Outputs high when at least one input is high.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7432"},
    ),
    dict(
        key="logic_xor", name="XOR Gate IC", category="ic",
        description="Outputs high only when its inputs differ — used for comparators and parity/adder circuits.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7486"},
    ),
    dict(
        key="logic_nand", name="NAND Gate IC", category="ic",
        description="The inverse of AND — functionally complete, meaning any other logic gate can be built from NAND gates alone.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7400"},
    ),
    dict(
        key="logic_nor", name="NOR Gate IC", category="ic",
        description="The inverse of OR — also functionally complete on its own, like NAND.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7402"},
    ),
    dict(
        key="logic_not", name="NOT Gate IC (Inverter)", category="ic",
        description="Flips its input — high becomes low, low becomes high. The simplest possible logic gate.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7404"},
    ),
    dict(
        key="flip_flop", name="Flip-Flop IC", category="ic",
        description="A basic memory element that stores one bit — the building block of registers, counters, and sequential logic circuits.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=14,
        spec={"package": "DIP-14", "type": "e.g. 7474 D flip-flop"},
    ),

    # ---------------- Displays ----------------
    dict(
        key="seven_segment_display", name="7-Segment Display", category="display",
        description="Seven LED segments arranged to show a single digit (0-9) — the classic display for clocks, counters, and simple readouts.",
        model_type="seven_segment", unit=None, default_value=None, terminal_count=10,
        spec={"digits": 1, "type": "common cathode"},
    ),
    dict(
        key="lcd_display", name="LCD Display (16x2)", category="display",
        description="A character liquid-crystal display, typically 16 columns by 2 rows — a staple for showing readable text output from a project.",
        model_type="lcd_display", unit=None, default_value=None, terminal_count=16,
        spec={"size": "16x2", "backlight": "yes"},
    ),
    dict(
        key="oled_display", name="OLED Display", category="display",
        description="A small, high-contrast pixel display that doesn't need a backlight — common in wearables and compact projects.",
        model_type="oled_display", unit=None, default_value=None, terminal_count=4,
        spec={"size": "0.96 inch", "interface": "I2C"},
    ),
    dict(
        key="led_matrix", name="LED Matrix", category="display",
        description="A grid of individually addressable LEDs used to display simple graphics, scrolling text, or animations.",
        model_type="led_matrix", unit=None, default_value=None, terminal_count=16,
        spec={"size": "8x8"},
    ),

    # ---------------- Outputs (additional) ----------------
    dict(
        key="servo_motor", name="Servo Motor", category="output",
        description="A motor with built-in position control — send it a signal and its shaft moves to (and holds) a specific angle. Common in robotics.",
        model_type="servo_motor", unit="V", default_value=5.0, terminal_count=2,
        spec={"rotation": "0-180°", "control": "PWM"},
    ),
    dict(
        key="stepper_motor", name="Stepper Motor", category="output",
        description="Moves in small, precise steps rather than spinning freely — used wherever exact positioning matters, like 3D printers.",
        model_type="stepper_motor", unit="V", default_value=12.0, terminal_count=2,
        spec={"type": "bipolar", "steps_per_rev": 200},
    ),
    dict(
        key="fan", name="DC Fan", category="output",
        description="A small brushless fan for cooling — spins faster with more applied voltage, just like a DC motor.",
        model_type="fan", unit="V", default_value=12.0, terminal_count=2,
        spec={"type": "brushless"},
    ),

    # ---------------- Miscellaneous ----------------
    dict(
        key="crystal_oscillator", name="Crystal Oscillator", category="passive",
        description="A quartz crystal that vibrates at a precise frequency when powered, giving microcontrollers an accurate clock signal.",
        model_type="crystal_oscillator", unit="MHz", default_value=16, terminal_count=2,
        spec={"frequency": "16MHz"},
    ),
    dict(
        key="ic_socket", name="IC Socket", category="ic",
        description="A socket you solder to a board so a chip can be plugged in and swapped out later, rather than soldered in permanently.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=8,
        spec={"package": "DIP-8"},
    ),
    dict(
        key="breadboard", name="Breadboard", category="passive",
        description="A reusable prototyping board with a grid of connected holes — lets you build and rewire circuits without soldering anything.",
        model_type="breadboard", unit=None, default_value=None, terminal_count=2,
        spec={"tie_points": "830"},
    ),
    dict(
        key="terminal_block", name="Terminal Block", category="passive",
        description="A row of screw terminals for making solid, reusable wire connections without soldering.",
        model_type="terminal_block", unit=None, default_value=None, terminal_count=2,
        spec={"positions": 2},
    ),

    # ---------------- Batch 3: additional components ----------------
    dict(
        key="resistor_variable", name="Trimmer Potentiometer", category="passive",
        description="A small screw-adjustable variable resistor, meant to be tuned once during calibration rather than used as a user control.",
        model_type="potentiometer", unit="kΩ", default_value=10, terminal_count=3,
        spec={"adjustment": "screwdriver trim"},
    ),
    dict(
        key="polyester_capacitor", name="Polyester Film Capacitor", category="passive",
        description="An unpolarized capacitor with stable, low-loss characteristics — common in audio and timing circuits where precision matters more than raw capacitance.",
        model_type="capacitor_ceramic", unit="nF", default_value=100, terminal_count=2,
        spec={"voltage_rating": "63V", "polarized": "no"},
    ),
    dict(
        key="varistor", name="Varistor (MOV)", category="passive",
        description="A voltage-dependent resistor that stays near-infinite resistance until a trigger voltage is exceeded, then conducts heavily — used to clamp voltage spikes and protect circuits.",
        model_type="capacitor_ceramic", unit=None, default_value=None, terminal_count=2,
        spec={"type": "metal oxide varistor"},
    ),
    dict(
        key="ferrite_bead", name="Ferrite Bead", category="passive",
        description="A small bead of ferrite material threaded onto a wire to suppress high-frequency noise, while passing DC and low-frequency signal through freely.",
        model_type="inductor", unit="Ω", default_value=100, terminal_count=2,
        spec={"impedance_at_100MHz": "100Ω"},
    ),
    dict(
        key="jumper_wire", name="Jumper Wire", category="passive",
        description="A pre-terminated wire used for breadboard prototyping — male or female ends for making quick, solderless connections.",
        model_type="wire", unit=None, default_value=None, terminal_count=2,
        spec={"type": "male-male"},
    ),
    dict(
        key="ir_led", name="Infrared LED", category="active",
        description="An LED that emits invisible infrared light instead of visible light — the transmitter half of most remote controls and IR proximity sensors.",
        model_type="led", unit="V", default_value=1.2, terminal_count=2,
        spec={"wavelength": "940nm", "max_current": "20mA"},
    ),
    dict(
        key="laser_diode", name="Laser Diode", category="active",
        description="A diode that emits a coherent, focused beam of light rather than the diffuse glow of an LED — used in laser pointers, barcode scanners, and optical drives.",
        model_type="diode", unit="V", default_value=2.2, terminal_count=2,
        spec={"output_power": "5mW (typical low-power)"},
    ),
    dict(
        key="photodiode", name="Photodiode", category="sensor",
        description="A diode that generates a small current proportional to the light hitting it — the receiving half of IR remotes, and used in light meters and optical sensors.",
        model_type="diode", unit=None, default_value=None, terminal_count=2,
        spec={"type": "PIN photodiode"},
    ),
    dict(
        key="led_strip", name="LED Strip (per segment)", category="output",
        description="A flexible strip of individually-wired LEDs, modeled here as a single lighting segment — used for backlighting and decorative lighting runs.",
        model_type="led", unit="V", default_value=2.0, terminal_count=2,
        spec={"leds_per_meter": 60},
    ),
    dict(
        key="microcontroller_atmega328", name="ATmega328 IC", category="ic",
        description="The bare microcontroller chip at the heart of the Arduino Uno — the same processor, without the board, power regulation, or USB interface around it.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=28,
        spec={"package": "DIP-28", "flash": "32KB"},
    ),
    dict(
        key="eeprom_ic", name="EEPROM IC", category="ic",
        description="Non-volatile memory that retains stored data even with power removed — commonly used to save settings or logs that need to survive a reset.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=8,
        spec={"package": "DIP-8", "capacity": "256Kbit"},
    ),
    dict(
        key="adc_ic", name="ADC IC", category="ic",
        description="An analog-to-digital converter chip — turns a continuously variable voltage into a digital number a microcontroller can read directly.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=8,
        spec={"package": "DIP-8", "resolution": "12-bit"},
    ),
    dict(
        key="accelerometer", name="Accelerometer", category="sensor",
        description="Measures acceleration along one or more axes — used to detect tilt, motion, orientation, and vibration in everything from phones to drones.",
        model_type="ic_dip", unit=None, default_value=None, terminal_count=8,
        spec={"axes": 3, "interface": "I2C"},
    ),
    dict(
        key="lithium_battery", name="18650 Li-ion Cell", category="source",
        description="A rechargeable cylindrical lithium-ion cell, the same form factor used in laptop battery packs, power tools, and many DIY battery builds.",
        model_type="battery_aa", unit="V", default_value=3.7, terminal_count=2,
        spec={"chemistry": "Li-ion", "capacity": "2600mAh (typical)"},
    ),
    dict(
        key="power_bank", name="USB Power Bank", category="source",
        description="A portable rechargeable battery pack with a regulated 5V USB output — a convenient, stable power source for breadboard projects away from a wall outlet.",
        model_type="bench_psu", unit="V", default_value=5.0, terminal_count=2,
        spec={"output": "5V USB", "capacity": "10000mAh (typical)"},
    ),
    dict(
        key="limit_switch", name="Limit Switch", category="control",
        description="A mechanical switch triggered by physical contact with a lever or plunger — used to detect the end of travel on motors, doors, and moving mechanisms.",
        model_type="switch", unit=None, default_value=None, terminal_count=2,
        spec={"type": "normally-open, lever-actuated"},
    ),
    dict(
        key="reed_switch", name="Reed Switch", category="control",
        description="A switch that closes when a magnet passes nearby — the sensor behind most door/window alarm contacts.",
        model_type="switch", unit=None, default_value=None, terminal_count=2,
        spec={"type": "magnetically actuated"},
    ),
    dict(
        key="solenoid", name="Solenoid Actuator", category="output",
        description="An electromagnetic coil that pulls a metal plunger when energized, converting electrical current directly into linear mechanical motion.",
        model_type="dc_motor", unit="V", default_value=12.0, terminal_count=2,
        spec={"stroke": "10mm (typical)"},
    ),
    dict(
        key="vibration_motor", name="Vibration Motor", category="output",
        description="A small DC motor with an off-center weight on its shaft — spins to produce vibration rather than useful rotation, as used in phone haptics.",
        model_type="dc_motor", unit="V", default_value=3.0, terminal_count=2,
        spec={"type": "coin / pager motor"},
    ),
    dict(
        key="rgb_led_display", name="RGB LED Indicator Bar", category="display",
        description="A row of individually addressable RGB LEDs used as a compact status or level indicator, rather than a full pixel display.",
        model_type="led_matrix", unit=None, default_value=None, terminal_count=3,
        spec={"leds": 8},
    ),
    dict(
        key="nixie_tube", name="Nixie Tube", category="display",
        description="A vintage glow-discharge display tube that lights up one glowing digit at a time — the retro numeric display of choice before LEDs took over.",
        model_type="seven_segment", unit=None, default_value=None, terminal_count=11,
        spec={"style": "vintage / retro"},
    ),
    dict(
        key="arduino_mega", name="Arduino Mega 2560", category="board",
        description="A larger Arduino board with far more I/O pins and memory than the Uno — used when a project outgrows the Uno's 14 digital pins.",
        model_type="arduino_mega", unit="V", default_value=5.0, terminal_count=54,
        spec={"microcontroller": "ATmega2560", "digital_pins": 54, "analog_pins": 16},
    ),
    dict(
        key="teensy", name="Teensy 4.0", category="board",
        description="A very small, ultra-fast 600MHz ARM Cortex-M7 microcontroller board — popular for audio and high-speed processing.",
        model_type="teensy", unit="V", default_value=3.3, terminal_count=40,
        spec={"processor": "ARM Cortex-M7", "clock_speed": "600MHz"},
    ),
    dict(
        key="raspberry_pi_4", name="Raspberry Pi 4 Model B", category="board",
        description="Single-board computer featuring a quad-core 64-bit processor, dual micro-HDMI 4K displays, USB 3.0 ports, Gigabit Ethernet, and 40-pin GPIO block.",
        model_type="raspberry_pi_4", unit="V", default_value=5.0, terminal_count=40,
        spec={"processor": "BCM2711 Quad-Core 1.5GHz", "ram": "4GB"},
    ),
    dict(
        key="esp32_cam", name="ESP32-CAM AI-Thinker", category="board",
        description="Compact ESP32 development board featuring an integrated OV2640 camera lens module, MicroSD card slot, and high-power flash LED.",
        model_type="esp32_cam", unit="V", default_value=5.0, terminal_count=16,
        spec={"camera": "OV2640 2MP", "wifi_bluetooth": True},
    ),
    dict(
        key="heat_sink", name="Heat Sink", category="passive",
        description="A finned metal block that draws heat away from a hot component and dissipates it into the surrounding air — a purely thermal, not electrical, part.",
        model_type="relay", unit=None, default_value=None, terminal_count=2,
        spec={"material": "aluminum"},
    ),
    dict(
        key="soil_moisture_sensor", name="Soil Moisture Sensor", category="sensor",
        description="Measures how much moisture is in soil by reading the conductivity between two probes — the core sensor behind most automatic plant-watering projects.",
        model_type="humidity_sensor", unit=None, default_value=None, terminal_count=2,
        spec={"output": "analog"},
    ),
    dict(
        key="flame_sensor", name="Flame Sensor", category="sensor",
        description="Detects the infrared light signature of a flame within a few meters — commonly used in fire-detection and safety-shutoff projects.",
        model_type="humidity_sensor", unit=None, default_value=None, terminal_count=2,
        spec={"range": "~1m"},
    ),
    dict(
        key="water_level_sensor", name="Water Level Sensor", category="sensor",
        description="A row of exposed traces that reads how far up they're submerged in water, giving a rough analog reading of liquid level.",
        model_type="humidity_sensor", unit=None, default_value=None, terminal_count=2,
        spec={"output": "analog"},
    ),
]


def seed_components():
    existing = {c.key: c for c in Component.query.all()}
    for item in CATALOG:
        key = item["key"]
        if key in existing:
            comp = existing[key]
            comp.name = item["name"]
            comp.category = item["category"]
            comp.description = item["description"]
            comp.model_type = item["model_type"]
            comp.unit = item.get("unit")
            comp.default_value = item.get("default_value")
            comp.terminal_count = item.get("terminal_count", 2)
            comp.spec = item.get("spec", {})
        else:
            db.session.add(Component(**item))
    db.session.commit()