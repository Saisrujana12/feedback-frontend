import React from 'react';

const GoogleAuthModal = ({ isOpen, onClose, onSelectAccount }) => {
    if (!isOpen) return null;

    const mockAccounts = [
        { email: 'vineel@gmail.com', name: 'Vineel Krishna', role: 'admin', initial: 'V' },
        { email: 'user@example.com', name: 'Test User', role: 'user', initial: 'T' },
        { email: 'admin@feedback.system', name: 'System Admin', role: 'admin', initial: 'S' }
    ];

    return (
        <div className="premium-overlay" onClick={onClose}>
            <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                <div className="google-modal-header">
                    <svg className="google-logo" viewBox="0 0 24 24" width="48" height="48">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <h3>Choose an account</h3>
                    <p>to continue to <strong>Feedback System</strong></p>
                </div>

                <div className="google-accounts-list">
                    {mockAccounts.map((account) => (
                        <div
                            key={account.email}
                            className="google-account-item"
                            onClick={() => onSelectAccount(account)}
                        >
                            <div className="account-avatar">{account.initial}</div>
                            <div className="account-details">
                                <div className="account-name">{account.name}</div>
                                <div className="account-email">{account.email}</div>
                            </div>
                        </div>
                    ))}

                    <div className="google-account-item">
                        <div className="account-avatar" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#8b949e" d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm1 14h-2v-3H8v-2h3V8h2v3h3v2h-3v3z" />
                            </svg>
                        </div>
                        <div className="account-details">
                            <div className="account-name">Use another account</div>
                        </div>
                    </div>
                </div>

                <div className="google-modal-footer">
                    <p>To continue, Google will share your name, email address, and profile picture with Feedback System. This is a <strong>MOCKED</strong> authentication flow for testing.</p>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthModal;
