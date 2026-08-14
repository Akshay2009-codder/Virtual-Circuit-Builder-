/**
 * Visual Multimeter Probe Marker Generator
 */
export function createProbeMarkerSpec(probeType = 'RED') {
  return {
    color: probeType === 'RED' ? 0xff2222 : 0x111111,
    tipColor: 0xd4af37, // Gold tip
    radius: 0.15,
    height: 1.2
  };
}
