# 3D Mesh Rendering Pipeline Documentation

## Overview
The 3D Virtual Circuit Builder utilizes Three.js for hardware component rendering, shadow mapping, and breadboard grid alignment.

## Coordinates Conversion
- **2D Schematic (px)** -> **3D Scene Units (m)**: `100px = 1.0 unit`
- **Y-Axis**: Represents height above breadboard surface (`y = 0` is PCB surface level).

## Mesh Lifecycles
1. Component Spawn -> Create geometry & PBR material.
2. Connection Wire -> Parametric Bezier curve mesh generation.
3. Component Removal -> `disposeThreeObject()` invocation to free WebGL VRAM.
