import type { LineValue } from "../types.ts";

export function castThiSach(rng: () => number = Math.random): LineValue[] {
  const lines: LineValue[] = [];
  for (let i = 0; i < 6; i++) {
    const r = rng();
    if (r < 1 / 16) lines.push(6);
    else if (r < 8 / 16) lines.push(8);
    else if (r < 13 / 16) lines.push(7);
    else lines.push(9);
  }
  return lines;
}

export function castThreeCoins(rng: () => number = Math.random): LineValue[] {
  const lines: LineValue[] = [];
  for (let i = 0; i < 6; i++) {
    let sum = 0;
    for (let c = 0; c < 3; c++) {
      sum += rng() < 0.5 ? 2 : 3;
    }
    lines.push(sum as LineValue);
  }
  return lines;
}
