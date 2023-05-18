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
  // console.log(IdentityProvider[3]);
  // console.log({ params });
  return await apiService.put(
    `organizations/sso?idp=${IdentityProvider[params.idp]}`,
    params.formData,
    {
      'Content-Type': 'multipart/form-data',
    },
  );
};
