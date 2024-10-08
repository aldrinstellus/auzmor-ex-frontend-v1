import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';

// Mark all notifications as read
export const markAllNotificationsAsRead = async (limit = 20) => {
  const data = await apiService.put(`/notifications?limit=${limit}`);
  return data;
};

// Mark a notification as ready by its id
export const markNotificationAsReadById = async (id: string) => {
  const data = await apiService.put(`/notifications/${id}`);
  return data;
};

// Get unread notifications count
const getUnreadNotificationsCount = async () => {
  const data = await apiService.get('/notifications/unread/count');
  return data;
};

export const useGetUnreadNotificationsCount = () => {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => getUnreadNotificationsCount(),
    refetchInterval: 60 * 1000,
  });
};

export const fetchNotifications = ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(string | Record<string, any> | undefined)[], any>) => {
  if (pageParam === null) return apiService.get('/notifications', queryKey[1]);
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
