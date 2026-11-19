import { BRANCHES, STEMS } from "./lunarCanChi.ts";

const NAP_AM_30: [string, string][] = [
  ["Hải Trung Kim", "Kim"], ["Lư Trung Hỏa", "Hỏa"], ["Đại Lâm Mộc", "Mộc"],
  ["Lộ Bàng Thổ", "Thổ"], ["Kiếm Phong Kim", "Kim"], ["Sơn Đầu Hỏa", "Hỏa"],
  ["Giản Hạ Thủy", "Thủy"], ["Thành Đầu Thổ", "Thổ"], ["Bạch Lạp Kim", "Kim"],
  ["Dương Liễu Mộc", "Mộc"], ["Tuyền Trung Thủy", "Thủy"], ["Ốc Thượng Thổ", "Thổ"],
  ["Tích Lịch Hỏa", "Hỏa"], ["Tùng Bách Mộc", "Mộc"], ["Trường Lưu Thủy", "Thủy"],
  ["Sa Trung Kim", "Kim"], ["Sơn Hạ Hỏa", "Hỏa"], ["Bình Địa Mộc", "Mộc"],
  ["Bích Thượng Thổ", "Thổ"], ["Kim Bạch Kim", "Kim"], ["Phúc Đăng Hỏa", "Hỏa"],
  ["Thiên Hà Thủy", "Thủy"], ["Đại Trạch Thổ", "Thổ"], ["Thoa Xuyến Kim", "Kim"],
  ["Tang Đố Mộc", "Mộc"], ["Đại Khê Thủy", "Thủy"], ["Sa Trung Thổ", "Thổ"],
  ["Thiên Thượng Hỏa", "Hỏa"], ["Thạch Lựu Mộc", "Mộc"], ["Đại Hải Thủy", "Thủy"],
];

const CUNG_CHUC = [
  "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc",
  "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Nữ", "Phu Thê", "Huynh Đệ",
];

const TU_HOA: Record<string, [string, string, string, string]> = {
  Giáp: ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"],
  Ất: ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],
  Bính: ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"],
  Đinh: ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],
  Mậu: ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],
  Kỷ: ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"],
  Canh: ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"],
  Tân: ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"],
  Nhâm: ["Thiên Lương", "Tử Vi", "Tả Phụ", "Vũ Khúc"],
  Quý: ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"],
};

// Lộc Tồn theo Thiên Can năm (0=Tý..11=Hợi): Giáp->Dần(2), Ất->Mão(3), Bính/Mậu->Tỵ(5), Đinh/Kỷ->Ngọ(6), Canh->Thân(8), Tân->Dậu(9), Nhâm->Hợi(11), Quý->Tý(0)
const LOC_TON_IDX: Record<string, number> = {
  Giáp: 2, Ất: 3, Bính: 5, Đinh: 6, Mậu: 5, Kỷ: 6, Canh: 8, Tân: 9, Nhâm: 11, Quý: 0,
};
// Khôi / Việt theo Thiên Can năm
const KHOI_VIET: Record<string, [number, number]> = {
  Giáp: [1, 7], Mậu: [1, 7], Canh: [1, 7],
  Ất: [0, 8], Kỷ: [0, 8],
  Bính: [11, 9], Đinh: [11, 9],
  Nhâm: [3, 5], Quý: [3, 5],
  Tân: [6, 2],
};

const STAR_TRAITS: Record<string, string> = {
  "Tử Vi": "Đế tinh: Tôn quý, có tố chất lãnh đạo, trọng thể diện, thích tự chủ.",
  "Thiên Cơ": "Mưu sĩ: Thông minh, cơ biến, giỏi phân tích chiến lược nhưng hay suy nghĩ nhiều.",
  "Thái Dương": "Quý tinh: Quang minh, nhiệt huyết, cống hiến, hợp ngoại giao và quản lý.",
  "Vũ Khúc": "Tài tinh: Quyết đoán, thực tế, kỷ luật cao, mạnh về tài chính – kỹ thuật.",
  "Thiên Đồng": "Phúc tinh: Hòa nhã, thích hưởng thụ, tâm hồn nghệ thuật, dễ thích nghi.",
  "Liêm Trinh": "Tù tinh/Đào hoa: Nghiêm khắc, nguyên tắc, tham vọng mạnh, có duyên nghệ thuật.",
  "Thiên Phủ": "Lệnh tinh/Kho: Điềm đạm, giữ của tốt, bao dung, giỏi quản trị hậu cần.",
  "Thái Âm": "Phú tinh: Tinh tế, nội tâm sâu sắc, khéo tích lũy điền sản và tài chính.",
  "Tham Lang": "Đào hoa/Dục tinh: Đa tài, giao tiếp giỏi, thích khám phá, tham vọng lớn.",
  "Cự Môn": "Ám tinh/Ngôn luận: Sắc sảo, tư duy phản biện tốt, hợp luật, giảng dạy, truyền thông.",
  "Thiên Tướng": "Ấn tinh: Chính trực, trọng nghĩa khí, giỏi điều phối và trợ tá.",
  "Thiên Lương": "Ấm tinh: Nhân hậu, che chở, hợp y dược, giáo dục, nghiên cứu.",
  "Thất Sát": "Tướng tinh: Dũng mãnh, độc lập, dám nghĩ dám làm, cuộc đời nhiều bước ngoặt.",
  "Phá Quân": "Hao tinh: Tiên phong, đột phá, thích cải tổ cái cũ để dựng cái mới.",
};

function cucFromNapAm(elem: string): [string, number] {
  if (elem === "Thủy") return ["Thủy Nhị Cục", 2];
  if (elem === "Mộc") return ["Mộc Tam Cục", 3];
  if (elem === "Kim") return ["Kim Tứ Cục", 4];
  if (elem === "Thổ") return ["Thổ Ngũ Cục", 5];
  return ["Hỏa Lục Cục", 6];
}

export function calcZiweiChart(params: {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  hourBranchIdx: number;
  gender: "Nam" | "Nữ";
  viewYear?: number;
}) {
  const { lunarYear, lunarMonth, lunarDay, hourBranchIdx, gender, viewYear = 2026 } = params;
  const idx60 = (((lunarYear - 4) % 60) + 60) % 60;
  const yearStemIdx = idx60 % 10;
  const yearBranchIdx = idx60 % 12;
  const yearStem = STEMS[yearStemIdx];
  const yearBranch = BRANCHES[yearBranchIdx];
  const [napAm, napAmElem] = NAP_AM_30[Math.floor(idx60 / 2)];
  const isYangYear = yearStemIdx % 2 === 0;
  const isMale = gender === "Nam";
  const clockwise = (isYangYear && isMale) || (!isYangYear && !isMale);

  const menhIdx = (((2 + (lunarMonth - 1) - hourBranchIdx) % 12) + 12) % 12;
  const thanIdx = (2 + (lunarMonth - 1) + hourBranchIdx) % 12;

  const danStemIdx = ((yearStemIdx % 5) * 2 + 2) % 10;
  const menhStemIdx = (danStemIdx + ((menhIdx - 2 + 12) % 12)) % 10;

  let menh60 = 0;
  for (let k = 0; k < 60; k++) {
    if (k % 10 === menhStemIdx && k % 12 === menhIdx) {
      menh60 = k;
      break;
    }
  }
  const [, menhPalElem] = NAP_AM_30[Math.floor(menh60 / 2)];
  const [cucName, cucNum] = cucFromNapAm(menhPalElem);

  // An Tử Vi & Thiên Phủ
  const rem = lunarDay % cucNum;
  const borrow = rem === 0 ? 0 : cucNum - rem;
  const q = Math.floor((lunarDay + borrow) / cucNum);
  let zwOffset = q - 1;
  if (borrow > 0) zwOffset += borrow % 2 === 1 ? -borrow : borrow;
  const ziweiIdx = (((2 + zwOffset) % 12) + 12) % 12;
  const tianfuIdx = (((16 - ziweiIdx) % 12) + 12) % 12;

  const mainByBranch: Record<number, string[]> = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i, []]));
  const auxByBranch: Record<number, string[]> = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i, []]));
  const satByBranch: Record<number, string[]> = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i, []]));

  const zwGroup: [string, number][] = [
    ["Tử Vi", 0], ["Thiên Cơ", -1], ["Thái Dương", -3],
    ["Vũ Khúc", -4], ["Thiên Đồng", -5], ["Liêm Trinh", -8],
  ];
  for (const [name, off] of zwGroup) mainByBranch[(((ziweiIdx + off) % 12) + 12) % 12].push(name);

  const tfGroup: [string, number][] = [
    ["Thiên Phủ", 0], ["Thái Âm", 1], ["Tham Lang", 2], ["Cự Môn", 3],
    ["Thiên Tướng", 4], ["Thiên Lương", 5], ["Thất Sát", 6], ["Phá Quân", 10],
  ];
  for (const [name, off] of tfGroup) mainByBranch[(tianfuIdx + off) % 12].push(name);

  // Lục Cát Tinh: Tả Phụ (Thìn=4 thuận tháng), Hữu Bật (Tuất=10 nghịch tháng), Văn Xương (Tuất=10 nghịch giờ), Văn Khúc (Thìn=4 thuận giờ), Khôi Việt
  auxByBranch[(4 + lunarMonth - 1) % 12].push("Tả Phụ");
  auxByBranch[(((10 - (lunarMonth - 1)) % 12) + 12) % 12].push("Hữu Bật");
  auxByBranch[(((10 - hourBranchIdx) % 12) + 12) % 12].push("Văn Xương");
  auxByBranch[(4 + hourBranchIdx) % 12].push("Văn Khúc");
  const [khoi, viet] = KHOI_VIET[yearStem];
  auxByBranch[khoi].push("Thiên Khôi");
  auxByBranch[viet].push("Thiên Việt");

  // Lộc Tồn, Kình Dương (+1), Đà La (-1), Địa Không (Hợi=11 nghịch giờ), Địa Kiếp (Hợi=11 thuận giờ)
  const locIdx = LOC_TON_IDX[yearStem];
  auxByBranch[locIdx].push("Lộc Tồn");
  satByBranch[(locIdx + 1) % 12].push("Kình Dương");
  satByBranch[(locIdx + 11) % 12].push("Đà La");
  satByBranch[(((11 - hourBranchIdx) % 12) + 12) % 12].push("Địa Không");
  satByBranch[(11 + hourBranchIdx) % 12].push("Địa Kiếp");

  // Tuần Không (theo Can Chi năm sinh)
  const diff60 = ((yearBranchIdx - yearStemIdx) % 12 + 12) % 12;
  const tuanSet = new Set([(diff60 + 10) % 12, (diff60 + 11) % 12]);

  const [loc, quyen, khoa, ky] = TU_HOA[yearStem];
  const hoaMap: Record<string, string> = {
    [loc]: "Hóa Lộc", [quyen]: "Hóa Quyền", [khoa]: "Hóa Khoa", [ky]: "Hóa Kỵ",
  };

  // Lưu niên (năm xem)
  const viewIdx60 = (((viewYear - 4) % 60) + 60) % 60;
  const luuThaiTueBranchIdx = viewIdx60 % 12;
  const tuoiMu = viewYear - lunarYear + 1;

  const palaces = Array.from({ length: 12 }, (_, bIdx) => {
    const offsetFromMenh = (((menhIdx - bIdx) % 12) + 12) % 12;
    const stemOfPalace = STEMS[(danStemIdx + (((bIdx - 2) % 12 + 12) % 12)) % 10];
    const daiHanStep = clockwise ? ((bIdx - menhIdx + 12) % 12) : ((menhIdx - bIdx + 12) % 12);
    const daiHanStart = cucNum + daiHanStep * 10;
    const stars = mainByBranch[bIdx].map((s) => (hoaMap[s] ? `${s} (${hoaMap[s]})` : s));
    return {
      branchIdx: bIdx,
      branch: BRANCHES[bIdx],
      stem: stemOfPalace,
      cung: CUNG_CHUC[offsetFromMenh],
      isThan: bIdx === thanIdx,
      isTuan: tuanSet.has(bIdx),
      isLuuThaiTue: bIdx === luuThaiTueBranchIdx,
      daiHan: `${daiHanStart}–${daiHanStart + 9}`,
      daiHanStart,
      stars,
      auxStars: auxByBranch[bIdx],
      satStars: satByBranch[bIdx],
      rawStars: mainByBranch[bIdx],
    };
  });

  // Nhận diện cách cục kinh điển ở Tam Hợp Mệnh - Tài - Quan
  const tamHopBranches = [menhIdx, (menhIdx + 4) % 12, (menhIdx + 8) % 12];
  const tamHopMainStars = new Set(tamHopBranches.flatMap((i) => mainByBranch[i]));
  const tamHopAuxStars = new Set(tamHopBranches.flatMap((i) => auxByBranch[i]));
  const patterns: string[] = [];
  if (tamHopMainStars.has("Tử Vi") && tamHopMainStars.has("Thiên Phủ")) patterns.push("Tử Phủ Đồng Lâm / Triều Viên (Quyền quý, vững vàng)");
  if (tamHopMainStars.has("Thất Sát") && tamHopMainStars.has("Phá Quân") && tamHopMainStars.has("Tham Lang")) patterns.push("Sát Phá Tham (Năng động, đột phá, tự lập thành danh)");
  if (tamHopMainStars.has("Thiên Cơ") && tamHopMainStars.has("Thái Âm") && tamHopMainStars.has("Thiên Đồng") && tamHopMainStars.has("Thiên Lương")) patterns.push("Cơ Nguyệt Đồng Lương (Mưu lược, hợp công chức/chuyên môn/quản trị)");
  if (tamHopAuxStars.has("Tả Phụ") && tamHopAuxStars.has("Hữu Bật")) patterns.push("Tả Hữu Đồng Cung/Hội Chiếu (Có quý nhân, cộng sự đắc lực)");
  if (tamHopAuxStars.has("Văn Xương") && tamHopAuxStars.has("Văn Khúc")) patterns.push("Xương Khúc Hội Chiếu (Thông tuệ, văn chương, khoa bảng)");
  if (mainByBranch[menhIdx].length === 0 && tuanSet.has(menhIdx)) patterns.push("Mệnh Vô Chính Diệu đắc Tuần Không (Thông minh, biết ứng biến chuyển hóa)");

  const menhPalace = palaces[menhIdx];
  const mainTraitSummary = menhPalace.rawStars.length
    ? menhPalace.rawStars.map((s) => `${s}: ${STAR_TRAITS[s]}`).join(" ")
    : "Mệnh Vô Chính Diệu: Linh hoạt, dễ thích nghi, cần xem thêm cung Thiên Di đối chiếu.";

  const quanPalace = palaces.find((p) => p.cung === "Quan Lộc")!;
  const taiPalace = palaces.find((p) => p.cung === "Tài Bạch")!;
  const phuPalace = palaces.find((p) => p.cung === "Phu Thê")!;
  const tatPalace = palaces.find((p) => p.cung === "Tật Ách")!;
  const currentDaiHan = palaces.find((p) => tuoiMu >= p.daiHanStart && tuoiMu <= p.daiHanStart + 9);
  const luuThaiTuePalace = palaces[luuThaiTueBranchIdx];

  const THAN_DESC: Record<string, string> = {
    "Mệnh": "Thân Mệnh đồng cung: Tự lực cánh sinh, tính cách nhất quán từ trẻ đến già.",
    "Phúc Đức": "Thân cư Phúc Đức: Trọng đời sống tinh thần, gia tộc và phúc ấm.",
    "Quan Lộc": "Thân cư Quan Lộc: Đặt sự nghiệp và công danh làm trọng tâm nửa đời sau.",
    "Thiên Di": "Thân cư Thiên Di: Hợp đi xa, giao thương, mở rộng quan hệ bên ngoài.",
    "Tài Bạch": "Thân cư Tài Bạch: Nhạy bén với tài chính, kinh doanh, coi trọng độc lập kinh tế.",
    "Phu Thê": "Thân cư Phu Thê: Gia đình và người phối ngẫu ảnh hưởng lớn đến định hướng cuộc đời.",
  };

  const describePalace = (p: typeof menhPalace, emptyNote: string) =>
    p.rawStars.length
      ? `${p.stars.join(", ")} — ${p.rawStars.map((s) => STAR_TRAITS[s]).join(" ")}`
      : emptyNote;

  const detailedAnalysis = [
    {
      title: "1. Bản Mệnh, Cục Số & Cách Cục",
      body: `Tuổi ${yearStem} ${yearBranch} (${napAm}), ${cucName} (${clockwise ? "Đại hạn đi Thuận" : "Đại hạn đi Nghịch"}). ${THAN_DESC[palaces[thanIdx].cung] ?? ""} ${
        patterns.length ? `Cách cục nổi bật: ${patterns.join("; ")}.` : ""
      }`,
    },
    {
      title: "2. Tính cách & Nền tảng (Cung Mệnh)",
      body: `Cung Mệnh tại ${BRANCHES[menhIdx]}: ${mainTraitSummary} Cát tinh hội: ${menhPalace.auxStars.join(", ") || "Không"}. Sát tinh: ${menhPalace.satStars.join(", ") || "Không"}.`,
    },
    {
      title: "3. Công danh & Tài lộc (Quan Lộc – Tài Bạch)",
      body: `Quan Lộc (${quanPalace.branch}): ${describePalace(quanPalace, "Vô Chính Diệu: Hợp đa ngành, linh hoạt.")} | Tài Bạch (${taiPalace.branch}): ${describePalace(taiPalace, "Vô Chính Diệu: Cần kỷ luật tài chính.")}`,
    },
    {
      title: `4. Đại Hạn & Lưu Niên năm ${viewYear} (${STEMS[viewIdx60 % 10]} ${BRANCHES[luuThaiTueBranchIdx]}, ${tuoiMu} tuổi âm)`,
      body: `Đang ở Đại Hạn ${currentDaiHan ? `${currentDaiHan.daiHan} tuổi tại cung ${currentDaiHan.cung} (${currentDaiHan.branch})` : "—"}. Lưu Thái Tuế năm ${viewYear} đóng tại cung ${luuThaiTuePalace.cung} (${luuThaiTuePalace.branch}) có ${luuThaiTuePalace.stars.join(", ") || "Vô Chính Diệu"}, báo hiệu trọng tâm biến động năm nay xoay quanh phương diện ${luuThaiTuePalace.cung}.`,
    },
    {
      title: "5. Gia đạo, Sức khỏe & Tứ Hóa Tu Dưỡng",
      body: `Phu Thê (${phuPalace.branch}): ${phuPalace.stars.join(", ") || "Vô Chính Diệu"}. Tật Ách (${tatPalace.branch}): ${tatPalace.stars.join(", ") || "Vô Chính Diệu"}. Tứ Hóa: Lộc (${loc}) mở cơ hội, Quyền (${quyen}) tăng uy tín, Khoa (${khoa}) giải ách/học vấn, Kỵ (${ky}) là điểm cần tu dưỡng và phòng thị phi.`,
    },
  ];

  return {
    yearCanChi: `${yearStem} ${yearBranch}`,
    gender,
    napAm: `${napAm} (${napAmElem})`,
    cucName,
    menhBranch: BRANCHES[menhIdx],
    thanBranch: BRANCHES[thanIdx],
    thanCung: palaces[thanIdx].cung,
    tuHoa: { loc, quyen, khoa, ky },
    patterns,
    palaces,
    mainTraitSummary,
    detailedAnalysis,
  };
}
