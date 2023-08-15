import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

interface IGetLocationsPayload {
  q: string;
}

export const getLocations = async (payload: IGetLocationsPayload) => {
  const data = await apiService.get('/locations', payload);
  return data.data.result.data;
};

export const useGetLocations = (q: string) => {
  return useQuery({
    queryKey: ['getLocations'],
    queryFn: () => getLocations({ q }),
  });
};
