/**
 * Vietnamese Lunar Calendar (Ho Ngoc Duc's Astronomical Algorithm, UTC+7)
 * Converts Solar <-> Lunar, computes Leap Months, Can Chi (Year/Month/Day),
 * 24 Solar Terms, Auspicious Hours (Gio Hoang Dao), and Vietnamese Holidays.
 */
import { BRANCHES, STEMS, julianDayNumber, solarLongitude } from "./lunarCanChi.ts";

const PI = Math.PI;

function INT(d: number): number {
  return Math.floor(d);
}

function jdFromDate(dd: number, mm: number, yy: number): number {
  return julianDayNumber(yy, mm, dd);
}

function jdToDate(jd: number): [number, number, number] {
  let a: number, b: number, c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  const deltat = T < -11
    ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
    : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return INT(Jd1 + C1 - deltat + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = (L0 + DL) * dr;
  L = L - PI * 2 * INT(L / (PI * 2));
  return INT((L / PI) * 6);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  if (getSunLongitude(nm, timeZone) >= 9) nm = getNewMoonDay(k - 1, timeZone);
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export function convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone = 7) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone);

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap };
}

export function convertLunar2Solar(lunarDay: number, lunarMonth: number, lunarYear: number, lunarLeap = false, timeZone = 7): [number, number, number] {
  let a11: number, b11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (lunarLeap && lunarMonth !== leapMonth) return [0, 0, 0];
    if (lunarLeap || off >= leapOff) off += 1;
  }
  const monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

const SOLAR_TERMS_24 = [
  "Xuân Phân", "Thanh Minh", "Cốc Vũ", "Lập Hạ", "Tiểu Mãn", "Mang Chủng",
  "Hạ Chí", "Tiểu Thử", "Đại Thử", "Lập Thu", "Xử Thử", "Bạch Lộ",
  "Thu Phân", "Hàn Lộ", "Sương Giáng", "Lập Đông", "Tiểu Tuyết", "Đại Tuyết",
  "Đông Chí", "Tiểu Hàn", "Đại Hàn", "Lập Xuân", "Vũ Thủy", "Kinh Trập",
];

// Giờ Hoàng Đạo offsets (0=Tý..11=Hợi) by Day Branch group
const HOANG_DAO_HOURS: Record<number, number[]> = {
  0: [0, 1, 3, 6, 8, 9],   // Tý, Ngọ
  6: [0, 1, 3, 6, 8, 9],
  1: [2, 3, 5, 8, 10, 11], // Sửu, Mùi
  7: [2, 3, 5, 8, 10, 11],
  2: [0, 1, 4, 5, 7, 10],  // Dần, Thân
  8: [0, 1, 4, 5, 7, 10],
  3: [0, 2, 3, 6, 7, 9],   // Mão, Dậu
  9: [0, 2, 3, 6, 7, 9],
  4: [2, 4, 5, 8, 9, 11],  // Thìn, Tuất
  10: [2, 4, 5, 8, 9, 11],
  5: [1, 4, 6, 7, 10, 11], // Tỵ, Hợi
  11: [1, 4, 6, 7, 10, 11],
};

const HOUR_RANGES = [
  "23–01h", "01–03h", "03–05h", "05–07h", "07–09h", "09–11h",
  "11–13h", "13–15h", "15–17h", "17–19h", "19–21h", "21–23h",
];

const LUNAR_HOLIDAYS: Record<string, string> = {
  "1-1": "Tết Nguyên Đán",
  "1-15": "Tết Nguyên Tiêu (Rằm tháng Giêng)",
  "3-3": "Tết Hàn Thực",
  "3-10": "Giỗ Tổ Hùng Vương",
  "4-15": "Lễ Phật Đản",
  "5-5": "Tết Đoan Ngọ",
  "7-15": "Lễ Vu Lan",
  "8-15": "Tết Trung Thu",
  "9-9": "Tết Trùng Cửu",
  "10-10": "Tết Cơm Mới",
  "12-23": "Ông Công Ông Táo",
};

const SOLAR_HOLIDAYS: Record<string, string> = {
  "1-1": "Tết Dương Lịch",
  "3-8": "Quốc tế Phụ nữ",
  "4-30": "Giải phóng miền Nam",
  "5-1": "Quốc tế Lao động",
  "9-2": "Quốc khánh Việt Nam",
};

export function getFullLunarInfo(dd: number, mm: number, yy: number) {
  const lunar = convertSolar2Lunar(dd, mm, yy, 7);
  const jdn = jdFromDate(dd, mm, yy);
  const dStem = (jdn + 9) % 10;
  const dBranch = (jdn + 1) % 12;

  const yIdx60 = (((lunar.year - 4) % 60) + 60) % 60;
  const yStem = yIdx60 % 10;
  const yBranch = yIdx60 % 12;

  const danStem = ((yStem % 5) * 2 + 2) % 10;
  const mStem = (danStem + lunar.month - 1) % 10;
  const mBranch = (lunar.month + 1) % 12; // Tháng 1 -> Dần(2)

  const lon = solarLongitude(yy, mm, dd, 12, 7);
  const termName = SOLAR_TERMS_24[INT(lon / 15) % 24];

  const goodHours = HOANG_DAO_HOURS[dBranch].map((hIdx) => `${BRANCHES[hIdx]} (${HOUR_RANGES[hIdx]})`);

  const holidays: string[] = [];
  const lKey = `${lunar.month}-${lunar.day}`;
  const sKey = `${mm}-${dd}`;
  if (!lunar.leap && LUNAR_HOLIDAYS[lKey]) holidays.push(LUNAR_HOLIDAYS[lKey]);
  if (SOLAR_HOLIDAYS[sKey]) holidays.push(SOLAR_HOLIDAYS[sKey]);

  return {
    solar: { day: dd, month: mm, year: yy },
    lunar,
    yearCanChi: `${STEMS[yStem]} ${BRANCHES[yBranch]}`,
    monthCanChi: `${STEMS[mStem]} ${BRANCHES[mBranch]}`,
    dayCanChi: `${STEMS[dStem]} ${BRANCHES[dBranch]}`,
    solarTerm: termName,
    goodHours,
    holidays,
  };
}
