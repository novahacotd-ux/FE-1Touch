
import React from "react";

export default function AuditPanel({ studentId, auditLogs }) {
  const rows = auditLogs.filter((a) => a.entity_id === studentId || (a.entity === "students" && a.entity_id === studentId));
  return (
    <div className="panel">
      <div className="panelSection">
        <div className="panelSectionTitle">Audit liên quan học sinh</div>
        <div className="muted">Dùng để truy vết: ai gán/gỡ vân tay, override điểm danh, sửa phụ huynh…</div>
      </div>

      <div className="list">
        {rows.length ? rows.map((a) => (
          <div key={a.id} className="listRow">
            <div className="listRow__main">
              <div className="strong">{a.action}</div>
              <div className="muted">{a.entity} • <span className="mono">{a.created_at}</span></div>
            </div>
            <div className="listRow__right">
              <span className="pill pill--muted">{a.user_id}</span>
            </div>
          </div>
        )) : <div className="empty">Chưa có audit log liên quan.</div>}
      </div>
    </div>
  );
}
