
import React, { useMemo } from "react";
import { FiEdit2 } from "react-icons/fi";
import DonutActionable from "../ui/DonutActionable";

export default function AttendancePanel({ rangeDays, sessions, records, onOverride }) {
  // show sessions list with record status (if any)
  const recordMap = useMemo(() => {
    const m = new Map();
    records.forEach((r) => m.set(r.attendance_session_id, r));
    return m;
  }, [records]);

  const inRangeSessions = sessions.filter((s) => {
    const d = new Date(`${s.session_date}T00:00:00`);
    const now = new Date("2026-01-17T12:00:00");
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= rangeDays;
  });

  const dist = { PRESENT: 0, LATE: 0, ABSENT_EXCUSED: 0, ABSENT_UNEXCUSED: 0 };
  inRangeSessions.forEach((s) => {
    const r = recordMap.get(s.id);
    if (r) dist[r.status] = (dist[r.status] || 0) + 1;
  });

  const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
  const donutItems = [
    { label: "PRESENT", value: dist.PRESENT, color: "var(--mc)" },
    { label: "LATE", value: dist.LATE, color: "rgba(245,158,11,.95)" },
    { label: "ABSENT_EXCUSED", value: dist.ABSENT_EXCUSED, color: "rgba(99,102,241,.65)" },
    { label: "ABSENT_UNEXCUSED", value: dist.ABSENT_UNEXCUSED, color: "rgba(239,68,68,.9)" },
  ].filter((x) => x.value > 0);

  return (
    <div className="panel">
      <div className="panelSection">
        <div className="panelSectionTitle">Tổng quan record ({rangeDays} ngày)</div>
        <div className="split">
          <DonutActionable items={donutItems.length ? donutItems : [{ label: "No data", value: 1, color: "var(--border)" }]} centerTop={total} centerBottom="Records" />
          <div className="hint">
            Record là kết quả cuối cùng theo từng phiên (tiết). Admin dùng để kiểm tra “đi trễ/vắng” bất thường và override khi thiết bị lỗi.
          </div>
        </div>
      </div>

      <div className="panelSection">
        <div className="panelSectionTitle">Danh sách phiên điểm danh</div>
        <div className="list">
          {inRangeSessions.map((s) => {
            const r = recordMap.get(s.id);
            const status = r?.status || "—";
            const tone =
              status === "PRESENT" ? "ok" :
              status === "LATE" ? "warn" :
              status === "ABSENT_UNEXCUSED" ? "danger" :
              status === "ABSENT_EXCUSED" ? "info" : "muted";
            return (
              <div key={s.id} className="listRow listRow--hover">
                <div className="listRow__main">
                  <div className="strong">{s.session_date}</div>
                  <div className="muted mono">{s.start_time} - {s.end_time}</div>
                </div>
                <div className="listRow__right">
                  <span className={`pill pill--${tone}`}>{status}</span>
                  {r ? (
                    <button className="btn btn-sm btn-ghost" onClick={() => onOverride(r.id)}>
                      <FiEdit2 /> Override
                    </button>
                  ) : (
                    <span className="muted">Chưa có record</span>
                  )}
                </div>
              </div>
            );
          })}
          {!inRangeSessions.length ? <div className="empty">Không có session trong khoảng thời gian này.</div> : null}
        </div>
      </div>
    </div>
  );
}
