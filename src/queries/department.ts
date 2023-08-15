import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

interface IGetDepartmentsPayload {
  q: string;
}

export const getDepartments = async (payload: IGetDepartmentsPayload) => {
  const data = await apiService.get('/depatment', payload);
  return data.data.result.data;
};

export const useGetDepartments = (q: string) => {
  return useQuery({
    queryKey: ['getDepartments'],
    queryFn: () => getDepartments({ q }),
  });
};
