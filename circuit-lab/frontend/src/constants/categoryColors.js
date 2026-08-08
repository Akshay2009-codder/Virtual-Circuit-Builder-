export const CATEGORY_COLOR = {
  passive: "var(--accent)",   // coral
  active: "var(--primary)",   // green
  ic: "#5b8dee",               // blue
  source: "var(--gold)",       // amber
  control: "var(--danger)",    // red
  output: "#b98aff",           // violet
  sensor: "#45d8c4",           // teal
  board: "#ff5ea8",            // pink - microcontroller / dev boards
};

export const CATEGORY_METADATA = {
  passive: { label: "Passives", icon: "Resistor" },
  active: { label: "Semiconductors", icon: "Diode" },
  ic: { label: "Integrated Circuits", icon: "Chip" },
  source: { label: "Power Supplies", icon: "Battery" },
  control: { label: "Switches & Controls", icon: "Toggle" },
  output: { label: "Displays & LEDs", icon: "Light" },
  sensor: { label: "Sensors & Inputs", icon: "Gauge" },
  board: { label: "Microcontrollers", icon: "Cpu" },
};