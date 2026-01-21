
import React from "react";
import { FiUserPlus, FiEdit2, FiTrash2, FiShield, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

export default function ParentsPanel({ parents, onAdd, onEdit, onDelete, getUserById }) {
  return (
    <div className="panel">
      <div className="panelSection row">
        <div>
          <div className="panelSectionTitle">Phụ huynh liên quan</div>
          <div className="muted">Dùng để gửi cảnh báo vắng/trễ qua Zalo (history ở tab Thông báo).</div>
        </div>
        <div className="spacer" />
        <button className="btn" onClick={onAdd}><FiUserPlus /> Thêm phụ huynh</button>
      </div>

      <div className="list">
        {parents.length ? parents.map((p) => (
          <div key={p.id} className="listRow listRow--hover">
            <div className="listRow__main">
              <div className="strong">
                {p.full_name} {p.is_primary ? <span className="pill pill--ok">PRIMARY</span> : null}
              </div>
              <div className="muted">
                <span className="mono">{p.phone || "— phone"}</span> • <span className="mono">{p.zalo_id || "— zalo"}</span>
              </div>
            </div>
            <div className="listRow__right">
              {/* Account status */}
              {p.user_id ? (
                <span className={`pill pill--${(getUserById(p.user_id)?.status === "LOCKED") ? "danger" : "ok"}`}>
                  <FiShield /> {getUserById(p.user_id)?.status || "—"}
                </span>
              ) : (
                <span className="pill pill--warn">
                  <FiAlertTriangle /> NO ACCOUNT
                </span>
              )}

              <button className="btn btn-sm btn-ghost" onClick={() => onEdit(p.id)}>
                <FiEdit2 /> Sửa
              </button>
              <button className="btn btn-sm btn-ghost danger" onClick={() => onDelete(p.id)}>
                <FiTrash2 /> Xoá
              </button>
            </div>
          </div>
        )) : <div className="empty">Chưa có phụ huynh cho học sinh này.</div>}
      </div>

      <div className="hint">
        Tab này **không** quản lý “ở lớp nào/chức vụ gì” — phần đó nằm ở tab Quản lý lớp. Đây chỉ là kênh liên lạc + theo dõi thông báo.
      </div>
    </div>
  );
}
