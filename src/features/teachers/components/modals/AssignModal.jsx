
import React, { useState } from 'react';
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";

export default function AssignModal({ teacherId, teacherRows, subjects, classes, teacherAssignments, onClose, onAdd, onRemove }) {
  const row = teacherRows.find((r) => r.teacher_id === teacherId);

  const [classId, setClassId] = useState(classes[0]?.id || "");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [role, setRole] = useState("SUBJECT");

  const assigns = teacherAssignments.filter((a) => a.teacher_id === teacherId);

  return (
    <Modal onClose={onClose} title={`Phân công giảng dạy • ${row?.full_name || ""}`}>
      <div className="at-assignModal">
        <div className="at-assignForm">
          <label className="at-field">
            <span>Lớp</span>
            <select value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="at-field">
            <span>Môn</span>
            <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="at-field">
            <span>Vai trò</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="SUBJECT">SUBJECT (GV bộ môn)</option>
              <option value="HOMEROOM">HOMEROOM (GVCN)</option>
            </select>
          </label>

          <button
            className="at-btn"
            onClick={() => onAdd({ teacher_id: teacherId, class_id: classId, subject_id: subjectId, role })}
          >
            <FiPlus /> Thêm phân công
          </button>
        </div>

        <div className="at-section">
          <div className="at-section__title">Danh sách phân công hiện tại</div>
          <div className="at-assignList">
            <div className="at-assignList__head">
              <span>Lớp</span><span>Môn</span><span>Vai trò</span><span />
            </div>

            {assigns.length ? (
              assigns.map((a) => {
                const c = classes.find((x) => x.id === a.class_id);
                const s = subjects.find((x) => x.id === a.subject_id);
                return (
                  <div key={a.id} className="at-assignList__row">
                    <span className="at-chip at-chip--green">{c?.name || a.class_id}</span>
                    <span className="at-chip">{s?.code || a.subject_id}</span>
                    <span className={`at-chip ${a.role === "HOMEROOM" ? "at-chip--solid" : "at-chip--ghost"}`}>{a.role}</span>
                    <button className="at-iconBtn at-iconBtn--danger" title="Gỡ" onClick={() => onRemove(a.id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="at-muted" style={{ padding: "10px 0" }}>
                Chưa có phân công.
              </div>
            )}
          </div>
        </div>

        <div className="at-modal__actions">
          <button className="at-btn at-btn--ghost" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
