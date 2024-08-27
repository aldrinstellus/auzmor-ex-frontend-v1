import Button, { Size } from 'components/Button';
import ContactSales from 'components/ContactSales';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import useProduct from 'hooks/useProduct';
import React from 'react';
import { useTranslation } from 'react-i18next';

type AppProps = {
  closeBanner: () => any;
};

const SubscriptionBanner: React.FC<AppProps> = ({ closeBanner }) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'SubscriptionBanner',
  });
  const { user } = useAuth();
  const { isLxp } = useProduct();
  const daysRemaining = user?.subscription?.daysRemaining || 0;
  const subscriptionType = user?.subscription?.type || 'TRIAL';
  const [sales, showSales, closeSales] = useModal();

  if (subscriptionType !== 'TRIAL') {
    return null;
  }

  const productName = isLxp ? t('productNameLxp') : t('productNameOffice');

  return (
    <div className="h-9 bg-neutral-900 flex justify-center items-center text-sm text-white relative">
      {(() => {
        if (daysRemaining > 6) {
          return (
            <span>
              {t('experience')} &nbsp;
              <span className="text-primary-500">
                {user?.subscription?.daysRemaining} {t('daysTrial')}
              </span>
              &nbsp; {t('of')} {productName}
            </span>
          );
        }
        if (daysRemaining > 0) {
          return (
            <div className="flex items-center justify-center space-x-1">
              <Icon name="warningCircle" className="text-white" />
              <span className="text-primary-500">
                {user?.subscription?.daysRemaining} {t('daysLeft')}
              </span>
              &nbsp; {t('forYourFree')} {productName} {t('trial')}
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center space-x-1">
            <Icon name="warningCircle" className="text-white" />
            <span>{t('subscriptionExpired', { productName })}</span>
          </div>
        );
      })()}
      <div className="pl-6">
        <Button
          label={t('contactSales')}
          size={Size.ExtraSmall}
          onClick={showSales}
        />
      </div>
      <div className="absolute right-8">
        <Icon
          name="close"
          size={18}
          className="text-white cursor-pointer"
          onClick={closeBanner}
        />
      </div>
      {sales && (
        <ContactSales
          open={sales}
          closeModal={closeSales}
          title={t('contactSalesTitle')}
        />
      )}
    </div>
  );
};

export default SubscriptionBanner;
