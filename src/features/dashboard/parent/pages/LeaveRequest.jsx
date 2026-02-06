import React, { useState } from 'react';
import './LeaveRequest.css';
import {
  AiOutlinePlus,
  AiOutlineSend,
  AiOutlineHistory,
  AiOutlineCalendar,
  AiOutlineFileText
} from 'react-icons/ai';

/* ===== ENUM ===== */
export const LeaveRequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

/* ================= MOCK TABLES (match ERD names) ================= */
const students = [
  { id: 'HS001', student_code: 'HS001', full_name: 'Nguyễn Văn A', gender: 'Nam', dob: '2012-05-15', class_id: 1, student_role_id: 1, fingerprint_id: 'FP-001', status: 'ACTIVE' }
];

const parents = [
  { id: 1, user_id: 2001, student_id: 'HS001', full_name: 'Nguyễn Thị B', phone: '090xxxx123', zalo_id: 'zalo_001' }
];

/* ===== MOCK LEAVE REQUEST (đúng ERD) ===== */
const leave_requests = [
  {
    id: 1,
    parent_id: 1,
    student_id: 'HS001',
    from_date: '2024-05-12',
    to_date: '2024-05-13',
    reason: 'Bị sốt, cần nghỉ ngơi',
    status: LeaveRequestStatus.PENDING,
    approved_by: null,
    created_at: '2024-05-10 08:30',
    updated_at: '2024-05-10 08:30'
  },
  {
    id: 2,
    parent_id: 1,
    student_id: 'HS001',
    from_date: '2024-04-02',
    to_date: '2024-04-02',
    reason: 'Có việc gia đình',
    status: LeaveRequestStatus.APPROVED,
    approved_by: 101,
    created_at: '2024-04-01 19:10',
    updated_at: '2024-04-02 08:00'
  }
];
/* ================================================================= */

const LeaveRequest = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      'Đơn xin nghỉ đã được gửi thành công! Giáo viên chủ nhiệm sẽ xét duyệt sớm nhất.'
    );
    setShowForm(false);
  };

  return (
    <div className="leave-wrapper">
      {/* HEADER */}
      <div className="leave-header">
        <div>
          <h3>Quản lý nghỉ học</h3>
          <p>Gửi đơn xin nghỉ và theo dõi trạng thái xét duyệt</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <AiOutlineHistory size={18} /> : <AiOutlinePlus size={18} />}
          <span>{showForm ? 'Xem lịch sử đơn' : 'Gửi đơn mới'}</span>
        </button>
      </div>

      {/* FORM */}
      {showForm ? (
        <div className="leave-form-card">
          <div className="form-header">
            <div className="form-icon">
              <AiOutlineFileText size={22} />
            </div>
            <div>
              <h4>Tạo đơn xin nghỉ học</h4>
              <p>Học sinh: {students[0].full_name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Từ ngày</label>
                <input
                  type="date"
                  required
                  value={formData.from_date}
                  onChange={(e) =>
                    setFormData({ ...formData, from_date: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Đến ngày</label>
                <input
                  type="date"
                  required
                  value={formData.to_date}
                  onChange={(e) =>
                    setFormData({ ...formData, to_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>Lý do xin nghỉ</label>
              <textarea
                rows="4"
                required
                placeholder="Vui lòng nhập lý do chi tiết..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowForm(false)}
              >
                Hủy bỏ
              </button>
              <button type="submit" className="primary-btn">
                <AiOutlineSend size={16} />
                Gửi đơn xét duyệt
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* HISTORY */
        <div className="leave-history-card">
          <div className="history-header">
            <h4>Lịch sử gửi đơn</h4>
            <div className="legend">
              <span><i className="dot pending" /> ĐANG CHỜ</span>
              <span><i className="dot approved" /> ĐÃ DUYỆT</span>
            </div>
          </div>

          {leave_requests.map((req) => (
            <div key={req.id} className="history-item">
              <div className="status-row">
                <span className={`status ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
                <span className="created-at">
                  Gửi lúc: {req.created_at}
                </span>
              </div>

              <div className="date-row">
                <div>
                  <AiOutlineCalendar />
                  Từ: <strong>{req.from_date}</strong>
                </div>
                <div>
                  <AiOutlineCalendar />
                  Đến: <strong>{req.to_date}</strong>
                </div>
              </div>

              <p className="reason">"{req.reason}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeaveRequest;
