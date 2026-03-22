import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Send, MessageSquare, AlertCircle, Building2, Bold, Italic, List, Link as LinkIcon, ImageIcon } from 'lucide-react';

export default function Feedback() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [targetCompany, setTargetCompany] = useState('Apple');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Feature Request');
  const [description, setDescription] = useState('');

  const companies = [
    'Apple',
    'Google',
    'Microsoft',
    'Amazon',
    'Meta'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit feedback');
      navigate('/login');
      return;
    }

    const newFeedback = {
      id: Date.now().toString(),
      company: targetCompany,
      title,
      type,
      description,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      userId: user.id,
      userName: user.name
    };

    const existingFeeds = JSON.parse(localStorage.getItem('feedback_tickets') || '[]');
    existingFeeds.push(newFeedback);
    localStorage.setItem('feedback_tickets', JSON.stringify(existingFeeds));
    
    toast.success('Feedback submitted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <MessageSquare size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">How can we improve?</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Your feedback directly influences the product roadmap.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6">
          
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Building2 size={16} className="text-indigo-500" />
              Target Company / Product
            </label>
            <select 
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full glass-input rounded-xl py-4 px-5 transition-all text-base appearance-none cursor-pointer"
            >
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Issue Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Dark mode is hard to read"
              className="w-full glass-input rounded-xl py-4 px-5 transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Feedback Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Feature Request', 'Bug', 'Enhancement', 'Other'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    type === t 
                      ? 'bg-indigo-600 text-white border-transparent shadow-lg' 
                      : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <div className="w-full glass-input rounded-xl overflow-hidden flex flex-col transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
              <div className="flex items-center gap-1 p-2 border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                <button type="button" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"><Bold size={16} /></button>
                <button type="button" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"><Italic size={16} /></button>
                <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1"></div>
                <button type="button" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"><List size={16} /></button>
                <div className="w-px h-4 bg-black/10 dark:bg-white/10 mx-1"></div>
                <button type="button" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"><LinkIcon size={16} /></button>
                <button type="button" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"><ImageIcon size={16} /></button>
              </div>
              <textarea 
                required
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us more about your idea or the issue you found..."
                className="w-full p-4 bg-transparent resize-none focus:outline-none text-base"
              ></textarea>
            </div>
          </div>

          {!user && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">You will be asked to log in before submitting this feedback.</span>
            </div>
          )}

          <div className="pt-4 border-t border-black/10 dark:border-white/10">
            <button 
              type="submit"
              className="w-full sm:w-auto py-4 px-8 flex justify-center items-center gap-2 font-bold text-white transition-all rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
            >
              <Send size={18} />
              Submit Feedback
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
