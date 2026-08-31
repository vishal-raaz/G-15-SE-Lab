import axios from 'axios';

/**
 * API Service — Centralized API layer (Separation of Concerns)
 * All backend communication goes through this module
 */

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ───────────────────────────────────────────
export const loginAPI = (credentials) => api.post('/auth/login', credentials);
export const registerAPI = (userData) => api.post('/auth/register', userData);

// ─── Question APIs ───────────────────────────────────────
export const generateQuestionsAPI = (params) => api.post('/questions/generate', params);
export const saveQuestionAPI = (question) => api.post('/questions', question);
export const getQuestionsAPI = () => api.get('/questions');
export const deleteQuestionAPI = (id) => api.delete(`/questions/${id}`);

// ─── Paper APIs ──────────────────────────────────────────
export const savePaperAPI = (paper) => api.post('/papers', paper);
export const getPapersAPI = () => api.get('/papers');
export const getPaperAPI = (id) => api.get(`/papers/${id}`);
export const getStatsAPI = () => api.get('/papers/stats');

export default api;
