import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ArrowUp, Building2, MessageSquare, Search } from 'lucide-react';

export default function Board() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('feedback_tickets') || '[]');
    // Seed upvotes if they don't exist
    const initializedData = data.map(f => ({
      ...f,
      upvotes: f.upvotes !== undefined ? f.upvotes : Math.floor(Math.random() * 80) + 5
    }));
    // Sort by upvotes descending
    setFeedbacks(initializedData.sort((a,b) => b.upvotes - a.upvotes));
  }, []);

  const handleUpvote = (id) => {
    if (!user) {
      alert("You must be logged in to upvote.");
      return;
    }

    const updated = feedbacks.map(f => {
      if (f.id === id) {
        return { ...f, upvotes: f.upvotes + 1 };
      }
      return f;
    }).sort((a,b) => b.upvotes - a.upvotes);
    
    setFeedbacks(updated);
    localStorage.setItem('feedback_tickets', JSON.stringify(updated));
  };

  const filteredFeedbacks = feedbacks.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f.company && f.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto w-full pb-12">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
          <MessageSquare size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">Community Roadmap</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Vote on the most critical requests to help us prioritize features.</p>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          placeholder="Search requests or companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full glass-input rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg"
        />
      </div>

      <div className="space-y-4">
        {filteredFeedbacks.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 rounded-3xl flex gap-6 items-center hover:bg-white/50 dark:hover:bg-black/30 transition-all"
          >
            {/* Upvote Button */}
            <button 
              onClick={() => handleUpvote(f.id)}
              className="flex flex-col items-center justify-center min-w-[60px] p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-black/5 dark:border-white/5"
            >
              <ArrowUp size={20} className="mb-1" />
              <span className="font-bold text-lg">{f.upvotes}</span>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">{f.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1 mb-3">
                {f.description || "No detailed description provided by the user."}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-medium">
                  {f.type}
                </span>
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
                  <Building2 size={12} />
                  {f.company}
                </span>
                {f.status === 'Completed' && (
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    Shipped
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {filteredFeedbacks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No community requests found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
