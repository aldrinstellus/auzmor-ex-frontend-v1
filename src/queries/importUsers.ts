import { useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export const startImportUser = async (payload: Record<string, any>) => {
  const data = await apiService.post('/users/import', payload);
  return data;
};

export const parseImport = async (importId: string) => {
  const data = await apiService.post(`/users/import/${importId}/parse`);
  return data;
};

export const updateParseImport = async (
  importId: string,
  payload: Record<string, any>,
) => {
  const data = await apiService.patch(
    `/users/import/${importId}/parse`,
    payload,
  );
  return data;
};

export const validateImport = async (importId: string) => {
  const { data } = await apiService.post(`/users/import/${importId}/validate`);
  return data;
};

export const startCreatingUsers = async (importId: string) => {
  const data = await apiService.post(`/users/import/${importId}/create`);
  return data;
};

export const getImportDataStatus = async (importId: string) => {
  await apiService.get(`/users/import/${importId}/validate`);
};

export const getImportData = async ({
  importId,
  pageParam = null,
  queryKey,
}: any) => {
  if (pageParam === null) {
    return await apiService.get(
      `/users/import/${importId}/validate`,
      queryKey[1],
    );
  } else return await apiService.get(pageParam);
};

export const useInfiniteImportData = ({
  importId,
  q = {},
  startFetching = false,
}: {
  startFetching: boolean;
  importId: string;
  q?: Record<string, any>;
}) => {
  return useInfiniteQuery({
    queryKey: ['csv-import', q],
    queryFn: ({ pageParam, queryKey }) =>
      getImportData({ importId, pageParam, queryKey }),
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.info?.length;
      const pageLimit = lastPage?.data?.result?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 0,
    enabled: startFetching,
  });
};

export const getImportResultData = async ({
  importId,
  pageParam = null,
  queryKey,
}: any) => {
  if (pageParam === null) {
    return await apiService.get(
      `/users/import/${importId}/report`,
      queryKey[2],
    );
  } else return await apiService.get(pageParam);
};

export const useInfiniteImportResultData = ({
  importId,
  q = {},
  startFetching = false,
}: {
  startFetching: boolean;
  importId: string;
  q?: Record<string, any>;
}) => {
  return useInfiniteQuery({
    queryKey: ['csv-import', 'result', q],
    queryFn: ({ pageParam, queryKey }) =>
      getImportResultData({ importId, pageParam, queryKey, ...q }),
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.data?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 0,
    enabled: startFetching,
  });
};

export const downloadReport = async (importId: string, status: string) => {
  const { data } = await apiService.get(
    `/users/import/${importId}/report/download?status=${status}`,
  );
  return data;
};
