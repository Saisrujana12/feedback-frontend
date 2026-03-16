import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { io } from 'socket.io-client';
import { useToast } from '../context/ToastContext';

const NotificationBell = ({ user }) => {
  const socketUrl = import.meta.env.VITE_API_URL;
  const addToast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Init WebSocket connect
    const newSocket = io(socketUrl || undefined);

    newSocket.on('connect', () => {
      console.log('Connected to notification server');
      newSocket.emit('join', user.id);
    });

    newSocket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for new notification
      let type = 'info';
      if (notif.type === 'status_changed') type = 'success';
      if (notif.type === 'reply') type = 'info';
      
      addToast(notif.message, type);
    });

    return () => newSocket.close();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data);
      setUnreadCount(res.data.data.filter(n => !n.isRead).length);
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 60000); // mins
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return `${Math.floor(diff/1440)}d ago`;
  };

  return (
    <div className="notification-wrapper" style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="nav-item" 
        style={{ border: 'none', background: 'transparent', width: '100%', justifyContent: 'flex-start', padding: '1rem 1.25rem', cursor: 'pointer' }}
      >
        <div style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', 
              color: 'white', borderRadius: '50%', width: '16px', height: '16px',
              fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', border: '2px solid var(--bg-sidebar)'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span>Notifications</span>
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-btn">Mark all read</button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">No new notifications</div>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                >
                  <div className={`notif-icon ${notif.type}`}>
                    {notif.type === 'status_changed' ? '🔄' : 
                     notif.type === 'upvote' ? '▲' : 
                     notif.type === 'comment' || notif.type === 'reply' ? '💬' : '🔔'}
                  </div>
                  <div className="notif-content">
                    <p>{notif.message}</p>
                    <span className="time">{timeAgo(notif.createdAt)}</span>
                  </div>
                  {!notif.isRead && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

