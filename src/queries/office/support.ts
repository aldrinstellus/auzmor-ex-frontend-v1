import apiService from 'utils/apiService';

export const contactSales = async (payload: Record<string, any>) => {
  const { data } = await apiService.post('/users/contact-sales', payload);
  return data;
};
