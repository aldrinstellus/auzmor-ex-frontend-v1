import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import useAuth from 'hooks/useAuth';
import React from 'react';
import {
  deleteCookie,
  getCookieParam,
  getLearnUrl,
  userChannel,
} from 'utils/misc';
import { useMutation } from '@tanstack/react-query';
import useModal from 'hooks/useModal';
import ContactSales from 'components/ContactSales';
import useProduct from 'hooks/useProduct';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

const SubscriptionExpired = () => {
  const { t } = useTranslation('components', {
    keyPrefix: 'subscriptionExpired',
  });
  const { user, reset } = useAuth();
  const { isLxp } = useProduct();
  const { getApi } = usePermissions();
  const [sales, showSales, closeSales] = useModal();

  const logoutMutation = useMutation(getApi(ApiEnum.Logout), {
    onSuccess: async () => {
      reset();
      userChannel.postMessage({
        userId: user?.id,
        payload: {
          type: 'SIGN_OUT',
        },
      });
      if (isLxp) {
        deleteCookie(getCookieParam('region_url'));
        deleteCookie(getCookieParam());
        window.location.replace(`${getLearnUrl()}`);
      }
    },
  });

  return (
    <>
      <Modal open className="max-w-2xl">
        <div className="flex flex-col items-center px-6 py-8">
          <img
            src={require('./trial.png')}
            className="w-[320px] object-contain"
            alt={t('trialBannerAlt')}
          />
          <div className="mt-8 text-center">
            <div className="text-3xl">{t('trialEndedTitle')}</div>
            <div className="text-neutral-500 mt-1">
              {t('trialEndedMessage')}
            </div>
          </div>
          <div className="mt-5">
            <Button label={t('contactSalesButton')} onClick={showSales} />
          </div>
          <div
            className="mt-2 flex items-center space-x-1 cursor-pointer"
            onClick={() => logoutMutation.mutate()}
          >
            <Icon name="logoutOutline" size={14} color="text-red-500" />
            <div className="text-xs text-red-500 font-bold">
              {t('logoutButton')}
            </div>
          </div>
        </div>
      </Modal>
      {sales && (
        <ContactSales
          open={sales}
          closeModal={closeSales}
          variant="expired"
          title={t('contactSalesTitle')}
        />
      )}
    </>
  );
};

export default SubscriptionExpired;
