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

export const getServices = async () => {
  try {
    const { data } = await api.get('/services');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch services list');
  }
};

export const getHome = async () => {
  try {
    const { data } = await api.get('/home');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch home content');
  }
};

export const getCourses = async () => {
  try {
    const { data } = await api.get('/courses');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch courses');
  }
};

export const getTestimonials = async () => {
  try {
    const { data } = await api.get('/testimonials');
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonials');
  }
};
