import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

// Get all notifications
const getNotifications = async (mentions?: boolean, limit = 20) => {
  console.log('hey', { mentions });
  const data = await apiService.get(
    `/notifications?limit=${limit}${mentions ? '&mentions=true' : ''}`,
  );
  return data;
};

export const useGetNotifications = (mentions?: boolean, limit?: number) => {
  return useQuery({
    queryKey: ['get-notifications'],
    queryFn: () => getNotifications(mentions, limit),
  });
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (limit = 20) => {
  const data = await apiService.put(`/notifications?limit=${limit}`);
  return data;
};

export const useMarkAllNotificationsAsRead = (limit?: number) => {
  return useQuery({
    queryKey: ['mark-all-notifications-as-read', limit],
    queryFn: () => markAllNotificationsAsRead(limit),
  });
};

// Mark a notification as ready by its id
const markNotificationAsReadById = async (id: string) => {
  const data = await apiService.put(`/notifications/${id}`);
  return data;
};

export const useMarkNotificationAsReadyById = (id: string) => {
  return useQuery({
    queryKey: ['mark-notification-as-read-by-id', id],
    queryFn: () => markNotificationAsReadById(id),
  });
};
