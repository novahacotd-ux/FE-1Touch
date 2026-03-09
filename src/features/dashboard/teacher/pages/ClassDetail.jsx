// ClassDetail.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiUsers,
    FiCalendar,
    FiClipboard,
    FiHome,
    FiUser,
    FiStar,
    FiBook,
} from 'react-icons/fi';
import './ClassDetail.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Table from '../../admin/components/ui/Table';

// Mock data - Chi tiết lớp
const classesData = {
    1: { id: 1, className: '6A', grade: 'Khối 6', gradeLevel: 6, totalStudents: 35, maleStudents: 18, femaleStudents: 17, role: 'SUBJECT', subject: 'Toán học', room: 'P.201', homeroomTeacher: 'Nguyễn Thị Lan', academicYear: '2025-2026', semester: 'Học kỳ 2' },
    2: { id: 2, className: '6B', grade: 'Khối 6', gradeLevel: 6, totalStudents: 32, maleStudents: 15, femaleStudents: 17, role: 'HOMEROOM', subject: 'Chủ nhiệm', room: 'P.202', homeroomTeacher: null, academicYear: '2025-2026', semester: 'Học kỳ 2' },
    3: { id: 3, className: '7A', grade: 'Khối 7', gradeLevel: 7, totalStudents: 38, maleStudents: 20, femaleStudents: 18, role: 'SUBJECT', subject: 'Toán học', room: 'P.301', homeroomTeacher: 'Trần Văn Minh', academicYear: '2025-2026', semester: 'Học kỳ 2' },
    4: { id: 4, className: '7B', grade: 'Khối 7', gradeLevel: 7, totalStudents: 36, maleStudents: 17, femaleStudents: 19, role: 'SUBJECT', subject: 'Toán học', room: 'P.302', homeroomTeacher: 'Lê Thị Hương', academicYear: '2025-2026', semester: 'Học kỳ 2' },
    5: { id: 5, className: '8A', grade: 'Khối 8', gradeLevel: 8, totalStudents: 40, maleStudents: 22, femaleStudents: 18, role: 'SUBJECT', subject: 'Toán học', room: 'P.401', homeroomTeacher: 'Phạm Văn Đức', academicYear: '2025-2026', semester: 'Học kỳ 2' },
    6: { id: 6, className: '8B', grade: 'Khối 8', gradeLevel: 8, totalStudents: 38, maleStudents: 19, femaleStudents: 19, role: 'SUBJECT', subject: 'Toán học', room: 'P.402', homeroomTeacher: 'Hoàng Thị Mai', academicYear: '2025-2026', semester: 'Học kỳ 2' },
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

// Mock schedule data
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
            <div className="admin-dash">
                <Card
                    title="Không tìm thấy lớp"
                    icon={<FiUsers />}
                    subtitle={`Lớp học với ID "${classId}" không tồn tại`}
                >
                    <div className="emptyBox">
                        <p>Lớp học bạn đang tìm kiếm không tồn tại trong hệ thống.</p>
                        <button
                            className="btn btn--primary"
                            onClick={() => navigate('/teacher/teaching-classes')}
                        >
                            <FiArrowLeft size={16} />
                            Quay lại danh sách lớp
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    const tabs = [
        { id: 'students', label: 'Danh sách học sinh', icon: <FiUsers /> },
        { id: 'schedule', label: 'Thời khóa biểu', icon: <FiCalendar /> },
        { id: 'attendance', label: 'Điểm danh', icon: <FiClipboard /> },
    ];

    return (
        <div className="admin-dash">
            {/* Back Button & Breadcrumb */}
            <div className="page-breadcrumb">
                <button className="btn" onClick={() => navigate('/teacher/teaching-classes')}>
                    <FiArrowLeft size={16} />
                    Quay lại
                </button>
                <div className="breadcrumb-trail">
                    <span className="tag tag--muted">Lớp giảng dạy</span>
                    <span className="tag tag--info">{classInfo.className}</span>
                </div>
            </div>

            {/* Class Info Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className={`class-avatar-large ${classInfo.role.toLowerCase()}`}>
                        <span>{classInfo.className}</span>
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Lớp {classInfo.className}</div>
                        <div className="sub" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <span className="tag tag--muted">{classInfo.grade}</span>
                            <span className={`tag tag--${classInfo.role === 'HOMEROOM' ? 'warn' : 'info'}`}>
                                {classInfo.role === 'HOMEROOM' ? 'Chủ nhiệm' : 'Bộ môn'}
                            </span>
                            <span className="tag tag--muted">{classInfo.subject}</span>
                        </div>
                    </div>
                </div>

                <div className="admin-dash__filters">
                    <div className="kpiFacts" style={{ display: 'flex', gap: '16px' }}>
                        <div className="fact">
                            <div className="factIcon"><FiUsers /></div>
                            <div>
                                <div className="factLabel">Học sinh</div>
                                <div className="factValue">{classInfo.totalStudents}</div>
                            </div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: '#3b82f6' }}><FiUser /></div>
                            <div>
                                <div className="factLabel">Nam</div>
                                <div className="factValue">{classInfo.maleStudents}</div>
                            </div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: '#ec4899' }}><FiUser /></div>
                            <div>
                                <div className="factLabel">Nữ</div>
                                <div className="factValue">{classInfo.femaleStudents}</div>
                            </div>
                        </div>
                        <div className="fact">
                            <div className="factIcon"><FiHome /></div>
                            <div>
                                <div className="factLabel">Phòng học</div>
                                <div className="factValue">{classInfo.room}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {classInfo.role === 'SUBJECT' && classInfo.homeroomTeacher && (
                <div className="homeroom-info">
                    <span className="tag tag--info">
                        <FiStar size={12} />
                        Giáo viên chủ nhiệm: {classInfo.homeroomTeacher}
                    </span>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="tabs-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`chip ${activeTab === tab.id ? 'chip--on' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'students' && (
                <Card
                    title={`Danh sách học sinh (${students.length})`}
                    icon={<FiUsers />}
                    subtitle="Danh sách học sinh trong lớp"
                    right={<Pill tone="info">{students.length} học sinh</Pill>}
                >
                    <Table
                        columns={[
                            { key: 'stt', header: 'STT', width: '6%' },
                            { key: 'code', header: 'Mã HS', width: '12%' },
                            { key: 'name', header: 'Họ và tên', width: '30%' },
                            { key: 'gender', header: 'Giới tính', width: '12%' },
                            { key: 'dob', header: 'Ngày sinh', width: '18%' },
                            { key: 'status', header: 'Trạng thái', width: '22%' },
                        ]}
                        rows={students.map((student, index) => ({
                            key: student.id,
                            stt: index + 1,
                            code: <span className="tag tag--muted">{student.studentCode}</span>,
                            name: <b>{student.firstName} {student.lastName}</b>,
                            gender: (
                                <span className={`pill pill--${student.gender === 'Nam' ? 'info' : 'warn'}`}>
                                    {student.gender}
                                </span>
                            ),
                            dob: new Date(student.dateOfBirth).toLocaleDateString('vi-VN'),
                            status: (
                                <span className={`pill pill--${student.status === 'active' ? 'good' : 'bad'}`}>
                                    {student.status === 'active' ? 'Đang học' : 'Nghỉ học'}
                                </span>
                            ),
                        }))}
                        emptyText="Không có học sinh trong lớp."
                    />
                </Card>
            )}

            {activeTab === 'schedule' && (
                <Card
                    title={`Thời khóa biểu lớp ${classInfo.className}`}
                    icon={<FiCalendar />}
                    subtitle="Lịch học trong tuần"
                    right={<Pill tone="info">{classSchedule.length} tiết</Pill>}
                >
                    <div className="schedule-list">
                        {classSchedule.map((item, index) => (
                            <div key={index} className="schedule-item">
                                <div className="schedule-day">
                                    <span className="day-name">{item.day}</span>
                                    <span className="tag tag--muted">Tiết {item.period}</span>
                                </div>
                                <div className="schedule-content">
                                    <span className="subject-name">{item.subject}</span>
                                    <span className="tag tag--info">
                                        <FiUser size={12} /> {item.teacher}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {activeTab === 'attendance' && (
                <Card
                    title="Điểm danh"
                    icon={<FiClipboard />}
                    subtitle="Quản lý điểm danh lớp học"
                >
                    <div className="emptyBox">
                        <FiClipboard size={32} />
                        <h3>Đang phát triển</h3>
                        <p>Chức năng điểm danh sẽ sớm được cập nhật.</p>
                    </div>
                </Card>
            )}
        </div>
    );
}

export default ClassDetail;
