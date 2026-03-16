import React, { useState } from 'react';
import API from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';
import FileUploadZone from './FileUploadZone';

const FeedbackForm = ({ onSubmitSuccess }) => {
  const addToast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0,
    category: 'General',
  });

  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle star rating clicks
  const handleRating = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.message || formData.rating === 0) {
      addToast('Please fill in all fields and select a rating', 'error');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let attachmentUrl = null;

      if (attachment) {
        addToast('Uploading attachment...', 'info');
        const formData = new FormData();
        formData.append('attachment', attachment);
        
        const uploadRes = await API.post('/api/feedback/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (uploadRes.data.success) {
          attachmentUrl = uploadRes.data.data.url;
        }
      }

      const payload = { ...formData, attachmentUrl };

      const response = await API.post('/api/feedback', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      addToast('Your feedback has been transmitted securely. Thank you!', 'success');
      
      setFormData({
        name: '',
        email: '',
        message: '',
        rating: 0,
        category: 'General',
      });
      setAttachment(null);

      // Call parent callback
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      addToast(
        err.response?.data?.message || 'Failed to submit feedback. Please try again.', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <form onSubmit={handleSubmit} className="feedback-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              id="name"
              name="name"
              className="premium-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="email"
              id="email"
              name="email"
              className="premium-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <select
            id="category"
            name="category"
            className="premium-input"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ appearance: 'none', background: 'rgba(255, 255, 255, 0.03) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238b949e\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 1rem center' }}
          >
            <option value="General">General Inquiry</option>
            <option value="Suggestion">Feature Suggestion</option>
            <option value="Bug Report">Technical Issue / Bug</option>
            <option value="Compliment">Praise / Compliment</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <textarea
            id="message"
            name="message"
            className="premium-input"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your experience in detail..."
            rows="6"
            required
            style={{ minHeight: '150px', resize: 'vertical' }}
          ></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Attachment (Optional)</label>
          <FileUploadZone onFileSelected={(file) => setAttachment(file)} />
        </div>

        <div className="form-group" style={{ marginBottom: '2.5rem' }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '500' }}>How would you rate your experience?</label>
          <div className="star-rating" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${formData.rating >= star ? 'active' : ''}`}
                onClick={() => handleRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  color: formData.rating >= star ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  transform: formData.rating >= star ? 'scale(1.1)' : 'scale(1)',
                  filter: formData.rating >= star ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))' : 'none'
                }}
              >
                ★
              </button>
            ))}
            <span style={{ marginLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {formData.rating > 0 ? `${formData.rating} / 5` : 'Rate us'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary-glow"
          disabled={loading}
          style={{ padding: '1.25rem' }}
        >
          {loading ? 'Transmitting Data...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;

