import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { isFiltersEmpty } from 'utils/misc';

// To list out all rirectories / sites
const getChannelDirectories = async (payload: {
  channelId: string;
  directoryId?: string;
  driveId?: string;
  params?: Record<string, any>;
}) => {
  const getId = (directory: {
    directoryId: string;
    rootFolderId?: string;
    folderId?: string;
  }) => {
    let id = directory.directoryId;
    if (directory.rootFolderId) {
      id = `${id}-${directory.rootFolderId}`;
    }
    if (directory.folderId) {
      id = `${id}-${directory.folderId}`;
    }
    return id;
  };
  const response = await apiService
    .get(
      `/channels/${payload.channelId}/directories${
        payload.directoryId ? `/${payload.directoryId}/folders` : ''
      }${payload.driveId ? `/${payload.driveId}` : ''}`,
      isFiltersEmpty(payload.params || {}),
    )
    .catch((e) => {
      throw e;
    });
  const directories = ((response as any)?.data?.result?.data || []).map(
    (each: {
      directoryId: string;
      rootFolderId?: string;
      folderId?: string;
    }) => ({
      ...each,
      id: getId(each),
    }),
  );

  return directories;
};

// To connect folder / site to channel
export const updateChannelDocumentConnection = async (payload: {
  channelId: string;
  connections: Array<{
    directoryId: string;
    rootFolderId: string;
    folderId: string;
    name: string;
  }>;
  orgProviderId: string;
}) => {
  return await apiService.put(
    `/channels/${payload.channelId}/connect`,
    isFiltersEmpty({
      connections: payload.connections,
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
    .catch((e) => {
      throw e;
    });
  return (response as any)?.data?.result?.data;
};

// To get files based on params Infinite listing
const getInfiniteChannelFiles = async (
  context: QueryFunctionContext<
    (Record<string, any> | undefined | string)[],
    any
  >,
  payload: {
    channelId: string;
    params: Record<string, any>;
  },
) => {
  let response = null;

  try {
    if (!!!context.pageParam) {
      response = await apiService.get(
        `/channels/${payload.channelId}/files`,
        isFiltersEmpty(payload.params),
      );
    } else {
      response = await apiService.get(context.pageParam);
    }
  } catch (e) {
    throw e;
  }
  return response;
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
  rootFolderId,
  remoteFolderId,
  name,
}: {
  channelId: string;
  rootFolderId: string;
  remoteFolderId: string;
  name: string;
}) => {
  return await apiService.post(
    `/channels/${channelId}/folder`,
    isFiltersEmpty({
      rootFolderId,
      remoteFolderId,
      name,
    }),
  );
};

// Get Channel doc owner list
export const getChannelDocOwners = async ({
  channelId,
  rootFolderId,
  name,
}: {
  channelId: string;
  rootFolderId: string;
  name?: string;
}) => {
  const response = await apiService.get(
    `/channels/${channelId}/document/owners`,
    { rootFolderId, name },
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
export const getChannelDocDeepSearch = async (
  context: QueryFunctionContext<
    (Record<string, any> | undefined | string)[],
    any
  >,
  payload: {
    channelId: string;
    params: Record<string, any>;
  },
) => {
  let response = null;
  try {
    if (!!!context.pageParam) {
      response = await apiService.get(`/channels/${payload.channelId}/search`, {
        ...payload.params,
      });
    } else {
      response = await apiService.get(context.pageParam);
    }
  } catch (e) {
    return [];
  }
  return response;
};

// Trigger manual sync
export const channelDocSync = async (payload: { channelId: string }) => {
  const response = await apiService.post(`/channels/${payload.channelId}/sync`);
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
    ...{ ...options, networkMode: 'always', staleTime: 1 * 60 * 1000 },
  });
};

// To get all files for selected folder / site infinite listing
export const useInfiniteChannelFiles = (
  payload: {
    channelId: string;
    params: Record<string, any>;
  },
  options: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['get-channel-files', payload],
    queryFn: (context) => getInfiniteChannelFiles(context, payload),
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 1 * 60 * 1000, // 1min
    ...{ ...options, networkMode: 'always' },
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
export const useChannelDocOwners = (payload: {
  channelId: string;
  rootFolderId: string;
}) => {
  return useQuery({
    queryKey: ['channel-doc-owners', payload],
    queryFn: () => getChannelDocOwners(payload),
  });
};

// Channel document deep search
export const useChannelDocDeepSearch = (
  payload: { channelId: string; params: Record<string, any> },
  options: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['channel-doc-deep-search', payload],
    queryFn: (context) => getChannelDocDeepSearch(context, payload),
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 1 * 60 * 1000, // 1min
    ...{ ...options, networkMode: 'always' },
  });
};

// Get sync status
export const useChannelDocSyncStatus = (payload: { channelId: string }) => {
  return useQuery({
    queryKey: ['channel-doc-sync-status', payload],
    queryFn: () => getChannelDocumentSyncStatus(payload),
  });
};
