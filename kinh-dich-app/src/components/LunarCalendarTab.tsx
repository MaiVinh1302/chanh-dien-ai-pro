import { useMemo, useState } from "react";
import { calcTrachNhat } from "../engine/huyenKhong.ts";
import { convertLunar2Solar, getFullLunarInfo } from "../engine/vietnameseLunar.ts";

interface Props {
  onSelectDateForApp: (dateStr: string) => void;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const LY_THUAN_PHONG = [
  { name: "Không Vong", type: "Hung", desc: "Dễ trắc trở giấy tờ, cầu tài bất lợi" },
  { name: "Đại An", type: "Cát", desc: "Rất tốt, bình an, cầu tài hướng Tây/Nam" },
  { name: "Tốc Hỷ", type: "Cát", desc: "Tin vui tới nhanh, gặp đối tác thuận lợi" },
  { name: "Lưu Niên", type: "Bình", desc: "Chậm chắc, tránh nóng vội hay tranh cãi" },
  { name: "Xích Khẩu", type: "Hung", desc: "Dễ thị phi, tranh chấp, nên thận trọng lời nói" },
  { name: "Tiểu Cát", type: "Cát", desc: "Rất tốt, buôn bán có lời, hòa hợp" },
];
const KHAC_SLOTS = [
  { khac: 1, label: "23–01h & 11–13h" },
  { khac: 2, label: "01–03h & 13–15h" },
  { khac: 3, label: "03–05h & 15–17h" },
  { khac: 4, label: "05–07h & 17–19h" },
  { khac: 5, label: "07–09h & 19–21h" },
  { khac: 6, label: "09–11h & 21–23h" },
];

export function LunarCalendarTab({ onSelectDateForApp }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1..12
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Converter state
  const [convLunarDay, setConvLunarDay] = useState(1);
  const [convLunarMonth, setConvLunarMonth] = useState(1);
  const [convLunarYear, setConvLunarYear] = useState(today.getFullYear());
  const [convLeap, setConvLeap] = useState(false);

  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const firstWeekday = (new Date(viewYear, viewMonth - 1, 1).getDay() + 6) % 7; // 0=Mon..6=Sun

  const cells = useMemo(() => {
    const arr: (null | {
      day: number;
      lunarDay: number;
      lunarMonth: number;
      leap: boolean;
      isHoangDao: boolean;
      holiday?: string;
    })[] = [];
    for (let i = 0; i < firstWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const info = getFullLunarInfo(d, viewMonth, viewYear);
      const tn = calcTrachNhat(viewYear, viewMonth, d);
      arr.push({
        day: d,
        lunarDay: info.lunar.day,
        lunarMonth: info.lunar.month,
        leap: info.lunar.leap,
        isHoangDao: tn.hoangDao.type === "Hoàng Đạo",
        holiday: info.holidays[0],
      });
    }
    return arr;
  }, [viewYear, viewMonth, daysInMonth, firstWeekday]);

  const safeSelectedDay = Math.min(selectedDay, daysInMonth);
  const selectedInfo = useMemo(
    () => getFullLunarInfo(safeSelectedDay, viewMonth, viewYear),
    [safeSelectedDay, viewMonth, viewYear]
  );
  const selectedTrachNhat = useMemo(
    () => calcTrachNhat(viewYear, viewMonth, safeSelectedDay),
    [viewYear, viewMonth, safeSelectedDay]
  );

  const convertedSolar = useMemo(
    () => convertLunar2Solar(convLunarDay, convLunarMonth, convLunarYear, convLeap, 7),
    [convLunarDay, convLunarMonth, convLunarYear, convLeap]
  );

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth() + 1);
    setSelectedDay(1);
  };

  return (
    <div className="grid-2">
      <div>
        <div className="card">
          <h2>Chi Tiết Ngày {safeSelectedDay}/{viewMonth}/{viewYear}</h2>
          <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--gold)", marginBottom: 6 }}>
            Âm lịch: {selectedInfo.lunar.day}/{selectedInfo.lunar.month}
            {selectedInfo.lunar.leap ? " (Nhuận)" : ""} năm {selectedInfo.yearCanChi}
          </div>
          {selectedInfo.holidays.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <span className="badge badge-gold">{selectedInfo.holidays.join(" · ")}</span>
            </div>
          )}
          <div className="muted" style={{ lineHeight: 1.65 }}>
            <div>• <strong>Can Chi:</strong> Ngày {selectedInfo.dayCanChi} · Tháng {selectedInfo.monthCanChi} · Năm {selectedInfo.yearCanChi}</div>
            <div>• <strong>Tiết Khí:</strong> {selectedInfo.solarTerm} (Tháng {selectedTrachNhat.monthBranch})</div>
            <div>
              • <strong>Trực 12:</strong> Trực {selectedTrachNhat.truc.name} ({selectedTrachNhat.truc.rating}) —{" "}
              <span className={`badge ${selectedTrachNhat.hoangDao.type === "Hoàng Đạo" ? "badge-cat" : "badge-hung"}`}>
                {selectedTrachNhat.hoangDao.star} ({selectedTrachNhat.hoangDao.type})
              </span>
            </div>
            <div>• <strong>Ý nghĩa Trực:</strong> {selectedTrachNhat.truc.desc}</div>
            <div style={{ marginTop: 6 }}>
              • <strong>Giờ Hoàng Đạo:</strong> {selectedInfo.goodHours.join(", ")}
            </div>
            <div style={{ marginTop: 8, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
              <strong>Giờ Xuất Hành Lý Thuần Phong (Tiểu Lục Nhâm):</strong>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 4, fontSize: "0.78rem" }}>
                {KHAC_SLOTS.map((k) => {
                  const rem = (selectedInfo.lunar.day + selectedInfo.lunar.month + k.khac - 2) % 6;
                  const cung = LY_THUAN_PHONG[rem];
                  return (
                    <div key={k.khac}>
                      <strong>{k.label}:</strong>{" "}
                      <span style={{ color: cung.type === "Cát" ? "var(--cat)" : cung.type === "Hung" ? "var(--hung)" : "var(--gold)" }}>
                        {cung.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: 12 }}
            onClick={() =>
              onSelectDateForApp(
                `${viewYear}-${String(viewMonth).padStart(2, "0")}-${String(safeSelectedDay).padStart(2, "0")}`
              )
            }
          >
            Dùng ngày này cho Gieo Quẻ & Trạch Nhật
          </button>
        </div>

        <div className="card">
          <h3>Đổi Âm Lịch → Dương Lịch</h3>
          <div className="row">
            <div>
              <label>Ngày ÂL</label>
              <input type="number" min={1} max={30} value={convLunarDay} onChange={(e) => setConvLunarDay(Number(e.target.value) || 1)} />
            </div>
            <div>
              <label>Tháng ÂL</label>
              <input type="number" min={1} max={12} value={convLunarMonth} onChange={(e) => setConvLunarMonth(Number(e.target.value) || 1)} />
            </div>
            <div>
              <label>Năm ÂL</label>
              <input type="number" min={1900} max={2100} value={convLunarYear} onChange={(e) => setConvLunarYear(Number(e.target.value) || 2026)} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" style={{ width: "auto", margin: 0 }} checked={convLeap} onChange={(e) => setConvLeap(e.target.checked)} />
            Tháng nhuận
          </label>
          <div style={{ marginTop: 8, fontWeight: 600, color: "var(--accent)" }}>
            {convertedSolar[0] > 0
              ? `→ Dương lịch: ${convertedSolar[0]}/${convertedSolar[1]}/${convertedSolar[2]}`
              : "Không tồn tại ngày âm lịch này (kiểm tra lại tháng nhuận)."}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button className="btn-ghost" onClick={() => shiftMonth(-1)}>◀ Tháng trước</button>
          <h2 style={{ margin: 0 }}>Lịch Vạn Niên — Tháng {viewMonth}/{viewYear}</h2>
          <button className="btn-ghost" onClick={() => shiftMonth(1)}>Tháng sau ▶</button>
        </div>

        <div className="cal-grid">
          {WEEKDAYS.map((w) => (
            <div key={w} className="cal-head">{w}</div>
          ))}
          {cells.map((c, idx) =>
            c === null ? (
              <div key={`empty-${idx}`} className="cal-cell empty" />
            ) : (
              <div
                key={c.day}
                className={`cal-cell ${c.day === safeSelectedDay ? "selected" : ""}`}
                onClick={() => setSelectedDay(c.day)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700 }}>{c.day}</span>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: c.isHoangDao ? "var(--cat)" : "var(--hung)",
                    }}
                    title={c.isHoangDao ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo"}
                  />
                </div>
                <div className="muted" style={{ fontSize: "0.74rem", marginTop: 4 }}>
                  {c.lunarDay === 1 ? `${c.lunarDay}/${c.lunarMonth}${c.leap ? "N" : ""}` : c.lunarDay}
                </div>
                {c.holiday && (
                  <div style={{ fontSize: "0.66rem", color: "var(--gold)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.holiday}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
