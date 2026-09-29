import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { scanQR } from '../services/api';

const QRUpload = ({ onResult, setIsLoading, reset, hasResult }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }
    
    setError(null);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Convert to base64 for API
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        setIsLoading(true);
        const base64String = reader.result.split(',')[1];
        
        // Call API
        const data = await scanQR(base64String);
        
        if (data.status === 'error') {
          setError(data.message || 'Error scanning QR code');
          onResult(null);
        } else {
          onResult({
            url: data.url,
            status: data.status,
            source: 'upload'
          });
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError('Failed to connect to the analysis server. Please try again.');
        onResult(null);
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (hasResult) {
      reset();
      setPreviewUrl(null);
      setError(null);
      if (inputRef.current) inputRef.current.value = '';
    } else {
      inputRef.current.click();
    }
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setError(null);
    reset();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full flex flex-col items-center h-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {!previewUrl ? (
        <div 
          className={`w-full flex-grow border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${
            dragActive 
              ? 'border-cyber-neon bg-cyber-neon/5 scale-[1.02]' 
              : 'border-slate-600 bg-slate-800/20 hover:bg-slate-800/40 hover:border-slate-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 shadow-lg">
            <UploadCloud size={36} className={dragActive ? 'text-cyber-neon' : 'text-cyber-blue'} />
          </div>
          <h3 className="text-xl font-semibold text-slate-200 mb-2">Upload QR Code</h3>
          <p className="text-slate-400 text-center text-sm max-w-xs mb-6">
            Drag and drop an image file here, or click to browse from your computer
          </p>
          <button className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors">
            Select File
          </button>
        </div>
      ) : (
        <div className="w-full flex-grow flex flex-col items-center justify-center relative">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 max-w-[280px]">
            <img 
              src={previewUrl} 
              alt="QR Code Preview" 
              className="w-full h-auto object-contain bg-white" 
            />
            {!hasResult && (
              <button 
                onClick={clearSelection}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-500/80 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {hasResult && (
            <button 
              onClick={onButtonClick}
              className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-neon text-white font-semibold shadow-lg shadow-cyber-blue/20 hover:shadow-cyber-neon/40 transition-all hover:-translate-y-0.5"
            >
              Scan Another Image
            </button>
          )}
        </div>
      )}
      
      {error && (
        <div className="mt-4 w-full p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default QRUpload;
