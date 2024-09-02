import apiService from 'utils/apiService';

// const createConfiguration = async ({
//   name,
// }): () => {
//     return await apiService.get('/categories', queryKey[1]);
// };

export const createConfiguration = async (name: string) => {
  const { result } = await apiService.post('/hris/configure', { name });
  console.log(result);
  
  return result.data;
};

export const putConfiguration = async () => {
  const { result } = await apiService.put('/hris/configure', { name });
  return result.data;
};

export const  syncUser= async () => {
  const { result } = await apiService.post('/hris/sync', { name });
  return result.data;
};

