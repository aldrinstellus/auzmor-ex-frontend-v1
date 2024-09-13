import apiService from 'utils/apiService';

export enum HrisIntegrationValue {
  Deel = 'Deel',
  BambooHr = 'BambooHR',
}
export const createConfiguration = async (name: string) => {
  const { result } = await apiService.post('/hris/configure', {
    name: name,
    settings: { allow_actions: [] },
  });

  return result.data;
};

export const putConfiguration = async (
  name: string,
  enabled: boolean,
  consumerId: string,
) => {
  const { result } = await apiService.put('/hris/configure', {
    name,
    enabled,
    consumerId,
  });
  return result.data;
};

export const deleteHrisIntegration = async (configName: string) => {
  const { data } = await apiService.delete(
    `/hris/configure?name=${configName}`,
  );
  return data;
};
export const syncUser = async (configName: string) => {
  const { result } = await apiService.post(`/hris/sync?type=${configName}`);
  return result.data;
};
