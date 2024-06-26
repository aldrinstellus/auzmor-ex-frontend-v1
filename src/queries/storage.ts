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
export enum IDocType {
  DOCUMENT = 'DOCUMENT',
  FOLDER = 'FOLDER',
  PDF = 'PDF',
  FORM = 'FORM',
  XLS = 'XLS',
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
    isAuthorized?: boolean;
    allowedDrives?: Record<string, string>[];
  },
  onSuccess?: () => void,
) => {
  const response = await apiService.patch(
    `/storage/${patchData.id}`,
    isFiltersEmpty({
      publicToken: patchData?.publicToken,
      allowedFolders: patchData?.allowedFolders,
      isAuthorized: patchData?.isAuthorized,
      allowedDrives: patchData?.allowedDrives,
    }),
  );
  onSuccess && onSuccess();
  return response;
};

export const getFiles = async (params: Record<string, string | null>) => {
  return await apiService.get(
    '/storage/files',
    params?.folderId ? { ...params } : {},
  );
};

export const getFolders = async (params: Record<string, string | null>) => {
  return await apiService.get(
    '/storage/folder',
    params?.parentFolderId ? { ...params } : {},
  );
};
export const getDocument = async (params: Record<string, string | null>) => {
  return await apiService.get('/storage/search', { ...params });
};

export const getSyncStatus = async () => {
  return await apiService.get('/storage/sync');
};

export const getConnectedStatus = async (email: string) => {
  return await apiService.get(`/storage/user`, { email });
};

export const getStorageUser = async (params: Record<any, any | null>) => {
  return await apiService.get('/storage/users', { ...params });
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
export const useDocument = (
  params: Record<any, any | null>,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: ['get-storage-document', params],
    queryFn: () => getDocument(params),
    cacheTime: 0,
    staleTime: 0,
    enabled: !!enabled,
  });
};
export const useGetStorageUser = (q: Record<any, any | null>) => {
  return useQuery({
    queryKey: ['get-storage-user', q],
    queryFn: () => getStorageUser(q),
  });
};

export const useSyncStatus = () => {
  return useQuery({ queryKey: ['get-sync-status'], queryFn: getSyncStatus });
};

export const useConnectedStatus = (email: string) => {
  return useQuery({
    queryKey: ['get-connected-status'],
    queryFn: () => getConnectedStatus(email),
  });
};
