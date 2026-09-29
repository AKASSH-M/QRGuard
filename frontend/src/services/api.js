import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scanQR = async (imageBase64) => {
  try {
    const response = await api.post('/scan', { image: imageBase64 });
    return response.data;
  } catch (error) {
    console.error('Error scanning QR:', error);
    throw error;
  }
};

export const checkSafeUrl = async (url) => {
  try {
    const response = await api.post('/checksafe-url', { url });
    return response.data;
  } catch (error) {
    console.error('Error checking safe URL:', error);
    throw error;
  }
};

export const checkMaliciousUrl = async (url) => {
  try {
    const response = await api.post('/checkmalicious-url', { url });
    return response.data;
  } catch (error) {
    console.error('Error checking malicious URL:', error);
    throw error;
  }
};

export const reportUrl = async (url) => {
  try {
    const response = await api.post('/report-url', { url });
    return response.data;
  } catch (error) {
    console.error('Error reporting URL:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const analyzeUrl = async (url) => {
  try {
    const response = await api.post('/analyze-url', { url });
    return response.data;
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
};

export default api;
