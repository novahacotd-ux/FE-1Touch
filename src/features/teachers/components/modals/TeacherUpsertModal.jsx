
import React, { useState } from 'react';
import { FiCheck } from "react-icons/fi";
import Modal from "./Modal";

export default function TeacherUpsertModal({ subjects, teachers, users, teacherSubjects, editingTeacherId, onClose, onSave }) {
  const isEdit = !!editingTeacherId;
  const t = isEdit ? teachers.find((x) => x.id === editingTeacherId) : null;
  const u = isEdit && t ? users.find((x) => x.id === t.user_id) : null;

  const [teacherCode, setTeacherCode] = useState(t?.teacher_code || "");
  const [fullName, setFullName] = useState(u?.full_name || "");
  const [email, setEmail] = useState(u?.email || "");
  const [phone, setPhone] = useState(u?.phone || "");
  const [username, setUsername] = useState(u?.username || "");
  const [status, setStatus] = useState(u?.status || "ACTIVE");
  const [isActive, setIsActive] = useState(t?.is_active ?? true);

  const preSelected = isEdit
    ? teacherSubjects.filter((x) => x.teacher_id === editingTeacherId).map((x) => x.subject_id)
    : [];
  const [subjectIds, setSubjectIds] = useState(preSelected);

  const toggleSubject = (sid) => {
    setSubjectIds((prev) => (prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]));
  };

  const validate = () => {
    if (!teacherCode.trim()) return "Teacher code không được rỗng.";
    if (!fullName.trim()) return "Họ tên không được rỗng.";
    if (!email.trim()) return "Email không được rỗng.";
    if (!phone.trim()) return "SĐT không được rỗng.";

    if (!isEdit) {
      if (!username.trim()) return "Username không được rỗng.";
      const codeDup = teachers.some((x) => x.teacher_code.toLowerCase() === teacherCode.trim().toLowerCase());
      if (codeDup) return "Teacher code đã tồn tại.";
      const userDup = users.some((x) => x.username.toLowerCase() === username.trim().toLowerCase());
      if (userDup) return "Username đã tồn tại.";
      const emailDup = users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (emailDup) return "Email đã tồn tại.";
    }
    return null;
  };

  const [err, setErr] = useState(null);

  const submit = () => {
    const e = validate();
    if (e) return setErr(e);

    setErr(null);
    if (!isEdit) {
      onSave({
        mode: "create",
        user: { username, full_name: fullName, email, phone, status },
        teacher: { teacher_code: teacherCode, is_active: isActive },
        subjectIds,
      });
    } else {
      onSave({
        mode: "update",
        user: { full_name: fullName, email, phone, status },
        teacher: { id: editingTeacherId, teacher_code: teacherCode, is_active: isActive },
        subjectIds,
      });
    }
  };

  return (
    <Modal onClose={onClose} title={isEdit ? "Sửa giáo viên" : "Thêm giáo viên"}>
      <div className="at-form">
        {err && <div className="at-alert">{err}</div>}

        <div className="at-formGrid">
          <label className="at-field">
            <span>Mã giáo viên (teacher_code)</span>
            <input value={teacherCode} onChange={(e) => setTeacherCode(e.target.value)} placeholder="VD: GV011" />
          </label>

          {!isEdit ? (
            <label className="at-field">
              <span>Username</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="VD: n.nguyen" />
            </label>
          ) : (
            <div className="at-field at-field--readonly">
              <span>Username</span>
              <div className="at-readonly">@{u?.username}</div>
            </div>
          )}

          <label className="at-field">
            <span>Họ tên (users.full_name)</span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="VD: Nguyễn Văn A" />
          </label>

          <label className="at-field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@school.vn" />
          </label>

          <label className="at-field">
            <span>Số điện thoại</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xxxxxxxx" />
          </label>

          <label className="at-field">
            <span>Status (users.status)</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="LOCKED">LOCKED</option>
            </select>
          </label>

          <label className="at-toggle at-toggle--wide">
            <input checked={isActive} onChange={(e) => setIsActive(e.target.checked)} type="checkbox" />
            <span>is_active (teachers)</span>
          </label>
        </div>

        <div className="at-section">
          <div className="at-section__title">Năng lực môn (teacher_subjects)</div>
          <div className="at-checkGrid">
            {subjects.map((s) => (
              <label key={s.id} className="at-check">
                <input type="checkbox" checked={subjectIds.includes(s.id)} onChange={() => toggleSubject(s.id)} />
                <span className="at-check__meta">
                  <span className="at-check__code">{s.code}</span>
                  <span className="at-check__name">{s.name}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="at-modal__actions">
          <button className="at-btn at-btn--ghost" onClick={onClose}>
            Hủy
          </button>
          <button className="at-btn" onClick={submit}>
            <FiCheck /> Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
}
