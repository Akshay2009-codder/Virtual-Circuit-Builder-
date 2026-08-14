// Default pin definitions for microcontrollers, boards, modules, sensors, ICs, passives, and actuators
// Pre-scaled to match 3D component model geometry on the workbench (SCALE = 0.34).

export const DEFAULT_COMPONENT_PINS = {
  // Boards & Microcontrollers
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

  arduino_uno: [
    // Bottom Power / Analog header row (zOffset: +0.245)
    { terminal: "reset", label: "RESET", role: "gpio", side: "bottom", order: 0, xOffset: -0.161, zOffset: 0.245 },
    { terminal: "3v3", label: "3V3", role: "power", side: "bottom", order: 1, volts: 3.3, xOffset: -0.120, zOffset: 0.245 },
    { terminal: "5v", label: "5V", role: "power", side: "bottom", order: 2, volts: 5.0, xOffset: -0.078, zOffset: 0.245 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "bottom", order: 3, volts: 0, xOffset: -0.036, zOffset: 0.245 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "bottom", order: 4, volts: 0, xOffset: 0.006, zOffset: 0.245 },
    { terminal: "vin", label: "VIN", role: "power", side: "bottom", order: 5, volts: 9.0, xOffset: 0.048, zOffset: 0.245 },
    { terminal: "a0", label: "A0", role: "gpio", side: "bottom", order: 6, xOffset: 0.090, zOffset: 0.245 },
    { terminal: "a1", label: "A1", role: "gpio", side: "bottom", order: 7, xOffset: 0.132, zOffset: 0.245 },
    { terminal: "a2", label: "A2", role: "gpio", side: "bottom", order: 8, xOffset: 0.174, zOffset: 0.245 },
    { terminal: "a3", label: "A3", role: "gpio", side: "bottom", order: 9, xOffset: 0.216, zOffset: 0.245 },
    { terminal: "a4", label: "A4", role: "gpio", side: "bottom", order: 10, xOffset: 0.258, zOffset: 0.245 },
    { terminal: "a5", label: "A5", role: "gpio", side: "bottom", order: 11, xOffset: 0.300, zOffset: 0.245 },

    // Top Digital header row (zOffset: -0.245)
    { terminal: "d0", label: "D0 (RX)", role: "gpio", side: "top", order: 0, gpio: 0, xOffset: 0.300, zOffset: -0.245 },
    { terminal: "d1", label: "D1 (TX)", role: "gpio", side: "top", order: 1, gpio: 1, xOffset: 0.258, zOffset: -0.245 },
    { terminal: "d2", label: "D2", role: "gpio", side: "top", order: 2, gpio: 2, xOffset: 0.216, zOffset: -0.245 },
    { terminal: "d3", label: "D3 (~PWM)", role: "gpio", side: "top", order: 3, gpio: 3, xOffset: 0.174, zOffset: -0.245 },
    { terminal: "d4", label: "D4", role: "gpio", side: "top", order: 4, gpio: 4, xOffset: 0.132, zOffset: -0.245 },
    { terminal: "d5", label: "D5 (~PWM)", role: "gpio", side: "top", order: 5, gpio: 5, xOffset: 0.090, zOffset: -0.245 },
    { terminal: "d6", label: "D6 (~PWM)", role: "gpio", side: "top", order: 6, gpio: 6, xOffset: 0.048, zOffset: -0.245 },
    { terminal: "d7", label: "D7", role: "gpio", side: "top", order: 7, gpio: 7, xOffset: 0.006, zOffset: -0.245 },
    { terminal: "d8", label: "D8", role: "gpio", side: "top", order: 8, gpio: 8, xOffset: -0.036, zOffset: -0.245 },
    { terminal: "d9", label: "D9 (~PWM)", role: "gpio", side: "top", order: 9, gpio: 9, xOffset: -0.078, zOffset: -0.245 },
    { terminal: "d10", label: "D10 (~PWM)", role: "gpio", side: "top", order: 10, gpio: 10, xOffset: -0.120, zOffset: -0.245 },
    { terminal: "d11", label: "D11 (~PWM)", role: "gpio", side: "top", order: 11, gpio: 11, xOffset: -0.162, zOffset: -0.245 },
    { terminal: "d12", label: "D12", role: "gpio", side: "top", order: 12, gpio: 12, xOffset: -0.204, zOffset: -0.245 },
    { terminal: "d13", label: "D13 (LED)", role: "gpio", side: "top", order: 13, gpio: 13, xOffset: -0.246, zOffset: -0.245 },
    { terminal: "gnd3", label: "GND", role: "ground", side: "top", order: 14, volts: 0, xOffset: -0.288, zOffset: -0.245 },

    // Standard two-terminal fallback compatibility
    { terminal: "a", label: "5V / Positive", role: "power", xOffset: -0.078, zOffset: 0.245 },
    { terminal: "b", label: "GND / Negative", role: "ground", xOffset: -0.036, zOffset: 0.245 },
  ],

  raspberry_pi_pico: [
    { terminal: "gp0", label: "GP0 (TX)", role: "gpio", side: "left", order: 0, gpio: 0, xOffset: -0.197, zOffset: -0.34 },
    { terminal: "gp1", label: "GP1 (RX)", role: "gpio", side: "left", order: 1, gpio: 1, xOffset: -0.197, zOffset: -0.30 },
    { terminal: "gnd1", label: "GND", role: "ground", side: "left", order: 2, volts: 0, xOffset: -0.197, zOffset: -0.26 },
    { terminal: "gp2", label: "GP2", role: "gpio", side: "left", order: 3, gpio: 2, xOffset: -0.197, zOffset: -0.22 },
    { terminal: "gp3", label: "GP3", role: "gpio", side: "left", order: 4, gpio: 3, xOffset: -0.197, zOffset: -0.18 },
    { terminal: "gp4", label: "GP4", role: "gpio", side: "left", order: 5, gpio: 4, xOffset: -0.197, zOffset: -0.14 },
    { terminal: "gp5", label: "GP5", role: "gpio", side: "left", order: 6, gpio: 5, xOffset: -0.197, zOffset: -0.10 },
    { terminal: "gnd2", label: "GND", role: "ground", side: "left", order: 7, volts: 0, xOffset: -0.197, zOffset: -0.06 },
    { terminal: "3v3", label: "3V3 (OUT)", role: "power", side: "right", order: 0, volts: 3.3, xOffset: 0.197, zOffset: -0.34 },
    { terminal: "vbus", label: "VBUS (5V)", role: "power", side: "right", order: 1, volts: 5.0, xOffset: 0.197, zOffset: -0.30 },
    { terminal: "gnd3", label: "GND", role: "ground", side: "right", order: 2, volts: 0, xOffset: 0.197, zOffset: -0.26 },
    { terminal: "gp25", label: "GP25 (LED)", role: "gpio", side: "right", order: 3, gpio: 25, xOffset: 0.197, zOffset: -0.22 },
    { terminal: "gp16", label: "GP16", role: "gpio", side: "right", order: 4, gpio: 16, xOffset: 0.197, zOffset: -0.18 },
    { terminal: "a", label: "VBUS (5V)", role: "power", xOffset: 0.197, zOffset: -0.30 },
    { terminal: "b", label: "GND", role: "ground", xOffset: -0.197, zOffset: -0.26 },
  ],

  microbit: [
    { terminal: "gnd", label: "GND", role: "ground", xOffset: -0.272, zOffset: 0.255, volts: 0 },
    { terminal: "p0", label: "P0", role: "gpio", xOffset: -0.136, zOffset: 0.255, gpio: 0 },
    { terminal: "p1", label: "P1", role: "gpio", xOffset: 0.0, zOffset: 0.255, gpio: 1 },
    { terminal: "p2", label: "P2", role: "gpio", xOffset: 0.136, zOffset: 0.255, gpio: 2 },
    { terminal: "3v", label: "3V", role: "power", xOffset: 0.272, zOffset: 0.255, volts: 3.3 },
    { terminal: "a", label: "3V / Positive", role: "power", xOffset: 0.272, zOffset: 0.255 },
    { terminal: "b", label: "GND / Ground", role: "ground", xOffset: -0.272, zOffset: 0.255 },
  ],

  neopixel_ring: [
    { terminal: "vcc", label: "5V / VCC", role: "power", xOffset: -0.095, zOffset: 0.289, volts: 5.0 },
    { terminal: "din", label: "DIN (Data In)", role: "gpio", xOffset: -0.03, zOffset: 0.289, gpio: null },
    { terminal: "gnd", label: "GND", role: "ground", xOffset: 0.03, zOffset: 0.289, volts: 0 },
    { terminal: "dout", label: "DOUT (Data Out)", role: "gpio", xOffset: 0.095, zOffset: 0.289, gpio: null },
    { terminal: "a", label: "VCC (5V)", role: "power", xOffset: -0.095, zOffset: 0.289 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.03, zOffset: 0.289 },
  ],

  oled_display: [
    { terminal: "gnd", label: "GND", role: "ground", side: "top", order: 0, volts: 0, xOffset: -0.153, zOffset: -0.238 },
    { terminal: "vcc", label: "VCC (3.3V/5V)", role: "power", side: "top", order: 1, volts: 3.3, xOffset: -0.051, zOffset: -0.238 },
    { terminal: "scl", label: "SCL (Clock)", role: "gpio", side: "top", order: 2, xOffset: 0.051, zOffset: -0.238 },
    { terminal: "sda", label: "SDA (Data)", role: "gpio", side: "top", order: 3, xOffset: 0.153, zOffset: -0.238 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.051, zOffset: -0.238 },
    { terminal: "b", label: "GND", role: "ground", xOffset: -0.153, zOffset: -0.238 },
  ],

  lcd_display: [
    { terminal: "vss", label: "VSS (GND)", role: "ground", side: "top", order: 0, volts: 0, xOffset: -0.35, zOffset: -0.255 },
    { terminal: "vdd", label: "VDD (5V)", role: "power", side: "top", order: 1, volts: 5.0, xOffset: -0.28, zOffset: -0.255 },
    { terminal: "v0", label: "V0 (Contrast)", role: "gpio", side: "top", order: 2, xOffset: -0.21, zOffset: -0.255 },
    { terminal: "rs", label: "RS", role: "gpio", side: "top", order: 3, xOffset: -0.14, zOffset: -0.255 },
    { terminal: "rw", label: "RW", role: "gpio", side: "top", order: 4, xOffset: -0.07, zOffset: -0.255 },
    { terminal: "e", label: "ENABLE", role: "gpio", side: "top", order: 5, xOffset: 0.0, zOffset: -0.255 },
    { terminal: "d4", label: "D4", role: "gpio", side: "top", order: 6, xOffset: 0.07, zOffset: -0.255 },
    { terminal: "d5", label: "D5", role: "gpio", side: "top", order: 7, xOffset: 0.14, zOffset: -0.255 },
    { terminal: "d6", label: "D6", role: "gpio", side: "top", order: 8, xOffset: 0.21, zOffset: -0.255 },
    { terminal: "d7", label: "D7", role: "gpio", side: "top", order: 9, xOffset: 0.28, zOffset: -0.255 },
    { terminal: "a", label: "LED+", role: "power", side: "top", order: 10, volts: 5.0, xOffset: 0.35, zOffset: -0.255 },
    { terminal: "k", label: "LED-", role: "ground", side: "top", order: 11, volts: 0, xOffset: 0.42, zOffset: -0.255 },
    { terminal: "b", label: "VSS (GND)", role: "ground", xOffset: -0.35, zOffset: -0.255 },
  ],

  ultrasonic_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "bottom", order: 0, volts: 5.0, xOffset: -0.153, zOffset: 0.170 },
    { terminal: "trig", label: "TRIG", role: "gpio", side: "bottom", order: 1, xOffset: -0.051, zOffset: 0.170 },
    { terminal: "echo", label: "ECHO", role: "gpio", side: "bottom", order: 2, xOffset: 0.051, zOffset: 0.170 },
    { terminal: "gnd", label: "GND", role: "ground", side: "bottom", order: 3, volts: 0, xOffset: 0.153, zOffset: 0.170 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.153, zOffset: 0.170 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.153, zOffset: 0.170 },
  ],

  pir_motion_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "bottom", order: 0, volts: 5.0, xOffset: -0.102, zOffset: 0.170 },
    { terminal: "out", label: "OUT", role: "gpio", side: "bottom", order: 1, xOffset: 0.0, zOffset: 0.170 },
    { terminal: "gnd", label: "GND", role: "ground", side: "bottom", order: 2, volts: 0, xOffset: 0.102, zOffset: 0.170 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.102, zOffset: 0.170 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.102, zOffset: 0.170 },
  ],

  humidity_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "bottom", order: 0, volts: 5.0, xOffset: -0.102, zOffset: 0.170 },
    { terminal: "data", label: "DATA", role: "gpio", side: "bottom", order: 1, xOffset: 0.0, zOffset: 0.170 },
    { terminal: "gnd", label: "GND", role: "ground", side: "bottom", order: 2, volts: 0, xOffset: 0.102, zOffset: 0.170 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.102, zOffset: 0.170 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.102, zOffset: 0.170 },
  ],

  // Passives & Discretes (mapped to physical leads)
  resistor: [
    { terminal: "a", label: "Lead 1", role: "gpio", xOffset: -0.357, zOffset: 0.0 },
    { terminal: "b", label: "Lead 2", role: "gpio", xOffset: 0.357, zOffset: 0.0 },
  ],

  led: [
    { terminal: "a", label: "Anode (+)", role: "power", xOffset: -0.048, zOffset: 0.0 },
    { terminal: "b", label: "Cathode (-)", role: "ground", xOffset: 0.048, zOffset: 0.0 },
  ],

  rgb_led: [
    { terminal: "red", label: "Red (+)", role: "power", xOffset: -0.071, zOffset: 0.0 },
    { terminal: "gnd", label: "GND (-)", role: "ground", xOffset: -0.024, zOffset: 0.0, volts: 0 },
    { terminal: "green", label: "Green (+)", role: "power", xOffset: 0.024, zOffset: 0.0 },
    { terminal: "blue", label: "Blue (+)", role: "power", xOffset: 0.071, zOffset: 0.0 },
    { terminal: "a", label: "Red (+)", role: "power", xOffset: -0.071, zOffset: 0.0 },
    { terminal: "b", label: "GND (-)", role: "ground", xOffset: -0.024, zOffset: 0.0 },
  ],

  diode: [
    { terminal: "a", label: "Anode (+)", role: "power", xOffset: -0.289, zOffset: 0.0 },
    { terminal: "b", label: "Cathode (-)", role: "ground", xOffset: 0.289, zOffset: 0.0 },
  ],

  capacitor_electrolytic: [
    { terminal: "a", label: "Anode (+)", role: "power", xOffset: -0.051, zOffset: 0.0 },
    { terminal: "b", label: "Cathode (-)", role: "ground", xOffset: 0.051, zOffset: 0.0 },
  ],

  capacitor_ceramic: [
    { terminal: "a", label: "Lead 1", role: "gpio", xOffset: -0.061, zOffset: 0.0 },
    { terminal: "b", label: "Lead 2", role: "gpio", xOffset: 0.061, zOffset: 0.0 },
  ],

  potentiometer: [
    { terminal: "a", label: "Terminal 1", role: "power", xOffset: -0.102, zOffset: 0.170 },
    { terminal: "wiper", label: "Wiper", role: "gpio", xOffset: 0.0, zOffset: 0.170 },
    { terminal: "b", label: "Terminal 2", role: "ground", xOffset: 0.102, zOffset: 0.170 },
  ],

  transistor: [
    { terminal: "a", label: "Emitter (E)", role: "gpio", xOffset: -0.085, zOffset: 0.041 },
    { terminal: "base", label: "Base (B)", role: "gpio", xOffset: 0.0, zOffset: 0.041 },
    { terminal: "b", label: "Collector (C)", role: "gpio", xOffset: 0.085, zOffset: 0.041 },
  ],

  mosfet: [
    { terminal: "gate", label: "Gate (G)", role: "gpio", xOffset: -0.102, zOffset: 0.054 },
    { terminal: "drain", label: "Drain (D)", role: "gpio", xOffset: 0.0, zOffset: 0.054 },
    { terminal: "source", label: "Source (S)", role: "gpio", xOffset: 0.102, zOffset: 0.054 },
    { terminal: "a", label: "Gate (G)", role: "gpio", xOffset: -0.102, zOffset: 0.054 },
    { terminal: "b", label: "Source (S)", role: "gpio", xOffset: 0.102, zOffset: 0.054 },
  ],

  voltage_regulator: [
    { terminal: "in", label: "IN", role: "power", xOffset: -0.102, zOffset: 0.054 },
    { terminal: "gnd", label: "GND", role: "ground", xOffset: 0.0, zOffset: 0.054, volts: 0 },
    { terminal: "out", label: "OUT", role: "power", xOffset: 0.102, zOffset: 0.054 },
    { terminal: "a", label: "IN", role: "power", xOffset: -0.102, zOffset: 0.054 },
    { terminal: "b", label: "OUT", role: "power", xOffset: 0.102, zOffset: 0.054 },
  ],

  // Integrated Circuits (DIP-8)
  ic_dip: [
    { terminal: "pin1", label: "Pin 1", role: "gpio", xOffset: -0.15, zOffset: 0.126 },
    { terminal: "pin2", label: "Pin 2", role: "gpio", xOffset: -0.05, zOffset: 0.126 },
    { terminal: "pin3", label: "Pin 3", role: "gpio", xOffset: 0.05, zOffset: 0.126 },
    { terminal: "pin4", label: "Pin 4 (GND)", role: "ground", xOffset: 0.15, zOffset: 0.126, volts: 0 },
    { terminal: "pin5", label: "Pin 5", role: "gpio", xOffset: 0.15, zOffset: -0.126 },
    { terminal: "pin6", label: "Pin 6", role: "gpio", xOffset: 0.05, zOffset: -0.126 },
    { terminal: "pin7", label: "Pin 7", role: "gpio", xOffset: -0.05, zOffset: -0.126 },
    { terminal: "pin8", label: "Pin 8 (VCC)", role: "power", xOffset: -0.15, zOffset: -0.126, volts: 5.0 },
    { terminal: "a", label: "Pin 8 (VCC)", role: "power", xOffset: -0.15, zOffset: -0.126 },
    { terminal: "b", label: "Pin 4 (GND)", role: "ground", xOffset: 0.15, zOffset: 0.126 },
  ],

  // Power Sources
  battery_9v: [
    { terminal: "a", label: "POS (+)", role: "power", xOffset: -0.051, zOffset: 0.0, volts: 9.0 },
    { terminal: "b", label: "NEG (-)", role: "ground", xOffset: 0.051, zOffset: 0.0, volts: 0 },
  ],

  battery_aa: [
    { terminal: "a", label: "POS (+)", role: "power", xOffset: 0.214, zOffset: 0.0, volts: 1.5 },
    { terminal: "b", label: "NEG (-)", role: "ground", xOffset: -0.207, zOffset: 0.0, volts: 0 },
  ],

  coin_cell: [
    { terminal: "a", label: "POS (+)", role: "power", xOffset: -0.051, zOffset: 0.0, volts: 3.0 },
    { terminal: "b", label: "NEG (-)", role: "ground", xOffset: 0.051, zOffset: 0.0, volts: 0 },
  ],

  bench_psu: [
    { terminal: "a", label: "POS (+)", role: "power", xOffset: -0.102, zOffset: 0.0, volts: 5.0 },
    { terminal: "b", label: "NEG (-)", role: "ground", xOffset: 0.102, zOffset: 0.0, volts: 0 },
  ],

  // Switches & Actuators
  switch: [
    { terminal: "a", label: "Terminal 1", role: "gpio", xOffset: -0.136, zOffset: 0.0 },
    { terminal: "b", label: "Terminal 2", role: "gpio", xOffset: 0.136, zOffset: 0.0 },
  ],

  push_button: [
    { terminal: "a", label: "Terminal 1A", role: "gpio", xOffset: -0.102, zOffset: -0.102 },
    { terminal: "b", label: "Terminal 1B", role: "gpio", xOffset: 0.102, zOffset: -0.102 },
    { terminal: "c", label: "Terminal 2A", role: "gpio", xOffset: -0.102, zOffset: 0.102 },
    { terminal: "d", label: "Terminal 2B", role: "gpio", xOffset: 0.102, zOffset: 0.102 },
  ],

  relay: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", xOffset: -0.136, zOffset: 0.136, volts: 5.0 },
    { terminal: "gnd", label: "GND", role: "ground", xOffset: -0.044, zOffset: 0.136, volts: 0 },
    { terminal: "in", label: "IN", role: "gpio", xOffset: 0.044, zOffset: 0.136 },
    { terminal: "com", label: "COM", role: "gpio", xOffset: 0.136, zOffset: 0.136 },
    { terminal: "a", label: "VCC (5V)", role: "power", xOffset: -0.136, zOffset: 0.136 },
    { terminal: "b", label: "GND", role: "ground", xOffset: -0.044, zOffset: 0.136 },
  ],

  buzzer: [
    { terminal: "a", label: "POS (+)", role: "power", xOffset: -0.051, zOffset: 0.0 },
    { terminal: "b", label: "NEG (-)", role: "ground", xOffset: 0.051, zOffset: 0.0 },
  ],

  dc_motor: [
    { terminal: "a", label: "Terminal 1", role: "gpio", xOffset: -0.041, zOffset: 0.0 },
    { terminal: "b", label: "Terminal 2", role: "gpio", xOffset: 0.041, zOffset: 0.0 },
  ],

  servo_motor: [
    { terminal: "gnd", label: "GND (Brown)", role: "ground", xOffset: -0.051, zOffset: 0.170, volts: 0 },
    { terminal: "vcc", label: "VCC (Red)", role: "power", xOffset: 0.0, zOffset: 0.170, volts: 5.0 },
    { terminal: "signal", label: "SIGNAL (Orange)", role: "gpio", xOffset: 0.051, zOffset: 0.170 },
    { terminal: "a", label: "VCC (Red)", role: "power", xOffset: 0.0, zOffset: 0.170 },
    { terminal: "b", label: "GND (Brown)", role: "ground", xOffset: -0.051, zOffset: 0.170 },
  ],

  soil_moisture_sensor: [
    { terminal: "vcc", label: "VCC (3.3V/5V)", role: "power", side: "left", order: 0, volts: 3.3, xOffset: -0.1, zOffset: -0.25 },
    { terminal: "gnd", label: "GND", role: "ground", side: "left", order: 1, volts: 0, xOffset: 0.0, zOffset: -0.25 },
    { terminal: "aout", label: "A0 (Signal)", role: "gpio", side: "left", order: 2, xOffset: 0.1, zOffset: -0.25 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.1, zOffset: -0.25 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.0, zOffset: -0.25 },
  ],

  flame_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "left", order: 0, volts: 5.0, xOffset: -0.1, zOffset: 0.25 },
    { terminal: "gnd", label: "GND", role: "ground", side: "left", order: 1, volts: 0, xOffset: 0.0, zOffset: 0.25 },
    { terminal: "dout", label: "D0 (Digital)", role: "gpio", side: "left", order: 2, xOffset: 0.1, zOffset: 0.25 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.1, zOffset: 0.25 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.0, zOffset: 0.25 },
  ],

  water_level_sensor: [
    { terminal: "vcc", label: "VCC (5V)", role: "power", side: "left", order: 0, volts: 5.0, xOffset: -0.1, zOffset: -0.35 },
    { terminal: "gnd", label: "GND", role: "ground", side: "left", order: 1, volts: 0, xOffset: 0.0, zOffset: -0.35 },
    { terminal: "sig", label: "S (Signal)", role: "gpio", side: "left", order: 2, xOffset: 0.1, zOffset: -0.35 },
    { terminal: "a", label: "VCC", role: "power", xOffset: -0.1, zOffset: -0.35 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.0, zOffset: -0.35 },
  ],

  nixie_tube: [
    { terminal: "anode", label: "Anode (+170V)", role: "power", side: "left", order: 0, volts: 170.0, xOffset: -0.15, zOffset: 0.1 },
    { terminal: "gnd", label: "GND", role: "ground", side: "right", order: 0, volts: 0, xOffset: 0.15, zOffset: 0.1 },
    { terminal: "a", label: "Anode (+170V)", role: "power", xOffset: -0.15, zOffset: 0.1 },
    { terminal: "b", label: "GND", role: "ground", xOffset: 0.15, zOffset: 0.1 },
  ],

  heat_sink: [
    { terminal: "tab1", label: "Mount 1", role: "ground", side: "left", order: 0, volts: 0, xOffset: -0.2, zOffset: 0.0 },
    { terminal: "tab2", label: "Mount 2", role: "ground", side: "right", order: 0, volts: 0, xOffset: 0.2, zOffset: 0.0 },
    { terminal: "a", label: "Mount 1", role: "ground", xOffset: -0.2, zOffset: 0.0 },
    { terminal: "b", label: "Mount 2", role: "ground", xOffset: 0.2, zOffset: 0.0 },
  ],
};

// Aliases mapping component variants to primary specs
DEFAULT_COMPONENT_PINS.uno = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.arduino = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.mega = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.arduino_mega = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.arduino_mega_2560 = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.pico = DEFAULT_COMPONENT_PINS.raspberry_pi_pico;
DEFAULT_COMPONENT_PINS.nano = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.arduino_nano = DEFAULT_COMPONENT_PINS.arduino_uno;
DEFAULT_COMPONENT_PINS.stm32 = DEFAULT_COMPONENT_PINS.esp32;
DEFAULT_COMPONENT_PINS.stm32_blue_pill = DEFAULT_COMPONENT_PINS.esp32;
DEFAULT_COMPONENT_PINS.esp8266 = DEFAULT_COMPONENT_PINS.esp32;
DEFAULT_COMPONENT_PINS.nodemcu = DEFAULT_COMPONENT_PINS.esp32;
DEFAULT_COMPONENT_PINS.rpi4 = DEFAULT_COMPONENT_PINS.raspberry_pi_pico;
DEFAULT_COMPONENT_PINS.raspberry_pi_4 = DEFAULT_COMPONENT_PINS.raspberry_pi_pico;
DEFAULT_COMPONENT_PINS.esp32_cam = DEFAULT_COMPONENT_PINS.esp32;
DEFAULT_COMPONENT_PINS.teensy = DEFAULT_COMPONENT_PINS.esp32;

// IC & Sensor Aliases
DEFAULT_COMPONENT_PINS.ic_555 = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.ic_opamp = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.logic_and = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.logic_or = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.logic_xor = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.logic_nand = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.logic_nor = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.logic_not = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.flip_flop = DEFAULT_COMPONENT_PINS.ic_dip;
DEFAULT_COMPONENT_PINS.microcontroller_atmega328 = DEFAULT_COMPONENT_PINS.ic_dip;

DEFAULT_COMPONENT_PINS.pir_sensor = DEFAULT_COMPONENT_PINS.pir_motion_sensor;
DEFAULT_COMPONENT_PINS.dht11 = DEFAULT_COMPONENT_PINS.humidity_sensor;
DEFAULT_COMPONENT_PINS.servo = DEFAULT_COMPONENT_PINS.servo_motor;
DEFAULT_COMPONENT_PINS.resistor_variable = DEFAULT_COMPONENT_PINS.potentiometer;
DEFAULT_COMPONENT_PINS.ir_led = DEFAULT_COMPONENT_PINS.led;
DEFAULT_COMPONENT_PINS.laser_diode = DEFAULT_COMPONENT_PINS.led;
DEFAULT_COMPONENT_PINS.zener_diode = DEFAULT_COMPONENT_PINS.diode;
DEFAULT_COMPONENT_PINS.schottky_diode = DEFAULT_COMPONENT_PINS.diode;

DEFAULT_COMPONENT_PINS.lithium_battery = DEFAULT_COMPONENT_PINS.battery_aa;
DEFAULT_COMPONENT_PINS.power_bank = DEFAULT_COMPONENT_PINS.bench_psu;
DEFAULT_COMPONENT_PINS.usb_power = DEFAULT_COMPONENT_PINS.bench_psu;
DEFAULT_COMPONENT_PINS.limit_switch = DEFAULT_COMPONENT_PINS.switch;
DEFAULT_COMPONENT_PINS.reed_switch = DEFAULT_COMPONENT_PINS.switch;
DEFAULT_COMPONENT_PINS.rocker_switch = DEFAULT_COMPONENT_PINS.switch;
DEFAULT_COMPONENT_PINS.slide_switch = DEFAULT_COMPONENT_PINS.switch;
DEFAULT_COMPONENT_PINS.dip_switch = DEFAULT_COMPONENT_PINS.push_button;

DEFAULT_COMPONENT_PINS.solenoid = DEFAULT_COMPONENT_PINS.dc_motor;
DEFAULT_COMPONENT_PINS.vibration_motor = DEFAULT_COMPONENT_PINS.dc_motor;
DEFAULT_COMPONENT_PINS.speaker = DEFAULT_COMPONENT_PINS.buzzer;

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

// Guarantees fully resolved pin objects with explicit numeric xOffset and zOffset matching 3D geometry
export function getResolvedPins(node) {
  if (!node) return [];
  const defaultPins =
    DEFAULT_COMPONENT_PINS[node.key] ||
    DEFAULT_COMPONENT_PINS[node.modelType] ||
    DEFAULT_COMPONENT_PINS[node.category] ||
    [];

  if (defaultPins.length > 0) {
    const rawPins = Array.isArray(node.pins) && node.pins.length > 0 ? node.pins : defaultPins;
    return defaultPins.map((defPin, idx) => {
      const termLower = String(defPin.terminal || "").toLowerCase();
      const raw =
        rawPins.find((p) => String(p.terminal || "").toLowerCase() === termLower) ||
        rawPins.find((p) => String(p.label || "").toLowerCase().includes(termLower)) ||
        rawPins[idx] ||
        defPin;

      return {
        ...raw,
        terminal: defPin.terminal || raw.terminal,
        label: defPin.label || raw.label,
        role: defPin.role || raw.role,
        xOffset: defPin.xOffset,
        zOffset: defPin.zOffset,
      };
    });
  }

  // Fallback for custom nodes with no DEFAULT_COMPONENT_PINS entry
  const rawPins = Array.isArray(node.pins) ? node.pins : [];
  return rawPins.map((p, idx) => {
    const side = p.side || (idx % 2 === 0 ? "left" : "right");
    const count = rawPins.length;
    const zOffset = typeof p.zOffset === "number" ? p.zOffset : (idx - (count - 1) / 2) * 0.051;
    const xOffset = typeof p.xOffset === "number" ? p.xOffset : side === "left" ? -0.255 : 0.255;
    return { ...p, xOffset, zOffset };
  });
}

// Calculates exact 3D world coordinates [x, y, z] for a component terminal
export function getTerminalWorldPos(node, terminal, isLifted = false) {
  if (!node) return [0, 0.132, 0];

  const baseHeight = isLifted ? 0.252 : 0.132;
  const pins = getResolvedPins(node);

  if (pins.length > 0) {
    const termLower = String(terminal || "").toLowerCase();

    // 1. Exact match by terminal key
    let pin = pins.find((p) => String(p.terminal).toLowerCase() === termLower);

    // 2. Case-insensitive match by label
    if (!pin) {
      pin = pins.find((p) => String(p.label || "").toLowerCase().includes(termLower));
    }

    // 3. Polarized / two-terminal aliases
    if (!pin) {
      if (["a", "pos", "positive", "vcc", "pin1", "1", "anode", "in", "input"].includes(termLower)) {
        pin = pins[0];
      } else if (["b", "neg", "negative", "gnd", "ground", "pin2", "2", "cathode", "out", "output"].includes(termLower)) {
        pin = pins[pins.length - 1];
      }
    }

    // 4. Fallback to first pin
    if (!pin) pin = pins[0];

    const nx = Number.isFinite(node.x) ? node.x : 0;
    const nz = Number.isFinite(node.z) ? node.z : 0;
    return [nx + (pin.xOffset || 0), baseHeight, nz + (pin.zOffset || 0)];
  }

  // Absolute fallback
  const t = String(terminal || "").toLowerCase();
  const isLeft = ["a", "pos", "positive", "vcc", "pin1", "1", "anode", "in", "input"].includes(t);
  const isRight = ["b", "neg", "negative", "gnd", "ground", "pin2", "2", "cathode", "out", "output"].includes(t);

  const xOffset = isLeft ? -0.19 : isRight ? 0.19 : 0;
  const nx = Number.isFinite(node.x) ? node.x : 0;
  const nz = Number.isFinite(node.z) ? node.z : 0;
  return [nx + xOffset, baseHeight, nz];
}

