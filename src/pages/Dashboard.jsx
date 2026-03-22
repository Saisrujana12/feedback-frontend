import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, Lightbulb, TrendingUp, Building2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Load existing feedback or set default mock data for the user
    const dbData = localStorage.getItem('feedback_tickets');
    if (!dbData) {
      // Create some mock initial data
      const mockData = [
        { id: '1', company: 'Apple', title: 'Improve Siri context awareness', type: 'Feature Request', status: 'Pending', date: '2023-10-01', userId: user.id },
        { id: '2', company: 'Google', title: 'Search algorithm bug on mobile', type: 'Bug', status: 'In Progress', date: '2023-10-05', userId: user.id },
        { id: '3', company: 'Microsoft', title: 'Excel crashing on save', type: 'Bug', status: 'Completed', date: '2023-09-15', userId: user.id },
      ];
      localStorage.setItem('feedback_tickets', JSON.stringify(mockData));
      setFeedbacks(mockData);
    } else {
      const allFeedback = JSON.parse(dbData);
      setFeedbacks(allFeedback.filter(f => f.userId === user.id));
    }
  }, [user.id]);

  const stats = [
    { label: 'Total Submitted', value: feedbacks.length, icon: <Lightbulb className="text-yellow-500 dark:text-yellow-400" /> },
    { label: 'Pending Review', value: feedbacks.filter(f => f.status === 'Pending').length, icon: <Clock className="text-orange-500 dark:text-orange-400" /> },
    { label: 'Completed', value: feedbacks.filter(f => f.status === 'Completed').length, icon: <CheckCircle className="text-emerald-500 dark:text-emerald-400" /> },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'In Progress': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default: return 'bg-black/10 dark:bg-white/10 text-gray-600 dark:text-gray-400 border-black/20 dark:border-white/20';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's the status of your submitted feedback</p>
        </div>
        <Link 
          to="/feedback"
          className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25"
        >
          <Plus size={20} />
          New Feedback
        </Link>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feedback List */}
      <div className="glass-card rounded-2xl overflow-hidden mt-4">
        <div className="p-6 border-b border-black/5 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-black/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
            Your Submissions
          </h2>
        </div>
        
        {feedbacks.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
            <p>You haven't submitted any feedback yet.</p>
            <Link to="/feedback" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-2 inline-block">Submit your first idea!</Link>
          </div>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-white/5">
            {feedbacks.map((f, i) => (
              <motion.li 
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.05) }}
                className="p-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{f.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-black/10 dark:border-white/10">
                      {f.type}
                    </span>
                    <span className="text-xs px-2 py-1 rounded flex items-center gap-1 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-medium">
                      <Building2 size={12} />
                      {f.company || 'FeedbackVortex'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Submitted on {f.date}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-medium border text-center whitespace-nowrap ${getStatusColor(f.status)}`}>
                  {f.status}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
