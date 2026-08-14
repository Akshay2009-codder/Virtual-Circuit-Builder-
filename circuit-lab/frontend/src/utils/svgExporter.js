/**
 * Export Utility to convert 2D Canvas circuit layouts into clean SVG vector files.
 */

/**
 * Serializes placed components and wire connections into an SVG string.
 * @param {Array} nodes Placed circuit components
 * @param {Array} edges Wire connections between component pins
 * @param {Object} options Canvas dimensions and styling options
 * @returns {string} SVG XML content string
 */
export function exportCircuitToSVG(nodes = [], edges = [], options = {}) {
  const width = options.width || 1200;
  const height = options.height || 800;
  const title = options.title || "Circuit Schematic";

  let svgElements = [];

  // Draw background grid pattern
  svgElements.push(`
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#0f172a"/>
    <rect width="100%" height="100%" fill="url(#grid)" />
  `);

  // Draw wires
  edges.forEach((edge, index) => {
    const x1 = edge.x1 || 100;
    const y1 = edge.y1 || 100;
    const x2 = edge.x2 || 300;
    const y2 = edge.y2 || 100;
    const color = edge.color || "#06b6d4";

    svgElements.push(`
      <line id="wire-${index}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
            stroke="${color}" stroke-width="3" stroke-linecap="round" />
    `);
  });

  // Draw components
  nodes.forEach((node) => {
    const x = node.x || 100;
    const y = node.y || 100;
    const label = node.name || node.key || "Component";

    svgElements.push(`
      <g transform="translate(${x}, ${y})" id="node-${node.id}">
        <rect x="-30" y="-20" width="60" height="40" rx="6" 
              fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="0" y="4" font-family="sans-serif" font-size="12" 
              fill="#f8fafc" text-anchor="middle" font-weight="bold">${label}</text>
      </g>
    `);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <title>${title}</title>
  ${svgElements.join("\n")}
</svg>`;
}

/**
 * Triggers a web browser download for the SVG file.
 */
export function downloadSVG(svgContent, filename = "circuit-schematic.svg") {
  const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
