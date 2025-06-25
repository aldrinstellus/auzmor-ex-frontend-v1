import { IComment } from ".";

type CommentItem = { id: string };

interface UseCommentsFetcherOptions<T> {
  useApiHook: (params: T) => {
    data: any;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void | Promise<any>;
    hasNextPage: boolean;
    comment: Record<string, IComment>;
  };
  hookParams: T;
  extractComments: (page: any) => CommentItem[];
}

export function useCommentsFetcher<T>({
  useApiHook,
  hookParams,
  extractComments,
}: UseCommentsFetcherOptions<T>) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comment,
  } = useApiHook(hookParams);

  const commentIds: { id: string }[] =
    data?.pages.flatMap((page: any) => extractComments(page)) ?? [];

  return {
    commentIds,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comment,
  };
}