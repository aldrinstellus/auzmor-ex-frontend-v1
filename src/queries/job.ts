import apiService from 'utils/apiService';

export const createNewJob = async (payload: Record<string, any>) => {
  const { data } = await apiService.post('/job', payload);
  return data;
};
