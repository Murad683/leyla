import api from './api';

export const submitContact = async (contactData) => {
  try {
    const { data } = await api.post('/contact', contactData);
    return data.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      throw error.response.data;
    }
    throw new Error(error.response?.data?.message || 'Failed to submit contact form');
  }
};
