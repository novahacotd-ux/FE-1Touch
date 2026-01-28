import './TeacherDashboard.css';

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

function TeacherDashboard() {
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

    return (
        <div className="container-fluid container-dashboard-db" style={{ padding: '10px 20px' }}>
            {/* Welcome Banner */}
            <div className="top-box">
                <div className="top-box-left">
                    <div className="welcome-icon">
                        <i className="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div className="top-text">
                        <h4>
                            Xin chào, <span>Giáo viên!</span>
                        </h4>
                        <p>{formattedDate}</p>
                    </div>
                </div>
                <div className="top-box-right">
                    <div className="quick-stats">
                        <div className="quick-stat-item">
                            <span className="stat-number">{todayLessons.filter(l => l.subject).length}</span>
                            <span className="stat-label">Tiết hôm nay</span>
                        </div>
                        <div className="quick-stat-item">
                            <span className="stat-number">{teachingClasses.length}</span>
                            <span className="stat-label">Lớp giảng dạy</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tiết học hôm nay */}
            <div className="card-db dashboard-section">
                <div className="card-db-header">
                    <i className="fas fa-clock"></i>
                    <span>Tiết học hôm nay</span>
                </div>
                <div className="card-db-body">
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
                                                <span className="lesson-class">
                                                    <i className="fas fa-users"></i> {lesson.className}
                                                </span>
                                                <span className="lesson-room">
                                                    <i className="fas fa-door-open"></i> {lesson.room}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="lesson-free-text">Không có tiết</div>
                                    )}
                                </div>
                                <div className="lesson-status">
                                    <span className={`status-badge ${lesson.status}`}>
                                        {getLessonStatusText(lesson.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Layout for Classes and Attendance */}
            <div className="dashboard-grid">
                {/* Lớp đang dạy */}
                <div className="card-db dashboard-section">
                    <div className="card-db-header">
                        <i className="fas fa-school"></i>
                        <span>Lớp đang dạy</span>
                    </div>
                    <div className="card-db-body">
                        <div className="classes-grid">
                            {teachingClasses.map((cls) => (
                                <div key={cls.id} className="class-card-db">
                                    <div className="class-header">
                                        <span className="class-name">{cls.className}</span>
                                        <span className={`class-role ${cls.role.toLowerCase()}`}>
                                            {cls.role === 'HOMEROOM' ? 'CN' : 'BM'}
                                        </span>
                                    </div>
                                    <div className="class-info">
                                        <div className="class-grade">{cls.grade}</div>
                                        <div className="class-subject">{cls.subject}</div>
                                    </div>
                                    <div className="class-footer">
                                        <span className="student-count">
                                            <i className="fas fa-user-graduate"></i>
                                            {cls.totalStudents} học sinh
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tình trạng điểm danh */}
                <div className="card-db dashboard-section">
                    <div className="card-db-header">
                        <i className="fas fa-clipboard-check"></i>
                        <span>Tình trạng điểm danh hôm nay</span>
                    </div>
                    <div className="card-db-body">
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

                            <div className="attendance-details">
                                <div className="attendance-stat present">
                                    <div className="stat-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{attendanceStats.present}</span>
                                        <span className="stat-label">Có mặt</span>
                                    </div>
                                </div>

                                <div className="attendance-stat absent">
                                    <div className="stat-icon">
                                        <i className="fas fa-times-circle"></i>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{attendanceStats.absent}</span>
                                        <span className="stat-label">Vắng</span>
                                    </div>
                                </div>

                                <div className="attendance-stat late">
                                    <div className="stat-icon">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{attendanceStats.late}</span>
                                        <span className="stat-label">Đi muộn</span>
                                    </div>
                                </div>

                                <div className="attendance-stat total">
                                    <div className="stat-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{attendanceStats.totalStudents}</span>
                                        <span className="stat-label">Tổng số</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
