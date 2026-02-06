import React from 'react';
import './StudentProfile.css';

import {
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaAward,
  FaBookOpen,
  FaFingerprint
} from 'react-icons/fa';

/* ================= MOCK TABLES (match ERD names) ================= */
const users = [
  {
    id: 2001,
    username: 'parent01',
    password: '***',
    full_name: 'Nguyễn Thị B',
    email: 'phuhuynh01@email.com',
    phone: '090xxxx123',
    role: 'PARENT',
    status: 'ACTIVE',
    created_at: '2024-01-01 08:00',
    updated_at: '2024-05-01 08:00'
  }
];

const student_roles = [
  { id: 1, role_code: 'VICE_LEADER', role_name: 'Lớp phó học tập', description: '', is_active: true }
];

const classes = [
  { id: 1, class_name: '5A1', grade_id: 1, academic_year_id: 1, status: 'OPEN' }
];

const students = [
  {
    id: 'HS001',
    student_code: 'HS20240512',
    full_name: 'Nguyễn Minh Khang',
    gender: 'Nam',
    dob: '2012-05-15',
    class_id: 1,
    student_role_id: 1,
    fingerprint_id: 'FP-102938',
    status: 'ACTIVE'
  }
];

const parents = [
  {
    id: 1,
    user_id: 2001,
    student_id: 'HS001',
    full_name: 'Nguyễn Thị B',
    phone: '090xxxx123',
    zalo_id: 'zalo_001'
  }
];

const student_avatar_url = 'https://i.pravatar.cc/300?img=12';
/* ================================================================= */

const currentStudent = students[0];
const currentClass = classes.find(c => c.id === currentStudent.class_id);
const currentRole = student_roles.find(r => r.id === currentStudent.student_role_id);
const currentParent = parents.find(p => p.student_id === currentStudent.id);
const currentParentUser = users.find(u => u.id === currentParent?.user_id);

const StudentProfile = () => {
  return (
    <div className="student-profile">
      <div className="profile-grid">
        {/* LEFT: BASIC INFO */}
        <div className="profile-left">
          <div className="profile-card">
            <img
              src={student_avatar_url}
              alt={currentStudent.full_name}
              className="profile-avatar"
            />

            <h3>{currentStudent.full_name}</h3>
            <span className="student-code">{currentStudent.student_code}</span>

            <div className="profile-meta">
              <div className="meta-item">
                <FaBookOpen />
                <div>
                  <span>Lớp học</span>
                  <strong>{currentClass?.class_name ?? '—'}</strong>
                </div>
              </div>

              <div className="meta-item">
                <FaFingerprint />
                <div>
                  <span>Vân tay</span>
                  <strong>{currentStudent.fingerprint_id}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAIL */}
        <div className="profile-right">
          <div className="detail-card">
            <h4>Thông tin chi tiết</h4>

            <div className="detail-grid">
              <div className="detail-item">
                <label><FaUser /> Họ và tên</label>
                <p>{currentStudent.full_name}</p>
              </div>

              <div className="detail-item">
                <label><FaCalendarAlt /> Ngày sinh</label>
                <p>{currentStudent.dob}</p>
              </div>

              <div className="detail-item">
                <label><FaUser /> Giới tính</label>
                <p>{currentStudent.gender}</p>
              </div>

              <div className="detail-item">
                <label><FaAward /> Vai trò lớp</label>
                <p className="highlight">{currentRole?.role_name ?? '—'}</p>
              </div>

              <div className="detail-item">
                <label><FaPhone /> SĐT liên hệ</label>
                <p>{currentParentUser?.phone ?? currentParent?.phone ?? '—'}</p>
              </div>

              <div className="detail-item">
                <label><FaEnvelope /> Email</label>
                <p>{currentParentUser?.email ?? '—'}</p>
              </div>
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="achievement-card">
            <h4><FaAward /> Thành tích tiêu biểu</h4>

            <ul>
              <li>
                <span>1</span>
                <div>
                  <strong>Giải Nhì Olympic Toán cấp Quận</strong>
                  <p>Học kỳ I • 2023 – 2024</p>
                </div>
              </li>

              <li>
                <span>2</span>
                <div>
                  <strong>Học sinh xuất sắc 5 năm liền</strong>
                  <p>Bậc Tiểu học</p>
                </div>
              </li>
            </ul>

            <FaAward className="achievement-bg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
