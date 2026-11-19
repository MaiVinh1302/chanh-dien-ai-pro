import { useMemo, useState } from "react";
import {
  HEXAGRAMS,
  TRIGRAMS,
  buildHexagram,
  castThiSach,
  castThreeCoins,
  interpretHexagram,
  lucHaoForHexagram,
  maiHoaFromNumbers,
} from "./engine-index.ts";
import { calcBatTrach } from "./engine/batTrach.ts";
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
  const [tab, setTab] = useState<"cast" | "lookup" | "fengshui">("cast");
  const [method, setMethod] = useState<DivinationMethod>("thi_sach");
  const [question, setQuestion] = useState("Công việc và định hướng sắp tới");
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const [mhNums, setMhNums] = useState<[number, number, number]>([18, 25, 9]);
  const [values, setValues] = useState<LineValue[]>(() => castThiSach());
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  // Lookup tab state
  const [query, setQuery] = useState("");
  const [selectedHex, setSelectedHex] = useState<Hexagram>(HEXAGRAMS[0]);

  // Bat Trach state
  const [birthYear, setBirthYear] = useState(1990);
  const [gender, setGender] = useState<"Nam" | "Nữ">("Nam");

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
        base: built.base,
        changed: built.changed,
        mutual: built.mutual,
        movingPositions: built.movingPositions,
        chuHyRule: built.chuHyRule,
        lucHao,
      }),
    [question, built, lucHao]
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

  const batTrach = useMemo(() => calcBatTrach(birthYear, gender), [birthYear, gender]);

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">☯ Chánh Điện Dịch Đạo — Kinh Dịch & Lục Hào</h1>
          <p className="subtitle">
            Engine tất định: Chu Dịch Đại Toàn · Lục Hào Kinh Phòng · Mai Hoa Dịch Số · Bát Trạch
          </p>
        </div>
        <div className="tabs">
          <button className={`tab-btn ${tab === "cast" ? "active" : ""}`} onClick={() => setTab("cast")}>
            Gieo Quẻ & Lục Hào
          </button>
          <button className={`tab-btn ${tab === "lookup" ? "active" : ""}`} onClick={() => setTab("lookup")}>
            Tra Cứu 64 Quẻ
          </button>
          <button className={`tab-btn ${tab === "fengshui" ? "active" : ""}`} onClick={() => setTab("fengshui")}>
            Bát Trạch Cung Phi
          </button>
        </div>
      </header>

      {tab === "cast" && (
        <div className="grid-2">
          <div>
            <div className="card">
              <h2>Thiết lập Gieo Quẻ</h2>
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
              <h2>{interp.headline}</h2>
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

      {tab === "fengshui" && (
        <div className="grid-2">
          <div className="card">
            <h2>Tính Cung Phi Bát Trạch</h2>
            <label>Năm sinh (Âm lịch)</label>
            <input
              type="number"
              min={1900}
              max={2100}
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value) || 1990)}
            />
            <label>Giới tính</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as "Nam" | "Nữ")}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <div style={{ marginTop: 8 }}>
              <div>
                Cung Phi: <strong style={{ color: "var(--gold)" }}>{batTrach.cungPhi}</strong> ({batTrach.element})
              </div>
              <div className="muted">Nhóm mệnh: {batTrach.group}</div>
            </div>
          </div>

          <div className="card">
            <h2>8 Hướng Cát Hung (Bát Trạch Minh Cảnh)</h2>
            <table>
              <thead>
                <tr>
                  <th>Hướng</th>
                  <th>Cung</th>
                  <th>Sao Du Niên</th>
                  <th>Mức độ</th>
                  <th>Cát / Hung</th>
                </tr>
              </thead>
              <tbody>
                {batTrach.directions.map((d) => (
                  <tr key={d.direction}>
                    <td><strong>{d.direction}</strong></td>
                    <td>{d.palace}</td>
                    <td>{d.star}</td>
                    <td>{d.rating}</td>
                    <td>
                      <span className={`badge ${d.type === "Cát" ? "badge-cat" : "badge-hung"}`}>
                        {d.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
