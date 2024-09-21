import { FC, useMemo, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { useVault } from '@apideck/vault-react';
import {
  createConfiguration,
  deleteHrisIntegration,
  HrisIntegrationValue,
  putConfiguration,
} from 'queries/intergration';
import { useMutation } from '@tanstack/react-query';
import useModal from 'hooks/useModal';
import queryClient from 'utils/queryClient';
import ConfigurationModal from './components/ConfigurationModal';
import IntegrationCard from './components/IntegrationCard';
import { useTranslation } from 'react-i18next';
import momentTz from 'moment-timezone';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { humatAtTimeFormat } from 'utils/time';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { useHandleResync } from 'hooks/useHandleSync';

export interface IntegrationConfig {
  name: string;
  title: string;
  value: HrisIntegrationValue;
  description: string;
  logo: string;
  dataSync: string;
  configDescription: string;
  iconName: string;
  configNote: string;
}

const IntegrationSetting: FC = () => {
  const { t } = useTranslation('adminSetting', { keyPrefix: 'integration' });
  const { handleResync, isResyncLoading } = useHandleResync();

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
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const [showConfiguration, openConfigurationModal, closeConfigurationModal] =
    useModal(false);

  const [selectedIntegration, setSelectedIntegration] =
    useState<IntegrationConfig | null>(null);

  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return null;
    return momentTz(lastSync).tz(userTimezone).format(humatAtTimeFormat);
  };

  const selectedIntegrationData = useMemo(() => {
    if (!selectedIntegration || !user?.integrations) return null;
    const integration = user.integrations.find(
      (i) => i.name === selectedIntegration.value,
    );
    if (!integration) return null;
    return {
      ...integration,
      formattedLastSync: formatLastSync(integration.accountDetails?.lastSync),
    };
  }, [selectedIntegration, user?.integrations, userTimezone]);

  const { open } = useVault();

  const configHrisMutation = useMutation({
    mutationKey: ['configure-hris'],
    mutationFn: createConfiguration,
    onSuccess: (data, variables) => {
      open({
        token: data.token,
        unifiedApi: 'hris',
        serviceId: variables.toLowerCase(),
        onReady: () => console.log('Vault is ready'),
        onClose: () => {
          console.log('Vault closed');
        },
        onConnectionDelete: async (_connectiondelete: any) => {
          await handleRemoveIntegration(variables);
        },
        onConnectionChange: async (connection: any) => {
          if (connection && connection.state === 'callable') {
            console.log('Connection is authorized');
            await putConfiguration(variables, true, data.consumerId);
            const updatedIntegrations = [
              ...(user?.integrations?.filter((i) => i.name !== variables) ||
                []),
              {
                name: variables,
                enabled: true,
                accountDetails: {
                  consumerId: data.consumerId,
                },
              },
            ];
            //@ts-ignore
            await updateUser({
              ...user,
              integrations: updatedIntegrations,
            });
            await queryClient.invalidateQueries({ queryKey: ['users'] });
            successToastConfig({});
          } else if (
            ['invalid', 'disconnected', 'failed'].includes(connection?.state)
          ) {
            console.log("Connection isn't authorized ", connection?.state);
            failureToastConfig({
              content: "Connection isn't authorized or is invalid",
            });
            await handleRemoveIntegration(variables);
          }
        },
      });
    },
    onError: (error) => {
      console.error('Error creating configuration:', error);
      failureToastConfig({});
    },
  });

  const handleRemoveIntegration = async (integrationName: string) => {
    const integration = user?.integrations?.find(
      (integration: any) => integration.name === integrationName,
    );
    if (integration) {
      await deleteHrisIntegration(integrationName);
      //@ts-ignore
      updateUser({
        integrations:
          user?.integrations?.filter((i) => i.name !== integrationName) || [],
      });
      successToastConfig({
        content: 'Integration removed successfully',
      });
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  };

  const renderIntegrationCard = (integration: IntegrationConfig) => {
    const currentConfiguration = user?.integrations?.find(
      (userIntegration) => userIntegration.name === integration.value,
    );
    const isEnabled = currentConfiguration?.enabled ?? false;

    return (
      <IntegrationCard
        key={integration.value}
        integration={integration}
        isEnabled={isEnabled}
        onConfigure={() => {
          if (isEnabled) {
            setSelectedIntegration(integration);
            openConfigurationModal();
          } else {
            configHrisMutation.mutate(integration.value);
          }
        }}
        onRemove={() => handleRemoveIntegration(integration.value)}
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
          lastSync={selectedIntegrationData?.formattedLastSync || ''}
          handleResync={() => handleResync(selectedIntegration.value)}
          resyncLoading={isResyncLoading}
          handleRemoveIntegration={() =>
            handleRemoveIntegration(selectedIntegration.value)
          }
          closeModal={closeConfigurationModal}
        />
      )}
    </>
  );
};
export default IntegrationSetting;
