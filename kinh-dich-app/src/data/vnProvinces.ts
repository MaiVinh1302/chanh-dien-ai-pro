export interface VnProvince {
  name: string;
  region: "Bắc Bộ" | "Trung Bộ" | "Tây Nguyên" | "Nam Bộ";
  lon: number;
}

export const VN_PROVINCES: VnProvince[] = [
  { name: "Hà Nội", region: "Bắc Bộ", lon: 105.85 },
  { name: "TP. Hồ Chí Minh", region: "Nam Bộ", lon: 106.66 },
  { name: "Đà Nẵng", region: "Trung Bộ", lon: 108.22 },
  { name: "Hải Phòng", region: "Bắc Bộ", lon: 106.68 },
  { name: "Cần Thơ", region: "Nam Bộ", lon: 105.78 },
  { name: "An Giang", region: "Nam Bộ", lon: 105.43 },
  { name: "Bà Rịa - Vũng Tàu", region: "Nam Bộ", lon: 107.08 },
  { name: "Bắc Giang", region: "Bắc Bộ", lon: 106.20 },
  { name: "Bắc Kạn", region: "Bắc Bộ", lon: 105.83 },
  { name: "Bạc Liêu", region: "Nam Bộ", lon: 105.72 },
  { name: "Bắc Ninh", region: "Bắc Bộ", lon: 106.07 },
  { name: "Bến Tre", region: "Nam Bộ", lon: 106.38 },
  { name: "Bình Định", region: "Trung Bộ", lon: 109.22 },
  { name: "Bình Dương", region: "Nam Bộ", lon: 106.65 },
  { name: "Bình Phước", region: "Nam Bộ", lon: 106.90 },
  { name: "Bình Thuận", region: "Trung Bộ", lon: 108.10 },
  { name: "Cà Mau", region: "Nam Bộ", lon: 105.15 },
  { name: "Cao Bằng", region: "Bắc Bộ", lon: 106.26 },
  { name: "Đắk Lắk", region: "Tây Nguyên", lon: 108.05 },
  { name: "Đắk Nông", region: "Tây Nguyên", lon: 107.69 },
  { name: "Điện Biên", region: "Bắc Bộ", lon: 103.02 },
  { name: "Đồng Nai", region: "Nam Bộ", lon: 106.82 },
  { name: "Đồng Tháp", region: "Nam Bộ", lon: 105.63 },
  { name: "Gia Lai", region: "Tây Nguyên", lon: 108.00 },
  { name: "Hà Giang", region: "Bắc Bộ", lon: 104.98 },
  { name: "Hà Nam", region: "Bắc Bộ", lon: 105.92 },
  { name: "Hà Tĩnh", region: "Trung Bộ", lon: 105.90 },
  { name: "Hải Dương", region: "Bắc Bộ", lon: 106.33 },
  { name: "Hậu Giang", region: "Nam Bộ", lon: 105.47 },
  { name: "Hòa Bình", region: "Bắc Bộ", lon: 105.34 },
  { name: "Hưng Yên", region: "Bắc Bộ", lon: 106.05 },
  { name: "Khánh Hòa", region: "Trung Bộ", lon: 109.19 },
  { name: "Kiên Giang", region: "Nam Bộ", lon: 105.09 },
  { name: "Kon Tum", region: "Tây Nguyên", lon: 108.00 },
  { name: "Lai Châu", region: "Bắc Bộ", lon: 103.47 },
  { name: "Lâm Đồng", region: "Tây Nguyên", lon: 108.44 },
  { name: "Lạng Sơn", region: "Bắc Bộ", lon: 106.76 },
  { name: "Lào Cai", region: "Bắc Bộ", lon: 103.97 },
  { name: "Long An", region: "Nam Bộ", lon: 106.41 },
  { name: "Nam Định", region: "Bắc Bộ", lon: 106.17 },
  { name: "Nghệ An", region: "Trung Bộ", lon: 105.69 },
  { name: "Ninh Bình", region: "Bắc Bộ", lon: 105.97 },
  { name: "Ninh Thuận", region: "Trung Bộ", lon: 108.99 },
  { name: "Phú Thọ", region: "Bắc Bộ", lon: 105.23 },
  { name: "Phú Yên", region: "Trung Bộ", lon: 109.30 },
  { name: "Quảng Bình", region: "Trung Bộ", lon: 106.62 },
  { name: "Quảng Nam", region: "Trung Bộ", lon: 108.33 },
  { name: "Quảng Ngãi", region: "Trung Bộ", lon: 108.80 },
  { name: "Quảng Ninh", region: "Bắc Bộ", lon: 107.08 },
  { name: "Quảng Trị", region: "Trung Bộ", lon: 107.19 },
  { name: "Sóc Trăng", region: "Nam Bộ", lon: 105.97 },
  { name: "Sơn La", region: "Bắc Bộ", lon: 103.91 },
  { name: "Tây Ninh", region: "Nam Bộ", lon: 106.10 },
  { name: "Thái Bình", region: "Bắc Bộ", lon: 106.34 },
  { name: "Thái Nguyên", region: "Bắc Bộ", lon: 105.84 },
  { name: "Thanh Hóa", region: "Trung Bộ", lon: 105.78 },
  { name: "Thừa Thiên Huế", region: "Trung Bộ", lon: 107.59 },
  { name: "Tiền Giang", region: "Nam Bộ", lon: 106.36 },
  { name: "Trà Vinh", region: "Nam Bộ", lon: 106.34 },
  { name: "Tuyên Quang", region: "Bắc Bộ", lon: 105.21 },
  { name: "Vĩnh Long", region: "Nam Bộ", lon: 105.97 },
  { name: "Vĩnh Phúc", region: "Bắc Bộ", lon: 105.60 },
  { name: "Yên Bái", region: "Bắc Bộ", lon: 104.90 },
];

export const REGION_CLIMATE_TIPS: Record<VnProvince["region"], string> = {
  "Bắc Bộ": "Khí hậu nhiệt đới ẩm có mùa đông lạnh: Nhà ở & văn phòng nên ưu tiên hướng Nam / Đông Nam để đón gió mát mùa hè và tránh gió mùa Đông Bắc thổi thẳng vào cửa chính.",
  "Trung Bộ": "Dải duyên hải có gió Lào (Tây Nam) nóng khô và bão biển phía Đông: Hạn chế mở cửa kính lớn hướng Tây/Tây Nam; ưu tiên lam chắn nắng và sân vườn/hồ nước phía trước để điều hòa vi khí hậu.",
  "Tây Nguyên": "Cao nguyên nhiều gió và nắng gắt ban ngày, lạnh ban đêm: Chú trọng thế Tọa Sơn vững chắc chắn gió mạnh, cửa sổ bố trí đón sáng Đông/Đông Nam dịu nhẹ.",
  "Nam Bộ": "Nắng nóng quanh năm với 2 mùa mưa–khô: Rất hợp hướng Nam, Đông Nam để đón gió từ biển, tránh nắng gắt hướng Tây chiếu trực diện vào phòng làm việc và phòng ngủ.",
};

export function calcTrueSolarTime(hour: number, minute: number, lon: number) {
  const offsetMinutes = Math.round((lon - 105.0) * 4);
  const totalMin = ((hour * 60 + minute + offsetMinutes) % 1440 + 1440) % 1440;
  const adjHour = Math.floor(totalMin / 60);
  const adjMin = totalMin % 60;
  // Địa Chi giờ: 23-01=Tý(0), 01-03=Sửu(1)...
  const branchIdx = Math.floor(((adjHour + 1) % 24) / 2);
  return {
    offsetMinutes,
    formatted: `${String(adjHour).padStart(2, "0")}:${String(adjMin).padStart(2, "0")}`,
    branchIdx,
  };
}
