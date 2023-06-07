import { useQuery } from '@tanstack/react-query';
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
