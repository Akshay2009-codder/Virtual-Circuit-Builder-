/**
 * ACS712 Hall Effect Current Sensor Specs (5A/20A/30A)
 */
export const ACS712_SPECS = {
  type: 'ACS712',
  name: 'ACS712 Hall Effect Current Sensor',
  category: 'Sensors',
  sensitivityMvPerAmp: 185, // For 5A variant
  zeroCurrentOutputVoltage: 2.5
};
