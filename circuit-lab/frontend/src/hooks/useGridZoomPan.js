/**
 * Schematic Workspace Grid Zoom & Pan Hook
 */
import { useState } from 'react';

export function useGridZoomPan() {
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const zoomIn = () => setZoom(z => Math.min(2.5, z + 0.1));
  const zoomOut = () => setZoom(z => Math.max(0.4, z - 0.1));

  return { zoom, pan, setPan, zoomIn, zoomOut };
}
