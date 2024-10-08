import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export const getAllDesignations = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/designations', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const useInfiniteDesignations = ({
  q,
  startFetching = true,
}: {
  q?: Record<string, any>;
  startFetching: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ['designations', q],
    queryFn: getAllDesignations,
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
    staleTime: 5 * 60 * 1000,
    enabled: startFetching,
  });
};
