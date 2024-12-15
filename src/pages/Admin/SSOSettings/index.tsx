import { ReactElement, useMemo, useEffect, useState, FC } from 'react';
import SSOCard from './components/SSOCard';
import ActiveDirectory from 'images/activeDirectory.png';
import MicrosoftAD from 'images/microsoftAd.svg';
import Okta from 'images/okta.png';
import GSuite from 'images/Gsuite.png';
import SAML from 'images/saml.png';
import useModal from 'hooks/useModal';
import ConfigureGenericSSO from './components/ConfigureGenericSSO';
import { IdentityProvider } from 'interfaces';
import ConfigureLDAP from './components/ConfigureLDAP';
import Banner, { Variant } from 'components/Banner';
import SkeletonLoader from './components/SkeletonLoader';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

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
  dataTestId?: string;
};

type SSOConfig = {
  idp: IdentityProvider;
  config: any;
  allowFallback?: boolean;
  allowOnlyExistingUser?: boolean;
  active: boolean;
};

const SSOSettings: FC = (): ReactElement => {
  // 1. GET list of SSO configs
  // 2. If there are any of them that are active, show the activated chip and the three dot menu beside them
  // 3. If the user tries to activate any other SSO while one of them is active, show the error message.
  // 4. If the user successfully integrates SSO, refetch list of SSOs
  // 5. If the user successfully deletes SSO, refetch list of SSOs.
  const { t } = useTranslation('adminSetting', { keyPrefix: 'sso' });
  const { getApi } = usePermissions();
  const useGetSSO = getApi(ApiEnum.GetOrganizationSSO);
  const { data, isLoading, isError } = useGetSSO();
  const [open, openModal, closeModal] = useModal(undefined, false);
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
      description: t('active-dir-des'),
      key: 'Active Directory',
      idp: IdentityProvider.CUSTOM_LDAP,
      configureScreen: ConfigureScreen.LDAP,
      dataTestId: 'sso-ldap-configure-btn',
      ...getSSOValues(IdentityProvider[0]),
    },
    {
      logo: MicrosoftAD,
      description: t('azure-des'),
      key: 'ADFS (SSO)',
      idp: IdentityProvider.MS_AZURE_AD,
      configureScreen: ConfigureScreen.GENERIC,
      dataTestId: 'sso-azure-ad-configure-btn',
      ...getSSOValues(IdentityProvider[1]),
    },
    {
      logo: Okta,
      description: t('okta-des'),
      key: 'Okta (SSO)',
      idp: IdentityProvider.OKTA,
      configureScreen: ConfigureScreen.GENERIC,
      dataTestId: 'sso-okta-configure-btn',
      ...getSSOValues(IdentityProvider[2]),
    },
    {
      logo: GSuite,
      description: t('gsuite-des'),
      key: 'Google (SSO)',
      idp: IdentityProvider.GSUITE,
      configureScreen: ConfigureScreen.GENERIC,
      dataTestId: 'sso-gsuite-configure-btn',
      ...getSSOValues(IdentityProvider[3]),
    },
    {
      logo: SAML,
      description: t('saml-des'),
      key: 'SAML (SSO)',
      idp: IdentityProvider.CUSTOM_SAML,
      configureScreen: ConfigureScreen.GENERIC,
      dataTestId: 'sso-saml-configure-btn',
      ...getSSOValues(IdentityProvider[4]),
    },
  ];

  const activeSSO = useMemo(
    () => ssoIntegrations.find((sso: ISSOSetting) => sso.active),
    [ssoIntegrations],
  );

  if (isError) {
    return <div>{t('error-text')}</div>;
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
        {!isLoading ? (
          ssoIntegrations.map((integration: ISSOSetting) => (
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
              dataTestId={integration.dataTestId}
            />
          ))
        ) : (
          <SkeletonLoader />
        )}
        {ssoSetting?.configureScreen === ConfigureScreen.GENERIC && (
          <ConfigureGenericSSO
            ssoSetting={ssoSetting}
            closeModal={closeModal}
            open={open}
          />
        )}
        {ssoSetting?.configureScreen === ConfigureScreen.LDAP && (
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
