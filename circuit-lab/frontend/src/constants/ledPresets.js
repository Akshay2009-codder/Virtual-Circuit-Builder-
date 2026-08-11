// Standard LED Forward Voltages (Vf), Max Forward Current (If), and Emission Wavelengths

export const LED_PRESETS = {
  led_red: {
    name: "Red LED (5mm)",
    color: "#ff3838",
    forwardVoltage: 1.8, // Volts
    maxCurrent: 0.02,   // 20 mA
    wavelengthNm: 635,
    suggestedResistor5V: 160, // Ohms
  },
  led_green: {
    name: "Green LED (5mm)",
    color: "#2ed573",
    forwardVoltage: 2.1,
    maxCurrent: 0.02,
    wavelengthNm: 525,
    suggestedResistor5V: 150,
  },
  led_blue: {
    name: "Blue LED (5mm)",
    color: "#1e90ff",
    forwardVoltage: 3.2,
    maxCurrent: 0.02,
    wavelengthNm: 470,
    suggestedResistor5V: 91,
  },
  led_yellow: {
    name: "Yellow LED (5mm)",
    color: "#ffa801",
    forwardVoltage: 2.0,
    maxCurrent: 0.02,
    wavelengthNm: 590,
    suggestedResistor5V: 150,
  },
};
