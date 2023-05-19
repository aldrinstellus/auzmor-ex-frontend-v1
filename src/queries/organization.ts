import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

const fetchSSOFromDomain = async (domain: string) => {
  const { data } = await apiService.get(`/organizations/${domain}`);
  return data;
};

export const useGetSSOFromDomain = (domain: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['get-sso-from-domain'],
    queryFn: () => fetchSSOFromDomain(domain),
    enabled,
  });
};
