import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { userChannel } from 'utils/misc';
import { logout } from 'queries/account';
import { useMutation } from '@tanstack/react-query';
import useModal from 'hooks/useModal';
import ContactSales from 'components/ContactSales';

const SubscriptionExpired = () => {
  const { user, reset } = useAuth();
  const [sales, showSales, closeSales] = useModal();

  const logoutMutation = useMutation(logout, {
    onSuccess: async () => {
      reset();
      userChannel.postMessage({
        userId: user?.id,
        payload: {
          type: 'SIGN_OUT',
        },
      });
      window.location.href = '/logout';
    },
  });

  return (
    <>
      <Modal open className="max-w-2xl">
        <div className="flex flex-col items-center px-6 py-8">
          <img
            src={require('./trial.png')}
            className="w-[320px] object-contain"
          />
          <div className="mt-8 text-center">
            <div className="text-3xl">Your 7 day free trial has ended!</div>
            <div className="text-neutral-500 mt-1">
              Hi, we hope you enjoyed our product during the trial. To extend or
              unlock the full version, please contact our sales team.
              We&lsquo;re here to help!
            </div>
          </div>
          <div className="mt-5">
            <Button label="Contact Sales" onClick={showSales} />
          </div>
          <div
            className="mt-2 flex items-center space-x-1 cursor-pointer"
            onClick={() => logoutMutation.mutate()}
          >
            <Icon name="logoutOutline" size={14} color="text-red-500" />
            <div className="text-xs text-red-500 font-bold">Logout</div>
          </div>
        </div>
      </Modal>
      {sales && (
        <ContactSales
          open={sales}
          closeModal={closeSales}
          variant="expired"
          title="Your free trial has expired. Contact sales team for questions or to upgrade to full subscription"
        />
      )}
    </>
  );
};

export default SubscriptionExpired;
