/**
 * Multimeter Voltage & Current Measurement Overlay Hook
 */
import { useState } from 'react';

export function useMultimeterOverlay() {
  const [mode, setMode] = useState('DC_VOLTAGE');
  const [reading, setReading] = useState(0.0);

  return { mode, setMode, reading, setReading };
}
