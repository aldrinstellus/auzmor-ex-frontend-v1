import apiService from 'utils/apiService';

export enum IntegrationOptionsEnum {
  Box = 'box',
  Dropbox = 'dropbox',
  GoogleDrive = 'google-drive',
  Onedrive = 'onedrive',
  Sharepoint = 'sharepoint',
}

export const getLinkToken = async (
  IntegrationOption?: IntegrationOptionsEnum,
  expiresIn?: number,
) => {
  return await apiService.post('/storage', {
    expiresIn: expiresIn || 30,
    integration: IntegrationOption || IntegrationOptionsEnum.GoogleDrive,
  });
};

export const patchConfig = async (id: string, publicToken: string) => {
  return await apiService.patch(`/storage/${id}`, {
    publicToken,
  });
};
