import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get('/api/gamification/leaderboard');
        setUsers(res.data.data);
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="skeleton" style={{ height: '300px' }}></div>;

  return (
    <div className="leaderboard dashboard-card">
      <div className="card-header">
        <h3 className="card-title">🎖️ Top Contributors</h3>
      </div>
      <div className="leaderboard-list">
        {users.map((user, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={user._id} 
            className={`leaderboard-item ${index < 3 ? `top-${index + 1}` : ''}`}
          >
            <div className="rank">
              {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div className="user-info">
              <div className="user-avatar-small">{user.name.charAt(0)}</div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
            <div className="user-stats">
              <div className="mini-badges">
                {user.badges.slice(0, 3).map(b => (
                  <span key={b._id} title={b.name}>{b.icon}</span>
                ))}
                {user.badges.length > 3 && <span className="more-b">+{user.badges.length - 3}</span>}
              </div>
              <div className="points">{user.points} pts</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

