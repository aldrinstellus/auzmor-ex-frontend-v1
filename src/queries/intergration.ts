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

export const putConfiguration = async (
  name: string,
  enabled: boolean,
  consumerId: string,
) => {
  console.log('out', name);
  const { result } = await apiService.put('/hris/configure', {
    name,
    enabled,
    consumerId,
  });
  return result.data;
};

export const syncUser = async () => {
  const { result } = await apiService.post('/hris/sync');
  return result.data;
};

export const meApi = async () => {
  const { data } = await apiService.get('/users/me');
  return data.org.integrations.enabled;
};
