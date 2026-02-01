// Account.jsx
import { useState } from 'react';
import {
    FiUser,
    FiMail,
    FiShield,
    FiLock,
    FiGlobe,
    FiKey,
} from 'react-icons/fi';
import ChangeEmailModal from '../components/modals/ChangeEmailModal';
import AvatarModal from '../components/modals/AvatarModal';
import './Account.css';

// Import admin components
import Card from '../../admin/components/ui/Card';
import { Pill } from '../../admin/components/ui/Pills';

// Avatar options
const avatars = [
    { id: 1, src: 'https://storage.perfectcdn.com/j71eqe/9ux9lbtkpqgitpjw.png', alt: 'Avatar 1' },
    { id: 2, src: 'https://storage.perfectcdn.com/j71eqe/4ug7klaskcd13rzg.png', alt: 'Avatar 2' },
    { id: 3, src: 'https://storage.perfectcdn.com/j71eqe/fsai26g7j0mh6msl.png', alt: 'Avatar 3' },
    { id: 4, src: 'https://storage.perfectcdn.com/j71eqe/jt77hrfbuty69ejf.png', alt: 'Avatar 4' },
    { id: 5, src: 'https://storage.perfectcdn.com/j71eqe/rmd67ygnz97geyyu.png', alt: 'Avatar 5' },
    { id: 6, src: 'https://storage.perfectcdn.com/j71eqe/1lek6noug0pfexgu.png', alt: 'Avatar 6' },
    { id: 7, src: 'https://storage.perfectcdn.com/j71eqe/h1k22cdxroc3cogd.png', alt: 'Avatar 7' },
    { id: 8, src: 'https://storage.perfectcdn.com/j71eqe/m3b4tiojdonxkios.png', alt: 'Avatar 8' },
];

// Timezone options
const timezones = [
    { value: '-43200', label: '(UTC -12:00) Baker/Howland Island' },
    { value: '0', label: '(UTC) Greenwich Mean Time' },
    { value: '25200', label: '(UTC +7:00) Vietnam' },
    { value: '28800', label: '(UTC +8:00) Beijing Time' },
];

const languages = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' },
];

function Account() {
    const [activeTab, setActiveTab] = useState('security');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timezone, setTimezone] = useState('25200');
    const [language, setLanguage] = useState('vi');

    const user = {
        username: 'teacher_demo',
        email: 'teacher@school.edu.vn',
        status: 'ACTIVE',
        fullName: 'Nguyễn Văn A',
        role: 'Giáo viên',
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        console.log('Password change submitted');
    };

    const handleSettingsSave = (e) => {
        e.preventDefault();
        console.log('Settings saved:', { timezone, language });
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        setShowAvatarModal(false);
    };

    const tabs = [
        { id: 'security', label: 'Bảo mật', icon: <FiShield /> },
        { id: 'settings', label: 'Cài đặt', icon: <FiGlobe /> },
    ];

    return (
        <div className="admin-dash">
            {/* Profile Header */}
            <div className="admin-dash__top">
                <div className="admin-dash__title">
                    <div
                        className="profile-avatar-wrap"
                        onClick={() => setShowAvatarModal(true)}
                        title="Thay đổi avatar"
                    >
                        <img
                            src={selectedAvatar.src}
                            alt={selectedAvatar.alt}
                            className="profile-avatar"
                        />
                        <div className="avatar-edit-icon">
                            <FiUser size={12} />
                        </div>
                    </div>
                    <div className="admin-dash__titleText">
                        <div className="h1">{user.fullName}</div>
                        <div className="sub">
                            <FiMail size={14} /> {user.email}
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <Pill tone={user.status === 'ACTIVE' ? 'good' : 'warn'}>
                        {user.status === 'ACTIVE' ? 'Đang hoạt động' : user.status}
                    </Pill>
                    <button
                        className="btn btn--primary"
                        onClick={() => setShowEmailModal(true)}
                    >
                        <FiMail size={16} />
                        Đổi email
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="tabs-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`chip ${activeTab === tab.id ? 'chip--on' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'security' && (
                <Card
                    title="Đổi mật khẩu"
                    icon={<FiLock />}
                    subtitle="Cập nhật mật khẩu đăng nhập của bạn"
                >
                    <form onSubmit={handlePasswordChange} className="account-form">
                        <div className="form-group">
                            <label className="filterLabel">Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                className="textInput"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Nhập mật khẩu hiện tại"
                            />
                        </div>
                        <div className="form-group">
                            <label className="filterLabel">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="textInput"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>
                        <div className="form-group">
                            <label className="filterLabel">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                className="textInput"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                        </div>
                        <button type="submit" className="btn btn--primary">
                            <FiKey size={16} />
                            Đổi mật khẩu
                        </button>
                    </form>
                </Card>
            )}

            {activeTab === 'settings' && (
                <Card
                    title="Cài đặt chung"
                    icon={<FiGlobe />}
                    subtitle="Múi giờ và ngôn ngữ"
                >
                    <form onSubmit={handleSettingsSave} className="account-form">
                        <div className="form-group">
                            <label className="filterLabel">Múi giờ</label>
                            <select
                                className="select"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                {timezones.map((tz) => (
                                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="filterLabel">Ngôn ngữ</label>
                            <select
                                className="select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                {languages.map((lang) => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn--primary">
                            Lưu cài đặt
                        </button>
                    </form>
                </Card>
            )}

            {/* Modals */}
            <ChangeEmailModal
                show={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                currentEmail={user.email}
            />

            <AvatarModal
                show={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                avatars={avatars}
                selectedAvatar={selectedAvatar}
                onSelect={handleAvatarSelect}
            />
        </div>
    );
}

export default Account;
