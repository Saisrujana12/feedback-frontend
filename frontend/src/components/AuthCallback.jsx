import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      try {
        // Decode token to get user info (simple decode, not verify)
        const payload = JSON.parse(atob(token.split('.')[1]));

        const user = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Call parent callback
        if (onLogin) {
          onLogin(user);
        }

        // Redirect to main app
        navigate('/');
      } catch (error) {
        console.error('Error processing auth callback:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, onLogin]);

  return (
    <div className="auth-callback">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
