import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./SignIn.css";

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        whatsapp: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        navigate('/admin');
    };

    return (
        <div className="signin1t-page">
            <div className="signin1t-inner">
                <div className="signin1t-wrapper">
                    <div className="signin1t-container">
                        <div className="signin1t-content">
                            <div className="signin1t-first">
                                <div className="signin1t-first-bg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1200px" height="250"
                                        preserveAspectRatio="none" viewBox="0 0 1440 250">

                                        <g mask="url(#SvgjsMask1003)" fill="none">
                                            <path d="M36 250L286 0L604 0L354 250z" fill="url(#blackGradient1)" />
                                            <path d="M258.6 250L508.6 0L634.6 0L384.6 250z" fill="url(#blackGradient1)" />
                                            <path d="M484.2 250L734.2 0L956.2 0L706.2 250z" fill="url(#blackGradient1)" />
                                            <path d="M740.8 250L990.8 0L1311.8 0L1061.8 250z" fill="url(#blackGradient1)" />

                                            <path d="M1428 250L1178 0L866 0L1116 250z" fill="url(#blackGradient2)" />
                                            <path d="M1157.4 250L907.4 0L788.9 0L1038.9 250z" fill="url(#blackGradient2)" />
                                            <path d="M961.8 250L711.8 0L572.3 0L822.3 250z" fill="url(#blackGradient2)" />
                                            <path d="M691.2 250L441.2 0L214.7 0L464.7 250z" fill="url(#blackGradient2)" />

                                            <path d="M1199 250L1440 9L1440 250z" fill="url(#blackGradient1)" />
                                            <path d="M0 250L241 250L0 9z" fill="url(#blackGradient2)" />
                                        </g>

                                        <defs>
                                            <mask id="SvgjsMask1003">
                                                <rect width="1440" height="250" fill="white" />
                                            </mask>

                                            <linearGradient id="blackGradient1" x1="0%" y1="100%" x2="100%" y2="0%">
                                                <stop offset="0" stop-color="#000" />
                                                <stop offset="0.66" stop-color="#000" stop-opacity="0" />
                                            </linearGradient>

                                            <linearGradient id="blackGradient2" x1="100%" y1="100%" x2="0%" y2="0%">
                                                <stop offset="0" stop-color="#000" />
                                                <stop offset="0.66" stop-color="#000" stop-opacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="signin1t-logo">
                                </div>
                                <div className="signin1t-highlights">
                                    <div className="shl-column">
                                        <div className="shl-item">
                                            <div className="shl-content">
                                                <div className="shl-title">
                                                    <h3>Accurate Fingerprint Attendance</h3>
                                                </div>
                                                <div className="shl-text">
                                                    Ensure precise and reliable student attendance using fingerprint recognition, eliminating manual errors and fraud.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shl-item">
                                            <div className="shl-content">
                                                <div className="shl-title">
                                                    <h3>No Proxy Attendance</h3>
                                                </div>
                                                <div className="shl-text">
                                                    Each fingerprint is unique, preventing students from checking in on behalf of others.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shl-column">
                                        <div className="shl-item shl-border">
                                            <div className="shl-content">
                                                <div className="shl-title">
                                                    <h3>Secure Data System</h3>
                                                </div>
                                                <div className="shl-text">
                                                    All student information and attendance records are securely encrypted and safely stored.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shl-item shl-border">
                                            <div className="shl-content">
                                                <div className="shl-title">
                                                    <h3>Multi-Role Management</h3>
                                                </div>
                                                <div className="shl-text">
                                                    Easily manage administrators, teachers, and classes with powerful monitoring and reporting tools.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="signin1t-copyright">FingerprintPro © 2025 All rights reserved.</div>
                            </div>
                            <div className="signin1t-last">
                                <div className="signin1t-form">
                                    <div className="signin1t-top text-center">
                                        <h1>Sign in to <span>Fingerprint Pro !</span></h1>
                                        <p>Your information is not shared with third parties.</p>
                                    </div>
                                    <div className="signin1t-form-wrapper">
                                        <form onSubmit={handleSubmit}>
                                            <div className="signin1t-hr">
                                                <span></span>
                                            </div>
                                            <div className="signin1t-fields">
                                                <div className="form-group">
                                                    <label htmlFor="username">Username</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="password">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="signin1t-buttons">
                                                <button type="submit" className="btn btn-primary w-100">Sign up</button>
                                            </div>
                                        </form>
                                        <div className="signin1t-again">
                                            Forgot your password? <Link to="/reset-password">Reset Password</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SignIn;
