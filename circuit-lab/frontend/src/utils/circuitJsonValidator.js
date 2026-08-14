/**
 * Circuit Schematic JSON Import/Export Format Validator
 */
export function validateCircuitSchema(jsonObj) {
  if (!jsonObj || typeof jsonObj !== 'object') return false;
  if (!Array.isArray(jsonObj.components)) return false;
  if (!Array.isArray(jsonObj.wires)) return false;
  return true;
}
