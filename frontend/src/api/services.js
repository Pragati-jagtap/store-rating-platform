import api from './client';

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.patch('/auth/change-password', data),
};

// Users (Admin)
export const usersAPI = {
  create: (data) => api.post('/users', data),
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
};

// Stores
export const storesAPI = {
  create: (data) => api.post('/stores', data),
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  getOwnerDashboard: () => api.get('/stores/owner/dashboard'),
};

// Ratings
export const ratingsAPI = {
  submit: (data) => api.post('/ratings', data),
};

// Notifications
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

// Dashboard
export const dashboardAPI = {
  adminStats: () => api.get('/dashboard/admin'),
};
