import raw from "./hexagrams.json" with { type: "json" };
import type { Hexagram, TrigramInfo, TrigramKey } from "../types.ts";

const data = raw as {
  trigrams: Record<TrigramKey, TrigramInfo>;
  hexagrams: Hexagram[];
};

export const TRIGRAMS = data.trigrams;
export const HEXAGRAMS = data.hexagrams;
export const HEXAGRAM_BY_ID: Record<number, Hexagram> = Object.fromEntries(
  HEXAGRAMS.map((h) => [h.id, h])
);
export const HEXAGRAM_BY_BITS: Record<string, Hexagram> = Object.fromEntries(
  HEXAGRAMS.map((h) => [h.binary, h])
);

export function hexagramByLines(lines: number[]): Hexagram {
  if (lines.length !== 6) {
    throw new Error("A hexagram requires exactly 6 lines.");
  }
  const bits = lines.join("");
  const found = HEXAGRAM_BY_BITS[bits];
  if (!found) {
    throw new Error(`No hexagram found for binary pattern ${bits}`);
  }
  return found;
}
