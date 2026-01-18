import { NavLink, useLocation } from 'react-router-dom';
import "./TeacherSidebar.css"

const TeacherSidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/teacher', icon: 'fa-gauge', label: 'Dashboard' },

        { path: '/teacher/schedule', icon: 'fa-calendar-days', label: 'Schedule' },

        { path: '/teacher/teaching-classes', icon: 'fa-chalkboard-user', label: 'Teaching Classes' },

        { path: '/teacher/attendance', icon: 'fa-clipboard-check', label: 'Attendance' },

        { path: '/teacher/seating-chart', icon: 'fa-table-cells', label: 'Seating Chart' },

        { path: '/teacher/students', icon: 'fa-user-graduate', label: 'Students' },

        { path: '/teacher/announcements', icon: 'fa-bullhorn', label: 'Announcements' },

        { path: '/teacher/reports', icon: 'fa-chart-line', label: 'Reports' },
    ]


    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className="sidebar">
                <button
                    className="menu-toggle"
                    onClick={onToggleCollapse}
                    title="Collapse Sidebar"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                <div className="sidebar-head">
                    <NavLink to="/dashboard">
                        <div className="app-logo">
                            <img
                                src=""
                                alt="image"
                                className="big-logo"
                            />
                        </div>
                        <img
                            src=""
                            alt="image"
                            className="small-logo"
                        />
                    </NavLink>

                    <button
                        className="sidebar-toggle"
                        onClick={onClose}
                        title="Toggle Sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18"></path>
                        </svg>
                    </button>
                </div>

                <div className="sidebar-body">
                    <ul className="sidebar-menu-list">
                        {menuItems.map((item) => (
                            <li
                                key={item.path}
                                className={`sidebar-menu-item ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <NavLink to={item.path} onClick={onClose}>
                                    <div className="sidebar-menu-icon">
                                        <i className={`fa ${item.icon}`}></i>
                                    </div>
                                    <div className="sidebar-menu-text">
                                        {item.label}
                                        {item.badge && (
                                            <span className="badge">{item.badge}</span>
                                        )}
                                    </div>
                                    <div className="sidebar-menu-arrow">
                                        <i className="fa-solid fa-angle-right"></i>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default TeacherSidebar;
