// StudentManagement.jsx - Quản lý học sinh (GVCN)
import { useState, useRef, useEffect } from 'react';
import {
    FiUsers, FiSearch, FiPlus, FiEdit2, FiShuffle,
    FiShield, FiEye, FiMoreVertical, FiUser,
    FiPhone, FiMessageCircle, FiX, FiCheck,
    FiUserPlus, FiUserCheck
} from 'react-icons/fi';
import './StudentManagement.css';

import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Table from '../../admin/components/ui/Table';
import Select from '../../admin/components/ui/Select';
import Modal from '../../admin/components/ui/Modal';
import Pagination from '../../admin/components/ui/Pagination';

// ─── Mock Data ──────────────────────────────────────────

const studentRoles = [
    { id: 1, role_code: 'LOP_TRUONG', role_name: 'Lớp trưởng', description: 'Lớp trưởng quản lý lớp', is_active: true },
    { id: 2, role_code: 'LOP_PHO', role_name: 'Lớp phó', description: 'Lớp phó hỗ trợ lớp trưởng', is_active: true },
    { id: 3, role_code: 'TO_TRUONG', role_name: 'Tổ trưởng', description: 'Tổ trưởng quản lý tổ học tập', is_active: true },
    { id: 4, role_code: 'BI_THU', role_name: 'Bí thư', description: 'Bí thư chi đoàn', is_active: true },
];

const availableClasses = [
    { id: 1, class_name: '6A', grade: 'Khối 6' },
    { id: 2, class_name: '6B', grade: 'Khối 6' },
    { id: 3, class_name: '7A', grade: 'Khối 7' },
    { id: 4, class_name: '7B', grade: 'Khối 7' },
    { id: 5, class_name: '8A', grade: 'Khối 8' },
    { id: 6, class_name: '8B', grade: 'Khối 8' },
];

const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const maleMiddleNames = ['Văn', 'Đức', 'Minh', 'Quang', 'Hữu', 'Thành'];
const femaleMiddleNames = ['Thị', 'Ngọc', 'Phương', 'Thanh', 'Hoàng'];
const maleFirstNames = ['An', 'Bảo', 'Cường', 'Dũng', 'Đức', 'Hải', 'Hùng', 'Khang', 'Minh', 'Nam', 'Phúc', 'Quân', 'Sơn', 'Thắng', 'Tuấn', 'Vinh'];
const femaleFirstNames = ['An', 'Bình', 'Chi', 'Diệu', 'Hà', 'Hạnh', 'Lan', 'Mai', 'Ngọc', 'Thảo', 'Trang', 'Vy', 'Yến', 'Linh', 'Hương', 'Thu'];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const generateMockStudents = () => {
    const students = [];
    const total = 32;
    const maleCount = 16;

    for (let i = 1; i <= total; i++) {
        const isMale = i <= maleCount;
        const gender = isMale ? 'MALE' : 'FEMALE';
        const lastName = pick(lastNames);
        const middleName = isMale ? pick(maleMiddleNames) : pick(femaleMiddleNames);
        const firstName = isMale ? pick(maleFirstNames) : pick(femaleFirstNames);
        const fullName = `${lastName} ${middleName} ${firstName}`;
        const roleAssign = i === 1 ? studentRoles[0] : i === 2 ? studentRoles[1] : i === 3 ? studentRoles[3] : (i <= 7 ? studentRoles[2] : null);
        const hasFingerprint = Math.random() > 0.3;

        students.push({
            id: i,
            student_code: `HS6B${String(i).padStart(2, '0')}`,
            full_name: fullName,
            gender,
            birthdate: `${2012 + Math.floor(Math.random() * 2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            class_id: 2,
            class_name: '6B',
            student_role_id: roleAssign ? roleAssign.id : null,
            student_role: roleAssign,
            fingerprint_id: hasFingerprint ? `FP-${1000 + i}` : null,
            status: i <= 30 ? 'ACTIVE' : (i === 31 ? 'TRANSFERRED' : 'INACTIVE'),
            parents: i % 5 === 0 ? [] : [
                {
                    id: 100 + i,
                    full_name: `${lastName} ${isMale ? pick(maleMiddleNames) : pick(femaleMiddleNames)} ${pick(isMale ? maleFirstNames : femaleFirstNames)}`,
                    phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
                    zalo_id: Math.random() > 0.3 ? `zalo_${1000 + i}` : null,
                }
            ],
        });
    }
    return students;
};

const mockStudents = generateMockStudents();

// ─── Filter Options ─────────────────────────────────────

const genderOptions = [
    { value: 'all', label: 'Tất cả giới tính' },
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
];

const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'ACTIVE', label: 'Đang học' },
    { value: 'TRANSFERRED', label: 'Chuyển lớp' },
    { value: 'INACTIVE', label: 'Nghỉ học' },
];

// ─── Helpers ────────────────────────────────────────────

const getInitials = (name) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? parts[parts.length - 1][0] : name[0];
};

const getRoleBadgeClass = (roleCode) => {
    const map = {
        'LOP_TRUONG': 'lop-truong',
        'LOP_PHO': 'lop-pho',
        'TO_TRUONG': 'to-truong',
        'BI_THU': 'bi-thu',
    };
    return map[roleCode] || 'default';
};

const statusMap = {
    'ACTIVE': { label: 'Đang học', tone: 'good' },
    'TRANSFERRED': { label: 'Chuyển lớp', tone: 'warn' },
    'INACTIVE': { label: 'Nghỉ học', tone: 'bad' },
};

const genderMap = {
    'MALE': { label: 'Nam', tone: 'info' },
    'FEMALE': { label: 'Nữ', tone: 'warn' },
    'OTHER': { label: 'Khác', tone: 'muted' },
};

const PAGE_SIZE = 10;

// ─── Action Dropdown ────────────────────────────────────

function ActionDropdown({ student, onEdit, onTransfer, onAssignRole, onFingerprint, onViewParent }) {
    const [open, setOpen] = useState(false);
    const [flipUp, setFlipUp] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleToggle = () => {
        if (!open && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setFlipUp(spaceBelow < 280);
        }
        setOpen(!open);
    };

    const items = [
        { icon: <FiEdit2 size={14} />, label: 'Sửa thông tin', action: () => { onEdit(student); setOpen(false); } },
        { icon: <FiShuffle size={14} />, label: 'Chuyển lớp', action: () => { onTransfer(student); setOpen(false); } },
        { icon: <FiShield size={14} />, label: 'Gán vai trò', action: () => { onAssignRole(student); setOpen(false); } },
        { icon: <FiUserCheck size={14} />, label: 'Gán vân tay', action: () => { onFingerprint(student); setOpen(false); } },
        { icon: <FiEye size={14} />, label: 'Xem phụ huynh', action: () => { onViewParent(student); setOpen(false); } },
    ];

    return (
        <div className="action-cell" ref={ref}>
            <button className="action-trigger" onClick={handleToggle}>
                <FiMoreVertical size={16} />
            </button>
            <div className={`action-menu ${open ? 'is-open' : ''} ${flipUp ? 'flip-up' : ''}`}>
                {items.map((item, i) => (
                    <button key={i} className="action-item" onClick={item.action}>
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ─── Add/Edit Modal ─────────────────────────────────────

function StudentFormModal({ isOpen, student, onClose, onSave }) {
    const isEdit = !!student;
    const [form, setForm] = useState({
        full_name: '', student_code: '', gender: 'MALE', birthdate: '', status: 'ACTIVE',
    });

    useEffect(() => {
        if (student) {
            setForm({
                full_name: student.full_name,
                student_code: student.student_code,
                gender: student.gender,
                birthdate: student.birthdate,
                status: student.status,
            });
        } else {
            setForm({ full_name: '', student_code: '', gender: 'MALE', birthdate: '', status: 'ACTIVE' });
        }
    }, [student]);

    if (!isOpen) return null;

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    return (
        <Modal title={isEdit ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'} onClose={onClose}>
            <div className="form-grid">
                <div className="form-group full">
                    <label className="form-label">Họ và tên</label>
                    <input className="form-input" value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} placeholder="Nguyễn Văn An" />
                </div>
                <div className="form-group">
                    <label className="form-label">Mã học sinh</label>
                    <input className="form-input" value={form.student_code} onChange={e => handleChange('student_code', e.target.value)} placeholder="HS6B01" disabled={isEdit} />
                </div>
                <div className="form-group">
                    <label className="form-label">Giới tính</label>
                    <select className="form-select" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Ngày sinh</label>
                    <input className="form-input" type="date" value={form.birthdate} onChange={e => handleChange('birthdate', e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                        <option value="ACTIVE">Đang học</option>
                        <option value="TRANSFERRED">Chuyển lớp</option>
                        <option value="INACTIVE">Nghỉ học</option>
                    </select>
                </div>
            </div>
            <div className="modalActions">
                <button className="btn btn--ghost" onClick={onClose}>Hủy</button>
                <button className="btn btn--primary" onClick={() => { onSave(form); onClose(); }}>
                    <FiCheck size={16} />
                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </div>
        </Modal>
    );
}

// ─── Transfer Class Modal ───────────────────────────────

function TransferClassModal({ isOpen, student, onClose, onSave }) {
    const [targetClassId, setTargetClassId] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        setTargetClassId('');
        setReason('');
    }, [student]);

    if (!isOpen || !student) return null;

    return (
        <Modal title="Chuyển lớp học sinh" onClose={onClose}>
            <div className="transfer-info">
                <div className="info-icon"><FiShuffle size={18} /></div>
                <div className="info-text">
                    Chuyển <span>{student.full_name}</span> từ lớp <span>{student.class_name}</span>
                </div>
            </div>
            <div className="form-grid">
                <div className="form-group full">
                    <label className="form-label">Lớp đích</label>
                    <select className="form-select" value={targetClassId} onChange={e => setTargetClassId(e.target.value)}>
                        <option value="">-- Chọn lớp --</option>
                        {availableClasses.filter(c => c.id !== student.class_id).map(c => (
                            <option key={c.id} value={c.id}>{c.class_name} ({c.grade})</option>
                        ))}
                    </select>
                </div>
                <div className="form-group full">
                    <label className="form-label">Lý do chuyển lớp</label>
                    <textarea className="form-textarea" value={reason} onChange={e => setReason(e.target.value)} placeholder="Nhập lý do chuyển lớp..." />
                </div>
            </div>
            <div className="modalActions">
                <button className="btn btn--ghost" onClick={onClose}>Hủy</button>
                <button className="btn btn--primary" onClick={() => { onSave({ studentId: student.id, targetClassId, reason }); onClose(); }} disabled={!targetClassId}>
                    <FiCheck size={16} />
                    Xác nhận chuyển
                </button>
            </div>
        </Modal>
    );
}

// ─── Assign Role Modal ──────────────────────────────────

function AssignRoleModal({ isOpen, student, onClose, onSave }) {
    const [selectedRoleId, setSelectedRoleId] = useState('');

    useEffect(() => {
        if (student) {
            setSelectedRoleId(student.student_role_id ? String(student.student_role_id) : '');
        }
    }, [student]);

    if (!isOpen || !student) return null;

    return (
        <Modal title="Gán vai trò học sinh" onClose={onClose} className="modal--confirm">
            <div className="transfer-info">
                <div className="info-icon"><FiShield size={18} /></div>
                <div className="info-text">
                    Gán vai trò cho <span>{student.full_name}</span>
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Vai trò</label>
                <select className="form-select" value={selectedRoleId} onChange={e => setSelectedRoleId(e.target.value)}>
                    <option value="">Không có vai trò</option>
                    {studentRoles.filter(r => r.is_active).map(r => (
                        <option key={r.id} value={r.id}>{r.role_name} — {r.description}</option>
                    ))}
                </select>
            </div>
            <div className="modalActions">
                <button className="btn btn--ghost" onClick={onClose}>Hủy</button>
                <button className="btn btn--primary" onClick={() => { onSave({ studentId: student.id, roleId: selectedRoleId || null }); onClose(); }}>
                    <FiCheck size={16} />
                    Lưu vai trò
                </button>
            </div>
        </Modal>
    );
}

// ─── Fingerprint Modal ──────────────────────────────────

function FingerprintModal({ isOpen, student, onClose }) {
    if (!isOpen || !student) return null;

    const hasFp = !!student.fingerprint_id;

    return (
        <Modal title="Quản lý vân tay" onClose={onClose} className="modal--confirm">
            <div className="fp-modal-status">
                <div className={`fp-modal-icon ${hasFp ? 'has-fp' : 'no-fp'}`}>
                    <FiUserCheck size={32} />
                </div>
                <div className="fp-modal-label">{student.full_name}</div>
                <div className="fp-modal-sub">
                    {hasFp
                        ? `Đã gán vân tay: ${student.fingerprint_id}`
                        : 'Chưa gán vân tay cho học sinh này'}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {hasFp ? (
                        <>
                            <button className="btn btn--primary">
                                <FiUserCheck size={16} /> Quét lại
                            </button>
                            <button className="btn" style={{ borderColor: 'var(--bad)', color: 'var(--bad)' }}>
                                <FiX size={16} /> Xóa vân tay
                            </button>
                        </>
                    ) : (
                        <button className="btn btn--primary">
                            <FiUserPlus size={16} /> Quét vân tay
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

// ─── View Parent Modal ──────────────────────────────────

function ViewParentModal({ isOpen, student, onClose }) {
    if (!isOpen || !student) return null;

    const parents = student.parents || [];

    return (
        <Modal title={`Phụ huynh — ${student.full_name}`} onClose={onClose}>
            {parents.length > 0 ? (
                parents.map(p => (
                    <div key={p.id} className="parent-info-card">
                        <div className="parent-avatar">{getInitials(p.full_name)}</div>
                        <div className="parent-details">
                            <div className="parent-name">{p.full_name}</div>
                            <div className="parent-contact">
                                <span className="parent-contact-item">
                                    <FiPhone size={12} /> {p.phone}
                                </span>
                                {p.zalo_id && (
                                    <span className="parent-contact-item">
                                        <FiMessageCircle size={12} /> Zalo
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-parent-box">
                    <FiUser size={32} />
                    <p>Chưa có thông tin phụ huynh</p>
                </div>
            )}
        </Modal>
    );
}

// ─── Main Component ─────────────────────────────────────

export default function StudentManagement() {
    const [students] = useState(mockStudents);
    const [search, setSearch] = useState('');
    const [filterGender, setFilterGender] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1);

    // Modal states
    const [formModal, setFormModal] = useState({ open: false, student: null });
    const [transferModal, setTransferModal] = useState({ open: false, student: null });
    const [roleModal, setRoleModal] = useState({ open: false, student: null });
    const [fpModal, setFpModal] = useState({ open: false, student: null });
    const [parentModal, setParentModal] = useState({ open: false, student: null });

    // Filter
    const filtered = students.filter(s => {
        const searchMatch = search === '' ||
            s.full_name.toLowerCase().includes(search.toLowerCase()) ||
            s.student_code.toLowerCase().includes(search.toLowerCase());
        const genderMatch = filterGender === 'all' || s.gender === filterGender;
        const statusMatch = filterStatus === 'all' || s.status === filterStatus;
        return searchMatch && genderMatch && statusMatch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Stats
    const totalStudents = students.length;
    const maleCount = students.filter(s => s.gender === 'MALE').length;
    const femaleCount = students.filter(s => s.gender === 'FEMALE').length;
    const fpCount = students.filter(s => !!s.fingerprint_id).length;

    return (
        <div className="admin-dash student-mgmt">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge">
                        <FiUsers />
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Quản lý học sinh</div>
                        <div className="sub">Lớp chủ nhiệm 6B • Năm học 2025-2026</div>
                    </div>
                </div>
                <div className="admin-dash__filters">
                    <button className="btn btn--primary" onClick={() => setFormModal({ open: true, student: null })}>
                        <FiPlus size={16} /> Thêm học sinh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="filterRow" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', alignItems: 'flex-end' }}>
                <div className="filter">
                    <div className="filterLabel"><FiSearch /> Tìm kiếm</div>
                    <input
                        className="textInput"
                        type="text"
                        placeholder="Tìm theo tên hoặc mã HS..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="filter">
                    <div className="filterLabel"><FiUser /> Giới tính</div>
                    <Select value={filterGender} onChange={v => { setFilterGender(v); setPage(1); }} options={genderOptions} />
                </div>
                <div className="filter">
                    <div className="filterLabel"><FiShield /> Trạng thái</div>
                    <Select value={filterStatus} onChange={v => { setFilterStatus(v); setPage(1); }} options={statusOptions} />
                </div>
            </div>

            {/* Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--mc)' }}><FiUsers /></div>
                    <div>
                        <div className="factValue">{totalStudents}</div>
                        <div className="factLabel">Tổng học sinh</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: '#6366f1' }}><FiUser /></div>
                    <div>
                        <div className="factValue">{maleCount}</div>
                        <div className="factLabel">Nam</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: '#ec4899' }}><FiUser /></div>
                    <div>
                        <div className="factValue">{femaleCount}</div>
                        <div className="factLabel">Nữ</div>
                    </div>
                </div>
                <div className="fact">
                    <div className="factIcon" style={{ color: 'var(--good)' }}><FiUserCheck /></div>
                    <div>
                        <div className="factValue">{fpCount}/{totalStudents}</div>
                        <div className="factLabel">Đã gán vân tay</div>
                    </div>
                </div>
            </div>

            {/* Student Table */}
            <Card
                title={`Danh sách học sinh (${filtered.length})`}
                icon={<FiUsers />}
                subtitle="Lớp chủ nhiệm 6B"
                right={<Pill tone="info">{filtered.length} học sinh</Pill>}
            >
                <Table
                    columns={[
                        { key: 'stt', header: 'STT', width: '5%' },
                        { key: 'code', header: 'Mã HS', width: '9%' },
                        { key: 'name', header: 'Họ và tên', width: '22%' },
                        { key: 'gender', header: 'Giới tính', width: '9%' },
                        { key: 'dob', header: 'Ngày sinh', width: '12%' },
                        { key: 'role', header: 'Vai trò', width: '12%' },
                        { key: 'fingerprint', header: 'Vân tay', width: '10%' },
                        { key: 'status', header: 'Trạng thái', width: '11%' },
                        { key: 'actions', header: '', width: '5%', align: 'center' },
                    ]}
                    rows={paged.map((s, idx) => ({
                        key: s.id,
                        stt: (page - 1) * PAGE_SIZE + idx + 1,
                        code: <span className="tag tag--muted">{s.student_code}</span>,
                        name: (
                            <div className="student-name-cell">
                                <div className={`student-avatar ${s.gender.toLowerCase()}`}>
                                    {getInitials(s.full_name)}
                                </div>
                                <span className="student-name-text">{s.full_name}</span>
                            </div>
                        ),
                        gender: (
                            <span className={`pill pill--${genderMap[s.gender]?.tone || 'muted'}`}>
                                {genderMap[s.gender]?.label || s.gender}
                            </span>
                        ),
                        dob: new Date(s.birthdate).toLocaleDateString('vi-VN'),
                        role: s.student_role ? (
                            <span className={`role-badge ${getRoleBadgeClass(s.student_role.role_code)}`}>
                                {s.student_role.role_name}
                            </span>
                        ) : (
                            <span style={{ color: 'var(--ts)', fontSize: '12px' }}>—</span>
                        ),
                        fingerprint: (
                            <span className={`fp-status ${s.fingerprint_id ? 'has-fp' : 'no-fp'}`}>
                                {s.fingerprint_id ? <><FiCheck size={12} /> Đã gán</> : 'Chưa gán'}
                            </span>
                        ),
                        status: (
                            <span className={`pill pill--${statusMap[s.status]?.tone || 'muted'}`}>
                                {statusMap[s.status]?.label || s.status}
                            </span>
                        ),
                        actions: (
                            <ActionDropdown
                                student={s}
                                onEdit={st => setFormModal({ open: true, student: st })}
                                onTransfer={st => setTransferModal({ open: true, student: st })}
                                onAssignRole={st => setRoleModal({ open: true, student: st })}
                                onFingerprint={st => setFpModal({ open: true, student: st })}
                                onViewParent={st => setParentModal({ open: true, student: st })}
                            />
                        ),
                    }))}
                    emptyText="Không tìm thấy học sinh phù hợp."
                />
                {totalPages > 1 && (
                    <div style={{ marginTop: '14px' }}>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                )}
            </Card>

            {/* Modals */}
            <StudentFormModal
                isOpen={formModal.open}
                student={formModal.student}
                onClose={() => setFormModal({ open: false, student: null })}
                onSave={(data) => console.log('Save student:', data)}
            />
            <TransferClassModal
                isOpen={transferModal.open}
                student={transferModal.student}
                onClose={() => setTransferModal({ open: false, student: null })}
                onSave={(data) => console.log('Transfer:', data)}
            />
            <AssignRoleModal
                isOpen={roleModal.open}
                student={roleModal.student}
                onClose={() => setRoleModal({ open: false, student: null })}
                onSave={(data) => console.log('Assign role:', data)}
            />
            <FingerprintModal
                isOpen={fpModal.open}
                student={fpModal.student}
                onClose={() => setFpModal({ open: false, student: null })}
            />
            <ViewParentModal
                isOpen={parentModal.open}
                student={parentModal.student}
                onClose={() => setParentModal({ open: false, student: null })}
            />
        </div>
    );
}
