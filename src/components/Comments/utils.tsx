import { IComment } from ".";

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
}

export function useCommentsFetcher<T>({
  useApiHook,
  hookParams,
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
    data?.pages.flatMap((page: any) => page.data?.result?.data) ?? [];
  
  const totalCommentsCount = data?.pages?.[0].data?.result?.totalCount;

  return {
    commentIds,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    comment,
    totalCommentsCount,
  };
}