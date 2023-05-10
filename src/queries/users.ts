import { useMutation, useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface IProfileImage {
  fileId: string;
  originalUrl: string;
}
export interface IUserUpdate {
  id: string;
  profileImage?: IProfileImage;
  timezone?: string;
}

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

export const updateUser = async (user: IUserUpdate) => {
  const { id, ...rest } = user;
  const data = await apiService.patch(`/users/${user.id}`, { ...rest });
  return data;
};

export const updateUserMutation = (mutationKey: string, updateUser: any) => {
  return useMutation(updateUser, {
    mutationKey: [mutationKey],
    onError: (error: any) => {
      console.log('API call resulted in error: ', error);
    },
    onSuccess: (response) => {
      console.log('API call success', response);
      updateUser(response);
    },
  });
};
