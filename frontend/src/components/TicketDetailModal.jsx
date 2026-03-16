import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';

const TicketDetailModal = ({ ticketId, onClose }) => {
  const addToast = useToast();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');

  useEffect(() => {
    fetchTicketData();
  }, [ticketId]);

  const fetchTicketData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [ticketRes, repliesRes] = await Promise.all([
        API.get(`/api/feedback/${ticketId}`, { headers }),
        API.get(`/api/tickets/${ticketId}/replies`, { headers })
      ]);
      
      setTicket(ticketRes.data.data);
      setReplies(repliesRes.data.data);
    } catch (e) {
      addToast('Error loading ticket details', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await API.patch(`/api/tickets/${ticketId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket({ ...ticket, status: newStatus });
      addToast(`Status updated to ${newStatus}`, 'success');
    } catch (e) {
      addToast('Error updating status', 'error');
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    try {
      const token = localStorage.getItem('token');
      await API.patch(`/api/tickets/${ticketId}/priority`, { priority: newPriority }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicket({ ...ticket, priority: newPriority });
      addToast(`Priority updated`, 'success');
    } catch (error) {
      addToast('Error updating priority', 'error');
    }
  };

  const submitReply = async () => {
    if (!newReply.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await API.post(`/api/tickets/${ticketId}/reply`, { text: newReply }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // refetch ticket for the new admin response to show
      fetchTicketData();
      setNewReply('');
      addToast('Reply sent successfully', 'success');
    } catch (e) {
      addToast('Error sending reply', 'error');
    }
  };

  if (loading) return (
    <div className="modal-overlay">
      <div className="modal-content loader-centered"><div className="loader"></div></div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in ticket-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ticket Details</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="ticket-body">
          <div className="ticket-main-info">
            <div className="ticket-meta-row">
              <span className={`status-badge ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
              <span className="category-badge">{ticket.category}</span>
              {ticket.sentiment && (
                <span className={`sentiment-badge ${ticket.sentiment.toLowerCase()}`}>
                  {ticket.sentiment}
                </span>
              )}
            </div>
            
            <h3 className="ticket-message">"{ticket.message}"</h3>
            
            <div className="ticket-author-info">
              <div><strong>From:</strong> {ticket.name} ({ticket.email})</div>
              <div><strong>Rating:</strong> {ticket.rating}/5 ⭐</div>
              <div><strong>Submitted:</strong> {new Date(ticket.date).toLocaleString()}</div>
            </div>

            {ticket.attachmentUrl && (
              <div className="ticket-attachment">
                <strong>Attachment:</strong>
                <a href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                  View Attachment
                </a>
              </div>
            )}
            
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="ticket-ai-tags">
                <strong>AI Tags:</strong>
                <div className="tags-container">
                  {ticket.tags.map(tag => <span key={tag} className="ai-tag">{tag}</span>)}
                </div>
              </div>
            )}
          </div>

          <div className="ticket-controls dashboard-card">
            <h4>Management</h4>
            
            <div className="control-group">
              <label>Update Status</label>
              <div className="status-buttons">
                {['pending', 'in-progress', 'completed'].map(s => (
                  <button 
                    key={s}
                    className={`status-btn ${ticket.status === s ? 'active' : ''} ${s}`}
                    onClick={() => handleStatusChange(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label>Priority</label>
              <select className="form-input" value={ticket.priority || 'Medium'} onChange={handlePriorityChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="ticket-replies-section">
          <h4>Admin Conversation History</h4>
          
          <div className="replies-list">
            {replies.length === 0 ? <p className="no-data">No replies yet.</p> : null}
            {replies.map(reply => (
              <div key={reply._id} className="admin-reply-item">
                <div className="reply-meta">
                  <span className="reply-author">Admin: {reply.adminId?.name || 'Unknown'}</span>
                  <span className="reply-date">{new Date(reply.createdAt).toLocaleString()}</span>
                </div>
                <div className="reply-text">{reply.text}</div>
              </div>
            ))}
          </div>

          <div className="reply-inputbox">
            <textarea 
              placeholder="Write a reply... (This will notify the user via email)"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="form-input"
              rows="3"
            />
            <button onClick={submitReply} className="btn-primary-glow" disabled={!newReply.trim()}>
              Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;

