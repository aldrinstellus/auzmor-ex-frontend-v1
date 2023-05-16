import { useMutation, useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface IProfileImage {
  fileId: string;
  original: string;
}
export interface IUserUpdate {
  id: string;
  profileImage?: IProfileImage;
  timezone?: string;
}

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

interface UserQueryParams {
  q?: string;
  limit?: number;
  prev?: number;
  next?: number;
  name?: string;
  email?: string;
  status?: string;
}

// get all users people listing
const getAllUsers = async ({ limit, prev, next }: UserQueryParams) => {
  const { data } = await apiService.get(`/users`, {
    limit: limit,
    prev: prev,
    next: next,
  });
  return data;
};

// existing user
export const isUserExist = async (q: { email: string }) => {
  const { data } = await apiService.get('/users/exists', q);
  return data;
};

// verify invite
export const verifyInviteLink = async (q: Record<string, any>) => {
  const { data } = await apiService.get('/users/invite/verify', q);
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

// delete user by id -> users/:id
export const deleteUser = async (id: string) => {
  const data = await apiService.delete(`/users/${id}`, {});
  return new Promise((res) => {
    res(data);
  });
};

export const inviteUsers = async (payload: IPostUsers) => {
  const data = await apiService.post('/users', payload);
  return new Promise((res) => {
    res(data);
  });
};

export const acceptInviteSetPassword = async (q: Record<string, any>) => {
  return await apiService.put('/users/invite/reset-password', q);
};

{
  /* REACT QUERY */
}

// use react query to get all users
export const useUsers = ({ limit, prev, next }: UserQueryParams) => {
  return useQuery({
    queryKey: ['users', limit, prev, next],
    queryFn: () => getAllUsers({ limit, prev, next }),
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

export const updateUserAPI = async (user: IUserUpdate) => {
  const { id, ...rest } = user;
  const data = await apiService.patch(`/users/${user.id}`, { ...rest });
  return data;
};

export const useVerifyInviteLink = (q: Record<string, any>) => {
  return useQuery({
    queryKey: ['users-invite', q],
    queryFn: () => verifyInviteLink(q),
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

export const useResendInvitation = () => {
  const resendInvitation = async (id: string) => {
    const { data } = await apiService.put(`/users/${id}/resend-invitation`);
    return data;
  };

  return useMutation({
    mutationKey: ['resend-invitation'],
    mutationFn: resendInvitation,
  });
};
