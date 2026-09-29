import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { scanQR } from '../services/api';

const QRScanner = ({ onResult, setIsLoading, hasResult }) => {
  const webcamRef = useRef(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    
    try {
      setIsLoading(true);
      // Remove data:image/jpeg;base64, from string
      const base64String = imageSrc.split(',')[1];
      
      const data = await scanQR(base64String);
      
      if (data.status === 'error') {
        setError(data.message || 'Error scanning QR code. Make sure it is clearly visible.');
      } else {
        setCameraActive(false);
        setError(null);
        onResult({
          url: data.url,
          status: data.status,
          source: 'camera'
        });
      }
    } catch (err) {
      console.error("Camera scan error:", err);
      setError('Failed to process image. Try again.');
    } finally {
      setIsLoading(false);
    }
  }, [webcamRef, onResult, setIsLoading]);

  const handleUserMediaError = () => {
    setError("Unable to access camera. Please check your permissions.");
    setCameraActive(false);
  };

  const restartCamera = () => {
    setCameraActive(true);
    setError(null);
    onResult(null); // Optional: clears result if you want them to scan again
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {cameraActive && !hasResult ? (
        <div className="w-full flex flex-col items-center relative">
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-black aspect-video w-full max-w-[500px] shadow-lg">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />
            {/* Scanner Overlay UI */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[60%] h-[60%] border-2 border-cyber-neon/50 rounded-lg relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyber-neon -mt-1 -ml-1 rounded-tl"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyber-neon -mt-1 -mr-1 rounded-tr"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyber-neon -mb-1 -ml-1 rounded-bl"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyber-neon -mb-1 -mr-1 rounded-br"></div>
                {/* Scanning line animation */}
                <div className="w-full h-0.5 bg-cyber-neon/80 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={capture}
            className="mt-6 flex items-center gap-2 px-8 py-3 rounded-full bg-cyber-blue hover:bg-blue-600 text-white font-semibold shadow-lg shadow-cyber-blue/30 transition-all hover:scale-105"
          >
            <Camera size={20} />
            Capture & Scan
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center py-8">
          {!hasResult && (
            <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700">
              <Camera size={32} className="text-slate-500" />
            </div>
          )}
          
          <button 
            onClick={restartCamera}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors"
          >
            <RefreshCw size={18} />
            {hasResult ? 'Scan Another Code' : 'Restart Camera'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 w-full max-w-[500px] p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
