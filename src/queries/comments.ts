import {
  QueryFunctionContext,
  useInfiniteQuery,
  // useQuery,
} from '@tanstack/react-query';
import { IComment } from 'components/Comments';
import { useCommentStore } from 'stores/commentStore';
import apiService from 'utils/apiService';
import { chain } from 'utils/misc';

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

export const getComments = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  comment: {
    [key: string]: IComment;
  },
  setComment: (feed: { [key: string]: IComment }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/comments', context.queryKey[1]);
    setComment({
      ...comment,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IComment) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam);
    setComment({
      ...comment,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IComment) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const useInfiniteComments = (q: IComments) => {
  const { comment, setComment } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['comments', q],
      queryFn: (context) => getComments(context, comment, setComment),
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
  const { data } = await apiService.post(`/comments`, payload);
  return data;
};

export const updateComment = async (id: string, payload: any) => {
  const { data } = await apiService.put(`/comments/${id}`, payload);
  return data;
};
