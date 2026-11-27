export type Element = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
export type TrigramKey = "QIAN" | "DUI" | "LI" | "ZHEN" | "XUN" | "KAN" | "GEN" | "KUN";
export type LineValue = 6 | 7 | 8 | 9;
export type DivinationMethod = "thi_sach" | "dong_xu" | "mai_hoa" | "manual";

export interface TrigramInfo {
  hanViet: string;
  chinese: string;
  symbol: string;
  lines: [number, number, number];
  element: Element;
  nature: string;
  xianTianNum: number;
}

export interface Hexagram {
  id: number;
  hanViet: string;
  chinese: string;
  english: string;
  upper: TrigramKey;
  lower: TrigramKey;
  lines: number[];
  binary: string;
  palace: TrigramKey;
  palaceElement: Element;
  palaceRank: number;
  shi: number;
  ying: number;
}

export interface DayCanChi {
  stem: string;
  stemIdx: number;
  branch: string;
  branchIdx: number;
  name: string;
  tuanKhong: [string, string];
}

export interface NguyetKien {
  branch: string;
  element: Element;
  solarTermWindow: string;
  solarLongitudeDeg: number;
}

export interface SeasonalStrength {
  state: "Vượng" | "Tướng" | "Hưu" | "Tù" | "Tử";
  score: number;
  detail: string;
}

export interface LucHaoRow {
  position: number;
  value: LineValue;
  yinYang: "Dương" | "Âm";
  moving: boolean;
  branch: string;
  element: Element;
  relation: string;
  spirit: string;
  strength: SeasonalStrength;
  tuanKhong: boolean;
  shi: boolean;
  ying: boolean;
  changedBranch: string | null;
  changedElement: Element | null;
  changedRelation: string | null;
}

export interface LucHaoResult {
  palace: string;
  palaceKey?: TrigramKey;
  palaceElement: Element;
  palaceRank: number;
  shi: number;
  ying: number;
  dayCanChi: DayCanChi;
  nguyetKien: NguyetKien;
  rows: LucHaoRow[];
}

export interface Evidence {
  factor: string;
  effect: "positive" | "negative" | "neutral";
  detail: string;
}

export interface Interpretation {
  headline: string;
  overview: string;
  chuHyRule: string;
  sections: { title: string; body: string }[];
  evidence: Evidence[];
  caveat: string;
}
