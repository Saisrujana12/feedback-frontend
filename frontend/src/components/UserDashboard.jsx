import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import MyStatus from './MyStatus';

const UserDashboard = ({ user, refreshTrigger }) => {
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0 });

  useEffect(() => {
    fetchMyFeedback();
  }, [refreshTrigger]);

  const fetchMyFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Call our new secure backend route
      const response = await API.get('/api/feedback/my-feedback', config);
      const data = response.data.data;
      
      setMyFeedbacks(data);
      
      // Calculate Stats
      const pendingCount = data.filter(f => f.status === 'pending').length;
      const reviewedCount = data.filter(f => f.status === 'reviewed').length;
      
      setStats({
        total: data.length,
        pending: pendingCount,
        reviewed: reviewedCount
      });
      
    } catch (err) {
      setError('Failed to load your personal feedback history.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner"></div><p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading your secure dashboard...</p></div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <MyStatus user={user} />
      </div>

      <div className="stats-grid-premium">
        <div className="stat-glow-card">
          <h4>Total Submissions</h4>
          <div className="val">{stats.total}</div>
        </div>
        <div className="stat-glow-card">
          <h4>Awaiting Review</h4>
          <div className="val" style={{ color: '#f59e0b' }}>{stats.pending}</div>
        </div>
        <div className="stat-glow-card">
          <h4>Reviewed by Admin</h4>
          <div className="val" style={{ color: '#10b981' }}>{stats.reviewed}</div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          My Submission Ledger
        </h3>
        
        {error && <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
        
        {myFeedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <p>You haven't submitted any feedback yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Message</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myFeedbacks.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{formatDate(item.date)}</td>
                    <td style={{ padding: '1rem' }}>
                       <span className={`card-badge ${item.category === 'Bug Report' ? 'badge-violet' : 'badge-azure'}`} style={{ marginBottom: 0 }}>
                         {item.category}
                       </span>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{item.message}"</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: item.status === 'reviewed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: item.status === 'reviewed' ? '#10b981' : '#f59e0b',
                        border: `1px solid ${item.status === 'reviewed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                      }}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

