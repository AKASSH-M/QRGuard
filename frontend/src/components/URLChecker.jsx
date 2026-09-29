import React, { useState } from 'react';
import { Link2, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { analyzeUrl } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const URLChecker = ({ onResult, setIsLoading, hasResult, reset }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL to analyze.');
      return;
    }

    setError(null);
    setLocalLoading(true);
    setIsLoading(true);

    try {
      const data = await analyzeUrl(trimmed);
      if (data.status === 'error') {
        setError(data.message || 'Error analyzing the URL.');
        onResult(null);
      } else {
        onResult({ url: data.url, status: data.status, source: 'url' });
      }
    } catch (err) {
      setError('Failed to connect to the analysis server. Please try again.');
      onResult(null);
    } finally {
      setLocalLoading(false);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setError(null);
    reset();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center gap-6">
      {/* Icon + title */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyber-accent/30 to-cyber-blue/20 border border-cyber-accent/30 flex items-center justify-center shadow-lg shadow-cyber-accent/10">
          <Link2 size={32} className="text-cyber-accent" />
        </div>
        <h3 className="text-xl font-semibold text-white">Analyze a URL</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          Paste any link below and our AI will instantly classify it as safe or malicious.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Link2 size={18} />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            placeholder="https://example.com or paste any link..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyber-accent focus:ring-2 focus:ring-cyber-accent/20 transition-all text-sm"
            disabled={localLoading}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={localLoading || !url.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyber-accent to-cyber-blue text-white font-semibold text-sm shadow-lg shadow-cyber-accent/20 hover:shadow-cyber-blue/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {localLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Analyze Link
              </>
            )}
          </button>

          {(hasResult || url) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Example chips */}
      {!hasResult && !url && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500 text-center">Try an example:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['https://google.com', 'http://free-prize-winner.xyz', 'https://github.com'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setUrl(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors truncate max-w-[200px]"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default URLChecker;
