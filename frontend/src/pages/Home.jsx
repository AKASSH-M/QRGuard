import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Upload, Camera, Link2 } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import QRUpload from '../components/QRUpload';
import URLChecker from '../components/URLChecker';
import ResultCard from '../components/ResultCard';

const TABS = [
  { id: 'upload', label: 'Upload Image', icon: <Upload size={17} /> },
  { id: 'camera', label: 'Scan Camera',  icon: <Camera size={17} /> },
  { id: 'url',    label: 'Check URL',    icon: <Link2 size={17} /> },
];

const TAB_ACTIVE = {
  upload: 'text-cyber-neon border-b-2 border-cyber-neon bg-slate-800/50',
  camera: 'text-cyber-blue border-b-2 border-cyber-blue bg-slate-800/50',
  url:    'text-cyber-accent border-b-2 border-cyber-accent bg-slate-800/50',
};

const Home = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [result, setResult]       = useState(null);
  const [loadingPhase, setLoadingPhase] = useState(null);

  const loadingSteps = [
    'QR URL extracted',
    'Security features analyzed',
    'ML prediction completed',
    'Checking external intelligence',
    'Gemini researching website',
    'Analysis completed',
  ];

  const handleScanResult = (data) => {
    if (!data) return;
    setResult(data);

    const history = JSON.parse(localStorage.getItem('qrguard_history') || '[]');
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      url: data.url,
      status: data.status,
      ml_prediction: data.ml_prediction || null,
      security_features: data.security_features || null,
      external_intelligence: data.external_intelligence || null,
      gemini_analysis: data.gemini_analysis || null,
      basic: data.basic || null,
    };
    localStorage.setItem(
      'qrguard_history',
      JSON.stringify([newEntry, ...history].slice(0, 50))
    );
  };

  const resetScanner = () => setResult(null);

  const switchTab = (id) => {
    setActiveTab(id);
    resetScanner();
    setLoadingPhase(null);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* ── Hero ─────────────────────────────────────────── */}
      {!result && <div className="text-center mb-12 w-full max-w-3xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 text-cyber-blue mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-neon"></span>
          </span>
          <span className="text-xs font-medium uppercase tracking-wider">Advanced AI Detection</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight"
        >
          Scan. Detect.{' '}
          <span className="text-gradient">Protect.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl"
        >
          Protect yourself from malicious QR codes and phishing links. Upload a QR image, scan with your camera, or paste any URL — our AI analyses it instantly.
        </motion.p>
      </div>}

      {/* ── Main Grid ─────────────────────────────────────── */}
      <div className={`w-full ${result ? 'max-w-4xl' : 'max-w-5xl'} grid grid-cols-1 ${result ? '' : 'md:grid-cols-12'} gap-6 md:items-start`}>

        {/* Left: Scanner Panel */}
        {!result && <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-6 flex flex-col"
        >
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col relative">

            {/* Tab Bar */}
            <div className="flex border-b border-slate-700/50 bg-slate-800/30">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-4 text-sm font-medium transition-all ${
                      isActive
                        ? TAB_ACTIVE[tab.id]
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Panel Body */}
            <div className="p-6 flex flex-col justify-center min-h-[320px] relative">
              {/* Global loading overlay */}
              {loadingPhase && (
                <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-b-2xl px-6">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-cyber-neon rounded-full animate-spin" />
                  <div className="mt-5 w-full max-w-sm space-y-3">
                    {loadingSteps.map((step, index) => {
                      const activeIndex = {
                        extracting: 0,
                        features: 1,
                        ml: 2,
                        external: 3,
                        gemini: 4,
                        complete: 5,
                      }[loadingPhase] ?? 0;

                      const isDone = index < activeIndex;
                      const isActive = index === activeIndex;
                      return (
                        <div
                          key={step}
                          className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 border ${
                            isDone
                              ? 'border-green-500/30 bg-green-500/10 text-green-300'
                              : isActive
                                ? 'border-cyber-neon/30 bg-cyber-neon/10 text-cyber-neon'
                                : 'border-slate-700 bg-slate-800/30 text-slate-400'
                          }`}
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold border ${isDone ? 'border-green-400 text-green-300' : isActive ? 'border-cyber-neon text-cyber-neon' : 'border-slate-500 text-slate-400'}">
                            {isDone ? '✓' : index + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <QRUpload
                  onResult={handleScanResult}
                  setLoadingPhase={setLoadingPhase}
                  reset={resetScanner}
                  hasResult={!!result}
                />
              )}

              {activeTab === 'camera' && (
                <QRScanner
                  onResult={handleScanResult}
                  setLoadingPhase={setLoadingPhase}
                  hasResult={!!result}
                />
              )}

              {activeTab === 'url' && (
                <URLChecker
                  onResult={handleScanResult}
                  setLoadingPhase={setLoadingPhase}
                  reset={resetScanner}
                  hasResult={!!result}
                />
              )}
            </div>
          </div>
        </motion.div>}

        {/* Right: Result Panel */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`${result ? '' : 'md:col-span-6'} flex flex-col`}
        >
          {result ? (
            <ResultCard result={result} onReset={resetScanner} />
          ) : (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[320px] border-dashed border-2 border-slate-700/50">
              <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 shadow-inner shadow-black/50">
                <QrCode size={40} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Awaiting Analysis</h3>
              <p className="text-slate-500 text-sm">
                {activeTab === 'url'
                  ? 'Enter a URL and click Analyze Link. Results will appear here.'
                  : 'Upload a QR code image or use your camera to scan. Results will appear here.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Feature Highlights ────────────────────────────── */}
      {!result && <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="w-full max-w-4xl mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            icon: <Upload size={22} className="text-cyber-neon" />,
            title: 'Image Upload',
            desc: 'Drag & drop any QR code image for instant analysis.',
          },
          {
            icon: <Camera size={22} className="text-cyber-blue" />,
            title: 'Live Camera',
            desc: 'Point your webcam at a QR code and scan it live.',
          },
          {
            icon: <Link2 size={22} className="text-cyber-accent" />,
            title: 'URL Checker',
            desc: 'Paste any suspicious link and get a verdict in seconds.',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="glass-panel rounded-xl p-5 flex items-start gap-4 hover:bg-slate-800/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              {f.icon}
            </div>
            <div>
              <p className="font-semibold text-slate-200 mb-0.5">{f.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>}
    </div>
  );
};

export default Home;
