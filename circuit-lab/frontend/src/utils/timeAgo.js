export function timeAgo(isoString, options = {}) {
  if (!isoString) return null;
  const { short = false } = options;
  const then = new Date(isoString.endsWith("Z") ? isoString : isoString + "Z");
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);

  const suffix = short ? "" : " ago";
  if (seconds < 60) return short ? "now" : "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m${suffix}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h${suffix}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d${suffix}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo${suffix}`;
  return `${Math.floor(months / 12)}y${suffix}`;
}