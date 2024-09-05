import Modal from 'components/Modal';
import React, { FC } from 'react';
import Header from 'components/ModalHeader';
import Button, { Variant } from 'components/Button';
import Icon from 'components/Icon';
import moment from 'moment';

interface ConfigureDeelProps {
  open: boolean;
  lastSync: string;
  closeModal: () => void;
  title: any;
  handleResync: any;
  resyncLoading?: boolean;
  handleRemoveIntegration: () => void;
}

const ConfigurationModal: FC<ConfigureDeelProps> = ({
  open,
  lastSync,
  closeModal,
  title,
  handleRemoveIntegration,
  handleResync,
  resyncLoading,
}) => {
  const formatedDate = moment(lastSync).format('DD MMM YYYY [at] hh:mm A');
  return (
    <Modal open={open} className="max-w-[600px] max-h-[600px]">
      <Header
        title={
          <div className="flex items-center gap-1">
            <Icon name="deel" className="w-8 h-8" />
            {title}
          </div>
        }
        onClose={closeModal}
      />
      <div className="px-6 pt-4 pb-10">
        <div className="flex  flex-col  gap-5">
          <div className="text-lg font-medium">Data sync</div>
          <div className="text-sm font-medium">
            Data from your Deel HR account will be synced to Auzmor office.
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1">
              <div className="text-base font-semibold">
                Last sync: {formatedDate}
              </div>
              <div className="text-sm font-medium">
                Note: Data syncs automatically after every 24 hours.
              </div>
            </div>
            <Button
              label={'sync now'}
              loading={resyncLoading}
              onClick={handleResync}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          leftIcon="minus"
          label={'remove integration'}
          variant={Variant.Tertiary}
          onClick={handleRemoveIntegration}
          className="border-0 !bg-transparent !px-0 !py-1"
          labelClassName="text-neutral-500 hover:text-primary-500 group-hover:text-primary-500"
          iconColor="text-neutral-500"
          leftIconSize={20}
        />
        <div className="flex items-center">
          <Button
            label={'cancel'}
            variant={Variant.Secondary}
            onClick={closeModal}
            className="mr-4"
          />
          <Button
            label={'save'}
            variant={Variant.Primary}
            onClick={closeModal}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfigurationModal;
