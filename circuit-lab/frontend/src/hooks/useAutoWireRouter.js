/**
 * Auto-Wire Routing Hook using Manhattan Grid Pathfinding
 */
export function useAutoWireRouter() {
  const calculateWirePath = (startPin, endPin) => {
    const midX = (startPin.x + endPin.x) / 2;
    return [
      { x: startPin.x, y: startPin.y },
      { x: midX, y: startPin.y },
      { x: midX, y: endPin.y },
      { x: endPin.x, y: endPin.y }
    ];
  };

  return { calculateWirePath };
}
