import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClassDetail.css';

// Mock data - Chi tiết lớp (based on ERD: classes + teacher_assignments)
const classesData = {
    1: {
        id: 1,
        className: '6A',
        grade: 'Khối 6',
        gradeLevel: 6,
        totalStudents: 35,
        maleStudents: 18,
        femaleStudents: 17,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.201',
        homeroomTeacher: 'Nguyễn Thị Lan',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    2: {
        id: 2,
        className: '6B',
        grade: 'Khối 6',
        gradeLevel: 6,
        totalStudents: 32,
        maleStudents: 15,
        femaleStudents: 17,
        role: 'HOMEROOM',
        subject: 'Chủ nhiệm',
        room: 'P.202',
        homeroomTeacher: null,
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    3: {
        id: 3,
        className: '7A',
        grade: 'Khối 7',
        gradeLevel: 7,
        totalStudents: 38,
        maleStudents: 20,
        femaleStudents: 18,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.301',
        homeroomTeacher: 'Trần Văn Minh',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    4: {
        id: 4,
        className: '7B',
        grade: 'Khối 7',
        gradeLevel: 7,
        totalStudents: 36,
        maleStudents: 17,
        femaleStudents: 19,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.302',
        homeroomTeacher: 'Lê Thị Hương',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    5: {
        id: 5,
        className: '8A',
        grade: 'Khối 8',
        gradeLevel: 8,
        totalStudents: 40,
        maleStudents: 22,
        femaleStudents: 18,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.401',
        homeroomTeacher: 'Phạm Văn Đức',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
    6: {
        id: 6,
        className: '8B',
        grade: 'Khối 8',
        gradeLevel: 8,
        totalStudents: 38,
        maleStudents: 19,
        femaleStudents: 19,
        role: 'SUBJECT',
        subject: 'Toán học',
        room: 'P.402',
        homeroomTeacher: 'Hoàng Thị Mai',
        academicYear: '2025-2026',
        semester: 'Học kỳ 2',
    },
};

// Mock students data
const generateStudents = (classId, total, male) => {
    const students = [];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
    const maleFirstNames = ['Anh', 'Bảo', 'Cường', 'Dũng', 'Đức', 'Hải', 'Hùng', 'Khang', 'Minh', 'Nam'];
    const femaleFirstNames = ['An', 'Bình', 'Chi', 'Diệu', 'Hà', 'Hạnh', 'Lan', 'Mai', 'Ngọc', 'Thảo'];

    for (let i = 1; i <= total; i++) {
        const isMale = i <= male;
        students.push({
            id: classId * 100 + i,
            studentCode: `HS${classId}${String(i).padStart(2, '0')}`,
            firstName: lastNames[Math.floor(Math.random() * lastNames.length)],
            lastName: isMale
                ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
                : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)],
            gender: isMale ? 'Nam' : 'Nữ',
            dateOfBirth: `${2010 + Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            status: Math.random() > 0.05 ? 'active' : 'inactive',
        });
    }
    return students;
};

// Mock schedule data for class
const classSchedule = [
    { day: 'Thứ 2', period: 1, subject: 'Toán', teacher: 'Nguyễn Văn A' },
    { day: 'Thứ 2', period: 3, subject: 'Văn', teacher: 'Trần Thị B' },
    { day: 'Thứ 3', period: 2, subject: 'Anh', teacher: 'Lê Văn C' },
    { day: 'Thứ 3', period: 4, subject: 'Toán', teacher: 'Nguyễn Văn A' },
    { day: 'Thứ 4', period: 1, subject: 'Lý', teacher: 'Phạm Thị D' },
    { day: 'Thứ 5', period: 3, subject: 'Toán', teacher: 'Nguyễn Văn A' },
    { day: 'Thứ 6', period: 2, subject: 'Hóa', teacher: 'Hoàng Văn E' },
];

function ClassDetail() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');

    const classInfo = classesData[classId];
    const students = classInfo ? generateStudents(classInfo.id, classInfo.totalStudents, classInfo.maleStudents) : [];

    if (!classInfo) {
        return (
            <div className="container-fluid container-dashboard-db" style={{ padding: '10px 20px' }}>
                <div className="not-found card-db">
                    <i className="fas fa-exclamation-circle"></i>
                    <h3>Không tìm thấy lớp</h3>
                    <p>Lớp học với ID "{classId}" không tồn tại trong hệ thống.</p>
                    <button className="btn-back" onClick={() => navigate('/teacher/teaching-classes')}>
                        <i className="fas fa-arrow-left"></i>
                        Quay lại danh sách lớp
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'students', label: 'Danh sách học sinh', icon: 'fas fa-users' },
        { id: 'schedule', label: 'Thời khóa biểu', icon: 'fas fa-calendar-alt' },
        { id: 'attendance', label: 'Điểm danh', icon: 'fas fa-clipboard-check' },
    ];

    return (
        <div className="container-fluid container-dashboard-db" style={{ padding: '10px 20px' }}>
            {/* Back Button & Breadcrumb */}
            <div className="page-breadcrumb">
                <button className="btn-back" onClick={() => navigate('/teacher/teaching-classes')}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Quay lại</span>
                </button>
                <div className="breadcrumb-trail">
                    <span>Lớp giảng dạy</span>
                    <i className="fas fa-chevron-right"></i>
                    <span className="current">{classInfo.className}</span>
                </div>
            </div>

            {/* Class Info Header */}
            <div className="class-detail-header card-db">
                <div className="class-main-info">
                    <div className="class-identity">
                        <div className={`class-avatar ${classInfo.role.toLowerCase()}`}>
                            <span>{classInfo.className}</span>
                        </div>
                        <div className="class-meta">
                            <h1 className="class-title">Lớp {classInfo.className}</h1>
                            <div className="class-tags">
                                <span className="tag grade">{classInfo.grade}</span>
                                <span className={`tag role ${classInfo.role.toLowerCase()}`}>
                                    {classInfo.role === 'HOMEROOM' ? 'Chủ nhiệm' : 'Bộ môn'}
                                </span>
                                <span className="tag subject">{classInfo.subject}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="class-stats-row">
                    <div className="stat-item">
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{classInfo.totalStudents}</span>
                            <span className="stat-label">Học sinh</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon male">
                            <i className="fas fa-male"></i>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{classInfo.maleStudents}</span>
                            <span className="stat-label">Nam</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon female">
                            <i className="fas fa-female"></i>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{classInfo.femaleStudents}</span>
                            <span className="stat-label">Nữ</span>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon room">
                            <i className="fas fa-door-open"></i>
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{classInfo.room}</span>
                            <span className="stat-label">Phòng học</span>
                        </div>
                    </div>
                </div>

                {classInfo.role === 'SUBJECT' && classInfo.homeroomTeacher && (
                    <div className="homeroom-info">
                        <i className="fas fa-user-tie"></i>
                        <span>Giáo viên chủ nhiệm: <strong>{classInfo.homeroomTeacher}</strong></span>
                    </div>
                )}
            </div>

            {/* Tabs Navigation */}
            <div className="tabs-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content card-db">
                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="students-tab">
                        <div className="card-db-header">
                            <i className="fas fa-users"></i>
                            <span>Danh sách học sinh ({students.length})</span>
                        </div>
                        <div className="card-db-body">
                            <div className="students-table-wrapper">
                                <table className="students-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Mã HS</th>
                                            <th>Họ và tên</th>
                                            <th>Giới tính</th>
                                            <th>Ngày sinh</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td><code>{student.studentCode}</code></td>
                                                <td className="student-name">
                                                    {student.firstName} {student.lastName}
                                                </td>
                                                <td>
                                                    <span className={`gender-badge ${student.gender === 'Nam' ? 'male' : 'female'}`}>
                                                        {student.gender}
                                                    </span>
                                                </td>
                                                <td>{new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                                                <td>
                                                    <span className={`status-badge ${student.status}`}>
                                                        {student.status === 'active' ? 'Đang học' : 'Nghỉ học'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                    <div className="schedule-tab">
                        <div className="card-db-header">
                            <i className="fas fa-calendar-alt"></i>
                            <span>Thời khóa biểu lớp {classInfo.className}</span>
                        </div>
                        <div className="card-db-body">
                            <div className="schedule-list">
                                {classSchedule.map((item, index) => (
                                    <div key={index} className="schedule-item">
                                        <div className="schedule-day">
                                            <span className="day-name">{item.day}</span>
                                            <span className="period">Tiết {item.period}</span>
                                        </div>
                                        <div className="schedule-content">
                                            <span className="subject-name">{item.subject}</span>
                                            <span className="teacher-name">
                                                <i className="fas fa-user"></i> {item.teacher}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <div className="attendance-tab">
                        <div className="card-db-header">
                            <i className="fas fa-clipboard-check"></i>
                            <span>Điểm danh</span>
                        </div>
                        <div className="card-db-body">
                            <div className="coming-soon">
                                <i className="fas fa-hard-hat"></i>
                                <h3>Đang phát triển</h3>
                                <p>Chức năng điểm danh sẽ sớm được cập nhật.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClassDetail;
