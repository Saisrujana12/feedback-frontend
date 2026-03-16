import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';

const CommentThread = ({ feedbackId, user }) => {
  const addToast = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // comment id being replied to
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [feedbackId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/api/comments/${feedbackId}`);
      setComments(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (parentId = null, text) => {
    if (!text.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addToast('Please login to comment', 'error');
        return;
      }

      const res = await API.post('/api/comments', {
        feedbackId,
        text,
        parentId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments([...comments, res.data.data]);
      
      if (parentId) {
        setReplyingTo(null);
        setReplyText('');
      } else {
        setNewComment('');
      }
      
      addToast('Comment added successfully', 'success');
    } catch (e) {
      addToast('Failed to post comment', 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this comment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove comment and any children
      setComments(prev => prev.filter(c => c._id !== id && c.parentId !== id));
      addToast('Comment deleted', 'success');
    } catch (e) {
      addToast('Failed to delete comment', 'error');
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 60000); // mins
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff/60)}h ago`;
    return `${Math.floor(diff/1440)}d ago`;
  };

  // Organize top-level and replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

  if (loading) return <div className="comments-loading">Loading discussion...</div>;

  return (
    <div className="comment-thread animate-fade-in">
      <h4 className="comment-header">Discussion ({comments.length})</h4>
      
      <div className="comment-input-area">
        <div className="user-avatar-small">{user?.name?.charAt(0) || '?'}</div>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Add to the discussion..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateComment(null, newComment)}
          />
          <button onClick={() => handleCreateComment(null, newComment)} disabled={!newComment.trim()}>
            Post
          </button>
        </div>
      </div>

      <div className="comments-list">
        {topLevelComments.map(comment => (
          <div key={comment._id} className="comment-item">
            <div className="comment-main">
              <div className="user-avatar-small">{comment.userId?.name?.charAt(0) || 'U'}</div>
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-author">{comment.userId?.name || 'Unknown User'}</span>
                  {comment.userId?.role === 'admin' && <span className="admin-badge">Admin</span>}
                  <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-actions">
                  <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}>Reply</button>
                  {(user?.id === comment.userId?._id || user?.role === 'admin') && (
                    <button onClick={() => handleDelete(comment._id)} className="delete-btn">Delete</button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply Input */}
            {replyingTo === comment._id && (
              <div className="reply-input-area">
                <input 
                  type="text" 
                  placeholder="Write a reply..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateComment(comment._id, replyText)}
                  autoFocus
                />
                <button onClick={() => handleCreateComment(comment._id, replyText)}>Reply</button>
                <button className="cancel-btn" onClick={() => setReplyingTo(null)}>Cancel</button>
              </div>
            )}

            {/* Nested Replies */}
            {getReplies(comment._id).length > 0 && (
              <div className="comment-replies">
                {getReplies(comment._id).map(reply => (
                  <div key={reply._id} className="comment-item reply">
                    <div className="user-avatar-small">{reply.userId?.name?.charAt(0) || 'U'}</div>
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="comment-author">{reply.userId?.name || 'Unknown User'}</span>
                        {reply.userId?.role === 'admin' && <span className="admin-badge">Admin</span>}
                        <span className="comment-time">{timeAgo(reply.createdAt)}</span>
                      </div>
                      <div className="comment-text">{reply.text}</div>
                      {(user?.id === reply.userId?._id || user?.role === 'admin') && (
                        <div className="comment-actions">
                          <button onClick={() => handleDelete(reply._id)} className="delete-btn">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentThread;

