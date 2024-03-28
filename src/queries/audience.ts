import {
  QueryFunctionContext,
  useInfiniteQuery,
  // useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { AudienceEntityType } from './post';

export type User = {
  id: string;
  name: string;
  profileImage: {
    original: string;
  };
};

export interface IAudience {
  id: string;
  entityType: AudienceEntityType;
  name: string;
  totalMembers: number | null;
  recentMembers: User[] | null;
  category: string | null;
  description?: string;
  profileImage?: string;
}

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
  const [_queryKey, entity, entityId, params] = queryKey;
  if (pageParam === null) {
    return await apiService.get(`/${entity}/${entityId}/audience`, {
      limit: 10,
      ...(params || {}),
    });
  } else return await apiService.get(pageParam);
};

export const useInfiniteAudience = (
  entity: string,
  entityId: string,
  params?: Record<string, string>,
  rest?: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['audience', entity, entityId, params],
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
