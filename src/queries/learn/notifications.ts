import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';

// Mark all notifications as read
export const markAllNotificationsAsRead = async (q: Record<string, any>) => {
  const data = await apiService.put(`/notifications/mark_all_as_read`, {
    category: q.category || 'LXP',
  });
  return data;
};
export const markAllNotificationsAsReadLearner = async (
  q: Record<string, any>,
) => {
  const data = await apiService.put(`/learner/notifications/mark_all_as_read`, {
    category: q.category || 'LXP',
  });
  return data;
};

// Mark a notification as ready by its id
export const markNotificationAsReadById = async (id: string) => {
  const data = await apiService.put(`/notifications/${id}`);
  return data;
};

// Get unread notifications count
const getUnreadNotificationsCount = async () => {
  const data = await apiService.get('/notifications/count');
  return data;
};

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => getUnreadNotificationsCount(),
    refetchInterval: 60 * 1000,
  });
};

export const fetchNotifications = (
  {
    pageParam = null,
    queryKey,
  }: QueryFunctionContext<(string | Record<string, any> | undefined)[], any>,
  apiPrefix = '',
) => {
  if (pageParam === null)
    return apiService.get(`${apiPrefix}/notifications`, queryKey[1]);
  else return apiService.get(pageParam);
};

// Infinite scroll for notifications
export const useInfiniteNotifications = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['notifications-page', q],
    queryFn: fetchNotifications,
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
export const useInfiniteNotificationsLearner = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['notifications-page', q],
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
