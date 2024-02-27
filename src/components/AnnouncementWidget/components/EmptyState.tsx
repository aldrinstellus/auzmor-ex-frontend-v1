import NoAnnouncement from 'images/NoAnnouncement.svg';
import useRole from 'hooks/useRole';
import Button, { Size, Variant } from 'components/Button';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  openModal?: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ openModal }) => {
  const { isAdmin } = useRole();
  const showCreateAnnouncement = isAdmin && !!openModal;
  const { t } = useTranslation('announcement');
  return (
    <div className="flex flex-col gap-2 justify-center items-center mt-4">
      {showCreateAnnouncement && (
        <div className="font-bold">{t('create-header')}</div>
      )}
      <p className="text-xs text-neutral-500">{t('description')} </p>
      <div className="h-[107px]">
        <img src={NoAnnouncement} height={107} />
      </div>
      {showCreateAnnouncement && (
        <>
          <Button
            variant={Variant.Secondary}
            size={Size.Small}
            className="py-[7px]"
            label={t('create-CTA')}
            onClick={() => {
              openModal();
            }}
          />
          <p className="text-xs text-neutral-500">{t('admin-header')}</p>
        </>
      )}
    </div>
  );
};

export default EmptyState;
