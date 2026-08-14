/**
 * Magnetic Snap Cursor Effect Hook for Wire Terminals
 */
import { useState, useEffect } from 'react';

export function useMagneticCursor(targetTerminals = []) {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return cursorPos;
}
