import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, Shield, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSave = () => {
    const updatedUser = { ...user, name };
    setUser(updatedUser);
    localStorage.setItem('feedback_user', JSON.stringify(updatedUser));
    toast.success('Profile settings updated successfully!');
  };

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Please log in to view settings.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto w-full pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your profile and preferences.</p>
      </header>

      <div className="space-y-6">
        
        {/* Profile Section */}
        <section className="glass-card rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <User className="text-indigo-500" />
            <h2 className="text-xl font-bold">Public Profile</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold relative group cursor-pointer overflow-hidden shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={24} />
                </div>
              </div>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline">Change Photo</span>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Display Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  value={user.email}
                  readOnly
                  className="w-full glass-input rounded-xl py-3 px-4 bg-black/5 dark:bg-white/5 opacity-70 cursor-not-allowed font-medium text-gray-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="glass-card rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-orange-500" />
            <h2 className="text-xl font-bold">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Ticket Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails when an admin replies or changes the status.</p>
              </div>
              <input 
                type="checkbox" 
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="w-5 h-5 accent-indigo-600"
              />
            </label>
            
            <label className="flex items-center justify-between p-4 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Product Marketing</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive occasional emails about new V4 enterprise features.</p>
              </div>
              <input 
                type="checkbox" 
                checked={marketingEmails}
                onChange={() => setMarketingEmails(!marketingEmails)}
                className="w-5 h-5 accent-indigo-600"
              />
            </label>
          </div>
        </section>

        {/* Security Section */}
        <section className="glass-card rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-emerald-500" />
            <h2 className="text-xl font-bold">Security & Privacy</h2>
          </div>
          <button className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-medium hover:bg-red-500/10 transition-colors">
            Delete Account Data
          </button>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
