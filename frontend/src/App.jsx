import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Roadmap from './components/Roadmap';
import Leaderboard from './components/Leaderboard';
import NotificationBell from './components/NotificationBell';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthCallback from './components/AuthCallback';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('form');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('form');
  };

  const handleSubmitSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('list');
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    return user ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    if (loading) return <LoadingScreen />;
    return user ? <Navigate to="/" /> : children;
  };

  if (loading) return <LoadingScreen />;

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login onLogin={handleLogin} onSwitchToSignup={() => window.location.href = '/signup'} /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup onSignup={handleLogin} onSwitchToLogin={() => window.location.href = '/login'} /></PublicRoute>} />
          <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />
          <Route path="/" element={<ProtectedRoute><MainDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} refreshTrigger={refreshTrigger} onSubmitSuccess={handleSubmitSuccess} onLogout={handleLogout} theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} /></ProtectedRoute>} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

const LoadingScreen = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Initializing Premium Experience...</p>
  </div>
);

function MainDashboard({ user, activeTab, setActiveTab, refreshTrigger, onSubmitSuccess, onLogout, theme, toggleTheme }) {
  const navigate = useNavigate();
  return (
    <div className="dashboard-layout">
      {/* Premium Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span>Echo</span>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'form' ? 'active' : ''}`} onClick={() => setActiveTab('form')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            <span>Submit Feedback</span>
          </div>

          <div className={`nav-item ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            <span>Community Voice</span>
          </div>

          <div className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            <span>Roadmap</span>
          </div>

          <div className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            <span>Leaderboard</span>
          </div>

          <div className={`nav-item ${activeTab === 'mydash' ? 'active' : ''}`} onClick={() => setActiveTab('mydash')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>My Status</span>
          </div>

          {user?.role === 'admin' && (
            <div className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20V14" /></svg>
              <span>Command Center</span>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <NotificationBell user={user} />
            </div>
          )}
          <button className="theme-toggle-btn" onClick={toggleTheme} style={{ marginBottom: '1rem', width: '100%', padding: '0.8rem', borderRadius: '10px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-glass)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <div className="user-profile">
            <div className="user-avatar">{user.name.charAt(0)}</div>
            <div className="user-meta">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="logout-btn-premium" onClick={onLogout}>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-dashboard">
        <div className="animate-fade-in">
          {activeTab === 'form' && (
            <>
              <h1 className="page-title">Echo Your Vision</h1>
              <p className="page-subtitle">Your strategic insights fuel our platform evolution.</p>
              <FeedbackForm onSubmitSuccess={onSubmitSuccess} />
            </>
          )}
          {activeTab === 'list' && (
            <>
              <h1 className="page-title">Community Voice</h1>
              <p className="page-subtitle">Latest feeds from our strategic partners.</p>
              <FeedbackList refreshTrigger={refreshTrigger} user={user} />
            </>
          )}
          {activeTab === 'roadmap' && (
            <>
              <h1 className="page-title">Echo Roadmap</h1>
              <p className="page-subtitle">Tracking our strategic evolution and upcoming milestones.</p>
              <Roadmap />
            </>
          )}
          {activeTab === 'leaderboard' && (
            <>
              <h1 className="page-title">Community Leaderboard</h1>
              <p className="page-subtitle">Recognizing our most valuable contributors.</p>
              <Leaderboard />
            </>
          )}
          {activeTab === 'mydash' && (
            <>
              <h1 className="page-title">My Echo Dashboard</h1>
              <p className="page-subtitle">Personal tracking of all your strategic submissions.</p>
              <UserDashboard user={user} refreshTrigger={refreshTrigger} />
            </>
          )}
          {activeTab === 'admin' && user?.role === 'admin' && (
            <>
              <h1 className="page-title">Command Center</h1>
              <p className="page-subtitle">Advanced Administrative Overview and Controls.</p>
              <AdminDashboard refreshTrigger={refreshTrigger} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

