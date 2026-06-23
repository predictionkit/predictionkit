/** Clamp a number into the 0–1 probability range; non-finite values become 0. */
export function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

/**
 * Coerce a value that may be a number, a numeric string, or nullish into a
 * finite number — returning `undefined` when it can't be parsed. Providers
 * return numbers inconsistently (Polymarket mixes string/number fields; Kalshi
 * returns fixed-point values as strings), so all numeric parsing goes through
 * this helper.
 */
export function num(value: unknown): number | undefined {
  if (value == null || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : undefined;
}
