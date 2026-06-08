import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sw_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('sw_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;

export const authApi = {
  register: (data: { email: string; name: string; password: string; city?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

export const clothingApi = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/clothing/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getAll: (params?: { category?: string; season?: string; style?: string }) =>
    api.get('/clothing', { params }),
  getOne: (id: string) => api.get(`/clothing/${id}`),
  update: (id: string, data: any) => api.patch(`/clothing/${id}`, data),
  remove: (id: string) => api.delete(`/clothing/${id}`),
  getStats: () => api.get('/clothing/stats'),
};

export const outfitsApi = {
  generate: (occasion: string) => api.post('/outfits/generate', { occasion }),
  getAll: () => api.get('/outfits'),
  getOne: (id: string) => api.get(`/outfits/${id}`),
  getCalendar: (year: number, month: number) =>
    api.get('/outfits/calendar', { params: { year, month } }),
  remove: (id: string) => api.delete(`/outfits/${id}`),
};

export const weatherApi = {
  get: (city: string) => api.get('/weather', { params: { city } }),
};

export const usersApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.patch('/users/me', data),
  analyzeWardrobe: () => api.get('/users/wardrobe-analysis'),
  getShalAdvice: (occasion: string) => api.get('/users/shal-advice', { params: { occasion } }),
};
