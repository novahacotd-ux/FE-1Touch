
import React from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiKey,
  FiEye,
  FiUserCheck,
  FiUsers,
  FiBookOpen,
  FiClipboard,
  FiDownload,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";

// CSS
import "../../dashboard/admin/styles/SharedAdmin.css";
import "../styles/AdminTeacherTab.css";

// Utils
import { initials } from "../utils/teacherHelpers";

// Hook
import useAdminTeacherLogic from "../hooks/useAdminTeacherLogic";

// Components
import WorkloadDonutChart from "../components/charts/WorkloadDonutChart";
import BarChart from "../components/charts/BarChart";
import StatusBadge from "../components/ui/StatusBadge";
import Metric from "../components/metrics/Metric";
import SearchInput from "../../dashboard/admin/components/ui/SearchInput";
import Select from "../../dashboard/admin/components/ui/Select";
import Checkbox from "../../dashboard/admin/components/ui/Checkbox";
import ConfirmModal from "../../dashboard/admin/components/ui/ConfirmModal";

// Modals & Drawers
import Modal from "../components/modals/Modal";
import Drawer from "../components/drawers/Drawer";
import TeacherDrawerContent from "../components/drawers/TeacherDrawerContent";
import TeacherUpsertModal from "../components/modals/TeacherUpsertModal";
import AssignModal from "../components/modals/AssignModal";
import TeacherFilterBar from "../components/ui/TeacherFilterBar";
import Pagination from "../../dashboard/admin/components/ui/Pagination";

export default function AdminTeacherTab() {
  const {
    // Data
    subjects,
    classes,
    teachers,
    users,
    teacherSubjects,
    teacherAssignments,
    auditLogs,
    filteredRows,
    pagedRows,
    insights,
    teacherRows, // for drawer lookup

    // Filter State
    q, setQ,
    statusFilter, setStatusFilter,
    subjectFilter, setSubjectFilter,
    classFilter, setClassFilter,
    onlyHomeroom, setOnlyHomeroom,
    onlyAssigned, setOnlyAssigned,
    sortKey, setSortKey,
    page, setPage, totalPages,
    selectedIds, toggleSelect, toggleSelectAll,

    // UI State
    toast,
    confirm, setConfirm,
    drawerTeacherId, setDrawerTeacherId,
    showUpsert, setShowUpsert, editingTeacherId,
    showAssign, setShowAssign, assignTeacherId,

    // Actions
    openCreate,
    openEdit,
    openAssignModal,
    handleSaveTeacher,
    handleAddAssignment,
    handleRemoveAssignment,
    lockUnlockUser,
    resetPassword,
    deleteTeacher,
    bulkLock,
    exportCsv,
  } = useAdminTeacherLogic();

  // Helper for drawer
  const drawerRow = teacherRows.find((r) => r.teacher_id === drawerTeacherId) || null;

  return (
    <div className="at-page">
      {/* Toast */}
      {toast && (
        <div className={`at-toast at-toast--${toast.type}`}>
          <div className="at-toast__title">{toast.title}</div>
          <div className="at-toast__msg">{toast.message}</div>
        </div>
      )}

      {/* Confirm */}
      <ConfirmModal
        isOpen={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.onConfirm}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel}
      />

      {/* Upsert Teacher */}
      {showUpsert && (
        <TeacherUpsertModal
          subjects={subjects}
          teachers={teachers}
          users={users}
          teacherSubjects={teacherSubjects}
          editingTeacherId={editingTeacherId}
          onClose={() => setShowUpsert(false)}
          onSave={handleSaveTeacher}
        />
      )}

      {/* Assign modal */}
      {showAssign && (
        <AssignModal
          teacherId={assignTeacherId}
          teacherRows={teacherRows}
          subjects={subjects}
          classes={classes}
          teacherAssignments={teacherAssignments}
          onClose={() => setShowAssign(false)}
          onAdd={handleAddAssignment}
          onRemove={handleRemoveAssignment}
        />
      )}

      {/* Drawer */}
      {drawerRow && (
        <Drawer onClose={() => setDrawerTeacherId(null)} title={`Giáo viên • ${drawerRow.full_name}`}>
          <TeacherDrawerContent
            row={drawerRow}
            subjects={subjects}
            classes={classes}
            teacherAssignments={teacherAssignments}
            auditLogs={auditLogs}
            onEdit={() => openEdit(drawerRow.teacher_id)}
            onAssign={() => openAssignModal(drawerRow.teacher_id)}
            onLockToggle={() => lockUnlockUser(drawerRow.teacher_id, drawerRow.status === "ACTIVE" ? "LOCKED" : "ACTIVE")}
            onResetPw={() => resetPassword(drawerRow.teacher_id)}
          />
        </Drawer>
      )}

      {/* Header row */}
      <div className="at-header">
        <div className="at-header__left">
          <div className="at-title">
            <FiUsers />
            <div>
              <div className="at-title__main">Quản lý giáo viên</div>
              <div className="at-title__sub">Tạo/sửa/khóa tài khoản, năng lực môn học, và phân công giảng dạy.</div>
            </div>
          </div>
        </div>
        <div className="at-header__right">
          <button className="at-btn at-btn--ghost" onClick={exportCsv}>
            <FiDownload /> Export
          </button>
          <button className="at-btn" onClick={openCreate}>
            <FiPlus /> Thêm giáo viên
          </button>
        </div>
      </div>

      {/* Insights panel */}
      <div className="at-insights">
        <div className="card at-card--span2">
          <div className="cardHead">
             <div className="cardHeadLeft">
               <div className="cardIcon"><FiBarChart2 /></div>
               <div className="cardTitles">
                 <div className="cardTitle">Teacher Insights</div>
                 <div className="cardSub">Tổng hợp trạng thái + workload (ước lượng) để admin ra quyết định nhanh.</div>
               </div>
             </div>
          </div>
          <div className="cardBody">

          <div className="at-metrics">
            <Metric label="Tổng giáo viên" value={insights.total} icon={<FiUsers />} variant="default" />
            <Metric label="Đang hoạt động" value={insights.active} icon={<FiUserCheck />} variant="blue" />
            <Metric label="Bị khóa" value={insights.locked} icon={<FiLock />} variant="red" />
            <Metric label="Có phân công" value={insights.assigned} icon={<FiClipboard />} variant="orange" />
            <Metric label="Giáo viên chủ nhiệm" value={insights.homeroom} icon={<FiUsers />} variant="purple" />
            <Metric label="Workload TB (tiết/tuần)" value={insights.avgWorkload} icon={<FiBookOpen />} variant="teal" />
          </div>

          <div className="at-charts">
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div className="cardHead">
                <div className="cardHeadLeft">
                  <div className="cardIcon"><FiPieChart /></div>
                  <div className="cardTitles">
                    <div className="cardTitle">Khối lượng giảng dạy tuần này</div>
                    <div className="cardSub">Phân bố số tiết dạy thực tế (Mon–Sun). Biểu đồ hiển thị tỷ lệ giáo viên theo nhóm workload.</div>
                  </div>
                </div>
              </div>
              <div className="cardBody">
                <WorkloadDonutChart stats={insights.workloadStats} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <TeacherFilterBar
        q={q} setQ={setQ}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter}
        classFilter={classFilter} setClassFilter={setClassFilter}
        sortKey={sortKey} setSortKey={setSortKey}
        onlyHomeroom={onlyHomeroom} setOnlyHomeroom={setOnlyHomeroom}
        onlyAssigned={onlyAssigned} setOnlyAssigned={setOnlyAssigned}
        selectedCount={selectedIds.length}
        totalCount={filteredRows.length}
        bulkLock={bulkLock}
        setPage={setPage}
        subjects={subjects}
        classes={classes}
      />

      {/* Table */}
      <div className="card at-tableCard">
        <div className="cardHead">
          <div className="cardHeadLeft">
            <div className="cardTitles">
              <div className="cardTitle">Danh sách giáo viên</div>
            </div>
          </div>
          <div className="cardHeadRight">
            <div className="at-pill" style={{ background: 'var(--mc)', color: '#fff', padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
              {filteredRows.length} kết quả
            </div>
          </div>
        </div>

        <div className="at-tableWrap">
          <table className="at-table">
            <thead>
              <tr>
                <th style={{ width: 44, paddingLeft: 14 }}>
                  <Checkbox
                    checked={pagedRows.length > 0 && pagedRows.every((r) => selectedIds.includes(r.teacher_id))}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Giáo viên</th>
                <th>Liên hệ</th>
                <th>Trạng thái</th>
                <th>Môn dạy</th>
                <th>Phân công</th>
                <th>Tiết/tuần</th>
                <th>Hoạt động</th>
                <th style={{ width: 220 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((r) => (
                <tr key={r.teacher_id} onClick={() => setDrawerTeacherId(r.teacher_id)} style={{ cursor: "pointer" }}>
                  <td style={{ paddingLeft: 14 }} onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedIds.includes(r.teacher_id)} 
                      onChange={() => toggleSelect(r.teacher_id)} 
                    />
                  </td>

                  <td>
                    <div className="at-teacherCell">
                      <div className="at-avatar">{initials(r.full_name)}</div>
                      <div>
                        <div className="at-teacherCell__name">{r.full_name}</div>
                        <div className="at-teacherCell__sub">
                          <span className="at-mono">{r.teacher_code}</span>
                          <span className="at-dot">•</span>
                          <span className="at-mono">@{r.username}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="at-contact">
                      <div className="at-contact__main">{r.email}</div>
                      <div className="at-contact__sub">{r.phone}</div>
                    </div>
                  </td>

                  <td>
                    <StatusBadge status={r.status} />
                  </td>

                  <td>
                    <div className="at-chips">
                      {r.capability.length ? (
                        r.capability.slice(0, 4).map((s) => <span key={s.id} className="at-chip">{s.code}</span>)
                      ) : (
                        <span className="at-muted">—</span>
                      )}
                      {r.capability.length > 4 && <span className="at-chip at-chip--ghost">+{r.capability.length - 4}</span>}
                    </div>
                  </td>

                  <td>
                    <div className="at-assignInfo">
                      <div className="at-assignInfo__row">
                        <span className="at-assignLabel">GVCN:</span>{" "}
                        {r.homerooms.length ? r.homerooms.map((x) => <span key={x} className="at-chip at-chip--green">{x}</span>) : <span className="at-muted">Không</span>}
                      </div>
                      <div className="at-assignInfo__row">
                        <span className="at-assignLabel">Dạy:</span>{" "}
                        {r.teachingClasses.length ? (
                          <>
                            <span className="at-chip at-chip--ghost">{r.teachingClasses.length} lớp</span>
                            <span className="at-chip at-chip--ghost">{r.teachingSubjects.length} môn</span>
                          </>
                        ) : (
                          <span className="at-muted">—</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="at-workload">
                      <div className="at-workload__value">{r.workload}</div>
                      <div className="at-workload__sub">tiết/tuần</div>
                    </div>
                  </td>

                  <td>
                    <div className="at-last">{r.lastAction}</div>
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="at-actions">
                      <button className="at-iconBtn at-iconBtn--edit" title="Sửa" onClick={() => openEdit(r.teacher_id)}>
                        <FiEdit2 />
                      </button>
                      <button className="at-iconBtn at-iconBtn--assign" title="Phân công" onClick={() => openAssignModal(r.teacher_id)}>
                        <FiClipboard />
                      </button>
                      {r.status === "ACTIVE" ? (
                        <button className="at-iconBtn at-iconBtn--lock" title="Khóa" onClick={() => lockUnlockUser(r.teacher_id, "LOCKED")}>
                          <FiLock />
                        </button>
                      ) : (
                        <button className="at-iconBtn at-iconBtn--unlock" title="Mở khóa" onClick={() => lockUnlockUser(r.teacher_id, "ACTIVE")}>
                          <FiUnlock />
                        </button>
                      )}
                      <button className="at-iconBtn at-iconBtn--key" title="Reset mật khẩu" onClick={() => resetPassword(r.teacher_id)}>
                        <FiKey />
                      </button>
                      <button className="at-iconBtn at-iconBtn--danger" title="Xóa" onClick={() => deleteTeacher(r.teacher_id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pagedRows.length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <div className="at-empty">
                      <div className="at-empty__title">Không có dữ liệu phù hợp</div>
                      <div className="at-empty__sub">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Shared Component */}
        <div className="at-paging" style={{ borderTop: "1px solid var(--border)", paddingTop: "14px" }}>
           <Pagination 
             page={page} 
             totalPages={totalPages} 
             onPageChange={setPage} 
           />
        </div>
      </div>
    </div>
  );
}
