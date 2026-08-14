/**
 * Breadboard Column Pin Insertion Highlighting Hook
 */
import { useState } from 'react';

export function useBreadboardHighlight() {
  const [activePin, setActivePin] = useState(null);

  const highlightPin = (pinId) => setActivePin(pinId);
  const clearHighlight = () => setActivePin(null);

  return { activePin, highlightPin, clearHighlight };
}
