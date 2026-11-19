import type { Element } from "../types.ts";
import { BRANCHES, BRANCH_ELEMENTS, STEMS, dayCanChi, solarLongitude } from "./lunarCanChi.ts";

const STEM_ELEMENTS: Record<string, Element> = {
  Giáp: "Mộc", Ất: "Mộc", Bính: "Hỏa", Đinh: "Hỏa", Mậu: "Thổ",
  Kỷ: "Thổ", Canh: "Kim", Tân: "Kim", Nhâm: "Thủy", Quý: "Thủy",
};
const STEM_YANG: Record<string, boolean> = {
  Giáp: true, Ất: false, Bính: true, Đinh: false, Mậu: true,
  Kỷ: false, Canh: true, Tân: false, Nhâm: true, Quý: false,
};

const PRODUCES: Record<Element, Element> = {
  Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc",
};
const CONTROLS: Record<Element, Element> = {
  Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc",
};

// Tàng Can (Hidden Stems) in each of 12 Branches
export const HIDDEN_STEMS: Record<string, string[]> = {
  Tý: ["Quý"],
  Sửu: ["Kỷ", "Quý", "Tân"],
  Dần: ["Giáp", "Bính", "Mậu"],
  Mão: ["Ất"],
  Thìn: ["Mậu", "Ất", "Quý"],
  Tỵ: ["Bính", "Mậu", "Canh"],
  Ngọ: ["Đinh", "Kỷ"],
  Mùi: ["Kỷ", "Đinh", "Ất"],
  Thân: ["Canh", "Nhâm", "Mậu"],
  Dậu: ["Tân"],
  Tuất: ["Mậu", "Tân", "Đinh"],
  Hợi: ["Nhâm", "Giáp"],
};

export function getTenGod(dayStem: string, targetStem: string): string {
  const dEl = STEM_ELEMENTS[dayStem];
  const tEl = STEM_ELEMENTS[targetStem];
  const samePol = STEM_YANG[dayStem] === STEM_YANG[targetStem];
  if (dEl === tEl) return samePol ? "Tỷ Kiên" : "Kiếp Tài";
  if (PRODUCES[dEl] === tEl) return samePol ? "Thực Thần" : "Thương Quan";
  if (CONTROLS[dEl] === tEl) return samePol ? "Thiên Tài" : "Chính Tài";
  if (CONTROLS[tEl] === dEl) return samePol ? "Thất Sát" : "Chính Quan";
  return samePol ? "Thiên Ấn" : "Chính Ấn";
}

export interface BaziPillar {
  label: string;
  stem: string;
  branch: string;
  stemElement: Element;
  branchElement: Element;
  tenGod: string;
  hiddenStems: { stem: string; tenGod: string }[];
}

export function calcBaziChart(year: number, month: number, day: number, hourBranchIdx: number) {
  const lon = solarLongitude(year, month, day, 12, 7);
  // Bazi Year starts at Lập Xuân (315 deg). If Jan/early Feb before Lập Xuân (lon in [270..315)), use year - 1.
  const baziYear = month <= 2 && lon >= 270 && lon < 315 ? year - 1 : year;
  const yIdx60 = (((baziYear - 4) % 60) + 60) % 60;
  const yStemIdx = yIdx60 % 10;
  const yBranchIdx = yIdx60 % 12;

  // Bazi Month Branch from Solar Term (0=Dần..11=Sửu)
  const solarMonthIdx = Math.floor((((lon - 315) % 360) + 360) % 360 / 30); // 0=Dần..11=Sửu
  const mBranchIdx = (solarMonthIdx + 2) % 12;
  // Ngũ Hổ Độn (Month Stem from Year Stem)
  const danStemIdx = ((yStemIdx % 5) * 2 + 2) % 10;
  const mStemIdx = (danStemIdx + solarMonthIdx) % 10;

  // Day Pillar
  const dCC = dayCanChi(year, month, day);
  const dStem = dCC.stem;

  // Hour Pillar via Ngũ Thử Độn (Giáp/Kỷ->Giáp Tý, Ất/Canh->Bính Tý, Bính/Tân->Mậu Tý, Đinh/Nhâm->Canh Tý, Mậu/Quý->Nhâm Tý)
  const ziStemIdx = (dCC.stemIdx % 5) * 2;
  const hStemIdx = (ziStemIdx + hourBranchIdx) % 10;

  const mkPillar = (label: string, sIdx: number, bIdx: number, isDay = false): BaziPillar => {
    const stem = STEMS[sIdx];
    const branch = BRANCHES[bIdx];
    return {
      label,
      stem,
      branch,
      stemElement: STEM_ELEMENTS[stem],
      branchElement: BRANCH_ELEMENTS[branch],
      tenGod: isDay ? "Nhật Chủ" : getTenGod(dStem, stem),
      hiddenStems: HIDDEN_STEMS[branch].map((hs) => ({ stem: hs, tenGod: getTenGod(dStem, hs) })),
    };
  };

  const pillars: BaziPillar[] = [
    mkPillar("Trụ Năm", yStemIdx, yBranchIdx),
    mkPillar("Trụ Tháng", mStemIdx, mBranchIdx),
    mkPillar("Trụ Ngày", dCC.stemIdx, dCC.branchIdx, true),
    mkPillar("Trụ Giờ", hStemIdx, hourBranchIdx),
  ];

  // Five-element distribution across 8 characters + month command weight
  const counts: Record<Element, number> = { Mộc: 0, Hỏa: 0, Thổ: 0, Kim: 0, Thủy: 0 };
  pillars.forEach((p, idx) => {
    counts[p.stemElement] += 1;
    counts[p.branchElement] += idx === 1 ? 2 : 1; // Lệnh tháng trọng số x2
  });

  const dayElem = STEM_ELEMENTS[dStem];
  const resourceElem = (Object.keys(PRODUCES) as Element[]).find((e) => PRODUCES[e] === dayElem)!;
  const supportScore = counts[dayElem] + counts[resourceElem];
  const totalScore = Object.values(counts).reduce((a, b) => a + b, 0);
  const isStrong = supportScore >= totalScore / 2;

  const outputElem = PRODUCES[dayElem];
  const wealthElem = CONTROLS[dayElem];
  const powerElem = (Object.keys(CONTROLS) as Element[]).find((e) => CONTROLS[e] === dayElem)!;

  const dungThan = isStrong
    ? `${outputElem} (Thực Thương), ${wealthElem} (Tài) hoặc ${powerElem} (Quan Sát) để tiết/chế bớt vượng khí.`
    : `${resourceElem} (Ấn) và ${dayElem} (Tỷ Kiếp) để bồi đắp cho Nhật Chủ.`;

  return {
    dayMaster: `${dStem} (${dayElem}, ${STEM_YANG[dStem] ? "Dương" : "Âm"})`,
    pillars,
    counts,
    strengthLabel: isStrong ? "Thân Vượng" : "Thân Nhược",
    dungThanAdvice: dungThan,
  };
}

// Compatibility (Tam Hợp, Lục Hợp, Tứ Hành Xung, Lục Hại)
const TAM_HOP_GROUPS = [
  ["Thân", "Tý", "Thìn"],
  ["Dần", "Ngọ", "Tuất"],
  ["Hợi", "Mão", "Mùi"],
  ["Tỵ", "Dậu", "Sửu"],
];
const LUC_HOP_PAIRS = new Set(["Tý-Sửu", "Sửu-Tý", "Dần-Hợi", "Hợi-Dần", "Mão-Tuất", "Tuất-Mão", "Thìn-Dậu", "Dậu-Thìn", "Tỵ-Thân", "Thân-Tỵ", "Ngọ-Mùi", "Mùi-Ngọ"]);
const XUNG_PAIRS = new Set(["Tý-Ngọ", "Ngọ-Tý", "Sửu-Mùi", "Mùi-Sửu", "Dần-Thân", "Thân-Dần", "Mão-Dậu", "Dậu-Mão", "Thìn-Tuất", "Tuất-Thìn", "Tỵ-Hợi", "Hợi-Tỵ"]);
const HAI_PAIRS = new Set(["Tý-Mùi", "Mùi-Tý", "Sửu-Ngọ", "Ngọ-Sửu", "Dần-Tỵ", "Tỵ-Dần", "Mão-Thìn", "Thìn-Mão", "Thân-Hợi", "Hợi-Thân", "Dậu-Tuất", "Tuất-Dậu"]);

export function compareAges(yearA: number, yearB: number) {
  const bA = BRANCHES[(((yearA - 4) % 12) + 12) % 12];
  const bB = BRANCHES[(((yearB - 4) % 12) + 12) % 12];
  const sA = STEMS[(((yearA - 4) % 10) + 10) % 10];
  const sB = STEMS[(((yearB - 4) % 10) + 10) % 10];
  const key = `${bA}-${bB}`;

  let relation = "Bình hòa";
  let verdict = "Hai tuổi bình hòa, có thể hợp tác nếu chung mục tiêu.";
  if (bA === bB) {
    relation = "Đồng Chi (Cùng tuổi)";
    verdict = "Dễ đồng cảm quan điểm nhưng cần phân công vai trò rõ ràng.";
  } else if (LUC_HOP_PAIRS.has(key)) {
    relation = "Lục Hợp (Đại Cát)";
    verdict = "Rất hợp tác, dễ hỗ trợ và tin tưởng lẫn nhau.";
  } else if (TAM_HOP_GROUPS.some((g) => g.includes(bA) && g.includes(bB))) {
    relation = "Tam Hợp (Cát)";
    verdict = "Chung chí hướng, thuận lợi kết hợp làm ăn hoặc hôn nhân.";
  } else if (XUNG_PAIRS.has(key)) {
    relation = "Lục Xung (Tứ Hành Xung)";
    verdict = "Khác biệt quan điểm mạnh; nên giữ ranh giới công việc rõ ràng và nhường nhịn.";
  } else if (HAI_PAIRS.has(key)) {
    relation = "Lục Hại";
    verdict = "Dễ phát sinh hiểu lầm ngầm; cần minh bạch giao tiếp và tài chính.";
  }

  return {
    personA: `${yearA} (${sA} ${bA})`,
    personB: `${yearB} (${sB} ${bB})`,
    relation,
    verdict,
  };
}
