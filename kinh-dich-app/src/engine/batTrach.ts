export interface BatTrachDirection {
  direction: string;
  palace: string;
  star: string;
  rating: string;
  type: "Cát" | "Hung";
}

const CUNG_INFO: Record<number, { name: string; element: string; group: string; dir: string }> = {
  1: { name: "Khảm", element: "Thủy", group: "Đông Tứ Mệnh", dir: "Bắc" },
  2: { name: "Khôn", element: "Thổ", group: "Tây Tứ Mệnh", dir: "Tây Nam" },
  3: { name: "Chấn", element: "Mộc", group: "Đông Tứ Mệnh", dir: "Đông" },
  4: { name: "Tốn", element: "Mộc", group: "Đông Tứ Mệnh", dir: "Đông Nam" },
  6: { name: "Càn", element: "Kim", group: "Tây Tứ Mệnh", dir: "Tây Bắc" },
  7: { name: "Đoài", element: "Kim", group: "Tây Tứ Mệnh", dir: "Tây" },
  8: { name: "Cấn", element: "Thổ", group: "Tây Tứ Mệnh", dir: "Đông Bắc" },
  9: { name: "Ly", element: "Hỏa", group: "Đông Tứ Mệnh", dir: "Nam" },
};

const DU_NIEN: Record<number, Record<number, [string, string, "Cát" | "Hung"]>> = {
  1: { 4: ["Sinh Khí", "Đại Cát", "Cát"], 3: ["Thiên Y", "Thượng Cát", "Cát"], 9: ["Diên Niên", "Trung Cát", "Cát"], 1: ["Phục Vị", "Tiểu Cát", "Cát"], 7: ["Họa Hại", "Thứ Hung", "Hung"], 6: ["Lục Sát", "Thứ Hung", "Hung"], 8: ["Ngũ Quỷ", "Đại Hung", "Hung"], 2: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  9: { 3: ["Sinh Khí", "Đại Cát", "Cát"], 4: ["Thiên Y", "Thượng Cát", "Cát"], 1: ["Diên Niên", "Trung Cát", "Cát"], 9: ["Phục Vị", "Tiểu Cát", "Cát"], 2: ["Họa Hại", "Thứ Hung", "Hung"], 8: ["Lục Sát", "Thứ Hung", "Hung"], 7: ["Ngũ Quỷ", "Đại Hung", "Hung"], 6: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  3: { 9: ["Sinh Khí", "Đại Cát", "Cát"], 1: ["Thiên Y", "Thượng Cát", "Cát"], 4: ["Diên Niên", "Trung Cát", "Cát"], 3: ["Phục Vị", "Tiểu Cát", "Cát"], 8: ["Họa Hại", "Thứ Hung", "Hung"], 2: ["Lục Sát", "Thứ Hung", "Hung"], 6: ["Ngũ Quỷ", "Đại Hung", "Hung"], 7: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  4: { 1: ["Sinh Khí", "Đại Cát", "Cát"], 9: ["Thiên Y", "Thượng Cát", "Cát"], 3: ["Diên Niên", "Trung Cát", "Cát"], 4: ["Phục Vị", "Tiểu Cát", "Cát"], 6: ["Họa Hại", "Thứ Hung", "Hung"], 7: ["Lục Sát", "Thứ Hung", "Hung"], 2: ["Ngũ Quỷ", "Đại Hung", "Hung"], 8: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  6: { 7: ["Sinh Khí", "Đại Cát", "Cát"], 8: ["Thiên Y", "Thượng Cát", "Cát"], 2: ["Diên Niên", "Trung Cát", "Cát"], 6: ["Phục Vị", "Tiểu Cát", "Cát"], 4: ["Họa Hại", "Thứ Hung", "Hung"], 1: ["Lục Sát", "Thứ Hung", "Hung"], 3: ["Ngũ Quỷ", "Đại Hung", "Hung"], 9: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  2: { 8: ["Sinh Khí", "Đại Cát", "Cát"], 7: ["Thiên Y", "Thượng Cát", "Cát"], 6: ["Diên Niên", "Trung Cát", "Cát"], 2: ["Phục Vị", "Tiểu Cát", "Cát"], 9: ["Họa Hại", "Thứ Hung", "Hung"], 3: ["Lục Sát", "Thứ Hung", "Hung"], 4: ["Ngũ Quỷ", "Đại Hung", "Hung"], 1: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  8: { 2: ["Sinh Khí", "Đại Cát", "Cát"], 6: ["Thiên Y", "Thượng Cát", "Cát"], 7: ["Diên Niên", "Trung Cát", "Cát"], 8: ["Phục Vị", "Tiểu Cát", "Cát"], 3: ["Họa Hại", "Thứ Hung", "Hung"], 9: ["Lục Sát", "Thứ Hung", "Hung"], 1: ["Ngũ Quỷ", "Đại Hung", "Hung"], 4: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
  7: { 6: ["Sinh Khí", "Đại Cát", "Cát"], 2: ["Thiên Y", "Thượng Cát", "Cát"], 8: ["Diên Niên", "Trung Cát", "Cát"], 7: ["Phục Vị", "Tiểu Cát", "Cát"], 1: ["Họa Hại", "Thứ Hung", "Hung"], 4: ["Lục Sát", "Thứ Hung", "Hung"], 9: ["Ngũ Quỷ", "Đại Hung", "Hung"], 3: ["Tuyệt Mệnh", "Chí Hung", "Hung"] },
};

export function calcBatTrach(lunarYear: number, gender: "Nam" | "Nữ") {
  const mod9 = ((lunarYear % 9) + 9) % 9;
  let num = gender === "Nam" ? (11 - mod9) % 9 || 9 : (mod9 + 4) % 9 || 9;
  if (num === 5) num = gender === "Nam" ? 2 : 8;
  const info = CUNG_INFO[num];
  const directions: BatTrachDirection[] = Object.entries(DU_NIEN[num]).map(([tNum, [star, rating, type]]) => {
    const tInfo = CUNG_INFO[Number(tNum)];
    return { direction: tInfo.dir, palace: tInfo.name, star, rating, type };
  });
  return { lunarYear, gender, cungNumber: num, cungPhi: info.name, element: info.element, group: info.group, directions };
}
