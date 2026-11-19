import { TRIGRAMS, hexagramByLines } from "../data/hexagrams.ts";
import type { LineValue, TrigramKey } from "../types.ts";

const XIAN_TIAN_ORDER: TrigramKey[] = ["KUN", "QIAN", "DUI", "LI", "ZHEN", "XUN", "KAN", "GEN"];

export function maiHoaFromNumbers(a: number, b: number, c: number) {
  if (![a, b, c].every(Number.isFinite)) {
    throw new Error("Mai Hoa inputs must be finite numbers.");
  }
  const upperKey = XIAN_TIAN_ORDER[((a % 8) + 8) % 8];
  const lowerKey = XIAN_TIAN_ORDER[((b % 8) + 8) % 8];
  const movingPosition = ((((c - 1) % 6) + 6) % 6) + 1;
  const bits = [...TRIGRAMS[lowerKey].lines, ...TRIGRAMS[upperKey].lines];
  const values: LineValue[] = bits.map((bit, i) => {
    if (i + 1 === movingPosition) return bit === 1 ? 9 : 6;
    return bit === 1 ? 7 : 8;
  });

  return {
    upper: upperKey,
    lower: lowerKey,
    movingPosition,
    values,
    hexagram: hexagramByLines(bits),
  };
}
