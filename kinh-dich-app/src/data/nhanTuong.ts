export interface NhanTuongItem {
  id: string;
  category: "Tam Đình" | "Ngũ Nhạc" | "12 Cung Khuôn Mặt" | "Tam Tài Tuyến" | "Bát Gò Bàn Tay";
  name: string;
  position: string;
  meaning: string;
  goodSign: string;
  advice: string;
}

export const NHAN_TUONG_DATA: NhanTuongItem[] = [
  {
    id: "td-thuong",
    category: "Tam Đình",
    name: "Thượng Đình (1–30 tuổi)",
    position: "Từ chân tóc xuống Sơn căn (giữa 2 mắt)",
    meaning: "Phản ánh phúc ấm gia đình, trí tuệ bẩm sinh, học vấn và tiền vận.",
    goodSign: "Trán cao, rộng, sáng nhuận, không hóp hay sẹo cắt ngang.",
    advice: "Phát huy tư duy chiến lược, đầu tư học tập sớm.",
  },
  {
    id: "td-trung",
    category: "Tam Đình",
    name: "Trung Đình (31–50 tuổi)",
    position: "Từ Sơn căn xuống Chuẩn đầu (đầu mũi)",
    meaning: "Phản ánh ý chí tự lập, sự nghiệp, tài lộc và các mối quan hệ xã hội.",
    goodSign: "Sống mũi thẳng đầy, lưỡng quyền (gò má) cân xứng có thịt.",
    advice: "Giai đoạn trụ cột: giữ chữ tín và cân bằng quyền lực – hợp tác.",
  },
  {
    id: "td-ha",
    category: "Tam Đình",
    name: "Hạ Đình (51+ tuổi)",
    position: "Từ Chuẩn đầu xuống Địa các (chóp cằm)",
    meaning: "Phản ánh hậu vận, điền sản tích lũy, con cháu và sự an nhàn.",
    goodSign: "Nhân trung sâu rõ, cằm đầy đặn vững chãi, hàm cân đối.",
    advice: "Tích đức, giữ sức khỏe và xây dựng nền tảng tài sản bền vững.",
  },
  {
    id: "nn-trung",
    category: "Ngũ Nhạc",
    name: "Trung Nhạc (Mũi – Thổ) & Thế Triều Củng",
    position: "Trục trung tâm khuôn mặt",
    meaning: "Mũi là Chủ Sơn; 4 ngọn núi còn lại (Trán, Cằm, 2 Gò má) chầu về hỗ trợ.",
    goodSign: "Ngũ nhạc triều củng: 5 bộ vị cân xứng, không quá cao hay quá khuyết.",
    advice: "Tránh thế 'Cô phong độc củng' (mũi cao vút nhưng má hóp, trán/cằm yếu).",
  },
  {
    id: "cung-menh",
    category: "12 Cung Khuôn Mặt",
    name: "Mệnh Cung (Ấn Đường)",
    position: "Khoảng giữa hai đầu lông mày",
    meaning: "Cửa ngõ tâm trí, vận khí tổng thể và sự hanh thông trong quyết định.",
    goodSign: "Rộng khoảng 1.5–2 ngón tay, sáng sủa, không nếp nhăn sâu.",
    advice: "Giữ tâm tĩnh, giảm cau mày để khai thông Ấn Đường.",
  },
  {
    id: "cung-tai",
    category: "12 Cung Khuôn Mặt",
    name: "Tài Bạch Cung",
    position: "Đầu mũi (Chuẩn đầu) và hai cánh mũi (Lan Đài, Đình Úy)",
    meaning: "Khả năng kiếm tiền, quản lý tài chính và giữ của.",
    goodSign: "Đầu mũi tròn đầy, cánh mũi dày kín (không lộ lỗ mũi).",
    advice: "Lập kỷ luật tài chính rõ ràng nếu cánh mũi mỏng hoặc lộ khổng.",
  },
  {
    id: "ct-sinh",
    category: "Tam Tài Tuyến",
    name: "Đường Sinh Đạo",
    position: "Vòng quanh gò Kim Tinh từ kẽ ngón cái–trỏ xuống cổ tay",
    meaning: "Phản ánh thể lực, sức bền, sức đề kháng (không đo trực tiếp tuổi thọ).",
    goodSign: "Sâu rõ, liền mạch, vòng cung rộng ôm gò Kim Tinh hồng hào.",
    advice: "Rèn luyện thể thao đều đặn khi đường mờ hoặc nhiều nhánh cắt.",
  },
  {
    id: "ct-tri",
    category: "Tam Tài Tuyến",
    name: "Đường Trí Đạo",
    position: "Chạy ngang giữa lòng bàn tay",
    meaning: "Phong cách tư duy: thẳng = logic, thực tế; cong về gò Thái Âm = sáng tạo.",
    goodSign: "Rõ nét, không đứt đoạn hay có hình đảo lớn.",
    advice: "Kết hợp tư duy phân tích với khả năng lắng nghe trực giác.",
  },
  {
    id: "ct-tam",
    category: "Tam Tài Tuyến",
    name: "Đường Tâm Đạo",
    position: "Phía trên cùng lòng bàn tay (dưới các ngón)",
    meaning: "Đời sống tình cảm, sự chân thành và trạng thái cảm xúc.",
    goodSign: "Liền mạch, hướng lên giữa gò Mộc Tinh và Thổ Tinh.",
    advice: "Cân bằng cảm xúc và lý trí trong hôn nhân, hợp tác.",
  },
  {
    id: "go-moc",
    category: "Bát Gò Bàn Tay",
    name: "Gò Mộc Tinh & Gò Thổ Tinh",
    position: "Dưới chân ngón trỏ (Mộc Tinh) & ngón giữa (Thổ Tinh)",
    meaning: "Mộc Tinh chủ lãnh đạo, chí tiến thủ; Thổ Tinh chủ kỷ luật, trách nhiệm.",
    goodSign: "Đầy đặn vừa phải, da hồng hào, không xẹp trũng.",
    advice: "Tay trái xem gốc Tiên thiên (trước 30t), tay phải xem Hậu thiên (sau 30t).",
  },
];

export interface TuongAssessmentInput {
  thuongDinh: "cao_rong" | "trung_binh" | "hep_thap";
  trungDinh: "mui_thang_quyen_day" | "trung_binh" | "mui_thap_quyen_yeu";
  haDinh: "cam_day_vung" | "trung_binh" | "cam_nhon_ngan";
  anDuong: "sang_rong" | "nhieu_nep_nhan";
  sinhDao: "sau_ro_rong" | "mo_dut_doan";
  triDao: "thang_ro" | "cong_thai_am" | "ngan_dut";
}

export function assessNhanTuong(input: TuongAssessmentInput) {
  const sections: { title: string; body: string }[] = [];

  const tdNotes: string[] = [];
  if (input.thuongDinh === "cao_rong") tdNotes.push("Thượng đình cao rộng: Tư duy nhạy bén, tiền vận (1–30 tuổi) dễ gặp thuận lợi học vấn.");
  else if (input.thuongDinh === "hep_thap") tdNotes.push("Thượng đình hẹp/thấp: Thời trẻ tự lập vất vả hơn, cần tích lũy tri thức bền bỉ.");
  else tdNotes.push("Thượng đình cân đối: Tiền vận ổn định.");

  if (input.trungDinh === "mui_thang_quyen_day") tdNotes.push("Trung đình đầy đặn (mũi thẳng, gò má cân): Trung vận (31–50 tuổi) có thực lực gầy dựng sự nghiệp và giữ uy tín.");
  else if (input.trungDinh === "mui_thap_quyen_yeu") tdNotes.push("Trung đình mỏng: Nên chú trọng hợp tác đồng đội, tránh ôm đồm một mình.");
  else tdNotes.push("Trung đình hài hòa: Trung vận tiến bước chắc chắn.");

  if (input.haDinh === "cam_day_vung") tdNotes.push("Hạ đình đầy vững: Hậu vận (51+ tuổi) an nhàn, tích lũy bền vững.");
  else if (input.haDinh === "cam_nhon_ngan") tdNotes.push("Hạ đình thon nhỏ: Nên chuẩn bị quỹ tài chính và sức khỏe sớm cho hậu vận.");
  else tdNotes.push("Hạ đình cân xứng: Hậu vận bình ổn.");

  sections.push({ title: "1. Tổng hợp Tam Đình & Vận trình 3 chặng đời", body: tdNotes.join(" ") });

  sections.push({
    title: "2. Thần khí Ấn Đường & Tài Bạch",
    body: input.anDuong === "sang_rong"
      ? "Ấn Đường sáng rộng: Tâm tính cởi mở, quyết đoán thông suốt, dễ thu hút quý nhân."
      : "Ấn Đường hay nhíu/có nếp nhăn: Dễ lo âu suy nghĩ nhiều; nên tập hít thở sâu, giảm căng thẳng để khai thông vận khí.",
  });

  const ctNotes: string[] = [];
  ctNotes.push(
    input.sinhDao === "sau_ro_rong"
      ? "Sinh đạo sâu rõ vòng rộng: Nền tảng thể lực và sức bền tốt."
      : "Sinh đạo mờ/nhiều nhánh: Cần chú ý ngủ nghỉ điều độ và rèn luyện thể chất."
  );
  if (input.triDao === "thang_ro") ctNotes.push("Trí đạo thẳng rõ: Tư duy logic, thực tế, hợp quản trị – kỹ thuật – tài chính.");
  else if (input.triDao === "cong_thai_am") ctNotes.push("Trí đạo cong về gò Thái Âm: Giàu trí tưởng tượng, trực giác, hợp sáng tạo – nghệ thuật – chiến lược.");
  else ctNotes.push("Trí đạo ngắn/đứt đoạn: Nên rèn tính tập trung và ghi chép có hệ thống.");

  sections.push({ title: "3. Phân tích Chỉ Tay (Sinh Đạo & Trí Đạo)", body: ctNotes.join(" ") });
  sections.push({
    title: "4. Khuyến nghị Tu Dưỡng ('Tâm sinh tướng')",
    body: "Nhân tướng và chỉ tay thay đổi theo thói quen sống và tâm tính. Giữ tâm bình tĩnh, rèn sức khỏe và làm việc có kỷ luật sẽ tự nhiên cải thiện khí sắc và vận trình.",
  });
  return sections;
}
