export const uid = () => `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export function fmtPct(n) {
  if (!isFinite(n)) return "0%";
  return `${Math.round(n * 100)}%`;
}

export function normalize(s) {
  return (s || "").toLowerCase().trim();
}

export function guessPromotedName(className) {
  // 10A1 -> 11A1, 11B1 -> 12B1, 12C1 -> 12C1 (cap)
  const m = /^(\d{2})(.*)$/i.exec(className);
  if (!m) return className;
  const g = parseInt(m[1], 10);
  const rest = m[2] || "";
  const next = clamp(g + 1, 10, 12);
  return `${next}${rest}`;
}

export function pickCurrentYearId(years) {
  return years.find((y) => y.is_current)?.id || years[0]?.id;
}

export function nowStr() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
