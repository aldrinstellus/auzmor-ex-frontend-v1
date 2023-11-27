import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { BRANDING } from 'utils/constants';

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
interface IChange {
  newPassword: string;
  confirmPassword: string;
}

// interface IMailExpiry {
//   token: string;
// }

export const checkLogin = async () => {
  const data = await apiService.get('/login');
  return data;
};

export const useCheckLogin = () =>
  useQuery({
    queryKey: ['check-login'],
    queryFn: () => checkLogin(),
  });

export const login = async (payload: ILogin) => {
  const data = await apiService.post('/login', payload);
  return data;
};

export const forgotPassword = async (payload: IForgotPassword) => {
  const { data } = await apiService.post('/password/reset', payload);
  return data;
};

export const tokenValidation = async (token: string) => {
  const { data } = await apiService.get(`/password/reset?token=${token}`);
  return data;
};

export const useTokenValidation = (token: string) =>
  useQuery({
    queryKey: ['validation-token'],
    queryFn: () => tokenValidation(token),
  });

export const resetPassword = async (payload: IReset) => {
  const { data } = await apiService.put('/password/reset', payload);
  return data;
};

export const changePassword = async (payload: IChange) => {
  const { data } = await apiService.put('/password', payload);
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
  data.result.data.branding = BRANDING;
  return data;
};

export const logout = async () => {
  await apiService.post('/logout');
};
