import Icon from 'components/Icon';
import Modal from 'components/Modal';
import React from 'react';

const AccountDeactivated = () => {
  return (
    <>
      <Modal open className="max-w-md">
        <div className="p-4">
          <div className="flex items-center space-x-1">
            <Icon name="info" size={28} />
            <div className="text-lg font-bold text-neutral-900">
              Account Deactivated
            </div>
          </div>
          <div className="mt-4 text-sm text-neutral-900">
            Your auzmor account is disabled. Please contact the admin for
            further info.
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AccountDeactivated;
