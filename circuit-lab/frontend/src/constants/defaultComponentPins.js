// Default pin definitions for microcontrollers, boards, modules, and sensors
// Pre-scaled to match 3D component model geometry on the workbench.

export const DEFAULT_COMPONENT_PINS = {
  esp32: [
    { terminal: "3v3", label: "3V3", role: "power", side: "left", order: 0, gpio: null, volts: 3.3, xOffset: -0.255, zOffset: -0.357 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 1, gpio: null, volts: 0, xOffset: -0.255, zOffset: -0.306 },
    { terminal: "gpio36", label: "GPIO36", role: "gpio", side: "left", order: 2, gpio: 36, volts: null, xOffset: -0.255, zOffset: -0.255 },
    { terminal: "gpio39", label: "GPIO39", role: "gpio", side: "left", order: 3, gpio: 39, volts: null, xOffset: -0.255, zOffset: -0.204 },
    { terminal: "gpio34", label: "GPIO34", role: "gpio", side: "left", order: 4, gpio: 34, volts: null, xOffset: -0.255, zOffset: -0.153 },
    { terminal: "gpio35", label: "GPIO35", role: "gpio", side: "left", order: 5, gpio: 35, volts: null, xOffset: -0.255, zOffset: -0.102 },
    { terminal: "gpio32", label: "GPIO32", role: "gpio", side: "left", order: 6, gpio: 32, volts: null, xOffset: -0.255, zOffset: -0.051 },
    { terminal: "gpio33", label: "GPIO33", role: "gpio", side: "left", order: 7, gpio: 33, volts: null, xOffset: -0.255, zOffset: 0.0 },
    { terminal: "gpio25", label: "GPIO25", role: "gpio", side: "left", order: 8, gpio: 25, volts: null, xOffset: -0.255, zOffset: 0.051 },
    { terminal: "gpio26", label: "GPIO26", role: "gpio", side: "left", order: 9, gpio: 26, volts: null, xOffset: -0.255, zOffset: 0.102 },
    { terminal: "gpio27", label: "GPIO27", role: "gpio", side: "left", order: 10, gpio: 27, volts: null, xOffset: -0.255, zOffset: 0.153 },
    { terminal: "gpio14", label: "GPIO14", role: "gpio", side: "left", order: 11, gpio: 14, volts: null, xOffset: -0.255, zOffset: 0.204 },
    { terminal: "gpio12", label: "GPIO12", role: "gpio", side: "left", order: 12, gpio: 12, volts: null, xOffset: -0.255, zOffset: 0.255 },
    { terminal: "gpio13", label: "GPIO13", role: "gpio", side: "left", order: 13, gpio: 13, volts: null, xOffset: -0.255, zOffset: 0.306 },
    { terminal: "gpio15", label: "GPIO15", role: "gpio", side: "left", order: 14, gpio: 15, volts: null, xOffset: -0.255, zOffset: 0.357 },
    { terminal: "gpio2", label: "GPIO2", role: "gpio", side: "right", order: 0, gpio: 2, volts: null, xOffset: 0.255, zOffset: -0.357 },
    { terminal: "gpio4", label: "GPIO4", role: "gpio", side: "right", order: 1, gpio: 4, volts: null, xOffset: 0.255, zOffset: -0.306 },
    { terminal: "gpio16", label: "GPIO16", role: "gpio", side: "right", order: 2, gpio: 16, volts: null, xOffset: 0.255, zOffset: -0.255 },
    { terminal: "gpio17", label: "GPIO17", role: "gpio", side: "right", order: 3, gpio: 17, volts: null, xOffset: 0.255, zOffset: -0.204 },
    { terminal: "gpio5", label: "GPIO5", role: "gpio", side: "right", order: 4, gpio: 5, volts: null, xOffset: 0.255, zOffset: -0.153 },
    { terminal: "gpio18", label: "GPIO18", role: "gpio", side: "right", order: 5, gpio: 18, volts: null, xOffset: 0.255, zOffset: -0.102 },
    { terminal: "gpio19", label: "GPIO19", role: "gpio", side: "right", order: 6, gpio: 19, volts: null, xOffset: 0.255, zOffset: -0.051 },
    { terminal: "gpio21", label: "GPIO21", role: "gpio", side: "right", order: 7, gpio: 21, volts: null, xOffset: 0.255, zOffset: 0.0 },
    { terminal: "gpio22", label: "GPIO22", role: "gpio", side: "right", order: 8, gpio: 22, volts: null, xOffset: 0.255, zOffset: 0.051 },
    { terminal: "gpio23", label: "GPIO23", role: "gpio", side: "right", order: 9, gpio: 23, volts: null, xOffset: 0.255, zOffset: 0.102 },
    { terminal: "gpio1", label: "TX0", role: "gpio", side: "right", order: 10, gpio: 1, volts: null, xOffset: 0.255, zOffset: 0.153 },
    { terminal: "gpio3", label: "RX0", role: "gpio", side: "right", order: 11, gpio: 3, volts: null, xOffset: 0.255, zOffset: 0.204 },
    { terminal: "gpio0", label: "GPIO0", role: "gpio", side: "right", order: 12, gpio: 0, volts: null, xOffset: 0.255, zOffset: 0.255 },
    { terminal: "vin", label: "VIN (5V)", role: "power", side: "right", order: 13, gpio: null, volts: 5.0, xOffset: 0.255, zOffset: 0.306 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "right", order: 14, gpio: null, volts: 0, xOffset: 0.255, zOffset: 0.357 },
  ],

  microbit: [
    { terminal: "gnd", label: "GND", role: "ground", xOffset: -0.272, zOffset: 0.255, volts: 0 },
    { terminal: "p0", label: "P0", role: "gpio", xOffset: -0.136, zOffset: 0.255, gpio: 0 },
    { terminal: "p1", label: "P1", role: "gpio", xOffset: 0.0, zOffset: 0.255, gpio: 1 },
    { terminal: "p2", label: "P2", role: "gpio", xOffset: 0.136, zOffset: 0.255, gpio: 2 },
    { terminal: "3v", label: "3V", role: "power", xOffset: 0.272, zOffset: 0.255, volts: 3.3 },
  ],

  neopixel_ring: [
    { terminal: "vcc", label: "5V / VCC", role: "power", xOffset: -0.095, zOffset: 0.289, volts: 5.0 },
    { terminal: "din", label: "DIN (Data In)", role: "gpio", xOffset: -0.03, zOffset: 0.289, gpio: null },
    { terminal: "gnd", label: "GND", role: "ground", xOffset: 0.03, zOffset: 0.289, volts: 0 },
    { terminal: "dout", label: "DOUT (Data Out)", role: "gpio", xOffset: 0.095, zOffset: 0.289, gpio: null },
  ],

  oled_display: [
    { terminal: "gnd", label: "GND", role: "ground", side: "left", order: 0, volts: 0, xOffset: -0.15, zOffset: -0.3 },
    { terminal: "vcc", label: "VCC (3.3V/5V)", role: "power", side: "left", order: 1, volts: 3.3, xOffset: -0.05, zOffset: -0.3 },
    { terminal: "scl", label: "SCL (Clock)", role: "gpio", side: "left", order: 2, xOffset: 0.05, zOffset: -0.3 },
    { terminal: "sda", label: "SDA (Data)", role: "gpio", side: "left", order: 3, xOffset: 0.15, zOffset: -0.3 },
  ],

  ultrasonic_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "left", order: 0, volts: 5.0, xOffset: -0.15, zOffset: 0.25 },
    { terminal: "trig", label: "TRIG", role: "gpio", side: "left", order: 1, xOffset: -0.05, zOffset: 0.25 },
    { terminal: "echo", label: "ECHO", role: "gpio", side: "left", order: 2, xOffset: 0.05, zOffset: 0.25 },
    { terminal: "gnd", label: "GND", role: "ground", side: "left", order: 3, volts: 0, xOffset: 0.15, zOffset: 0.25 },
  ],

  pir_motion_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "left", order: 0, volts: 5.0, xOffset: -0.1, zOffset: 0.25 },
    { terminal: "out", label: "OUT", role: "gpio", side: "left", order: 1, xOffset: 0.0, zOffset: 0.25 },
    { terminal: "gnd", label: "GND", role: "ground", side: "left", order: 2, volts: 0, xOffset: 0.1, zOffset: 0.25 },
  ],

  arduino_uno: [
    { terminal: "5v", label: "5V", role: "power", side: "left", order: 0, volts: 5.0, xOffset: -0.28, zOffset: 0.2 },
    { terminal: "3v3", label: "3V3", role: "power", side: "left", order: 1, volts: 3.3, xOffset: -0.28, zOffset: 0.14 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 2, volts: 0, xOffset: -0.28, zOffset: 0.08 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "left", order: 3, volts: 0, xOffset: -0.28, zOffset: 0.02 },
    { terminal: "vin", label: "VIN", role: "power", side: "left", order: 4, xOffset: -0.28, zOffset: -0.04 },
    { terminal: "a0", label: "A0", role: "gpio", side: "left", order: 5, xOffset: -0.28, zOffset: -0.1 },
    { terminal: "a1", label: "A1", role: "gpio", side: "left", order: 6, xOffset: -0.28, zOffset: -0.16 },
    { terminal: "a2", label: "A2", role: "gpio", side: "left", order: 7, xOffset: -0.28, zOffset: -0.22 },
    { terminal: "d2", label: "D2", role: "gpio", side: "right", order: 0, gpio: 2, xOffset: 0.28, zOffset: -0.3 },
    { terminal: "d3", label: "D3 (~PWM)", role: "gpio", side: "right", order: 1, gpio: 3, xOffset: 0.28, zOffset: -0.24 },
    { terminal: "d4", label: "D4", role: "gpio", side: "right", order: 2, gpio: 4, xOffset: 0.28, zOffset: -0.18 },
    { terminal: "d5", label: "D5 (~PWM)", role: "gpio", side: "right", order: 3, gpio: 5, xOffset: 0.28, zOffset: -0.12 },
    { terminal: "d6", label: "D6 (~PWM)", role: "gpio", side: "right", order: 4, gpio: 6, xOffset: 0.28, zOffset: -0.06 },
    { terminal: "d7", label: "D7", role: "gpio", side: "right", order: 5, gpio: 7, xOffset: 0.28, zOffset: 0.0 },
    { terminal: "d8", label: "D8", role: "gpio", side: "right", order: 6, gpio: 8, xOffset: 0.28, zOffset: 0.06 },
    { terminal: "d9", label: "D9 (~PWM)", role: "gpio", side: "right", order: 7, gpio: 9, xOffset: 0.28, zOffset: 0.12 },
    { terminal: "d10", label: "D10 (~PWM)", role: "gpio", side: "right", order: 8, gpio: 10, xOffset: 0.28, zOffset: 0.18 },
    { terminal: "d11", label: "D11 (~PWM)", role: "gpio", side: "right", order: 9, gpio: 11, xOffset: 0.28, zOffset: 0.24 },
    { terminal: "d12", label: "D12", role: "gpio", side: "right", order: 10, gpio: 12, xOffset: 0.28, zOffset: 0.3 },
    { terminal: "d13", label: "D13 (LED)", role: "gpio", side: "right", order: 11, gpio: 13, xOffset: 0.28, zOffset: 0.36 },
  ],

  raspberry_pi_pico: [
    { terminal: "gp0", label: "GP0 (TX)", role: "gpio", side: "left", order: 0, gpio: 0, xOffset: -0.2, zOffset: -0.34 },
    { terminal: "gp1", label: "GP1 (RX)", role: "gpio", side: "left", order: 1, gpio: 1, xOffset: -0.2, zOffset: -0.30 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 2, volts: 0, xOffset: -0.2, zOffset: -0.26 },
    { terminal: "gp2", label: "GP2", role: "gpio", side: "left", order: 3, gpio: 2, xOffset: -0.2, zOffset: -0.22 },
    { terminal: "gp3", label: "GP3", role: "gpio", side: "left", order: 4, gpio: 3, xOffset: -0.2, zOffset: -0.18 },
    { terminal: "3v3", label: "3V3 (OUT)", role: "power", side: "right", order: 0, volts: 3.3, xOffset: 0.2, zOffset: -0.34 },
    { terminal: "vbus", label: "VBUS (5V)", role: "power", side: "right", order: 1, volts: 5.0, xOffset: 0.2, zOffset: -0.30 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "right", order: 2, volts: 0, xOffset: 0.2, zOffset: -0.26 },
    { terminal: "gp25", label: "GP25 (LED)", role: "gpio", side: "right", order: 3, gpio: 25, xOffset: 0.2, zOffset: -0.22 },
  ],

  arduino_nano: [
    { terminal: "d1", label: "TX1", role: "gpio", side: "left", order: 0, gpio: 1, xOffset: -0.16, zOffset: -0.3 },
    { terminal: "d0", label: "RX0", role: "gpio", side: "left", order: 1, gpio: 0, xOffset: -0.16, zOffset: -0.24 },
    { terminal: "rst", label: "RESET", role: "gpio", side: "left", order: 2, xOffset: -0.16, zOffset: -0.18 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 3, volts: 0, xOffset: -0.16, zOffset: -0.12 },
    { terminal: "d2", label: "D2", role: "gpio", side: "left", order: 4, gpio: 2, xOffset: -0.16, zOffset: -0.06 },
    { terminal: "d3", label: "D3 (~PWM)", role: "gpio", side: "left", order: 5, gpio: 3, xOffset: -0.16, zOffset: 0.0 },
    { terminal: "5v", label: "5V", role: "power", side: "right", order: 0, volts: 5.0, xOffset: 0.16, zOffset: -0.3 },
    { terminal: "3v3", label: "3V3", role: "power", side: "right", order: 1, volts: 3.3, xOffset: 0.16, zOffset: -0.24 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "right", order: 2, volts: 0, xOffset: 0.16, zOffset: -0.18 },
    { terminal: "a0", label: "A0", role: "gpio", side: "right", order: 3, xOffset: 0.16, zOffset: -0.12 },
  ],

  stm32: [
    { terminal: "3v3", label: "3.3V", role: "power", side: "left", order: 0, volts: 3.3, xOffset: -0.176, zOffset: -0.323 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 1, volts: 0, xOffset: -0.176, zOffset: -0.289 },
    { terminal: "pb12", label: "PB12", role: "gpio", side: "left", order: 2, gpio: 12, xOffset: -0.176, zOffset: -0.255 },
    { terminal: "pb13", label: "PB13", role: "gpio", side: "left", order: 3, gpio: 13, xOffset: -0.176, zOffset: -0.221 },
    { terminal: "pa8", label: "PA8", role: "gpio", side: "left", order: 4, gpio: 8, xOffset: -0.176, zOffset: -0.187 },
    { terminal: "pa9", label: "PA9 (TX1)", role: "gpio", side: "left", order: 5, gpio: 9, xOffset: -0.176, zOffset: -0.153 },
    { terminal: "pa10", label: "PA10 (RX1)", role: "gpio", side: "left", order: 6, gpio: 10, xOffset: -0.176, zOffset: -0.119 },
    { terminal: "5v", label: "5V", role: "power", side: "right", order: 0, volts: 5.0, xOffset: 0.176, zOffset: -0.323 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "right", order: 1, volts: 0, xOffset: 0.176, zOffset: -0.289 },
    { terminal: "pc13", label: "PC13 (LED)", role: "gpio", side: "right", order: 2, gpio: 13, xOffset: 0.176, zOffset: -0.255 },
    { terminal: "pb0", label: "PB0", role: "gpio", side: "right", order: 3, gpio: 0, xOffset: 0.176, zOffset: -0.221 },
    { terminal: "pb1", label: "PB1", role: "gpio", side: "right", order: 4, gpio: 1, xOffset: 0.176, zOffset: -0.187 },
  ],

  nodemcu: [
    { terminal: "3v3", label: "3V3", role: "power", side: "left", order: 0, volts: 3.3, xOffset: -0.217, zOffset: -0.306 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 1, volts: 0, xOffset: -0.217, zOffset: -0.262 },
    { terminal: "d1", label: "D1 (GPIO5)", role: "gpio", side: "left", order: 2, gpio: 5, xOffset: -0.217, zOffset: -0.218 },
    { terminal: "d2", label: "D2 (GPIO4)", role: "gpio", side: "left", order: 3, gpio: 4, xOffset: -0.217, zOffset: -0.174 },
    { terminal: "d3", label: "D3 (GPIO0)", role: "gpio", side: "left", order: 4, gpio: 0, xOffset: -0.217, zOffset: -0.13 },
    { terminal: "d4", label: "D4 (LED)", role: "gpio", side: "left", order: 5, gpio: 2, xOffset: -0.217, zOffset: -0.086 },
    { terminal: "vin", label: "VIN (5V)", role: "power", side: "right", order: 0, volts: 5.0, xOffset: 0.217, zOffset: -0.306 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "right", order: 1, volts: 0, xOffset: 0.217, zOffset: -0.262 },
    { terminal: "d5", label: "D5 (SCK)", role: "gpio", side: "right", order: 2, gpio: 14, xOffset: 0.217, zOffset: -0.218 },
    { terminal: "d6", label: "D6 (MISO)", role: "gpio", side: "right", order: 3, gpio: 12, xOffset: 0.217, zOffset: -0.174 },
    { terminal: "d7", label: "D7 (MOSI)", role: "gpio", side: "right", order: 4, gpio: 13, xOffset: 0.217, zOffset: -0.13 },
    { terminal: "d8", label: "D8 (CS)", role: "gpio", side: "right", order: 5, gpio: 15, xOffset: 0.217, zOffset: -0.086 },
  ],
};

DEFAULT_COMPONENT_PINS.uno = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.pico = DEFAULT_COMPONENT_PINS.raspberry_pi_pico;
DEFAULT_COMPONENT_PINS.nano = DEFAULT_COMPONENT_PINS.arduino_nano;
DEFAULT_COMPONENT_PINS.stm32_blue_pill = DEFAULT_COMPONENT_PINS.stm32;
DEFAULT_COMPONENT_PINS.esp8266 = DEFAULT_COMPONENT_PINS.nodemcu;

// Returns default pin role color
export function getPinRoleColor(role, defaultColor = "#45d8c4") {
  if (role === "power") return "#ff4757"; // bright red
  if (role === "ground") return "#2f3542"; // dark carbon/black
  if (role === "gpio") return "#2ed573"; // vibrant signal green
  return defaultColor;
}

// Determines default wire color based on source/target terminal roles or labels
export function getWireAutoColor(terminalRole, terminalLabel = "") {
  const lbl = (terminalLabel || "").toLowerCase();
  if (terminalRole === "power" || lbl.includes("vcc") || lbl.includes("5v") || lbl.includes("3v3") || lbl.includes("vin") || lbl.includes("3v")) {
    return "#ff3838"; // Red wire for power
  }
  if (terminalRole === "ground" || lbl.includes("gnd") || lbl.includes("ground")) {
    return "#1e272e"; // Dark blue-black wire for GND
  }
  if (lbl.includes("din") || lbl.includes("data") || lbl.includes("p0") || lbl.includes("gpio2")) {
    return "#2ed573"; // Neon green wire for data
  }
  if (lbl.includes("clk") || lbl.includes("scl") || lbl.includes("p1")) {
    return "#ffa801"; // Amber wire for clock / P1
  }
  if (lbl.includes("sda") || lbl.includes("rx") || lbl.includes("p2")) {
    return "#1e90ff"; // Blue wire for serial / P2
  }
  return "#00d2d3"; // Cyan wire default
}
