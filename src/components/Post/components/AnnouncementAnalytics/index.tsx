import clsx from 'clsx';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Tabs from 'components/Tabs';
import React from 'react';
import Acknowledged from './Acknowledged';
import Pending from './Pending';
import Button, { Variant } from 'components/Button';

type AppProps = {
  open: boolean;
  closeModal: () => any;
  id: string;
};

const AnnouncementAnalytics: React.FC<AppProps> = ({
  id,
  open,
  closeModal,
}) => {
  const tabLabel = (label: string, isActive: boolean) => {
    return <span className={clsx({ 'font-bold': isActive })}>{label}</span>;
  };

  return (
    <Modal open={open} className="max-w-2xl">
      <div>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="font-bold text-lg text-gray-900">
            Acknowledgement report
          </div>
          <div>
            <Icon name="close" onClick={closeModal} />
          </div>
        </div>
        <div className="mt-4 w-full relative">
          <Tabs
            className="w-full flex justify-start px-6"
            tabContentClassName="w-full"
            tabs={[
              {
                tabLabel: (isActive) => tabLabel('Acknowledged', isActive),
                tabContent: <Acknowledged id={id} closeModal={closeModal} />,
              },
              {
                tabLabel: (isActive) => tabLabel('Pending', isActive),
                tabContent: <Pending id={id} closeModal={closeModal} />,
              },
            ]}
          />
          <div
            className="py-4 center cursor-pointer absolute top-2 right-4"
            onClick={() => {
              window.open(`https://office.com/download/${id}`, '_blank');
            }}
          >
            <Icon name="download" size={20} color="text-primary-500" />
            <div className="text-xs font-bold text-primary-500">
              export report
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnnouncementAnalytics;
