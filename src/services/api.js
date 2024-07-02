import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
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

const registerUser = (userData) => api.post('/users/register', userData);
const loginUser = (userData) => api.post('/users/login', userData);
const getProfile = () => api.get('/users/profile');
const updateProfile = (bioData) => api.put('/users/profile', bioData);
const uploadAvatar = (formData) => api.post('/users/avatar', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
const uploadVideo = (formData) => api.post('/users/videos', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

const apis = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadVideo
};

export default apis;
