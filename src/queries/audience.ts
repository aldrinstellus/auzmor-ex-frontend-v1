import {
  QueryFunctionContext,
  useInfiniteQuery,
  // useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';

export const getAllUser = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/users', queryKey[1]);
  } else return await apiService.get(pageParam);
};
const getAudience = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<any>) => {
  if (pageParam === null) {
    return await apiService.get(`/posts/${queryKey[1]}/audience`, {
      limit: 10,
    });
  } else return await apiService.get(pageParam);
};

export const useAudience = (entityId: string, rest: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['audience', entityId],
    queryFn: getAudience,
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
    ...rest,
  });
};
