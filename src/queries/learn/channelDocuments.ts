import { useQuery } from '@tanstack/react-query';
import { dummyFiles, dummyFolders } from 'mocks/documents';
import apiService from 'utils/apiService';
import { isFiltersEmpty } from 'utils/misc';

// To list out all rirectories / sites
const getChannelDirectories = async (payload: {
  channelId: string;
  params?: Record<string, any>;
}) => {
  const response = await apiService
    .get(
      `/channels/${payload.channelId}/directories`,
      isFiltersEmpty(payload.params || {}),
    )
    .catch((_e) => {
      return dummyFolders;
    });
  return (response as any)?.data?.result?.data;
};

// To connect folder / site to channel
export const updateChannelDocumentConnection = async (payload: {
  channelId: string;
  folderId: string;
  name: string;
  orgProviderId: string;
}) => {
  return await apiService.put(
    `/channels/${payload.channelId}/connect`,
    isFiltersEmpty({
      folderId: payload.folderId,
      name: payload.name,
      orgProviderId: payload.orgProviderId,
    }),
  );
};

// To get files based on params
const getChannelFiles = async (payload: {
  channelId: string;
  params: Record<string, any>;
}) => {
  const response = await apiService
    .get(`/channels/${payload.channelId}/files`, isFiltersEmpty(payload.params))
    .catch((_e) => {
      return dummyFiles;
    });
  return (response as any)?.data?.result?.data;
};

// To get status of documents tab of respected channels
const getChannelDocumentStatus = async (payload: {
  channelId: string;
  params: Record<string, any>;
}) => {
  const response = await apiService.get(
    `/channels/${payload.channelId}/document/status`,
    payload.params,
  );
  return response.data.result;
};

// Get preview url for document
const getChannelFilePreview = async (payload: {
  channelId: string;
  fileId: string;
}) => {
  return await apiService.get(
    `/channels/${payload.channelId}/file/${payload.fileId}/preview`,
  );
};

// Create folder in channel documents
export const createChannelDocFolder = async ({
  channelId,
  remoteFolderId,
  name,
}: {
  channelId: string;
  remoteFolderId: string;
  name: string;
}) => {
  return await apiService.post(`/channels/${channelId}/folder`, {
    remoteFolderId,
    name,
  });
};

// Get Channel doc owner list
export const getChannelDocOwners = async ({
  channelId,
}: {
  channelId: string;
}) => {
  const response = await apiService.get(
    `/channels/${channelId}/document/owners`,
  );
  return response?.data?.result?.data?.owners;
};

// Delete Channel Document
export const deleteChannelDoc = async (payload: {
  channelId: string;
  itemId: string;
}) => {
  const response = await apiService.delete(
    `/channels/${payload.channelId}/files/${payload.itemId}`,
  );
  return response;
};

// Rename channel file document
export const renameChannelFile = async (payload: {
  channelId: string;
  fileId: string;
  name: string;
}) => {
  const response = await apiService.patch(
    `/channels/${payload.channelId}/files/${payload.fileId}`,
    { name: payload.name },
  );
  return response;
};

// Rename channel folder document
export const renameChannelFolder = async (payload: {
  channelId: string;
  folderId: string;
  name: string;
}) => {
  const response = await apiService.patch(
    `/channels/${payload.channelId}/folders/${payload.folderId}`,
    { name: payload.name },
  );
  return response;
};

// Delete channel doc connection
export const deleteChannelDocConnection = async (payload: {
  channelId: string;
}) => {
  const response = await apiService.delete(
    `/channels/${payload.channelId}/unlink`,
  );
  return response;
};

// Get download URL for files / folders
export const getChannelDocDownloadUrl = async (payload: {
  channelId: string;
  itemId: string;
}) => {
  const response = await apiService.get(
    `/channels/${payload.channelId}/files/${payload.itemId}/download`,
  );
  return response;
};

// Search channel document
export const getChannelDocDeepSearch = async (payload: {
  channelId: string;
  params: Record<string, any>;
}) => {
  const response = await apiService.get(
    `/channels/${payload.channelId}/search`,
    { ...payload.params },
  );
  return (response as any)?.data?.result?.data;
};

// Trigger manual sync
export const channelDocSync = async (payload: { channelId: string }) => {
  const response = await apiService.post(`/channels/${payload.channelId}/sync`);
  console.log(response);
  return response;
};

// Get channelDocu ment sync status
export const getChannelDocumentSyncStatus = async (payload: {
  channelId: string;
}) => {
  const response = await apiService.get(
    `/channels/${payload.channelId}/sync/status`,
  );
  return response;
};

/** Hooks */

// To list out all rirectories / sites
export const useChannelDirectories = (
  payload: { channelId: string; params: Record<string, any> },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-directories', payload],
    queryFn: () => getChannelDirectories(payload),
    ...options,
  });
};

// To get all files for selected folder / site
export const useChannelFiles = (
  payload: {
    channelId: string;
    params: Record<string, any>;
  },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-channel-files', payload],
    queryFn: () => getChannelFiles(payload),
    ...options,
  });
};

// To get status of documents tab of respected channels
export const useChannelDocumentStatus = (
  payload: {
    channelId: string;
    params: Record<string, any>;
  },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-channel-document-status', payload],
    queryFn: () => getChannelDocumentStatus(payload),
    refetchOnMount: true,
    staleTime: 0,
    ...options,
  });
};

// Get preview url for document
export const useChannelFilePreview = (
  payload: {
    channelId: string;
    fileId: string;
  },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-channel-file-preview', payload],
    queryFn: () => getChannelFilePreview(payload),
    ...options,
  });
};

// Get channel doc owners
export const useChannelDocOwners = (channelId: string) => {
  return useQuery({
    queryKey: ['channel-doc-owners', channelId],
    queryFn: () => getChannelDocOwners({ channelId }),
  });
};

// Channel document deep search
export const useChannelDocDeepSearch = (
  payload: { channelId: string; params: Record<string, any> },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['channel-doc-deep-search', payload.channelId],
    queryFn: () => getChannelDocDeepSearch(payload),
    ...options,
  });
};
