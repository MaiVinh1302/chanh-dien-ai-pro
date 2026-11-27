import {
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { UploadedMedia } from "../components/MediaUploadPanel.tsx";
import type { Hexagram, Interpretation, LucHaoResult } from "../types.ts";

function buildMediaParagraphs(media?: UploadedMedia | null): Paragraph[] {
  if (!media) return [];
  const out: Paragraph[] = [
    new Paragraph({ text: `Tài liệu đính kèm: ${media.name}`, heading: HeadingLevel.HEADING_2 }),
  ];
  if (media.note) {
    out.push(new Paragraph(`Ghi chú: ${media.note}`));
  }
  if (!media.isPdf && media.bytes) {
    const imgType = media.mime.includes("png") ? "png" : "jpg";
    out.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: media.bytes,
            transformation: { width: 420, height: 300 },
            type: imgType,
          }),
        ],
      })
    );
  } else if (media.isPdf) {
    out.push(new Paragraph("(Đính kèm file PDF — xem trực tiếp trên ứng dụng web)."));
  }
  return out;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function makeTable(headers: string[], rows: string[][]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(
          (h) =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
            })
        ),
      }),
      ...rows.map(
        (r) =>
          new TableRow({
            children: r.map((cell) => new TableCell({ children: [new Paragraph(cell)] })),
          })
      ),
    ],
  });
}

export async function exportKinhDichWord(params: {
  question: string;
  base: Hexagram;
  changed: Hexagram | null;
  mutual: Hexagram;
  lucHao: LucHaoResult;
  interp: Interpretation;
}) {
  const { question, base, changed, mutual, lucHao, interp } = params;
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "BÁO CÁO LUẬN GIẢI KINH DỊCH & LỤC HÀO", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ children: [new TextRun({ text: `Câu hỏi: ${question}`, bold: true })] }),
          new Paragraph(
            `Ngày: ${lucHao.dayCanChi.name} | Tuần Không: ${lucHao.dayCanChi.tuanKhong.join(", ")} | Nguyệt Kiến: ${lucHao.nguyetKien.branch} (${lucHao.nguyetKien.element})`
          ),
          new Paragraph(
            `Quẻ Bản: #${base.id} ${base.hanViet} (${base.chinese}) | Quẻ Hỗ: #${mutual.id} ${mutual.hanViet} | Quẻ Biến: ${
              changed ? `#${changed.id} ${changed.hanViet}` : "Quẻ Tĩnh"
            }`
          ),
          new Paragraph({ text: "Bảng Lục Hào Kinh Phòng", heading: HeadingLevel.HEADING_2 }),
          makeTable(
            ["Hào", "Lục Thần", "Lục Thân", "Địa Chi", "Thế/Ứng", "Vượng Suy", "Biến / Ghi chú"],
            [...lucHao.rows].reverse().map((r) => [
              `H${r.position}${r.moving ? (r.value === 9 ? " (O)" : " (X)") : ""}`,
              r.spirit,
              r.relation,
              `${r.branch} (${r.element})`,
              r.shi ? "Thế" : r.ying ? "Ứng" : "",
              r.strength.state,
              `${r.tuanKhong ? "[Không] " : ""}${
                r.moving && r.changedBranch ? `→ ${r.changedRelation} ${r.changedBranch} (${r.changedElement})` : "—"
              }`,
            ])
          ),
          new Paragraph({ text: "Bình giải chi tiết", heading: HeadingLevel.HEADING_2 }),
          ...interp.sections.flatMap((s) => [
            new Paragraph({ children: [new TextRun({ text: s.title, bold: true })] }),
            new Paragraph(s.body),
          ]),
          new Paragraph({ children: [new TextRun({ text: interp.caveat, italics: true })] }),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Bao_Cao_Kinh_Dich_${base.id}.docx`);
}

export async function exportNhanTuongWord(
  sections: { title: string; body: string }[],
  media?: UploadedMedia | null,
  health?: {
    matched: { label: string; easternNote: string; modernLink: string; screeningTests: string }[];
    summary: string;
    disclaimer: string;
  } | null
) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "BÁO CÁO ĐÁNH GIÁ NHÂN TƯỚNG HỌC, CHỈ TAY & TẦM SOÁT SỨC KHỎE", heading: HeadingLevel.HEADING_1 }),
          ...sections.flatMap((s) => [
            new Paragraph({ children: [new TextRun({ text: s.title, bold: true })] }),
            new Paragraph(s.body),
          ]),
          ...(health && health.matched.length > 0
            ? [
                new Paragraph({ text: "Tầm soát sức khỏe qua Diện tướng & Bàn tay (Đông Y + Y học hiện đại)", heading: HeadingLevel.HEADING_2 }),
                makeTable(
                  ["Dấu hiệu", "Đông Y (Vọng chẩn)", "Y học Hiện đại", "Xét nghiệm gợi ý"],
                  health.matched.map((m) => [m.label, m.easternNote, m.modernLink, m.screeningTests])
                ),
                new Paragraph(health.summary),
                new Paragraph({ children: [new TextRun({ text: health.disclaimer, italics: true })] }),
              ]
            : []),
          ...buildMediaParagraphs(media),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, "Bao_Cao_Nhan_Tuong_Hoc.docx");
}

export async function exportBaziWord(
  bazi: {
    dayMaster: string;
    strengthLabel: string;
    dungThanAdvice: string;
    pillars: { label: string; stem: string; branch: string; stemElement: string; branchElement: string; tenGod: string; hiddenStems: { stem: string; tenGod: string }[] }[];
  },
  compat: { personA: string; personB: string; relation: string; verdict: string }
) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "BÁO CÁO BÁT TỰ (TỨ TRỤ) & HỢP TUỔI", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(`Nhật Chủ: ${bazi.dayMaster} — Trạng thái: ${bazi.strengthLabel}`),
          new Paragraph(`Dụng Thần Bát Tự gợi ý: ${bazi.dungThanAdvice}`),
          new Paragraph({ text: "Bảng Tứ Trụ & Thập Thần", heading: HeadingLevel.HEADING_2 }),
          makeTable(
            ["Trụ", "Can Chi", "Thập Thần", "Tàng Can"],
            bazi.pillars.map((p) => [
              p.label,
              `${p.stem} ${p.branch} (${p.stemElement}/${p.branchElement})`,
              p.tenGod,
              p.hiddenStems.map((h) => `${h.stem} (${h.tenGod})`).join(", "),
            ])
          ),
          new Paragraph({ text: "Đối chiếu Hợp Tuổi / Đối Tác", heading: HeadingLevel.HEADING_2 }),
          new Paragraph(`${compat.personA} ↔ ${compat.personB}: ${compat.relation}`),
          new Paragraph(compat.verdict),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, "Bao_Cao_Bat_Tu_Hop_Tuoi.docx");
}

export async function exportZiweiWord(
  zwChart: {
    fullName?: string;
    lunarDateStr?: string;
    yearCanChi: string;
    gender: string;
    napAm: string;
    cucName: string;
    menhChu?: string;
    thanChu?: string;
    menhBranch: string;
    thanCung: string;
    thanBranch: string;
    tuHoa: { loc: string; quyen: string; khoa: string; ky: string };
    palaces: {
      branch: string; stem: string; cung: string; isThan: boolean;
      isTuan?: boolean; isTriet?: boolean; trangSinh?: string; daiHan?: string;
      stars: string[]; auxStars?: string[]; satStars?: string[];
    }[];
    allPalaceReadings?: {
      cung: string; branch: string; meaning: string; mainText: string;
      sanFangText: string; flyText: string;
    }[];
    palaceScores?: { cung: string; score: number; evidence: string }[];
    monthlyForecast?: { month: number; cung: string; branch: string; rating: string; note: string }[];
    detailedAnalysis: { title: string; body: string }[];
  },
  synastry?: { modeLabel: string; summary: string; targetCompare: string; tuHoaInteraction: string } | null
) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: `BÁO CÁO LÁ SỐ TỬ VI ĐẨU SỐ — ${zwChart.fullName ?? "Đương số"}`, heading: HeadingLevel.HEADING_1 }),
          new Paragraph(`Âm lịch: ${zwChart.lunarDateStr ?? ""} | Tuổi: ${zwChart.yearCanChi} (${zwChart.gender}) | Bản Mệnh: ${zwChart.napAm} | Cục: ${zwChart.cucName}`),
          new Paragraph(`Mệnh tại: ${zwChart.menhBranch} | Thân cư: ${zwChart.thanCung} (${zwChart.thanBranch}) | Mệnh Chủ: ${zwChart.menhChu ?? "—"} | Thân Chủ: ${zwChart.thanChu ?? "—"}`),
          new Paragraph(
            `Tứ Hóa Can Năm: Lộc (${zwChart.tuHoa.loc}) · Quyền (${zwChart.tuHoa.quyen}) · Khoa (${zwChart.tuHoa.khoa}) · Kỵ (${zwChart.tuHoa.ky})`
          ),
          new Paragraph({ text: "Bảng 12 Cung Mệnh Bàn", heading: HeadingLevel.HEADING_2 }),
          makeTable(
            ["Cung Chức", "Can Chi / ĐH", "Chính Tinh", "Phụ / Sát Tinh & Tuần Triệt"],
            zwChart.palaces.map((p) => [
              `${p.cung}${p.isThan ? " (Thân)" : ""}`,
              `${p.stem} ${p.branch} (${p.trangSinh ?? ""}) ĐH:${p.daiHan ?? ""}`,
              p.stars.join(", ") || "(Vô Chính Diệu)",
              [...(p.auxStars ?? []), ...(p.satStars ?? []), p.isTuan ? "Tuần" : "", p.isTriet ? "Triệt" : ""].filter(Boolean).join(", ") || "—",
            ])
          ),
          new Paragraph({ text: "Luận giải chuyên sâu", heading: HeadingLevel.HEADING_2 }),
          ...zwChart.detailedAnalysis.flatMap((s) => [
            new Paragraph({ children: [new TextRun({ text: s.title, bold: true })] }),
            new Paragraph(s.body),
          ]),
          ...(zwChart.palaceScores
            ? [
                new Paragraph({ text: "Chấm điểm định lượng 6 phương diện", heading: HeadingLevel.HEADING_2 }),
                makeTable(
                  ["Phương diện", "Điểm (/100)", "Chứng cứ sao & Tam phương"],
                  zwChart.palaceScores.map((s) => [s.cung, String(s.score), s.evidence])
                ),
              ]
            : []),
          ...(zwChart.allPalaceReadings
            ? [
                new Paragraph({ text: "Chi tiết 12 Cung & Phi Tinh Tứ Hóa", heading: HeadingLevel.HEADING_2 }),
                ...zwChart.allPalaceReadings.flatMap((r) => [
                  new Paragraph({ children: [new TextRun({ text: `Cung ${r.cung} (${r.branch}) — ${r.meaning}`, bold: true })] }),
                  new Paragraph(`• Chính tinh: ${r.mainText} | Tam phương: ${r.sanFangText}`),
                  new Paragraph(`• Phi Tinh Tứ Hóa: ${r.flyText}`),
                ]),
              ]
            : []),
          ...(zwChart.monthlyForecast
            ? [
                new Paragraph({ text: "Dự báo Lưu Nguyệt 12 Tháng Âm Lịch", heading: HeadingLevel.HEADING_2 }),
                makeTable(
                  ["Tháng ÂL", "Cung / Chi", "Đánh giá", "Chi tiết"],
                  zwChart.monthlyForecast.map((m) => [`Tháng ${m.month}`, `${m.cung} (${m.branch})`, m.rating, m.note])
                ),
              ]
            : []),
          ...(synastry
            ? [
                new Paragraph({ text: `Song Bàn Đối Chiếu (${synastry.modeLabel})`, heading: HeadingLevel.HEADING_2 }),
                new Paragraph(synastry.summary),
                new Paragraph(synastry.targetCompare),
                new Paragraph(synastry.tuHoaInteraction),
              ]
            : []),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Bao_Cao_Tu_Vi_${zwChart.yearCanChi.replace(/\s+/g, "_")}.docx`);
}

export async function exportFengShuiWord(params: {
  batTrach: { lunarYear: number; gender: string; cungPhi: string; element: string; group: string };
  flyingStars: { period: number; facingDeg: number; facing: { name: string; direction: string }; sitting: { name: string; direction: string }; pattern: string };
  layoutAdvice: { item: string; place: string; note: string }[];
  analysis: { title: string; body: string }[];
  media?: UploadedMedia | null;
}) {
  const { batTrach, flyingStars, layoutAdvice, analysis, media } = params;
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "BÁO CÁO PHONG THỦY NHÀ Ở & VĂN PHÒNG", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(
            `Gia chủ: Sinh năm ${batTrach.lunarYear} (${batTrach.gender}) — Cung Phi: ${batTrach.cungPhi} (${batTrach.element}, ${batTrach.group})`
          ),
          new Paragraph(
            `Huyền Không Vận ${flyingStars.period}: Hướng ${flyingStars.facing.name} (${flyingStars.facing.direction}, ${flyingStars.facingDeg}°), Tọa ${flyingStars.sitting.name} — ${flyingStars.pattern}`
          ),
          new Paragraph({ text: "Tư vấn Bày trí Đồ đạc (Nhà ở & Văn phòng)", heading: HeadingLevel.HEADING_2 }),
          makeTable(
            ["Hạng mục", "Hướng / Vị trí đề xuất", "Nguyên tắc & Lưu ý"],
            layoutAdvice.map((r) => [r.item, r.place, r.note])
          ),
          new Paragraph({ text: "Bình giải & Hóa giải chi tiết", heading: HeadingLevel.HEADING_2 }),
          ...analysis.flatMap((s) => [
            new Paragraph({ children: [new TextRun({ text: s.title, bold: true })] }),
            new Paragraph(s.body),
          ]),
          ...buildMediaParagraphs(media),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Bao_Cao_Phong_Thuy_${batTrach.lunarYear}.docx`);
}
