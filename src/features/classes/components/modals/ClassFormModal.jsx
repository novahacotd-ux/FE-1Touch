import React, { useState, useEffect, useMemo } from "react";
import { FiCheck, FiAlertTriangle } from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Select from "../../../dashboard/admin/components/ui/Select";
import { uid, pickCurrentYearId } from "../../utils/classHelpers";

export default function ClassFormModal({
  open,
  onClose,
  editing,
  years,
  grades,
  teachers,
  users,
  homeroomTeacherIdByClass,
  onSave,
}) {
  const [className, setClassName] = useState("");
  const [yearId, setYearId] = useState(pickCurrentYearId(years));
  const [gradeId, setGradeId] = useState(grades[0]?.id || "g10");
  const [status, setStatus] = useState("OPEN");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setClassName(editing.class_name);
      setYearId(editing.academic_year_id);
      setGradeId(editing.grade_id);
      setStatus(editing.status);
      setHomeroomTeacherId(homeroomTeacherIdByClass[editing.id] || "");
    } else {
      setClassName("");
      setYearId(pickCurrentYearId(years));
      setGradeId(grades[0]?.id || "g10");
      setStatus("OPEN");
      setHomeroomTeacherId("");
    }
  }, [open, editing, years, grades, homeroomTeacherIdByClass]);

  const teacherOptions = useMemo(() => {
    return teachers
      .map((t) => {
        const u = users.find((x) => x.id === t.user_id);
        return {
          value: t.id,
          label: `${u?.full_name || "—"} (${t.teacher_code})`,
          user_status: u?.status || "—",
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [teachers, users]);

  return (
    <Modal
      open={open}
      title={editing ? "Sửa lớp học" : "Thêm lớp học"}
      onClose={onClose}
      footer={
        <div className="clm-modalBtns">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              const classData = {
                id: editing?.id || uid(),
                class_name: className.trim(),
                grade_id: gradeId,
                academic_year_id: yearId,
                status,
              };

              if (!classData.class_name) return;

              onSave({
                mode: editing ? "edit" : "create",
                classData,
                homeroomTeacherId: homeroomTeacherId || null,
              });
            }}
            leftIcon={<FiCheck />}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <div className="clm-form">
        <div className="clm-formRow">
          <div className="clm-field clm-field--grow">
            <div className="clm-field__lb">Tên lớp</div>
            <input className="clm-input" value={className} onChange={(e) => setClassName(e.target.value)} placeholder="VD: 10A1" />
            <div className="clm-help">Không trùng trong cùng năm học.</div>
          </div>
        </div>

        <div className="clm-formRow">
          <div className="clm-field">
            <div className="clm-field__lb">Năm học</div>
            <Select
              value={yearId}
              onChange={setYearId}
              options={years.map((y) => ({
                value: y.id,
                label: `${y.name} ${y.is_current ? "• (current)" : ""}`,
              }))}
            />
          </div>

          <div className="clm-field">
            <div className="clm-field__lb">Khối</div>
            <Select
              value={gradeId}
              onChange={setGradeId}
              options={grades.map((g) => ({ value: g.id, label: `Khối ${g.grade_name}` }))}
            />
          </div>

          <div className="clm-field">
            <div className="clm-field__lb">Trạng thái</div>
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: "OPEN", label: "OPEN" },
                { value: "CLOSED", label: "CLOSED" },
              ]}
            />
          </div>
        </div>

        <div className="clm-formRow">
          <div className="clm-field clm-field--grow">
            <div className="clm-field__lb">Giáo viên chủ nhiệm (GVCN)</div>
            <Select
              value={homeroomTeacherId}
              onChange={setHomeroomTeacherId}
              options={[{ value: "", label: "— Chưa gán —" }, ...teacherOptions]}
              placeholder="Chọn GVCN..."
            />
            <div className="clm-help">
              Khi gán GVCN, hệ thống tạo/ghi đè 1 bản ghi <code>teacher_assignments</code> với role <b>HOMEROOM</b>.
            </div>
          </div>
        </div>

        <div className="clm-formHint">
          <FiAlertTriangle />
          <div>
            <b>Lưu ý nghiệp vụ:</b> lớp đóng (CLOSED) vẫn tồn tại để xem lịch sử, nhưng không nên dùng để xếp TKB năm hiện tại.
          </div>
        </div>
      </div>
    </Modal>
  );
}
