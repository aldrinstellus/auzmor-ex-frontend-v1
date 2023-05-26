import React, { ReactElement, useMemo, useEffect, useState } from 'react';
import SSOCard from './components/SSOCard';
import ActiveDirectory from 'images/activeDirectory.png';
import MicrosoftAD from 'images/microsoftAd.svg';
import Okta from 'images/okta.png';
import GSuite from 'images/Gsuite.png';
import SAML from 'images/saml.png';
import useModal from 'hooks/useModal';
import ConfigureGenericSSO from './components/ConfigureGenericSSO';
import { IdentityProvider, useGetSSO } from 'queries/organization';
import ConfigureLDAP from './components/ConfigureLDAP';
import Banner, { Variant } from 'components/Banner';
import { snakeCase } from 'lodash';

enum ConfigureScreen {
  GENERIC = 'GENERIC',
  LDAP = 'LDAP',
}

export type ISSOSetting = {
  logo: string;
  description: string;
  key: string;
  idp: IdentityProvider;
  configureScreen: ConfigureScreen;
  active?: boolean;
  config?: any;
  allowFallback?: boolean;
  allowOnlyExistingUser?: boolean;
};

type SSOConfig = {
  idp: IdentityProvider;
  config: any;
  allowFallback?: boolean;
  allowOnlyExistingUser?: boolean;
  active: boolean;
};

const SSOSettings: React.FC = (): ReactElement => {
  // 1. GET list of SSO configs
  // 2. If there are any of them that are active, show the activated chip and the three dot menu beside them
  // 3. If the user tries to activate any other SSO while one of them is active, show the error message.
  // 4. If the user successfully integrates SSO, refetch list of SSOs
  // 5. If the user successfully deletes SSO, refetch list of SSOs.

  const { data, isLoading, isError } = useGetSSO();
  const [open, openModal, closeModal] = useModal();
  const [ssoSetting, setSsoSetting] = useState<ISSOSetting>();
  const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);

  useEffect(() => {
    setShowErrorBanner(false);
  }, [data]);

  const getSSOValues = (idp: string) => {
    if (!idp) {
      return {};
    }
    let result = {};
    const ssoSetting: SSOConfig = data?.result.data.find(
      (sso: any) => sso.idp === idp,
    );
    if (ssoSetting) {
      result = {
        active: ssoSetting.active,
        config: ssoSetting.config,
        allowFallback: ssoSetting?.allowFallback,
        allowOnlyExistingUser: ssoSetting?.allowOnlyExistingUser,
      };
    }
    return result;
  };

  const ssoIntegrations = [
    {
      logo: ActiveDirectory,
      description:
        'LDAP (Lightweight Directory Access Protocol) an internet protocol, which is used to look up user data from a server.',
      key: 'Active Directory',
      idp: IdentityProvider.CUSTOM_LDAP,
      configureScreen: ConfigureScreen.LDAP,
      ...getSSOValues(IdentityProvider[0]),
    },
    {
      logo: MicrosoftAD,
      description:
        "Azure Active Directory (Azure AD) is Microsoft's cloud-based identity and access management service.",
      key: 'ADFS (SSO)',
      idp: IdentityProvider.MS_AZURE_AD,
      configureScreen: ConfigureScreen.GENERIC,
      ...getSSOValues(IdentityProvider[1]),
    },
    {
      logo: Okta,
      description:
        'The Okta Identity Cloud is an independent and neutral platform that securely connects the right people to the right technologies at right time.',
      key: 'Okta (SSO)',
      idp: IdentityProvider.OKTA,
      configureScreen: ConfigureScreen.GENERIC,
      ...getSSOValues(IdentityProvider[2]),
    },
    {
      logo: GSuite,
      description:
        'Use Google Cloud Identity to manage your users, apps, and devices from a central location—the Google Admin console.',
      key: 'Google (SSO)',
      idp: IdentityProvider.GSUITE,
      configureScreen: ConfigureScreen.GENERIC,
      ...getSSOValues(IdentityProvider[3]),
    },
    {
      logo: SAML,
      description:
        'Seamlessly enable secure access to Auzmor Learn through your own SAML-enabled identity provider.',
      key: 'SAML (SSO)',
      idp: IdentityProvider.CUSTOM_SAML,
      configureScreen: ConfigureScreen.GENERIC,
      ...getSSOValues(IdentityProvider[4]),
    },
  ];

  const activeSSO = useMemo(
    () => ssoIntegrations.find((sso: ISSOSetting) => sso.active),
    [ssoIntegrations],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching SSO List</div>;
  }

  const onClick = (key: string) => {
    setSsoSetting(ssoIntegrations.find((item) => item.key === key));
    openModal();
  };

  return (
    <div>
      {showErrorBanner && activeSSO && (
        <Banner
          variant={Variant.Error}
          title={`Deactivate ${activeSSO?.key} to configure`}
          className="mb-4"
        />
      )}
      <div className="flex gap-x-6 flex-wrap gap-y-6">
        {ssoIntegrations.map((integration: ISSOSetting) => (
          <SSOCard
            key={integration.key}
            id={integration.key}
            logo={integration.logo}
            description={integration.description}
            onClick={onClick}
            idp={integration.idp}
            active={integration.active || false}
            setShowErrorBanner={setShowErrorBanner}
            activeSSO={activeSSO}
            dataTestId={`sso-admin-${snakeCase(integration.key)}`}
          />
        ))}
        {open && ssoSetting?.configureScreen === ConfigureScreen.GENERIC && (
          <ConfigureGenericSSO
            ssoSetting={ssoSetting}
            closeModal={closeModal}
            open={open}
          />
        )}
        {open && ssoSetting?.configureScreen === ConfigureScreen.LDAP && (
          <ConfigureLDAP
            ssoSetting={ssoSetting}
            closeModal={closeModal}
            open={open}
          />
        )}
      </div>
    </div>
  );
};

export default SSOSettings;
