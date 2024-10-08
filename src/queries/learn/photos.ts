import apiService from 'utils/apiService';

export const uploadImage = async (payload: any) => {
  apiService.updateContentType('multipart/form-data');
  const data = await apiService.post('photos', payload);
  return data;
};
