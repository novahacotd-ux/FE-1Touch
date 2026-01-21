
import React, { useState, useMemo } from "react";
import { FiX, FiLink2, FiAlertTriangle } from "react-icons/fi";
import { MOCK_STUDENTS } from "../../data/mockData";
import Checkbox from "../../../dashboard/admin/components/ui/Checkbox";

export default function ModalBindFingerprint({ modal, onClose, onAudit, onMutate }) {
  const studentId = modal.payload?.studentId;
  const student = MOCK_STUDENTS.find((s) => s.id === studentId);
  const [fp, setFp] = useState((student?.fingerprint_id || "").trim());
  const [forceDup, setForceDup] = useState(false);

  const owners = useMemo(() => {
    const v = fp.trim();
    if (!v) return [];
    return MOCK_STUDENTS.filter((s) => s.id !== studentId && (s.fingerprint_id || "").trim() === v);
  }, [fp, studentId]);

  const isDup = owners.length > 0;

  const canSave = fp.trim() && (!isDup || forceDup);

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="strong">Gán vân tay</div>
          <button className="iconBtn" onClick={onClose}><FiX /></button>
        </div>

        <div className="muted">
          Nhập <span className="mono">fingerprint_id</span>. Có kiểm tra trùng. Nếu trùng, bạn phải xác nhận “Force”.
        </div>

        <div className="formRow">
          <label>fingerprint_id</label>
          <input
            className="input"
            value={fp}
            onChange={(e) => {
              setFp(e.target.value);
              setForceDup(false);
            }}
            placeholder="VD: FP_10444"
          />
        </div>

        {isDup ? (
          <div className="warnBox" style={{ marginTop: 12 }}>
            <FiAlertTriangle />
            <div>
              <div className="strong">Fingerprint đang bị trùng</div>
              <div className="muted">
                Mã <span className="mono">{fp.trim()}</span> đã gán cho:{" "}
                {owners.map((o) => `${o.full_name} (${o.student_code})`).join(", ")}.
              </div>

              <div style={{ marginTop: 10 }}>
                <Checkbox
                  checked={forceDup}
                  onChange={(e) => setForceDup(e.target.checked)}
                  label="Tôi hiểu rủi ro và vẫn muốn gán (tạo issue DUPLICATE)"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>Huỷ</button>
          <button
            className="btn"
            disabled={!canSave}
            onClick={() => {
              onMutate.setStudentFingerprint(studentId, fp.trim());
              onAudit("BIND_FINGERPRINT", "students", studentId);
              onClose();
            }}
          >
            <FiLink2 /> Gán
          </button>
        </div>
      </div>
    </div>
  );
}
