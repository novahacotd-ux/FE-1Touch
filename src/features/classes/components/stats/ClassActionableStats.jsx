
import React, { useState } from "react";
import { 
  FiAlertCircle, FiCheckCircle, FiUsers, FiClock, FiCalendar, 
  FiChevronRight, FiTool, FiLock, FiUnlock, FiBarChart2, FiAlertTriangle
} from "react-icons/fi";
import Card from "../../../dashboard/admin/components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Chip from "../../components/ui/Chip";
import Donut from "../charts/ClmDonut"; // reusing current Donut if suitable
import BarChart from "../charts/ClmBarChart"; // reusing current Bar if suitable

// CSS reused from AdminClasses.css via global import in parent

export default function ClassActionableStats({ stats, onAction }) {
  const { readiness, attendance } = stats;
  
  // Local state for "Action Simulation"
  const [actionModal, setActionModal] = useState(null);

  const handleActionClick = (actionType, data) => {
    setActionModal({ type: actionType, data });
  };

  const confirmAction = () => {
    if (onAction && actionModal) {
      onAction(actionModal.type, actionModal.data);
    }
    setActionModal(null);
  };

  return (
    <div className="clm-grid2">
      {/* PANEL 1: OPERATION READINESS */}
      <ReadinessPanel 
         data={readiness} 
         onAction={handleActionClick} 
      />

      {/* PANEL 2: ATTENDANCE QUALITY */}
      <AttendancePanel 
         data={attendance} 
         onAction={handleActionClick} 
      />

      {/* MOCK DRAWER/MODAL FOR ACTIONS */}
      {actionModal && (
        <Modal 
          open={!!actionModal} 
          title="Xác nhận thao tác (Mock)" 
          onClose={() => setActionModal(null)}
          footer={
            <div className="clm-modalBtns">
               <Button variant="ghost" onClick={() => setActionModal(null)}>Hủy</Button>
               <Button onClick={confirmAction}>Xác nhận</Button>
            </div>
          }
        >
          <div className="clm-form">
            <div>Bạn đang thực hiện thao tác: <b>{actionModal.type}</b></div>
            <div>Đối tượng: <b>{actionModal.data?.class?.class_name || actionModal.data?.label || "N/A"}</b></div>
            <div className="clm-muted">Hệ thống sẽ ghi audit log và cập nhật trạng thái giả lập.</div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ReadinessPanel({ data, onAction }) {
  const { list, counts } = data;
  
  // Prepare Donut Data
  const donutData = [
    { label: "Chưa gán GVCN", value: counts.MISSING_HOMEROOM, color: "#f87171" },
    { label: "GVCN bị khóa", value: counts.HOMEROOM_LOCKED, color: "#fbbf24" },
    { label: "Thiếu TKB", value: counts.MISSING_TIMETABLE, color: "#a78bfa" },
    { label: "Thiếu vân tay", value: counts.LOW_FINGERPRINT, color: "#34d399" },
  ].filter(d => d.value > 0);

  return (
    <Card 
      title="Lớp cần xử lý ngay" 
      subtitle="Các vấn đề cấu hình & thiết lập" 
      icon={<FiAlertTriangle />}
    >
      <div className="clm-stats-layout" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Left: Donut (Chart + Legend) */}
        <div style={{ width: '300px', flexShrink: 0, paddingRight: 10, borderRight: '1px dashed var(--border)' }}>
           {donutData.length > 0 ? (
             <Donut items={donutData} centerTop={list.length} centerBottom="Issues" />
           ) : (
             <div className="clm-empty-circle" style={{height: 140, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
               <FiCheckCircle size={40} color="var(--mc)" />
               <div style={{fontSize: 12, marginTop: 8}}>Không có việc cần xử lý</div>
             </div>
           )}
        </div>

        {/* Right: List */}
        <div className="clm-wizList" style={{ flex: 1, minWidth: '300px', maxHeight: '280px', overflowY: 'auto' }}>
          {list.length === 0 && <div className="clm-muted">Không có vấn đề cần xử lý.</div>}
          {list.map((item) => (
            <div key={item.class.id} style={{ padding: '10px 0', borderBottom: '1px dashed var(--border)' }}>
               {/* Header Line */}
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 8}}>
                  <div>
                    <div style={{fontWeight: 700, fontSize: 15, color: 'var(--tc)'}}>{item.class.class_name}</div>
                    <div style={{fontSize: 11, color: 'var(--ts)'}}>Tổng {item.issueCount} vấn đề</div>
                  </div>
                  
                  {/* Action Buttons (Flex Wrap) */}
                  <div style={{display:'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '60%'}}>
                     {item.issues.includes("MISSING_HOMEROOM") && (
                       <Button size="xs" variant="primary" onClick={() => onAction("ASSIGN_HOMEROOM", item)}>Gán GVCN</Button>
                     )}
                     {item.issues.includes("HOMEROOM_LOCKED") && (
                       <Button size="xs" variant="secondary" onClick={() => onAction("UNLOCK_TEACHER", item)}>Mở khóa GV</Button>
                     )}
                     {item.issues.includes("MISSING_TIMETABLE") && (
                       <Button size="xs" variant="secondary" onClick={() => onAction("CONFIG_TIMETABLE", item)}>Cấu hình TKB</Button>
                     )}
                     {item.issues.includes("LOW_FINGERPRINT") && (
                       <Button size="xs" variant="secondary" onClick={() => onAction("MANAGE_FINGERPRINT", item)}>QL Vân tay</Button>
                     )}
                   </div>
               </div>
               
               {/* Badges / Chips */}
               <div style={{display:'flex', gap: 6, flexWrap: 'wrap'}}>
                 {item.issues.includes("MISSING_HOMEROOM") && 
                   <Chip label="Chưa gán GVCN" color="red" size="small" icon={<FiUsers />} />
                 }
                 {item.issues.includes("HOMEROOM_LOCKED") && 
                   <Chip label="GVCN bị khóa" color="orange" size="small" icon={<FiLock />} />
                 }
                 {item.issues.includes("MISSING_TIMETABLE") && 
                   <Chip label="Thiếu TKB" color="purple" size="small" icon={<FiCalendar />} />
                 }
                 {item.issues.includes("LOW_FINGERPRINT") && 
                   <Chip label={`Vân tay thấp (${Math.round(item.class.meta_coverage*100)}%)`} color="blue" size="small" icon={<FiTool />} />
                 }
               </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AttendancePanel({ data, onAction }) {
  const { hotspots, bands } = data;

  // Prepare Band Data for Chart
  const bandData = [
    { key: "A", label: "<8h", value: bands.A, color: "#fca5a5" },
    { key: "B", label: "8-10h", value: bands.B, color: "#fdba74" },
    { key: "C", label: "10-13h", value: bands.C, color: "#a5b4fc" },
    { key: "D", label: ">13h", value: bands.D, color: "#86efac" },
  ];

  return (
    <Card 
      title="Điểm danh có vấn đề (Hotspots)" 
      subtitle="7 ngày gần nhất • Top lớp vắng/trễ" 
      icon={<FiBarChart2 />}
      right={
         <div style={{display:'flex', gap: 4}}>
            <Button size="xs" variant="ghost" onClick={() => onAction("VIEW_CONFIG", null)}>Cấu hình</Button>
         </div>
      }
    >
      <div className="clm-stats-layout" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
         {/* Top Section: Time Distribution */}
         <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <div style={{fontSize: 12, fontWeight: 700, color: 'var(--ts)', width: 80}}>Time Bands:</div>
            <div style={{flex: 1, height: 8, display: 'flex', borderRadius: 4, overflow: 'hidden'}}>
               {bandData.map(b => {
                 if (!b.value) return null;
                 const total = Object.values(bands).reduce((a,c)=>a+c,0) || 1;
                 const width = (b.value / total) * 100;
                 return <div key={b.key} style={{width: `${width}%`, background: b.color}} title={`${b.label}: ${b.value}`} />;
               })}
            </div>
         </div>

         {/* Hotspots List */}
         <div className="clm-hotspots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {hotspots.length === 0 && <div className="clm-muted">Không có dữ liệu bất thường.</div>}
            {hotspots.map((h, i) => (
              <div key={i} className="clm-miniList" style={{background: 'var(--card-bg)', border: '1px solid var(--border)'}}>
                 <div style={{display:'flex', justifyContent:'space-between', marginBottom: 6}}>
                    <span style={{fontWeight: 700}}>{h.class.class_name}</span>
                    <span className="clm-rbadge clm-rbadge--LEADER" style={{color: 'red', background: 'rgba(255,0,0,0.1)'}}>
                       Score {h.score.toFixed(2)}
                    </span>
                 </div>
                 
                 <div style={{display:'flex', gap: 10, fontSize: 12}}>
                    <div style={{flex: 1}}>
                       <div className="clm-muted">Vắng</div>
                       <div style={{fontWeight: 700, color: 'var(--tc)'}}>{Math.round(h.absentRate*100)}%</div>
                    </div>
                    <div style={{flex: 1}}>
                       <div className="clm-muted">Đi trễ</div>
                       <div style={{fontWeight: 700, color: 'var(--tc)'}}>{Math.round(h.lateRate*100)}%</div>
                    </div>
                 </div>
                 
                 <Button 
                   size="xs" 
                   variant="ghost" 
                   style={{width: '100%', marginTop: 8}}
                   onClick={() => onAction("VIEW_ATTENDANCE", h)}
                 >
                   Xem chi tiết <FiChevronRight />
                 </Button>
              </div>
            ))}
         </div>
      </div>
    </Card>
  );
}
