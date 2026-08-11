# Changelog

All notable changes to the Virtual Circuit Builder project will be documented in this file.

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
