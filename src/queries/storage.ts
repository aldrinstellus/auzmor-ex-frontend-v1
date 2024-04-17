import { useQuery } from '@tanstack/react-query';
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

export const getFiles = async (params: Record<string, string | null>) => {
  console.log(params);
  return await apiService.get('/storage/files', { ...params });
};

export const getFolders = async (params: Record<string, string | null>) => {
  return await apiService.get('/storage/folder', { ...params });
};

export const getSyncStatus = async () => {
  return await apiService.get('/storage/sync');
};

export const useFiles = (q: Record<string, string | null>) => {
  return useQuery({
    queryKey: ['get-storage-files', q],
    queryFn: () => getFiles(q),
  });
};

export const useFolders = (q: Record<string, string | null>) => {
  return useQuery({
    queryKey: ['get-storage-folders', q],
    queryFn: () => getFolders(q),
  });
};

export const useSyncStatus = () => {
  return useQuery({ queryKey: ['get-sync-status'], queryFn: getSyncStatus });
};
