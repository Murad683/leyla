import api from './api';

export const getSettings = async () => {
  try {
    const { data } = await api.get('/settings');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch site settings');
  }
};

export const getHero = async () => {
  try {
    const { data } = await api.get('/hero');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch hero section data');
  }
};

export const getAbout = async () => {
  try {
    const { data } = await api.get('/about');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch about section data');
  }
};

export const getServices = async () => {
  try {
    const { data } = await api.get('/services');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch services list');
  }
};
