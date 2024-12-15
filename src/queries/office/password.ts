import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

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
