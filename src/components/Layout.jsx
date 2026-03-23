import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MessageSquare, LayoutDashboard, Settings, LogOut, Sun, Moon, Bell, AlignStartVertical, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Chatbot from './Chatbot';
import Footer from './Footer';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Simulate "daily" notifications
  useEffect(() => {
    if (user) {
      const lastCheck = localStorage.getItem('last_notif_date');
      const today = new Date().toDateString();
      
      if (lastCheck !== today) {
        setTimeout(() => {
          toast.success("You have 3 new updates to your feedback today!");
          localStorage.setItem('last_notif_date', today);
        }, 3000);
      }
    }
  }, [user]);

  const mockNotifications = [
    { id: 1, text: "Your feedback 'Dark Mode' was marked as In Progress.", time: "2h ago" },
    { id: 2, text: "Admin left a comment on your ticket.", time: "5h ago" },
    { id: 3, text: "System maintenance scheduled for tonight.", time: "1d ago" },
  ];

  return (
    <div className="min-h-screen app-background flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      <header className="glass-nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:scale-105 transition-all shadow-lg">
            <MessageSquare size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-gray-600 dark:from-white dark:to-gray-400">
            FeedbackVortex
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/board" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors hidden sm:block">
            Roadmap
          </Link>
          <Link to="/feedback" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors hidden sm:block">
            Give Feedback
          </Link>
          
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors outline-none" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!user ? (
            <div className="flex gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-lg shadow-indigo-500/25 transition-all">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors outline-none"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0f0f13]"></span>
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-12 right-12 w-80 glass-card rounded-2xl overflow-hidden shadow-2xl z-50">
                  <div className="p-4 border-b border-black/5 dark:border-white/10 font-bold flex justify-between">
                    <span>Notifications</span>
                    <span className="text-indigo-500 text-sm font-medium cursor-pointer">Mark all read</span>
                  </div>
                  <ul className="max-h-64 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
                    {mockNotifications.map(n => (
                      <li key={n.id} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                        <p className="text-sm font-medium mb-1">{n.text}</p>
                        <p className="text-xs text-gray-500">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {user.role === 'admin' && (
                <Link to="/admin" className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Admin Dashboard">
                  <Settings size={20} />
                </Link>
              )}
              <Link to="/dashboard" className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="User Dashboard">
                <LayoutDashboard size={20} />
              </Link>
              <Link to="/settings" className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Account Settings">
                <UserCircle size={20} />
              </Link>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-sm text-white shadow-lg border border-black/10 dark:border-white/20 ml-2">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <button onClick={handleLogout} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Log Out">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex flex-col relative z-10 transition-colors duration-300">
        <Outlet />
      </main>

      <Footer />
      
      {/* Decorative background elements that persist behind router pages */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>
      <Chatbot />
    </div>
  );
}
