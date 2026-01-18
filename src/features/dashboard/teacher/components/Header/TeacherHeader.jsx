import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../../context/useTheme';
import { useLanguage } from '../../../../../context/useLanguage';
import "./TeacherHeader.css"

const TeacherHeader = ({ onMenuToggle, pageTitle = 'Dashboard' }) => {
    const { theme, setDark, setLight } = useTheme();
    const navigate = useNavigate();

    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    const accountDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setIsAccountDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
    ];

    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(balance || 0);
    };

    return (
        <div className="dashboard-hd">
            <div className="header-row">
                {/* Mobile Menu Toggle */}
                <button
                    className="header-menu-toggle d-lg-none"
                    onClick={onMenuToggle}
                >
                    <i className="fas fa-bars"></i>
                </button>

                {/* Breadcrumb / Page Title */}
                <div className="header-start">
                    <nav className="breadcrumb">
                        <a href="/dashboard">{pageTitle}</a>
                    </nav>
                </div>

                <div className="header-end">

                    {/* Account Dropdown */}
                    <div
                        className="ui-dropdown"
                        ref={accountDropdownRef}
                    >
                        <button
                            className="btn-line-icon"
                            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                        >
                            <span className="btn-icon btn-avatar">
                                <i className="fas fa-user"></i>
                                <span className="avatar-dot"></span>
                            </span>
                            <span className="btn-chevron">
                                <i className={`fas fa-chevron-${isAccountDropdownOpen ? 'up' : 'down'}`}></i>
                            </span>
                        </button>

                        {/* Account Dropdown Menu */}
                        <div
                            id="home-settings"
                            aria-labelledby="dropdownAccount"
                            className={`dropdown-menu dd-menu ${isAccountDropdownOpen ? 'show' : ''}`}
                            style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px' }}
                        >
                            {/* User Info */}
                            <div className="acc-user">
                                <div style={{ width: '100%' }}>
                                    <div className="acc-name">User</div>
                                    <div className="acc-mail">user@example.com</div>
                                </div>
                                <a className="btn btn-primary" href="/account">
                                    Account
                                </a>
                            </div>

                            {/* Language Switcher */}
                            <div className="acc-section">
                                <span>Language</span>
                                <div className="lang-switcher">
                                    <span>English</span>
                                    <i className="fa-solid fa-angle-right"></i>
                                </div>
                            </div>

                            {/* Theme Mode Switcher */}
                            <div className="acc-section">
                                <span>Theme Mode</span>
                                <div className="switcher" data-active={theme}>
                                    <button
                                        className={`switcher-item light-btn ${theme === 'light' ? 'active' : ''}`}
                                        onClick={() => setLight()}
                                        aria-label="Light"
                                    >
                                        <i className="fas fa-sun"></i>
                                    </button>
                                    <button
                                        className={`switcher-item dark-btn ${theme === 'dark' ? 'active' : ''}`}
                                        onClick={() => setDark()}
                                        aria-label="Dark"
                                    >
                                        <i className="fas fa-moon"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Menu Links */}
                            <div className="acc-alt mt-1">
                                <ul className="dropdown-list">
                                    <li>
                                        <button
                                            className="dropdown-link"
                                            onClick={handleLogout}
                                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <span className="dropdown-icon text-danger">
                                                <i class="fa-solid fa-power-off"></i>
                                            </span>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHeader;
