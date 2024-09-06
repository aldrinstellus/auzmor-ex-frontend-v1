import { FC, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useVault } from '@apideck/vault-react';
import {
  createConfiguration,
  HrisIntegrationValue,
  putConfiguration,
  syncUser,
} from 'queries/intergration';
import { useMutation } from '@tanstack/react-query';
import useModal from 'hooks/useModal';
import queryClient from 'utils/queryClient';
import ConfigurationModal from './components/ConfigurationModal';
import IntegrationCard from './components/IntegrationCard';
import { useTranslation } from 'react-i18next';

export interface IntegrationConfig {
  name: string;
  title: string;
  value: HrisIntegrationValue;
  description: string;
  logo: string;
  dataSync: string;
  configDescription: string;
  configNote: string;
  iconName?: string;
}

const IntegrationSetting: FC = () => {
  const { t } = useTranslation('adminSetting', { keyPrefix: 'integration' });
  const integrations: IntegrationConfig[] = [
    {
      name: t('deelTitle'),
      value: HrisIntegrationValue.Deel,
      title: t('deelTitle'),
      dataSync: t('dataSync'),
      description: t('deelDescription'),
      configDescription: t('deelConfigDescription'),
      logo: 'DeelLogo.png',
      configNote: t('deelConfigNote'),
      iconName: 'deel',
    },
  ];
  const { user, updateUser } = useAuth();
  const { open } = useVault();

  const [showConfiguration, openConfigurationModal, closeConfigurationModal] =
    useModal(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<IntegrationConfig | null>(null);

  const { mutate: resyncMutation, isLoading: resyncLoading } = useMutation({
    mutationKey: ['resync'],
    mutationFn: syncUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['current-user-me']);
    },
    onError: (error) => {
      console.error('Resync failed:', error);
    },
  });
  const configHrisMutation = useMutation({
    mutationKey: ['configure-hris'],
    mutationFn: createConfiguration,
    onSuccess: (data, variables) => {
      open({
        token: data.token,
        unifiedApi: 'hris',
        serviceId: variables.toLowerCase(),
        onReady: () => console.log('ready'),
        onClose: () => {
          console.log('onClose');
          queryClient.invalidateQueries(['current-user-me']);
        },
        onConnectionDelete: async (connection) => {
          console.log('connection :', connection);
        },
        onConnectionChange: async () => {
          await putConfiguration(variables, true, data.consumerId);
          const newIntegration = {
            name: variables,
            enabled: true,
            accountDetails: { consumerId: data.consumerId },
          };
          const updatedIntegrations = [newIntegration];
          //@ts-ignore
          updateUser({
            ...user,
            integrations: updatedIntegrations,
          });
          console.log('user after', user);

          queryClient.invalidateQueries(['current-user-me']);
        },
      });
    },
  });

  const handleRemoveIntegration = async (integrationName: string) => {
    const integration = user?.integrations?.find(
      (integration: any) => integration.name === integrationName,
    );
    if (integration) {
      await putConfiguration(
        integrationName,
        false,
        integration.accountDetails?.consumerId,
      );
      //@ts-ignore
      updateUser({
        integrations:
          user?.integrations?.filter((i) => i.name !== integrationName) || [],
      });
      queryClient.invalidateQueries(['current-user-me']);
    }
  };
  const handleResync = (configName: string) => {
    resyncMutation(configName);
  };

  const renderIntegrationCard = (integration: IntegrationConfig) => {
    const currentConfiguration = user?.integrations?.find(
      (userIntegration) => userIntegration.name === integration.name,
    );
    const isEnabled = currentConfiguration?.enabled ?? false;

    return (
      <IntegrationCard
        key={integration.name}
        integration={integration}
        isEnabled={isEnabled}
        onConfigure={() => {
          if (isEnabled) {
            setSelectedIntegration(integration);
            openConfigurationModal();
          } else {
            configHrisMutation.mutate(integration.name);
          }
        }}
        onRemove={() => handleRemoveIntegration(integration.name)}
        onResync={() => handleResync(integration.value)}
      />
    );
  };

  return (
    <>
      {integrations.map(renderIntegrationCard)}
      {showConfiguration && selectedIntegration && (
        <ConfigurationModal
          title={selectedIntegration.title}
          open={showConfiguration}
          integration={selectedIntegration}
          lastSync={
            user?.integrations?.find(
              (integration) => integration.name === selectedIntegration.name,
            )?.accountDetails?.lastSync
          }
          handleResync={() => handleResync(selectedIntegration.value)}
          resyncLoading={resyncLoading}
          handleRemoveIntegration={() =>
            handleRemoveIntegration(selectedIntegration.name)
          }
          closeModal={closeConfigurationModal}
        />
      )}
    </>
  );
};
export default IntegrationSetting;
