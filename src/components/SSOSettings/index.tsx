import React, { ReactElement } from 'react';
import SSOCard from './components/SSOCard';
import ActiveDirectory from 'images/activeDirectory.png';
import MicrosoftAD from 'images/microsoftAd.svg';
import Okta from 'images/okta.png';
import GSuite from 'images/Gsuite.png';
import SAML from 'images/saml.png';

const SSOSettings: React.FC = (): ReactElement => {
  const ssoIntegrations = [
    {
      logo: ActiveDirectory,
      description:
        'LDAP (Lightweight Directory Access Protocol) an internet protocol, which is used to look up user data from a server.',
      key: 'active-directory',
    },
    {
      logo: MicrosoftAD,
      description:
        "Azure Active Directory (Azure AD) is Microsoft's cloud-based identity and access management service.",
      key: 'microsoft-azure-directory',
    },
    {
      logo: Okta,
      description:
        'The Okta Identity Cloud is an independent and neutral platform that securely connects the right people to the right technologies at right time.',
      key: 'okta',
    },
    {
      logo: GSuite,
      description:
        'Use Google Cloud Identity to manage your users, apps, and devices from a central location—the Google Admin console.',
      key: 'gsuite',
    },
    {
      logo: SAML,
      description:
        'Seamlessly enable secure access to Auzmor Learn through your own SAML-enabled identity provider.',
      key: 'saml',
    },
  ];
  return (
    <div className="flex gap-x-6 flex-wrap gap-y-6">
      {ssoIntegrations.map((integration) => (
        <SSOCard
          key={integration.key}
          logo={integration.logo}
          description={integration.description}
        />
      ))}
    </div>
  );
};

export default SSOSettings;
