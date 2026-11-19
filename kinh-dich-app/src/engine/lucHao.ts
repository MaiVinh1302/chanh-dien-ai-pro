import { TRIGRAMS } from "../data/hexagrams.ts";
import type { Element, Hexagram, LineValue, LucHaoResult, LucHaoRow, SeasonalStrength, TrigramKey } from "../types.ts";
import { BRANCH_ELEMENTS, dayCanChi, monthNguyetKien } from "./lunarCanChi.ts";

const PRODUCES: Record<Element, Element> = {
  Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc",
};
const CONTROLS: Record<Element, Element> = {
  Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc",
};

const NA_JIA: Record<TrigramKey, string[]> = {
  QIAN: ["Tý", "Dần", "Thìn", "Ngọ", "Thân", "Tuất"],
  KAN:  ["Dần", "Thìn", "Ngọ", "Thân", "Tuất", "Tý"],
  ZHEN: ["Tý", "Dần", "Thìn", "Ngọ", "Thân", "Tuất"],
  GEN:  ["Thìn", "Ngọ", "Thân", "Tuất", "Tý", "Dần"],
  KUN:  ["Mùi", "Tỵ", "Mão", "Sửu", "Hợi", "Dậu"],
  XUN:  ["Sửu", "Hợi", "Dậu", "Mùi", "Tỵ", "Mão"],
  LI:   ["Mão", "Sửu", "Hợi", "Dậu", "Mùi", "Tỵ"],
  DUI:  ["Tỵ", "Mão", "Sửu", "Hợi", "Dậu", "Mùi"],
};

const SPIRITS = ["Thanh Long", "Chu Tước", "Câu Trần", "Đằng Xà", "Bạch Hổ", "Huyền Vũ"];

export function sixRelatives(palaceElem: Element, lineElem: Element): string {
  if (palaceElem === lineElem) return "Huynh Đệ";
  if (PRODUCES[lineElem] === palaceElem) return "Phụ Mẫu";
  if (PRODUCES[palaceElem] === lineElem) return "Tử Tôn";
  if (CONTROLS[palaceElem] === lineElem) return "Thê Tài";
  if (CONTROLS[lineElem] === palaceElem) return "Quan Quỷ";
  return "Huynh Đệ";
}

export function seasonalStrength(lineElem: Element, monthElem: Element): SeasonalStrength {
  if (lineElem === monthElem) {
    return { state: "Vượng", score: 5, detail: `${lineElem} đồng hành Nguyệt kiến ${monthElem}` };
  }
  if (PRODUCES[monthElem] === lineElem) {
    return { state: "Tướng", score: 4, detail: `Nguyệt kiến ${monthElem} sinh ${lineElem}` };
  }
  if (PRODUCES[lineElem] === monthElem) {
    return { state: "Hưu", score: 2, detail: `${lineElem} sinh Nguyệt kiến ${monthElem} (tiết khí)` };
  }
  if (CONTROLS[lineElem] === monthElem) {
    return { state: "Tù", score: 2, detail: `${lineElem} khắc Nguyệt kiến ${monthElem}` };
  }
  return { state: "Tử", score: 1, detail: `Nguyệt kiến ${monthElem} khắc ${lineElem}` };
}

function spiritStartIndex(dayStem: string): number {
  if (dayStem === "Giáp" || dayStem === "Ất") return 0;
  if (dayStem === "Bính" || dayStem === "Đinh") return 1;
  if (dayStem === "Mậu") return 2;
  if (dayStem === "Kỷ") return 3;
  if (dayStem === "Canh" || dayStem === "Tân") return 4;
  return 5;
}

export function lucHaoForHexagram(
  base: Hexagram,
  changed: Hexagram | null,
  values: LineValue[],
  date = new Date()
): LucHaoResult {
  const canChi = dayCanChi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const nk = monthNguyetKien(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours());

  const baseBranches = [...NA_JIA[base.lower].slice(0, 3), ...NA_JIA[base.upper].slice(3)];
  const changedBranches = changed
    ? [...NA_JIA[changed.lower].slice(0, 3), ...NA_JIA[changed.upper].slice(3)]
    : null;

  const sIdx = spiritStartIndex(canChi.stem);

  const rows: LucHaoRow[] = baseBranches.map((branch, i) => {
    const position = i + 1;
    const value = values[i];
    const moving = value === 6 || value === 9;
    const element = BRANCH_ELEMENTS[branch];
    const cBranch = moving && changedBranches ? changedBranches[i] : null;
    const cElement = cBranch ? BRANCH_ELEMENTS[cBranch] : null;

    return {
      position,
      value,
      yinYang: value === 7 || value === 9 ? "Dương" : "Âm",
      moving,
      branch,
      element,
      relation: sixRelatives(base.palaceElement, element),
      spirit: SPIRITS[(sIdx + i) % 6],
      strength: seasonalStrength(element, nk.element),
      tuanKhong: canChi.tuanKhong.includes(branch),
      shi: position === base.shi,
      ying: position === base.ying,
      changedBranch: cBranch,
      changedElement: cElement,
      changedRelation: cElement ? sixRelatives(base.palaceElement, cElement) : null,
    };
  });

  return {
    palace: TRIGRAMS[base.palace].hanViet,
    palaceElement: base.palaceElement,
    palaceRank: base.palaceRank,
    shi: base.shi,
    ying: base.ying,
    dayCanChi: canChi,
    nguyetKien: nk,
    rows,
  };
}
