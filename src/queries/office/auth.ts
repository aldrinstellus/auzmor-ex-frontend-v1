import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

interface ILogin {
  email: string;
  password: string;
}

export interface ILoginViaSSOParam {
  email?: string;
  domain?: string;
}

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

export const loginViaSSO = async (params: ILoginViaSSOParam) => {
  const { data } = await apiService.get('/sso/login', params);
  return data;
};

export const useLoginViaSSO = (
  params: ILoginViaSSOParam,
  config: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['login-via-sso', params],
    queryFn: () => loginViaSSO(params),
    ...config,
  });
};

export const logout = async () => {
  await apiService.post('/logout');
};
