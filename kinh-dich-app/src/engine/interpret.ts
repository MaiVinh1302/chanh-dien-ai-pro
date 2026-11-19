import type { Element, Hexagram, Interpretation, LucHaoResult } from "../types.ts";

export type TopicKey = "career" | "finance" | "love" | "study" | "health" | "general";

export const TOPIC_LABELS: Record<TopicKey, string> = {
  career: "Công danh / Sự nghiệp",
  finance: "Tài lộc / Đầu tư",
  love: "Hôn nhân / Tình cảm",
  study: "Học tập / Thi cử",
  health: "Sức khỏe / Gia đạo",
  general: "Tổng quát / Định hướng",
};

const PRODUCES: Record<Element, Element> = {
  Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim", Kim: "Thủy", Thủy: "Mộc",
};
const CONTROLS: Record<Element, Element> = {
  Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim", Kim: "Mộc",
};

function compareElements(a: Element, b: Element): string {
  if (a === b) return "Tỷ hòa (đồng hành, trợ lực nhau)";
  if (PRODUCES[a] === b) return `${a} sinh ${b} (hào trước hỗ trợ hào sau)`;
  if (PRODUCES[b] === a) return `${b} sinh ${a} (được nguồn lực bồi đắp)`;
  if (CONTROLS[a] === b) return `${a} khắc ${b} (chủ động chế ngự nhưng tốn sức)`;
  return `${b} khắc ${a} (chịu áp lực, cần thận trọng)`;
}

function getDungThanRelation(topic: TopicKey): { rel: string; reason: string } {
  switch (topic) {
    case "career":
      return { rel: "Quan Quỷ", reason: "Xem công danh, chức vị, thăng tiến hay áp lực công việc lấy Quan Quỷ làm Dụng thần." };
    case "finance":
      return { rel: "Thê Tài", reason: "Xem tài lộc, kinh doanh, đầu tư, dòng tiền lấy Thê Tài làm Dụng thần." };
    case "study":
      return { rel: "Phụ Mẫu", reason: "Xem thi cử, học vấn, giấy tờ, hợp đồng lấy Phụ Mẫu làm Dụng thần." };
    case "health":
      return { rel: "Tử Tôn", reason: "Xem sức khỏe, tiêu tai giải ách, thuốc men lấy Tử Tôn (phúc thần) làm Dụng thần; đồng thời kiêm xét Quan Quỷ (bệnh)." };
    case "love":
      return { rel: "Thê Tài", reason: "Xem tình cảm/hôn nhân thường lấy Thê Tài (với nam) hoặc Quan Quỷ (với nữ) làm Dụng thần; kết hợp xét tương quan Thế – Ứng." };
    default:
      return { rel: "Thế", reason: "Hỏi tổng quát lấy hào Thế làm trục bản thân và hào Ứng làm hoàn cảnh đối diện." };
  }
}

export function interpretHexagram(params: {
  question: string;
  topic?: TopicKey;
  base: Hexagram;
  changed: Hexagram | null;
  mutual: Hexagram;
  movingPositions: number[];
  chuHyRule: string;
  lucHao: LucHaoResult;
}): Interpretation {
  const { question, topic = "general", base, changed, mutual, movingPositions, chuHyRule, lucHao } = params;
  const shiRow = lucHao.rows.find((r) => r.shi)!;
  const yingRow = lucHao.rows.find((r) => r.ying)!;
  const dtInfo = getDungThanRelation(topic);
  const dtRows = dtInfo.rel === "Thế" ? [shiRow] : lucHao.rows.filter((r) => r.relation === dtInfo.rel);
  const primaryDt = dtRows[0];

  const dtComment = primaryDt
    ? `Dụng thần (${dtInfo.rel}) xuất hiện tại Hào ${primaryDt.position} (${primaryDt.branch} – ${primaryDt.element}), trạng thái ${primaryDt.strength.state} (${primaryDt.strength.detail})${
        primaryDt.tuanKhong ? ", đang lâm Tuần Không (cần chờ qua tuần hoặc xung thực mới ứng nghiệm rõ)" : ""
      }${
        primaryDt.moving && primaryDt.changedRelation
          ? `. Hào này ĐỘNG biến thành ${primaryDt.changedRelation} ${primaryDt.changedBranch} (${primaryDt.changedElement}) — ${compareElements(primaryDt.changedElement!, primaryDt.element)}`
          : ", trạng thái tĩnh."
      }`
    : `Dụng thần (${dtInfo.rel}) không hiện trực tiếp trên 6 hào quẻ Bản (ẩn phục dưới quẻ Bát Thuần cùng cung), báo hiệu cơ hội chưa lộ rõ, cần kiên nhẫn chờ thời điểm kích hoạt.`;

  const shiYingComment = `Hào Thế (người hỏi) đóng tại Hào ${shiRow.position} (${shiRow.relation} ${shiRow.branch} – ${shiRow.element}, ${shiRow.strength.state}); Hào Ứng (đối tượng/ngoại cảnh) tại Hào ${yingRow.position} (${yingRow.relation} ${yingRow.branch} – ${yingRow.element}, ${yingRow.strength.state}). Tương quan Thế – Ứng: ${compareElements(shiRow.element, yingRow.element)}.`;

  const stageComment = changed
    ? `Quẻ Bản (#${base.id} ${base.hanViet}) phản ánh bối cảnh hiện tại; Quẻ Hỗ (#${mutual.id} ${mutual.hanViet}) cho thấy diễn biến âm thầm bên trong; Quẻ Biến (#${changed.id} ${changed.hanViet}) là xu hướng kết cục sau khi các hào động (${movingPositions.join(", ")}) chuyển hóa.`
    : `Quẻ Bản (#${base.id} ${base.hanViet}) là quẻ tĩnh (không có hào động), trạng thái ổn định; cần xem thêm Quẻ Hỗ (#${mutual.id} ${mutual.hanViet}) để nhận diện động lực ngầm bên trong.`;

  const actionAdvice =
    primaryDt && primaryDt.strength.score >= 4 && !primaryDt.tuanKhong
      ? "Nền tảng Dụng thần đang Vượng/Tướng: Có thể chủ động triển khai kế hoạch, tận dụng thời điểm thuận lợi nhưng vẫn giữ kỷ luật theo tinh thần quẻ."
      : primaryDt && primaryDt.tuanKhong
      ? "Dụng thần đang lâm Không Vong: Nên chuẩn bị kỹ hồ sơ/nguồn lực, tránh ký kết hoặc quyết định vội vàng trong giai đoạn hiện tại; chờ qua chu kỳ Tuần Không hãy hành động."
      : "Dụng thần ở trạng thái Hưu/Tù/Tử hoặc ẩn phục: Nên ưu tiên phòng thủ, củng cố nội lực, tìm quý nhân tương trợ (hành sinh cho Dụng thần) trước khi mở rộng.";

  return {
    headline: changed
      ? `Quẻ ${base.hanViet} biến ${changed.hanViet} (${movingPositions.length} hào động)`
      : `Quẻ ${base.hanViet} (Quẻ tĩnh)`,
    overview: `Câu hỏi (${TOPIC_LABELS[topic]}): "${question}". Ngày ${lucHao.dayCanChi.name} (Tuần Không: ${lucHao.dayCanChi.tuanKhong.join(", ")}), Nguyệt kiến ${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element}).`,
    chuHyRule,
    sections: [
      { title: "1. Diễn tiến 3 tầng (Bản – Hỗ – Biến)", body: stageComment },
      { title: "2. Quy tắc Chu Hy (Trọng tâm đọc quẻ)", body: chuHyRule },
      { title: `3. Phân tích Dụng Thần (${dtInfo.rel})`, body: `${dtInfo.reason} ${dtComment}` },
      { title: "4. Tương quan Thế & Ứng", body: shiYingComment },
      { title: "5. Khuyến nghị hành động", body: actionAdvice },
    ],
    evidence: [
      { factor: "Quẻ Bản", effect: "neutral", detail: `#${base.id} ${base.hanViet} (Cung ${lucHao.palace})` },
      { factor: "Quẻ Biến", effect: changed ? "positive" : "neutral", detail: changed ? `#${changed.id} ${changed.hanViet}` : "Không biến" },
      { factor: "Dụng Thần", effect: primaryDt && primaryDt.strength.score >= 4 ? "positive" : "neutral", detail: primaryDt ? `H${primaryDt.position} ${primaryDt.relation} (${primaryDt.strength.state})` : "Ẩn phục" },
      { factor: "Nguyệt Kiến", effect: "neutral", detail: `${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element})` },
      { factor: "Tuần Không", effect: "neutral", detail: lucHao.dayCanChi.tuanKhong.join(", ") },
    ],
    caveat: "Kết quả mang tính tham khảo triết lý và hỗ trợ tự phản tỉnh quyết định, không phải dự báo khoa học.",
  };
}
