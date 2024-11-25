import { useQuery } from '@tanstack/react-query';
import { dummyFiles, dummyFolders } from 'mocks/documents';
import apiService from 'utils/apiService';
import { isFiltersEmpty } from 'utils/misc';

// To list out all rirectories / sites
const getDirectories = async (q: {
  channelId: string;
  params?: Record<string, any>;
}) => {
  const response = await apiService
    .get(`/channels/${q.channelId}/directories`, isFiltersEmpty(q.params || {}))
    .catch((_e) => {
      return dummyFolders;
    });
  return (response as any)?.data?.result?.data;
};

// To connect folder / site to channel
export const updateConnection = async (q: {
  channelId: string;
  folderId: string;
  name: string;
  orgProviderId: string;
}) => {
  return await apiService.put(
    `/channels/${q.channelId}/connect`,
    isFiltersEmpty({
      folderId: q.folderId,
      name: q.name,
      orgProviderId: q.orgProviderId,
    }),
  );
};

// To get files based on params
const getFiles = async (q: {
  channelId: string;
  params: Record<string, any>;
}) => {
  const response = await apiService
    .get(`/channels/${q.channelId}/files`, isFiltersEmpty(q.params))
    .catch((_e) => {
      return dummyFiles;
    });
  return (response as any)?.data?.result?.data;
};

// To get status of documents tab of respected channels
const getChannelDocumentStatus = async (q: {
  channelId: string;
  params: Record<string, any>;
}) => {
  const response = await apiService.get(
    `/channels/${q.channelId}/document/status`,
    q.params,
  );
  return response.data.result;
};

/** Hooks */

// To list out all rirectories / sites
export const useDirectories = (
  q: { channelId: string; params: Record<string, any> },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-directories', q],
    queryFn: () => getDirectories(q),
    ...options,
  });
};

// To get all files for selected folder / site
export const useFiles = (
  q: {
    channelId: string;
    params: Record<string, any>;
  },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-files', q],
    queryFn: () => getFiles(q),
    ...options,
  });
};

// To get status of documents tab of respected channels
export const useChannelDocumentStatus = (
  q: {
    channelId: string;
    params: Record<string, any>;
  },
  options: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['get-channel-document-status', q],
    queryFn: () => getChannelDocumentStatus(q),
    refetchOnMount: true,
    staleTime: 0,
    ...options,
  });
};
