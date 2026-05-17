import api from './api';

export const getPortfolioItems = async (params = {}) => {
  try {
    const { data } = await api.get('/portfolio', { params });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch portfolio items');
  }
};

export const getPortfolioItem = async (slug) => {
  try {
    const { data } = await api.get(`/portfolio/${slug}`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch portfolio item');
  }
};
