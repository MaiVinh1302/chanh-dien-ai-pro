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
  hourBranchIdx: number; // 0=Tý .. 11=Hợi
  gender: "Nam" | "Nữ";
}) {
  const { lunarYear, lunarMonth, lunarDay, hourBranchIdx, gender } = params;
  const idx60 = (((lunarYear - 4) % 60) + 60) % 60;
  const yearStemIdx = idx60 % 10;
  const yearStem = STEMS[yearStemIdx];
  const yearBranch = BRANCHES[idx60 % 12];
  const [napAm, napAmElem] = NAP_AM_30[Math.floor(idx60 / 2)];

  // Mệnh & Thân (Dần = index 2)
  const menhIdx = (((2 + (lunarMonth - 1) - hourBranchIdx) % 12) + 12) % 12;
  const thanIdx = (2 + (lunarMonth - 1) + hourBranchIdx) % 12;

  // Ngũ Hổ Độn khởi Can cung Dần
  const danStemIdx = ((yearStemIdx % 5) * 2 + 2) % 10;
  const menhStemIdx = (danStemIdx + ((menhIdx - 2 + 12) % 12)) % 10;

  // Tìm Can Chi cung Mệnh trong 60 Hoa Giáp để lấy Cục
  let menh60 = 0;
  for (let k = 0; k < 60; k++) {
    if (k % 10 === menhStemIdx && k % 12 === menhIdx) {
      menh60 = k;
      break;
    }
  }
  const [, menhPalElem] = NAP_AM_30[Math.floor(menh60 / 2)];
  const [cucName, cucNum] = cucFromNapAm(menhPalElem);

  // An sao Tử Vi
  const rem = lunarDay % cucNum;
  const borrow = rem === 0 ? 0 : cucNum - rem;
  const q = Math.floor((lunarDay + borrow) / cucNum);
  let zwOffset = q - 1;
  if (borrow > 0) {
    zwOffset += borrow % 2 === 1 ? -borrow : borrow;
  }
  const ziweiIdx = (((2 + zwOffset) % 12) + 12) % 12;
  const tianfuIdx = (((16 - ziweiIdx) % 12) + 12) % 12;

  const starsByBranch: Record<number, string[]> = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [i, []])
  );

  const zwGroup: [string, number][] = [
    ["Tử Vi", 0], ["Thiên Cơ", -1], ["Thái Dương", -3],
    ["Vũ Khúc", -4], ["Thiên Đồng", -5], ["Liêm Trinh", -8],
  ];
  for (const [name, off] of zwGroup) {
    starsByBranch[(((ziweiIdx + off) % 12) + 12) % 12].push(name);
  }

  const tfGroup: [string, number][] = [
    ["Thiên Phủ", 0], ["Thái Âm", 1], ["Tham Lang", 2], ["Cự Môn", 3],
    ["Thiên Tướng", 4], ["Thiên Lương", 5], ["Thất Sát", 6], ["Phá Quân", 10],
  ];
  for (const [name, off] of tfGroup) {
    starsByBranch[(tianfuIdx + off) % 12].push(name);
  }

  const [loc, quyen, khoa, ky] = TU_HOA[yearStem];
  const hoaMap: Record<string, string> = {
    [loc]: "Hóa Lộc", [quyen]: "Hóa Quyền", [khoa]: "Hóa Khoa", [ky]: "Hóa Kỵ",
  };

  const palaces = Array.from({ length: 12 }, (_, bIdx) => {
    const offsetFromMenh = (((menhIdx - bIdx) % 12) + 12) % 12;
    const stemOfPalace = STEMS[(danStemIdx + (((bIdx - 2) % 12 + 12) % 12)) % 10];
    const stars = starsByBranch[bIdx].map((s) => (hoaMap[s] ? `${s} (${hoaMap[s]})` : s));
    return {
      branchIdx: bIdx,
      branch: BRANCHES[bIdx],
      stem: stemOfPalace,
      cung: CUNG_CHUC[offsetFromMenh],
      isThan: bIdx === thanIdx,
      stars,
      rawStars: starsByBranch[bIdx],
    };
  });

  const menhPalace = palaces[menhIdx];
  const mainTraitSummary = menhPalace.rawStars.length
    ? menhPalace.rawStars.map((s) => `${s}: ${STAR_TRAITS[s]}`).join(" ")
    : "Mệnh Vô Chính Diệu: Linh hoạt, dễ thích nghi, cần xem thêm cung Thiên Di đối chiếu.";

  const quanPalace = palaces.find((p) => p.cung === "Quan Lộc")!;
  const taiPalace = palaces.find((p) => p.cung === "Tài Bạch")!;
  const phuPalace = palaces.find((p) => p.cung === "Phu Thê")!;
  const tatPalace = palaces.find((p) => p.cung === "Tật Ách")!;

  const THAN_DESC: Record<string, string> = {
    "Mệnh": "Thân Mệnh đồng cung: Tự lực cánh sinh, tính cách nhất quán từ trẻ đến già, tự quyết định vận mệnh.",
    "Phúc Đức": "Thân cư Phúc Đức: Trọng đời sống tinh thần, gia tộc và phúc đức; hậu vận hướng về an nhiên, tâm linh.",
    "Quan Lộc": "Thân cư Quan Lộc: Đặt sự nghiệp và công danh làm trọng tâm nửa đời sau, nhiệt huyết với công việc.",
    "Thiên Di": "Thân cư Thiên Di: Hợp đi xa, giao thương, mở rộng quan hệ bên ngoài; càng năng động càng dễ thành đạt.",
    "Tài Bạch": "Thân cư Tài Bạch: Nhạy bén với tài chính, kinh doanh, coi trọng độc lập kinh tế.",
    "Phu Thê": "Thân cư Phu Thê: Gia đình và người phối ngẫu có ảnh hưởng lớn đến định hướng cuộc đời.",
  };

  const describePalace = (p: typeof menhPalace, emptyNote: string) =>
    p.rawStars.length
      ? `${p.stars.join(", ")} — ${p.rawStars.map((s) => STAR_TRAITS[s]).join(" ")}`
      : emptyNote;

  const detailedAnalysis = [
    {
      title: "1. Bản Mệnh, Cục Số & Cư Thân",
      body: `Tuổi ${yearStem} ${yearBranch} (${napAm}), ${cucName}. ${THAN_DESC[palaces[thanIdx].cung] ?? ""}`,
    },
    {
      title: "2. Tính cách & Nền tảng (Cung Mệnh)",
      body: `Cung Mệnh tại ${BRANCHES[menhIdx]}: ${mainTraitSummary}`,
    },
    {
      title: "3. Công danh & Sự nghiệp (Cung Quan Lộc)",
      body: `Cung Quan Lộc tại ${quanPalace.branch}: ${describePalace(quanPalace, "Vô Chính Diệu tại Quan Lộc: Hợp làm đa ngành, tư vấn hoặc linh hoạt thay đổi môi trường.")}`,
    },
    {
      title: "4. Tài lộc & Quản trị dòng tiền (Cung Tài Bạch)",
      body: `Cung Tài Bạch tại ${taiPalace.branch}: ${describePalace(taiPalace, "Vô Chính Diệu tại Tài Bạch: Tài lộc đến từ sự khéo léo, hợp tác; nên giữ kỷ luật chi tiêu.")}`,
    },
    {
      title: "5. Gia đạo & Sức khỏe (Phu Thê – Tật Ách)",
      body: `Phu Thê (${phuPalace.branch}): ${phuPalace.stars.join(", ") || "Vô Chính Diệu"}. Tật Ách (${tatPalace.branch}): ${tatPalace.stars.join(", ") || "Vô Chính Diệu"}. Tứ Hóa Can Năm: Hóa Lộc (${loc}) mang cơ hội, Hóa Quyền (${quyen}) tăng uy tín, Hóa Khoa (${khoa}) giải ách/học vấn, Hóa Kỵ (${ky}) là điểm cần tu dưỡng và phòng thị phi.`,
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
    palaces,
    mainTraitSummary,
    detailedAnalysis,
  };
}
