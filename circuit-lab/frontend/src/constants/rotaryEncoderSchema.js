/**
 * Rotary Encoder Component Definition Schema
 */
export const ROTARY_ENCODER_SCHEMA = {
  type: 'ROTARY_ENCODER',
  name: 'Rotary Encoder (KY-040)',
  category: 'Sensors/Inputs',
  pins: [
    { id: 'CLK', label: 'Clock', type: 'output' },
    { id: 'DT', label: 'Data', type: 'output' },
    { id: 'SW', label: 'Switch Button', type: 'output' },
    { id: 'VCC', label: '5V Power', type: 'power' },
    { id: 'GND', label: 'Ground', type: 'ground' }
  ],
  detentsPerRotation: 20
};
