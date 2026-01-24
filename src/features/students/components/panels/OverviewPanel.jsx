
import React from "react";
import { FiTrash2, FiLink2 } from "react-icons/fi";
import InfoBox from "../ui/InfoBox";

export default function OverviewPanel({ student, className, fpState, tags, onBind, onUnbind }) {
  const fp = (student.fingerprint_id || "").trim();
  return (
    <div className="panel">
      <div className="panelGrid">
        <InfoBox label="Mã học sinh" value={student.student_code} />
        <InfoBox label="Trạng thái" value={student.status} />
        <InfoBox label="Lớp" value={className} />
        <InfoBox label="Ngày sinh" value={student.dob} />
      </div>

      <div className="panelSection">
        <div className="panelSectionTitle">Vân tay</div>
        <div className="row">
          <span className={`pill pill--${fpState.toLowerCase()}`}>{fpState}</span>
          <span className="mono muted">{fp || "—"}</span>
          <div className="spacer" />
          {fpState === "ASSIGNED" ? (
            <button className="btn btn-ghost" onClick={onUnbind}>
              <FiTrash2 /> Gỡ vân tay
            </button>
          ) : (
            <button className="btn" onClick={onBind}>
              <FiLink2 /> Gán vân tay
            </button>
          )}
        </div>
      </div>

      <div className="panelSection">
        <div className="panelSectionTitle">Rủi ro vận hành</div>
        <div className="tagRow">
          {tags.length ? tags.map((t) => (
            <span key={t.key} className={`tag tag--${t.tone}`}>{t.label}</span>
          )) : <span className="muted">Không có issue nổi bật.</span>}
        </div>
      </div>

      <div className="panelSection">
        <div className="hint">
          Tab này **không** thao tác chuyển lớp/chức vụ lớp. Chỉ xử lý: vân tay, log IN/OUT, record điểm danh, phụ huynh và thông báo.
        </div>
      </div>
    </div>
  );
}
