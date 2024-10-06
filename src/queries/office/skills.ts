import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface ISkill {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const getAllSkills = async ({
  pageParam = null,
  queryKey,
}: // queryKey,
QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('users/skills', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const useInfiniteSkills = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['skills', q],
    queryFn: getAllSkills,
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
    staleTime: 0,
  });
};
