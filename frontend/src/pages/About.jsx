import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, Lock, Code, Database } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Brain className="text-cyber-neon" size={24} />,
      title: "Machine Learning Core",
      description: "Powered by a robust Random Forest model trained on thousands of malicious and safe URLs, achieving high accuracy in detecting zero-day phishing links."
    },
    {
      icon: <Zap className="text-yellow-400" size={24} />,
      title: "Real-time Processing",
      description: "Instantaneous QR code decoding and feature extraction pipeline ensures you get security results in milliseconds."
    },
    {
      icon: <Shield className="text-green-400" size={24} />,
      title: "Proactive Defense",
      description: "Checks against known malicious databases before applying ML prediction to ensure known threats are blocked instantly."
    },
    {
      icon: <Lock className="text-cyber-blue" size={24} />,
      title: "Privacy Focused",
      description: "Your images are processed securely. We only extract and analyze the decoded URL, not the image contents."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 mx-auto bg-gradient-to-br from-cyber-blue to-cyber-neon rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyber-blue/20"
        >
          <Shield size={40} className="text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold mb-4"
        >
          About QRGuard
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          QRGuard is an advanced, AI-powered QR code security scanner designed to protect users from modern phishing attacks and malicious links disguised as harmless QR codes.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-16">
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (index * 0.1) }}
            className="glass-panel p-6 rounded-2xl hover:bg-slate-800/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-panel w-full rounded-2xl p-8 border-t-4 border-t-cyber-blue"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Code className="text-cyber-blue" />
          Technical Stack
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Frontend</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon"></div>
                React.js with Vite
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon"></div>
                Tailwind CSS for Styling
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon"></div>
                Framer Motion for Animations
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-neon"></div>
                Axios for API Integration
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Backend & ML</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                Flask / Python API
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                Scikit-Learn (Random Forest)
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                OpenCV for QR Decoding
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue"></div>
                MongoDB Database
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
