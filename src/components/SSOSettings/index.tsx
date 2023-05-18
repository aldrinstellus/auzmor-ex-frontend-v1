import React, { ReactElement, useState } from 'react';
import SSOCard from './components/SSOCard';
import ActiveDirectory from 'images/activeDirectory.png';
import MicrosoftAD from 'images/microsoftAd.svg';
import Okta from 'images/okta.png';
import GSuite from 'images/Gsuite.png';
import SAML from 'images/saml.png';
import useModal from 'hooks/useModal';
import ConfigureGenericSSO from './components/ConfigureGenericSSO';
import { IdentityProvider } from 'queries/organization';

enum ConfigureScreen {
  GENERIC = 'GENERIC',
  LDAP = 'LDAP',
}

const ssoIntegrations = [
  {
    logo: ActiveDirectory,
    description:
      'LDAP (Lightweight Directory Access Protocol) an internet protocol, which is used to look up user data from a server.',
    key: 'Active Directory',
    idp: IdentityProvider.CUSTOM_LDAP,
    configureScreen: ConfigureScreen.GENERIC,
  },
  {
    logo: MicrosoftAD,
    description:
      "Azure Active Directory (Azure AD) is Microsoft's cloud-based identity and access management service.",
    key: 'ADFS (SSO)',
    idp: IdentityProvider.MS_AZURE_AD,
    configureScreen: ConfigureScreen.GENERIC,
  },
  {
    logo: Okta,
    description:
      'The Okta Identity Cloud is an independent and neutral platform that securely connects the right people to the right technologies at right time.',
    key: 'Okta (SSO)',
    idp: IdentityProvider.OKTA,
    configureScreen: ConfigureScreen.GENERIC,
  },
  {
    logo: GSuite,
    description:
      'Use Google Cloud Identity to manage your users, apps, and devices from a central location—the Google Admin console.',
    key: 'Google (SSO)',
    idp: IdentityProvider.GSUITE,
    configureScreen: ConfigureScreen.GENERIC,
  },
  {
    logo: SAML,
    description:
      'Seamlessly enable secure access to Auzmor Learn through your own SAML-enabled identity provider.',
    key: 'SAML (SSO)',
    idp: IdentityProvider.CUSTOM_SAML,
    configureScreen: ConfigureScreen.GENERIC,
  },
];

export type ISSOSetting = {
  logo: string;
  description: string;
  key: string;
  idp: IdentityProvider;
  configureScreen: ConfigureScreen;
};

const SSOSettings: React.FC = (): ReactElement => {
  const [open, openModal, closeModal] = useModal();
  const [ssoSetting, setSsoSetting] = useState<ISSOSetting>();

  const onClick = (key: string) => {
    setSsoSetting(ssoIntegrations.find((item) => item.key === key));
    openModal();
  };

  return (
    <div className="flex gap-x-6 flex-wrap gap-y-6">
      {ssoIntegrations.map((integration) => (
        <SSOCard
          key={integration.key}
          id={integration.key}
          logo={integration.logo}
          description={integration.description}
          onClick={onClick}
        />
      ))}
      {open && ssoSetting?.configureScreen === ConfigureScreen.GENERIC && (
        <ConfigureGenericSSO
          ssoSetting={ssoSetting}
          closeModal={closeModal}
          open={open}
        />
      )}
    </div>
  );
};

export default SSOSettings;
