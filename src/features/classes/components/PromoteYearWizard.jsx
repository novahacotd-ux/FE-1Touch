import React, { useState, useMemo } from "react";
import { FiArrowRight, FiCheck, FiAlertTriangle } from "react-icons/fi";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Select from "../../dashboard/admin/components/ui/Select";
import Checkbox from "../../dashboard/admin/components/ui/Checkbox";
import { pickCurrentYearId, guessPromotedName, uid, nowStr } from "../utils/classHelpers";
import { nextGradeId } from "../data/mockData";

export default function PromoteYearWizard({
  open,
  onClose,
  years,
  grades,
  classes,
  students,
  teachers,
  users,
  yearById,
  gradeById,
  homeroomTeacherIdByClass,
  onApply,
}) {
  const currentYearId = pickCurrentYearId(years);
  const [step, setStep] = useState(1);

  const [sourceYear, setSourceYear] = useState(currentYearId);
  const [targetYear, setTargetYear] = useState(() => years.find((y) => y.id !== currentYearId)?.id || currentYearId);
  const [selectedClassIds, setSelectedClassIds] = useState([]);

  // options
  const [keepStudents, setKeepStudents] = useState(true);
  const [keepRoles, setKeepRoles] = useState(true);
  const [closeOld, setCloseOld] = useState(true);

  // mapping per class
  const [mapping, setMapping] = useState({}); // classId -> { newName, newGradeId, newHomeroomTeacherId }



  const sourceClasses = useMemo(() => {
    return classes
      .filter((c) => c.academic_year_id === sourceYear)
      .slice()
      .sort((a, b) => a.class_name.localeCompare(b.class_name));
  }, [classes, sourceYear]);

  const teacherOptions = useMemo(() => {
    return teachers
      .map((t) => {
        const u = users.find((x) => x.id === t.user_id);
        return { id: t.id, label: `${u?.full_name || "—"} (${t.teacher_code})`, status: u?.status || "—" };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [teachers, users]);

  const ensureMapping = (classId, c) => {
    if (mapping[classId]) return;
    setMapping((prev) => ({
      ...prev,
      [classId]: {
        newName: guessPromotedName(c.class_name),
        newGradeId: nextGradeId(c.grade_id),
        newHomeroomTeacherId: homeroomTeacherIdByClass[c.id] || "",
      },
    }));
  };

  const canNext =
    step === 1
      ? (sourceYear && targetYear && sourceYear !== targetYear && selectedClassIds.length > 0)
      : step === 2
      ? selectedClassIds.every((id) => mapping[id]?.newName?.trim() && mapping[id]?.newGradeId)
      : true;

  const apply = () => {
    // prepare snapshots if closeOld & keepStudents
    const archivedSnapshots = {};
    const updatedStudents = students.map((s) => ({ ...s }));

    const newClasses = [];
    const newAssignments = [];
    const logs = [];

    for (const oldId of selectedClassIds) {
      const oldClass = classes.find((c) => c.id === oldId);
      if (!oldClass) continue;

      const m = mapping[oldId];
      const newId = uid();

      // snapshot members for history viewing
      if (keepStudents) {
        const members = updatedStudents.filter((s) => s.class_id === oldId);
        archivedSnapshots[oldId] = members.map((x) => ({ ...x })); // deep-ish copy
      }

      // create new class
      const nc = {
        id: newId,
        class_name: m.newName.trim(),
        grade_id: m.newGradeId,
        academic_year_id: targetYear,
        status: "OPEN",
      };
      newClasses.push(nc);

      // move students (update class_id) if keepStudents
      if (keepStudents) {
        for (const s of updatedStudents) {
          if (s.class_id === oldId) {
            s.class_id = newId;
            if (!keepRoles) s.student_role_id = "sr_none";
          }
        }
      }

      // close old class (status CLOSED)
      if (closeOld) {
        oldClass.status = "CLOSED";
      }

      // homeroom assignment for new class
      if (m.newHomeroomTeacherId) {
        newAssignments.push({
          id: uid(),
          teacher_id: m.newHomeroomTeacherId,
          class_id: newId,
          subject_id: "sub_unknown",
          role: "HOMEROOM",
        });
      }

      logs.push(
        { id: uid(), user_id: "admin", action: "PROMOTE_CLASS_CREATE_NEW", entity: "classes", entity_id: newId, created_at: nowStr() },
        { id: uid(), user_id: "admin", action: "PROMOTE_CLASS_ARCHIVE_OLD", entity: "classes", entity_id: oldId, created_at: nowStr() }
      );
      if (closeOld) logs.push({ id: uid(), user_id: "admin", action: "CLOSE_CLASS", entity: "classes", entity_id: oldId, created_at: nowStr() });
    }

    // mutate old classes list in-place is not safe in parent state; parent will prepend new classes and keep old array.
    // We'll just return logs + new classes + updated students + snapshots + new assignments
    onApply({ newClasses, updatedStudents, archivedSnapshots, newAssignments, logs });
  };

  return (
    <Modal
      open={open}
      title="Chuyển lớp theo năm học"
      onClose={onClose}
      style={{ maxWidth: "800px" }}
      footer={
        <div className="clm-modalBtns">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Quay lại
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              leftIcon={<FiArrowRight />}
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
            >
              Tiếp tục
            </Button>
          ) : (
            <Button leftIcon={<FiCheck />} onClick={apply}>
              Xác nhận & Thực thi
            </Button>
          )}
        </div>
      }
    >
      <div className="clm-wiz">
        <div className="clm-wizSteps">
          <div className={`clm-step ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>1</div>
          <div className="clm-stepLine" />
          <div className={`clm-step ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>2</div>
          <div className="clm-stepLine" />
          <div className={`clm-step ${step === 3 ? "active" : ""}`}>3</div>
        </div>

        {step === 1 ? (
          <div className="clm-wizPane">
            <div className="clm-wizTitle">Bước 1 — Chọn năm học & lớp cần chuyển</div>

            <div className="clm-formRow">
              <div className="clm-field">
                <div className="clm-field__lb">Năm nguồn</div>
                <Select
                  value={sourceYear}
                  onChange={(val) => setSourceYear(val)}
                  options={years.map((y) => ({
                    value: y.id,
                    label: `${y.name} ${y.is_current ? "• (current)" : ""}`,
                  }))}
                />
              </div>

              <div className="clm-field">
                <div className="clm-field__lb">Năm đích</div>
                <Select
                  value={targetYear}
                  onChange={(val) => setTargetYear(val)}
                  options={years.map((y) => ({
                    value: y.id,
                    label: `${y.name} ${y.is_current ? "• (current)" : ""}`,
                  }))}
                />
                {sourceYear === targetYear ? (
                  <div className="clm-help clm-help--bad">Năm nguồn và năm đích không được trùng.</div>
                ) : null}
              </div>
            </div>

            <div className="clm-wizList">
              {sourceClasses.map((c) => {
                const checked = selectedClassIds.includes(c.id);
                return (
                  <label key={c.id} className={`clm-wizItem ${checked ? "on" : ""}`}>
                    <Checkbox
                      checked={checked}
                      onChange={(e) => {
                        const on = e.target.checked;
                        setSelectedClassIds((prev) => {
                          const next = on ? [...prev, c.id] : prev.filter((x) => x !== c.id);
                          if (on) ensureMapping(c.id, c);
                          return next;
                        });
                      }}
                    />
                    <div className="clm-wizItem__main">
                      <div className="clm-wizItem__name">{c.class_name}</div>
                      <div className="clm-wizItem__meta">
                        <span className="clm-muted">Khối {gradeById[c.grade_id]?.grade_name}</span>
                        <span className="clm-muted">•</span>
                        <span className="clm-muted">{c.status}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="clm-formHint">
              <FiAlertTriangle />
              <div>
                <b>Nghiệp vụ chuẩn bạn mô tả:</b> lớp cũ giữ lại để xem lịch sử, và sẽ đóng sau khi chuyển sang năm học mới.
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="clm-wizPane">
            <div className="clm-wizTitle">Bước 2 — Mapping lớp mới</div>

            <div className="clm-wizOptions">
              <Checkbox
                label="Giữ nguyên thành viên (HS)"
                checked={keepStudents}
                onChange={(e) => setKeepStudents(e.target.checked)}
              />

              <Checkbox
                label="Giữ chức vụ lớp (LT/LP...)"
                checked={keepRoles}
                onChange={(e) => setKeepRoles(e.target.checked)}
                // Checkbox component might not support disabled per inspect, wrapped in a div if needed or passing style
                style={!keepStudents ? { opacity: 0.5, pointerEvents: "none" } : {}}
              />

              <Checkbox
                label="Đóng lớp cũ sau khi chuyển"
                checked={closeOld}
                onChange={(e) => setCloseOld(e.target.checked)}
              />
            </div>

            <div className="clm-map">
              {selectedClassIds.map((id) => {
                const c = classes.find((x) => x.id === id);
                if (!c) return null;
                const m = mapping[id] || {};
                const oldHr = homeroomTeacherIdByClass[id] || "";

                return (
                  <div key={id} className="clm-mapRow">
                    <div className="clm-mapRow__from">
                      <div className="clm-mapRow__cap">Lớp cũ</div>
                      <div className="clm-mapRow__name">{c.class_name}</div>
                      <div className="clm-mapRow__meta">
                        Khối {gradeById[c.grade_id]?.grade_name} • {yearById[c.academic_year_id]?.name}
                      </div>
                    </div>

                    <div className="clm-mapRow__arrow">→</div>

                    <div className="clm-mapRow__to">
                      <div className="clm-mapRow__cap">Lớp mới</div>

                      <div className="clm-mapGrid">
                        <div className="clm-field">
                          <div className="clm-field__lb">Tên lớp mới</div>
                          <input
                            className="clm-input"
                            value={m.newName || ""}
                            onChange={(e) => setMapping((prev) => ({ ...prev, [id]: { ...prev[id], newName: e.target.value } }))}
                          />
                        </div>

                        <div className="clm-field">
                          <div className="clm-field__lb">Khối mới</div>
                          <Select
                            value={m.newGradeId || c.grade_id}
                            onChange={(val) => setMapping((prev) => ({ ...prev, [id]: { ...prev[id], newGradeId: val } }))}
                            options={grades.map((g) => ({ value: g.id, label: `Khối ${g.grade_name}` }))}
                          />
                        </div>

                        <div className="clm-field clm-field--grow">
                          <div className="clm-field__lb">GVCN mới</div>
                          <Select
                            value={m.newHomeroomTeacherId || ""}
                            onChange={(val) =>
                              setMapping((prev) => ({ ...prev, [id]: { ...prev[id], newHomeroomTeacherId: val } }))
                            }
                            placeholder="— Chưa gán —"
                            options={[
                              { value: "", label: "— Chưa gán —" },
                              ...teacherOptions.map((t) => ({ value: t.id, label: `${t.label} • ${t.status}` })),
                            ]}
                          />
                          <div className="clm-help">
                            Gợi ý: giữ nguyên GVCN cũ nếu phù hợp. (Hiện: {oldHr ? teacherOptions.find((x) => x.id === oldHr)?.label : "Chưa có"})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="clm-formHint">
              <FiAlertTriangle />
              <div>
                <b>Lưu ý:</b> Vì ERD chưa có bảng lịch sử lớp-học-sinh, wizard này tạo “snapshot” để vẫn xem lại lớp cũ trong UI.
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="clm-wizPane">
            <div className="clm-wizTitle">Bước 3 — Xem trước & xác nhận</div>

            <div className="clm-review">
              <div className="clm-reviewBox">
                <div className="clm-reviewBox__ttl">Tóm tắt thao tác</div>
                <div className="clm-reviewBox__row">
                  <span>Năm nguồn</span>
                  <b>{yearById[sourceYear]?.name}</b>
                </div>
                <div className="clm-reviewBox__row">
                  <span>Năm đích</span>
                  <b>{yearById[targetYear]?.name}</b>
                </div>
                <div className="clm-reviewBox__row">
                  <span>Số lớp chuyển</span>
                  <b>{selectedClassIds.length}</b>
                </div>
                <div className="clm-reviewBox__row">
                  <span>Giữ HS</span>
                  <b>{keepStudents ? "Có" : "Không"}</b>
                </div>
                <div className="clm-reviewBox__row">
                  <span>Giữ chức vụ</span>
                  <b>{keepRoles ? "Có" : "Không"}</b>
                </div>
                <div className="clm-reviewBox__row">
                  <span>Đóng lớp cũ</span>
                  <b>{closeOld ? "Có" : "Không"}</b>
                </div>
              </div>

              <div className="clm-reviewBox">
                <div className="clm-reviewBox__ttl">Danh sách lớp mới (preview)</div>
                <div className="clm-reviewList">
                  {selectedClassIds.map((id) => {
                    const c = classes.find((x) => x.id === id);
                    const m = mapping[id];
                    if (!c || !m) return null;
                    return (
                      <div key={id} className="clm-reviewItem">
                        <div className="clm-reviewItem__from">
                          {c.class_name} <span className="clm-muted">({yearById[sourceYear]?.name})</span>
                        </div>
                        <div className="clm-reviewItem__to">
                          <FiArrowRight /> <b>{m.newName}</b> • Khối {gradeById[m.newGradeId]?.grade_name} •{" "}
                          <span className="clm-muted">{yearById[targetYear]?.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="clm-formHint" style={{ marginTop: 12 }}>
                  <FiCheck />
                  <div>
                    Sau khi xác nhận, hệ thống tạo lớp mới (OPEN), ghi audit log, và (tuỳ chọn) chuyển HS + đóng lớp cũ.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
