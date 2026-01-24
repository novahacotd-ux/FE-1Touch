
import React from "react";
import { FiTrash2, FiLink2, FiAlertTriangle } from "react-icons/fi";

export default function FingerprintPanel({ student, fpState, fingerprintIndex, logs, onBind, onUnbind }) {
  const fp = (student.fingerprint_id || "").trim();
  const owners = fp ? (fingerprintIndex.get(fp) || []) : [];
  return (
    <div className="panel">
      <div className="panelSection">
        <div className="panelSectionTitle">Trạng thái mapping vân tay</div>
        <div className="row">
          <span className={`pill pill--${fpState.toLowerCase()}`}>{fpState}</span>
          <span className="mono muted">{fp || "—"}</span>
          <div className="spacer" />
          {fpState === "ASSIGNED" ? (
            <button className="btn btn-ghost" onClick={onUnbind}><FiTrash2 /> Gỡ</button>
          ) : (
            <button className="btn" onClick={onBind}><FiLink2 /> Gán</button>
          )}
        </div>

        {fpState === "DUPLICATE" ? (
          <div className="warnBox">
            <FiAlertTriangle />
            <div>
              <div className="strong">Phát hiện trùng fingerprint_id</div>
              <div className="muted">
                Mã <span className="mono">{fp}</span> đang được gán cho {owners.length} học sinh. Cần xử lý để tránh sai điểm danh.
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="panelSection">
        <div className="panelSectionTitle">Log vân tay thô (IN/OUT)</div>
        <div className="muted">Máy chỉ ghi log vào/ra cổng. Hệ thống dùng log IN để suy ra trạng thái theo tiết học.</div>
        <div className="list">
          {logs.length ? logs.map((l) => (
            <div key={l.id} className="listRow">
              <span className={`pill pill--${l.log_type === "IN" ? "ok" : "muted"}`}>
                {l.log_type}
              </span>
              <span className="mono">{l.log_time}</span>
            </div>
          )) : <div className="empty">Chưa có log.</div>}
        </div>
      </div>
    </div>
  );
}
