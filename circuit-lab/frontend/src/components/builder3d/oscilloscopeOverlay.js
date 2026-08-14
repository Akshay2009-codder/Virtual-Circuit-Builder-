/**
 * 2D Canvas Waveform Overlay Helper for 3D Oscilloscope Component
 */
export function drawOscilloscopeWaveform(canvasCtx, samplePoints, width = 300, height = 150) {
  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.strokeStyle = '#00ff66';
  canvasCtx.lineWidth = 2;
  canvasCtx.beginPath();

  const step = width / (samplePoints.length - 1 || 1);
  samplePoints.forEach((val, idx) => {
    const x = idx * step;
    const y = height / 2 - val * (height / 4);
    if (idx === 0) canvasCtx.moveTo(x, y);
    else canvasCtx.lineTo(x, y);
  });
  canvasCtx.stroke();
}
