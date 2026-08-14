/**
 * 4-Pin RGB LED Component Schema (Common Cathode / Anode)
 */
export const RGB_LED_SCHEMA = {
  type: 'RGB_LED',
  name: 'RGB LED 5mm',
  category: 'Outputs',
  pins: [
    { id: 'R', label: 'Red Anode', forwardVoltage: 2.0 },
    { id: 'GND', label: 'Common Cathode', isGround: true },
    { id: 'G', label: 'Green Anode', forwardVoltage: 3.2 },
    { id: 'B', label: 'Blue Anode', forwardVoltage: 3.2 }
  ]
};
