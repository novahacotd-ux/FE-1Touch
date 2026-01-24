
import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { MOCK_STUDENTS, MOCK_CLASSES } from "../../data/mockData";
import Select from "../../../dashboard/admin/components/ui/Select";

export default function ModalStudentForm({ modal, onClose, onAudit, onMutate }) {
  const isAdd = modal.type === "addStudent";
  const studentId = modal.payload?.studentId;
  const current = studentId ? MOCK_STUDENTS.find((s) => s.id === studentId) : null;

  const [student_code, setCode] = useState(current?.student_code || "");
  const [full_name, setName] = useState(current?.full_name || "");
  const [gender, setGender] = useState(current?.gender || "M");
  const [dob, setDob] = useState(current?.dob || "2007-01-01");
  const [status, setStatus] = useState(current?.status || "ACTIVE");
  const [class_id, setClassId] = useState(current?.class_id || MOCK_CLASSES[0]?.id);
  const [fingerprint_id, setFP] = useState((current?.fingerprint_id || "").trim());

  const err =
    !student_code.trim() ? "Thiếu mã học sinh" :
    !full_name.trim() ? "Thiếu họ tên" :
    !class_id ? "Thiếu lớp" :
    null;


  const GENDER_OPTS = [
    { value: "M", label: "Nam (M)" },
    { value: "F", label: "Nữ (F)" },
  ];

  const STATUS_OPTS = [
    { value: "ACTIVE", label: "ACTIVE" },
    { value: "TRANSFERRED", label: "TRANSFERRED" },
    { value: "INACTIVE", label: "INACTIVE" },
  ];

  const CLASS_OPTS = MOCK_CLASSES.map(c => ({ value: c.id, label: c.name }));

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="strong">{isAdd ? "Thêm học sinh" : "Sửa học sinh"}</div>
          <button className="iconBtn" onClick={onClose}><FiX /></button>
        </div>

        <div className="formRow">
          <label>Mã học sinh</label>
          <input className="input" value={student_code} onChange={(e) => setCode(e.target.value)} placeholder="VD: HS0123" />
        </div>

        <div className="formRow">
          <label>Họ và tên</label>
          <input className="input" value={full_name} onChange={(e) => setName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="formRow" style={{ marginTop: 0 }}>
              <label>Giới tính</label>
              <Select 
                value={gender} 
                onChange={setGender} 
                options={GENDER_OPTS} 
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="formRow" style={{ marginTop: 0 }}>
              <label>Ngày sinh</label>
              <input className="input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="formRow" style={{ marginTop: 0 }}>
              <label>Trạng thái</label>
              <Select 
                value={status} 
                onChange={setStatus} 
                options={STATUS_OPTS} 
              />
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="formRow" style={{ marginTop: 0 }}>
              <label>Lớp</label>
              <Select 
                value={class_id} 
                onChange={setClassId} 
                options={CLASS_OPTS} 
              />
            </div>
          </div>
        </div>

        <div className="formRow">
          <label>Fingerprint (tuỳ chọn)</label>
          <input className="input" value={fingerprint_id} onChange={(e) => setFP(e.target.value)} placeholder="Để trống nếu chưa có" />
        </div>

        {err ? <div className="muted" style={{ marginTop: 10, color: "rgba(239,68,68,.95)" }}>{err}</div> : null}

        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>Huỷ</button>
          <button
            className="btn"
            disabled={!!err}
            onClick={() => {
              const id = onMutate.upsertStudent({
                id: isAdd ? null : studentId,
                student_code,
                full_name,
                gender,
                dob,
                status,
                class_id,
                fingerprint_id,
              });

              onAudit(isAdd ? "ADD_STUDENT" : "UPDATE_STUDENT", "students", id);
              onClose();
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
