// ParentAnnouncements.jsx - Gửi cảnh báo phụ huynh
import { useState } from 'react';
import {
    FiBell, FiSend, FiClock, FiSearch, FiCheck,
    FiAlertTriangle, FiInfo, FiAlertCircle, FiUsers,
    FiCheckCircle, FiEye, FiUser, FiX
} from 'react-icons/fi';
import './ParentAnnouncements.css';

import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Table from '../../admin/components/ui/Table';
import Modal from '../../admin/components/ui/Modal';
import Pagination from '../../admin/components/ui/Pagination';

// ─── Mock Data ──────────────────────────────────────────

const mockStudents = [
    { id: 1, student_code: 'HS6B01', full_name: 'Nguyễn Văn An', gender: 'MALE', class_name: '6B', parent: { full_name: 'Nguyễn Văn Bình', phone: '0912345678' } },
    { id: 2, student_code: 'HS6B02', full_name: 'Trần Thị Bình', gender: 'FEMALE', class_name: '6B', parent: { full_name: 'Trần Văn Cường', phone: '0923456789' } },
    { id: 3, student_code: 'HS6B03', full_name: 'Lê Văn Cường', gender: 'MALE', class_name: '6B', parent: { full_name: 'Lê Thị Dung', phone: '0934567890' } },
    { id: 4, student_code: 'HS6B04', full_name: 'Phạm Thị Dung', gender: 'FEMALE', class_name: '6B', parent: { full_name: 'Phạm Văn Em', phone: '0945678901' } },
    { id: 5, student_code: 'HS6B05', full_name: 'Hoàng Văn Em', gender: 'MALE', class_name: '6B', parent: null },
    { id: 6, student_code: 'HS6B06', full_name: 'Ngô Thị Phương', gender: 'FEMALE', class_name: '6B', parent: { full_name: 'Ngô Văn Giang', phone: '0967890123' } },
    { id: 7, student_code: 'HS6B07', full_name: 'Đỗ Văn Giang', gender: 'MALE', class_name: '6B', parent: { full_name: 'Đỗ Thị Hương', phone: '0978901234' } },
    { id: 8, student_code: 'HS6B08', full_name: 'Vũ Thị Hương', gender: 'FEMALE', class_name: '6B', parent: { full_name: 'Vũ Văn Khoa', phone: '0989012345' } },
    { id: 9, student_code: 'HS6B09', full_name: 'Bùi Văn Khoa', gender: 'MALE', class_name: '6B', parent: { full_name: 'Bùi Thị Lan', phone: '0990123456' } },
    { id: 10, student_code: 'HS6B10', full_name: 'Đinh Thị Lan', gender: 'FEMALE', class_name: '6B', parent: { full_name: 'Đinh Văn Long', phone: '0901234567' } },
    { id: 11, student_code: 'HS6B11', full_name: 'Trương Văn Long', gender: 'MALE', class_name: '6B', parent: null },
    { id: 12, student_code: 'HS6B12', full_name: 'Lý Thị Mai', gender: 'FEMALE', class_name: '6B', parent: { full_name: 'Lý Văn Nam', phone: '0912340001' } },
];

const mockHistory = [
    {
        id: 1,
        title: 'Cảnh báo học sinh nghỉ học không phép',
        content: 'Kính gửi phụ huynh, con em quý vị đã nghỉ học ngày 25/02/2026 mà không có đơn xin phép. Kính mong phụ huynh xác nhận lý do.',
        type: 'WARNING',
        sent_at: '2026-02-25T08:30:00',
        recipients: [
            { student_name: 'Phạm Thị Dung', parent_name: 'Phạm Văn Em', is_read: true, read_at: '2026-02-25T09:15:00' },
            { student_name: 'Hoàng Văn Em', parent_name: null, is_read: false, read_at: null },
        ],
    },
    {
        id: 2,
        title: 'Thông báo họp phụ huynh học kỳ 2',
        content: 'Kính gửi phụ huynh lớp 6B, trường tổ chức họp phụ huynh học kỳ 2 vào ngày 01/03/2026 lúc 14:00 tại phòng họp A. Kính mong phụ huynh sắp xếp thời gian tham dự.',
        type: 'INFO',
        sent_at: '2026-02-20T14:00:00',
        recipients: [
            { student_name: 'Nguyễn Văn An', parent_name: 'Nguyễn Văn Bình', is_read: true, read_at: '2026-02-20T15:00:00' },
            { student_name: 'Trần Thị Bình', parent_name: 'Trần Văn Cường', is_read: true, read_at: '2026-02-20T16:30:00' },
            { student_name: 'Lê Văn Cường', parent_name: 'Lê Thị Dung', is_read: false, read_at: null },
            { student_name: 'Phạm Thị Dung', parent_name: 'Phạm Văn Em', is_read: true, read_at: '2026-02-20T18:00:00' },
        ],
    },
    {
        id: 3,
        title: 'Khẩn cấp: Học sinh bị thương trong giờ thể dục',
        content: 'Kính gửi phụ huynh, con em quý vị đã bị chấn thương nhẹ trong giờ thể dục. Đã được sơ cứu tại phòng y tế trường. Kính mong phụ huynh đến đón em sớm.',
        type: 'URGENT',
        sent_at: '2026-02-18T10:15:00',
        recipients: [
            { student_name: 'Đỗ Văn Giang', parent_name: 'Đỗ Thị Hương', is_read: true, read_at: '2026-02-18T10:20:00' },
        ],
    },
    {
        id: 4,
        title: 'Cảnh báo điểm kiểm tra thấp',
        content: 'Kính gửi phụ huynh, con em quý vị đạt điểm kiểm tra giữa kỳ dưới trung bình môn Toán. Kính mong phụ huynh phối hợp nhắc nhở em ôn tập.',
        type: 'WARNING',
        sent_at: '2026-02-15T16:00:00',
        recipients: [
            { student_name: 'Bùi Văn Khoa', parent_name: 'Bùi Thị Lan', is_read: true, read_at: '2026-02-15T17:30:00' },
            { student_name: 'Trương Văn Long', parent_name: null, is_read: false, read_at: null },
            { student_name: 'Đinh Thị Lan', parent_name: 'Đinh Văn Long', is_read: false, read_at: null },
        ],
    },
];

const typeConfig = {
    WARNING: { label: 'Cảnh báo', icon: <FiAlertTriangle size={14} />, className: 'warning', emoji: '⚠️' },
    INFO: { label: 'Thông tin', icon: <FiInfo size={14} />, className: 'info', emoji: 'ℹ️' },
    URGENT: { label: 'Khẩn cấp', icon: <FiAlertCircle size={14} />, className: 'urgent', emoji: '🚨' },
};

const getInitials = (name) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? parts[parts.length - 1][0] : name[0];
};

const formatDateTime = (str) => {
    const d = new Date(str);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
        d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const PAGE_SIZE = 5;

// ─── Detail Modal ───────────────────────────────────────

function DetailModal({ isOpen, notification, onClose }) {
    if (!isOpen || !notification) return null;

    const type = typeConfig[notification.type];
    const readCount = notification.recipients.filter(r => r.is_read).length;
    const totalCount = notification.recipients.length;

    return (
        <Modal title="Chi tiết thông báo" onClose={onClose}>
            <div className="detail-section">
                <div className="detail-label">Loại thông báo</div>
                <span className={`noti-type ${type.className}`}>{type.icon} {type.label}</span>
            </div>
            <div className="detail-section">
                <div className="detail-label">Tiêu đề</div>
                <div className="detail-content" style={{ fontWeight: 800 }}>{notification.title}</div>
            </div>
            <div className="detail-section">
                <div className="detail-label">Nội dung</div>
                <div className="detail-content">{notification.content}</div>
            </div>
            <div className="detail-section">
                <div className="detail-label">Thời gian gửi</div>
                <div className="detail-content">{formatDateTime(notification.sent_at)}</div>
            </div>
            <div className="detail-section">
                <div className="detail-label">Người nhận ({readCount}/{totalCount} đã đọc)</div>
                <div className="detail-recipients">
                    {notification.recipients.map((r, i) => (
                        <div key={i} className="detail-recipient">
                            <div>
                                <div className="detail-recipient-name">{r.student_name}</div>
                                <div className="detail-recipient-parent">
                                    PH: {r.parent_name || 'Chưa có thông tin'}
                                </div>
                            </div>
                            <span className={`read-status ${r.is_read ? 'all-read' : 'unread'}`}>
                                {r.is_read ? <><FiCheckCircle size={12} /> Đã đọc</> : 'Chưa đọc'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}

// ─── Main Component ─────────────────────────────────────

export default function ParentAnnouncements() {
    const [activeTab, setActiveTab] = useState('compose');

    // Compose state
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchPick, setSearchPick] = useState('');
    const [notiType, setNotiType] = useState('WARNING');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // History state
    const [history] = useState(mockHistory);
    const [searchHistory, setSearchHistory] = useState('');
    const [historyPage, setHistoryPage] = useState(1);
    const [detailModal, setDetailModal] = useState({ open: false, notification: null });

    // ─── Compose logic ──────────────────────────────────

    const filteredPick = mockStudents.filter(s =>
        s.full_name.toLowerCase().includes(searchPick.toLowerCase()) ||
        s.student_code.toLowerCase().includes(searchPick.toLowerCase())
    );

    const toggleStudent = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        const visibleIds = filteredPick.map(s => s.id);
        const allSelected = visibleIds.every(id => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedIds(prev => [...new Set([...prev, ...visibleIds])]);
        }
    };

    const handleSend = () => {
        if (selectedIds.length === 0 || !title.trim() || !content.trim()) return;
        const names = mockStudents.filter(s => selectedIds.includes(s.id)).map(s => s.full_name);
        setSuccessMsg(`Đã gửi thông báo "${title}" đến phụ huynh của ${names.length} học sinh.`);
        setSelectedIds([]);
        setTitle('');
        setContent('');
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // ─── History logic ──────────────────────────────────

    const filteredHistory = history.filter(h =>
        h.title.toLowerCase().includes(searchHistory.toLowerCase())
    );

    const totalHistoryPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
    const pagedHistory = filteredHistory.slice((historyPage - 1) * PAGE_SIZE, historyPage * PAGE_SIZE);

    // Stats
    const totalSent = history.length;
    const totalRecipients = history.reduce((sum, h) => sum + h.recipients.length, 0);
    const totalRead = history.reduce((sum, h) => sum + h.recipients.filter(r => r.is_read).length, 0);

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiBell />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Gửi cảnh báo phụ huynh</div>
                        <div className="sub">Lớp chủ nhiệm 6B • Năm học 2025-2026</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="announce-tabs">
                <button
                    className={`announce-tab ${activeTab === 'compose' ? 'active' : ''}`}
                    onClick={() => setActiveTab('compose')}
                >
                    <FiSend size={14} /> Gửi thông báo
                </button>
                <button
                    className={`announce-tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <FiClock size={14} /> Lịch sử ({history.length})
                </button>
            </div>

            {/* Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--mc)' }}><FiSend /></div>
                    <div>
                        <div className="factValue">{totalSent}</div>
                        <div className="factLabel">Đã gửi</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: '#6366f1' }}><FiUsers /></div>
                    <div>
                        <div className="factValue">{totalRecipients}</div>
                        <div className="factLabel">Người nhận</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--good)' }}><FiCheckCircle /></div>
                    <div>
                        <div className="factValue">{totalRead}/{totalRecipients}</div>
                        <div className="factLabel">Đã đọc</div>
                    </div>
                </div>
            </div>

            {/* ─── Tab: Compose ─────────────────────────── */}
            {activeTab === 'compose' && (
                <div className="compose-layout">
                    {/* Left: Student Picker */}
                    <Card
                        title={`Chọn học sinh (${selectedIds.length}/${mockStudents.length})`}
                        icon={<FiUsers />}
                        subtitle="Chọn học sinh để gửi thông báo"
                    >
                        <div className="picker-toolbar">
                            <input
                                className="textInput"
                                type="text"
                                placeholder="Tìm học sinh..."
                                value={searchPick}
                                onChange={e => setSearchPick(e.target.value)}
                                style={{ height: '36px' }}
                            />
                            <button
                                className={`select-all-btn ${selectedIds.length > 0 ? 'has-selection' : ''}`}
                                onClick={toggleAll}
                            >
                                {filteredPick.every(s => selectedIds.includes(s.id)) ? 'Bỏ chọn' : 'Chọn tất cả'}
                            </button>
                        </div>
                        <div className="student-pick-list">
                            {filteredPick.map(s => (
                                <div
                                    key={s.id}
                                    className={`student-pick-item ${selectedIds.includes(s.id) ? 'selected' : ''}`}
                                    onClick={() => toggleStudent(s.id)}
                                >
                                    <div className="pick-checkbox">
                                        <FiCheck size={12} />
                                    </div>
                                    <div className={`pick-avatar ${s.gender.toLowerCase()}`}>
                                        {getInitials(s.full_name)}
                                    </div>
                                    <div className="pick-info">
                                        <div className="pick-name">{s.full_name}</div>
                                        <div className="pick-code">{s.student_code}</div>
                                    </div>
                                    {s.parent ? (
                                        <span className="pick-parent-tag">
                                            <FiUser size={10} /> {s.parent.full_name.split(' ').pop()}
                                        </span>
                                    ) : (
                                        <span className="no-parent-tag">Chưa có PH</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Right: Compose Form */}
                    <Card
                        title="Soạn thông báo"
                        icon={<FiSend />}
                        subtitle="Soạn nội dung gửi đến phụ huynh"
                    >
                        {successMsg && (
                            <div className="send-success">
                                <FiCheckCircle size={18} />
                                {successMsg}
                            </div>
                        )}
                        <div className="compose-form">
                            {/* Type selection */}
                            <div>
                                <div className="form-label" style={{ marginBottom: '8px' }}>Loại thông báo</div>
                                <div className="type-options">
                                    {Object.entries(typeConfig).map(([key, cfg]) => (
                                        <div
                                            key={key}
                                            className={`type-option ${notiType === key ? `active ${cfg.className}` : ''}`}
                                            onClick={() => setNotiType(key)}
                                        >
                                            <div className="type-icon">{cfg.emoji}</div>
                                            <div className="type-label">{cfg.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <div className="form-label" style={{ marginBottom: '6px' }}>Tiêu đề</div>
                                <input
                                    className="form-input"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề thông báo..."
                                    style={{ width: '100%' }}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <div className="form-label" style={{ marginBottom: '6px' }}>Nội dung</div>
                                <textarea
                                    className="compose-textarea"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Kính gửi phụ huynh..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="compose-actions">
                                {selectedIds.length > 0 && (
                                    <div className="selected-count">
                                        <FiUsers size={14} />
                                        {selectedIds.length} học sinh được chọn
                                    </div>
                                )}
                                <button
                                    className="btn btn--primary"
                                    disabled={selectedIds.length === 0 || !title.trim() || !content.trim()}
                                    onClick={handleSend}
                                >
                                    <FiSend size={14} />
                                    {selectedIds.length <= 1 ? 'Gửi đơn' : `Gửi hàng loạt (${selectedIds.length})`}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* ─── Tab: History ─────────────────────────── */}
            {activeTab === 'history' && (
                <Card
                    title={`Lịch sử gửi thông báo (${filteredHistory.length})`}
                    icon={<FiClock />}
                    subtitle="Danh sách thông báo đã gửi"
                    right={
                        <div className="filter" style={{ minWidth: '220px' }}>
                            <input
                                className="textInput"
                                type="text"
                                placeholder="Tìm theo tiêu đề..."
                                value={searchHistory}
                                onChange={e => { setSearchHistory(e.target.value); setHistoryPage(1); }}
                                style={{ width: '100%', height: '36px' }}
                            />
                        </div>
                    }
                >
                    <Table
                        columns={[
                            { key: 'time', header: 'Thời gian', width: '16%' },
                            { key: 'title', header: 'Tiêu đề', width: '32%' },
                            { key: 'type', header: 'Loại', width: '12%' },
                            { key: 'recipients', header: 'Người nhận', width: '12%', align: 'center' },
                            { key: 'readStatus', header: 'Đã đọc', width: '16%' },
                            { key: 'actions', header: '', width: '8%', align: 'center' },
                        ]}
                        rows={pagedHistory.map(h => {
                            const type = typeConfig[h.type];
                            const readCount = h.recipients.filter(r => r.is_read).length;
                            const total = h.recipients.length;
                            const readPct = total > 0 ? readCount / total : 0;
                            const readClass = readPct === 1 ? 'all-read' : readPct > 0 ? 'partial' : 'unread';

                            return {
                                key: h.id,
                                time: (
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ts)' }}>
                                        {formatDateTime(h.sent_at)}
                                    </span>
                                ),
                                title: (
                                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--tc)' }}>
                                        {h.title}
                                    </span>
                                ),
                                type: (
                                    <span className={`noti-type ${type.className}`}>
                                        {type.icon} {type.label}
                                    </span>
                                ),
                                recipients: (
                                    <Pill tone="info">{total} người</Pill>
                                ),
                                readStatus: (
                                    <span className={`read-status ${readClass}`}>
                                        <FiCheckCircle size={12} />
                                        {readCount}/{total} đã đọc
                                    </span>
                                ),
                                actions: (
                                    <button
                                        className="action-trigger"
                                        onClick={() => setDetailModal({ open: true, notification: h })}
                                        title="Xem chi tiết"
                                    >
                                        <FiEye size={16} />
                                    </button>
                                ),
                            };
                        })}
                        emptyText="Chưa có thông báo nào."
                    />
                    {totalHistoryPages > 1 && (
                        <div style={{ marginTop: '14px' }}>
                            <Pagination page={historyPage} totalPages={totalHistoryPages} onPageChange={setHistoryPage} />
                        </div>
                    )}
                </Card>
            )}

            {/* Detail Modal */}
            <DetailModal
                isOpen={detailModal.open}
                notification={detailModal.notification}
                onClose={() => setDetailModal({ open: false, notification: null })}
            />
        </div>
    );
}
