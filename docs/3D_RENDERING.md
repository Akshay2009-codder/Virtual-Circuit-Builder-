# 3D Circuit Rendering Engine Specification

## Overview

The Virtual Circuit Builder uses **Three.js** via `@react-three/fiber` and `@react-three/drei` to render 3D interactive breadboards, microcontrollers, active/passive components, and wiring connections on a realistic workbench canvas.

## Component Model Architecture

Each component in the 3D scene is represented as a high-fidelity mesh or compound primitive group:

- **Breadboard**: Standard 830-point solderless breadboard with power rails and terminal strip grid.
- **ESP32 DevKit**: 30-pin microcontroller board with dual DIP pin headers, status LEDs, and metal RF shield.
- **NeoPixel RGB Ring**: 12-LED surface-mount RGB ring with power/ground/DIN solder pads.
- **Arduino Uno**: Classic ATmega328P DIP micro-controller layout with female headers and USB-B jack.
- **BBC micro:bit**: 5x5 LED matrix display layout with edge connector pads.

## Interactive Pin & Terminal Selection

Terminals are interactive 3D hit targets rendered on physical pin coordinates:
- Hover feedback with dynamic emission scaling.
- Wire snapping to terminal centers using standard offset parameters `(xOffset, yOffset, zOffset)`.
- Color coding per pin role (`power`: Red, `ground`: Black, `gpio`: Green, `signal`: Blue).

## Bezier Curve Wire Generation

Wires are dynamically generated cubic Bezier curves in 3D space:
- Control points lift vertically from start and end terminals to simulate real-world wire bending.
- Customizable insulation color hex codes (`#ff3838`, `#2ed573`, `#1e90ff`, etc.).
- Animated glowing pulse effects for active power-flowing wires.
