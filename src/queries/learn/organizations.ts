import { useQuery } from '@tanstack/react-query';
import { IBranding } from 'contexts/AuthContext';
import useAuth from 'hooks/useAuth';
import { useBrandingStore } from 'stores/branding';
import apiService from 'utils/apiService';

export interface IOrganization {
  id: string;
  domain: string;
  name?: string;
  createdAt: string;
  adminSettings?: {
    postingControls: {
      limitGlobalPosting: boolean;
    };
  };
  branding: IBranding;
}

const getOrganization = async (domain: string) => {
  const data = await apiService.get(`/organizations/${domain}`);
  return data.data.result.data as IOrganization;
};

export const useOrganization = (domain?: string) => {
  const setBranding = useBrandingStore((state) => state.setBranding);
  const { user } = useAuth();
  return useQuery({
    queryKey: ['organization', domain || user?.organization.domain],
    queryFn: () => getOrganization(domain || user?.organization.domain || ''),
    onSuccess: (data) => setBranding(data?.branding || null),
  });
};
