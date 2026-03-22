import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { validateName, validateEmail, validatePassword } from '../utils/formValidation';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('feedback_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    
    if (emailErr) { toast.error(emailErr); return false; }
    if (passErr) { toast.error(passErr); return false; }

    // Mock login logic
    if (email === 'admin@system.com' && password === 'admin') {
      const adminUser = { id: 'admin1', name: 'System Admin', email, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('feedback_user', JSON.stringify(adminUser));
      toast.success('Welcome back, Admin!');
      return true;
    }
    
    // Check local storage for registered users
    const users = JSON.parse(localStorage.getItem('feedback_users') || '[]');
    const existing = users.find(u => u.email === email && u.password === password);
    
    if (existing) {
      const { password: _, ...userData } = existing;
      setUser(userData);
      localStorage.setItem('feedback_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const signup = (name, email, password) => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    
    if (nameErr) { toast.error(nameErr); return false; }
    if (emailErr) { toast.error(emailErr); return false; }
    if (passErr) { toast.error(passErr); return false; }

    const users = JSON.parse(localStorage.getItem('feedback_users') || '[]');
    if (users.find(u => u.email === email)) {
      toast.error('Email already in use');
      return false;
    }
    
    const newUser = { id: Date.now().toString(), name, email, password, role: 'user' };
    users.push(newUser);
    localStorage.setItem('feedback_users', JSON.stringify(users));
    
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('feedback_user', JSON.stringify(userData));
    toast.success('Account created successfully!');
    return true;
  };

  const loginWithGoogle = (account) => {
    // Mock Google Login from the simulated Chooser
    const mockGoogleUser = {
      id: `google_${Date.now()}`,
      name: account?.name || 'Google User',
      email: account?.email || 'user@gmail.com',
      role: 'user',
      avatar: account?.avatar || 'G'
    };
    setUser(mockGoogleUser);
    localStorage.setItem('feedback_user', JSON.stringify(mockGoogleUser));
    toast.success(`Successfully logged in as ${mockGoogleUser.name}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('feedback_user');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
