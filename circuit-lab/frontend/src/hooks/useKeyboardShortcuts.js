/**
 * Keyboard Shortcuts Hook for Circuit Actions (Ctrl+Z, Del, Ctrl+S)
 */
import { useEffect } from 'react';

export function useKeyboardShortcuts(onUndo, onRedo, onDelete) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.key === 'z') {
        if (e.shiftKey) onRedo && onRedo();
        else onUndo && onUndo();
      } else if (e.key === 'Delete') {
        onDelete && onDelete();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onDelete]);
}
