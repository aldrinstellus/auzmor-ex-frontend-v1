import { IntegrationConfig } from '..';
import Card from 'components/Card';
import Button from 'components/Button';
import PopupMenu from 'components/PopupMenu';
import Icon from 'components/Icon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface IntegrationCardProps {
  integration: IntegrationConfig;
  onConfigure: () => void;
  onRemove: () => void;
  onResync: () => void;
  isEnabled: boolean;
}

const IntegrationCard: FC<IntegrationCardProps> = ({
  integration,
  onConfigure,
  onRemove,
  onResync,
  isEnabled,
}) => {
  const { t } = useTranslation('adminSetting', { keyPrefix: 'integration' });

  const configurationMenuOptions = [
    {
      icon: 'tickCircle',
      label: t('resyncData'),
      onClick: onResync,
    },
    {
      icon: 'tickCircle',
      label: t('removeIntegration'),
      onClick: onRemove,
    },
  ];

  return (
    <Card
      key={integration.name}
      className="flex items-center justify-between py-5 px-4 mb-4"
    >
      <div className="flex items-center">
        <div>
          <img
            src={require(`images/${integration.logo}`)}
            className="h-[40px]"
          />
        </div>
        <div className="ms-3 text-sm font-medium p-3">
          <h5 className="text-lg font-semibold mb-0">{integration.title}</h5>
          <p className="text-sm text-gray-600">{integration.description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Button
          label={isEnabled ? t('reconfigure') : t('configure')}
          onClick={onConfigure}
        />
        {isEnabled && (
          <div className="relative">
            <PopupMenu
              triggerNode={
                <div className="flex items-center space-x-2">
                  <Icon name={'dotsVertical'} size={16} />
                </div>
              }
              className="absolute w-56 top-full mt-4 right-0"
              menuItems={configurationMenuOptions}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
export default IntegrationCard;
