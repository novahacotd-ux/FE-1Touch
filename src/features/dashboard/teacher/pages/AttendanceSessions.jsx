// AttendanceSessions.jsx - Danh sách phiên điểm danh
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiClipboard,
    FiSearch,
    FiClock,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiArrowRight,
    FiCalendar,
    FiBook,
    FiHome,
    FiAlertCircle,
    FiPlay,
} from 'react-icons/fi';
import './TeacherAttendance.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Select from '../../admin/components/ui/Select';

// Mock data - Phiên điểm danh
const attendanceSessionsData = [
    {
        id: 1,
        className: '6A',
        classId: 1,
        subject: 'Toán học',
        period: 1,
        periodLabel: 'Tiết 1',
        date: '2026-02-01',
        startTime: '07:30',
        endTime: '08:15',
        status: 'COMPLETED',
        totalStudents: 35,
        presentCount: 33,
        absentCount: 2,
        lateCount: 0,
        excusedCount: 0,
        room: 'P.201',
    },
    {
        id: 2,
        className: '6B',
        classId: 2,
        subject: 'Toán học',
        period: 2,
        periodLabel: 'Tiết 2',
        date: '2026-02-01',
        startTime: '08:20',
        endTime: '09:05',
        status: 'IN_PROGRESS',
        totalStudents: 32,
        presentCount: 30,
        absentCount: 1,
        lateCount: 1,
        excusedCount: 0,
        room: 'P.202',
    },
    {
        id: 3,
        className: '7A',
        classId: 3,
        subject: 'Toán học',
        period: 3,
        periodLabel: 'Tiết 3',
        date: '2026-02-01',
        startTime: '09:20',
        endTime: '10:05',
        status: 'PENDING',
        totalStudents: 38,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
        room: 'P.301',
    },
    {
        id: 4,
        className: '7B',
        classId: 4,
        subject: 'Toán học',
        period: 4,
        periodLabel: 'Tiết 4',
        date: '2026-02-01',
        startTime: '10:10',
        endTime: '10:55',
        status: 'PENDING',
        totalStudents: 36,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
        room: 'P.302',
    },
    {
        id: 5,
        className: '8A',
        classId: 5,
        subject: 'Toán học',
        period: 1,
        periodLabel: 'Tiết 1',
        date: '2026-01-31',
        startTime: '07:30',
        endTime: '08:15',
        status: 'COMPLETED',
        totalStudents: 40,
        presentCount: 38,
        absentCount: 1,
        lateCount: 1,
        excusedCount: 0,
        room: 'P.401',
    },
    {
        id: 6,
        className: '8B',
        classId: 6,
        subject: 'Toán học',
        period: 2,
        periodLabel: 'Tiết 2',
        date: '2026-01-31',
        startTime: '08:20',
        endTime: '09:05',
        status: 'COMPLETED',
        totalStudents: 38,
        presentCount: 37,
        absentCount: 0,
        lateCount: 1,
        excusedCount: 0,
        room: 'P.402',
    },
];

const classOptions = [
    { value: 'all', label: 'Tất cả lớp' },
    { value: '1', label: 'Lớp 6A' },
    { value: '2', label: 'Lớp 6B' },
    { value: '3', label: 'Lớp 7A' },
    { value: '4', label: 'Lớp 7B' },
    { value: '5', label: 'Lớp 8A' },
    { value: '6', label: 'Lớp 8B' },
];

const periodOptions = [
    { value: 'all', label: 'Tất cả tiết' },
    { value: '1', label: 'Tiết 1' },
    { value: '2', label: 'Tiết 2' },
    { value: '3', label: 'Tiết 3' },
    { value: '4', label: 'Tiết 4' },
    { value: '5', label: 'Tiết 5' },
];

const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'COMPLETED', label: 'Đã hoàn thành' },
    { value: 'IN_PROGRESS', label: 'Đang tiến hành' },
    { value: 'PENDING', label: 'Chưa bắt đầu' },
];

const getStatusInfo = (status) => {
    switch (status) {
        case 'COMPLETED':
            return { label: 'Hoàn thành', icon: <FiCheckCircle />, className: 'session-status--completed' };
        case 'IN_PROGRESS':
            return { label: 'Đang tiến hành', icon: <FiPlay />, className: 'session-status--in-progress' };
        case 'PENDING':
            return { label: 'Chưa bắt đầu', icon: <FiAlertCircle />, className: 'session-status--pending' };
        default:
            return { label: 'Không xác định', icon: <FiAlertCircle />, className: '' };
    }
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
};

function AttendanceSessions() {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter sessions
    const filteredSessions = attendanceSessionsData.filter(session => {
        const classMatch = selectedClass === 'all' || session.classId === Number(selectedClass);
        const periodMatch = selectedPeriod === 'all' || session.period === Number(selectedPeriod);
        const statusMatch = selectedStatus === 'all' || session.status === selectedStatus;
        const searchMatch = searchQuery === '' ||
            session.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return classMatch && periodMatch && statusMatch && searchMatch;
    });

    // Calculate statistics
    const totalSessions = attendanceSessionsData.length;
    const completedCount = attendanceSessionsData.filter(s => s.status === 'COMPLETED').length;
    const pendingCount = attendanceSessionsData.filter(s => s.status === 'PENDING' || s.status === 'IN_PROGRESS').length;
    const totalPresent = attendanceSessionsData.reduce((sum, s) => sum + s.presentCount, 0);
    const totalStudents = attendanceSessionsData.reduce((sum, s) => sum + s.totalStudents, 0);
    const attendanceRate = totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;

    const handleSessionClick = (sessionId) => {
        navigate(`/teacher/attendance/${sessionId}`);
    };

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiClipboard />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Điểm danh</div>
                        <div className="sub">Năm học 2025-2026 • Học kỳ 2</div>
                    </div>
                </div>

                <div className="admin-dash__filters">
                    <div className="filterRow" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
                        <div className="filter">
                            <div className="filterLabel">
                                <FiSearch />
                            </div>
                            <input
                                className="textInput"
                                type="text"
                                placeholder="Tìm kiếm lớp, môn học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className="filter">
                            <div className="filterLabel">
                                <FiHome />
                            </div>
                            <Select
                                value={selectedClass}
                                onChange={setSelectedClass}
                                options={classOptions}
                            />
                        </div>

                        <div className="filter">
                            <div className="filterLabel">
                                <FiClock />
                            </div>
                            <Select
                                value={selectedPeriod}
                                onChange={setSelectedPeriod}
                                options={periodOptions}
                            />
                        </div>

                        <div className="filter">
                            <div className="filterLabel">
                                <FiCheckCircle />
                            </div>
                            <Select
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                options={statusOptions}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--mc)' }}><FiClipboard /></div>
                    <div>
                        <div className="factValue">{totalSessions}</div>
                        <div className="factLabel">Tổng phiên</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--good)' }}><FiCheckCircle /></div>
                    <div>
                        <div className="factValue">{completedCount}</div>
                        <div className="factLabel">Hoàn thành</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--warn)' }}><FiAlertCircle /></div>
                    <div>
                        <div className="factValue">{pendingCount}</div>
                        <div className="factLabel">Chưa hoàn thành</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--info)' }}><FiUsers /></div>
                    <div>
                        <div className="factValue">{attendanceRate}%</div>
                        <div className="factLabel">Tỷ lệ có mặt</div>
                    </div>
                </div>
            </div>

            {/* Sessions Grid */}
            <Card
                title={`Danh sách phiên điểm danh (${filteredSessions.length})`}
                icon={<FiCalendar />}
                subtitle="Nhấn vào phiên để xem chi tiết"
                right={<Pill tone="info">{filteredSessions.length} phiên</Pill>}
            >
                {filteredSessions.length > 0 ? (
                    <div className="sessions-grid">
                        {filteredSessions.map(session => {
                            const statusInfo = getStatusInfo(session.status);
                            return (
                                <div
                                    key={session.id}
                                    className="session-card"
                                    onClick={() => handleSessionClick(session.id)}
                                >
                                    <div className="session-card-header">
                                        <div className="session-class-info">
                                            <span className="session-class-name">Lớp {session.className}</span>
                                            <span className="session-subject">{session.subject}</span>
                                        </div>
                                        <span className="session-period">
                                            <FiBook size={12} />
                                            {session.periodLabel}
                                        </span>
                                    </div>

                                    <div className="session-card-body">
                                        <div className="session-time">
                                            <FiCalendar />
                                            <span>{formatDate(session.date)}</span>
                                        </div>
                                        <div className="session-time">
                                            <FiClock />
                                            <span>{session.startTime} - {session.endTime}</span>
                                        </div>
                                        <div className="session-time">
                                            <FiHome />
                                            <span>{session.room}</span>
                                        </div>

                                        {session.status !== 'PENDING' && (
                                            <div className="session-stats">
                                                <span className="session-stat session-stat--present">
                                                    <FiCheckCircle size={14} />
                                                    {session.presentCount} có mặt
                                                </span>
                                                <span className="session-stat session-stat--absent">
                                                    <FiXCircle size={14} />
                                                    {session.absentCount} vắng
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="session-card-footer">
                                        <span className={`session-status ${statusInfo.className}`}>
                                            {statusInfo.icon}
                                            {statusInfo.label}
                                        </span>
                                        <span className="session-action">
                                            {session.status === 'PENDING' ? 'Bắt đầu' : 'Chi tiết'}
                                            <FiArrowRight />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FiSearch />
                        <p>Không tìm thấy phiên điểm danh phù hợp với bộ lọc</p>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default AttendanceSessions;
