import { FC } from 'react';

import Button, { Size, Variant } from 'components/Button';

import useRole from 'hooks/useRole';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface IEmptyState {
  openModal: () => void;
}

const EmptyState: FC<IEmptyState> = () => {
  const { isAdmin } = useRole();
  const { t } = useTranslation('appLauncher', { keyPrefix: 'empty-state' });
  return (
    <div className="mt-4 w-full">
      {isAdmin ? (
        <div className="flex flex-col gap-2 text-xs w-full">
          <p className="text-center">{t('empty-state-message')} </p>
          <Link to="/apps" className="w-full">
            <Button
              variant={Variant.Secondary}
              size={Size.Small}
              className="py-[7px] w-full"
              label={t('add-app-CTA')}
              leftIcon="addCircle"
              leftIconClassName="text-neutral-900"
              dataTestId="app-add-app-launcher"
              // onClick={openModal}
            />
          </Link>
          <p className="text-center">{t('admin-error')}</p>
        </div>
      ) : (
        <div>{t('not-found')}</div>
      )}
    </div>
  );
};

export default EmptyState;
