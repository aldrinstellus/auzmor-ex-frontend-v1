import Button, { Size } from 'components/Button';
import ContactSales from 'components/ContactSales';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import React from 'react';

type AppProps = {
  closeBanner: () => any;
};

const SubscriptionBanner: React.FC<AppProps> = ({ closeBanner }) => {
  const { user } = useAuth();
  const daysRemaining = user?.subscription?.daysRemaining || 0;
  const subscriptionType = user?.subscription?.type || 'TRIAL';
  const [sales, showSales, closeSales] = useModal();

  if (subscriptionType !== 'TRIAL') {
    return null;
  }

  return (
    <div className="h-9 bg-neutral-900 flex justify-center items-center text-sm text-white relative">
      {(() => {
        if (daysRemaining > 6) {
          return (
            <span>
              Experience &nbsp;
              <span className="text-primary-500">
                {user?.subscription?.daysRemaining} days trial
              </span>
              &nbsp; of Auzmor Office
            </span>
          );
        }
        if (daysRemaining > 0) {
          return (
            <div className="flex items-center justify-center space-x-1">
              <Icon name="warningCircle" className="text-white" />
              <span className="text-primary-500">
                {user?.subscription?.daysRemaining} days left
              </span>
              &nbsp; for your free Auzmor Office trial
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center space-x-1">
            <Icon name="warningCircle" className="text-white" />
            <span>
              Your subscription has expired. Please contact sales to continue
              using Auzmor Office
            </span>
          </div>
        );
      })()}
      <div className="pl-6">
        <Button
          label="Contact Sales"
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
          title="Your free trial is active. Contact our sales team for questions or to upgrade to full subscription"
        />
      )}
    </div>
  );
};

export default SubscriptionBanner;
