import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { Hexagram, Interpretation, LucHaoResult } from "../types.ts";

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

export async function exportZiweiWord(zwChart: {
  yearCanChi: string;
  gender: string;
  napAm: string;
  cucName: string;
  menhBranch: string;
  thanCung: string;
  thanBranch: string;
  tuHoa: { loc: string; quyen: string; khoa: string; ky: string };
  palaces: { branch: string; stem: string; cung: string; isThan: boolean; stars: string[] }[];
  detailedAnalysis: { title: string; body: string }[];
}) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "BÁO CÁO LÁ SỐ TỬ VI ĐẨU SỐ", heading: HeadingLevel.HEADING_1 }),
          new Paragraph(`Tuổi: ${zwChart.yearCanChi} (${zwChart.gender}) | Bản Mệnh: ${zwChart.napAm} | Cục: ${zwChart.cucName}`),
          new Paragraph(`Mệnh tại: ${zwChart.menhBranch} | Thân cư: ${zwChart.thanCung} (${zwChart.thanBranch})`),
          new Paragraph(
            `Tứ Hóa Can Năm: Lộc (${zwChart.tuHoa.loc}) · Quyền (${zwChart.tuHoa.quyen}) · Khoa (${zwChart.tuHoa.khoa}) · Kỵ (${zwChart.tuHoa.ky})`
          ),
          new Paragraph({ text: "Bảng 12 Cung Mệnh Bàn", heading: HeadingLevel.HEADING_2 }),
          makeTable(
            ["Cung Chức", "Can Chi", "Chính Tinh & Tứ Hóa"],
            zwChart.palaces.map((p) => [
              `${p.cung}${p.isThan ? " (Thân)" : ""}`,
              `${p.stem} ${p.branch}`,
              p.stars.join(", ") || "(Vô Chính Diệu)",
            ])
          ),
          new Paragraph({ text: "Luận giải chuyên sâu", heading: HeadingLevel.HEADING_2 }),
          ...zwChart.detailedAnalysis.flatMap((s) => [
            new Paragraph({ children: [new TextRun({ text: s.title, bold: true })] }),
            new Paragraph(s.body),
          ]),
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
}) {
  const { batTrach, flyingStars, layoutAdvice, analysis } = params;
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
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `Bao_Cao_Phong_Thuy_${batTrach.lunarYear}.docx`);
}
