// AttendanceDetail.jsx - Điểm danh chi tiết
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft,
    FiClipboard,
    FiClock,
    FiUsers,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiEdit3,
    FiSearch,
    FiCalendar,
    FiHome,
    FiBook,
    FiUser,
    FiFileText,
    FiX,
    FiCheck,
} from 'react-icons/fi';
import './TeacherAttendance.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Table from '../../admin/components/ui/Table';

// Mock data - Chi tiết phiên điểm danh
const sessionData = {
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
    room: 'P.201',
    teacherName: 'Nguyễn Văn Toán',
};

// Mock data - Danh sách học sinh
const studentsData = [
    { id: 1, fullName: 'Nguyễn Văn An', studentCode: 'HS001', status: 'PRESENT', checkTime: '07:28', note: '' },
    { id: 2, fullName: 'Trần Thị Bình', studentCode: 'HS002', status: 'PRESENT', checkTime: '07:29', note: '' },
    { id: 3, fullName: 'Lê Văn Cường', studentCode: 'HS003', status: 'LATE', checkTime: '07:38', note: 'Đến muộn do kẹt xe' },
    { id: 4, fullName: 'Phạm Thị Dung', studentCode: 'HS004', status: 'ABSENT', checkTime: null, note: '' },
    { id: 5, fullName: 'Hoàng Văn Em', studentCode: 'HS005', status: 'PRESENT', checkTime: '07:27', note: '' },
    { id: 6, fullName: 'Ngô Thị Phương', studentCode: 'HS006', status: 'PRESENT', checkTime: '07:30', note: '' },
    { id: 7, fullName: 'Đỗ Văn Giang', studentCode: 'HS007', status: 'PRESENT', checkTime: '07:25', note: '' },
    { id: 8, fullName: 'Vũ Thị Hương', studentCode: 'HS008', status: 'EXCUSED', checkTime: null, note: 'Xin phép nghỉ ốm' },
    { id: 9, fullName: 'Bùi Văn Khoa', studentCode: 'HS009', status: 'PRESENT', checkTime: '07:29', note: '' },
    { id: 10, fullName: 'Đinh Thị Lan', studentCode: 'HS010', status: 'PRESENT', checkTime: '07:28', note: '' },
    { id: 11, fullName: 'Trương Văn Long', studentCode: 'HS011', status: 'PRESENT', checkTime: '07:26', note: '' },
    { id: 12, fullName: 'Lý Thị Mai', studentCode: 'HS012', status: 'PRESENT', checkTime: '07:30', note: '' },
];

// Mock data - Lịch sử thay đổi
const logsData = [
    {
        id: 1,
        studentName: 'Lê Văn Cường',
        action: 'OVERRIDE',
        oldStatus: 'ABSENT',
        newStatus: 'LATE',
        changedBy: 'Nguyễn Văn Toán',
        reason: 'Học sinh đến muộn do kẹt xe, có xác nhận từ phụ huynh',
        timestamp: '2026-02-01 07:45:00',
    },
    {
        id: 2,
        studentName: 'Vũ Thị Hương',
        action: 'OVERRIDE',
        oldStatus: 'ABSENT',
        newStatus: 'EXCUSED',
        changedBy: 'Nguyễn Văn Toán',
        reason: 'Phụ huynh gửi đơn xin phép nghỉ ốm',
        timestamp: '2026-02-01 07:40:00',
    },
];

const statusConfig = {
    PRESENT: { label: 'Có mặt', icon: '✓', className: 'status-badge--present', color: 'var(--good)' },
    ABSENT: { label: 'Vắng', icon: '✗', className: 'status-badge--absent', color: 'var(--bad)' },
    LATE: { label: 'Muộn', icon: '⏰', className: 'status-badge--late', color: 'var(--warn)' },
    EXCUSED: { label: 'Có phép', icon: '📋', className: 'status-badge--excused', color: 'var(--info)' },
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

function AttendanceDetail() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState(studentsData);
    const [logs, setLogs] = useState(logsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOverrideModal, setShowOverrideModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [overrideReason, setOverrideReason] = useState('');

    // Filter students
    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate statistics
    const presentCount = students.filter(s => s.status === 'PRESENT').length;
    const absentCount = students.filter(s => s.status === 'ABSENT').length;
    const lateCount = students.filter(s => s.status === 'LATE').length;
    const excusedCount = students.filter(s => s.status === 'EXCUSED').length;

    const handleBack = () => {
        navigate('/teacher/attendance');
    };

    const handleOpenOverrideModal = (student) => {
        setSelectedStudent(student);
        setNewStatus(student.status);
        setOverrideReason('');
        setShowOverrideModal(true);
    };

    const handleCloseOverrideModal = () => {
        setShowOverrideModal(false);
        setSelectedStudent(null);
        setNewStatus('');
        setOverrideReason('');
    };

    const handleOverride = () => {
        if (!selectedStudent || !newStatus || !overrideReason.trim()) return;

        // Update student status
        setStudents(prev => prev.map(s =>
            s.id === selectedStudent.id ? { ...s, status: newStatus } : s
        ));

        // Add log entry
        const newLog = {
            id: Date.now(),
            studentName: selectedStudent.fullName,
            action: 'OVERRIDE',
            oldStatus: selectedStudent.status,
            newStatus: newStatus,
            changedBy: sessionData.teacherName,
            reason: overrideReason,
            timestamp: new Date().toISOString(),
        };
        setLogs(prev => [newLog, ...prev]);

        handleCloseOverrideModal();
    };

    const handleNoteChange = (studentId, note) => {
        setStudents(prev => prev.map(s =>
            s.id === studentId ? { ...s, note } : s
        ));
    };

    const getInitials = (name) => {
        const parts = name.split(' ');
        return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0][0];
    };

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="attendance-header">
                    <button className="back-btn" onClick={handleBack}>
                        <FiArrowLeft />
                        Quay lại
                    </button>
                </div>

                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiClipboard />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Điểm danh chi tiết</div>
                        <div className="sub">Lớp {sessionData.className} • {sessionData.periodLabel} - {sessionData.subject} • {formatDate(sessionData.date)}</div>
                    </div>
                </div>
            </div>

            {/* Session Info Bar */}
            <div className="session-info-bar">
                <div className="session-info-item">
                    <FiCalendar />
                    <span>{formatDate(sessionData.date)}</span>
                </div>
                <div className="session-info-item">
                    <FiClock />
                    <span>{sessionData.startTime} - {sessionData.endTime}</span>
                </div>
                <div className="session-info-item">
                    <FiHome />
                    <span>{sessionData.room}</span>
                </div>
                <div className="session-info-item">
                    <FiBook />
                    <span>{sessionData.subject}</span>
                </div>
                <Pill tone="good">
                    <FiCheckCircle size={12} />
                    Hoàn thành
                </Pill>
            </div>

            {/* Statistics */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--good)' }}><FiCheckCircle /></div>
                    <div>
                        <div className="factValue">{presentCount}</div>
                        <div className="factLabel">Có mặt</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--bad)' }}><FiXCircle /></div>
                    <div>
                        <div className="factValue">{absentCount}</div>
                        <div className="factLabel">Vắng</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--warn)' }}><FiAlertCircle /></div>
                    <div>
                        <div className="factValue">{lateCount}</div>
                        <div className="factLabel">Muộn</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--info)' }}><FiFileText /></div>
                    <div>
                        <div className="factValue">{excusedCount}</div>
                        <div className="factLabel">Có phép</div>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <Card
                title={`Danh sách học sinh (${students.length})`}
                icon={<FiUsers />}
                subtitle="Nhấn vào nút Override để thay đổi trạng thái"
                right={
                    <div className="filter" style={{ minWidth: '200px' }}>
                        <input
                            className="textInput"
                            type="text"
                            placeholder="Tìm học sinh..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', height: '36px' }}
                        />
                    </div>
                }
            >
                <Table
                    columns={[
                        { key: 'stt', header: 'STT', width: '6%' },
                        { key: 'name', header: 'Học sinh', width: '25%' },
                        { key: 'code', header: 'Mã HS', width: '12%' },
                        { key: 'status', header: 'Trạng thái', width: '10%', align: 'center' },
                        { key: 'checkTime', header: 'Check-in', width: '10%', align: 'center' },
                        { key: 'note', header: 'Ghi chú', width: '28%' },
                        { key: 'actions', header: '', width: '6%', align: 'center' },
                    ]}
                    rows={filteredStudents.map((student, index) => {
                        const status = statusConfig[student.status];
                        return {
                            key: student.id,
                            stt: index + 1,
                            name: (
                                <div className="student-info">
                                    <div className="student-avatar">
                                        {getInitials(student.fullName)}
                                    </div>
                                    <div className="student-details">
                                        <span className="student-name">{student.fullName}</span>
                                    </div>
                                </div>
                            ),
                            code: (
                                <span style={{ fontSize: '13px', color: 'var(--ts)', fontWeight: 600 }}>
                                    {student.studentCode}
                                </span>
                            ),
                            status: (
                                <span className={`status-badge ${status.className}`} title={status.label}>
                                    {status.icon}
                                </span>
                            ),
                            checkTime: (
                                <span className="check-time">{student.checkTime || '---'}</span>
                            ),
                            note: (
                                <input
                                    className="note-input"
                                    type="text"
                                    placeholder="Ghi chú..."
                                    value={student.note}
                                    onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                />
                            ),
                            actions: (
                                <button
                                    className="override-btn"
                                    onClick={() => handleOpenOverrideModal(student)}
                                    title="Override trạng thái"
                                >
                                    <FiEdit3 size={16} />
                                </button>
                            ),
                        };
                    })}
                    emptyText="Không tìm thấy học sinh phù hợp."
                />
            </Card>

            {/* Change Logs */}
            {logs.length > 0 && (
                <Card
                    title="Lịch sử thay đổi"
                    icon={<FiFileText />}
                    subtitle="Các thay đổi trạng thái điểm danh"
                >
                    <div className="log-list">
                        {logs.map(log => (
                            <div key={log.id} className="log-item">
                                <div className="log-icon">
                                    <FiEdit3 />
                                </div>
                                <div className="log-content">
                                    <div className="log-text">
                                        <strong>{log.changedBy}</strong> đổi trạng thái của <strong>{log.studentName}</strong> từ{' '}
                                        <span style={{ color: statusConfig[log.oldStatus]?.color }}>
                                            {statusConfig[log.oldStatus]?.label}
                                        </span>
                                        {' '}→{' '}
                                        <span style={{ color: statusConfig[log.newStatus]?.color }}>
                                            {statusConfig[log.newStatus]?.label}
                                        </span>
                                    </div>
                                    <div className="log-reason">Lý do: {log.reason}</div>
                                    <div className="log-time">{formatTimestamp(log.timestamp)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Override Modal */}
            {showOverrideModal && selectedStudent && (
                <div className="modalBackdrop" onClick={handleCloseOverrideModal}>
                    <div className="modal" style={{ width: 'min(480px, 95%)' }} onClick={e => e.stopPropagation()}>
                        <div className="modalHead">
                            <div className="modalTitle">Override trạng thái điểm danh</div>
                            <button className="modalClose" onClick={handleCloseOverrideModal}>
                                <FiX />
                            </button>
                        </div>
                        <div className="modalBody">
                            <div className="override-modal-content">
                                {/* Student Info */}
                                <div className="override-student-info">
                                    <div className="student-avatar">
                                        {getInitials(selectedStudent.fullName)}
                                    </div>
                                    <div className="student-details">
                                        <span className="student-name">{selectedStudent.fullName}</span>
                                        <span className="student-code">{selectedStudent.studentCode}</span>
                                    </div>
                                    <span className={`status-badge ${statusConfig[selectedStudent.status].className}`}>
                                        {statusConfig[selectedStudent.status].icon}
                                    </span>
                                </div>

                                {/* Status Label */}
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ts)' }}>
                                    Chọn trạng thái mới:
                                </div>

                                {/* Status Options */}
                                <div className="status-options">
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                        <div
                                            key={key}
                                            className={`status-option ${newStatus === key ? 'selected' : ''}`}
                                            onClick={() => setNewStatus(key)}
                                        >
                                            <span className="status-option-icon" style={{ color: config.color }}>
                                                {config.icon}
                                            </span>
                                            <span className="status-option-label">{config.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Reason Label */}
                                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ts)' }}>
                                    Lý do thay đổi: <span style={{ color: 'var(--bad)' }}>*</span>
                                </div>

                                {/* Reason Textarea */}
                                <textarea
                                    className="reason-textarea"
                                    placeholder="Nhập lý do thay đổi trạng thái..."
                                    value={overrideReason}
                                    onChange={(e) => setOverrideReason(e.target.value)}
                                />

                                {/* Actions */}
                                <div className="modalActions">
                                    <button className="btn" onClick={handleCloseOverrideModal}>
                                        <FiX />
                                        Hủy
                                    </button>
                                    <button
                                        className="btn btn--primary"
                                        onClick={handleOverride}
                                        disabled={!overrideReason.trim() || newStatus === selectedStudent.status}
                                    >
                                        <FiCheck />
                                        Xác nhận
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendanceDetail;
