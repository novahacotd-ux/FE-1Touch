// AdminClasses.jsx
// Refactored: Split into components + hook + styles

import React from "react";
import {
  FiPlus,
  FiEdit2,
  FiLock,
  FiUnlock,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFilter,
  FiDownload,
  FiArrowRight,
  FiX,
  FiCheck,
  FiRefreshCcw,
  FiActivity,
  FiList,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiAlertTriangle
} from "react-icons/fi";

// Global Admin UI
import Card from "../../dashboard/admin/components/ui/Card";
import Select from "../../dashboard/admin/components/ui/Select";
import Checkbox from "../../dashboard/admin/components/ui/Checkbox";
import SearchInput from "../../dashboard/admin/components/ui/SearchInput";
import ConfirmModal from "../../dashboard/admin/components/ui/ConfirmModal";

// Local Feature Modules
import "../styles/AdminClasses.css";
import { useAdminClassesLogic } from "../hooks/useAdminClassesLogic";
import { nowStr, uid, normalize } from "../utils/classHelpers";

// Components
import Chip from "../components/ui/Chip";
import Button from "../components/ui/Button";
import IconButton from "../components/ui/IconButton";
import ToastHost from "../components/ui/ToastHost";
import ClassActionableStats from "../components/stats/ClassActionableStats";
import ClassRoster from "../components/ClassRoster";
import ClassFormModal from "../components/modals/ClassFormModal";
import PromoteYearWizard from "../components/PromoteYearWizard";
import Pagination from "../../dashboard/admin/components/ui/Pagination";

export default function AdminClasses() {
  const {
    // state
    years,
    grades,
    classes,
    students,
    roles,
    users,
    teachers,

    archivedMembers,

    // filter state
    yearId, setYearId,
    gradeId, setGradeId,
    status, setStatus,
    q, setQ,
    onlyNoHomeroom, setOnlyNoHomeroom,
    onlyOverCap, setOnlyOverCap,
    capSize, setCapSize,

    // table state
    expanded, toggleExpand,
    page, setPage, totalPages, pageItems,
    filteredClasses,

    // modal state
    openForm, setOpenForm,
    editingClass,
    openPromote, setOpenPromote,
    confirm, setConfirm,

    // toast state
    toasts, pushToast, removeToast,

    // lookups & helpers
    yearById, gradeById, roleById,
    homeroomTeacherName, homeroomTeacherStatus, homeroomTeacherIdByClass,
    classStudents, classCounts,

    // computed
    overview, actionableStats,

    // actions
    openCreate, openEdit,
    setClassStatus, exportExcel,
    updateStudentRole, moveStudentToClass, removeStudentFromClass,
    
    // setters
    setClasses, setAssignments, setAuditLogs, setStudents, setArchivedMembers
  } = useAdminClassesLogic();

  const selectedYear = yearById[yearId];

  // Action Handler for Actionable Stats
  const handleStatsAction = (type, data) => {
    // In real app, this would open specific modals or routes
    const subject = data?.class?.class_name || data?.label || "item";
    
    // Log intent (mock)
    setAuditLogs((prev) => [
      { id: uid(), user_id: "admin", action: type, entity: "actionable_stats", entity_id: subject, created_at: nowStr() },
      ...prev,
    ]);

    pushToast(`Giả lập thao tác: ${type} trên ${subject}`, "success");
    
    // Special Mock Logic for Demo
    if (type === "ASSIGN_HOMEROOM" && data?.class?.id) {
       // Mock auto-fix to show responsiveness (optional, or just toast)
    }
  };

  return (
    <div className="clm-page">
      <ToastHost toasts={toasts} removeToast={removeToast} />

      {/* Header row */}
      <div className="clm-top">
        <div className="clm-top__left">
          <div className="clm-title">
            <div className="clm-title__main">Quản lý lớp học</div>
            <div className="clm-title__sub">
              Quản trị danh sách lớp theo năm học • đóng/mở lớp • chuyển lớp theo năm học (giữ lịch sử)
            </div>
          </div>

          <div className="clm-badges">
            <Chip tone="info" icon={<FiCalendar />}>
              Năm học: <b style={{ marginLeft: 6 }}>{selectedYear?.name || "—"}</b>
            </Chip>
            <Chip tone="good" icon={<FiUsers />}>
              Tổng HS (ACTIVE): <b style={{ marginLeft: 6 }}>{overview.activeStudents}</b>
            </Chip>
            <Chip tone={overview.missingHomeroom ? "warn" : "good"} icon={<FiUserCheck />}>
              Thiếu GVCN: <b style={{ marginLeft: 6 }}>{overview.missingHomeroom}</b>
            </Chip>
          </div>
        </div>

        <div className="clm-top__right">
          <Button variant="ghost" leftIcon={<FiDownload />} onClick={exportExcel}>
            Export Excel
          </Button>
          <Button variant="secondary" leftIcon={<FiTrendingUp />} onClick={() => setOpenPromote(true)}>
            Chuyển lớp theo năm học
          </Button>
          <Button leftIcon={<FiPlus />} onClick={openCreate}>
            Thêm lớp
          </Button>
        </div>
      </div>

      {/* Actionable Stats Panels (New) */}
      <ClassActionableStats stats={actionableStats} onAction={handleStatsAction} />

      <div className="card">
        <div className="cardBody">
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {/* Search */}
            <div style={{ flex: '1 1 250px' }}>
                <div className="filterLabel" style={{ marginBottom: 4, fontWeight: 600, fontSize: 12, color: 'var(--ts)' }}>Tìm kiếm</div>
                <SearchInput 
                  value={q} 
                  onChange={setQ} 
                  placeholder="VD: 10A1, 11B2..." 
                  className="clm-search" 
                  label={null}
                />
            </div>

            <div className="filter">
               <div className="filterLabel" style={{ marginBottom: 4, fontWeight: 600, fontSize: 12, color: 'var(--ts)' }}>Năm học</div>
               <Select
                  value={yearId}
                  onChange={setYearId}
                  options={years.map((y) => ({ value: y.id, label: y.name + (y.is_current ? " • (current)" : "") }))}
                  placeholder="Năm học"
                  className="clm-sel"
               />
            </div>

            <div className="filter">
               <div className="filterLabel" style={{ marginBottom: 4, fontWeight: 600, fontSize: 12, color: 'var(--ts)' }}>Khối</div>
               <Select
                  value={gradeId}
                  onChange={setGradeId}
                  options={[
                    { value: "ALL", label: "Tất cả khối" },
                    ...grades.map((g) => ({ value: g.id, label: `Khối ${g.grade_name}` })),
                  ]}
                  placeholder="Khối"
                  className="clm-sel"
               />
            </div>

            <div className="filter">
               <div className="filterLabel" style={{ marginBottom: 4, fontWeight: 600, fontSize: 12, color: 'var(--ts)' }}>Trạng thái</div>
               <Select
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "ALL", label: "Tất cả trạng thái" },
                    { value: "OPEN", label: "OPEN" },
                    { value: "CLOSED", label: "CLOSED" },
                  ]}
                  placeholder="Trạng thái"
                  className="clm-sel"
               />
            </div>

            <div className="filter">
               <div className="filterLabel" style={{ marginBottom: 4, fontWeight: 600, fontSize: 12, color: 'var(--ts)' }}>Tùy chọn</div>
               <div style={{ display: 'flex', gap: '16px', alignItems: 'center', height: 40 }}>
                  <Checkbox
                    label="Thiếu GVCN"
                    checked={onlyNoHomeroom}
                    onChange={(e) => setOnlyNoHomeroom(e.target.checked)}
                  />
                  <Checkbox
                    label="Vượt sĩ số"
                    checked={onlyOverCap}
                    onChange={(e) => setOnlyOverCap(e.target.checked)}
                  />
                  
                  <div className={`clm-cap ${onlyOverCap ? "" : "clm-cap--disabled"}`} style={{ display: "flex", alignItems: "center", gap: 8, opacity: onlyOverCap ? 1 : 0.5, transition: "opacity .2s", marginLeft: 8 }}>
                    <span className="clm-cap__lb" style={{ fontSize: 12, fontWeight: 600, color: "var(--ts)", whiteSpace: 'nowrap' }}>Ngưỡng ({capSize})</span>
                    <input
                      className="clm-cap__rng"
                      type="range"
                      min={25}
                      max={55}
                      value={capSize}
                      disabled={!onlyOverCap}
                      onChange={(e) => setCapSize(parseInt(e.target.value, 10))}
                      style={{
                        width: 100,
                        height: 4,
                        borderRadius: 4,
                        background: `linear-gradient(to right, var(--mc) 0%, var(--mc) ${((capSize - 25) / (55 - 25)) * 100}%, var(--border) ${((capSize - 25) / (55 - 25)) * 100}%, var(--border) 100%)`
                      }}
                    />
                  </div>
               </div>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', height: 40, alignSelf: 'flex-end', paddingBottom: 2 }}>
               <Button
                  variant="ghost"
                  leftIcon={<FiRefreshCcw />}
                  onClick={() => {
                    setGradeId("ALL");
                    setStatus("ALL");
                    setQ("");
                    setOnlyNoHomeroom(false);
                    setOnlyOverCap(false);
                    setCapSize(45);
                    pushToast("Đã reset bộ lọc", "info");
                  }}
               >
                  Reset filter
               </Button>
            </div>
          </div>
          
          <div className="clm-filters__foot" style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 12, borderTop: "1px dashed var(--border)" }}>
            <span className="clm-muted">
              Hiển thị <b>{filteredClasses.length}</b> lớp (trong năm học {selectedYear?.name || "—"})
            </span>
            {overview.missingHomeroom > 0 ? (
              <span className="clm-warnLine" style={{ color: "var(--warn)", display: "flex", alignItems: "center", gap: 6 }}>
                <FiAlertTriangle /> Có <b>{overview.missingHomeroom}</b> lớp chưa gán GVCN — nên xử lý trước khi xếp TKB/điểm danh.
              </span>
            ) : (
              <span className="clm-okLine" style={{ color: "var(--good)", display: "flex", alignItems: "center", gap: 6 }}>
                <FiCheck /> Tất cả lớp đã có GVCN.
              </span>
            )}
          </div>
        </div>
      </div>

      <Card
        title="Danh sách lớp"
        subtitle="Có expand để xem nhanh danh sách HS + chức vụ (không đi sâu module HS/phụ huynh)"
        icon={<FiList />}
        right={
          <div className="clm-card__actions" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Pagination removed */}
          </div>
        }
      >
        <div className="clm-tableWrap">
          <div className="clm-tbl">
            <div className="clm-tr clm-tr--head clm-grid-table">
              <div className="clm-th">Lớp</div>
              <div className="clm-th">Khối</div>
              <div className="clm-th">Trạng thái</div>
              <div className="clm-th">GVCN</div>
              <div className="clm-th">Sĩ số (A/T)</div>
              <div className="clm-th">Chức vụ</div>
              <div className="clm-th clm-th--right">Thao tác</div>
            </div>

            {pageItems.map((c) => {
              const cc = classCounts(c.id);
              const hrName = homeroomTeacherName(c.id);
              const hrStatus = homeroomTeacherStatus(c.id);

              const leader = classStudents(c.id).find((s) => s.student_role_id === "sr_leader");
              const vice = classStudents(c.id).find((s) => s.student_role_id === "sr_vice");

              const isExpanded = expanded.has(c.id);
              const over = cc.active > capSize;

              return (
                <React.Fragment key={c.id}>
                  <div className={`clm-tr clm-grid-table ${isExpanded ? "clm-tr--open" : ""}`}>
                    <div className="clm-td" style={{ display: "flex", gap: 10 }}>
                      <button className="clm-exp" onClick={() => toggleExpand(c.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ts)", padding: 0, display: "flex", alignItems: "center" }}>
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      <div className="clm-classCell">
                        <div className="clm-classCell__name" style={{ fontWeight: 700, fontSize: 15 }}>{c.class_name}</div>
                        <div className="clm-classCell__meta" style={{ fontSize: 12, color: "var(--ts)", display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                          <span className="clm-muted">{yearById[c.academic_year_id]?.name}</span>
                          {over ? (
                            <span className="clm-badgeWarn" style={{ color: "var(--warn)", display: "flex", alignItems: "center", gap: 3, fontWeight: 600 }}>
                              <FiAlertTriangle size={12} /> Vượt ngưỡng
                            </span>
                          ) : null}
                          {archivedMembers[c.id] ? <span className="clm-badgeHist" style={{ fontSize: 10, background: "rgba(99,102,241,.1)", color: "var(--info)", padding: "1px 4px", borderRadius: 4 }}>Có lịch sử</span> : null}
                        </div>
                      </div>
                    </div>

                    <div className="clm-td">
                      <b>Khối {gradeById[c.grade_id]?.grade_name || "?"}</b>
                    </div>

                    <div className="clm-td">
                      {c.status === "OPEN" ? (
                        <Chip tone="good">OPEN</Chip>
                      ) : (
                        <Chip tone="warn">CLOSED</Chip>
                      )}
                    </div>

                    <div className="clm-td">
                      {hrName ? (
                        <div className="clm-hr">
                          <div className="clm-hr__name" style={{ fontWeight: 600, fontSize: 13 }}>{hrName}</div>
                          <div className="clm-hr__meta">
                            <span className={`clm-pill ${hrStatus === "LOCKED" ? "clm-pill--bad" : "clm-pill--good"}`} style={{ fontSize: 11, color: hrStatus === "LOCKED" ? "var(--bad)" : "var(--good)" }}>
                              {hrStatus || "—"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="clm-noHr" style={{ color: "var(--warn)", display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                          <FiAlertTriangle />
                          <span>Chưa gán</span>
                        </div>
                      )}
                    </div>

                    <div className="clm-td">
                      <div className="clm-counts">
                        <div className="clm-counts__main">
                          <b>{cc.active}</b>/<span className="clm-muted">{cc.total}</span>
                        </div>
                        <div className="clm-counts__sub" style={{ fontSize: 11, color: "var(--ts)" }}>
                          <span className="clm-muted">T:{cc.transferred} I:{cc.inactive}</span>
                        </div>
                      </div>
                    </div>

                    <div className="clm-td">
                      <div className="clm-rolesMini">
                        <div className="clm-rolesMini__row">
                          <span className="clm-muted">LT:</span>
                          <span>{leader ? leader.full_name : "—"}</span>
                        </div>
                        <div className="clm-rolesMini__row">
                          <span className="clm-muted">LP:</span>
                          <span>{vice ? vice.full_name : "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="clm-td clm-td--right">
                      <div className="clm-actions">
                        <IconButton title="Sửa lớp" onClick={() => openEdit(c)}>
                          <FiEdit2 />
                        </IconButton>

                        {c.status === "OPEN" ? (
                          <IconButton
                            title="Đóng lớp"
                            onClick={() =>
                              setConfirm({
                                title: "Đóng lớp học",
                                description: `Bạn có chắc chắn muốn đóng lớp ${c.class_name}?`,
                                confirmLabel: "Đóng lớp",
                                onConfirm: () => {
                                  setClassStatus(c.id, "CLOSED");
                                  setConfirm(null);
                                },
                              })
                            }
                          >
                            <FiLock />
                          </IconButton>
                        ) : (
                          <IconButton
                            title="Mở lớp"
                            onClick={() =>
                              setConfirm({
                                title: "Mở lớp học",
                                description: `Bạn có chắc chắn muốn mở lại lớp ${c.class_name}?`,
                                confirmLabel: "Mở lớp",
                                onConfirm: () => {
                                  setClassStatus(c.id, "OPEN");
                                  setConfirm(null);
                                },
                              })
                            }
                          >
                            <FiUnlock />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="clm-expandBox">
                      <ClassRoster
                        classId={c.id}
                        className={c.class_name}
                        students={classStudents(c.id)}
                        roleById={roleById}
                        roles={roles}
                        onUpdateRole={updateStudentRole}
                        onAddStudent={moveStudentToClass}
                        onRemoveStudent={removeStudentFromClass}
                        allStudents={students}
                        allClasses={classes}
                        note={
                          archivedMembers[c.id]
                            ? "Đây là snapshot thành viên (lớp đã chuyển năm/đóng nhưng vẫn xem lại được)."
                            : "Danh sách HS rút gọn để quản trị lớp (không đi sâu module HS/phụ huynh)."
                        }
                      />
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}

            {pageItems.length === 0 ? (
              <div className="clm-empty">
                <div className="clm-empty__ttl">Không có lớp phù hợp</div>
                <div className="clm-empty__sub">Thử đổi bộ lọc hoặc tìm kiếm lại.</div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="clm-tableFoot" style={{ marginTop: 16 }}>
           <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      {/* Modals */}
      <ConfirmModal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel}
      />

      <ClassFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        editing={editingClass}
        years={years}
        grades={grades}
        teachers={teachers}
        users={users}
        homeroomTeacherIdByClass={homeroomTeacherIdByClass}
        onSave={(payload) => {
          const { mode, classData, homeroomTeacherId } = payload;

          if (mode === "create") {
            // validate unique (same year)
            const dup = classes.some(
              (c) =>
                c.academic_year_id === classData.academic_year_id &&
                normalize(c.class_name) === normalize(classData.class_name)
            );
            if (dup) {
              pushToast("Tên lớp bị trùng trong cùng năm học", "error");
              return;
            }

            setClasses((prev) => [classData, ...prev]);
            if (homeroomTeacherId) {
              setAssignments((prev) => [
                { id: uid(), teacher_id: homeroomTeacherId, class_id: classData.id, subject_id: "sub_unknown", role: "HOMEROOM" },
                ...prev.filter((a) => !(a.class_id === classData.id && a.role === "HOMEROOM")),
              ]);
            }
            setAuditLogs((prev) => [
              { id: uid(), user_id: "admin", action: "CREATE_CLASS", entity: "classes", entity_id: classData.id, created_at: nowStr() },
              ...prev,
            ]);
            pushToast("Đã thêm lớp", "success");
          } else {
            setClasses((prev) => prev.map((c) => (c.id === classData.id ? classData : c)));
            setAssignments((prev) => {
              const withoutOld = prev.filter((a) => !(a.class_id === classData.id && a.role === "HOMEROOM"));
              if (!homeroomTeacherId) return withoutOld;
              return [
                { id: uid(), teacher_id: homeroomTeacherId, class_id: classData.id, subject_id: "sub_unknown", role: "HOMEROOM" },
                ...withoutOld,
              ];
            });
            setAuditLogs((prev) => [
              { id: uid(), user_id: "admin", action: "UPDATE_CLASS", entity: "classes", entity_id: classData.id, created_at: nowStr() },
              ...prev,
            ]);
            pushToast("Đã cập nhật lớp", "success");
          }

          setOpenForm(false);
        }}
      />

      {openPromote && (
        <PromoteYearWizard
          open={true}
          onClose={() => setOpenPromote(false)}
          years={years}
          grades={grades}
          classes={classes}
          students={students}
          teachers={teachers}
          users={users}
          yearById={yearById}
          gradeById={gradeById}
          homeroomTeacherIdByClass={homeroomTeacherIdByClass}
          onApply={(result) => {
            const { newClasses, updatedStudents, archivedSnapshots, newAssignments, logs } = result;

            setArchivedMembers((prev) => ({ ...prev, ...archivedSnapshots }));
            setClasses((prev) => [...newClasses, ...prev]);
            setStudents(updatedStudents);
            setAssignments((prev) => [...newAssignments, ...prev]);
            setAuditLogs((prev) => [...logs, ...prev]);

            pushToast("Chuyển lớp theo năm học (mock) thành công", "success");
            setOpenPromote(false);
          }}
        />
      )}
    </div>
  );
}
