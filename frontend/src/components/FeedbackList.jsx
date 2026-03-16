import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import CommentThread from './CommentThread';
import ImageLightbox from './ImageLightbox';

const FeedbackList = ({ refreshTrigger, user }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New filtering/sorting states
  const [ratingFilter, setRatingFilter] = useState('All'); // 'All', '5', '4', '3', '2', '1'
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Fetch all feedbacks
  useEffect(() => {
    fetchFeedbacks();
  }, [refreshTrigger]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/api/feedback');
      setFeedbacks(response.data.data);
      setFilteredFeedbacks(response.data.data);
    } catch (err) {
      setError('Failed to load strategic feeds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Please login to support this initiative');
      
      const response = await API.put(`/api/feedback/${id}/upvote`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local state for immediate feedback
      setFeedbacks(prev => prev.map(f => f._id === id ? response.data.data : f));
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  // Apply filters and sorting when state changes
  useEffect(() => {
    let result = [...feedbacks];

    if (ratingFilter !== 'All') {
      result = result.filter(f => f.rating === parseInt(ratingFilter));
    }

    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });

    setFilteredFeedbacks(result);
  }, [ratingFilter, sortOrder, feedbacks]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star-icon ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
        <span className="rating-number">({rating}/5)</span>
      </div>
    );
  };

  // Get category badge color
  const getCategoryClass = (category) => {
    const categoryMap = {
      'General': 'category-general',
      'Suggestion': 'category-suggestion',
      'Bug Report': 'category-bug',
      'Compliment': 'category-compliment',
    };
    return categoryMap[category] || 'category-general';
  };

  // Get sentiment class
  const getSentimentClass = (sentiment) => {
    switch(sentiment) {
      case 'POSITIVE': return 'sentiment-positive';
      case 'NEUTRAL': return 'sentiment-neutral';
      case 'NEGATIVE': return 'sentiment-negative';
      default: return '';
    }
  };

  if (loading) return <div className="feedback-list-container"><p className="loading">Loading feedbacks...</p></div>;

  if (error) return <div className="feedback-list-container"><p className="error-message">{error}</p></div>;

  return (
    <div className="feedback-list-container">
      {/* Controls Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          <option value="All">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No feedback found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="feedback-grid-premium">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback._id} className="card-premium animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <span className={`card-badge ${feedback.category === 'Bug Report' ? 'badge-violet' : 'badge-azure'}`}>
                  {feedback.category}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {feedback.sentiment && (
                    <span className={`sentiment-badge ${getSentimentClass(feedback.sentiment)}`}>
                      {feedback.sentiment}
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.7rem',
                    color: feedback.status === 'completed' ? '#10b981' : 
                           feedback.status === 'in-progress' ? '#f59e0b' : 
                           feedback.status === 'planned' ? '#3b82f6' : '#8b949e',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    • {feedback.status}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {renderStars(feedback.rating)}
              </div>

              <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '600' }}>{feedback.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', fontFamily: 'monospace' }}>{feedback.email}</p>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                padding: '1rem',
                borderLeft: '2px solid var(--accent-primary)',
                marginBottom: '1.5rem'
              }}>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{feedback.message}"
                </p>
              </div>

              {feedback.tags && feedback.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {feedback.tags.map(tag => (
                    <span key={tag} className="tag-chip">{tag.replace('_', ' ')}</span>
                  ))}
                </div>
              )}

              {feedback.adminResponse && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px dashed rgba(59, 130, 246, 0.3)',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ color: 'var(--accent-primary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Echo Strategic Reply:</div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {feedback.adminResponse}
                  </p>
                </div>
              )}

              {feedback.attachmentUrl && (
                <div 
                  className="attachment-preview-mini"
                  onClick={() => setLightboxUrl(feedback.attachmentUrl)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', marginBottom: '1.5rem', border: '1px solid var(--border-glass)' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  <span style={{ fontSize: '0.8rem', color: '#f0f6fc' }}>View Attachment</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: 'auto', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    🕒 {formatDate(feedback.date)}
                  </span>
                  <button 
                    onClick={() => setActiveCommentId(activeCommentId === feedback._id ? null : feedback._id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    {activeCommentId === feedback._id ? 'Close' : 'Discuss'}
                  </button>
                </div>
                <button 
                  onClick={() => handleUpvote(feedback._id)}
                  className={`upvote-btn-premium ${feedback.upvotes?.includes(user?.id) ? 'active' : ''}`}
                >
                  <span style={{ fontSize: '1rem' }}>▲</span>
                  <span>{feedback.upvotes?.length || 0}</span>
                </button>
              </div>

              {activeCommentId === feedback._id && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                  <CommentThread feedbackId={feedback._id} user={user} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxUrl && <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  );
};

export default FeedbackList;

