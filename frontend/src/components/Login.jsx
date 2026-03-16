import React, { useState } from 'react';
import API from '../api/axiosConfig';
import GoogleAuthModal from './GoogleAuthModal';
import { useToast } from '../context/ToastContext';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const addToast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      addToast('Please fill in all fields', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await API.post('/api/auth/login', formData);
      const { token, user } = response.data.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      addToast(`Welcome back, ${user.name}!`, 'success');

      // Call parent callback
      if (onLogin) {
        onLogin(user);
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Login failed. Please check your credentials.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Mock Selection
  const handleGoogleAccountSelect = (account) => {
    setIsGoogleModalOpen(false);
    // Send standard redirect but include the chosen email as a query parameter
    // The backend mock route will parse this.
    window.location.href = `/api/auth/google/callback?mockEmail=${encodeURIComponent(account.email)}&mockName=${encodeURIComponent(account.name)}&mockRole=${encodeURIComponent(account.role)}`;
  };

  return (
    <div className="auth-container-premium">
      <div className="auth-card-premium animate-fade-in">
        <div className="auth-header">
          <div className="sidebar-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Feedback</span>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="premium-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
              style={{ marginBottom: 0 }}
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', marginLeft: '0.5rem' }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="premium-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{ marginBottom: 0 }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary-glow"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }}></div>
        </div>

        <button
          type="button"
          className="google-btn-premium"
          onClick={() => setIsGoogleModalOpen(true)}
        >
          <svg viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Sign up
          </button>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />
    </div>
  );
};

export default Login;

