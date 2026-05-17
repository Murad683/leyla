import api from './api';

export const getBlogPosts = async (params = {}) => {
  try {
    const { data } = await api.get('/blog', { params });
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blog posts');
  }
};

export const getBlogPost = async (slug) => {
  try {
    const { data } = await api.get(`/blog/${slug}`);
    return data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch blog post');
  }
};
