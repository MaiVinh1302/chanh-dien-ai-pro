import { useState } from "react";

export interface UploadedMedia {
  name: string;
  mime: string;
  isPdf: boolean;
  url: string;
  bytes: Uint8Array | null;
  note: string;
}

interface Props {
  title: string;
  acceptHint: string;
  overlayMode?: "tuong" | "compass";
  compassDeg?: number;
  media: UploadedMedia | null;
  onChange: (media: UploadedMedia | null) => void;
}

export function MediaUploadPanel({
  title,
  acceptHint,
  overlayMode,
  compassDeg = 180,
  media,
  onChange,
}: Props) {
  const [showOverlay, setShowOverlay] = useState(true);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (media?.url) URL.revokeObjectURL(media.url);
    const url = URL.createObjectURL(file);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const bytes = isPdf ? null : new Uint8Array(await file.arrayBuffer());
    onChange({
      name: file.name,
      mime: file.type || (isPdf ? "application/pdf" : "image/png"),
      isPdf,
      url,
      bytes,
      note: media?.note ?? "",
    });
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {media && (
          <div style={{ display: "flex", gap: 6 }}>
            {!media.isPdf && overlayMode && (
              <button className="btn-ghost" onClick={() => setShowOverlay(!showOverlay)}>
                {showOverlay ? "Ẩn lưới đối chiếu" : "Hiện lưới đối chiếu"}
              </button>
            )}
            <button
              className="btn-ghost"
              onClick={() => {
                URL.revokeObjectURL(media.url);
                onChange(null);
              }}
            >
              Xóa file
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*,.pdf,application/pdf"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="muted" style={{ fontSize: "0.78rem", marginTop: -8, marginBottom: 10 }}>
        {acceptHint}
      </div>

      {media && (
        <div>
          {media.isPdf ? (
            <iframe
              src={media.url}
              title={media.name}
              style={{ width: "100%", height: 340, border: "1px solid var(--border)", borderRadius: 8, background: "#fff" }}
            />
          ) : (
            <div style={{ position: "relative", display: "inline-block", width: "100%", textAlign: "center" }}>
              <img
                src={media.url}
                alt={media.name}
                style={{ maxWidth: "100%", maxHeight: 360, borderRadius: 8, border: "1px solid var(--border)" }}
              />
              {showOverlay && overlayMode === "tuong" && (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                >
                  <line x1="50" y1="5" x2="50" y2="95" stroke="#eab308" strokeWidth="0.6" strokeDasharray="2 2" />
                  <line x1="15" y1="33" x2="85" y2="33" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="2 2" />
                  <line x1="15" y1="66" x2="85" y2="66" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="2 2" />
                  <text x="17" y="20" fill="#eab308" fontSize="3.5">Thượng Đình</text>
                  <text x="17" y="50" fill="#eab308" fontSize="3.5">Trung Đình</text>
                  <text x="17" y="82" fill="#eab308" fontSize="3.5">Hạ Đình</text>
                </svg>
              )}
              {showOverlay && overlayMode === "compass" && (
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) rotate(${compassDeg}deg)`,
                    width: "75%",
                    height: "75%",
                    pointerEvents: "none",
                    opacity: 0.78,
                  }}
                >
                  <circle cx="100" cy="100" r="88" fill="none" stroke="#eab308" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="45" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="100" y1="12" x2="100" y2="188" stroke="#eab308" strokeWidth="1" />
                  <line x1="12" y1="100" x2="188" y2="100" stroke="#eab308" strokeWidth="1" />
                  <line x1="38" y1="38" x2="162" y2="162" stroke="#eab308" strokeWidth="0.8" />
                  <line x1="162" y1="38" x2="38" y2="162" stroke="#eab308" strokeWidth="0.8" />
                  <text x="100" y="24" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">BẮC (0°)</text>
                  <text x="100" y="184" textAnchor="middle" fill="#eab308" fontSize="9" fontWeight="bold">NAM (180°)</text>
                  <text x="180" y="103" textAnchor="end" fill="#eab308" fontSize="8">ĐÔNG</text>
                  <text x="20" y="103" textAnchor="start" fill="#eab308" fontSize="8">TÂY</text>
                </svg>
              )}
            </div>
          )}

          <label style={{ marginTop: 10 }}>Ghi chú quan sát / câu hỏi kèm hình ảnh & mặt bằng</label>
          <textarea
            rows={2}
            placeholder="Nhập mô tả thêm (ví dụ: vị trí cửa chính, bếp, đặc điểm khuôn mặt/bàn tay)..."
            value={media.note}
            onChange={(e) => onChange({ ...media, note: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}
