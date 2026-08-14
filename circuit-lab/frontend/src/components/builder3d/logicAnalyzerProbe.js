/**
 * 8-Channel Digital Logic Analyzer Signal Indicator Spec
 */
export function getLogicProbeChannelSpec(channelId) {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xff8800, 0x8800ff];
  return {
    channel: channelId,
    color: colors[channelId % colors.length],
    label: `CH${channelId}`
  };
}
