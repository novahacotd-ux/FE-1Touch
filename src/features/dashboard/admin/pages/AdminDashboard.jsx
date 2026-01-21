
// AdminDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  FiCalendar,
  FiFilter,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiDatabase,
  FiEdit3,
  FiBarChart2,
  FiActivity,
  FiSearch,
} from "react-icons/fi";

// Styles
import "../styles/AdminDashboard.css";

// Utils & Data
import { formatInt } from "../utils/dashboardHelpers";
import { TODAY, school, classes, teachers, DASH } from "../mocks/dashboardData";

// UI Components
import Card from "../components/ui/Card";
import { Pill, DeltaPill } from "../components/ui/Pills";
import Select from "../components/ui/Select";
import { LegendRow, Fact, QualityStat } from "../components/ui/Stats";
import PipelineStep from "../components/ui/PipelineStep";
import Table from "../components/ui/Table";

// Charts
import DonutChart from "../components/charts/DonutChart";
import StackedBarChart from "../components/charts/StackedBarChart";
import LineChart from "../components/charts/LineChart";
import HistogramChart from "../components/charts/HistogramChart";
import BarChart from "../components/charts/BarChart";
import FunnelChart from "../components/charts/FunnelChart";
import MiniStackedBars from "../components/charts/MiniStackedBars";
import SparklineBinary from "../components/charts/SparklineBinary";
import CalendarHeatmap from "../components/charts/CalendarHeatmap";


export default function AdminDashboard() {
  // -------------------------
  // Filters (UI only; demo applies to dataset selection)
  // -------------------------
  const [datePreset, setDatePreset] = useState("today"); // today | week | custom
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [selectedTeacherId, setSelectedTeacherId] = useState("all");
  const [needsActionOnly, setNeedsActionOnly] = useState(false);
  const [search, setSearch] = useState("");

  const dataset = useMemo(() => {
    const base =
      selectedClassId !== "all" && DASH.classMap[selectedClassId]
        ? DASH.classMap[selectedClassId]
        : DASH.schoolWide;

    // minimal filtering demo (needsAction/search) applied to tables
    const filtered = { ...base };

    // filter studentsAtRisk
    let risk = base.studentsAtRisk || [];
    if (needsActionOnly) {
      risk = risk.filter(
        (s) => s.absent_unexcused_14d >= 3 || s.late_14d >= 6 || s.streak_absent >= 2
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      risk = risk.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) ||
          s.student_code.toLowerCase().includes(q) ||
          s.class_name.toLowerCase().includes(q)
      );
    }
    filtered.studentsAtRisk = risk;

    // filter anomalies
    let anomalies = base.anomalies || [];
    if (needsActionOnly) {
      anomalies = anomalies.filter((a) => a.severity === "HIGH" || a.severity === "MEDIUM");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      anomalies = anomalies.filter(
        (a) =>
          a.type.toLowerCase().includes(q) ||
          a.detail.toLowerCase().includes(q) ||
          a.entity.toLowerCase().includes(q)
      );
    }
    filtered.anomalies = anomalies;

    return filtered;
  }, [selectedClassId, needsActionOnly, search]);

  // -------------------------
  // Derived KPIs (from dataset)
  // -------------------------
  const kpi = useMemo(() => {
    const totals = dataset.sessionsToday.reduce(
      (acc, s) => {
        acc.present += s.present;
        acc.late += s.late;
        acc.absent += s.absent;
        acc.total += s.present + s.late + s.absent;
        return acc;
      },
      { present: 0, late: 0, absent: 0, total: 0 }
    );

    const presentRate = totals.total ? (totals.present / totals.total) * 100 : 0;
    const lateRate = totals.total ? (totals.late / totals.total) * 100 : 0;
    const absentRate = totals.total ? (totals.absent / totals.total) * 100 : 0;

    const pipeline = dataset.pipeline;
    const completion = pipeline.recordsExpected
      ? (pipeline.teacherConfirmed / pipeline.recordsExpected) * 100
      : 0;
    const recordCoverage = pipeline.recordsExpected
      ? (pipeline.recordsCreated / pipeline.recordsExpected) * 100
      : 0;

    const notifSuccessRate = pipeline.notificationsNeeded
      ? (pipeline.notificationsSent / pipeline.notificationsNeeded) * 100
      : 0;

    const integrityToday = dataset.integrity7[dataset.integrity7.length - 1];
    const integrityTotal = integrityToday.hasInValid + integrityToday.mismatch + integrityToday.noIn;
    const inCoverageRate = integrityTotal ? (integrityToday.hasInValid / integrityTotal) * 100 : 0;
    const mismatchRate = integrityTotal ? (integrityToday.mismatch / integrityTotal) * 100 : 0;
    const noInRate = integrityTotal ? (integrityToday.noIn / integrityTotal) * 100 : 0;

    const trend30 = dataset.trend30;
    const lastDay = trend30[trend30.length - 1];
    const prevDay = trend30[trend30.length - 2];
    const presentDelta = lastDay.presentRate - prevDay.presentRate;
    const lateDelta = lastDay.lateCount - prevDay.lateCount;

    return {
      totals,
      presentRate,
      lateRate,
      absentRate,
      completion,
      recordCoverage,
      notifSuccessRate,
      inCoverageRate,
      mismatchRate,
      noInRate,
      presentDelta,
      lateDelta,
      todayOverride: dataset.override.todayCount,
      avgOverride7: dataset.override.avg7Days,
      anomaliesCount: dataset.anomalies.length,
      riskCount: dataset.studentsAtRisk.length,
    };
  }, [dataset]);

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="admin-dash">
      {/* Header strip inside content area */}
      <div className="admin-dash__top">
        <div className="admin-dash__title">
          <div className="admin-dash__titleBadge">
            <FiActivity />
          </div>
          <div className="admin-dash__titleText">
            <div className="h1">Dashboard Điểm Danh</div>
            <div className="sub">
              {school.name} • Năm học {school.academicYear}
            </div>
          </div>
        </div>

        <div className="admin-dash__filters">
          <div className="filterRow">
            <div className="filter">
              <div className="filterLabel">
                <FiCalendar /> Thời gian
              </div>
              <Select
                value={datePreset}
                onChange={setDatePreset}
                options={[
                  { value: "today", label: `Hôm nay (${TODAY})` },
                  { value: "week", label: "Tuần này" },
                  { value: "custom", label: "Tùy chọn" },
                ]}
              />
            </div>

            <div className="filter">
              <div className="filterLabel">
                <FiUsers /> Lớp
              </div>
              <Select
                value={selectedClassId}
                onChange={setSelectedClassId}
                options={[
                  { value: "all", label: "Toàn trường" },
                  ...classes.map((c) => ({ value: c.id, label: c.class_name })),
                ]}
              />
            </div>

            <div className="filter">
              <div className="filterLabel">
                <FiUsers /> Giáo viên
              </div>
              <Select
                value={selectedTeacherId}
                onChange={setSelectedTeacherId}
                options={[
                  { value: "all", label: "Tất cả" },
                  ...teachers.map((t) => ({ value: t.id, label: `${t.full_name} (${t.teacher_code})` })),
                ]}
              />
            </div>

            <div className="filter search">
              <div className="filterLabel">
                <FiSearch /> Tìm nhanh
              </div>
              <input
                className="textInput"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Học sinh / mã HS / loại lỗi..."
              />
            </div>

            <button
              className={`chip ${needsActionOnly ? "chip--on" : ""}`}
              onClick={() => setNeedsActionOnly((p) => !p)}
              title="Chỉ hiển thị hạng mục cần xử lý"
            >
              <FiFilter />
              Chỉ cần xử lý
            </button>
          </div>

        </div>
      </div>

      {/* Row 1 — Multi-metric KPI cards (NOT single-number cards) */}
      <div className="grid grid--kpi">
        {/* Card: Attendance Overview */}
        <Card
          title="Tổng quan điểm danh (Hôm nay)"
          icon={<FiBarChart2 />}
          subtitle="Tỷ trọng trạng thái + diễn biến theo tiết"
          right={<DeltaPill label="Present" value={kpi.presentDelta} unit="pp" />}
        >
          <div className="kpiSplit">
            <div className="kpiLeft">
              <DonutChart
                size={120}
                thickness={14}
                data={[
                  { label: "Có mặt", value: kpi.totals.present, key: "present" },
                  { label: "Muộn", value: kpi.totals.late, key: "late" },
                  { label: "Vắng", value: kpi.totals.absent, key: "absent" },
                ]}
              />
              <div className="kpiLegend">
                <LegendRow label="Có mặt" value={`${kpi.presentRate.toFixed(1)}%`} dot="dot--good" />
                <LegendRow label="Muộn" value={`${kpi.lateRate.toFixed(1)}%`} dot="dot--warn" />
                <LegendRow label="Vắng" value={`${kpi.absentRate.toFixed(1)}%`} dot="dot--bad" />
                <div className="muted small">
                  Tổng record (buổi): <b>{formatInt(kpi.totals.total)}</b>
                </div>
              </div>
            </div>

            <div className="kpiRight">
              <div className="miniTitle">Theo từng tiết (P/L/A)</div>
              <MiniStackedBars
                data={dataset.sessionsToday.map((s) => ({
                  label: s.period,
                  a: s.present,
                  b: s.late,
                  c: s.absent,
                }))}
              />
              <div className="kpiFacts">
                <Fact icon={<FiClock />} label="Đi muộn hôm nay" value={formatInt(kpi.totals.late)} />
                <Fact icon={<FiAlertTriangle />} label="Vắng hôm nay" value={formatInt(kpi.totals.absent)} />
                <Fact icon={<FiCheckCircle />} label="Có mặt" value={formatInt(kpi.totals.present)} />
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Ops Pipeline */}
        <Card
          title="Tiến độ nghiệp vụ (Pipeline)"
          icon={<FiCheckCircle />}
          subtitle="Sinh phiên → tạo record → GV xác nhận → cảnh báo"
          right={<Pill tone="info">{kpi.completion.toFixed(1)}% xác nhận</Pill>}
        >
          <div className="pipeGrid">
            <PipelineStep
              title="Phiên đã sinh"
              value={formatInt(dataset.pipeline.sessionsGenerated)}
              sub="attendance_sessions"
              pct={100}
            />
            <PipelineStep
              title="Record đã tạo"
              value={`${formatInt(dataset.pipeline.recordsCreated)} / ${formatInt(dataset.pipeline.recordsExpected)}`}
              sub="attendance_records"
              pct={kpi.recordCoverage}
            />
            <PipelineStep
              title="GV đã xác nhận"
              value={formatInt(dataset.pipeline.teacherConfirmed)}
              sub="confirm/verify"
              pct={kpi.completion}
            />
            <div className="pipeFunnel">
              <div className="miniTitle">Cảnh báo phụ huynh</div>
              <FunnelChart
                steps={[
                  { label: "Cần gửi", value: dataset.pipeline.notificationsNeeded, key: "need" },
                  { label: "Đã gửi", value: dataset.pipeline.notificationsSent, key: "sent" },
                  { label: "Thất bại", value: dataset.pipeline.notificationsFailed, key: "failed" },
                ]}
              />
              <div className="muted small">
                Tỷ lệ thành công: <b>{kpi.notifSuccessRate.toFixed(1)}%</b>
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Data Integrity */}
        <Card
          title="Chất lượng đối chiếu (IN ↔ Session)"
          icon={<FiDatabase />}
          subtitle="Tính minh bạch: có IN hợp lệ / mismatch / thiếu IN"
          right={
            <Pill tone={kpi.mismatchRate > 3 ? "warn" : "good"}>
              {kpi.inCoverageRate.toFixed(1)}% IN hợp lệ
            </Pill>
          }
        >
          <div className="kpiSplit">
            <div className="kpiLeft">
              <div className="miniTitle">7 ngày gần nhất</div>
              <StackedBarChart
                height={150}
                data={dataset.integrity7.map((d) => ({
                  label: d.date,
                  segments: [
                    { key: "hasIn", label: "Có IN hợp lệ", value: d.hasInValid },
                    { key: "mismatch", label: "Mismatch", value: d.mismatch },
                    { key: "noIn", label: "Thiếu IN", value: d.noIn },
                  ],
                }))}
              />
            </div>
            <div className="kpiRight">
              <div className="miniTitle">Hôm nay</div>
              <div className="qualityBox">
                <QualityStat label="IN hợp lệ" value={`${kpi.inCoverageRate.toFixed(1)}%`} dot="dot--good" />
                <QualityStat label="Mismatch" value={`${kpi.mismatchRate.toFixed(1)}%`} dot="dot--warn" />
                <QualityStat label="Thiếu IN" value={`${kpi.noInRate.toFixed(1)}%`} dot="dot--bad" />
                <div className="muted small">
                  Gợi ý hành động: kiểm tra rule giờ vào/threshold và bất thường log trùng/lệch.
                </div>
              </div>
              <div className="kpiFacts">
                <Fact icon={<FiAlertTriangle />} label="Anomaly" value={formatInt(kpi.anomaliesCount)} />
                <Fact icon={<FiUsers />} label="HS rủi ro" value={formatInt(kpi.riskCount)} />
              </div>
            </div>
          </div>
        </Card>

        {/* Card: Manual Override */}
        <Card
          title="Mức thao tác thủ công (Override)"
          icon={<FiEdit3 />}
          subtitle="Đo mục tiêu giảm thao tác: chỉnh sửa/override record"
          right={<DeltaPill label="Late" value={kpi.lateDelta} unit="" />}
        >
          <div className="kpiSplit">
            <div className="kpiLeft">
              <div className="miniTitle">Override 7 ngày</div>
              <LineChart
                height={150}
                data={dataset.override.trend7.map((x) => ({ x: x.d, y: x.v }))}
                yLabel="Số lần"
              />
            </div>
            <div className="kpiRight">
              <div className="kpiFacts">
                <Fact icon={<FiEdit3 />} label="Hôm nay" value={formatInt(dataset.override.todayCount)} />
                <Fact icon={<FiTrendingUp />} label="TB 7 ngày" value={formatInt(dataset.override.avg7Days)} />
              </div>
              <div className="miniTitle">Top giáo viên chỉnh nhiều</div>
              <div className="listCompact">
                {dataset.override.topEditors.map((t) => (
                  <div key={t.name} className="listRow">
                    <div className="listLeft">
                      <span className="dot dot--info" />
                      <span className="ellipsis">{t.name}</span>
                    </div>
                    <div className="listRight">{t.edits}</div>
                  </div>
                ))}
              </div>
              <div className="muted small">
                Override tăng thường đồng nghĩa: lỗi thiết bị/log, rule chưa phù hợp, hoặc TKB thiếu chính xác.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2 — Main charts */}
      <div className="grid grid--main">
        <Card
          title="Điểm danh theo buổi học (Session-based)"
          icon={<FiBarChart2 />}
          subtitle="Stacked theo tiết: Present / Late / Absent"
          right={<Pill tone="info">Tập trung nghiệp vụ buổi học</Pill>}
        >
          <StackedBarChart
            height={260}
            data={dataset.sessionsToday.map((s) => ({
              label: s.period,
              segments: [
                { key: "present", label: "Có mặt", value: s.present },
                { key: "late", label: "Muộn", value: s.late },
                { key: "absent", label: "Vắng", value: s.absent },
              ],
              hint: `${s.start}–${s.end}`,
            }))}
            showHint
          />
          <div className="muted small">
            Ý nghĩa: tiết nào “đỏ/cam” nhiều → ưu tiên kiểm tra log IN, quy tắc threshold và xác nhận giáo viên.
          </div>
        </Card>

        <Card
          title="Phân bố giờ chấm IN (log thô)"
          icon={<FiClock />}
          subtitle="Histogram theo 10 phút — để hiểu hành vi đến trường"
          right={<Pill tone="good">IN quyết định trạng thái</Pill>}
        >
          <HistogramChart height={260} data={dataset.checkinHistogram} />
          <div className="muted small">
            OUT không bắt buộc để xác định có mặt/vắng; chỉ dùng phân tích ra về sớm/rời giữa buổi.
          </div>
        </Card>

        <Card
          title="Điểm nóng hôm nay (Hotspots)"
          icon={<FiAlertTriangle />}
          subtitle="Top lớp/tiết có Late + Absent cao — để xử lý nhanh"
          right={<Pill tone="warn">Ưu tiên can thiệp</Pill>}
        >
          <BarChart
            height={260}
            data={dataset.topHotspots.map((x) => ({ label: x.label, value: x.total, a: x.late, b: x.absent }))}
            labelA="Late"
            labelB="Absent"
          />
          <div className="muted small">
            Gợi ý: mở drilldown theo lớp → xem danh sách HS vắng/đi muộn và trạng thái gửi cảnh báo.
          </div>
        </Card>
      </div>

      {/* Row 3 — Trends + calendar heatmap */}
      <div className="grid grid--trend">
        <Card
          title="Xu hướng chuyên cần 30 ngày"
          icon={<FiTrendingUp />}
          subtitle="Present rate theo ngày + trung bình động (UI rõ xu hướng)"
          right={<Pill tone={kpi.presentDelta >= 0 ? "good" : "warn"}>{kpi.presentDelta >= 0 ? "Cải thiện" : "Giảm"} so với hôm qua</Pill>}
        >
          <LineChart
            height={240}
            data={dataset.trend30.map((d) => ({ x: d.label, y: d.presentRate }))}
            yLabel="% Có mặt"
            yDomain={[85, 100]}
            formatY={(v) => `${v.toFixed(1)}%`}
          />
          <div className="muted small">Nguồn: attendance_records aggregate theo ngày (reset trạng thái theo ngày).</div>
        </Card>

        <Card
          title="Xu hướng đi muộn 30 ngày"
          icon={<FiClock />}
          subtitle="Late count theo ngày (phát hiện vấn đề cổng/giờ vào/threshold)"
          right={<Pill tone={kpi.lateDelta <= 0 ? "good" : "warn"}>{kpi.lateDelta <= 0 ? "Giảm" : "Tăng"} so với hôm qua</Pill>}
        >
          <LineChart
            height={240}
            data={dataset.trend30.map((d) => ({ x: d.label, y: d.lateCount }))}
            yLabel="Số muộn"
            formatY={(v) => `${Math.round(v)}`}
          />
          <div className="muted small">
            Nếu late tăng đều: kiểm tra system_config (checkin_end_time/threshold) và luồng log IN.
          </div>
        </Card>

        <Card
          title="Calendar Heatmap (30 ngày)"
          icon={<FiCalendar />}
          subtitle="..."
          right={<Pill tone="info">Heatmap</Pill>}
        >
          <CalendarHeatmap
            data={dataset.trend30.map((d) => ({
              date: d.iso,
              value: d.absentRate, // %
              label: d.label,
            }))}
          />
          <div className="muted small">
            
          </div>
        </Card>
      </div>

      {/* Row 4 — Action tables */}
      <div className="grid grid--tables">
        <Card
          title="Học sinh rủi ro (14 ngày)"
          icon={<FiAlertTriangle />}
          subtitle="Vắng không phép / đi muộn / streak — ưu tiên can thiệp sớm"
          right={<Pill tone="warn">{dataset.studentsAtRisk.length} mục</Pill>}
        >
          <Table
            columns={[
              { key: "student", header: "Học sinh", width: "30%" },
              { key: "class", header: "Lớp", width: "10%" },
              { key: "absent", header: "Vắng KP (14d)", width: "14%", align: "right" },
              { key: "late", header: "Muộn (14d)", width: "12%", align: "right" },
              { key: "streak", header: "Streak vắng", width: "12%", align: "right" },
              { key: "spark", header: "Nhịp 14 ngày", width: "22%" },
            ]}
            rows={dataset.studentsAtRisk.map((s) => ({
              key: s.student_code,
              student: (
                <div className="cellUser">
                  <div className="avatar">{s.full_name.split(" ").slice(-1)[0]?.[0] || "H"}</div>
                  <div className="cellUserText">
                    <div className="cellUserName">{s.full_name}</div>
                    <div className="cellUserSub">
                      <span className="tag tag--muted">{s.student_code}</span>
                      <span className="tag tag--muted">{s.note}</span>
                    </div>
                  </div>
                </div>
              ),
              class: <span className="tag tag--info">{s.class_name}</span>,
              absent: <b className={s.absent_unexcused_14d >= 4 ? "bad" : "warn"}>{s.absent_unexcused_14d}</b>,
              late: <b className={s.late_14d >= 7 ? "warn" : ""}>{s.late_14d}</b>,
              streak: <b className={s.streak_absent >= 2 ? "bad" : ""}>{s.streak_absent}</b>,
              spark: <SparklineBinary values={s.spark} />,
            }))}
            emptyText="Không có học sinh rủi ro theo bộ lọc hiện tại."
          />
          <div className="muted small">
            Rule gợi ý: vắng KP ≥ 3 hoặc muộn ≥ 6 hoặc streak vắng ≥ 2 → đưa vào danh sách can thiệp.
          </div>
        </Card>

        <Card
          title="Anomalies cần xử lý"
          icon={<FiDatabase />}
          subtitle="Thiếu record / mismatch / log bất thường — ưu tiên HIGH/MEDIUM"
          right={<Pill tone={dataset.anomalies.some((a) => a.severity === "HIGH") ? "warn" : "good"}>{dataset.anomalies.length} cảnh báo</Pill>}
        >
          <div className="anomalyList">
            {dataset.anomalies.length === 0 ? (
              <div className="emptyBox">Không có anomalies theo bộ lọc hiện tại.</div>
            ) : (
              dataset.anomalies.map((a, idx) => (
                <div key={`${a.entity_id}-${idx}`} className="anomalyItem">
                  <div className={`sev sev--${a.severity.toLowerCase()}`}>{a.severity}</div>
                  <div className="anomalyMain">
                    <div className="anomalyTitle">
                      <b>{a.type}</b> <span className="muted">• {a.time}</span>
                    </div>
                    <div className="anomalyDetail">{a.detail}</div>
                    <div className="anomalyMeta">
                      <span className="tag tag--muted">{a.entity}</span>
                      <span className="tag tag--muted">{a.entity_id}</span>
                    </div>
                  </div>
                  <button className="btn btn--ghost">Drilldown</button>
                </div>
              ))
            )}
          </div>
          <div className="muted small">
            Gợi ý xử lý: (1) check system_config/time windows (2) kiểm tra import TKB (3) kiểm tra trùng/đứt log từ thiết bị.
          </div>
        </Card>

        <Card
          title="Nhật ký thao tác (Audit log)"
          icon={<FiActivity />}
          subtitle="Truy vết: ai làm gì, lúc nào, tác động entity nào"
          right={<Pill tone="info">audit_logs</Pill>}
        >
          <Table
            columns={[
              { key: "at", header: "Thời điểm", width: "12%" },
              { key: "user", header: "Người dùng", width: "12%" },
              { key: "action", header: "Hành động", width: "22%" },
              { key: "entity", header: "Đối tượng", width: "16%" },
              { key: "note", header: "Ghi chú", width: "38%" },
            ]}
            rows={dataset.auditLogs.map((x, i) => ({
              key: `${x.at}-${i}`,
              at: <span className="tag tag--muted">{x.at}</span>,
              user: <span className="tag tag--info">{x.user}</span>,
              action: <b>{x.action}</b>,
              entity: (
                <div className="cellMeta">
                  <span className="tag tag--muted">{x.entity}</span>
                  <span className="tag tag--muted">{x.entity_id}</span>
                </div>
              ),
              note: <span className="muted">{x.note}</span>,
            }))}
            emptyText="Chưa có audit log."
          />
        </Card>
      </div>

      <div className="footerNote">
        <span className="tag tag--muted">
          
        </span>
      </div>
    </div>
  );
}
