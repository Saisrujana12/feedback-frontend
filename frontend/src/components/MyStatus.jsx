import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { motion } from 'framer-motion';

const MyStatus = ({ user }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/api/gamification/my-status', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStatus(res.data.data);
      } catch (e) {
        console.error('Error fetching gamification stats:', e);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchStatus();
  }, [user]);

  if (loading) return <div className="skeleton" style={{ height: '150px' }}></div>;
  if (!status) return null;

  const earnedIds = status.earnedBadges.map(b => b._id);

  return (
    <div className="mystatus-card dashboard-card outline-glow animate-fade-in">
      <div className="status-header">
        <div className="points-display">
          <span className="points-number">{status.points}</span>
          <span className="points-label">Reputation Points</span>
        </div>
        <div className="level-badge">
          {status.points < 50 ? 'Beginner' : status.points < 150 ? 'Contributor' : 'Expert'}
        </div>
      </div>

      <div className="badges-section">
        <h4 className="section-title">My Badges</h4>
        <div className="badges-grid">
          {status.allBadges.map(badge => {
            const isEarned = earnedIds.includes(badge._id);
            return (
              <motion.div 
                key={badge._id}
                whileHover={{ scale: 1.05 }}
                className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
                title={badge.description}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyStatus;

