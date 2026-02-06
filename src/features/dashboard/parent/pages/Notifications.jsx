import React, { useState } from 'react';
import './Notifications.css';

import {
  FaBell,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClock
} from 'react-icons/fa';

/* ================= MOCK TABLES (match ERD names) ================= */
const notifications = [
  {
    id: 1,
    student_id: 'HS001',
    parent_id: 1,
    message: 'Học sinh Nguyễn Văn A đi muộn 15 phút vào tiết 1.',
    sent_at: '2024-05-12 08:10',
    status: 'SENT'
  },
  {
    id: 2,
    student_id: 'HS001',
    parent_id: 1,
    message: 'Ngày mai học sinh nghỉ học do thời tiết xấu.',
    sent_at: '2024-05-11 18:30',
    status: 'SENT'
  },
  {
    id: 3,
    student_id: 'HS001',
    parent_id: 1,
    message: 'Nhà trường tổ chức họp phụ huynh vào cuối tháng.',
    sent_at: '2024-05-10 09:00',
    status: 'SENT'
  }
];
/* ================================================================= */

const inferCategory = (message) => {
  const msg = (message || '').toLowerCase();
  if (msg.includes('khẩn') || msg.includes('nghỉ học')) return 'URGENT';
  if (msg.includes('đi muộn') || msg.includes('điểm danh')) return 'ATTENDANCE';
  return 'INFO';
};

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [readIds, setReadIds] = useState(() => new Set());

  const enriched = notifications.map(n => ({
    ...n,
    category: inferCategory(n.message),
    title:
      inferCategory(n.message) === 'URGENT'
        ? 'Thông báo khẩn'
        : inferCategory(n.message) === 'ATTENDANCE'
          ? 'Thông báo điểm danh'
          : 'Thông báo chung',
    is_read: readIds.has(n.id)
  }));

  const filtered = filter === 'all' ? enriched : enriched.filter((n) => !n.is_read);

  const getIcon = (category) => {
    switch (category) {
      case 'URGENT':
        return <FaExclamationTriangle className="icon urgent" />;
      case 'ATTENDANCE':
        return <FaClock className="icon attendance" />;
      default:
        return <FaInfoCircle className="icon info" />;
    }
  };

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="notifications">
      <div className="notifications-card">
        {/* HEADER */}
        <div className="notifications-header">
          <div className="header-left">
            <h3>Thông báo từ trường</h3>
            <span className="badge">
              {enriched.filter((n) => !n.is_read).length} MỚI
            </span>
          </div>

          <div className="filter">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              TẤT CẢ
            </button>
            <button
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              CHƯA ĐỌC
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="notifications-list">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`notification-item 
                  ${isExpanded ? 'expanded' : ''}
                  ${!item.is_read ? 'unread' : ''}`}
              >
                <div
                  className="notification-main"
                  onClick={() => handleToggle(item.id)}
                >
                  <div className="icon-wrapper">
                    {getIcon(item.category)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-title">
                      <h5>{item.title}</h5>
                      <span>{item.sent_at}</span>
                    </div>

                    {!isExpanded && (
                      <p className="preview">
                        {item.message}
                      </p>
                    )}
                  </div>

                  <div className="chevron">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="notification-detail">
                    <p>{item.message}</p>
                    <div className="detail-footer">
                      <span>ID: #MSG_{item.id}</span>
                      <span className="seen">ĐÃ XEM</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="empty">
              <FaBell size={42} />
              <h4>Không có thông báo mới</h4>
              <p>Hộp thư của bạn hiện đang trống.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
