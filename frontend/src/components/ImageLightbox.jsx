import React from 'react';

const ImageLightbox = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <div className="lightbox-overlay animate-fade-in" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>&times;</button>
        {url.toLowerCase().endsWith('.pdf') ? (
          <div className="lightbox-pdf-message">
            <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <p>PDF Document Attached</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-primary-glow" style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 2rem', marginTop: '1rem', textDecoration: 'none' }}>Open PDF in New Tab</a>
          </div>
        ) : (
          <img src={url} alt="Full screen preview" className="lightbox-img" />
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
