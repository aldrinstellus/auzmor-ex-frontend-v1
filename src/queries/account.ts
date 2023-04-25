import apiService from 'utils/apiService';

interface ILogin {
  email: string;
  password: string;
}

export const login = async (payload: ILogin) => {
  const { data } = await apiService.post('/login', payload);
  return data;
};

export const signup = async () => {};
