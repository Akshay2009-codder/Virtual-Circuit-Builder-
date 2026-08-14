/**
 * SVG Vector Schematic Diagram Exporter Utility
 */
export function exportSchematicToSvg(components, wires, width = 800, height = 600) {
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`;
  svgContent += `<rect width="100%" height="100%" fill="#111827"/>`;
  
  // Wires
  wires.forEach(w => {
    svgContent += `<line x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}" stroke="#3b82f6" stroke-width="2"/>`;
  });

  svgContent += `</svg>`;
  return svgContent;
}
