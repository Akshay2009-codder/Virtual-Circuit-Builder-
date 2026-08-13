# Changelog

All notable changes to the Virtual Circuit Builder project will be documented in this file.

## [v1.3.0] - 2026-08-12

### Added
- **Photo-Realistic 3D Development Boards**: Replaced generic fallback renderings with authentic, individual 3D visual models for **Arduino Uno R3**, **Raspberry Pi Pico**, **Arduino Nano**, **STM32 Blue Pill**, **NodeMCU ESP8266**, **ESP32 Dev Board**, **BBC micro:bit**, and **NeoPixel RGB Ring**.
- **Distinct PCB & Geometry Design**: Modeled real-world DIP ATmega328P sockets, RP2040 microchips, TQFP-32 surface-mount ICs, LQFP-48 chips, ESP-12E/WROOM metal shield boxes, HC-49/S crystal oscillators, BOOTSEL/RST switches, and dual BOOT jumper caps.
- **Custom 2D Component Palette Icons**: Added individual SVG icon glyphs for each development board in the 2D palette preview.
- **Pre-scaled Pin Maps**: Added exact pin coordinates for STM32 Blue Pill and NodeMCU ESP8266 in `defaultComponentPins.js`.
- **Smart 3D Fallback Router**: Implemented `DevBoardModel` router that automatically resolves board models from component keys/names even if legacy model types are loaded.
- **Board Documentation**: Created `circuit-lab/docs/BOARDS.md` detailing specs, microcontroller chips, PCB color palettes, and terminal pin layouts for all 8 development boards.

## [v1.2.0] - 2026-08-11

### Added
- **3D Renderers**: Added ESP32 development board and 12-LED NeoPixel RGB ring 3D component models.
- **Wire Customization**: Added color selection toolbar allowing red, green, blue, amber, purple, and black wires on the 3D canvas.
- **Pin Definitions**: Added comprehensive pin role and coordinate mapping constants (`defaultComponentPins.js`).
- **Demo Circuits**: Added ESP32 + NeoPixel RGB Ring showcase circuit to the community project gallery.
- **Testing Suite**: Added unit test suites for MNA matrix solver, authentication token validation, project serialization, and resistor color code calculation.
- **Documentation**: Technical specifications for 3D rendering engine, Modified Nodal Analysis (MNA), and REST API schemas.

### Changed
- Refactored `Scene3D` and `Wire3D` to render realistic 3D curved Bezier paths.
- Updated database seed script with board pin metadata.

<!-- contribution-1 -->
### Resistors & Trimmers
- Added 2D SVG vector glyphs for fixed resistors and variable trimmers.

<!-- contribution-2 -->
### Capacitors
- Added 2D SVG vector glyphs for polarized electrolytic and ceramic disc capacitors.

<!-- contribution-3 -->
### Inductors & Ferrites
- Added 2D SVG vector glyphs for multi-turn inductors and RF ferrite beads.

<!-- contribution-4 -->
### Protection & Timing
- Added 2D SVG vector glyphs for glass tube fuses and 16MHz crystal oscillators.

<!-- contribution-5 -->
### Prototyping Hardware
- Added 2D SVG vector glyphs for 830 tie-point breadboards and screw terminal blocks.

<!-- contribution-6 -->
### Light Emitting Diodes
- Added 2D SVG vector glyphs for visible LEDs, common-cathode RGB LEDs, and IR LEDs.

<!-- contribution-7 -->
### Diodes & Lasers
- Added 2D SVG vector glyphs for 5mW red laser diodes and silicon rectifier diodes.

<!-- contribution-8 -->
### Special Diodes
- Added 2D SVG vector glyphs for Zener breakdown diodes and Schottky diodes.

<!-- contribution-9 -->
### Bipolar Transistors
- Added 2D SVG vector glyphs for TO-92 NPN and PNP bipolar junction transistors.

<!-- contribution-10 -->
### Power Semiconductors
- Added 2D SVG vector glyphs for TO-220 N-channel MOSFETs and 4-pin bridge rectifiers.

<!-- contribution-11 -->
### Analog ICs
- Added 2D SVG vector glyphs for NE555 timer chips and dual operational amplifiers.

<!-- contribution-12 -->
### Power & MCU ICs
- Added 2D SVG vector glyphs for 7805 voltage regulators and ATmega328 DIP-28 chips.

<!-- contribution-13 -->
### Memory & Converter ICs
- Added 2D SVG vector glyphs for I2C EEPROM chips and 12-bit ADC converters.

<!-- contribution-14 -->
### Basic Logic Gates
- Added 2D SVG vector glyphs for 7408 AND, 7432 OR, and 7486 XOR logic ICs.

<!-- contribution-15 -->
### Sequential Logic Gates
- Added 2D SVG vector glyphs for NAND, NOR, NOT inverters, and D-Flip-Flop ICs.

<!-- contribution-16 -->
### DC Batteries
- Added 2D SVG vector glyphs for 9V alkaline snap batteries, AA cells, and 18650 Li-ion cells.

<!-- contribution-17 -->
### Alternative Power
- Added 2D SVG vector glyphs for CR2032 coin cells, solar panels, and 10000mAh power banks.
