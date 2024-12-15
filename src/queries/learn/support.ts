import apiService from 'utils/apiService';

export const contactSales = async (payload: any) => {
  const { data } = await apiService.post('/support', payload);
  return data;
};
