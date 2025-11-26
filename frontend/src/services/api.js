import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
  
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
};

export const userService = {
  getProfile: () => api.get('/users/profile'),
  getLeaderboard: () => api.get('/users/leaderboard'),
};

export const roomService = {
  getRooms: () => api.get('/rooms'),
  getRoom: (id) => api.get(`/rooms/${id}`),
  createRoom: (room) => api.post('/rooms', room),
};

export default api;
