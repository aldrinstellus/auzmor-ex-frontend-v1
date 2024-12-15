import { useMutation, useQuery } from '@tanstack/react-query';
import { IBranding } from 'contexts/AuthContext';
import useAuth from 'hooks/useAuth';
import { IdentityProvider } from 'interfaces';
import { useBrandingStore } from 'stores/branding';
import apiService from 'utils/apiService';

export interface IUpdateSSO {
  idp: IdentityProvider;
  formData: FormData;
}

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

export const updateSso = async (params: IUpdateSSO) => {
  return await apiService.put(
    `organizations/sso?idp=${IdentityProvider[params.idp]}`,
    params.formData,
    {
      'Content-Type': 'multipart/form-data',
    },
  );
};

const getSSO = async () => {
  const result = await apiService.get('/organizations/sso');
  return result.data;
};

export const useGetSSO = () => {
  return useQuery({
    queryKey: ['get-sso'],
    queryFn: getSSO,
  });
};

export const deleteSSO = async (idp: IdentityProvider) => {
  return await apiService.delete(
    `/organizations/sso?idp=${IdentityProvider[idp]}`,
  );
};
const fetchSSOFromDomain = async (domain: string) => {
  const { data } = await apiService.get(`/organizations/${domain}`);
  return data;
};

export const useGetSSOFromDomain = (domain: string, enabled?: boolean) => {
  const setBranding = useBrandingStore((state) => state.setBranding);
  return useQuery({
    queryKey: ['get-sso-from-domain'],
    queryFn: () => fetchSSOFromDomain(domain),
    onSuccess: (data) => setBranding(data?.result?.data?.branding || null),
    enabled,
  });
};

export const signup = async (payload: IOrganization) => {
  return await apiService.post('/organizations/signup', payload);
};

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

export const updateOrganization = async (
  id: string,
  limitGlobalPosting: boolean,
) => {
  await apiService.patch(`/organizations/${id}`, {
    limitGlobalPosting,
  });
};

export const useUpdateOrganization = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: (limitGlobalPosting: boolean, id?: string) =>
      updateOrganization(id || user!.organization.id, limitGlobalPosting),
  });
};

export const updateOrganizationConfiguration = async (branding: IBranding) => {
  const response = await apiService.patch(`/organizations/configuration`, {
    branding,
  });
  return response;
};

export const useUpdateOrganizationConfiguration = () => {
  return useMutation({
    mutationFn: (branding: IBranding) =>
      updateOrganizationConfiguration(branding),
  });
};
