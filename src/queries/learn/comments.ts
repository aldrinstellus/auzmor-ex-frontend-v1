import {
  QueryFunctionContext,
  useInfiniteQuery,
  // useQuery,
} from '@tanstack/react-query';
import { IComment } from 'components/Comments';
import { useCommentStore } from 'stores/commentStore';
import apiService from 'utils/apiService';

interface IContent {
  html: string;
  text: string;
  editor: Record<string, any>;
}

export interface IComments {
  entityId: string;
  entityType: string;
  limit?: number;
  page?: number;
  content?: IContent;
  hashtags?: string[];
  mentions?: Array<object>;
}

export const deleteComment = async (id: string) => {
  await apiService.delete(`/comments/${id}`);
};
export const deleteCommentLearner = async (id: string) => {
  await apiService.delete(`/learner/comments/${id}`);
};

export const getComments = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  appendComments: (comments: IComment[]) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/comments', context.queryKey[1]);
    appendComments(response.data.result.data);
    response.data.result.data = response.data.result.data.map(
      (eachPost: IComment) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam);
    appendComments(response.data.result.data);
    response.data.result.data = response.data.result.data.map(
      (eachPost: IComment) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const useInfiniteComments = (q: IComments) => {
  const { comment, appendComments } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['comments', q],
      queryFn: (context) => getComments(context, appendComments),
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
    }),
    comment,
  };
};

export const createComment = async (payload: IComments) => {
  const { result } = await apiService.post(`/comments`, payload);
  return result?.data;
};

export const updateComment = async (id: string, payload: any) => {
  const { data } = await apiService.put(`/comments/${id}`, payload);
  return data;
};
