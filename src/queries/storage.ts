import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { isFiltersEmpty } from 'utils/misc';

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

export const patchConfig = async (
  patchData: {
    id?: string;
    publicToken?: string;
    allowedFolders?: Record<string, string>[];
  },
  onSuccess?: () => void,
) => {
  const response = await apiService.patch(
    `/storage/${patchData.id}`,
    isFiltersEmpty({
      publicToken: patchData?.publicToken,
      allowedFolders: patchData?.allowedFolders,
    }),
  );
  onSuccess && onSuccess();
  return response;
};

export const getFiles = async (params: Record<string, string | null>) => {
  return await apiService.get('/storage/files', { ...params });
};

export const getFolders = async (params: Record<string, string | null>) => {
  return await apiService.get('/storage/folder', { ...params });
};
export const getDocument = async (params: Record<string, string | null>) => {
  return await apiService.get('/storage/search', { ...params });
};

export const getSyncStatus = async () => {
  return await apiService.get('/storage/sync');
};

export const resync = async () => {
  return await apiService.post('/storage/sync');
};

export const download = (id: string) => {
  apiService.get(`/storage/files/${id}/download`);
};

export const createFolder: (variables: {
  folderId: string;
  name: string;
}) => Promise<any> = async ({ folderId, name }) => {
  return await apiService.post('/storage/folders', { name, folderId });
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
export const useDocument = (q: Record<any, any | null>) => {
  return useQuery({
    queryKey: ['get-storage-document', q],
    queryFn: () => getDocument(q),
  });
};

export const useSyncStatus = () => {
  return useQuery({ queryKey: ['get-sync-status'], queryFn: getSyncStatus });
};
