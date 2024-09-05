import { FC } from 'react';
import Card from 'components/Card';
import useAuth from 'hooks/useAuth';
import { useVault } from '@apideck/vault-react';
import Icon from 'components/Icon';
import {
  createConfiguration,
  HrisIntegrationValue,
  putConfiguration,
  syncUser,
} from 'queries/intergration';
import Button from 'components/Button';
import { useMutation } from '@tanstack/react-query';
import useModal from 'hooks/useModal';
import PopupMenu from 'components/PopupMenu';
import queryClient from 'utils/queryClient';
import ConfigurationModal from './components/ConfigurationModal';
import { useTranslation } from 'react-i18next';

const IntegrationSetting: FC = () => {
  const { t } = useTranslation('adminSetting', { keyPrefix: 'integration' });

  const [ShowConfiguration, openConfiguationrModal, closeConfiguationModal] =
    useModal(false);
  const { user } = useAuth();

  const { open } = useVault();
  const deelConfig = HrisIntegrationValue.Deel;
  const currentConfiguration = user?.integrations?.find(
    (integration) => integration.name === deelConfig,
  );
  const isEnabled = currentConfiguration?.enabled ?? false;
  const lastSync = currentConfiguration?.accountDetails?.lastSync ?? null;
  const consumerId = currentConfiguration?.accountDetails?.consumerId ?? null;

  // Mutations
  const { mutate: resyncMutation, isLoading: resyncLoading } = useMutation({
    mutationKey: ['resync'],
    mutationFn: syncUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['current-user-me']);
    },
    onError: () => {},
  });
  const configHrisMutation = useMutation({
    mutationKey: ['configure-hris'],
    mutationFn: createConfiguration,
    onSuccess: (data, variables) => {
      console.log('variables :', variables);
      open({
        token: data.token,
        unifiedApi: 'hris',
        serviceId: 'deel',
        onReady: () => console.log('ready'),
        onClose: () => console.log('onClose'),
        onConnectionChange: () => {
          putConfiguration(variables, true, data.consumerId);
        },
      });
    },
  });

  const handleRemoveIntegration = () => {
    putConfiguration(HrisIntegrationValue.Deel, false, consumerId);
    queryClient.invalidateQueries(['current-user-me']);
  };

  const configuationMenuOption = [
    {
      icon: 'tickCircle',
      label: t('resyncData'),
      onClick: () => {
        resyncMutation('DeelHR');
      },
    },
    {
      icon: 'tickCircle',
      label: t('removeIntegration'),
      onClick: () => {
        handleRemoveIntegration();
      },
    },
  ];
  const handleReSync = (configName: string) => () => {
    resyncMutation(configName);
  };

  return (
    <>
      <Card className="flex items-center justify-between py-5 px-4 ">
        <div className="flex items-center">
          <div>
            <img
              src={require('images/DeelLogo.png')}
              alt={t('deelLogoAlt')}
              className="h-[40px]"
            />
          </div>
          <div className="ms-3 text-sm font-medium p-3">
            <h5 className="text-lg font-semibold mb-0">{t('deelTitle')}</h5>
            <p className="text-sm text-gray-600">{t('deelDescription')}</p>
          </div>
        </div>
        <div className="flex  items-center">
          <Button
            label={isEnabled ? t('reconfigure') : t('configure')}
            onClick={() => {
              if (isEnabled) {
                openConfiguationrModal();
              } else configHrisMutation.mutate(HrisIntegrationValue.Deel);
            }}
          />
          {isEnabled && (
            <div className="relative ">
              <PopupMenu
                triggerNode={
                  <>
                    <div className="flex items-center space-x-2">
                      <Icon name={'dotsVertical'} size={16} />
                    </div>
                  </>
                }
                className="absolute w-56 top-full mt-4 right-0"
                menuItems={configuationMenuOption}
              />
            </div>
          )}
        </div>
      </Card>
      {ShowConfiguration && (
        <ConfigurationModal
          title={t('deelTitle')}
          open={ShowConfiguration}
          lastSync={lastSync}
          handleResync={handleReSync('DeelHR')}
          resyncLoading={resyncLoading}
          handleRemoveIntegration={handleRemoveIntegration}
          closeModal={closeConfiguationModal}
        />
      )}
    </>
  );
};

export default IntegrationSetting;
