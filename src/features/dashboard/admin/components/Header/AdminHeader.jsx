import './AdminHeader.css';
import { FiGlobe, FiMoon, FiSun, FiUser, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../../../../../context/useTheme';
import { useLanguage } from '../../../../../context/useLanguage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const [showDrp, setShowDrp] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowDrp(false);
        navigate('/');
    }

    return (
        <header className="admin-header">
            <div className="admin-header-left">
                <span className="admin-header-title">
                    {t('adminDashboard')}
                </span>
            </div>

            <div className="admin-header-right">
                <button 
                    className="admin-header-icon-btn"
                    aria-label="Change language"
                    onClick={toggleLanguage}>
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>
                        {language === 'en' ? 'EN' : 'VI'}
                    </span>
                </button>

                <button 
                    className="admin-header-icon-btn"
                    aria-label="Toggle theme"
                    onClick={toggleTheme}>
                    {theme === 'dark' ? <FiSun /> : <FiMoon />}
                </button>

                <div className="admin-header-user-wrapper">
                    <div 
                        className="admin-header-user"
                        onClick={() => setShowDrp(!showDrp)}
                        style={{ cursor: 'pointer' }}
                    >
                        <FiUser />
                        <span className="admin-header-user-name">{t('admin')}</span>
                    </div>

                    {showDrp && (
                        <div className="admin-header-dropdown">
                            <div className="admin-header-dropdown-item" onClick={handleLogout}>
                                <FiLogOut />
                                <span>{t('logout')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


export default AdminHeader;