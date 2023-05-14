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
export interface IPostUser {
  fullName: string;
  workEmail: string;
  role: string;
}

export interface IPostUsers {
  users: IPostUser[];
}

export enum UserStatus {
  Created = 'CREATED',
  Invited = 'INVITED',
  Attempted = 'ATTEMPTED',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Deleted = 'DELETED',
  Failed = 'FAILED',
}

export enum UserRole {
  Member = 'MEMBER',
  Admin = 'ADMIN',
  Superadmin = 'SUPERADMIN',
}

export interface IPostUsersResponse {
  id?: string;
  createdAt: string | null;
  fullName: string;
  message: string;
  organization: string;
  reason: string;
  role: UserRole;
  status: UserStatus;
  workEmail: string;
}

export const isUserExist = async (q: { email: string }) => {
  const { data } = await apiService.get('/users/exists', q);
  return data;
};

export const useUsers = ({ limit, prev, next }: UserQueryParams) => {
  return useQuery({
    queryKey: ['users', limit, prev, next],
    queryFn: () => getAllUsers({ limit, prev, next }),
    staleTime: 15 * 60 * 1000,
  });
};

export const inviteUsers = async (payload: IPostUsers) => {
  const data = await apiService.post('/users', payload);
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
