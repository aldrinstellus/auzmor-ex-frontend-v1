import Button, { Size, Variant } from 'components/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  openModal?: () => void;
  isAdmin: boolean;
}

const EmptyState: FC<EmptyStateProps> = ({ openModal, isAdmin }) => {
  const { t } = useTranslation('channelLinksWidget', {
    keyPrefix: 'emptyState',
  });
  const showAddLinks = isAdmin && !!openModal;

  return (
    <div className="w-full text-xs font-normal text-neutral-500">
      {showAddLinks ? (
        <div className="flex flex-col gap-2">
          <p className="text-center">{t('adminMessage')}</p>
          <Button
            variant={Variant.Primary}
            size={Size.Small}
            className="py-[7px] w-full"
            label={t('addLinksCTA')}
            leftIcon="addCircle"
            leftIconClassName="!text-white"
            dataTestId="app-add-app-launcher"
            onClick={openModal}
          />
          <p className="text-center">{t('footer')}</p>
        </div>
      ) : (
        <div>{t('memberMessage')}</div>
      )}
    </div>
  );
};

export default EmptyState;
