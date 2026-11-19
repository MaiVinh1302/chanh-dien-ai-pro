import { hexagramByLines } from "../data/hexagrams.ts";
import type { Hexagram, LineValue } from "../types.ts";

export function chuHyRule(baseId: number, movingPositions: number[]): string {
  const n = movingPositions.length;
  if (n === 0) return "0 hào động: Xem Thoán từ (lời quẻ) của Quẻ Bản.";
  if (n === 1) return `1 hào động (hào ${movingPositions[0]}): Xem Hào từ hào ${movingPositions[0]} ở Quẻ Bản.`;
  if (n === 2) {
    return `2 hào động (${movingPositions[0]}, ${movingPositions[1]}): Xem cả 2 Hào từ ở Quẻ Bản, lấy hào trên (hào ${movingPositions[1]}) làm chủ.`;
  }
  if (n === 3) return "3 hào động: Xem Thoán từ Quẻ Bản (Thể) và Quẻ Biến (Dụng).";
  const staticLines = [1, 2, 3, 4, 5, 6].filter((i) => !movingPositions.includes(i));
  if (n === 4) {
    return `4 hào động: Xem 2 hào TĨNH (${staticLines[0]}, ${staticLines[1]}) ở Quẻ Biến, lấy hào dưới (hào ${staticLines[0]}) làm chủ.`;
  }
  if (n === 5) return `5 hào động: Xem hào TĨNH duy nhất (hào ${staticLines[0]}) ở Quẻ Biến.`;
  if (baseId === 1) return "6 hào động (Quẻ Kiền): Xem lời 'Dụng Cửu' của Quẻ Kiền.";
  if (baseId === 2) return "6 hào động (Quẻ Khôn): Xem lời 'Dụng Lục' của Quẻ Khôn.";
  return "6 hào động: Xem Thoán từ của Quẻ Biến.";
}

export function mutualHexagram(lines: number[]): Hexagram {
  const lower = [lines[1], lines[2], lines[3]];
  const upper = [lines[2], lines[3], lines[4]];
  return hexagramByLines([...lower, ...upper]);
}

export function buildHexagram(values: LineValue[]) {
  if (values.length !== 6) {
    throw new Error("Need exactly 6 line values (bottom to top).");
  }
  const baseBits = values.map((v) => (v === 7 || v === 9 ? 1 : 0));
  const changedBits = values.map((v) =>
    v === 6 ? 1 : v === 9 ? 0 : v === 7 ? 1 : 0
  );
  const movingPositions = values
    .map((v, i) => (v === 6 || v === 9 ? i + 1 : null))
    .filter((x): x is number => x !== null);

  const base = hexagramByLines(baseBits);
  const changed = movingPositions.length > 0 ? hexagramByLines(changedBits) : null;
  const mutual = mutualHexagram(baseBits);

  return {
    values,
    movingPositions,
    base,
    changed,
    mutual,
    chuHyRule: chuHyRule(base.id, movingPositions),
  };
}
