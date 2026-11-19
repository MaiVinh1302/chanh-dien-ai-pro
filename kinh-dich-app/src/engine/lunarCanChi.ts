import type { DayCanChi, Element, NguyetKien } from "../types.ts";

export const STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;
export const BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;

export const BRANCH_ELEMENTS: Record<string, Element> = {
  Tý: "Thủy", Sửu: "Thổ", Dần: "Mộc", Mão: "Mộc",
  Thìn: "Thổ", Tỵ: "Hỏa", Ngọ: "Hỏa", Mùi: "Thổ",
  Thân: "Kim", Dậu: "Kim", Tuất: "Thổ", Hợi: "Thủy",
};

const MONTH_BRANCHES_SOLAR: [string, string][] = [
  ["Dần", "Lập Xuân – Vũ Thủy"],
  ["Mão", "Kinh Trập – Xuân Phân"],
  ["Thìn", "Thanh Minh – Cốc Vũ"],
  ["Tỵ", "Lập Hạ – Tiểu Mãn"],
  ["Ngọ", "Mang Chủng – Hạ Chí"],
  ["Mùi", "Tiểu Thử – Đại Thử"],
  ["Thân", "Lập Thu – Xử Thử"],
  ["Dậu", "Bạch Lộ – Thu Phân"],
  ["Tuất", "Hàn Lộ – Sương Giáng"],
  ["Hợi", "Lập Đông – Tiểu Tuyết"],
  ["Tý", "Đại Tuyết – Đông Chí"],
  ["Sửu", "Tiểu Hàn – Đại Hàn"],
];

export function julianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function dayCanChi(year: number, month: number, day: number): DayCanChi {
  const jdn = julianDayNumber(year, month, day);
  const stemIdx = (jdn + 9) % 10;
  const branchIdx = (jdn + 1) % 12;
  const diff = ((branchIdx - stemIdx) % 12 + 12) % 12;
  const kv1 = BRANCHES[(diff + 10) % 12];
  const kv2 = BRANCHES[(diff + 11) % 12];
  return {
    stem: STEMS[stemIdx],
    stemIdx,
    branch: BRANCHES[branchIdx],
    branchIdx,
    name: `${STEMS[stemIdx]} ${BRANCHES[branchIdx]}`,
    tuanKhong: [kv1, kv2],
  };
}

export function solarLongitude(year: number, month: number, day: number, hour = 12, tz = 7): number {
  const jdn = julianDayNumber(year, month, day);
  const jdUt = jdn - 0.5 + (hour - tz) / 24;
  const t = (jdUt - 2451545.0) / 36525.0;
  const l0 = (((280.46646 + 36000.76983 * t + 0.0003032 * t * t) % 360) + 360) % 360;
  const mDeg = (((357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360) + 360) % 360;
  const m = (mDeg * Math.PI) / 180;
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(m) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * m) +
    0.000289 * Math.sin(3 * m);
  return (((l0 + c) % 360) + 360) % 360;
}

export function monthNguyetKien(year: number, month: number, day: number, hour = 12, tz = 7): NguyetKien {
  const lon = solarLongitude(year, month, day, hour, tz);
  const shifted = (((lon - 315) % 360) + 360) % 360;
  const idx = Math.floor(shifted / 30);
  const [branch, solarTermWindow] = MONTH_BRANCHES_SOLAR[idx];
  return {
    branch,
    element: BRANCH_ELEMENTS[branch],
    solarTermWindow,
    solarLongitudeDeg: Math.round(lon * 100) / 100,
  };
}
