import { HEXAGRAM_TEXTS } from "../data/hexagramTexts.ts";
import type { Element, Hexagram, Interpretation, LucHaoResult, LucHaoRow } from "../types.ts";
import { findHiddenSpirit } from "./lucHao.ts";

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

const SPIRIT_MEANINGS: Record<string, string> = {
  "Thanh Long": "Thanh Long (hỷ sự, chính trực, tin vui, tài lộc lành)",
  "Chu Tước": "Chu Tước (khẩu thiệt, văn thư, truyền thông, tranh luận)",
  "Câu Trần": "Câu Trần (trì trệ, vướng mắc cũ, đất đai, thủ tục)",
  "Đằng Xà": "Đằng Xà (lo âu, biến ảo khó lường, mộng mị)",
  "Bạch Hổ": "Bạch Hổ (quyết liệt, áp lực lớn, cẩn trọng chấn thương/va chạm)",
  "Huyền Vũ": "Huyền Vũ (ẩn giấu, mưu tính ngầm, đề phòng tiểu nhân/thất thoát)",
};

const CHONG_MAP: Record<string, string> = {
  Tý: "Ngọ", Ngọ: "Tý", Sửu: "Mùi", Mùi: "Sửu", Dần: "Thân", Thân: "Dần",
  Mão: "Dậu", Dậu: "Mão", Thìn: "Tuất", Tuất: "Thìn", Tỵ: "Hợi", Hợi: "Tỵ",
};
const HE_MAP: Record<string, string> = {
  Tý: "Sửu", Sửu: "Tý", Dần: "Hợi", Hợi: "Dần", Mão: "Tuất", Tuất: "Mão",
  Thìn: "Dậu", Dậu: "Thìn", Tỵ: "Thân", Thân: "Tỵ", Ngọ: "Mùi", Mùi: "Ngọ",
};

const ADVANCE_PAIRS = new Set(["Hợi→Tý", "Dần→Mão", "Tỵ→Ngọ", "Thân→Dậu", "Sửu→Thìn", "Thìn→Mùi", "Mùi→Tuất", "Tuất→Sửu"]);
const RETREAT_PAIRS = new Set(["Tý→Hợi", "Mão→Dần", "Ngọ→Tỵ", "Dậu→Thân", "Thìn→Sửu", "Mùi→Thìn", "Tuất→Mùi", "Sửu→Tuất"]);

function compareElements(a: Element, b: Element): string {
  if (a === b) return "Tỷ hòa (đồng hành, trợ lực nhau)";
  if (PRODUCES[a] === b) return `${a} sinh ${b} (trợ lực tốt)`;
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
      return { rel: "Tử Tôn", reason: "Xem sức khỏe, tiêu tai giải ách, thuốc men lấy Tử Tôn (phúc thần) làm Dụng thần; kiêm xét Quan Quỷ (bệnh)." };
    case "love":
      return { rel: "Thê Tài", reason: "Xem tình cảm/hôn nhân lấy Thê Tài hoặc Quan Quỷ làm Dụng thần, kết hợp tương quan Thế – Ứng." };
    default:
      return { rel: "Thế", reason: "Hỏi tổng quát lấy hào Thế làm trục bản thân và hào Ứng làm hoàn cảnh đối diện." };
  }
}

function analyzeDayInteraction(row: LucHaoRow, dayBranch: string): string {
  const notes: string[] = [];
  if (CHONG_MAP[row.branch] === dayBranch) {
    if (row.tuanKhong) notes.push("Nhật Thần XUNG Không Vong (Xung Không Tắc Thực — ứng nghiệm nhanh)");
    else if (!row.moving && row.strength.score >= 4) notes.push("Ám Động (hào vượng gặp Nhật Xung, âm thầm phát lực)");
    else if (!row.moving && row.strength.score <= 2) notes.push("Nhật Phá (hào suy gặp Nhật Xung, lực yếu tán khí)");
  }
  if (HE_MAP[row.branch] === dayBranch) {
    notes.push(row.moving ? "Nhật Hợp (bị trói lại, cần thời gian gỡ vướng)" : "Nhật Hợp (được ngày nâng đỡ, gắn kết)");
  }
  if (row.moving && row.changedBranch) {
    const pair = `${row.branch}→${row.changedBranch}`;
    if (ADVANCE_PAIRS.has(pair)) notes.push("Hóa Tiến Thần (lực tiến triển tăng mạnh)");
    if (RETREAT_PAIRS.has(pair)) notes.push("Hóa Thoái Thần (lực suy giảm dần)");
  }
  return notes.length ? notes.join("; ") : "Không xung hợp đặc biệt với Nhật Thần";
}

function getChuHyFocalTexts(baseId: number, changedId: number | null, moving: number[]): string {
  const bTxt = HEXAGRAM_TEXTS[baseId];
  const cTxt = changedId ? HEXAGRAM_TEXTS[changedId] : null;
  if (!bTxt) return "";
  const n = moving.length;
  if (n === 0) return `Thoán từ Quẻ Bản: "${bTxt.thoan}" | Đại tượng: "${bTxt.daiTuong}"`;
  if (n === 1) return `Hào từ trọng tâm (Hào ${moving[0]} Quẻ Bản): "${bTxt.haos[moving[0] - 1] ?? ""}"`;
  if (n === 2) {
    return `2 Hào từ trọng tâm (lấy hào ${moving[1]} làm chủ): "${bTxt.haos[moving[0] - 1] ?? ""}" | "${bTxt.haos[moving[1] - 1] ?? ""}"`;
  }
  if (n === 3 && cTxt) {
    return `Thoán từ Quẻ Bản (Thể): "${bTxt.thoan}" → Thoán từ Quẻ Biến (Dụng): "${cTxt.thoan}"`;
  }
  const staticLines = [1, 2, 3, 4, 5, 6].filter((i) => !moving.includes(i));
  if (n === 4 && cTxt) {
    return `Hào TĨNH Quẻ Biến (lấy hào ${staticLines[0]} làm chủ): "${cTxt.haos[staticLines[0] - 1] ?? ""}" | "${cTxt.haos[staticLines[1] - 1] ?? ""}"`;
  }
  if (n === 5 && cTxt) {
    return `Hào TĨNH duy nhất Quẻ Biến (Hào ${staticLines[0]}): "${cTxt.haos[staticLines[0] - 1] ?? ""}"`;
  }
  if (n === 6) {
    if (baseId === 1 || baseId === 2) return `Hào đặc biệt: "${bTxt.haos[6] ?? bTxt.thoan}"`;
    if (cTxt) return `Thoán từ Quẻ Biến: "${cTxt.thoan}"`;
  }
  return "";
}

export function interpretHexagram(params: {
  question: string;
  topic?: TopicKey;
  base: Hexagram;
  changed: Hexagram | null;
  mutual: Hexagram;
  inverse?: Hexagram;
  opposite?: Hexagram;
  structureType?: "Lục Xung Quái" | "Lục Hợp Quái" | "Thường Quái";
  movingPositions: number[];
  chuHyRule: string;
  lucHao: LucHaoResult & { palaceKey?: any };
}): Interpretation {
  const {
    question,
    topic = "general",
    base,
    changed,
    mutual,
    inverse,
    opposite,
    structureType = "Thường Quái",
    movingPositions,
    chuHyRule,
    lucHao,
  } = params;
  const shiRow = lucHao.rows.find((r) => r.shi)!;
  const yingRow = lucHao.rows.find((r) => r.ying)!;
  const dtInfo = getDungThanRelation(topic);
  const dtRows = dtInfo.rel === "Thế" ? [shiRow] : lucHao.rows.filter((r) => r.relation === dtInfo.rel);
  const primaryDt = dtRows[0];

  const hidden =
    !primaryDt && lucHao.palaceKey
      ? findHiddenSpirit(lucHao.palaceKey, lucHao.palaceElement, dtInfo.rel, lucHao.rows)
      : null;

  let nguyenKyComment = "";
  if (primaryDt) {
    const dtElem = primaryDt.element;
    const nguyenElem = (Object.keys(PRODUCES) as Element[]).find((e) => PRODUCES[e] === dtElem)!;
    const kyElem = (Object.keys(CONTROLS) as Element[]).find((e) => CONTROLS[e] === dtElem)!;
    const nguyenRows = lucHao.rows.filter((r) => r.element === nguyenElem);
    const kyRows = lucHao.rows.filter((r) => r.element === kyElem);
    const nguyenActive = nguyenRows.some((r) => r.moving || r.strength.score >= 4);
    const kyActive = kyRows.some((r) => r.moving && r.strength.score >= 4);
    nguyenKyComment = `Nguyên thần (${nguyenElem} sinh Dụng thần): ${
      nguyenRows.length ? `có ${nguyenRows.length} hào (${nguyenActive ? "vượng/động trợ lực tốt" : "tĩnh/bình"})` : "không hiện rõ"
    }. Kỵ thần (${kyElem} khắc Dụng thần): ${
      kyRows.length ? `có ${kyRows.length} hào (${kyActive ? "đang vượng động cần đề phòng cản trở" : "yên tĩnh, ít gây hại"})` : "không hiện"
    }.`;
  }

  const dtComment = primaryDt
    ? `Dụng thần (${dtInfo.rel}) tại Hào ${primaryDt.position} (${primaryDt.branch} – ${primaryDt.element}, ${SPIRIT_MEANINGS[primaryDt.spirit]}), trạng thái ${primaryDt.strength.state}${
        primaryDt.tuanKhong ? ", lâm Tuần Không" : ""
      }. Tương tác Nhật Thần (${lucHao.dayCanChi.branch}): ${analyzeDayInteraction(primaryDt, lucHao.dayCanChi.branch)}.${
        primaryDt.moving && primaryDt.changedRelation
          ? ` Hào ĐỘNG biến ${primaryDt.changedRelation} ${primaryDt.changedBranch} (${primaryDt.changedElement}) — ${compareElements(primaryDt.changedElement!, primaryDt.element)}.`
          : ""
      }`
    : hidden
    ? `Dụng thần (${dtInfo.rel}) KHÔNG hiện trên quẻ Bản mà đang ẨN PHỤC (Phục Thần) dưới Hào ${hidden.position} (Phi Thần là ${hidden.phiRelation} ${hidden.phiBranch}–${hidden.phiElement}; Phục Thần là ${hidden.phucBranch}–${hidden.phucElement}). Quan hệ Phi–Phục: ${compareElements(hidden.phiElement, hidden.phucElement)}.`
    : `Dụng thần (${dtInfo.rel}) ẩn phục, cần chờ thời điểm Nguyệt/Nhật kiến kích hoạt.`;

  const shiYingComment = `Hào Thế tại Hào ${shiRow.position} (${shiRow.relation} ${shiRow.branch} – ${shiRow.element}, ${shiRow.strength.state}, lâm ${SPIRIT_MEANINGS[shiRow.spirit]}); Hào Ứng tại Hào ${yingRow.position} (${yingRow.relation} ${yingRow.branch} – ${yingRow.element}, ${yingRow.strength.state}). Tương quan Thế–Ứng: ${compareElements(shiRow.element, yingRow.element)}. Nhật thần tác động lên Thế: ${analyzeDayInteraction(shiRow, lucHao.dayCanChi.branch)}.`;

  const baseText = HEXAGRAM_TEXTS[base.id];
  const changedText = changed ? HEXAGRAM_TEXTS[changed.id] : null;
  const structNote =
    structureType === "Lục Xung Quái"
      ? " [Lục Xung Quái: sự việc diễn biến nhanh, dễ phân tán hoặc thay đổi đột ngột]"
      : structureType === "Lục Hợp Quái"
      ? " [Lục Hợp Quái: sự việc có xu hướng gắn kết, hòa hợp, tiến triển bền]"
      : "";

  const stageComment =
    `Quẻ Bản #${base.id} ${base.hanViet}${structNote} ("${baseText?.thoan ?? ""}")` +
    ` | Quẻ Hỗ #${mutual.id} ${mutual.hanViet}` +
    (changed ? ` | Quẻ Biến #${changed.id} ${changed.hanViet} ("${changedText?.thoan ?? ""}")` : "") +
    (inverse && opposite ? ` | Tham chiếu Đảo Quái: #${inverse.id} ${inverse.hanViet}; Bàng Thông (Đối): #${opposite.id} ${opposite.hanViet}.` : ".");

  const focalHaoText = getChuHyFocalTexts(base.id, changed?.id ?? null, movingPositions);

  const actionAdvice =
    primaryDt && primaryDt.strength.score >= 4 && !primaryDt.tuanKhong
      ? "Dụng thần đang Vượng/Tướng: Thời vận thuận lợi để chủ động triển khai kế hoạch, giữ vững kỷ luật và tận dụng sự trợ lực từ Nguyên thần."
      : primaryDt && primaryDt.tuanKhong
      ? "Dụng thần lâm Không Vong: Nên chuẩn bị kỹ lưỡng nguồn lực, tránh quyết định vội vàng trong tuần hiện tại; chờ ngày xung thực hoặc xuất Không hãy hành động."
      : "Dụng thần Hưu/Tù/Tử hoặc ẩn phục: Ưu tiên phòng thủ, củng cố nội lực và tìm yếu tố tương sinh (Nguyên thần) trước khi mở rộng.";

  return {
    headline: changed
      ? `Quẻ ${base.hanViet} biến ${changed.hanViet} (${movingPositions.length} hào động)`
      : `Quẻ ${base.hanViet} (Quẻ tĩnh)`,
    overview: `Chủ đề: ${TOPIC_LABELS[topic]} — "${question}". Ngày ${lucHao.dayCanChi.name} (Tuần Không: ${lucHao.dayCanChi.tuanKhong.join(", ")}), Nguyệt kiến ${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element}).`,
    chuHyRule,
    sections: [
      { title: "1. Diễn tiến Đa Chiều (Bản – Hỗ – Biến – Đảo – Đối)", body: stageComment },
      { title: "2. Quy tắc Chu Hy & Hào Từ Trọng Tâm", body: `${chuHyRule} ${focalHaoText}` },
      { title: `3. Phân tích Dụng Thần (${dtInfo.rel}), Phục Thần & Nhật Thần`, body: `${dtInfo.reason} ${dtComment}` },
      { title: "4. Nguyên Thần & Kỵ Thần", body: nguyenKyComment || "Xem theo quan hệ Phi Thần – Phục Thần nêu trên." },
      { title: "5. Tương quan Thế – Ứng & Lục Thú", body: shiYingComment },
      { title: "6. Khuyến nghị hành động", body: actionAdvice },
    ],
    evidence: [
      { factor: "Quẻ Bản", effect: "neutral", detail: `#${base.id} ${base.hanViet} (${structureType})` },
      { factor: "Quẻ Biến", effect: changed ? "positive" : "neutral", detail: changed ? `#${changed.id} ${changed.hanViet}` : "Không biến" },
      { factor: "Dụng Thần", effect: primaryDt && primaryDt.strength.score >= 4 ? "positive" : "neutral", detail: primaryDt ? `H${primaryDt.position} ${primaryDt.relation} (${primaryDt.strength.state})` : hidden ? `Ẩn dưới H${hidden.position}` : "Ẩn phục" },
      { factor: "Nguyệt Kiến", effect: "neutral", detail: `${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element})` },
      { factor: "Tuần Không", effect: "neutral", detail: lucHao.dayCanChi.tuanKhong.join(", ") },
    ],
    caveat: "Kết quả mang tính tham khảo triết lý và hỗ trợ tự phản tỉnh quyết định, không phải dự báo khoa học.",
  };
}
