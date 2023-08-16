import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { IGetUser } from './users';

export interface IDepartment {
  uuid: string;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: Record<string, any>;
  organization: Record<string, any>;
}

interface IGetDepartmentsPayload {
  q: string;
}

export const getDepartments = async (payload: IGetDepartmentsPayload) => {
  const data = await apiService.get('/depatment', payload);
  return data.data.result.data as IDepartment[];
};

export const useGetDepartments = (q: string) => {
  return useQuery({
    queryKey: ['getDepartments'],
    queryFn: () => getDepartments({ q }),
  });
};
