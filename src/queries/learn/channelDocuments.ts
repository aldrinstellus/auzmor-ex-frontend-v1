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
  console.log(payload);
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
