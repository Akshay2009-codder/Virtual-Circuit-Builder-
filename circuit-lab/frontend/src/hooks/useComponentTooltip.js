/**
 * Hover Component Tooltip Info Provider Hook
 */
import { useState } from 'react';

export function useComponentTooltip() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const showTooltip = (comp) => setActiveTooltip(comp);
  const hideTooltip = () => setActiveTooltip(null);

  return { activeTooltip, showTooltip, hideTooltip };
}
