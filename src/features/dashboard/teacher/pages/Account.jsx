import { useState } from 'react';
import ChangeEmailModal from '../components/modals/ChangeEmailModal';
import AvatarModal from '../components/modals/AvatarModal';
import './Account.css';

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
    { value: '-39600', label: '(UTC -11:00) Niue' },
    { value: '-36000', label: '(UTC -10:00) Hawaii-Aleutian Standard Time, Cook Islands, Tahiti' },
    { value: '-34200', label: '(UTC -9:30) Marquesas Islands' },
    { value: '-32400', label: '(UTC -9:00) Alaska Standard Time, Gambier Islands' },
    { value: '-28800', label: '(UTC -8:00) Pacific Standard Time, Clipperton Island' },
    { value: '-25200', label: '(UTC -7:00) Mountain Standard Time' },
    { value: '-21600', label: '(UTC -6:00) Central Standard Time' },
    { value: '-18000', label: '(UTC -5:00) Eastern Standard Time, Western Caribbean Standard Time' },
    { value: '-16200', label: '(UTC -4:30) Venezuelan Standard Time' },
    { value: '-14400', label: '(UTC -4:00) Atlantic Standard Time, Eastern Caribbean Standard Time' },
    { value: '-12600', label: '(UTC -3:30) Newfoundland Standard Time' },
    { value: '-10800', label: '(UTC -3:00) Argentina, Brazil, French Guiana, Uruguay' },
    { value: '-7200', label: '(UTC -2:00) South Georgia/South Sandwich Islands' },
    { value: '-3600', label: '(UTC -1:00) Azores, Cape Verde Islands' },
    { value: '0', label: '(UTC) Greenwich Mean Time, Western European Time' },
    { value: '3600', label: '(UTC +1:00) Central European Time, West Africa Time' },
    { value: '7200', label: '(UTC +2:00) Central Africa Time, Eastern European Time, Kaliningrad Time' },
    { value: '10800', label: '(UTC +3:00) Moscow Time, East Africa Time, Arabia Standard Time' },
    { value: '12600', label: '(UTC +3:30) Iran Standard Time' },
    { value: '14400', label: '(UTC +4:00) Azerbaijan Standard Time, Samara Time' },
    { value: '16200', label: '(UTC +4:30) Afghanistan' },
    { value: '18000', label: '(UTC +5:00) Pakistan Standard Time, Yekaterinburg Time' },
    { value: '19800', label: '(UTC +5:30) Indian Standard Time, Sri Lanka Time' },
    { value: '20700', label: '(UTC +5:45) Nepal Time' },
    { value: '21600', label: '(UTC +6:00) Bangladesh Standard Time, Bhutan Time, Omsk Time' },
    { value: '23400', label: '(UTC +6:30) Cocos Islands, Myanmar' },
    { value: '25200', label: '(UTC +7:00) Krasnoyarsk Time, Cambodia, Laos, Thailand, Vietnam' },
    { value: '28800', label: '(UTC +8:00) Australian Western Standard Time, Beijing Time, Irkutsk Time' },
    { value: '31500', label: '(UTC +8:45) Australian Central Western Standard Time' },
    { value: '32400', label: '(UTC +9:00) Japan Standard Time, Korea Standard Time, Yakutsk Time' },
    { value: '34200', label: '(UTC +9:30) Australian Central Standard Time' },
    { value: '36000', label: '(UTC +10:00) Australian Eastern Standard Time, Vladivostok Time' },
    { value: '37800', label: '(UTC +10:30) Lord Howe Island' },
    { value: '39600', label: '(UTC +11:00) Srednekolymsk Time, Solomon Islands, Vanuatu' },
    { value: '41400', label: '(UTC +11:30) Norfolk Island' },
    { value: '43200', label: '(UTC +12:00) Fiji, Gilbert Islands, Kamchatka Time, New Zealand Standard Time' },
    { value: '45900', label: '(UTC +12:45) Chatham Islands Standard Time' },
    { value: '46800', label: '(UTC +13:00) Samoa Time Zone, Phoenix Islands Time, Tonga' },
    { value: '50400', label: '(UTC +14:00) Line Islands' },
];

const languages = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
];

function Account() {
    const [activeTab, setActiveTab] = useState('security');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

    // Form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timezone, setTimezone] = useState('25200');
    const [language, setLanguage] = useState('en');
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [showTwoFAApprove, setShowTwoFAApprove] = useState(false);

    // Mock user data
    const user = {
        username: 'hoangmanh6889',
        email: 'hoangmanh6889@gmail.com',
        status: 'NEW'
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        // Handle password change logic
        console.log('Password change submitted');
    };

    const handleTimezoneChange = (e) => {
        e.preventDefault();
        console.log('Timezone saved:', timezone);
    };

    const handleLanguageChange = (e) => {
        e.preventDefault();
        console.log('Language saved:', language);
    };

    const handleGenerateApiKey = (e) => {
        e.preventDefault();
        console.log('Generating new API key...');
    };

    const handle2FAGenerate = (e) => {
        e.preventDefault();
        setShowTwoFAApprove(true);
        console.log('2FA code sent to email');
    };

    const handle2FAApprove = (e) => {
        e.preventDefault();
        console.log('2FA code submitted:', twoFACode);
        setTwoFAEnabled(true);
        setShowTwoFAApprove(false);
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
        setShowAvatarModal(false);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'security':
                return (
                    <div className="tab-pane fade show active" id="security" role="tabpanel">
                        <div className="tab-header">
                            <i class="fas fa-shield-alt"></i>
                            <span></span>
                        </div>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label htmlFor="current-password" className="control-label">Current password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="current-password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-password" className="control-label">New password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password" className="control-label">Confirm new password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Change password</button>
                        </form>
                    </div>
                );

            case 'twofa':
                return (
                    <div className="tab-pane fade show active" id="twofa" role="tabpanel">
                        <div className="tab-header">
                            <i className="fa fa-qrcode"></i>
                            <span>Two-factor authentication</span>
                        </div>

                        {!showTwoFAApprove ? (
                            <form onSubmit={handle2FAGenerate}>
                                <p>Email-based option to add an extra layer of protection to your account. When signing in you'll need to enter a code that will be sent to your email address.</p>
                                <button type="submit" className="btn btn-primary">
                                    {twoFAEnabled ? 'Disable' : 'Enable'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handle2FAApprove}>
                                <p>Please check your email and enter the code below.</p>
                                <div className="form-group">
                                    <label htmlFor="code" className="control-label">Code</label>
                                    <input
                                        type="text"
                                        id="code"
                                        className="form-control"
                                        value={twoFACode}
                                        onChange={(e) => setTwoFACode(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Enable</button>
                            </form>
                        )}
                    </div>
                );

            case 'timezone':
                return (
                    <div className="tab-pane fade show active" id="timezone" role="tabpanel">
                        {/* API Key Section */}
                        <div className="tab-header">
                            <i className="fas fa-file-code"></i>
                            <span>API key</span>
                        </div>
                        <form onSubmit={handleGenerateApiKey}>
                            <div className="form-group"></div>
                            <button type="submit" className="btn btn-primary">Generate new</button>
                        </form>

                        {/* Timezone Section */}
                        <div className="tab-header mt-5">
                            <i class="fas fa-globe-europe"></i>
                            <span>Timezone</span>
                        </div>
                        <form onSubmit={handleTimezoneChange}>
                            <div className="form-group">
                                <select
                                    className="form-select"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    {timezones.map((tz) => (
                                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>

                        {/* Language Section */}
                        <div className="tab-header mt-5">
                            <i class="fa-sharp fa-solid fa-language"></i>
                            <span>Language</span>
                        </div>
                        <form onSubmit={handleLanguageChange}>
                            <div className="form-group">
                                <select
                                    className="form-select"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="container-fluid container-dashboard-db">
            {/* Profile Header */}
            <div className="top-box">
                <div className="top-box-left">
                    <div
                        className="top-avatar"
                        title="Change Avatar"
                        onClick={() => setShowAvatarModal(true)}
                    >
                        <span data-sm="avatar">
                            <img src={selectedAvatar.src} className="avatar" alt={selectedAvatar.alt} />
                        </span>
                        <div className="pick-avatar">
                            <i className="fas fa-pencil"></i>
                        </div>
                    </div>
                    <div className="top-text">
                        <h4>
                            <span>{user.username}</span>
                            <div className="alert alert-warning">{user.status}</div>
                        </h4>
                        <div className="top-phone">
                            <span>
                                <i className="far fa-envelope primary-color mr-2"></i>
                                {user.email}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setShowEmailModal(true)}
                >
                    <i className="far fa-at me-2"></i>
                    <strong>Change email</strong>
                </button>
            </div>

            {/* Account Area */}
            <div className="account-area">
                {/* Tab Navigation */}
                <div className="account-menu">
                    <ul className="nav" role="tablist">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                                role="tab"
                            >
                                <i class="fas fa-shield-alt"></i>
                                Security
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="account-content card" style={{ color: '#fff' }}>
                    <div className="tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>

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
