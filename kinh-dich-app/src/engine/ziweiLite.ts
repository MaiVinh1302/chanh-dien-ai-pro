import { BRANCHES, STEMS } from "./lunarCanChi.ts";
import { convertSolar2Lunar } from "./vietnameseLunar.ts";

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

const LOC_TON_IDX: Record<string, number> = {
  Giáp: 2, Ất: 3, Bính: 5, Đinh: 6, Mậu: 5, Kỷ: 6, Canh: 8, Tân: 9, Nhâm: 11, Quý: 0,
};
const KHOI_VIET: Record<string, [number, number]> = {
  Giáp: [1, 7], Mậu: [1, 7], Canh: [1, 7],
  Ất: [0, 8], Kỷ: [0, 8],
  Bính: [11, 9], Đinh: [11, 9],
  Nhâm: [3, 5], Quý: [3, 5],
  Tân: [6, 2],
};
// Triệt theo Thiên Can năm (0=Tý..11=Hợi)
const TRIET_BY_STEM: Record<string, [number, number]> = {
  Giáp: [8, 9], Kỷ: [8, 9],     // Thân Dậu
  Ất: [6, 7], Canh: [6, 7],     // Ngọ Mùi
  Bính: [4, 5], Tân: [4, 5],    // Thìn Tỵ
  Đinh: [2, 3], Nhâm: [2, 3],   // Dần Mão
  Mậu: [0, 1], Quý: [0, 1],     // Tý Sửu
};

// Miếu/Vượng/Đắc/Bình/Hãm của 14 Chính Tinh theo 12 Chi (0=Tý..11=Hợi)
const BRIGHTNESS: Record<string, string[]> = {
  "Tử Vi":      ["B", "Đ", "M", "V", "V", "M", "M", "Đ", "M", "B", "V", "B"],
  "Thiên Cơ":   ["M", "H", "V", "V", "Đ", "B", "M", "H", "Đ", "M", "B", "B"],
  "Thái Dương": ["H", "H", "V", "M", "V", "V", "M", "Đ", "B", "H", "H", "H"],
  "Vũ Khúc":    ["V", "M", "Đ", "H", "M", "B", "V", "M", "Đ", "V", "M", "B"],
  "Thiên Đồng": ["V", "H", "Đ", "M", "B", "M", "H", "H", "V", "B", "B", "M"],
  "Liêm Trinh": ["B", "Đ", "M", "B", "V", "H", "B", "M", "M", "B", "V", "H"],
  "Thiên Phủ":  ["M", "M", "M", "B", "M", "Đ", "V", "M", "M", "B", "M", "V"],
  "Thái Âm":    ["M", "M", "H", "H", "H", "H", "H", "Đ", "Đ", "V", "M", "M"],
  "Tham Lang":  ["V", "M", "Đ", "H", "M", "H", "V", "M", "Đ", "H", "M", "H"],
  "Cự Môn":     ["V", "H", "M", "M", "H", "B", "V", "H", "M", "M", "H", "V"],
  "Thiên Tướng":["M", "Đ", "M", "H", "V", "Đ", "V", "Đ", "M", "H", "Đ", "Đ"],
  "Thiên Lương":["V", "V", "V", "M", "V", "H", "M", "Đ", "H", "H", "V", "H"],
  "Thất Sát":   ["V", "M", "M", "H", "V", "B", "M", "Đ", "M", "B", "M", "B"],
  "Phá Quân":   ["M", "V", "H", "H", "Đ", "H", "M", "V", "H", "H", "Đ", "H"],
};

const TRANG_SINH_12 = [
  "Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy",
  "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng",
];
// Khởi Tràng Sinh theo Cục: Thủy(2)->Thân(8), Mộc(3)->Hợi(11), Kim(4)->Tỵ(5), Thổ(5)->Thân(8), Hỏa(6)->Dần(2)
const TRANG_SINH_START: Record<number, number> = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };

// Mệnh Chủ (theo Chi cung Mệnh) & Thân Chủ (theo Chi năm sinh)
const MENH_CHU_BY_BRANCH = ["Tham Lang", "Cự Môn", "Lộc Tồn", "Văn Khúc", "Liêm Trinh", "Vũ Khúc", "Phá Quân", "Vũ Khúc", "Liêm Trinh", "Văn Khúc", "Lộc Tồn", "Cự Môn"];
const THAN_CHU_BY_BRANCH = ["Linh Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ", "Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ"];

const CUNG_MEANINGS: Record<string, string> = {
  "Mệnh": "Bản chất, tính cách cốt lõi, năng lực tự thân và định hướng cuộc đời.",
  "Phụ Mẫu": "Mối quan hệ với cha mẹ, cấp trên, người bảo trợ và nền tảng gia đình.",
  "Phúc Đức": "Đời sống tinh thần, tâm lý, phúc ấm dòng họ và khả năng hưởng thụ.",
  "Điền Trạch": "Nhà cửa, bất động sản, môi trường sống và tài sản cố định.",
  "Quan Lộc": "Công danh, sự nghiệp, phong cách làm việc và vị thế xã hội.",
  "Nô Bộc": "Bạn bè, đồng nghiệp, cộng sự, nhân viên và mạng lưới quan hệ.",
  "Thiên Di": "Xuất hành, giao tiếp xã hội, cơ hội bên ngoài và khả năng thích nghi.",
  "Tật Ách": "Sức khỏe thể chất, điểm yếu tạng phủ và cách phòng tránh bệnh tật.",
  "Tài Bạch": "Dòng tiền, năng lực kiếm tiền, quản lý tài chính và tích lũy.",
  "Tử Nữ": "Con cái, học trò, sản phẩm sáng tạo và thế hệ kế thừa.",
  "Phu Thê": "Hôn nhân, tình cảm đôi lứa, đối tác gắn bó lâu dài.",
  "Huynh Đệ": "Anh chị em, bạn thân ngang hàng và sự hỗ trợ nội bộ.",
};

const STAR_TRAITS: Record<string, { trait: string; appearance: string; career: string; alchemy: string }> = {
  "Tử Vi": {
    trait: "Đế tinh: Tôn quý, tự trọng cao, có khí chất lãnh đạo và bao quát.",
    appearance: "Dáng đĩnh đạc, trán đầy, ánh mắt uy nghiêm.",
    career: "Quản trị cấp cao, điều hành, cố vấn chiến lược.",
    alchemy: "Tránh độc đoán; phát huy lắng nghe và trao quyền.",
  },
  "Thiên Cơ": {
    trait: "Mưu sĩ: Thông minh, cơ biến, giỏi phân tích nhưng dễ suy nghĩ nhiều.",
    appearance: "Thân hình thanh thoát, ánh mắt linh hoạt.",
    career: "Công nghệ, kiến trúc, hoạch định, nghiên cứu.",
    alchemy: "Giảm lo âu quá mức bằng kỷ luật hành động từng bước.",
  },
  "Thái Dương": {
    trait: "Quý tinh: Quang minh, nhiệt huyết, thích cống hiến và bảo bọc.",
    appearance: "Gương mặt sáng, thần thái cởi mở.",
    career: "Ngoại giao, giáo dục, truyền thông, quản lý công.",
    alchemy: "Nếu hãm địa cần giữ sức khỏe mắt/tim mạch và tránh ôm đồm.",
  },
  "Vũ Khúc": {
    trait: "Tài tinh: Quyết đoán, thực tế, kỷ luật cao, trọng chữ tín.",
    appearance: "Khung xương gọn chắc, giọng nói dứt khoát.",
    career: "Tài chính, ngân hàng, kỹ thuật, quân sự/an ninh.",
    alchemy: "Cân bằng giữa nguyên tắc cứng rắn và sự mềm dẻo trong gia đạo.",
  },
  "Thiên Đồng": {
    trait: "Phúc tinh: Hòa nhã, thích an vui, giàu cảm xúc nghệ thuật.",
    appearance: "Nét mặt phúc hậu, nụ cười hiền.",
    career: "Dịch vụ, nghệ thuật, ẩm thực, giáo dục, tâm lý.",
    alchemy: "Tránh ỷ lại hoặc trì hoãn; đặt mục tiêu ngắn hạn rõ ràng.",
  },
  "Liêm Trinh": {
    trait: "Nguyên tắc & Đào hoa: Sắc sảo, tham vọng mạnh, trọng danh dự.",
    appearance: "Gương mặt góc cạnh, ánh mắt có thần.",
    career: "Pháp luật, thanh tra, quản lý dự án, thiết kế.",
    alchemy: "Kiểm soát nóng nảy; giữ minh bạch giấy tờ tài chính.",
  },
  "Thiên Phủ": {
    trait: "Kho tinh: Điềm đạm, giữ của tốt, bao dung, trọng ổn định.",
    appearance: "Dáng đẫy đà vừa phải, phong thái ung dung.",
    career: "Quản trị tài sản, ngân khố, bất động sản, hậu cần.",
    alchemy: "Mạnh về thủ thành; cần thêm đột phá khi thời cơ đến.",
  },
  "Thái Âm": {
    trait: "Phú tinh: Tinh tế, nội tâm sâu sắc, khéo tích lũy điền sản.",
    appearance: "Da sáng, nét mặt thanh tú nhẹ nhàng.",
    career: "Tài chính, bất động sản, nghệ thuật, y tế.",
    alchemy: "Nếu hãm địa tránh đa sầu; tăng vận động ngoài trời.",
  },
  "Tham Lang": {
    trait: "Đa tài & Khát vọng: Giao tiếp khéo, thích khám phá, tham vọng lớn.",
    appearance: "Ánh mắt thu hút, phong thái hoạt bát.",
    career: "Kinh doanh, marketing, ngoại giao, giải trí.",
    alchemy: "Tiết chế dục vọng nhất thời; tập trung 1–2 mục tiêu lõi.",
  },
  "Cự Môn": {
    trait: "Ngôn luận: Sắc sảo, phản biện tốt, thích đào sâu bản chất.",
    appearance: "Miệng rõ nét, giọng nói có lực.",
    career: "Luật sư, giảng viên, tư vấn, phân tích dữ liệu.",
    alchemy: "Thận trọng lời nói để tránh thị phi; dùng ngôn từ xây dựng.",
  },
  "Thiên Tướng": {
    trait: "Ấn tinh: Chính trực, trọng nghĩa khí, giỏi điều phối.",
    appearance: "Khuôn mặt vuông vắn đoan trang.",
    career: "Trợ lý cấp cao, hành chính, ngoại giao, luật.",
    alchemy: "Tránh bảo thủ quá mức; giữ sự độc lập khi phán đoán.",
  },
  "Thiên Lương": {
    trait: "Ấm tinh: Nhân hậu, che chở, có duyên y dược và giáo dục.",
    appearance: "Phong thái điềm tĩnh, chững chạc.",
    career: "Y tế, giáo dục, nghiên cứu, thiện nguyện, cố vấn.",
    alchemy: "Tránh can thiệp quá sâu vào chuyện người khác.",
  },
  "Thất Sát": {
    trait: "Tướng tinh: Dũng mãnh, độc lập, dám nghĩ dám làm.",
    appearance: "Ánh mắt sắc, phong thái dứt khoát.",
    career: "Khởi nghiệp, kỹ thuật nặng, điều hành thực chiến.",
    alchemy: "Rèn tính kiên nhẫn; không quyết định lớn lúc nóng giận.",
  },
  "Phá Quân": {
    trait: "Hao tinh: Tiên phong, đột phá, giỏi cải tổ cái cũ.",
    appearance: "Phong thái năng động, hay thay đổi.",
    career: "Cải cách, xây dựng, công nghệ mới, thương mại.",
    alchemy: "Lập quỹ dự phòng tài chính vì dễ tiêu tán khi mở rộng.",
  },
};

function cucFromNapAm(elem: string): [string, number] {
  if (elem === "Thủy") return ["Thủy Nhị Cục", 2];
  if (elem === "Mộc") return ["Mộc Tam Cục", 3];
  if (elem === "Kim") return ["Kim Tứ Cục", 4];
  if (elem === "Thổ") return ["Thổ Ngũ Cục", 5];
  return ["Hỏa Lục Cục", 6];
}

function hoaLinhStart(yearBranchIdx: number): [number, number] {
  // Dần(2) Ngọ(6) Tuất(10): Hỏa Sửu(1), Linh Mão(3)
  if ([2, 6, 10].includes(yearBranchIdx)) return [1, 3];
  // Thân(8) Tý(0) Thìn(4): Hỏa Dần(2), Linh Tuất(10)
  if ([8, 0, 4].includes(yearBranchIdx)) return [2, 10];
  // Tỵ(5) Dậu(9) Sửu(1): Hỏa Mão(3), Linh Tuất(10)
  if ([5, 9, 1].includes(yearBranchIdx)) return [3, 10];
  // Hợi(11) Mão(3) Mùi(7): Hỏa Dậu(9), Linh Tuất(10)
  return [9, 10];
}

function thienMaBranch(yearBranchIdx: number): number {
  if ([2, 6, 10].includes(yearBranchIdx)) return 8; // Thân
  if ([8, 0, 4].includes(yearBranchIdx)) return 2; // Dần
  if ([5, 9, 1].includes(yearBranchIdx)) return 11; // Hợi
  return 5; // Tỵ
}

export interface ZiweiInput {
  fullName?: string;
  calendarType?: "lunar" | "solar";
  year: number;
  month: number;
  day: number;
  hourBranchIdx: number;
  gender: "Nam" | "Nữ";
  viewYear?: number;
}

export function calcZiweiChart(params: ZiweiInput) {
  const {
    fullName = "Đương số",
    calendarType = "lunar",
    year,
    month,
    day,
    hourBranchIdx,
    gender,
    viewYear = 2026,
  } = params;

  let lunarYear = year;
  let lunarMonth = month;
  let lunarDay = day;
  let leapMonth = false;
  if (calendarType === "solar") {
    const conv = convertSolar2Lunar(day, month, year, 7);
    lunarYear = conv.year;
    lunarMonth = conv.month;
    lunarDay = conv.day;
    leapMonth = conv.leap;
  }

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

  // Lục Cát + Lộc Tồn + Thiên Mã + Hồng Loan / Thiên Hỷ
  auxByBranch[(4 + lunarMonth - 1) % 12].push("Tả Phụ");
  auxByBranch[(((10 - (lunarMonth - 1)) % 12) + 12) % 12].push("Hữu Bật");
  auxByBranch[(((10 - hourBranchIdx) % 12) + 12) % 12].push("Văn Xương");
  auxByBranch[(4 + hourBranchIdx) % 12].push("Văn Khúc");
  const [khoi, viet] = KHOI_VIET[yearStem];
  auxByBranch[khoi].push("Thiên Khôi");
  auxByBranch[viet].push("Thiên Việt");
  const locIdx = LOC_TON_IDX[yearStem];
  auxByBranch[locIdx].push("Lộc Tồn");
  auxByBranch[thienMaBranch(yearBranchIdx)].push("Thiên Mã");
  const hongLoanIdx = (((3 - yearBranchIdx) % 12) + 12) % 12; // Mão(3) nghịch Chi năm
  auxByBranch[hongLoanIdx].push("Hồng Loan");
  auxByBranch[(hongLoanIdx + 6) % 12].push("Thiên Hỷ");

  // Lục Sát đầy đủ (Kình, Đà, Không, Kiếp, Hỏa, Linh)
  satByBranch[(locIdx + 1) % 12].push("Kình Dương");
  satByBranch[(locIdx + 11) % 12].push("Đà La");
  satByBranch[(((11 - hourBranchIdx) % 12) + 12) % 12].push("Địa Không");
  satByBranch[(11 + hourBranchIdx) % 12].push("Địa Kiếp");
  const [hoaStart, linhStart] = hoaLinhStart(yearBranchIdx);
  satByBranch[(hoaStart + (clockwise ? hourBranchIdx : -hourBranchIdx) + 12) % 12].push("Hỏa Tinh");
  satByBranch[(linhStart + (clockwise ? -hourBranchIdx : hourBranchIdx) + 12) % 12].push("Linh Tinh");

  // Tuần & Triệt
  const diff60 = ((yearBranchIdx - yearStemIdx) % 12 + 12) % 12;
  const tuanSet = new Set([(diff60 + 10) % 12, (diff60 + 11) % 12]);
  const trietSet = new Set(TRIET_BY_STEM[yearStem]);

  // Tứ Hóa Can Năm & Lưu Niên Tứ Hóa
  const [loc, quyen, khoa, ky] = TU_HOA[yearStem];
  const hoaMap: Record<string, string> = { [loc]: "Lộc", [quyen]: "Quyền", [khoa]: "Khoa", [ky]: "Kỵ" };

  const viewIdx60 = (((viewYear - 4) % 60) + 60) % 60;
  const viewStem = STEMS[viewIdx60 % 10];
  const luuThaiTueBranchIdx = viewIdx60 % 12;
  const [lLoc, lQuyen, lKhoa, lKy] = TU_HOA[viewStem];
  const luuHoaMap: Record<string, string> = { [lLoc]: "L.Lộc", [lQuyen]: "L.Quyền", [lKhoa]: "L.Khoa", [lKy]: "L.Kỵ" };
  const tuoiMu = viewYear - lunarYear + 1;

  const tsStart = TRANG_SINH_START[cucNum];

  const palaces = Array.from({ length: 12 }, (_, bIdx) => {
    const offsetFromMenh = (((menhIdx - bIdx) % 12) + 12) % 12;
    const stemOfPalace = STEMS[(danStemIdx + (((bIdx - 2) % 12 + 12) % 12)) % 10];
    const daiHanStep = clockwise ? ((bIdx - menhIdx + 12) % 12) : ((menhIdx - bIdx + 12) % 12);
    const daiHanStart = cucNum + daiHanStep * 10;
    const tsOffset = clockwise ? ((bIdx - tsStart + 12) % 12) : ((tsStart - bIdx + 12) % 12);
    const stars = mainByBranch[bIdx].map((s) => {
      const br = BRIGHTNESS[s]?.[bIdx] ?? "B";
      const tags = [hoaMap[s], luuHoaMap[s]].filter(Boolean);
      return `${s} (${br}${tags.length ? "·" + tags.join("+") : ""})`;
    });
    return {
      branchIdx: bIdx,
      branch: BRANCHES[bIdx],
      stem: stemOfPalace,
      cung: CUNG_CHUC[offsetFromMenh],
      isThan: bIdx === thanIdx,
      isTuan: tuanSet.has(bIdx),
      isTriet: trietSet.has(bIdx),
      isLuuThaiTue: bIdx === luuThaiTueBranchIdx,
      trangSinh: TRANG_SINH_12[tsOffset],
      daiHan: `${daiHanStart}–${daiHanStart + 9}`,
      daiHanStart,
      stars,
      auxStars: auxByBranch[bIdx],
      satStars: satByBranch[bIdx],
      rawStars: mainByBranch[bIdx],
    };
  });

  // Điệp Gia Tứ Hóa (Trùng Lộc / Trùng Kỵ)
  const diepGia: string[] = [];
  if (loc === lLoc) diepGia.push(`Trùng Lộc tại sao ${loc} (Cát khí tài lộc nhân đôi năm ${viewYear})`);
  if (ky === lKy) diepGia.push(`Trùng Kỵ tại sao ${ky} (Cần đặc biệt cẩn trọng thị phi/hao tổn tại cung có ${ky})`);

  const tamHopBranches = [menhIdx, (menhIdx + 4) % 12, (menhIdx + 8) % 12];
  const tamHopMain = new Set(tamHopBranches.flatMap((i) => mainByBranch[i]));
  const tamHopAux = new Set(tamHopBranches.flatMap((i) => auxByBranch[i]));
  const patterns: string[] = [];
  if (tamHopMain.has("Tử Vi") && tamHopMain.has("Thiên Phủ")) patterns.push("Tử Phủ Đồng Lâm / Triều Viên");
  if (tamHopMain.has("Thất Sát") && tamHopMain.has("Phá Quân") && tamHopMain.has("Tham Lang")) patterns.push("Sát Phá Tham");
  if (tamHopMain.has("Thiên Cơ") && tamHopMain.has("Thái Âm") && tamHopMain.has("Thiên Đồng") && tamHopMain.has("Thiên Lương")) patterns.push("Cơ Nguyệt Đồng Lương");
  if (tamHopAux.has("Tả Phụ") && tamHopAux.has("Hữu Bật")) patterns.push("Tả Hữu Hội Chiếu");
  if (tamHopAux.has("Văn Xương") && tamHopAux.has("Văn Khúc")) patterns.push("Xương Khúc Khoa Danh");
  if (tamHopAux.has("Lộc Tồn") && tamHopAux.has("Thiên Mã")) patterns.push("Lộc Mã Giao Trì (Phát tài phương xa)");
  if (mainByBranch[menhIdx].length === 0 && (tuanSet.has(menhIdx) || trietSet.has(menhIdx))) {
    patterns.push("Mệnh Vô Chính Diệu đắc Tuần/Triệt");
  }

  const menhPalace = palaces[menhIdx];
  const quanPalace = palaces.find((p) => p.cung === "Quan Lộc")!;
  const taiPalace = palaces.find((p) => p.cung === "Tài Bạch")!;
  const phuPalace = palaces.find((p) => p.cung === "Phu Thê")!;
  const tatPalace = palaces.find((p) => p.cung === "Tật Ách")!;
  const currentDaiHan = palaces.find((p) => tuoiMu >= p.daiHanStart && tuoiMu <= p.daiHanStart + 9);
  const luuThaiTuePalace = palaces[luuThaiTueBranchIdx];

  // Phi Tinh Tứ Hóa theo Thiên Can từng cung (Flying Star)
  const findStarPalace = (starName: string) =>
    palaces.find((p) => p.rawStars.includes(starName) || p.auxStars.includes(starName))?.cung ?? "—";

  const flyingTuHoa = palaces.map((p) => {
    const [fl, fq, fk, fky] = TU_HOA[p.stem];
    return {
      fromCung: p.cung,
      stem: p.stem,
      locTo: `${fl} → ${findStarPalace(fl)}`,
      quyenTo: `${fq} → ${findStarPalace(fq)}`,
      khoaTo: `${fk} → ${findStarPalace(fk)}`,
      kyTo: `${fky} → ${findStarPalace(fky)}`,
      selfLoc: p.rawStars.includes(fl) || p.auxStars.includes(fl),
      selfKy: p.rawStars.includes(fky) || p.auxStars.includes(fky),
    };
  });

  const menhFly = flyingTuHoa.find((f) => f.fromCung === "Mệnh")!;
  const taiFly = flyingTuHoa.find((f) => f.fromCung === "Tài Bạch")!;
  const quanFly = flyingTuHoa.find((f) => f.fromCung === "Quan Lộc")!;

  const menhChu = MENH_CHU_BY_BRANCH[menhIdx];
  const thanChu = THAN_CHU_BY_BRANCH[yearBranchIdx];

  const allPalaceReadings = palaces.map((p) => {
    const fly = flyingTuHoa.find((f) => f.fromCung === p.cung)!;
    const tamHop = [palaces[(p.branchIdx + 4) % 12], palaces[(p.branchIdx + 8) % 12]];
    const doiXung = palaces[(p.branchIdx + 6) % 12];
    const sanFangStars = [...tamHop, doiXung].flatMap((x) => x.rawStars);
    return {
      cung: p.cung,
      branch: p.branch,
      meaning: CUNG_MEANINGS[p.cung],
      mainText: p.stars.join(", ") || "Vô Chính Diệu (mượn sao cung đối xung " + doiXung.cung + ")",
      auxText: p.auxStars.join(", ") || "Không",
      satText: p.satStars.join(", ") || "Không",
      sanFangText: sanFangStars.slice(0, 6).join(", ") || "—",
      flyText: `Lộc(${fly.locTo}) · Quyền(${fly.quyenTo}) · Khoa(${fly.khoaTo}) · Kỵ(${fly.kyTo})${
        fly.selfLoc ? " [Tự Hóa Lộc]" : ""
      }${fly.selfKy ? " [Tự Hóa Kỵ]" : ""}`,
    };
  });

  const mainTraitSummary = menhPalace.rawStars.length
    ? menhPalace.rawStars.map((s) => `${s}: ${STAR_TRAITS[s].trait}`).join(" ")
    : "Mệnh Vô Chính Diệu: Linh hoạt, dễ thích nghi, xem thêm cung Thiên Di đối chiếu.";

  const appearanceCheck = menhPalace.rawStars.length
    ? menhPalace.rawStars.map((s) => STAR_TRAITS[s].appearance).join(" ")
    : "Thần thái linh hoạt theo cung Thiên Di.";

  const alchemyTips = [
    ...menhPalace.rawStars.map((s) => `${s}: ${STAR_TRAITS[s].alchemy}`),
    menhPalace.satStars.length
      ? `Hóa giải Sát tinh tại Mệnh (${menhPalace.satStars.join(", ")}): Biến áp lực thành tính kỷ luật, hành động có kế hoạch và giữ tâm tĩnh.`
      : "Cung Mệnh ít sát tinh cản trở, thuận lợi phát triển tự nhiên.",
  ].join(" ");

  const detailedAnalysis = [
    {
      title: "1. Bản Mệnh, Cục Số & Cách Cục",
      body: `${fullName} — Âm lịch ${lunarDay}/${lunarMonth}${leapMonth ? "N" : ""}/${lunarYear} (${yearStem} ${yearBranch}, ${napAm}), ${cucName} (${clockwise ? "Thuận" : "Nghịch"}). Mệnh tại ${BRANCHES[menhIdx]}, Thân cư ${palaces[thanIdx].cung} (${BRANCHES[thanIdx]}). ${
        patterns.length ? `Cách cục: ${patterns.join("; ")}.` : ""
      }`,
    },
    {
      title: "2. Tính cách, Nghiệm chứng Nhân Tướng & Khí chất",
      body: `${mainTraitSummary} Nghiệm chứng dáng vẻ: ${appearanceCheck}`,
    },
    {
      title: "3. Công danh & Tài lộc (Quan Lộc – Tài Bạch)",
      body: `Quan Lộc (${quanPalace.branch}): ${quanPalace.stars.join(", ") || "Vô Chính Diệu"} | Tài Bạch (${taiPalace.branch}): ${taiPalace.stars.join(", ") || "Vô Chính Diệu"}. ${
        menhPalace.rawStars.map((s) => `Nghề hợp (${s}): ${STAR_TRAITS[s].career}`).join(" ")
      }`,
    },
    {
      title: `4. Đại Hạn & Lưu Niên ${viewYear} (${viewStem} ${BRANCHES[luuThaiTueBranchIdx]}, ${tuoiMu} tuổi mụ)`,
      body: `Đại Hạn: ${currentDaiHan ? `${currentDaiHan.daiHan} tuổi tại cung ${currentDaiHan.cung} (${currentDaiHan.branch})` : "—"}. Lưu Thái Tuế ${viewYear} tại ${luuThaiTuePalace.cung} (${luuThaiTuePalace.branch}). Lưu Tứ Hóa: L.Lộc (${lLoc}), L.Quyền (${lQuyen}), L.Khoa (${lKhoa}), L.Kỵ (${lKy}). ${
        diepGia.length ? `Điệp Gia Tứ Hóa: ${diepGia.join("; ")}.` : ""
      }`,
    },
    {
      title: "5. Phi Tinh Tứ Hóa (Mệnh – Tài – Quan)",
      body: `Mệnh (${menhFly.stem}) phi Lộc (${menhFly.locTo}), Kỵ (${menhFly.kyTo}). Tài Bạch (${taiFly.stem}) phi Lộc (${taiFly.locTo}), Kỵ (${taiFly.kyTo}). Quan Lộc (${quanFly.stem}) phi Lộc (${quanFly.locTo}), Kỵ (${quanFly.kyTo}).`,
    },
    {
      title: "6. Gia đạo, Sức khỏe & Chuyển Hóa Sát Tinh (Cải Mệnh)",
      body: `Mệnh Chủ: ${menhChu} · Thân Chủ: ${thanChu}. Phu Thê (${phuPalace.branch}): ${phuPalace.stars.join(", ") || "Vô Chính Diệu"}. Tật Ách (${tatPalace.branch}): ${tatPalace.stars.join(", ") || "Vô Chính Diệu"}. Cải mệnh: ${alchemyTips}`,
    },
  ];

  return {
    fullName,
    lunarDateStr: `${lunarDay}/${lunarMonth}${leapMonth ? " (Nhuận)" : ""}/${lunarYear}`,
    yearCanChi: `${yearStem} ${yearBranch}`,
    gender,
    napAm: `${napAm} (${napAmElem})`,
    cucName,
    menhChu,
    thanChu,
    menhBranch: BRANCHES[menhIdx],
    thanBranch: BRANCHES[thanIdx],
    thanCung: palaces[thanIdx].cung,
    tuHoa: { loc, quyen, khoa, ky },
    luuTuHoa: { viewYear, loc: lLoc, quyen: lQuyen, khoa: lKhoa, ky: lKy },
    diepGia,
    patterns,
    palaces,
    allPalaceReadings,
    mainTraitSummary,
    detailedAnalysis,
  };
}

export function calcZiweiSynastry(
  chartA: ReturnType<typeof calcZiweiChart>,
  chartB: ReturnType<typeof calcZiweiChart>,
  mode: "hon_nhan" | "hop_tac"
) {
  const menhA = chartA.palaces.find((p) => p.cung === "Mệnh")!;
  const menhB = chartB.palaces.find((p) => p.cung === "Mệnh")!;
  const targetCung = mode === "hon_nhan" ? "Phu Thê" : "Quan Lộc";
  const targetA = chartA.palaces.find((p) => p.cung === targetCung)!;
  const targetB = chartB.palaces.find((p) => p.cung === targetCung)!;

  const sameOrTamHop =
    menhA.branchIdx === menhB.branchIdx ||
    Math.abs(menhA.branchIdx - menhB.branchIdx) % 4 === 0;
  const oppMenh = Math.abs(menhA.branchIdx - menhB.branchIdx) === 6;

  // Kiểm tra Hóa Lộc của A rơi vào cung Mệnh/Tài/Quan/Phu Thê của B
  const locAInB = chartB.palaces.find((p) => p.rawStars.includes(chartA.tuHoa.loc));
  const kyAInB = chartB.palaces.find((p) => p.rawStars.includes(chartA.tuHoa.ky));

  return {
    modeLabel: mode === "hon_nhan" ? "Hợp Hôn / Tình Duyên" : "Đối Tác Làm Ăn / Cộng Sự",
    summary: sameOrTamHop
      ? `Cung Mệnh ${chartA.fullName} (${menhA.branch}) và ${chartB.fullName} (${menhB.branch}) đồng/tam hợp — dễ đồng điệu tư duy.`
      : oppMenh
      ? `Cung Mệnh đối xung (${menhA.branch} ↔ ${menhB.branch}) — bổ sung khuyết thiếu nhưng cần tôn trọng khác biệt.`
      : `Cung Mệnh tại ${menhA.branch} và ${menhB.branch} — mức độ tương tác trung tính, cần xét thêm cung ${targetCung}.`,
    targetCompare: `Cung ${targetCung} của A (${targetA.branch}): ${targetA.stars.join(", ") || "Vô Chính Diệu"} | Cung ${targetCung} của B (${targetB.branch}): ${targetB.stars.join(", ") || "Vô Chính Diệu"}.`,
    tuHoaInteraction: `Hóa Lộc của A (${chartA.tuHoa.loc}) chiếu cung ${locAInB?.cung ?? "—"} của B (mang lại cơ hội/tình cảm); Hóa Kỵ của A (${chartA.tuHoa.ky}) rơi vào cung ${kyAInB?.cung ?? "—"} của B (điểm dễ vướng bận cần nhường nhịn).`,
  };
}
