// TeacherReports.jsx - Thống kê giáo viên (chi tiết)
import { useState, useMemo } from 'react';
import {
    FiBarChart2, FiPieChart, FiTrendingUp, FiUsers,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiClock,
    FiCalendar, FiUser, FiAlertTriangle, FiList, FiEye, FiX, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import './TeacherReports.css';

import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';
import Table from '../../admin/components/ui/Table';
import Select from '../../admin/components/ui/Select';

import {
    classSelectOptions as classesList,
    periodOptions,
    scopeOptions,
    getStudentsByClass,
    getStudentSelectOptions,
    getStudentById,
    getClassStats,
    getStudentRate,
    isStudentAtRisk,
    getRiskStudents,
    getTopAbsentStudents,
    getStudentMonthlyAbsent,
    getStudentTrendLine,
    attendanceDayOfWeek,
    attendanceTrend,
    classComparison as classCompare,
    getStudentAttendanceLogs,
} from '../mocks/teacherReports.mock';

// ─── Colors ─────────────────────────────────────────────

const C = {
    present: '#22c55e',
    late: '#f59e0b',
    absent: '#ef4444',
    excused: '#6366f1',
};

// ─── Helpers ────────────────────────────────────────────

const getInitials = (name) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? parts[parts.length - 1][0] : name[0];
};

// ─── Donut Chart ────────────────────────────────────────

function DonutChart({ data, size = 180, thickness = 28, centerValue, centerLabel }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const r = (size - thickness) / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;

    return (
        <div className="donut-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth={thickness} />
                {data.map((d, i) => {
                    const pct = total > 0 ? d.value / total : 0;
                    const dash = circ * pct;
                    const off = circ * offset;
                    offset += pct;
                    if (pct === 0) return null;
                    return (
                        <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                            stroke={d.color} strokeWidth={thickness}
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeDashoffset={-off}
                            className="donut-svg" style={{ transformOrigin: 'center' }}
                        />
                    );
                })}
                <text x={size / 2} y={size / 2 - 6} textAnchor="middle" className="donut-center" fontSize="22">{centerValue}</text>
                <text x={size / 2} y={size / 2 + 12} textAnchor="middle" className="donut-center-sub">{centerLabel}</text>
            </svg>
            <div className="donut-legend">
                {data.map((d, i) => (
                    <div key={i} className="legend-item">
                        <div className="legend-dot" style={{ background: d.color }} />
                        {d.label}: <span className="legend-value">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Bar Chart ──────────────────────────────────────────

function BarChart({ items, maxHeight = 180, colorFn }) {
    const maxVal = Math.max(...items.map(d => d.value), 1);
    return (
        <div className="bar-chart-wrap">
            <div className="bar-chart" style={{ height: `${maxHeight}px` }}>
                {items.map((d, i) => {
                    const h = (d.value / maxVal) * maxHeight;
                    const color = colorFn ? colorFn(d) : `linear-gradient(180deg, ${C.present}, rgba(34,197,94,.5))`;
                    return (
                        <div key={i} className="bar-col">
                            <div className="bar-value">{d.value}{d.suffix || ''}</div>
                            <div className="bar-track" style={{ height: `${h}px`, background: color }} />
                            <div className="bar-label" title={d.label}>{d.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Line Chart ─────────────────────────────────────────

function LineChart({ points, height = 200, color = C.present }) {
    const W = 500, H = height;
    const pad = { top: 20, right: 20, bottom: 30, left: 40 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;

    const vals = points.map(p => p.value);
    const minV = Math.min(...vals) - 2;
    const maxV = Math.max(...vals) + 2;
    const range = maxV - minV || 1;

    const pts = points.map((p, i) => ({
        x: pad.left + (i / Math.max(points.length - 1, 1)) * cW,
        y: pad.top + (1 - (p.value - minV) / range) * cH,
    }));

    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L${pts[pts.length - 1].x},${pad.top + cH} L${pts[0].x},${pad.top + cH} Z`;

    // Y-axis labels
    const ySteps = 5;
    const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => (minV + (range * i / ySteps)).toFixed(1));

    return (
        <div className="line-chart-wrap">
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {yLabels.map((v, i) => {
                    const y = pad.top + (1 - i / ySteps) * cH;
                    return (
                        <g key={i}>
                            <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} className="line-grid" />
                            <text x={pad.left - 6} y={y + 3} textAnchor="end" className="line-axis">{v}%</text>
                        </g>
                    );
                })}
                {/* X-axis labels */}
                {points.map((p, i) => (
                    <text key={i} x={pts[i].x} y={H - 6} textAnchor="middle" className="line-axis">{p.label}</text>
                ))}
                {/* Area */}
                <path d={areaPath} fill={color} className="line-area" />
                {/* Line */}
                <path d={linePath} className="line-path" stroke={color} />
                {/* Dots */}
                {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={4} fill="#fff" stroke={color} className="line-dot" />
                ))}
            </svg>
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────

export default function TeacherReports() {
    const [activeTab, setActiveTab] = useState('class');

    // Tab 1: Theo lớp
    const [selectedClass, setSelectedClass] = useState('6B');
    const [classPeriod, setClassPeriod] = useState('semester');
    const [barMode, setBarMode] = useState('day'); // 'day' | 'student'

    // Tab 2: Theo học sinh
    const [studentClass, setStudentClass] = useState('6B');
    const [selectedStudentId, setSelectedStudentId] = useState('8');
    const [studentPeriod, setStudentPeriod] = useState('semester');

    // Tab 3: Theo thời gian
    const [timeScope, setTimeScope] = useState('school');
    const [timePeriod, setTimePeriod] = useState('month');

    // Modal for risk student detail
    const [modalStudentId, setModalStudentId] = useState(null);
    const modalStudent = modalStudentId ? getStudentById(modalStudentId) : null;
    const modalLogs = modalStudentId ? getStudentAttendanceLogs(modalStudentId) : [];

    // Show all logs toggle
    const [showAllLogs, setShowAllLogs] = useState(false);

    // ─── Tab 1: Theo lớp ────────────────────────────────

    const cd = getClassStats(selectedClass, classPeriod);
    const totalAttend = cd.present + cd.late + cd.absent + cd.excused;
    const classRate = totalAttend > 0 ? ((cd.present + cd.late) / totalAttend * 100).toFixed(1) : 0;

    const classStudents = getStudentsByClass(selectedClass);
    const dayData = attendanceDayOfWeek[selectedClass] || attendanceDayOfWeek['6B'];

    const studentOptions = useMemo(() =>
        getStudentSelectOptions(studentClass), [studentClass]
    );

    // ─── Tab 2: Theo học sinh ───────────────────────────

    const selStudent = useMemo(() => {
        const found = getStudentById(selectedStudentId);
        if (found) return found;
        const list = getStudentsByClass(studentClass);
        return list[0];
    }, [studentClass, selectedStudentId]);

    const sRate = selStudent ? getStudentRate(selStudent) : '0';
    const sIsRisk = selStudent && isStudentAtRisk(selStudent);

    const sMonthly = getStudentMonthlyAbsent(selStudent?.id);

    // Trend data for selected student
    const sLineData = useMemo(() =>
        getStudentTrendLine(selStudent?.id), [selStudent?.id]
    );

    // ─── Tab 3: Theo thời gian ──────────────────────────

    const trend = attendanceTrend[timeScope] || attendanceTrend['school'];

    return (
        <div className="admin-dash">
            {/* Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div className="admin-dash__titleBadge"><FiBarChart2 /></div>
                    <div className="admin-dash__titleText">
                        <div className="h1">Thống kê điểm danh</div>
                        <div className="sub">Năm học 2025-2026</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="report-tabs">
                <button className={`report-tab ${activeTab === 'class' ? 'active' : ''}`} onClick={() => setActiveTab('class')}>
                    <FiPieChart size={14} /> Theo lớp
                </button>
                <button className={`report-tab ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>
                    <FiUser size={14} /> Theo học sinh
                </button>
                <button className={`report-tab ${activeTab === 'time' ? 'active' : ''}`} onClick={() => setActiveTab('time')}>
                    <FiTrendingUp size={14} /> Theo thời gian
                </button>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* TAB 1: THEO LỚP                            */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === 'class' && (
                <>
                    {/* A. Filters */}
                    <div className="report-filters">
                        <div className="report-filter">
                            <div className="report-filter-label">Lớp</div>
                            <Select value={selectedClass} onChange={setSelectedClass} options={classesList} />
                        </div>
                        <div className="report-filter">
                            <div className="report-filter-label">Thời gian</div>
                            <div className="period-pills">
                                {periodOptions.map(p => (
                                    <button key={p.value} className={`period-pill ${classPeriod === p.value ? 'active' : ''}`}
                                        onClick={() => setClassPeriod(p.value)}>{p.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* B. Overview Cards */}
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
                        <div className="fact">
                            <div className="factIcon" style={{ color: 'var(--mc)' }}><FiUsers /></div>
                            <div><div className="factValue">{cd.total}</div><div className="factLabel">Sĩ số</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: '#6366f1' }}><FiCalendar /></div>
                            <div><div className="factValue">{cd.sessions}</div><div className="factLabel">Tổng buổi</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.present }}><FiCheckCircle /></div>
                            <div><div className="factValue">{totalAttend}</div><div className="factLabel">Lượt điểm danh</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.present }}><FiTrendingUp /></div>
                            <div><div className="factValue">{classRate}%</div><div className="factLabel">Chuyên cần</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.absent }}><FiXCircle /></div>
                            <div><div className="factValue">{cd.absent}</div><div className="factLabel">Vắng KP</div></div>
                        </div>
                    </div>

                    {/* C + D. Charts */}
                    <div className="chart-split">
                        {/* C. Donut */}
                        <Card title="Tỷ lệ trạng thái điểm danh" icon={<FiPieChart />} subtitle="Nhìn 3 giây biết lớp ổn hay không">
                            <DonutChart
                                data={[
                                    { label: 'Có mặt', value: cd.present, color: C.present },
                                    { label: 'Đi trễ', value: cd.late, color: C.late },
                                    { label: 'Vắng KP', value: cd.absent, color: C.absent },
                                    { label: 'Vắng CP', value: cd.excused, color: C.excused },
                                ]}
                                centerValue={`${classRate}%`}
                                centerLabel="Chuyên cần"
                            />
                        </Card>

                        {/* D. Bar Chart */}
                        <Card
                            title="Bar Chart chi tiết"
                            icon={<FiBarChart2 />}
                            subtitle={barMode === 'day' ? 'Theo ngày trong tuần' : 'Top 5 HS vắng nhiều nhất'}
                            right={
                                <div className="bar-mode-toggle">
                                    <button className={`bar-mode-btn ${barMode === 'day' ? 'active' : ''}`} onClick={() => setBarMode('day')}>Theo ngày</button>
                                    <button className={`bar-mode-btn ${barMode === 'student' ? 'active' : ''}`} onClick={() => setBarMode('student')}>Theo HS</button>
                                </div>
                            }
                        >
                            {barMode === 'day' ? (
                                <BarChart
                                    items={dayData.map(d => ({ label: d.day, value: d.absent + d.late }))}
                                    colorFn={d => d.value > 2 ? `linear-gradient(180deg, ${C.absent}, rgba(239,68,68,.5))` : `linear-gradient(180deg, ${C.late}, rgba(245,158,11,.5))`}
                                />
                            ) : (
                                <BarChart
                                    items={getTopAbsentStudents(selectedClass, 5).map(s => ({ label: s.full_name.split(' ').pop(), value: s.absent_unexcused, full: s.full_name }))}
                                    colorFn={d => d.value >= 5 ? `linear-gradient(180deg, ${C.absent}, rgba(239,68,68,.5))` : d.value > 0 ? `linear-gradient(180deg, ${C.late}, rgba(245,158,11,.5))` : `linear-gradient(180deg, ${C.present}, rgba(34,197,94,.5))`}
                                />
                            )}
                            <div className="donut-legend" style={{ marginTop: '8px' }}>
                                {barMode === 'day' ? (
                                    <><div className="legend-item"><div className="legend-dot" style={{ background: C.late }} /> Vắng + Trễ</div></>
                                ) : (
                                    <>
                                        <div className="legend-item"><div className="legend-dot" style={{ background: C.absent }} /> ≥5 buổi vắng</div>
                                        <div className="legend-item"><div className="legend-dot" style={{ background: C.late }} /> 1-4 buổi</div>
                                        <div className="legend-item"><div className="legend-dot" style={{ background: C.present }} /> 0 buổi</div>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* E. Warning table */}
                    <Card title="Danh sách học sinh nguy cơ" icon={<FiAlertTriangle />} subtitle="Vắng KP ≥ 5 buổi hoặc chuyên cần < 80%"
                        right={<Pill tone="bad">{getRiskStudents(selectedClass).length} học sinh</Pill>}
                    >
                        <Table
                            columns={[
                                { key: 'stt', header: 'STT', width: '6%' },
                                { key: 'name', header: 'Học sinh', width: '26%' },
                                { key: 'absent', header: 'Vắng KP', width: '12%', align: 'center' },
                                { key: 'rate', header: 'Chuyên cần', width: '22%' },
                                { key: 'risk', header: 'Trạng thái', width: '16%', align: 'center' },
                                { key: 'action', header: 'Chi tiết', width: '10%', align: 'center' },
                            ]}
                            rows={getRiskStudents(selectedClass)
                                .map((s, i) => {
                                    const r = parseFloat(getStudentRate(s));
                                    return {
                                        key: s.id,
                                        stt: i + 1,
                                        name: <span style={{ fontWeight: 700 }}>{s.full_name}</span>,
                                        absent: <span style={{ color: C.absent, fontWeight: 900 }}>{s.absent_unexcused}</span>,
                                        rate: (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,.06)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${r}%`, height: '100%', borderRadius: '4px', background: r < 80 ? C.absent : C.late }} />
                                                </div>
                                                <span style={{ fontWeight: 900, fontSize: '12px', color: r < 80 ? C.absent : C.late }}>{r}%</span>
                                            </div>
                                        ),
                                        risk: <span className="risk-badge danger"><FiAlertTriangle size={11} /> Nguy cơ</span>,
                                        action: (
                                            <button className="detail-toggle-btn" onClick={() => setModalStudentId(s.id)}>
                                                <FiEye size={13} /> Xem
                                            </button>
                                        ),
                                    };
                                })}
                            emptyText="Không có học sinh nguy cơ. 🎉"
                        />
                    </Card>
                </>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* TAB 2: THEO HỌC SINH                       */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === 'student' && selStudent && (
                <>
                    {/* A. Filters */}
                    <div className="report-filters">
                        <div className="report-filter">
                            <div className="report-filter-label">Lớp</div>
                            <Select value={studentClass} onChange={v => { setStudentClass(v); setSelectedStudentId(''); }} options={classesList} />
                        </div>
                        <div className="report-filter" style={{ minWidth: '220px' }}>
                            <div className="report-filter-label">Học sinh</div>
                            <Select value={selectedStudentId} onChange={setSelectedStudentId} options={studentOptions} />
                        </div>
                        <div className="report-filter">
                            <div className="report-filter-label">Thời gian</div>
                            <div className="period-pills">
                                {periodOptions.map(p => (
                                    <button key={p.value} className={`period-pill ${studentPeriod === p.value ? 'active' : ''}`}
                                        onClick={() => setStudentPeriod(p.value)}>{p.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Student info + warning */}
                    <div className="student-select-info">
                        <div className="student-select-avatar">{getInitials(selStudent.full_name)}</div>
                        <div style={{ flex: 1 }}>
                            <div className="student-select-name">{selStudent.full_name}</div>
                            <div className="student-select-code">{selStudent.student_code} • Lớp {studentClass}</div>
                        </div>
                        {sIsRisk ? (
                            <span className="risk-badge danger"><FiAlertTriangle size={12} /> Nguy cơ</span>
                        ) : (
                            <span className="risk-badge safe"><FiCheckCircle size={12} /> Ổn định</span>
                        )}
                    </div>

                    {/* B. Overview Cards */}
                    <div className="overview-cards">
                        <div className="fact">
                            <div className="factIcon" style={{ color: '#6366f1' }}><FiCalendar /></div>
                            <div><div className="factValue">100</div><div className="factLabel">Tổng buổi</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.present }}><FiCheckCircle /></div>
                            <div><div className="factValue">{selStudent.present}</div><div className="factLabel">Có mặt</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.excused }}><FiAlertCircle /></div>
                            <div><div className="factValue">{selStudent.absent_excused}</div><div className="factLabel">Vắng CP</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.absent }}><FiXCircle /></div>
                            <div><div className="factValue">{selStudent.absent_unexcused}</div><div className="factLabel">Vắng KP</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: C.late }}><FiClock /></div>
                            <div><div className="factValue">{selStudent.late}</div><div className="factLabel">Đi trễ</div></div>
                        </div>
                        <div className="fact">
                            <div className="factIcon" style={{ color: parseFloat(sRate) >= 90 ? C.present : parseFloat(sRate) >= 80 ? C.late : C.absent }}><FiTrendingUp /></div>
                            <div><div className="factValue">{sRate}%</div><div className="factLabel">Chuyên cần</div></div>
                        </div>
                    </div>

                    {/* Detail log for selected student */}
                    <Card title="Lịch sử vắng / muộn" icon={<FiList />}
                        subtitle={`${selStudent.full_name} — ${selStudent.absent_unexcused + selStudent.absent_excused + selStudent.late} sự kiện`}
                    >
                        {(() => {
                            const logs = getStudentAttendanceLogs(selStudent.id);
                            if (logs.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Không có ghi nhận vắng/muộn. 🎉</div>;
                            const visibleLogs = showAllLogs ? logs : logs.slice(0, 5);
                            return (
                                <>
                                    <Table
                                        columns={[
                                            { key: 'stt', header: 'STT', width: '6%' },
                                            { key: 'date', header: 'Ngày', width: '14%' },
                                            { key: 'session', header: 'Buổi', width: '10%', align: 'center' },
                                            { key: 'type', header: 'Loại', width: '18%', align: 'center' },
                                            { key: 'reason', header: 'Lý do', width: '52%' },
                                        ]}
                                        rows={visibleLogs.map((log, i) => ({
                                            key: log.id,
                                            stt: i + 1,
                                            date: <span style={{ fontWeight: 600 }}>{log.date}</span>,
                                            session: log.session,
                                            type: (
                                                <span className={`risk-badge ${log.type === 'absent_unexcused' ? 'danger' : log.type === 'absent_excused' ? 'excused' : 'late'}`}>
                                                    {log.type === 'absent_unexcused' ? 'Vắng KP' : log.type === 'absent_excused' ? 'Vắng CP' : 'Đi muộn'}
                                                </span>
                                            ),
                                            reason: log.reason || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không ghi nhận</span>,
                                        }))}
                                    />
                                    {logs.length > 5 && (
                                        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
                                            <button className="detail-toggle-btn" onClick={() => setShowAllLogs(!showAllLogs)}>
                                                {showAllLogs ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                                                {showAllLogs ? 'Thu gọn' : `Xem thêm (${logs.length - 5})`}
                                            </button>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </Card>



                    {/* C + D. Charts */}
                    <div className="chart-split">
                        {/* C. Bar Chart - Vắng theo tháng */}
                        <Card title="Vắng theo tháng" icon={<FiBarChart2 />} subtitle="Phát hiện tháng nghỉ nhiều">
                            <BarChart
                                items={['T9', 'T10', 'T11', 'T12', 'T1', 'T2', 'T3', 'T4', 'T5'].map((m, i) => ({
                                    label: m, value: sMonthly[8 + i] !== undefined ? sMonthly[8 + i] : (sMonthly[i] || 0),
                                }))}
                                colorFn={d => d.value >= 3 ? `linear-gradient(180deg, ${C.absent}, rgba(239,68,68,.5))` : d.value > 0 ? `linear-gradient(180deg, ${C.late}, rgba(245,158,11,.5))` : `linear-gradient(180deg, ${C.present}, rgba(34,197,94,.3))`}
                            />
                        </Card>

                        {/* D. Line Chart - Xu hướng chuyên cần */}
                        <Card title="Xu hướng chuyên cần" icon={<FiTrendingUp />} subtitle="Biến động tỷ lệ theo thời gian">
                            <LineChart
                                points={sLineData}
                                color={parseFloat(sRate) >= 80 ? C.present : C.absent}
                            />
                        </Card>
                    </div>
                </>
            )}

            {/* ═══ MODAL: Chi tiết lịch sử điểm danh ═══ */}
            {modalStudent && (
                <div className="modal-overlay" onClick={() => setModalStudentId(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <div className="student-select-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                                    {getInitials(modalStudent.full_name)}
                                </div>
                                <div>
                                    <div className="modal-title">{modalStudent.full_name}</div>
                                    <div className="modal-subtitle">{modalStudent.student_code} • Lớp {modalStudent.class_name}</div>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setModalStudentId(null)}><FiX size={18} /></button>
                        </div>

                        {/* Summary badges */}
                        <div className="modal-summary">
                            <span className="risk-badge danger" style={{ animation: 'none' }}>
                                Vắng KP: {modalStudent.absent_unexcused}
                            </span>
                            <span className="risk-badge excused">
                                Vắng CP: {modalStudent.absent_excused}
                            </span>
                            <span className="risk-badge late">
                                Đi muộn: {modalStudent.late}
                            </span>
                            <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 13, color: parseFloat(getStudentRate(modalStudent)) < 80 ? C.absent : C.present }}>
                                Chuyên cần: {getStudentRate(modalStudent)}%
                            </span>
                        </div>

                        {/* Log table */}
                        <div className="modal-log-scroll">
                            {modalLogs.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Không có ghi nhận vắng/muộn. 🎉</div>
                            ) : (
                                <table className="mini-log-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '6%' }}>STT</th>
                                            <th style={{ width: '16%' }}>Ngày</th>
                                            <th style={{ width: '10%' }}>Buổi</th>
                                            <th style={{ width: '18%' }}>Loại</th>
                                            <th>Lý do</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalLogs.map((log, idx) => (
                                            <tr key={log.id}>
                                                <td style={{ color: '#94a3b8' }}>{idx + 1}</td>
                                                <td style={{ fontWeight: 600 }}>{log.date}</td>
                                                <td>{log.session}</td>
                                                <td>
                                                    <span className={`risk-badge ${log.type === 'absent_unexcused' ? 'danger' : log.type === 'absent_excused' ? 'excused' : 'late'}`}
                                                        style={{ fontSize: '11px', padding: '2px 8px', animation: 'none' }}>
                                                        {log.type === 'absent_unexcused' ? 'Vắng KP' : log.type === 'absent_excused' ? 'Vắng CP' : 'Đi muộn'}
                                                    </span>
                                                </td>
                                                <td>{log.reason || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>—</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════ */}
            {/* TAB 3: THEO THỜI GIAN                      */}
            {/* ═══════════════════════════════════════════ */}
            {activeTab === 'time' && (
                <>
                    {/* A. Filters */}
                    <div className="report-filters">
                        <div className="report-filter" style={{ minWidth: '180px' }}>
                            <div className="report-filter-label">Phạm vi</div>
                            <Select value={timeScope} onChange={setTimeScope} options={scopeOptions} />
                        </div>
                        <div className="report-filter">
                            <div className="report-filter-label">Đơn vị</div>
                            <div className="period-pills">
                                {[
                                    { value: 'day', label: 'Ngày' },
                                    { value: 'week', label: 'Tuần' },
                                    { value: 'month', label: 'Tháng' },
                                ].map(p => (
                                    <button key={p.value} className={`period-pill ${timePeriod === p.value ? 'active' : ''}`}
                                        onClick={() => setTimePeriod(p.value)}>{p.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* B. Line Chart - Xu hướng */}
                    <Card title="Xu hướng chuyên cần" icon={<FiTrendingUp />}
                        subtitle="Sau Tết có nghỉ nhiều không? Cuối kỳ có tăng vắng không?"
                    >
                        <LineChart
                            points={trend.map(d => ({ label: d.month, value: d.rate }))}
                            color={C.present}
                        />
                    </Card>

                    {/* C. Bar Chart - So sánh lớp */}
                    <Card title="So sánh % chuyên cần giữa các lớp" icon={<FiBarChart2 />}
                        subtitle="Phát hiện lớp có tỷ lệ vắng cao bất thường"
                    >
                        <BarChart
                            items={classCompare.map(c => ({
                                label: c.class_name,
                                value: c.rate,
                                suffix: '%',
                            }))}
                            colorFn={d => d.value >= 95 ? `linear-gradient(180deg, ${C.present}, rgba(34,197,94,.5))` : d.value >= 90 ? `linear-gradient(180deg, ${C.late}, rgba(245,158,11,.5))` : `linear-gradient(180deg, ${C.absent}, rgba(239,68,68,.5))`}
                        />
                        <div className="donut-legend" style={{ marginTop: '8px' }}>
                            <div className="legend-item"><div className="legend-dot" style={{ background: C.present }} /> ≥95%</div>
                            <div className="legend-item"><div className="legend-dot" style={{ background: C.late }} /> 90-94%</div>
                            <div className="legend-item"><div className="legend-dot" style={{ background: C.absent }} /> &lt;90%</div>
                        </div>
                    </Card>

                    {/* Detail table */}
                    <Card title="Bảng chi tiết theo lớp" icon={<FiUsers />} subtitle="Số liệu chuyên cần từng lớp">
                        <Table
                            columns={[
                                { key: 'class_name', header: 'Lớp', width: '12%' },
                                { key: 'rate', header: '% Chuyên cần', width: '25%' },
                                { key: 'trend', header: 'So với tháng trước', width: '18%', align: 'center' },
                                { key: 'status', header: 'Đánh giá', width: '15%', align: 'center' },
                            ]}
                            rows={classCompare.map(c => ({
                                key: c.class_name,
                                class_name: <span style={{ fontWeight: 800 }}>{c.class_name}</span>,
                                rate: (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(0,0,0,.06)', overflow: 'hidden' }}>
                                            <div style={{ width: `${c.rate}%`, height: '100%', borderRadius: '4px', background: c.rate >= 95 ? C.present : c.rate >= 90 ? C.late : C.absent }} />
                                        </div>
                                        <span style={{ fontWeight: 900, fontSize: '12px', color: c.rate >= 95 ? C.present : c.rate >= 90 ? C.late : C.absent }}>{c.rate}%</span>
                                    </div>
                                ),
                                trend: (() => {
                                    const diff = (c.rate - c.prev_rate).toFixed(1);
                                    const isUp = diff >= 0;
                                    return (
                                        <span style={{ fontWeight: 800, color: isUp ? C.present : C.absent }}>
                                            {isUp ? '+' : ''}{diff}%
                                        </span>
                                    );
                                })(),
                                status: c.rate >= 95
                                    ? <Pill tone="good">Tốt</Pill>
                                    : c.rate >= 90
                                        ? <Pill tone="warn">Cần theo dõi</Pill>
                                        : <Pill tone="bad">Cảnh báo</Pill>,
                            }))}
                            emptyText="Không có dữ liệu."
                        />
                    </Card>
                </>
            )}
        </div>
    );
}
