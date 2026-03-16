import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';

const WidgetGenerator = () => {
  const addToast = useToast();
  const [token, setToken] = useState('');
  const [config, setConfig] = useState({
    buttonColor: '#8b5cf6',
    position: 'bottom-right',
    buttonLabel: 'Feedback',
    placeholder: 'Tell us what you think...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenAndConfig();
  }, []);

  const fetchTokenAndConfig = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      const res = await API.get('/api/widget/token', {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      setToken(res.data.data.token);
      if (res.data.data.config) {
        setConfig(res.data.data.config);
      }
    } catch (e) {
      console.error(e);
      addToast('Error fetching widget config', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const jwtToken = localStorage.getItem('token');
      await API.put('/api/widget/config', { config }, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      addToast('Widget configuration saved', 'success');
    } catch (e) {
      addToast('Error saving config', 'error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    addToast('Embed code copied to clipboard!', 'success');
  };

  const embedCode = `<script src="/widget.js"></script>\n<script>\n  EchoWidget.init({ token: '${token}' });\n</script>`;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="widget-generator dashboard-card animate-fade-in">
      <h3 className="card-title">Embeddable Feedback Widget</h3>
      <p style={{ color: '#8b949e', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Generate a ready-to-use widget to collect feedback directly from your external websites or web apps.
      </p>

      <div className="dashboard-grid-2col" style={{ gap: '2rem' }}>
        {/* Configuration Section */}
        <div className="widget-config">
          <h4 style={{ marginBottom: '1rem', color: '#f0f6fc' }}>Visual Settings</h4>
          
          <div className="form-group">
            <label>Button Label</label>
            <input 
              type="text" 
              value={config.buttonLabel}
              onChange={(e) => setConfig({...config, buttonLabel: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Input Placeholder</label>
            <input 
              type="text" 
              value={config.placeholder}
              onChange={(e) => setConfig({...config, placeholder: e.target.value})}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Button Color</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="color" 
                value={config.buttonColor}
                onChange={(e) => setConfig({...config, buttonColor: e.target.value})}
                style={{ width: '50px', height: '40px', cursor: 'pointer', background: 'transparent', border: 'none' }}
              />
              <span style={{ color: '#8b949e' }}>{config.buttonColor}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Position</label>
            <select 
              value={config.position}
              onChange={(e) => setConfig({...config, position: e.target.value})}
              className="form-input"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </select>
          </div>

          <button onClick={handleSaveConfig} className="btn-primary-glow" style={{ marginTop: '1rem' }}>
            Save Configuration
          </button>
        </div>

        {/* Integration & Preview Section */}
        <div className="widget-preview-area">
          <h4 style={{ marginBottom: '1rem', color: '#f0f6fc' }}>Installation</h4>
          <p style={{ color: '#8b949e', fontSize: '0.85rem', marginBottom: '1rem' }}>Paste this code just before the <code>&lt;/body&gt;</code> tag on your website.</p>
          
          <div style={{ position: 'relative' }}>
            <pre className="code-block" style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid #30363d', color: '#e5e7eb', overflowX: 'auto', fontSize: '0.85rem' }}>
              <code>{embedCode}</code>
            </pre>
            <button 
              onClick={copyToClipboard}
              style={{ position: 'absolute', top: '10px', right: '10px', background: '#30363d', border: 'none', color: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Copy
            </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #30363d', borderRadius: '8px', position: 'relative', height: '150px' }}>
            <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>Preview area</span>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              [config.position === 'bottom-left' ? 'left' : 'right']: '10px',
              backgroundColor: config.buttonColor,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
               ✨ {config.buttonLabel}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WidgetGenerator;

