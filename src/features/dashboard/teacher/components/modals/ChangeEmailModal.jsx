import { useState } from 'react';

function ChangeEmailModal({ show, onClose, currentEmail }) {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newEmail || !password) {
            setError('Please fill in all fields');
            return;
        }
        // Handle email change logic
        console.log('Email change submitted:', { newEmail, password });
        onClose();
    };

    const handleClose = () => {
        setNewEmail('');
        setPassword('');
        setError('');
        onClose();
    };

    if (!show) return null;

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-backdrop-ac fade show" onClick={handleClose}></div>
            <div className="modal-dialog modal-md" role="document">
                <div className="modal-content" style={{ color: '#fff' }}>
                    <form onSubmit={handleSubmit} className="modal-content" style={{ color: '#fff' }}>
                        <div className="modal-header">
                            <div className="modal-icon">
                                <i className="far fa-at"></i>
                            </div>
                            <h5 className="modal-title">Change email</h5>
                            <button type="button" className="btn btn-line-icon" onClick={handleClose} aria-label="Close">
                                <span>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div className="error-summary alert alert-dismissible alert-danger">
                                    {error}
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="current-email">Current email</label>
                                <span className="form-control" id="current-email" disabled="">{currentEmail}</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="new-email">New email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="new-email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="modal-current-password">Current password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="modal-current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={handleClose}>Close</button>
                            <button type="submit" className="btn btn-primary">Change email</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangeEmailModal;
