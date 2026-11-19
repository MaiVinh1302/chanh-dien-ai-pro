import { useEffect, useMemo, useState } from "react";
import {
  BRANCHES,
  HEXAGRAMS,
  NHAN_TUONG_DATA,
  REGION_CLIMATE_TIPS,
  STAR_MEANINGS,
  TRIGRAMS,
  VN_PROVINCES,
  assessNhanTuong,
  buildHexagram,
  buildLayoutAdvice,
  calcAnnualAfflictions,
  calcBatTrach,
  calcBaziChart,
  calcBuildAgeCheck,
  calcFlyingStars,
  calcTrachNhat,
  calcTrueSolarTime,
  calcZiweiChart,
  calcZiweiSynastry,
  castThiSach,
  castThreeCoins,
  compareAges,
  detailedFengShuiAnalysis,
  interpretHexagram,
  lucHaoForHexagram,
  maiHoaFromNumbers,
} from "./engine-index.ts";
import { LunarCalendarTab } from "./components/LunarCalendarTab.tsx";
import { MediaUploadPanel, type UploadedMedia } from "./components/MediaUploadPanel.tsx";
import type { TuongAssessmentInput } from "./data/nhanTuong.ts";
import { TOPIC_LABELS, type TopicKey } from "./engine/interpret.ts";
import { exportBaziWord, exportFengShuiWord, exportKinhDichWord, exportNhanTuongWord, exportZiweiWord } from "./utils/exportWord.ts";
import type { DivinationMethod, Hexagram, LineValue } from "./types.ts";

interface HistoryEntry {
  id: string;
  at: string;
  question: string;
  method: DivinationMethod;
  values: LineValue[];
  baseName: string;
  changedName: string | null;
}

const HISTORY_KEY = "chanh_dien_kinh_dich_history_v1";
// Traditional 4x4 ZiWei grid order (Tỵ top-left, Thân top-right, Hợi bottom-right, Dần bottom-left)
const ZIWEI_GRID_BRANCHES = [5, 6, 7, 8, 4, -1, 9, 3, 10, 2, 1, 0, 11];

function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function HexagramBars({ lines, moving }: { lines: number[]; moving?: number[] }) {
  return (
    <div className="bars">
      {lines.map((bit, i) => {
        const pos = i + 1;
        const isMov = moving?.includes(pos);
        return (
          <div className="bar-row" key={pos}>
            {bit === 1 ? (
              <div className="bar-yang" />
            ) : (
              <div className="bar-yin">
                <span />
                <span />
              </div>
            )}
            <div className="bar-mark">{isMov ? (bit === 1 ? "O" : "X") : ""}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<"cast" | "lookup" | "ziwei" | "bazi" | "fengshui" | "tuong" | "lunar">("cast");
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("cd_theme") === "light" ? "light" : "dark"));
  const [provinceName, setProvinceName] = useState("Hà Nội");
  const [birthClock, setBirthClock] = useState("09:30");
  const [method, setMethod] = useState<DivinationMethod>("thi_sach");
  const [topic, setTopic] = useState<TopicKey>("career");
  const [question, setQuestion] = useState("Công việc và định hướng sắp tới");
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [mhNums, setMhNums] = useState<[number, number, number]>([18, 25, 9]);
  const [values, setValues] = useState<LineValue[]>(() => castThiSach());
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  // Lookup tab state
  const [query, setQuery] = useState("");
  const [selectedHex, setSelectedHex] = useState<Hexagram>(HEXAGRAMS[0]);

  // ZiWei tab state
  const [zwName, setZwName] = useState("Đương số");
  const [zwCalType, setZwCalType] = useState<"solar" | "lunar">("solar");
  const [zwYear, setZwYear] = useState(1990);
  const [zwMonth, setZwMonth] = useState(6);
  const [zwDay, setZwDay] = useState(15);
  const [zwGender, setZwGender] = useState<"Nam" | "Nữ">("Nam");
  const [zwViewYear, setZwViewYear] = useState(2026);
  const [zwCalibrate, setZwCalibrate] = useState(false);
  const [zwSynastryOn, setZwSynastryOn] = useState(false);
  const [zwSynMode, setZwSynMode] = useState<"hon_nhan" | "hop_tac">("hon_nhan");
  const [zwBName, setZwBName] = useState("Đối tác / Phối ngẫu");
  const [zwBYear, setZwBYear] = useState(1992);
  const [zwBMonth, setZwBMonth] = useState(8);
  const [zwBDay, setZwBDay] = useState(10);
  const [zwBHourIdx, setZwBHourIdx] = useState(6);
  const [zwBGender, setZwBGender] = useState<"Nam" | "Nữ">("Nữ");
  const [selectedZwBranch, setSelectedZwBranch] = useState<number | null>(null);

  // Feng Shui tab state
  const [birthYear, setBirthYear] = useState(1990);
  const [gender, setGender] = useState<"Nam" | "Nữ">("Nam");
  const [period, setPeriod] = useState(9);
  const [facingDeg, setFacingDeg] = useState(180);
  const [fsViewYear, setFsViewYear] = useState(2026);

  // Nhan Tuong tab state
  const [tuongCat, setTuongCat] = useState<string>("Tất cả");
  const [tuongInput, setTuongInput] = useState<TuongAssessmentInput>({
    thuongDinh: "cao_rong",
    trungDinh: "mui_thang_quyen_day",
    haDinh: "cam_day_vung",
    anDuong: "sang_rong",
    sinhDao: "sau_ro_rong",
    triDao: "thang_ro",
  });
  const [fsMedia, setFsMedia] = useState<UploadedMedia | null>(null);
  const [tuongMedia, setTuongMedia] = useState<UploadedMedia | null>(null);

  // Bazi & Compatibility state (Solar birth date)
  const [bzDate, setBzDate] = useState("1990-06-15");
  const [bzGender, setBzGender] = useState<"Nam" | "Nữ">("Nam");
  const [partnerYear, setPartnerYear] = useState(1992);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cd_theme", theme);
  }, [theme]);

  const province = useMemo(
    () => VN_PROVINCES.find((p) => p.name === provinceName) ?? VN_PROVINCES[0],
    [provinceName]
  );
  const solarTime = useMemo(() => {
    const [hh, mm] = birthClock.split(":").map(Number);
    return calcTrueSolarTime(hh || 9, mm || 30, province.lon);
  }, [birthClock, province]);

  const castDate = useMemo(() => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return y && m && d ? new Date(y, m - 1, d, 12, 0) : new Date();
  }, [dateStr]);

  const built = useMemo(() => buildHexagram(values), [values]);
  const lucHao = useMemo(
    () => lucHaoForHexagram(built.base, built.changed, built.values, castDate),
    [built, castDate]
  );
  const interp = useMemo(
    () =>
      interpretHexagram({
        question,
        topic,
        base: built.base,
        changed: built.changed,
        mutual: built.mutual,
        movingPositions: built.movingPositions,
        chuHyRule: built.chuHyRule,
        lucHao,
      }),
    [question, topic, built, lucHao]
  );

  const handleCast = () => {
    let next: LineValue[];
    if (method === "thi_sach") next = castThiSach();
    else if (method === "dong_xu") next = castThreeCoins();
    else if (method === "mai_hoa") next = maiHoaFromNumbers(...mhNums).values;
    else next = [...values];

    setValues(next);
    const b = buildHexagram(next);
    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      at: new Date().toLocaleString("vi-VN"),
      question: question.trim() || "(Không ghi câu hỏi)",
      method,
      values: next,
      baseName: b.base.hanViet,
      changedName: b.changed ? b.changed.hanViet : null,
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const filteredHexagrams = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return HEXAGRAMS;
    return HEXAGRAMS.filter(
      (h) =>
        String(h.id) === q ||
        h.hanViet.toLowerCase().includes(q) ||
        h.chinese.includes(q) ||
        TRIGRAMS[h.palace].hanViet.toLowerCase().includes(q)
    );
  }, [query]);

  const zwChart = useMemo(
    () =>
      calcZiweiChart({
        fullName: zwName,
        calendarType: zwCalType,
        year: zwYear,
        month: zwMonth,
        day: zwDay,
        hourBranchIdx: solarTime.branchIdx,
        gender: zwGender,
        viewYear: zwViewYear,
      }),
    [zwName, zwCalType, zwYear, zwMonth, zwDay, solarTime.branchIdx, zwGender, zwViewYear]
  );

  const zwCalibrateCharts = useMemo(() => {
    if (!zwCalibrate) return [];
    return [-1, 0, 1].map((delta) => {
      const hIdx = (((solarTime.branchIdx + delta) % 12) + 12) % 12;
      return {
        label: delta === -1 ? "Canh trước" : delta === 0 ? "Giờ hiện tại" : "Canh sau",
        hourBranch: BRANCHES[hIdx],
        chart: calcZiweiChart({
          fullName: zwName,
          calendarType: zwCalType,
          year: zwYear,
          month: zwMonth,
          day: zwDay,
          hourBranchIdx: hIdx,
          gender: zwGender,
          viewYear: zwViewYear,
        }),
      };
    });
  }, [zwCalibrate, zwName, zwCalType, zwYear, zwMonth, zwDay, solarTime.branchIdx, zwGender, zwViewYear]);

  const zwSynastry = useMemo(() => {
    if (!zwSynastryOn) return null;
    const chartB = calcZiweiChart({
      fullName: zwBName,
      calendarType: zwCalType,
      year: zwBYear,
      month: zwBMonth,
      day: zwBDay,
      hourBranchIdx: zwBHourIdx,
      gender: zwBGender,
      viewYear: zwViewYear,
    });
    return calcZiweiSynastry(zwChart, chartB, zwSynMode);
  }, [zwSynastryOn, zwBName, zwCalType, zwBYear, zwBMonth, zwBDay, zwBHourIdx, zwBGender, zwViewYear, zwChart, zwSynMode]);

  const batTrach = useMemo(() => calcBatTrach(birthYear, gender), [birthYear, gender]);
  const buildAge = useMemo(() => calcBuildAgeCheck(birthYear, fsViewYear), [birthYear, fsViewYear]);
  const layoutAdvice = useMemo(() => buildLayoutAdvice(batTrach.directions), [batTrach]);
  const flyingStars = useMemo(() => calcFlyingStars(period, facingDeg), [period, facingDeg]);
  const annualFs = useMemo(() => calcAnnualAfflictions(fsViewYear), [fsViewYear]);
  const fsAnalysis = useMemo(() => detailedFengShuiAnalysis(batTrach, flyingStars), [batTrach, flyingStars]);
  const tuongReport = useMemo(() => assessNhanTuong(tuongInput), [tuongInput]);
  const baziChart = useMemo(() => {
    const [y, m, d] = bzDate.split("-").map(Number);
    return calcBaziChart(y || 1990, m || 6, d || 15, solarTime.branchIdx, bzGender);
  }, [bzDate, solarTime.branchIdx, bzGender]);
  const ageCompat = useMemo(() => {
    const y = Number(bzDate.split("-")[0]) || 1990;
    return compareAges(y, partnerYear);
  }, [bzDate, partnerYear]);
  const trachNhat = useMemo(
    () => calcTrachNhat(castDate.getFullYear(), castDate.getMonth() + 1, castDate.getDate()),
    [castDate]
  );

  const filteredTuong = useMemo(
    () => (tuongCat === "Tất cả" ? NHAN_TUONG_DATA : NHAN_TUONG_DATA.filter((x) => x.category === tuongCat)),
    [tuongCat]
  );

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">☯ Chánh Điện Dịch Đạo — Lý Số & Phong Thủy Toàn Diện</h1>
          <p className="subtitle">
            Kinh Dịch · Lục Hào · Tử Vi Đẩu Số · Bát Trạch & Huyền Không Vận 9 · Nhân Tướng Học
          </p>
        </div>
        <div className="tabs">
          <button className={`tab-btn ${tab === "cast" ? "active" : ""}`} onClick={() => setTab("cast")}>
            Gieo Quẻ & Lục Hào
          </button>
          <button className={`tab-btn ${tab === "lookup" ? "active" : ""}`} onClick={() => setTab("lookup")}>
            64 Quẻ
          </button>
          <button className={`tab-btn ${tab === "ziwei" ? "active" : ""}`} onClick={() => setTab("ziwei")}>
            Tử Vi Đẩu Số
          </button>
          <button className={`tab-btn ${tab === "bazi" ? "active" : ""}`} onClick={() => setTab("bazi")}>
            Bát Tự & Hợp Tuổi
          </button>
          <button className={`tab-btn ${tab === "fengshui" ? "active" : ""}`} onClick={() => setTab("fengshui")}>
            Phong Thủy & Bày Trí
          </button>
          <button className={`tab-btn ${tab === "tuong" ? "active" : ""}`} onClick={() => setTab("tuong")}>
            Nhân Tướng & Chỉ Tay
          </button>
          <button className={`tab-btn ${tab === "lunar" ? "active" : ""}`} onClick={() => setTab("lunar")}>
            Lịch Vạn Niên
          </button>
          <button
            className="tab-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Chuyển giao diện Sáng / Tối"
          >
            {theme === "dark" ? "☀️ Sáng" : "🌙 Tối"}
          </button>
        </div>
      </header>

      {tab === "cast" && (
        <div className="grid-2">
          <div>
            <div className="card">
              <h2>Thiết lập Gieo Quẻ</h2>
              <label>Chủ đề câu hỏi (Chọn Dụng Thần tự động)</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value as TopicKey)}>
                {Object.entries(TOPIC_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>{label}</option>
                ))}
              </select>

              <label>Câu hỏi / Vấn đề cần soi xét</label>
              <textarea rows={2} value={question} onChange={(e) => setQuestion(e.target.value)} />

              <div className="row">
                <div>
                  <label>Phương pháp</label>
                  <select value={method} onChange={(e) => setMethod(e.target.value as DivinationMethod)}>
                    <option value="thi_sach">Thi Sách (Cỏ thi 1/16)</option>
                    <option value="dong_xu">3 Đồng Xu (1/8)</option>
                    <option value="mai_hoa">Mai Hoa Dịch Số (3 số)</option>
                    <option value="manual">Nhập tay 6 hào</option>
                  </select>
                </div>
                <div>
                  <label>Ngày xem (Can Chi)</label>
                  <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
                </div>
              </div>

              {method === "mai_hoa" && (
                <div className="row">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx}>
                      <label>{idx === 0 ? "Số Thượng" : idx === 1 ? "Số Hạ" : "Số Động"}</label>
                      <input
                        type="number"
                        value={mhNums[idx]}
                        onChange={(e) => {
                          const copy: [number, number, number] = [...mhNums] as [number, number, number];
                          copy[idx] = Number(e.target.value) || 1;
                          setMhNums(copy);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {method === "manual" && (
                <div style={{ marginBottom: 12 }}>
                  <label>Chọn từng hào (từ Hào 6 trên xuống Hào 1 dưới)</label>
                  {[5, 4, 3, 2, 1, 0].map((idx) => (
                    <div className="row" key={idx} style={{ alignItems: "center", marginBottom: 4 }}>
                      <span className="muted" style={{ flex: "0 0 60px" }}>Hào {idx + 1}</span>
                      <select
                        style={{ marginBottom: 0 }}
                        value={values[idx]}
                        onChange={(e) => {
                          const copy = [...values] as LineValue[];
                          copy[idx] = Number(e.target.value) as LineValue;
                          setValues(copy);
                        }}
                      >
                        <option value={7}>7 — Thiếu Dương (tĩnh)</option>
                        <option value={8}>8 — Thiếu Âm (tĩnh)</option>
                        <option value={9}>9 — Lão Dương (động)</option>
                        <option value={6}>6 — Lão Âm (động)</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <button className="btn-primary" onClick={handleCast}>
                {method === "manual" ? "Lưu & Phân tích Quẻ" : "Gieo Quẻ Ngay"}
              </button>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h3 style={{ margin: 0 }}>Lịch sử gần đây</h3>
                {history.length > 0 && (
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem(HISTORY_KEY);
                    }}
                  >
                    Xóa
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="muted">Chưa có quẻ nào được lưu.</p>
              ) : (
                history.slice(0, 6).map((h) => (
                  <div
                    key={h.id}
                    style={{ padding: "8px 0", borderBottom: "1px solid var(--border)", cursor: "pointer" }}
                    onClick={() => {
                      setValues(h.values);
                      setQuestion(h.question);
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                      {h.baseName} {h.changedName ? `→ ${h.changedName}` : ""}
                    </div>
                    <div className="muted" style={{ fontSize: "0.78rem" }}>
                      {h.at} · {h.question}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="hex-boxes">
              <div className="hex-box">
                <div className="tag">Quẻ Bản · #{built.base.id}</div>
                <div className="name">
                  {built.base.hanViet} ({built.base.chinese})
                </div>
                <HexagramBars lines={built.base.lines} moving={built.movingPositions} />
                <div className="muted" style={{ marginTop: 8 }}>
                  Cung {lucHao.palace} ({lucHao.palaceElement})
                </div>
              </div>

              <div className="hex-box">
                <div className="tag">Quẻ Biến</div>
                <div className="name">
                  {built.changed ? `#${built.changed.id} ${built.changed.hanViet} (${built.changed.chinese})` : "Quẻ Tĩnh (Không biến)"}
                </div>
                <HexagramBars lines={(built.changed ?? built.base).lines} />
              </div>

              <div className="hex-box">
                <div className="tag">Quẻ Hỗ · #{built.mutual.id}</div>
                <div className="name">
                  {built.mutual.hanViet} ({built.mutual.chinese})
                </div>
                <HexagramBars lines={built.mutual.lines} />
              </div>
            </div>

            <div className="card">
              <h2>Bảng Lục Hào Kinh Phòng</h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Ngày <strong>{lucHao.dayCanChi.name}</strong> · Tuần Không:{" "}
                <strong>{lucHao.dayCanChi.tuanKhong.join(", ")}</strong> · Nguyệt Kiến:{" "}
                <strong>
                  {lucHao.nguyetKien.branch} ({lucHao.nguyetKien.element})
                </strong>{" "}
                ({lucHao.nguyetKien.solarTermWindow})
              </p>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Hào</th>
                      <th>Lục Thần</th>
                      <th>Lục Thân</th>
                      <th>Địa Chi</th>
                      <th>Thế/Ứng</th>
                      <th>Vượng Suy</th>
                      <th>Biến / Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...lucHao.rows].reverse().map((r) => (
                      <tr key={r.position}>
                        <td>
                          H{r.position} {r.moving ? (r.value === 9 ? "O" : "X") : ""}
                        </td>
                        <td>{r.spirit}</td>
                        <td>{r.relation}</td>
                        <td>
                          {r.branch} ({r.element})
                        </td>
                        <td>
                          {r.shi && <span className="badge badge-gold">Thế</span>}
                          {r.ying && <span className="badge badge-kv">Ứng</span>}
                        </td>
                        <td>{r.strength.state}</td>
                        <td>
                          {r.tuanKhong && <span className="badge badge-hung" style={{ marginRight: 4 }}>Không</span>}
                          {r.moving && r.changedBranch
                            ? `→ ${r.changedRelation} ${r.changedBranch} (${r.changedElement})`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <h2 style={{ margin: 0 }}>{interp.headline}</h2>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    exportKinhDichWord({
                      question,
                      base: built.base,
                      changed: built.changed,
                      mutual: built.mutual,
                      lucHao,
                      interp,
                    })
                  }
                >
                  ⬇ Tải Word (.docx)
                </button>
              </div>
              <p style={{ marginTop: 0 }}>{interp.overview}</p>
              {interp.sections.map((s) => (
                <div key={s.title} style={{ marginBottom: 10 }}>
                  <strong>{s.title}:</strong> <span className="muted">{s.body}</span>
                </div>
              ))}
              <p className="muted" style={{ fontSize: "0.8rem", borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                {interp.caveat}
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "lookup" && (
        <div className="grid-2">
          <div className="card">
            <h2>Chi tiết Quẻ #{selectedHex.id}</h2>
            <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>
              {selectedHex.hanViet} ({selectedHex.chinese})
            </div>
            <p className="muted" style={{ marginTop: 0 }}>{selectedHex.english}</p>
            <HexagramBars lines={selectedHex.lines} />
            <div style={{ marginTop: 12 }} className="muted">
              <div>Thượng quái: {TRIGRAMS[selectedHex.upper].hanViet} ({TRIGRAMS[selectedHex.upper].symbol})</div>
              <div>Hạ quái: {TRIGRAMS[selectedHex.lower].hanViet} ({TRIGRAMS[selectedHex.lower].symbol})</div>
              <div>Bát Cung: {TRIGRAMS[selectedHex.palace].hanViet} ({selectedHex.palaceElement})</div>
              <div>Thế: Hào {selectedHex.shi} · Ứng: Hào {selectedHex.ying}</div>
              <div>Nhị phân (dưới→trên): <code>{selectedHex.binary}</code></div>
            </div>
            <button
              className="btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => {
                setValues(selectedHex.lines.map((b) => (b === 1 ? 7 : 8)) as LineValue[]);
                setTab("cast");
              }}
            >
              Mở quẻ này trong bảng Lục Hào
            </button>
          </div>

          <div className="card">
            <h2>Danh mục 64 Quẻ Chu Dịch</h2>
            <input
              placeholder="Tìm theo tên quẻ, số 1-64, hoặc tên Bát Cung..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="hex-grid">
              {filteredHexagrams.map((h) => (
                <div key={h.id} className="hex-item" onClick={() => setSelectedHex(h)}>
                  <div className="muted" style={{ fontSize: "0.75rem" }}>
                    #{h.id} · Cung {TRIGRAMS[h.palace].hanViet}
                  </div>
                  <div style={{ fontWeight: 700, margin: "2px 0" }}>
                    {h.hanViet} ({h.chinese})
                  </div>
                  <div className="muted" style={{ fontSize: "0.78rem" }}>
                    {TRIGRAMS[h.upper].symbol} / {TRIGRAMS[h.lower].symbol} · Thế {h.shi} / Ứng {h.ying}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "ziwei" && (
        <div className="grid-2">
          <div>
            <div className="card">
              <h2>Thông tin Lập Lá Số Tử Vi</h2>
              <div className="row">
                <div>
                  <label>Họ tên đương số</label>
                  <input value={zwName} onChange={(e) => setZwName(e.target.value)} />
                </div>
                <div>
                  <label>Loại lịch nhập</label>
                  <select value={zwCalType} onChange={(e) => setZwCalType(e.target.value as "solar" | "lunar")}>
                    <option value="solar">Dương lịch (Tự đổi ÂL)</option>
                    <option value="lunar">Âm lịch</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div>
                  <label>Năm sinh</label>
                  <input type="number" value={zwYear} onChange={(e) => setZwYear(Number(e.target.value) || 1990)} />
                </div>
                <div>
                  <label>Tháng</label>
                  <input type="number" min={1} max={12} value={zwMonth} onChange={(e) => setZwMonth(Math.min(12, Math.max(1, Number(e.target.value) || 1)))} />
                </div>
                <div>
                  <label>Ngày</label>
                  <input type="number" min={1} max={31} value={zwDay} onChange={(e) => setZwDay(Math.min(31, Math.max(1, Number(e.target.value) || 1)))} />
                </div>
              </div>

              <div className="row">
                <div>
                  <label>Giờ:Phút sinh</label>
                  <input type="time" value={birthClock} onChange={(e) => setBirthClock(e.target.value)} />
                </div>
                <div>
                  <label>Giới tính</label>
                  <select value={zwGender} onChange={(e) => setZwGender(e.target.value as "Nam" | "Nữ")}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label>Năm xem (Lưu Niên)</label>
                  <input type="number" value={zwViewYear} onChange={(e) => setZwViewYear(Number(e.target.value) || 2026)} />
                </div>
              </div>

              <label>Tỉnh / Thành nơi sinh (Giờ Chân Thái Dương)</label>
              <select value={provinceName} onChange={(e) => setProvinceName(e.target.value)}>
                {VN_PROVINCES.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} ({p.region})</option>
                ))}
              </select>
              <div className="muted" style={{ fontSize: "0.78rem", marginBottom: 8 }}>
                Chân Thái Dương: <strong>{solarTime.formatted} → Giờ {BRANCHES[solarTime.branchIdx]}</strong> · Âm lịch: <strong>{zwChart.lunarDateStr}</strong>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <button className={`tab-btn ${zwCalibrate ? "active" : ""}`} onClick={() => setZwCalibrate(!zwCalibrate)}>
                  Biện chứng giờ sinh
                </button>
                <button className={`tab-btn ${zwSynastryOn ? "active" : ""}`} onClick={() => setZwSynastryOn(!zwSynastryOn)}>
                  Song Bàn Đối Chiếu
                </button>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <div><strong>Can Chi:</strong> {zwChart.yearCanChi} ({zwChart.gender}) · <strong>{zwChart.cucName}</strong></div>
                <div><strong>Bản Mệnh:</strong> {zwChart.napAm} · <strong>Thân cư:</strong> {zwChart.thanCung} ({zwChart.thanBranch})</div>
                {zwChart.patterns.length > 0 && (
                  <div style={{ marginTop: 6 }}>
                    {zwChart.patterns.map((pt) => (
                      <span key={pt} className="badge badge-gold" style={{ marginRight: 4, marginBottom: 4 }}>{pt}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {zwSynastryOn && (
              <div className="card">
                <h3>Song Bàn Đối Chiếu (Người B)</h3>
                <div className="row">
                  <div>
                    <label>Tên Người B</label>
                    <input value={zwBName} onChange={(e) => setZwBName(e.target.value)} />
                  </div>
                  <div>
                    <label>Mục đích</label>
                    <select value={zwSynMode} onChange={(e) => setZwSynMode(e.target.value as "hon_nhan" | "hop_tac")}>
                      <option value="hon_nhan">Hợp Hôn / Tình Duyên</option>
                      <option value="hop_tac">Đối Tác Làm Ăn</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div><label>Năm</label><input type="number" value={zwBYear} onChange={(e) => setZwBYear(Number(e.target.value) || 1992)} /></div>
                  <div><label>Tháng</label><input type="number" min={1} max={12} value={zwBMonth} onChange={(e) => setZwBMonth(Number(e.target.value) || 1)} /></div>
                  <div><label>Ngày</label><input type="number" min={1} max={31} value={zwBDay} onChange={(e) => setZwBDay(Number(e.target.value) || 1)} /></div>
                </div>
                <div className="row">
                  <div>
                    <label>Giờ sinh B</label>
                    <select value={zwBHourIdx} onChange={(e) => setZwBHourIdx(Number(e.target.value))}>
                      {BRANCHES.map((b, i) => (<option key={b} value={i}>Giờ {b}</option>))}
                    </select>
                  </div>
                  <div>
                    <label>Giới tính B</label>
                    <select value={zwBGender} onChange={(e) => setZwBGender(e.target.value as "Nam" | "Nữ")}>
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                    </select>
                  </div>
                </div>
                {zwSynastry && (
                  <div className="muted" style={{ fontSize: "0.84rem", borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                    <div style={{ color: "var(--gold)", fontWeight: 700 }}>{zwSynastry.modeLabel}</div>
                    <div>• {zwSynastry.summary}</div>
                    <div>• {zwSynastry.targetCompare}</div>
                    <div>• {zwSynastry.tuHoaInteraction}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <h2 style={{ margin: 0 }}>Mệnh Bàn 12 Cung ({zwChart.fullName})</h2>
              <button className="btn-ghost" onClick={() => exportZiweiWord(zwChart, zwSynastry)}>
                ⬇ Tải Word (.docx)
              </button>
            </div>
            <div className="ziwei-grid">
              {ZIWEI_GRID_BRANCHES.map((bIdx, i) => {
                if (bIdx === -1) {
                  return (
                    <div className="zw-center" key={`center-${i}`}>
                      <div style={{ color: "var(--gold)", fontWeight: 700, fontSize: "1.02rem", marginBottom: 4 }}>
                        THIÊN BÀN TỬ VI · {zwChart.fullName}
                      </div>
                      <div className="muted">ÂL: {zwChart.lunarDateStr} ({zwChart.yearCanChi})</div>
                      <div className="muted">{zwChart.napAm} · {zwChart.cucName}</div>
                      <div className="muted" style={{ fontSize: "0.76rem" }}>Mệnh Chủ: {zwChart.menhChu} · Thân Chủ: {zwChart.thanChu}</div>
                      <div style={{ marginTop: 6, fontSize: "0.8rem" }}>
                        <strong>Tứ Hóa:</strong> Lộc ({zwChart.tuHoa.loc}) · Quyền ({zwChart.tuHoa.quyen}) · Khoa ({zwChart.tuHoa.khoa}) · Kỵ ({zwChart.tuHoa.ky})
                      </div>
                      <div className="muted" style={{ fontSize: "0.78rem", marginTop: 2 }}>
                        <strong>Lưu {zwViewYear}:</strong> L.Lộc ({zwChart.luuTuHoa.loc}) · L.Kỵ ({zwChart.luuTuHoa.ky})
                      </div>
                      {zwChart.diepGia.length > 0 && (
                        <div style={{ fontSize: "0.76rem", color: "var(--gold)", marginTop: 4 }}>
                          {zwChart.diepGia.join(" | ")}
                        </div>
                      )}
                    </div>
                  );
                }
                const p = zwChart.palaces[bIdx];
                const isSanFang =
                  selectedZwBranch !== null &&
                  (bIdx === selectedZwBranch ||
                    bIdx === (selectedZwBranch + 4) % 12 ||
                    bIdx === (selectedZwBranch + 8) % 12 ||
                    bIdx === (selectedZwBranch + 6) % 12);
                return (
                  <div
                    className={`zw-cell ${p.cung === "Mệnh" ? "menh" : ""} ${isSanFang ? "sanfang" : ""}`}
                    key={p.branch}
                    onClick={() => setSelectedZwBranch(selectedZwBranch === bIdx ? null : bIdx)}
                    title="Nhấn để xem Tam Phương Tứ Chính & Phi Tinh Tứ Hóa của cung này"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                      <span style={{ color: p.cung === "Mệnh" ? "var(--gold)" : "var(--accent)" }}>
                        {p.cung} {p.isThan ? "(Thân)" : ""}
                      </span>
                      <span className="muted">{p.stem} {p.branch}</span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {p.stars.length ? (
                        p.stars.map((s) => (
                          <div key={s} style={{ fontWeight: 700, color: "var(--text)" }}>{s}</div>
                        ))
                      ) : (
                        <span className="muted">(Vô Chính Diệu)</span>
                      )}
                      {p.auxStars.length > 0 && (
                        <div style={{ fontSize: "0.74rem", color: "var(--cat)" }}>{p.auxStars.join(", ")}</div>
                      )}
                      {p.satStars.length > 0 && (
                        <div style={{ fontSize: "0.74rem", color: "var(--hung)" }}>{p.satStars.join(", ")}</div>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginTop: 4 }} className="muted">
                      <span>{p.trangSinh} · ĐH {p.daiHan}</span>
                      <span>
                        {p.isTuan ? "[Tuần]" : ""}
                        {p.isTriet ? "[Triệt]" : ""}
                        {p.isLuuThaiTue ? `★${zwViewYear}` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {zwCalibrate && zwCalibrateCharts.length > 0 && (
              <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <h3 style={{ margin: "0 0 8px", color: "var(--accent)" }}>Biện Chứng Định Giờ Sinh (Đối chiếu 3 canh giờ)</h3>
                <div className="hex-boxes" style={{ marginBottom: 0 }}>
                  {zwCalibrateCharts.map((c) => (
                    <div className="hex-box" key={c.hourBranch}>
                      <div className="tag">{c.label} · Giờ {c.hourBranch}</div>
                      <div className="name">Mệnh tại {c.chart.menhBranch}</div>
                      <div className="muted" style={{ fontSize: "0.8rem" }}>{c.chart.mainTraitSummary}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
              {selectedZwBranch !== null && (() => {
                const sp = zwChart.palaces[selectedZwBranch];
                const sr = zwChart.allPalaceReadings.find((r) => r.cung === sp.cung);
                return sr ? (
                  <div style={{ background: "var(--panel-2)", border: "1px solid var(--accent)", borderRadius: 8, padding: 10, marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, color: "var(--accent)", marginBottom: 4 }}>
                      Đang soi Cung {sr.cung} ({sp.stem} {sp.branch}) — Tam Phương Tứ Chính
                    </div>
                    <div className="muted" style={{ fontSize: "0.84rem" }}>• <strong>Ý nghĩa:</strong> {sr.meaning}</div>
                    <div className="muted" style={{ fontSize: "0.84rem" }}>• <strong>Chính tinh:</strong> {sr.mainText} | <strong>Tam phương hội:</strong> {sr.sanFangText}</div>
                    <div className="muted" style={{ fontSize: "0.84rem" }}>• <strong>Phi Tinh Tứ Hóa:</strong> {sr.flyText}</div>
                  </div>
                ) : null;
              })()}
              <h3 style={{ margin: "0 0 8px", color: "var(--gold)" }}>Bình Giải Chi Tiết Lá Số</h3>
              {zwChart.detailedAnalysis.map((s) => (
                <div key={s.title} style={{ marginBottom: 8 }}>
                  <strong>{s.title}:</strong> <span className="muted">{s.body}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "bazi" && (
        <div className="grid-2">
          <div>
            <div className="card">
              <h2>Lập Lá Số Bát Tự (Tứ Trụ Tử Bình)</h2>
              <label>Ngày sinh Dương lịch (tính theo Tiết Khí)</label>
              <input type="date" value={bzDate} onChange={(e) => setBzDate(e.target.value)} />
              <div className="row">
                <div>
                  <label>Giờ:Phút sinh</label>
                  <input type="time" value={birthClock} onChange={(e) => setBirthClock(e.target.value)} />
                </div>
                <div>
                  <label>Giới tính</label>
                  <select value={bzGender} onChange={(e) => setBzGender(e.target.value as "Nam" | "Nữ")}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>
              <label>Tỉnh / Thành phố nơi sinh (Hiệu chỉnh Chân Thái Dương)</label>
              <select value={provinceName} onChange={(e) => setProvinceName(e.target.value)}>
                {VN_PROVINCES.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} ({p.region})</option>
                ))}
              </select>
              <div className="muted" style={{ fontSize: "0.8rem", marginBottom: 8 }}>
                Giờ Chân Thái Dương ({province.lon}°E, lệch {solarTime.offsetMinutes >= 0 ? `+${solarTime.offsetMinutes}` : solarTime.offsetMinutes} phút):{" "}
                <strong>{solarTime.formatted} → Giờ {BRANCHES[solarTime.branchIdx]}</strong>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                <div><strong>Nhật Chủ:</strong> <span style={{ color: "var(--gold)" }}>{baziChart.dayMaster}</span></div>
                <div><strong>Trạng thái:</strong> {baziChart.strengthLabel}</div>
                <div className="muted" style={{ marginTop: 6 }}>
                  <strong>Dụng Thần cân bằng:</strong> {baziChart.dungThanAdvice}
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Đối Chiếu Hợp Tuổi / Đối Tác</h2>
              <label>Năm sinh đối tác / người phối ngẫu / xông đất</label>
              <input type="number" min={1920} max={2050} value={partnerYear} onChange={(e) => setPartnerYear(Number(e.target.value) || 1992)} />
              <div><strong>{ageCompat.personA}</strong> ↔ <strong>{ageCompat.personB}</strong></div>
              <div style={{ marginTop: 6, color: "var(--gold)", fontWeight: 700 }}>{ageCompat.relation}</div>
              <p className="muted" style={{ marginBottom: 0 }}>{ageCompat.verdict}</p>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <h2 style={{ margin: 0 }}>Bảng Tứ Trụ, Thập Thần & Tàng Can</h2>
              <button className="btn-ghost" onClick={() => exportBaziWord(baziChart, ageCompat)}>
                ⬇ Tải Word (.docx)
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Trụ</th>
                  <th>Thiên Can (Thập Thần)</th>
                  <th>Địa Chi</th>
                  <th>Tàng Can (Ẩn)</th>
                </tr>
              </thead>
              <tbody>
                {baziChart.pillars.map((p) => (
                  <tr key={p.label}>
                    <td><strong>{p.label}</strong></td>
                    <td>{p.stem} ({p.stemElement}) · <span style={{ color: "var(--gold)" }}>{p.tenGod}</span></td>
                    <td>{p.branch} ({p.branchElement})</td>
                    <td className="muted">{p.hiddenStems.map((h) => `${h.stem} (${h.tenGod})`).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <h3 style={{ margin: "0 0 8px", color: "var(--gold)" }}>Phân Bổ Ngũ Hành (Tứ Trụ + Lệnh Tháng)</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {Object.entries(baziChart.counts).map(([el, val]) => (
                  <span key={el} className="badge badge-kv" style={{ fontSize: "0.85rem", padding: "4px 10px" }}>
                    {el}: <strong>{val}</strong>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <h3 style={{ margin: "0 0 8px", color: "var(--gold)" }}>Đại Vận 10 Năm (Đi {baziChart.luckDirection})</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                {baziChart.luckPillars.map((lp) => (
                  <div key={lp.ageRange} style={{ background: "var(--panel-2)", border: "1px solid var(--border)", borderRadius: 6, padding: 6, fontSize: "0.78rem" }}>
                    <div className="muted">{lp.ageRange}t</div>
                    <div style={{ fontWeight: 700 }}>{lp.stem} {lp.branch}</div>
                    <div style={{ color: "var(--accent)" }}>{lp.tenGod}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "fengshui" && (
        <div className="grid-2">
          <div>
            <div className="card">
              <h2>1. Cung Phi Bát Trạch (Gia Chủ)</h2>
              <div className="row">
                <div>
                  <label>Năm sinh (Âm lịch)</label>
                  <input type="number" min={1900} max={2100} value={birthYear} onChange={(e) => setBirthYear(Number(e.target.value) || 1990)} />
                </div>
                <div>
                  <label>Giới tính</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as "Nam" | "Nữ")}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>
              <div>
                Cung Phi: <strong style={{ color: "var(--gold)" }}>{batTrach.cungPhi}</strong> ({batTrach.element}) ·{" "}
                <span className="muted">{batTrach.group}</span>
              </div>
              <label style={{ marginTop: 10 }}>Tỉnh / Thành phố xây dựng (Khí hậu vùng miền)</label>
              <select value={provinceName} onChange={(e) => setProvinceName(e.target.value)}>
                {VN_PROVINCES.map((p) => (
                  <option key={p.name} value={p.name}>{p.name} ({p.region})</option>
                ))}
              </select>
              <div className="muted" style={{ fontSize: "0.8rem" }}>
                <strong>Lưu ý {province.region}:</strong> {REGION_CLIMATE_TIPS[province.region]}
              </div>
              <div style={{ marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 8, fontSize: "0.84rem" }}>
                <strong>Xem Tuổi Làm Nhà năm {fsViewYear} ({buildAge.tuoiMu} tuổi mụ):</strong>
                <div className="muted">
                  • {buildAge.tamTaiDetail} · {buildAge.kimLauReason ?? "Không phạm Kim Lâu"} · Hoang Ốc: {buildAge.hoangOc.name} ({buildAge.hoangOc.good ? "Tốt" : "Xấu"})
                </div>
                <div style={{ color: "var(--gold)", fontWeight: 600, marginTop: 2 }}>{buildAge.verdict}</div>
              </div>
            </div>

            <div className="card">
              <h2>2. La Kinh Huyền Không Phi Tinh</h2>
              <div className="row">
                <div>
                  <label>Vận (1–9, hiện tại Vận 9)</label>
                  <input type="number" min={1} max={9} value={period} onChange={(e) => setPeriod(Math.min(9, Math.max(1, Number(e.target.value) || 9)))} />
                </div>
                <div>
                  <label>Độ số Hướng nhà (0–360°)</label>
                  <input type="number" min={0} max={359.9} step="0.5" value={facingDeg} onChange={(e) => setFacingDeg(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div className="muted">
                Tọa <strong>{flyingStars.sitting.name}</strong> ({flyingStars.sitting.direction}) — Hướng{" "}
                <strong>{flyingStars.facing.name}</strong> ({flyingStars.facing.direction}) · {flyingStars.facing.yuanLong} Nguyên Long ({flyingStars.facing.polarity})
              </div>
              {flyingStars.boundaryWarning && (
                <div style={{ marginTop: 6 }}>
                  <span className="badge badge-hung">Cảnh báo: {flyingStars.boundaryWarning}</span>
                </div>
              )}
              <div style={{ marginTop: 8, color: "var(--gold)", fontWeight: 600 }}>{flyingStars.pattern}</div>
            </div>

            <div className="card">
              <h2>3. Lưu Niên Phi Tinh & Trạch Nhật</h2>
              <div className="row">
                <div>
                  <label>Năm xem Lưu Niên</label>
                  <input type="number" value={fsViewYear} onChange={(e) => setFsViewYear(Number(e.target.value) || 2026)} />
                </div>
                <div>
                  <label>Sao Trung Cung năm {annualFs.targetYear}</label>
                  <input readOnly value={`Sao ${annualFs.centerStar} (${annualFs.yearCanChi})`} />
                </div>
              </div>
              <div className="muted" style={{ marginBottom: 8 }}>
                • Thái Tuế: <strong>{annualFs.thaiTue}</strong> · Tuế Phá: <strong>{annualFs.tuePha}</strong> · Tam Sát: <strong>{annualFs.tamSatDir}</strong><br />
                • Ngũ Hoàng năm tại: <strong style={{ color: "var(--hung)" }}>{annualFs.fiveYellowName}</strong> · Nhị Hắc: <strong>{annualFs.twoBlackName}</strong><br />
                • Cửu Tử vượng hỷ: <strong style={{ color: "var(--cat)" }}>{annualFs.ninePurpleName}</strong> · Nhất Bạch: <strong>{annualFs.oneWhiteName}</strong>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                Ngày <strong>{trachNhat.dayCanChi}</strong> ({trachNhat.date}) · Tháng <strong>{trachNhat.monthBranch}</strong> · Trực <strong>{trachNhat.truc.name}</strong> ({trachNhat.truc.rating}) ·{" "}
                <span className={`badge ${trachNhat.hoangDao.type === "Hoàng Đạo" ? "badge-cat" : "badge-hung"}`}>
                  {trachNhat.hoangDao.star} ({trachNhat.hoangDao.type})
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <h2 style={{ margin: 0 }}>Tư Vấn Hướng Nhà & Bày Trí Đồ Đạc (Nhà Ở & Văn Phòng)</h2>
                <button
                  className="btn-ghost"
                  onClick={() =>
                    exportFengShuiWord({
                      batTrach,
                      flyingStars,
                      layoutAdvice,
                      analysis: fsAnalysis,
                      media: fsMedia,
                    })
                  }
                >
                  ⬇ Tải Word (.docx)
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Hạng mục</th>
                    <th>Hướng / Vị trí đề xuất</th>
                    <th>Nguyên tắc & Lưu ý</th>
                  </tr>
                </thead>
                <tbody>
                  {layoutAdvice.map((row) => (
                    <tr key={row.item}>
                      <td><strong>{row.item}</strong></td>
                      <td style={{ color: "var(--gold)" }}>{row.place}</td>
                      <td className="muted">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h2>Tinh Bàn Huyền Không 9 Cung (Vận {flyingStars.period})</h2>
              <p className="muted" style={{ marginTop: 0 }}>
                Mỗi ô hiển thị: <strong>Sơn Tinh (trái)</strong> · Vận Tinh (giữa) · <strong>Hướng Tinh (phải)</strong>. Nam ở trên, Bắc ở dưới.
              </p>
              <div className="grid-3x3">
                {flyingStars.palaces.map((p) => (
                  <div key={p.palace} className={`palace-cell ${p.isFacing || p.isSitting ? "highlight" : ""}`}>
                    <div className="muted" style={{ fontSize: "0.75rem" }}>
                      {p.name} {p.isFacing ? "★HƯỚNG" : p.isSitting ? "▲TỌA" : ""}
                    </div>
                    <div className="stars-row">
                      <span title="Sơn Tinh">{p.mountainStar}</span>
                      <span className="muted" title="Vận Tinh">[{p.baseStar}]</span>
                      <span style={{ color: "var(--accent)" }} title="Hướng Tinh">{p.facingStar}</span>
                      <span className="badge badge-kv" title={`Lưu Niên ${annualFs.targetYear}`}>N:{annualFs.annualStars[p.palace]}</span>
                    </div>
                    <div className="muted" style={{ fontSize: "0.72rem" }}>
                      {STAR_MEANINGS[p.facingStar].split(":")[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Bình Giải & Hóa Giải Chi Tiết</h2>
              {fsAnalysis.map((s) => (
                <div key={s.title} style={{ marginBottom: 10 }}>
                  <strong>{s.title}:</strong> <span className="muted">{s.body}</span>
                </div>
              ))}
            </div>

            <MediaUploadPanel
              title="4. Tải Ảnh / PDF Mặt Bằng Nhà Ở & Văn Phòng"
              acceptHint="Hỗ trợ ảnh (.png, .jpg) hoặc file .pdf bản vẽ mặt bằng. Ảnh sẽ tự động phủ La Kinh xoay theo độ số hướng nhà."
              overlayMode="compass"
              compassDeg={facingDeg}
              media={fsMedia}
              onChange={setFsMedia}
            />
          </div>
        </div>
      )}

      {tab === "tuong" && (
        <div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div className="card">
              <h2>Đánh Giá Nhân Tướng & Chỉ Tay Cá Nhân</h2>
              <div className="row">
                <div>
                  <label>Thượng Đình (Trán, 1–30t)</label>
                  <select value={tuongInput.thuongDinh} onChange={(e) => setTuongInput({ ...tuongInput, thuongDinh: e.target.value as TuongAssessmentInput["thuongDinh"] })}>
                    <option value="cao_rong">Cao, rộng, sáng sủa</option>
                    <option value="trung_binh">Cân đối trung bình</option>
                    <option value="hep_thap">Hẹp hoặc hơi thấp</option>
                  </select>
                </div>
                <div>
                  <label>Trung Đình (Mũi & Gò má, 31–50t)</label>
                  <select value={tuongInput.trungDinh} onChange={(e) => setTuongInput({ ...tuongInput, trungDinh: e.target.value as TuongAssessmentInput["trungDinh"] })}>
                    <option value="mui_thang_quyen_day">Mũi thẳng, gò má đầy cân xứng</option>
                    <option value="trung_binh">Hài hòa trung bình</option>
                    <option value="mui_thap_quyen_yeu">Mũi thấp hoặc má hơi hóp</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div>
                  <label>Hạ Đình (Cằm & Hàm, 51+t)</label>
                  <select value={tuongInput.haDinh} onChange={(e) => setTuongInput({ ...tuongInput, haDinh: e.target.value as TuongAssessmentInput["haDinh"] })}>
                    <option value="cam_day_vung">Cằm đầy đặn, vững chãi</option>
                    <option value="trung_binh">Cân xứng trung bình</option>
                    <option value="cam_nhon_ngan">Cằm thon nhọn / ngắn</option>
                  </select>
                </div>
                <div>
                  <label>Ấn Đường (Giữa 2 lông mày)</label>
                  <select value={tuongInput.anDuong} onChange={(e) => setTuongInput({ ...tuongInput, anDuong: e.target.value as TuongAssessmentInput["anDuong"] })}>
                    <option value="sang_rong">Sáng rộng, thoáng</option>
                    <option value="nhieu_nep_nhan">Hay nhíu / có nếp nhăn</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div>
                  <label>Chỉ tay Sinh Đạo</label>
                  <select value={tuongInput.sinhDao} onChange={(e) => setTuongInput({ ...tuongInput, sinhDao: e.target.value as TuongAssessmentInput["sinhDao"] })}>
                    <option value="sau_ro_rong">Sâu rõ, vòng cung rộng</option>
                    <option value="mo_dut_doan">Mờ hoặc nhiều nhánh cắt</option>
                  </select>
                </div>
                <div>
                  <label>Chỉ tay Trí Đạo</label>
                  <select value={tuongInput.triDao} onChange={(e) => setTuongInput({ ...tuongInput, triDao: e.target.value as TuongAssessmentInput["triDao"] })}>
                    <option value="thang_ro">Thẳng, rõ nét (Logic)</option>
                    <option value="cong_thai_am">Cong về gò Thái Âm (Sáng tạo)</option>
                    <option value="ngan_dut">Ngắn hoặc đứt đoạn</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <h2 style={{ margin: 0 }}>Báo Cáo Luận Giải Nhân Tướng</h2>
                <button className="btn-ghost" onClick={() => exportNhanTuongWord(tuongReport, tuongMedia)}>
                  ⬇ Tải Word (.docx)
                </button>
              </div>
              {tuongReport.map((s) => (
                <div key={s.title} style={{ marginBottom: 10 }}>
                  <strong>{s.title}:</strong> <span className="muted">{s.body}</span>
                </div>
              ))}
            </div>
          </div>

          <MediaUploadPanel
            title="Tải Ảnh Chân Dung / Bàn Tay / Hồ Sơ PDF"
            acceptHint="Hỗ trợ ảnh khuôn mặt, chỉ tay (.png, .jpg) hoặc file .pdf. Có lưới đối chiếu Tam Đình – Ngũ Nhạc trực tiếp."
            overlayMode="tuong"
            media={tuongMedia}
            onChange={setTuongMedia}
          />

          <div className="card">
            <h2>Tra Cứu Kiến Thức Ma Y Thần Tướng & Chỉ Tay</h2>
            <p className="muted" style={{ marginTop: 0 }}>
              Nguyên tắc: <strong>Thần &gt; Khí &gt; Hình</strong> · <em>"Hữu tướng tâm sinh, vô tướng tâm diệt"</em> — Luôn xét tổng hòa, không phán đoán phiến diện từ 1 bộ vị đơn lẻ.
            </p>
            <div className="tabs">
              {["Tất cả", "Tam Đình", "Ngũ Nhạc", "12 Cung Khuôn Mặt", "Tam Tài Tuyến", "Bát Gò Bàn Tay"].map((c) => (
                <button key={c} className={`tab-btn ${tuongCat === c ? "active" : ""}`} onClick={() => setTuongCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="hex-grid">
            {filteredTuong.map((item) => (
              <div className="card" key={item.id} style={{ marginBottom: 0 }}>
                <div className="muted" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>{item.category}</div>
                <h3 style={{ margin: "4px 0 8px" }}>{item.name}</h3>
                <div className="muted" style={{ marginBottom: 6 }}><strong>Vị trí:</strong> {item.position}</div>
                <div style={{ fontSize: "0.88rem", marginBottom: 6 }}><strong>Ý nghĩa:</strong> {item.meaning}</div>
                <div style={{ fontSize: "0.86rem", color: "var(--cat)", marginBottom: 6 }}><strong>Tướng tốt:</strong> {item.goodSign}</div>
                <div className="muted" style={{ fontSize: "0.84rem" }}><strong>Khuyến nghị:</strong> {item.advice}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "lunar" && (
        <LunarCalendarTab
          onSelectDateForApp={(d) => {
            setDateStr(d);
            setTab("cast");
          }}
        />
      )}
    </div>
  );
}
