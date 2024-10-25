import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';

// Mark all notifications as read

export const markAllNotificationsAsRead = async (q: Record<string, any>) => {
  const data = await apiService.post(`/notifications/mark_all_as_read`, {
    category: q.category || 'LXP',
  });
  return data;
};
export const markAllNotificationsAsReadLearner = async (
  q: Record<string, any>,
) => {
  const data = await apiService.post(
    `/learner/notifications/mark_all_as_read`,
    {
      category: q.category || 'LXP',
    },
  );
  return data;
};

// Mark a notification as ready by its id
export const markNotificationAsReadById = async (id: string) => {
  const data = await apiService.put(`/notifications/${id}/mark_as_read`);
  return data;
};

export const markNotificationAsReadByIdLearner = async (id: string) => {
  const data = await apiService.put(
    `/learner/notifications/${id}/mark_as_read`,
  );
  return data;
};

// Get unread notifications count
const getUnreadNotificationsCount = async () => {
  const data = await apiService.get('/notifications/counts');
  return data;
};

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => getUnreadNotificationsCount(),
    refetchInterval: 60 * 1000,
  });
};

export const fetchNotifications = async (
  {
    pageParam = 1,
    queryKey,
  }: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>,
  apiPrefix = '',
) => {
  const query: any = queryKey[1];
  const response = await apiService.get(`${apiPrefix}/notifications`, {
    ...query,
    page: pageParam,
  });
  const { data } = response;

  const transformedData = data?.result?.data?.map((item: any) => ({
    ...item,
  }));

  return {
    data: {
      result: {
        data: transformedData,
      },
      nextPage: pageParam + 1,
    },
  };
};

export const useInfiniteNotifications = (query?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['get-notifications', query],
    queryFn: fetchNotifications,
    getNextPageParam: (lastPage, pages) => {
      const lastPageDataLength = lastPage?.data?.result?.data?.length || 0;
      const limit = query?.limit || 20;

      if (lastPageDataLength < limit) {
        return undefined; // No more data to fetch
      }

      // Otherwise, return the next page number
      const currentPage = pages.length;
      return currentPage + 1;
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useInfiniteNotificationsLearner = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['get-learner-notifications', q],
    queryFn: (context) => fetchNotifications(context, '/learner'),
    getNextPageParam: (lastPage: any) =>
      lastPage?.data?.result?.data?.length >= q?.limit
        ? lastPage?.data?.result?.paging?.next
        : null,
    getPreviousPageParam: (currentPage: any) =>
      currentPage?.data?.result?.data?.length >= q?.limit
        ? currentPage?.data?.result?.paging?.prev
        : null,
    staleTime: 0,
  });
};
