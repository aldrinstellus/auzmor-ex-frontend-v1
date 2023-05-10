import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

// get all users -> /users
const getAllUsers = async (q: Record<string, any>) => {
  const { data } = await apiService.get('/users', q);
  return data;
};

// get user by id -> users/:id
export const getUser = async (id: string) => {
  const data = await apiService.get(`/users/${id}`, {});
  return data;
};

// get user/me -> users/me
export const getCurrentUser = async () => {
  const data = await apiService.get('/users/me');
  return data;
};

// update current the user/me -> users/me
export const updateCurrentUser = async (payload: Record<string, any>) => {
  return await apiService.patch('/users/me', payload);
};

// update user by id -> users/:id
export const updateUserById = async (
  userId: string,
  payload: Record<string, any>,
) => {
  return await apiService.patch(`users/${userId}`, payload);
};

// invite user by email id -> users?q=emailId
export const inviteUsers = async (q: Record<string, any>) => {
  const data = await apiService.post('/users', q);
  return new Promise((res) => {
    res(data);
  });
};

// delete user by id -> users/:id
export const deleteUser = async (id: string) => {
  const data = await apiService.delete(`/users/${id}`, {});
  return new Promise((res) => {
    res(data);
  });
};

// use react query to get all users
export const useUsers = (q: Record<string, any>) => {
  return useQuery({
    queryKey: ['users', q],
    queryFn: () => getAllUsers(q),
    staleTime: 15 * 60 * 1000,
  });
};

// use react query to get single user
export const useSingleUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    staleTime: 15 * 60 * 1000,
  });
};

// use react query to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user-me'],
    queryFn: () => getCurrentUser(),
    staleTime: 15 * 60 * 1000,
  });
};
