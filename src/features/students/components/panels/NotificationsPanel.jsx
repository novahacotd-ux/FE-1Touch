
import React from "react";
import { FiBell, FiRefreshCw } from "react-icons/fi";

export default function NotificationsPanel({ notifications, parents, onResend }) {
  const parentName = (pid) => parents.find((p) => p.id === pid)?.full_name || "—";
  return (
    <div className="panel">
      <div className="panelSection">
        <div className="panelSectionTitle">Lịch sử cảnh báo</div>
        <div className="muted">SENT/FAILED giúp admin phát hiện lỗi tích hợp Zalo hoặc thiếu thông tin liên lạc.</div>
      </div>

      <div className="list">
        {notifications.length ? notifications.map((n) => (
          <div key={n.id} className="listRow listRow--hover">
            <div className="listRow__main">
              <div className="strong">{n.message}</div>
              <div className="muted">
                To: {parentName(n.parent_id)} • <span className="mono">{n.sent_at}</span>
              </div>
            </div>
            <div className="listRow__right">
              <span className={`pill pill--${n.status === "SENT" ? "ok" : "warn"}`}>
                <FiBell /> {n.status}
              </span>
              {n.status === "FAILED" ? (
                <button className="btn btn-sm" onClick={() => onResend(n.id)}>
                  <FiRefreshCw /> Resend
                </button>
              ) : null}
            </div>
          </div>
        )) : <div className="empty">Chưa có notification.</div>}
      </div>
    </div>
  );
}
