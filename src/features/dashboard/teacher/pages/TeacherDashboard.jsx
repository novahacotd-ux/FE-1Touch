// TeacherDashboard.jsx
import React from "react";
import {
    FiClock,
    FiUsers,
    FiBook,
    FiCheckCircle,
    FiCalendar,
    FiUser,
} from "react-icons/fi";

// Styles
import "../pages/TeacherDashboard.css";

// Import Card component from admin
import Card from "../../admin/components/ui/Card";
import { Pill } from "../../admin/components/ui/Pills";

// Mock data - Tiết học hôm nay
const todayLessons = [
    { period: 1, time: '07:00 - 07:45', subject: 'Toán', className: '6A', room: 'P.201', status: 'completed' },
    { period: 2, time: '07:50 - 08:35', subject: 'Toán', className: '6B', room: 'P.202', status: 'completed' },
    { period: 3, time: '08:40 - 09:25', subject: null, className: null, room: null, status: 'free' },
    { period: 4, time: '09:30 - 10:15', subject: 'Toán', className: '7A', room: 'P.301', status: 'current' },
    { period: 5, time: '10:20 - 11:05', subject: 'Toán', className: '7B', room: 'P.302', status: 'upcoming' },
    { period: 6, time: '11:10 - 11:55', subject: null, className: null, room: null, status: 'free' },
];

// Mock data - Lớp đang dạy
const teachingClasses = [
    { id: 1, className: '6A', grade: 'Khối 6', totalStudents: 35, role: 'SUBJECT', subject: 'Toán học' },
    { id: 2, className: '6B', grade: 'Khối 6', totalStudents: 32, role: 'HOMEROOM', subject: 'Chủ nhiệm' },
    { id: 3, className: '7A', grade: 'Khối 7', totalStudents: 38, role: 'SUBJECT', subject: 'Toán học' },
    { id: 4, className: '7B', grade: 'Khối 7', totalStudents: 36, role: 'SUBJECT', subject: 'Toán học' },
];

// Mock data - Tình trạng điểm danh
const attendanceStats = {
    totalStudents: 141,
    present: 135,
    absent: 4,
    late: 2,
    excused: 0,
};

export default function TeacherDashboard() {
    const today = new Date();
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const formattedDate = `${dayNames[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const presentPercentage = ((attendanceStats.present / attendanceStats.totalStudents) * 100).toFixed(1);

    const getLessonStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'lesson-completed';
            case 'current': return 'lesson-current';
            case 'upcoming': return 'lesson-upcoming';
            case 'free': return 'lesson-free';
            default: return '';
        }
    };

    const getLessonStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Đã dạy';
            case 'current': return 'Đang dạy';
            case 'upcoming': return 'Sắp tới';
            case 'free': return 'Trống';
            default: return '';
        }
    };

    const activeLessons = todayLessons.filter(l => l.subject).length;

    return (
        <div className="admin-dash">
            {/* Header strip */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiUser />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Xin chào, Giáo viên!</div>
                        <div className="sub">{formattedDate}</div>
                    </div>
                </div>

                <div className="admin-dash__filters">
                    <div className="filterRow">
                        <div className="kpiFacts" style={{ display: 'flex', gap: '16px' }}>
                            <div className="fact">
                                <div className="factIcon"><FiCalendar /></div>
                                <div>
                                    <div className="factLabel">Tiết hôm nay</div>
                                    <div className="factValue">{activeLessons}</div>
                                </div>
                            </div>
                            <div className="fact">
                                <div className="factIcon"><FiBook /></div>
                                <div>
                                    <div className="factLabel">Lớp giảng dạy</div>
                                    <div className="factValue">{teachingClasses.length}</div>
                                </div>
                            </div>
                            <div className="fact">
                                <div className="factIcon"><FiUsers /></div>
                                <div>
                                    <div className="factLabel">Tổng học sinh</div>
                                    <div className="factValue">{attendanceStats.totalStudents}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 1 — Tiết học hôm nay */}
            <div className="grid" style={{ gridTemplateColumns: '1fr' }}>
                <Card
                    title="Tiết học hôm nay"
                    icon={<FiClock />}
                    subtitle={`${activeLessons} tiết dạy • ${formattedDate}`}
                    right={
                        <Pill tone={activeLessons > 0 ? "good" : "info"}>
                            {activeLessons} tiết
                        </Pill>
                    }
                >
                    <div className="lessons-timeline">
                        {todayLessons.map((lesson) => (
                            <div
                                key={lesson.period}
                                className={`lesson-item ${getLessonStatusClass(lesson.status)}`}
                            >
                                <div className="lesson-period">
                                    <span className="period-number">Tiết {lesson.period}</span>
                                    <span className="period-time">{lesson.time}</span>
                                </div>
                                <div className="lesson-content">
                                    {lesson.subject ? (
                                        <>
                                            <div className="lesson-subject">{lesson.subject}</div>
                                            <div className="lesson-details">
                                                <span className="tag tag--info">
                                                    <FiUsers size={12} /> {lesson.className}
                                                </span>
                                                <span className="tag tag--muted">
                                                    {lesson.room}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="lesson-free-text">Không có tiết</div>
                                    )}
                                </div>
                                <div className="lesson-status">
                                    <span className={`pill pill--${lesson.status === 'completed' ? 'good' : lesson.status === 'current' ? 'info' : lesson.status === 'upcoming' ? 'warn' : ''}`}>
                                        {getLessonStatusText(lesson.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Row 2 — Lớp đang dạy + Điểm danh */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Lớp đang dạy */}
                <Card
                    title="Lớp đang dạy"
                    icon={<FiBook />}
                    subtitle={`${teachingClasses.length} lớp được phân công`}
                    right={
                        <Pill tone="info">{teachingClasses.length} lớp</Pill>
                    }
                >
                    <div className="classes-grid">
                        {teachingClasses.map((cls) => (
                            <div key={cls.id} className="class-card-db">
                                <div className="class-header">
                                    <span className="class-name">{cls.className}</span>
                                    <span className={`pill pill--${cls.role === 'HOMEROOM' ? 'warn' : 'info'}`}>
                                        {cls.role === 'HOMEROOM' ? 'CN' : 'BM'}
                                    </span>
                                </div>
                                <div className="class-info">
                                    <div className="class-grade">{cls.grade}</div>
                                    <div className="class-subject">{cls.subject}</div>
                                </div>
                                <div className="class-footer">
                                    <span className="student-count">
                                        <FiUser size={14} />
                                        {cls.totalStudents} học sinh
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Tình trạng điểm danh */}
                <Card
                    title="Tình trạng điểm danh hôm nay"
                    icon={<FiCheckCircle />}
                    subtitle="Thống kê điểm danh các lớp giảng dạy"
                    right={
                        <Pill tone="good">{presentPercentage}% có mặt</Pill>
                    }
                >
                    <div className="attendance-summary">
                        <div className="attendance-main">
                            <div className="attendance-percentage">
                                <span className="percentage-value">{presentPercentage}%</span>
                                <span className="percentage-label">Tỷ lệ có mặt</span>
                            </div>
                            <div className="attendance-progress">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${presentPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="kpiFacts" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                            <div className="fact">
                                <div className="factIcon" style={{ color: 'var(--good)' }}><FiCheckCircle /></div>
                                <div>
                                    <div className="factLabel">Có mặt</div>
                                    <div className="factValue">{attendanceStats.present}</div>
                                </div>
                            </div>
                            <div className="fact">
                                <div className="factIcon" style={{ color: 'var(--bad)' }}><FiUsers /></div>
                                <div>
                                    <div className="factLabel">Vắng</div>
                                    <div className="factValue">{attendanceStats.absent}</div>
                                </div>
                            </div>
                            <div className="fact">
                                <div className="factIcon" style={{ color: 'var(--warn)' }}><FiClock /></div>
                                <div>
                                    <div className="factLabel">Đi muộn</div>
                                    <div className="factValue">{attendanceStats.late}</div>
                                </div>
                            </div>
                            <div className="fact">
                                <div className="factIcon" style={{ color: 'var(--info)' }}><FiUsers /></div>
                                <div>
                                    <div className="factLabel">Tổng số</div>
                                    <div className="factValue">{attendanceStats.totalStudents}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
