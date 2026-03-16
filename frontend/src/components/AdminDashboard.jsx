import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import AnalyticsDashboard from './AnalyticsDashboard';
import TicketDetailModal from './TicketDetailModal';
import WidgetGenerator from './WidgetGenerator';

const AdminDashboard = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const addToast = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    categories: {},
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseInputs, setResponseInputs] = useState({}); // Tracking admin replies per ID
  const [chartData, setChartData] = useState([]);
  
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, tickets, widget
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Fetch feedbacks and calculate stats
  useEffect(() => {
    fetchFeedbacksAndStats();
  }, [refreshTrigger]);

  useEffect(() => {
    let result = [...feedbacks];
    
    // 1. Search filter
    if (searchTerm) {
      result = result.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 2. Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(f => f.category === categoryFilter);
    }
    
    // 3. Sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortOrder === 'highest') return b.rating - a.rating;
      if (sortOrder === 'lowest') return a.rating - b.rating;
      return 0;
    });

    setFilteredFeedbacks(result);
  }, [searchTerm, categoryFilter, sortOrder, feedbacks]);

  const exportToCSV = () => {
    if (filteredFeedbacks.length === 0) return addToast("No data available to export.", "error");
    
    const headers = ["ID", "Name", "Email", "Category", "Rating", "Message", "Status", "Date"];
    const csvRows = [headers.join(',')];
    
    filteredFeedbacks.forEach(f => {
      const row = [
        f._id,
        `"${f.name.replace(/"/g, '""')}"`,
        `"${f.email.replace(/"/g, '""')}"`,
        f.category,
        f.rating,
        `"${f.message.replace(/"/g, '""')}"`,
        f.status,
        new Date(f.date).toISOString()
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `feedback_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    addToast("Export successful! Initiating download.", "success");
  };

  const fetchFeedbacksAndStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/api/feedback');
      const data = response.data.data;
      setFeedbacks(data);
      setFilteredFeedbacks(data);

      // Calculate statistics
      const total = data.length;
      const averageRating = total > 0
        ? (data.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(2)
        : 0;

      // Count by category
      const categories = {};
      let pendingCount = 0;
      data.forEach((feedback) => {
        categories[feedback.category] = (categories[feedback.category] || 0) + 1;
        if (feedback.status === 'pending') pendingCount++;
      });

      setStats({
        total,
        averageRating,
        categories,
        pending: pendingCount,
      });

      // Prepare Chart Data (Aggregated by Date)
      const dateMap = {};
      data.forEach(f => {
        const d = new Date(f.date).toLocaleDateString();
        dateMap[d] = (dateMap[d] || 0) + 1;
      });
      const chartArr = Object.entries(dateMap).map(([date, count]) => ({ date, count })).slice(-10);
      setChartData(chartArr);

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/api/feedback/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        addToast("Feedback deleted successfully from the ledger.", "success");
        fetchFeedbacksAndStats();
      } catch (err) {
        addToast("Failed to delete feedback. Connection error.", "error");
      }
    }
  };

  const handleUpdateFeedback = async (id, status, adminResponse) => {
    try {
      const token = localStorage.getItem('token');
      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (adminResponse !== undefined) updatePayload.adminResponse = adminResponse;

      await API.put(`/api/feedback/${id}`, updatePayload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      addToast("Echo Platform updated successfully.", "success");
      setResponseInputs(prev => ({ ...prev, [id]: '' }));
      fetchFeedbacksAndStats();
    } catch (err) {
      addToast("Update failed. Strategic connection lost.", "error");
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderStars = (rating) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? '#fbbf24' : 'rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>★</span>
      ))}
    </div>
  );

  const Sparkline = () => (
    <div className="sparkline-container">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path className="sparkline-path" d="M0,30 Q15,5 30,25 T60,15 T90,35 L100,20" />
      </svg>
    </div>
  );

  if (loading) return <div className="admin-dashboard"><p className="loading">Processing Data...</p></div>;

  return (
    <div className="admin-dashboard animate-fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} className="back-btn" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
          ← Back to Dashboard
        </button>
        <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '12px' }}>
          <button 
            onClick={() => setActiveTab('analytics')}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'analytics' ? 'var(--accent-primary)' : 'transparent', color: 'white', cursor: 'pointer', transition: '0.2s' }}
          >Analytics</button>
          <button 
            onClick={() => setActiveTab('tickets')}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'tickets' ? 'var(--accent-primary)' : 'transparent', color: 'white', cursor: 'pointer', transition: '0.2s' }}
          >Ticket Ledger</button>
          <button 
            onClick={() => setActiveTab('widget')}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'widget' ? 'var(--accent-primary)' : 'transparent', color: 'white', cursor: 'pointer', transition: '0.2s' }}
          >Widget Settings</button>
        </div>
      </div>

      {activeTab === 'analytics' && <AnalyticsDashboard />}

      {activeTab === 'widget' && <WidgetGenerator />}

      {activeTab === 'tickets' && (
      <>
      {/* Top Metrics Row */}
      <div className="stats-grid-premium">
        <div className="stat-glow-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Network Load</h4>
            <span className="trend-indicator trend-up">+8.4% ↑</span>
          </div>
          <div className="val">{stats.total}</div>
          <Sparkline />
        </div>

        <div className="stat-glow-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>User Sentiment</h4>
            <span className="trend-indicator trend-up">{(stats.averageRating * 20).toFixed(0)}%</span>
          </div>
          <div className="val">{stats.averageRating}</div>
          <div className="progress-bar-premium" style={{ marginTop: '1.5rem' }}>
            <div className="progress-fill" style={{ width: `${(stats.averageRating / 5) * 100}%` }}></div>
          </div>
        </div>

        <div className="stat-glow-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Urgent Tasks</h4>
            <span className="pulse-online"></span>
          </div>
          <div className="val" style={{ color: stats.pending > 0 ? '#f59e0b' : 'white' }}>{stats.pending}</div>
          <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Queue status: {stats.pending > 0 ? 'Action Required' : 'Optimal'}
          </div>
        </div>
      </div>

      {/* Analytics Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem 2rem', height: '350px' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Submission Velocity</h4>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} />
              <YAxis stroke="var(--text-muted)" fontSize={10} />
              <Tooltip 
                contentStyle={{ background: '#0d1117', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--accent-primary)' }}
              />
              <Line type="monotone" dataKey="count" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem 2rem', height: '350px' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sentiment Distribution</h4>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={Object.entries(stats.categories).map(([name, value]) => ({ name, value }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {[ '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b' ].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ background: '#0d1117', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Ledger */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Feedback Ledger</h3>
            <div className="search-bar-premium">
              <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              <input
                type="text"
                placeholder="Search database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={exportToCSV}
              style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </button>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              <option value="All">All Entities</option>
              <option value="Bug Report">Incidents</option>
              <option value="Suggestion">Strategic</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '1.25rem 2rem' }}>Identity</th>
                <th style={{ padding: '1.25rem 1rem' }}>Classification</th>
                <th style={{ padding: '1.25rem 1rem' }}>Score</th>
                <th style={{ padding: '1.25rem 1rem' }}>Snapshot</th>
                <th style={{ padding: '1.25rem 1rem' }}>State</th>
                <th style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.map((f) => (
                <tr key={f._id} className="hover-row" style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{f.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{f.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span className={`card-badge ${f.category === 'Bug Report' ? 'badge-violet' : 'badge-azure'}`} style={{ fontSize: '0.6rem' }}>
                      {f.category}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>{renderStars(f.rating)}</td>
                  <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {f.message.substring(0, 20)}...
                    <div style={{ fontSize: '0.65rem', marginTop: '4px' }}>{formatDate(f.date)}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <select 
                        value={f.status} 
                        onChange={(e) => handleUpdateFeedback(f._id, e.target.value)}
                        className="status-selector-premium"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="planned">Planned</option>
                        <option value="in-progress">Building</option>
                        <option value="completed">Live</option>
                      </select>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div className="reply-box-premium">
                      <input 
                        type="text" 
                        placeholder={f.adminResponse || "Add strategic reply..."}
                        value={responseInputs[f._id] || ''}
                        onChange={(e) => setResponseInputs({...responseInputs, [f._id]: e.target.value})}
                      />
                      <button onClick={() => handleUpdateFeedback(f._id, null, responseInputs[f._id])}>Send</button>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => setSelectedTicketId(f._id)} 
                        style={{ padding: '8px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', cursor: 'pointer', transition: '0.2s' }}
                        title="Manage Ticket"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button onClick={() => handleDelete(f._id)} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef444433', color: '#ef4444', cursor: 'pointer', transition: '0.2s' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFeedbacks.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No matching records found in the ledger.
            </div>
          )}
        </div>
      </div>
      </>
      )}

      {selectedTicketId && (
        <TicketDetailModal 
          ticketId={selectedTicketId} 
          onClose={() => {
            setSelectedTicketId(null);
            fetchFeedbacksAndStats();
          }} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;

