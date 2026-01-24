function AvatarModal({ show, onClose, avatars, selectedAvatar, onSelect }) {
    if (!show) return null;

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1">
            <div className="modal-backdrop-ac fade show" onClick={onClose}></div>
            <div className="modal-dialog modal-md">
                <div className="modal-content" style={{ color: '#fff' }}>
                    <div className="modal-header">
                        <div className="modal-icon">
                            <i className="far fa-user"></i>
                        </div>
                        <h5 className="modal-title">Select Avatar</h5>
                        <button type="button" className="btn btn-line-icon" onClick={onClose} aria-label="Close">
                            <span>×</span>
                        </button>
                    </div>
                    <div className="modal-body avatar-list" id="avatar-list">
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.id}
                                className={`avatar-item ${selectedAvatar.id === avatar.id ? 'active' : ''}`}
                                data-avatar={avatar.id}
                                onClick={() => onSelect(avatar)}
                            >
                                <img src={avatar.src} className="avatar" alt={avatar.alt} />
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary w-100" onClick={onClose}>
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AvatarModal;
