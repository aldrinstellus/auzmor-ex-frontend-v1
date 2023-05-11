import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

interface UserQueryParams {
  q?: string;
  limit?: number;
  prev?: number;
  next?: number;
  name?: string;
  email?: string;
  status?: string;
}

const getAllUsers = async ({ limit, prev, next }: UserQueryParams) => {
  const { data } = await apiService.get(`/users`, {
    limit: limit,
    prev: prev,
    next: next,
  });
  return data;
};

export const useUsers = ({ limit, prev, next }: UserQueryParams) => {
  return useQuery({
    queryKey: ['users', limit, prev, next],
    queryFn: () => getAllUsers({ limit, prev, next }),
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
