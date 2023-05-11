import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

const getAllUsers = async (q: Record<string, any>) => {
  const { data } = await apiService.get('/users', q);
  return data;
};

export const useUsers = (q: Record<string, any>) => {
  return useQuery({
    queryKey: ['users', q],
    queryFn: () => getAllUsers(q),
    staleTime: 15 * 60 * 1000,
  });
};

export const inviteUsers = async (q: Record<string, any>) => {
  const data = await apiService.post('/users', q);
  return new Promise((res) => {
    res(data);
  });
};

export const deleteUser = async (id: string) => {
  const data = await apiService.delete(`/users/${id}`, {});
  return new Promise((res) => {
    res(data);
  });
};

export const verifyInviteLink = async (q: Record<string, any>) => {
  const { data } = await apiService.get('/users/invite/verify', q);
  return data;
};

export const useVerifyInviteLink = (q: Record<string, any>) => {
  return useQuery({
    queryKey: ['users-invite', q],
    queryFn: () => verifyInviteLink(q),
  });
};

export const acceptInviteSetPassword = async (q: Record<string, any>) => {
  return await apiService.put('/users/invite/reset-password', q);
};
