import type { Hexagram, Interpretation, LucHaoResult } from "../types.ts";

export function interpretHexagram(params: {
  question: string;
  base: Hexagram;
  changed: Hexagram | null;
  mutual: Hexagram;
  movingPositions: number[];
  chuHyRule: string;
  lucHao: LucHaoResult;
}): Interpretation {
  const { question, base, changed, mutual, movingPositions, chuHyRule, lucHao } = params;
  const shiRow = lucHao.rows.find((r) => r.shi);
  const yingRow = lucHao.rows.find((r) => r.ying);

  return {
    headline: changed
      ? `Quẻ ${base.hanViet} biến ${changed.hanViet} (${movingPositions.length} hào động)`
      : `Quẻ ${base.hanViet} (Quẻ tĩnh)`,
    overview: `Ngày ${lucHao.dayCanChi.name} (Tuần Không: ${lucHao.dayCanChi.tuanKhong.join(", ")}), Nguyệt kiến ${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element}). Quẻ Hỗ: ${mutual.hanViet}.`,
    chuHyRule,
    sections: [
      { title: "1. Quy tắc Chu Hy", body: chuHyRule },
      {
        title: "2. Thế & Ứng (Lục Hào)",
        body: `Thế ở hào ${lucHao.shi} (${shiRow?.relation} ${shiRow?.branch} - ${shiRow?.strength.state}), Ứng ở hào ${lucHao.ying} (${yingRow?.relation} ${yingRow?.branch} - ${yingRow?.strength.state}).`,
      },
    ],
    evidence: [
      { factor: "Quẻ Bản", effect: "neutral", detail: `#${base.id} ${base.hanViet} (Cung ${lucHao.palace})` },
      { factor: "Quẻ Biến", effect: changed ? "positive" : "neutral", detail: changed ? `#${changed.id} ${changed.hanViet}` : "Không biến" },
      { factor: "Nguyệt Kiến", effect: "neutral", detail: `${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element})` },
      { factor: "Tuần Không", effect: "neutral", detail: lucHao.dayCanChi.tuanKhong.join(", ") },
    ],
    caveat: "Kết quả mang tính tham khảo triết lý và hỗ trợ tự phản tỉnh quyết định, không phải dự báo khoa học.",
  };
}
