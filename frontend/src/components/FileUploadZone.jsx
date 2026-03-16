import React, { useState, useCallback } from 'react';

const FileUploadZone = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setError('');
    
    // Validate type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, GIF, and PDF allowed.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('📄 PDF Attachment');
    }

    if (onFileSelected) {
      onFileSelected(file);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    setError('');
    if (onFileSelected) onFileSelected(null);
  };

  return (
    <div className="file-upload-wrapper">
      {!preview ? (
        <div 
          className={`dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileUploadInput').click()}
        >
          <input 
            type="file" 
            id="fileUploadInput" 
            style={{ display: 'none' }} 
            onChange={handleFileInput}
            accept="image/jpeg,image/png,image/gif,application/pdf"
          />
          
          <div className="dropzone-content">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p>Drag & drop a screenshot, or <span>browse</span></p>
            <span className="dropzone-hints">Supports JPG, PNG, GIF, PDF (Max 5MB)</span>
          </div>
          
          {error && <div className="dropzone-error">{error}</div>}
        </div>
      ) : (
        <div className="file-preview-container">
          {preview.startsWith('data:image') ? (
            <img src={preview} alt="Attachment preview" className="file-preview-img" />
          ) : (
            <div className="file-preview-doc">{preview}</div>
          )}
          
          <button type="button" onClick={clearSelection} className="remove-file-btn">
            Change File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
