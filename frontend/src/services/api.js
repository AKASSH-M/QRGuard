import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

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

export const extractQR = async (imageBase64) => {
  try {
    const response = await api.post('/extract-qr', { image: imageBase64 });
    return response.data;
  } catch (error) {
    console.error('Error extracting QR data:', error);
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
