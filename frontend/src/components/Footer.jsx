import React from 'react';
import { Shield, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-900/50 backdrop-blur-md mt-auto z-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="text-cyber-blue h-5 w-5" />
            <span className="font-semibold text-slate-300">QRGuard Protection</span>
          </div>
          
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} QRGuard. All rights reserved.
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-cyber-neon transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-cyber-blue transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-slate-500 hover:text-cyber-accent transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
