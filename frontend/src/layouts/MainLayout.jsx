import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('qrguard_theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('qrguard_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden theme-${theme}`}>
      {/* Background elements */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-blue/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-neon/10 blur-[120px] pointer-events-none z-0"></div>

      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      
      <main className="flex-grow z-10 container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
