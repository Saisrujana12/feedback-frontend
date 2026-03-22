import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Clock, Search, Filter, ShieldAlert, BarChart3, Users, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Admin() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load mock initial data
    const dbData = localStorage.getItem('feedback_tickets');
    if (!dbData) {
      const mockData = [
        { id: '1', company: 'Apple', title: 'Add dark mode to Safari', type: 'Feature Request', status: 'Pending', date: '2023-10-01', userName: 'John' },
        { id: '2', company: 'Google', title: 'Gmail loading slow', type: 'Bug', status: 'In Progress', date: '2023-10-05', userName: 'Alice' },
        { id: '3', company: 'Microsoft', title: 'Support for new Xbox controllers', type: 'Feature Request', status: 'Completed', date: '2023-09-15', userName: 'Bob' },
        { id: '4', company: 'Amazon', title: 'Prime video crashing', type: 'Bug', status: 'Pending', date: '2023-10-10', userName: 'Charlie' },
        { id: '5', company: 'Meta', title: 'Better Instagram notifications', type: 'Enhancement', status: 'Pending', date: '2023-10-12', userName: 'Dave' },
      ];
      localStorage.setItem('feedback_tickets', JSON.stringify(mockData));
      setFeedbacks(mockData);
    } else {
      setFeedbacks(JSON.parse(dbData));
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = feedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f);
    setFeedbacks(updated);
    localStorage.setItem('feedback_tickets', JSON.stringify(updated));
    toast.success(`Ticket marked as ${newStatus}`);
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchFilter = filter === 'All' || f.status === filter;
    const matchSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (f.company && f.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchFilter && matchSearch;
  });

  // Analytics Data
  const typeCounts = { 'Feature Request': 0, 'Bug': 0, 'Enhancement': 0, 'Other': 0 };
  feedbacks.forEach(f => { if (typeCounts[f.type] !== undefined) typeCounts[f.type]++; });
  const pieData = Object.keys(typeCounts).map(key => ({ name: key, value: typeCounts[key] })).filter(d => d.value > 0);
  const COLORS = ['#818cf8', '#f87171', '#34d399', '#fbbf24'];

  const trendData = [
    { name: 'Week 1', tickets: 12 },
    { name: 'Week 2', tickets: 19 },
    { name: 'Week 3', tickets: 15 },
    { name: 'Week 4', tickets: feedbacks.length + 5 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <header className="mb-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-indigo-600 dark:from-red-400 dark:to-indigo-400 flex items-center gap-3">
          <ShieldAlert size={28} className="text-red-500 dark:text-red-400" />
          Command Center v2
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage multitenant feedback and organizational analytics.</p>
      </header>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tickets', val: feedbacks.length, icon: <BarChart3 className="text-indigo-600 dark:text-indigo-400" /> },
          { label: 'Pending Docs', val: feedbacks.filter(f=>f.status==='Pending').length, icon: <Clock className="text-orange-500 dark:text-orange-400" /> },
          { label: 'Resolved Docs', val: feedbacks.filter(f=>f.status==='Completed').length, icon: <CheckCircle className="text-emerald-500 dark:text-emerald-400" /> },
          { label: 'Active Users', val: JSON.parse(localStorage.getItem('feedback_users') || '[]').length + 1, icon: <Users className="text-purple-500 dark:text-purple-400" /> }
        ].map((m, i) => (
          <div key={i} className="glass-card p-5 rounded-2xl flex items-center justify-between border-t-2 border-t-black/5 dark:border-t-white/10">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{m.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{m.val}</h3>
            </div>
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl">{m.icon}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button 
          onClick={() => {
            const headers = ['ID,Company,Title,Type,Status,Date,User'];
            const csvRows = feedbacks.map(f => `${f.id},"${f.company || ''}","${f.title.replace(/"/g,'""')}",${f.type},${f.status},${f.date},"${f.userName || 'Anonymous'}"`);
            const csvString = [headers, ...csvRows].join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Vortex_Export_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('CSV Export downloaded successfully!');
          }}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <BarChart3 size={16} />
          Download CSV Report
        </button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 shadow-xl bg-white/50 dark:bg-transparent">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Feedback Volume Trends</h3>
          <div className="h-64 text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.2} vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="tickets" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorTickets)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl shadow-xl bg-white/50 dark:bg-transparent">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Issue Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Management Ledger */}
      <div className="glass-card rounded-2xl overflow-hidden mt-4 shadow-xl">
        <div className="p-6 border-b border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-black/20">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feedback Ledger</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tickets or companies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 w-full md:w-64"
              />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="pl-9 pr-8 py-2 bg-black/5 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-b border-black/10 dark:border-white/10">
                <th className="px-6 py-4">Title / ID</th>
                <th className="px-6 py-4">Target Company</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5 bg-white/20 dark:bg-transparent">
              {filteredFeedbacks.length > 0 ? filteredFeedbacks.map((f) => (
                <tr key={f.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{f.title}</p>
                    <p className="text-xs text-gray-500">#{f.id.substring(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium flex items-center gap-1 text-indigo-700 dark:text-indigo-400">
                      <Building2 size={14} />
                      {f.company || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{f.userName || 'Anonymous'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10">
                      {f.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded border font-bold w-24 text-center ${
                        f.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                        f.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' :
                        'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                      }`}>
                        {f.status}
                      </span>
                      <select 
                        className="bg-black/5 dark:bg-black/30 text-xs border border-black/10 dark:border-white/10 rounded px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
                        value=""
                        onChange={(e) => updateStatus(f.id, e.target.value)}
                      >
                        <option value="" disabled>Action</option>
                        <option value="Pending">Set Pending</option>
                        <option value="In Progress">Set In Progress</option>
                        <option value="Completed">Set Completed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No tickets found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
