/**
 * Component Terminal Connection Integrity Validator
 */
export function validateTerminalConnections(componentMap, wireList) {
  const invalidWires = [];
  wireList.forEach(wire => {
    const compA = componentMap.get(wire.fromComponentId);
    const compB = componentMap.get(wire.toComponentId);
    if (!compA || !compB) {
      invalidWires.push({ wireId: wire.id, reason: 'Missing connected component reference' });
    }
  });
  return { isValid: invalidWires.length === 0, errors: invalidWires };
}
