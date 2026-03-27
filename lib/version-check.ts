export const BROWSER_LIKE_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export function normalizeVersion(version: string) {
  return version
    .trim()
    .toLowerCase()
    .replace(/^v/, "")
    .replace(/[^0-9.]/g, "");
}

export function compareVersions(a: string, b: string) {
  const pa = normalizeVersion(a).split(".").map((part) => Number(part || "0"));
  const pb = normalizeVersion(b).split(".").map((part) => Number(part || "0"));
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i += 1) {
    const av = pa[i] ?? 0;
    const bv = pb[i] ?? 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }

  return 0;
}

export function extractVersion(html: string) {
  const patterns = [
    /\b(?:version|ver|v)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)+)\b/i,
    /\bv?\s*([0-9]+(?:\.[0-9]+)+)\b/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}
