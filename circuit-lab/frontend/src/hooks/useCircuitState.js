import { useState, useCallback } from "react";

/**
 * Hook for managing circuit canvas history stack (undo / redo operations)
 */
export function useCircuitState(initialNodes = [], initialEdges = []) {
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex] || { nodes: [], edges: [] };

  const pushState = useCallback((newNodes, newEdges) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, currentIndex + 1);
      return [...sliced, { nodes: newNodes, edges: newEdges }];
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, history.length]);

  return {
    nodes: currentState.nodes,
    edges: currentState.edges,
    pushState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
}
