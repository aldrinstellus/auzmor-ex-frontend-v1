import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

interface ILogin {
  email: string;
  password: string;
}
interface IForgotPassword {
  email: string;
}

interface IReset {
  newPassword: string;
  confirmPassword: string;
}

interface IMailExpiry {
  token: string;
}

export const login = async (payload: ILogin) => {
  const data = await apiService.post('/login', payload);
  return data;
};

export const forgotPassword = async (payload: IForgotPassword) => {
  const { data } = await apiService.post('/password/reset', payload);
  return data;
};

export const resetPassword = async (payload: IReset) => {
  const { data } = await apiService.put('/password/reset', payload);
  return data;
};

export interface IOrganization {
  domain: string;
  workEmail: string;
  password: string;
}

export const signup = async (payload: IOrganization) => {
  return await apiService.post('/organizations/signup', payload);
};

export const fetchMe = async () => {
  const { data } = await apiService.get('/users/me');
  return data;
};
