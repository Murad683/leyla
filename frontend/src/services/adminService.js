import api from './api';

// Set auth token helper
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('adminToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('adminToken');
  }
};

// Auto load token if exists
const storedToken = localStorage.getItem('adminToken');
if (storedToken) {
  setAuthToken(storedToken);
}

export const login = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    if (data && data.data && data.data.accessToken) {
      setAuthToken(data.data.accessToken);
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const getAdminSettings = async () => {
  const { data } = await api.get('/admin/settings');
  return data.data;
};

export const updateAdminSettings = async (settingsData) => {
  const { data } = await api.put('/admin/settings', settingsData);
  return data.data;
};

export const getAdminHero = async () => {
  const { data } = await api.get('/admin/hero');
  return data.data;
};

export const updateAdminHero = async (heroData) => {
  const { data } = await api.put('/admin/hero', heroData);
  return data.data;
};

export const getAdminAbout = async () => {
  const { data } = await api.get('/admin/about');
  return data.data;
};

export const updateAdminAbout = async (aboutData) => {
  const { data } = await api.put('/admin/about', aboutData);
  return data.data;
};

// Services CRUD
export const createService = async (serviceData) => {
  const { data } = await api.post('/admin/services', serviceData);
  return data.data;
};

export const updateService = async (id, serviceData) => {
  const { data } = await api.put(`/admin/services/${id}`, serviceData);
  return data.data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/admin/services/${id}`);
  return data.data;
};

// Blog CRUD
export const createBlogPost = async (postData) => {
  const { data } = await api.post('/admin/blog', postData);
  return data.data;
};

export const updateBlogPost = async (id, postData) => {
  const { data } = await api.put(`/admin/blog/${id}`, postData);
  return data.data;
};

export const deleteBlogPost = async (id) => {
  const { data } = await api.delete(`/admin/blog/${id}`);
  return data.data;
};

// Portfolio CRUD
export const createPortfolioItem = async (itemData) => {
  const { data } = await api.post('/admin/portfolio', itemData);
  return data.data;
};

export const updatePortfolioItem = async (id, itemData) => {
  const { data } = await api.put(`/admin/portfolio/${id}`, itemData);
  return data.data;
};

export const deletePortfolioItem = async (id) => {
  const { data } = await api.delete(`/admin/portfolio/${id}`);
  return data.data;
};

// Contacts
export const getContactsList = async () => {
  const { data } = await api.get('/admin/contacts');
  return data.data;
};

export const markContactRead = async (id) => {
  const { data } = await api.put(`/admin/contacts/${id}/read`);
  return data.data;
};

// Image Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};
