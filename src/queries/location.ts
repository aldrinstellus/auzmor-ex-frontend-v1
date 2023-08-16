import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface ILocation {
  uuid: string;
  city?: string;
  state?: string;
  country?: string;
  isoCode?: {
    alpha2?: string;
    alpha3?: string;
    unCode?: string;
  };
}

interface IGetLocationsPayload {
  q: string;
}

export const getLocations = async (payload: IGetLocationsPayload) => {
  const data = await apiService.get('/locations', payload);
  return data.data.result.data as ILocation[];
};

export const useGetLocations = (q: string) => {
  return useQuery({
    queryKey: ['getLocations'],
    queryFn: () => getLocations({ q }),
  });
};
