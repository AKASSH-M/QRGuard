import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Link as LinkIcon, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

const ResultCard = ({ result, onReset }) => {
  const isMalicious = result.status === 'malicious';
  
  // Format the URL to be displayed nicely (truncate if too long)
  const displayUrl = result.url.length > 50 ? result.url.substring(0, 47) + '...' : result.url;
  
  // Add protocol if missing for the actual link
  const safeLink = result.url.startsWith('http') ? result.url : `https://${result.url}`;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`glass-panel rounded-2xl overflow-hidden flex flex-col h-full border-t-4 ${
        isMalicious ? 'border-red-500' : 'border-green-500'
      }`}
    >
      <div className={`p-6 pb-8 flex flex-col items-center text-center relative ${
        isMalicious ? 'bg-red-500/10' : 'bg-green-500/10'
      }`}>
        <div className="absolute top-4 right-4">
          <button 
            onClick={onReset}
            className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Scan New QR"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl ${
          isMalicious ? 'bg-red-500/20 text-red-500 shadow-red-500/20' : 'bg-green-500/20 text-green-500 shadow-green-500/20'
        }`}>
          {isMalicious ? <ShieldAlert size={48} /> : <ShieldCheck size={48} />}
        </div>
        
        <h2 className={`text-3xl font-bold mb-2 ${isMalicious ? 'text-red-400' : 'text-green-400'}`}>
          {isMalicious ? 'Malicious Link' : 'Safe to Visit'}
        </h2>
        
        <p className="text-slate-300">
          {isMalicious 
            ? 'This QR code contains a potentially harmful link.' 
            : 'No threats detected in this QR code.'}
        </p>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <LinkIcon size={14} />
            <span>Extracted URL</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-white font-medium break-all">{displayUrl}</span>
            {!isMalicious && (
              <a 
                href={safeLink} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-cyber-blue/20 text-cyber-blue hover:bg-cyber-blue hover:text-white transition-colors flex-shrink-0"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Threat Assessment</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30">
              <span className="text-slate-300 text-sm">Risk Level</span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                isMalicious ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {isMalicious ? 'HIGH' : 'LOW'}
              </span>
            </div>
          </div>
        </div>

        {isMalicious && (
          <div className="mt-auto p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="text-red-300 font-medium mb-1">Security Recommendation</p>
              <p className="text-slate-400">Do not visit this link. It may lead to phishing sites, malware downloads, or other malicious content.</p>
            </div>
          </div>
        )}
        
        {!isMalicious && (
          <div className="mt-auto p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 text-sm">
            <p className="text-slate-400"><span className="text-slate-300 font-medium">Note:</span> While our AI detected no threats, always exercise caution when visiting unknown websites.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
