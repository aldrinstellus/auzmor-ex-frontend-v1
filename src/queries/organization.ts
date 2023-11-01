import { useMutation, useQuery } from '@tanstack/react-query';
import useAuth from 'hooks/useAuth';
import apiService from 'utils/apiService';

export enum IdentityProvider {
  CUSTOM_LDAP,
  MS_AZURE_AD,
  OKTA,
  GSUITE,
  CUSTOM_SAML,
}

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
  return useQuery({
    queryKey: ['get-sso-from-domain'],
    queryFn: () => fetchSSOFromDomain(domain),
    enabled,
  });
};

const getOrganization = async (domain: string) => {
  const data = await apiService.get(`/organizations/${domain}`);
  return data.data.result.data as IOrganization;
};

export const useOrganization = (domain?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['organization', domain || user?.organization.domain],
    queryFn: () => getOrganization(domain || user?.organization.domain || ''),
  });
};

export const patchLimitGlobalPosting = async (
  id: string,
  limitGlobalPosting: boolean,
) => {
  await apiService.patch(`/organizations/${id}`, {
    limitGlobalPosting,
  });
};

export const useUpdateLimitGlobalPostingMutation = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: (limitGlobalPosting: boolean, id?: string) =>
      patchLimitGlobalPosting(id || user!.organization.id, limitGlobalPosting),
  });
};
