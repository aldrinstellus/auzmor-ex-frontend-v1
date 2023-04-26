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

export const login = async (payload: ILogin) => {
  const data = await apiService.post('/login', payload);
  return data;
};

export const forgotPassword = async (payload: IForgotPassword) => {
  const { data } = await apiService.post(
    '/auth/user/password-reset-mail',
    payload,
  );
  return data;
};

export const resetPassword = async (payload: IReset) => {
  const { data } = await apiService.post('/auth/user/password-reset', payload);
  return data;
};

export const signup = async () => {};
