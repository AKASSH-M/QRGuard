import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="text-[150px] font-black text-slate-800/50 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle size={64} className="text-cyber-neon mb-4" />
        </div>
      </motion.div>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold mt-4 mb-2 text-white"
      >
        Sector Not Found
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 max-w-md mb-8"
      >
        The page you are looking for has been moved, deleted, or possibly intercepted by malicious entities.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyber-blue text-white font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/20"
        >
          <Home size={18} />
          Return to Base
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
