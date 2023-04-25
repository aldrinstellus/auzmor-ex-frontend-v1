import apiService from 'utils/apiService';

export interface IOrganization {
  domain: string;
  workEmail: string;
  password: string;
}

export const signup = async (payload: IOrganization) => {
  return await apiService.post('/organizations/signup', payload);
};
