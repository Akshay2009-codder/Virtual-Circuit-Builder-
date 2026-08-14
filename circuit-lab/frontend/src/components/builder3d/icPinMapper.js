/**
 * Dual In-Line (DIP) IC Package Breadboard Pin Offset Mapper
 */
export function getDipPinCoordinates(pinIndex, totalPins = 14, pitch = 0.1, rowSpacing = 0.3) {
  const isLeftRow = pinIndex <= totalPins / 2;
  const colIndex = isLeftRow ? (pinIndex - 1) : (totalPins - pinIndex);
  const xOffset = isLeftRow ? 0 : rowSpacing;
  const zOffset = colIndex * pitch;
  return { x: xOffset, z: zOffset };
}
