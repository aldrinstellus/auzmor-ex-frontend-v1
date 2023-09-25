import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface IPollVotes {
  postId: string;
  optionId?: string;
  limit?: number;
  cursor?: string;
}

export interface IGetPollVote {
  id: string;
  primaryEmail: string;
}

export const getPollVotes = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<any>) => {
  if (pageParam === null) {
    const { postId, ...q } = queryKey[1];
    return apiService.get(`posts/${postId}/votes/voters`, q);
  } else {
    return apiService.get(pageParam);
  }
};

export const useInfinitePollVotes = (q: IPollVotes) => {
  return useInfiniteQuery({
    queryKey: ['pollVotes', q],
    queryFn: getPollVotes,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.paging?.prev;
    },
    staleTime: 0,
  });
};
