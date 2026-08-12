# Realistic 3D Board Models & Microcontroller Guide

Virtual Circuit Builder includes photo-realistic 3D visual models and exact pin mappings for 8 popular development boards and microcontroller modules.

## Supported 3D Board Models

| Board | Microcontroller / Chip | Key PCB Color | 3D Highlights | Pin Count |
| :--- | :--- | :--- | :--- | :--- |
| **Arduino Uno R3** | ATmega328P DIP | Teal Blue (`#00878f`) | USB-B jack, DC barrel jack, 28-DIP socket & chip, 16MHz HC-49/S crystal, ICSP header, reset button | 20 |
| **Raspberry Pi Pico** | RP2040 Dual-Core ARM | Pi Green (`#008040`) | Micro-USB, RP2040 QFN package, BOOTSEL push button, 40 castellated pin holes, SWD debug header | 40 |
| **Arduino Nano** | ATmega328P TQFP-32 | Royal Blue (`#0077b6`) | Mini-USB port, rotated TQFP chip, 30 male header pins, ICSP header, reset button | 30 |
| **ESP32 Dev Board** | ESP-WROOM-32 | Matte Black (`#121820`) | Metallic nickel shield box, 3D serpentine gold antenna, CP2102 chip, EN & BOOT micro switches | 30 |
| **STM32 Blue Pill** | STM32F103C8T6 ARM | Royal Blue (`#1f5690`) | Micro-USB, 48-pin LQFP IC, dual yellow BOOT0/BOOT1 jumper caps, 8MHz & 32.768kHz crystals, ST-Link header | 40 |
| **NodeMCU ESP8266** | ESP-12E / ESP8266 | Dark Black (`#181c24`) | ESP-12E metal shield box, serpentine Wi-Fi antenna, CP2102 chip, FLASH & RST buttons | 30 |
| **BBC micro:bit** | Nordic nRF51822 | Dark Charcoal (`#1e272e`) | 5x5 red LED display matrix, A/B buttons, 5 large gold ring terminals (GND, 3V, P0, P1, P2) | 5 ring pads |
| **NeoPixel RGB Ring** | 12x WS2812B RGB LEDs | Dark Ring (`#1e272e`) | 12 individually rendered 5050 RGB LEDs with phosphor clear coat lenses, rainbow light glow | 4 solder pads |

## Features & Pin Interactivity
- **Real-world Component Geometry**: Each board model features distinct dimensions, silk-screen markings, IC package types, USB connector styles, crystal oscillators, and status LEDs.
- **Direct Terminal Wiring**: Click directly on pin header pins or castellated pads to attach color-coded jumper wires.
- **Smart Fallback Router**: The 3D scene engine (`DevBoardModel`) automatically resolves the proper board model based on board key, modelType, or name.
