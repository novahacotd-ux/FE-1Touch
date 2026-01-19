import Checkbox from '../../../../features/dashboard/admin/components/ui/Checkbox';
import { FiFilter, FiUnlock, FiLock } from "react-icons/fi";
import Select from '../../../../features/dashboard/admin/components/ui/Select';
import SearchInput from '../../../../features/dashboard/admin/components/ui/SearchInput';

export default function TeacherFilterBar({
  q, setQ,
  statusFilter, setStatusFilter,
  subjectFilter, setSubjectFilter,
  classFilter, setClassFilter,
  sortKey, setSortKey,
  onlyHomeroom, setOnlyHomeroom,
  onlyAssigned, setOnlyAssigned,
  selectedCount, totalCount,
  bulkLock,
  setPage,
  subjects = [],
  classes = []
}) {
  return (
    <div className="card">
      <div className="cardHead">
        <div className="cardHeadLeft">
          <div className="cardIcon"><FiFilter /></div>
          <div className="cardTitles">
            <div className="cardTitle">Bộ lọc & thao tác</div>
            <div className="cardSub">Lọc theo trạng thái, môn, lớp… và thao tác hàng loạt.</div>
          </div>
        </div>
      </div>

      <div className="cardBody">
        <div className="admin-dash__filters" style={{ border: 'none', padding: 0 }}>
          
          <div className="filterRow">
            <SearchInput 
              value={q} 
              onChange={(val) => { setQ(val); setPage(1); }} 
              placeholder="Tìm theo mã GV / tên / email / username…" 
            />
            
            <div className="filter">
               <div className="filterLabel">Tùy chọn</div>
               <div style={{ display: 'flex', gap: '16px', height: '40px', alignItems: 'center' }}>
                 <Checkbox 
                   checked={onlyHomeroom} 
                   onChange={(e) => setOnlyHomeroom(e.target.checked)} 
                   label="GVCN"
                 />
                 <Checkbox 
                   checked={onlyAssigned} 
                   onChange={(e) => setOnlyAssigned(e.target.checked)} 
                   label="Có phân công"
                 />
               </div>
            </div>
          </div>

          <div className="filterRow" style={{ marginTop: '16px' }}>
             <div className="filter">
               <div className="filterLabel">Trạng thái</div>
               <Select
                  value={statusFilter}
                  onChange={(val) => { setStatusFilter(val); setPage(1); }}
                  options={[
                    { value: "ALL", label: "Tất cả" },
                    { value: "ACTIVE", label: "ACTIVE" },
                    { value: "LOCKED", label: "LOCKED" }
                  ]}
               />
             </div>

             <div className="filter">
               <div className="filterLabel">Môn</div>
               <Select
                  value={subjectFilter}
                  onChange={(val) => { setSubjectFilter(val); setPage(1); }}
                  options={[
                    { value: "ALL", label: "Tất cả" },
                    ...subjects.map(s => ({ value: s.id, label: `${s.code} — ${s.name}` }))
                  ]}
               />
             </div>

             <div className="filter">
               <div className="filterLabel">Lớp</div>
               <Select
                  value={classFilter}
                  onChange={(val) => { setClassFilter(val); setPage(1); }}
                  options={[
                    { value: "ALL", label: "Tất cả" },
                    ...classes.map(c => ({ value: c.id, label: c.name }))
                  ]}
               />
             </div>

             <div className="filter">
               <div className="filterLabel">Sắp xếp</div>
               <Select
                  value={sortKey}
                  onChange={(val) => setSortKey(val)}
                  options={[
                    { value: "RECENT", label: "Mới cập nhật" },
                    { value: "NAME", label: "Tên A–Z" },
                    { value: "WORKLOAD", label: "Workload cao" }
                  ]}
               />
             </div>
          </div>

          {/* Bulk Actions Footer */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ fontSize: '12.5px', color: 'var(--ts)' }}>
               Đã chọn <b style={{ color: 'var(--tc)' }}>{selectedCount}</b> / {totalCount}
             </div>
             <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn--ghost" onClick={() => bulkLock("ACTIVE")}>
                  <FiUnlock /> Mở khóa
                </button>
                <button className="btn btn--ghost" onClick={() => bulkLock("LOCKED")}>
                 <FiLock /> Khóa
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
