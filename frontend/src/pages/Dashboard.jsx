import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShieldAlert, ShieldCheck, Clock, ExternalLink, Activity } from 'lucide-react';

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('qrguard_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your detection history?')) {
      localStorage.removeItem('qrguard_history');
      setHistory([]);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const safeCount = history.filter(item => item.status === 'safe').length;
  const maliciousCount = history.filter(item => item.status === 'malicious').length;

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Activity className="text-cyber-neon" />
            Detection Dashboard
          </h1>
          <p className="text-slate-400">View and manage your QR code scan history.</p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-colors"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel rounded-xl p-6 border-l-4 border-l-cyber-blue">
          <p className="text-slate-400 text-sm font-medium mb-1">Total Scans</p>
          <p className="text-3xl font-bold text-white">{history.length}</p>
        </div>
        <div className="glass-panel rounded-xl p-6 border-l-4 border-l-green-500">
          <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500" /> Safe URLs
          </p>
          <p className="text-3xl font-bold text-green-400">{safeCount}</p>
        </div>
        <div className="glass-panel rounded-xl p-6 border-l-4 border-l-red-500">
          <p className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500" /> Threats Blocked
          </p>
          <p className="text-3xl font-bold text-red-400">{maliciousCount}</p>
        </div>
      </div>

      {/* History List */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock size={20} className="text-slate-400" />
            Recent Activity
          </h2>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Clock size={24} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-1">No history found</h3>
            <p className="text-slate-500 text-sm">Your scanned QR codes will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">URL</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {history.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={item.id} 
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                        item.status === 'malicious' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {item.status === 'malicious' ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                        {item.status === 'malicious' ? 'Malicious' : 'Safe'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-300 max-w-xs md:max-w-md truncate" title={item.url}>
                        {item.url}
                      </div>
                      {!item.security_features && !item.gemini_analysis && (
                        <div className="text-xs text-slate-500 mt-1">Additional analysis unavailable for this scan.</div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="p-4">
                      {item.status === 'safe' && (
                        <a 
                          href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 inline-block rounded hover:bg-slate-700 text-slate-400 hover:text-cyber-blue transition-colors opacity-50 group-hover:opacity-100"
                          title="Open Link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
