import type { BatTrachDirection } from "./batTrach.ts";
import { dayCanChi, monthNguyetKien, STEMS, BRANCHES, julianDayNumber } from "./lunarCanChi.ts";

export interface Mountain24 {
  name: string;
  palace: number;
  direction: string;
  yuanLong: "Địa" | "Thiên" | "Nhân";
  polarity: "Dương" | "Âm";
}

export const MOUNTAINS_24: Mountain24[] = [
  { name: "Nhâm", palace: 1, direction: "Bắc", yuanLong: "Địa", polarity: "Dương" },
  { name: "Tý", palace: 1, direction: "Bắc", yuanLong: "Thiên", polarity: "Âm" },
  { name: "Quý", palace: 1, direction: "Bắc", yuanLong: "Nhân", polarity: "Âm" },
  { name: "Sửu", palace: 8, direction: "Đông Bắc", yuanLong: "Địa", polarity: "Âm" },
  { name: "Cấn", palace: 8, direction: "Đông Bắc", yuanLong: "Thiên", polarity: "Dương" },
  { name: "Dần", palace: 8, direction: "Đông Bắc", yuanLong: "Nhân", polarity: "Dương" },
  { name: "Giáp", palace: 3, direction: "Đông", yuanLong: "Địa", polarity: "Dương" },
  { name: "Mão", palace: 3, direction: "Đông", yuanLong: "Thiên", polarity: "Âm" },
  { name: "Ất", palace: 3, direction: "Đông", yuanLong: "Nhân", polarity: "Âm" },
  { name: "Thìn", palace: 4, direction: "Đông Nam", yuanLong: "Địa", polarity: "Âm" },
  { name: "Tốn", palace: 4, direction: "Đông Nam", yuanLong: "Thiên", polarity: "Dương" },
  { name: "Tỵ", palace: 4, direction: "Đông Nam", yuanLong: "Nhân", polarity: "Dương" },
  { name: "Bính", palace: 9, direction: "Nam", yuanLong: "Địa", polarity: "Dương" },
  { name: "Ngọ", palace: 9, direction: "Nam", yuanLong: "Thiên", polarity: "Âm" },
  { name: "Đinh", palace: 9, direction: "Nam", yuanLong: "Nhân", polarity: "Âm" },
  { name: "Mùi", palace: 2, direction: "Tây Nam", yuanLong: "Địa", polarity: "Âm" },
  { name: "Khôn", palace: 2, direction: "Tây Nam", yuanLong: "Thiên", polarity: "Dương" },
  { name: "Thân", palace: 2, direction: "Tây Nam", yuanLong: "Nhân", polarity: "Dương" },
  { name: "Canh", palace: 7, direction: "Tây", yuanLong: "Địa", polarity: "Dương" },
  { name: "Dậu", palace: 7, direction: "Tây", yuanLong: "Thiên", polarity: "Âm" },
  { name: "Tân", palace: 7, direction: "Tây", yuanLong: "Nhân", polarity: "Âm" },
  { name: "Tuất", palace: 6, direction: "Tây Bắc", yuanLong: "Địa", polarity: "Âm" },
  { name: "Càn", palace: 6, direction: "Tây Bắc", yuanLong: "Thiên", polarity: "Dương" },
  { name: "Hợi", palace: 6, direction: "Tây Bắc", yuanLong: "Nhân", polarity: "Dương" },
];

const LUO_SHU_ORDER = [5, 6, 7, 8, 9, 1, 2, 3, 4];
export const PALACE_NAMES: Record<number, string> = {
  1: "Khảm (Bắc)", 2: "Khôn (Tây Nam)", 3: "Chấn (Đông)", 4: "Tốn (Đông Nam)",
  5: "Trung Cung", 6: "Càn (Tây Bắc)", 7: "Đoài (Tây)", 8: "Cấn (Đông Bắc)", 9: "Ly (Nam)",
};

export const STAR_MEANINGS: Record<number, string> = {
  1: "Nhất Bạch (Thủy): Văn chương, quý nhân, tài lộc tương lai",
  2: "Nhị Hắc (Thổ): Bệnh phù (khi suy), điền sản (khi vượng)",
  3: "Tam Bích (Mộc): Thị phi, tranh chấp (cần Hỏa hóa giải)",
  4: "Tứ Lục (Mộc): Học hành, văn nghệ, đào hoa",
  5: "Ngũ Hoàng (Thổ): Đại sát (kỵ động thổ; dùng Kim tĩnh hóa giải)",
  6: "Lục Bạch (Kim): Quyền lực, kỷ luật, quý nhân",
  7: "Thất Xích (Kim): Khẩu thiệt, hao tài (dùng Thủy tĩnh hóa giải)",
  8: "Bát Bạch (Thổ): Điền sản, tài lộc ổn định",
  9: "Cửu Tử (Hỏa): Đương vận Vận 9 — Hỷ sự, danh tiếng, vượng tài",
};

function flyStars(centerStar: number, forward: boolean): Record<number, number> {
  const chart: Record<number, number> = {};
  LUO_SHU_ORDER.forEach((palace, step) => {
    const val = ((((centerStar - 1 + (forward ? step : -step)) % 9) + 9) % 9) + 1;
    chart[palace] = val;
  });
  return chart;
}

function yuanLongForward(starNum: number, yuanLong: string, fallback: "Dương" | "Âm"): boolean {
  if (starNum === 5) return fallback === "Dương";
  const found = MOUNTAINS_24.find((m) => m.palace === starNum && m.yuanLong === yuanLong);
  return (found?.polarity ?? fallback) === "Dương";
}

export function calcFlyingStars(period: number, facingDeg: number) {
  const deg = ((facingDeg % 360) + 360) % 360;
  const shifted = ((deg - 337.5) % 360 + 360) % 360;
  const idx = Math.floor(shifted / 15);
  const offset = shifted % 15;
  let boundaryWarning: string | null = null;
  if (offset < 1.5 || offset > 13.5) {
    const isGua = (idx % 3 === 0 && offset < 1.5) || (idx % 3 === 2 && offset > 13.5);
    boundaryWarning = isGua ? "Đại Không Vong (Ranh giới 8 Quái)" : "Tiểu Không Vong (Ranh giới 2 Sơn)";
  }

  const facing = MOUNTAINS_24[idx];
  const sitting = MOUNTAINS_24[(idx + 12) % 24];
  const baseChart = flyStars(period, true);

  const sCenter = baseChart[sitting.palace];
  const fCenter = baseChart[facing.palace];
  const sFwd = yuanLongForward(sCenter, sitting.yuanLong, sitting.polarity);
  const fFwd = yuanLongForward(fCenter, facing.yuanLong, facing.polarity);

  const mountainStars = flyStars(sCenter, sFwd);
  const facingStars = flyStars(fCenter, fFwd);

  const sAtSit = mountainStars[sitting.palace];
  const fAtSit = facingStars[sitting.palace];
  const sAtFac = mountainStars[facing.palace];
  const fAtFac = facingStars[facing.palace];

  let pattern = "Cách cục hỗn hợp (Cần phối hợp Loan Đầu & Lưu Niên)";
  if (sAtSit === period && fAtFac === period) pattern = "Vượng Sơn Vượng Hướng (Đinh Tài Lưỡng Vượng)";
  else if (sAtFac === period && fAtFac === period) pattern = "Song Tinh Đáo Hướng (Vượng Tài, cần chú ý Sơn/Nhân Đinh)";
  else if (sAtSit === period && fAtSit === period) pattern = "Song Tinh Đáo Sơn (Vượng Đinh, cần Thủy pháp kích Tài)";
  else if (fAtSit === period && sAtFac === period) pattern = "Thượng Sơn Hạ Thủy (Đảo ngược Vận, dễ hao tài nếu thiếu Loan Đầu)";

  const palaces = [4, 9, 2, 3, 5, 7, 8, 1, 6].map((p) => ({
    palace: p,
    name: PALACE_NAMES[p],
    mountainStar: mountainStars[p],
    baseStar: baseChart[p],
    facingStar: facingStars[p],
    isFacing: p === facing.palace,
    isSitting: p === sitting.palace,
  }));

  return { period, facingDeg: Math.round(deg * 10) / 10, facing, sitting, boundaryWarning, pattern, palaces };
}

export function buildLayoutAdvice(directions: BatTrachDirection[]) {
  const good = directions.filter((d) => d.type === "Cát");
  const bad = directions.filter((d) => d.type === "Hung");
  const sinhKhi = good.find((d) => d.star === "Sinh Khí") ?? good[0];
  const thienY = good.find((d) => d.star === "Thiên Y") ?? good[1];
  const dienNien = good.find((d) => d.star === "Diên Niên") ?? good[2];
  const phucVi = good.find((d) => d.star === "Phục Vị") ?? good[3];

  return [
    { item: "Cửa chính / Hướng nhà", place: `${sinhKhi.direction} (${sinhKhi.star}) hoặc ${dienNien.direction} (${dienNien.star})`, note: "Đón vượng khí, tài lộc và hòa khí gia đạo." },
    { item: "Phòng ngủ chính & Đầu giường", place: `${thienY.direction} (${thienY.star}) hoặc ${dienNien.direction} (${dienNien.star})`, note: "Tốt cho sức khỏe, giấc ngủ sâu; tránh đầu giường tựa cửa sổ/WC." },
    { item: "Bếp nấu (Tọa Hung Hướng Cát)", place: `Đặt tại cung ${bad[0]?.direction} (${bad[0]?.star}), mặt bếp quay về ${thienY.direction} (${thienY.star})`, note: "Thiêu đốt khí xấu, hướng về cung tốt để nuôi dưỡng sức khỏe." },
    { item: "Bàn thờ gia tiên", place: `Tọa tại cung vững, mặt quay về ${phucVi.direction} (${phucVi.star}) hoặc ${sinhKhi.direction}`, note: "Trang nghiêm, yên tĩnh, tránh đối diện cửa WC hoặc dưới xà ngang." },
    { item: "Bàn làm việc (Nhà & Văn phòng)", place: `Ngồi quay mặt về ${sinhKhi.direction} (${sinhKhi.star}) hoặc ${phucVi.direction} (${phucVi.star})`, note: "Lưng tựa tường vững (Tọa Sơn), tránh ngồi quay lưng ra cửa chính." },
    { item: "Két sắt / Quầy thu ngân", place: `Góc tài vị thuộc cung ${sinhKhi.direction} hoặc ${thienY.direction}`, note: "Kín đáo, tụ khí, tránh đặt dưới gầm cầu thang hoặc đối diện cửa ra vào." },
    { item: "Nhà vệ sinh / Kho", place: `Đặt tại cung ${bad[3]?.direction} (${bad[3]?.star}) hoặc ${bad[2]?.direction} (${bad[2]?.star})`, note: "Dùng thủy uế trấn áp cung Hung, giữ khô ráo thông thoáng." },
  ];
}

const TRUC_12 = [
  ["Kiến", "Bình", "Tốt cho khởi sự, xuất hành; kỵ động thổ"],
  ["Trừ", "Cát", "Tốt cho dọn dẹp, chữa bệnh, giải trừ"],
  ["Mãn", "Bình", "Tốt cho khai trương, cầu tài, tế tự"],
  ["Bình", "Bình", "Bình hòa, hợp việc thường nhật"],
  ["Định", "Cát", "Tốt cho ký kết, giao dịch, nhập trạch, cưới hỏi"],
  ["Chấp", "Bình", "Tốt cho xây dựng, khởi công, thu nạp"],
  ["Phá", "Hung", "Đại kỵ (Nguyệt Phá), chỉ hợp phá dỡ"],
  ["Nguy", "Hung", "Nguy hiểm, kỵ đi xa, khởi công lớn"],
  ["Thành", "Đại Cát", "Rất tốt cho khai trương, nhập trạch, ký kết"],
  ["Thu", "Bình", "Tốt cho thu hoạch, thu nợ, nhập kho"],
  ["Khai", "Đại Cát", "Rất tốt cho khai trương, động thổ, xuất hành"],
  ["Bế", "Hung", "Đóng kín, kỵ khai trương, xuất hành"],
] as const;

const HOANG_DAO_12 = [
  ["Thanh Long", "Hoàng Đạo"], ["Minh Đường", "Hoàng Đạo"], ["Thiên Hình", "Hắc Đạo"],
  ["Chu Tước", "Hắc Đạo"], ["Kim Quỹ", "Hoàng Đạo"], ["Thiên Đức", "Hoàng Đạo"],
  ["Bạch Hổ", "Hắc Đạo"], ["Ngọc Đường", "Hoàng Đạo"], ["Thiên Lao", "Hắc Đạo"],
  ["Huyền Vũ", "Hắc Đạo"], ["Tư Mệnh", "Hoàng Đạo"], ["Câu Trần", "Hắc Đạo"],
] as const;
const TL_START: Record<number, number> = { 2: 0, 8: 0, 3: 2, 9: 2, 4: 4, 10: 4, 5: 6, 11: 6, 6: 8, 0: 8, 7: 10, 1: 10 };

export function calcTrachNhat(year: number, month: number, day: number) {
  const cc = dayCanChi(year, month, day);
  const nk = monthNguyetKien(year, month, day);
  const mIdx = BRANCHES.indexOf(nk.branch as (typeof BRANCHES)[number]);
  const truc = TRUC_12[((cc.branchIdx - mIdx) % 12 + 12) % 12];
  const hd = HOANG_DAO_12[((cc.branchIdx - TL_START[mIdx]) % 12 + 12) % 12];
  const jdn = julianDayNumber(year, month, day);
  return {
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    jdn,
    dayCanChi: cc.name,
    monthBranch: nk.branch,
    truc: { name: truc[0], rating: truc[1], desc: truc[2] },
    hoangDao: { star: hd[0], type: hd[1] },
    stem: STEMS[cc.stemIdx],
  };
}

export function detailedFengShuiAnalysis(
  batTrach: { cungPhi: string; element: string; group: string; directions: BatTrachDirection[] },
  flyingStars: ReturnType<typeof calcFlyingStars>
) {
  const facingDir = flyingStars.facing.direction;
  const matchDir = batTrach.directions.find((d) => d.direction === facingDir);
  const facingPalace = flyingStars.palaces.find((p) => p.isFacing)!;
  const sittingPalace = flyingStars.palaces.find((p) => p.isSitting)!;

  const remedies: string[] = [];
  for (const p of flyingStars.palaces) {
    if (p.facingStar === 5 || p.mountainStar === 5) {
      remedies.push(`${p.name}: Có Ngũ Hoàng (Thổ) — giữ yên tĩnh, tránh động thổ; dùng Kim tĩnh (chuông gió đồng 6 ống hoặc hồ lô đồng) để tiết Thổ.`);
    } else if (p.facingStar === 2) {
      remedies.push(`${p.name}: Có Nhị Hắc (Thổ) ở Hướng tinh — dùng vật phẩm Kim (đồng xu cổ, đồ kim loại tròn) để hóa giải bệnh phù.`);
    } else if (p.facingStar === 3) {
      remedies.push(`${p.name}: Có Tam Bích (Mộc) ở Hướng tinh — dùng ánh sáng ấm hoặc thảm đỏ (Hỏa) để tiết Mộc khí thị phi.`);
    }
  }

  return [
    {
      title: "1. Đánh giá Hướng Nhà theo Bát Trạch Gia Chủ",
      body: matchDir
        ? `Nhà hướng ${facingDir} (Sơn ${flyingStars.facing.name}) gặp cung ${matchDir.palace} – sao ${matchDir.star} (${matchDir.rating}, ${matchDir.type}) đối với gia chủ Cung ${batTrach.cungPhi} (${batTrach.group}). ${
            matchDir.type === "Cát"
              ? "Hướng nhà hợp mệnh trạch, thuận lợi đón cát khí tự nhiên."
              : "Hướng nhà chưa hợp cung phi Bát Trạch; nên ưu tiên xoay hướng Bếp, Bàn thờ và Bàn làm việc về các cung Sinh Khí / Thiên Y để cân bằng."
          }`
        : `Gia chủ thuộc ${batTrach.group} (${batTrach.cungPhi} – ${batTrach.element}).`,
    },
    {
      title: `2. Giải mã Huyền Không Phi Tinh Vận ${flyingStars.period}`,
      body: `Cách cục: ${flyingStars.pattern}. Tại cung Hướng (${facingPalace.name}) có cặp Sơn ${facingPalace.mountainStar} – Hướng ${facingPalace.facingStar} (${STAR_MEANINGS[facingPalace.facingStar]}). Tại cung Tọa (${sittingPalace.name}) có cặp Sơn ${sittingPalace.mountainStar} – Hướng ${sittingPalace.facingStar}. ${
        flyingStars.boundaryWarning ? `Cảnh báo: Độ số đang sát ${flyingStars.boundaryWarning}, cần đo lại bằng la bàn chính xác.` : ""
      }`,
    },
    {
      title: "3. Hóa giải Ngũ Hành các cung có Hung Tinh",
      body: remedies.length ? remedies.join(" ") : "Các cung trọng yếu không phạm Ngũ Hoàng/Nhị Hắc trực tiếp ở hướng; duy trì không gian thông thoáng, sạch sẽ.",
    },
  ];
}
