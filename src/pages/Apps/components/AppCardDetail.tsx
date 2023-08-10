import Badge from 'components/Badge';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { App } from 'queries/apps';
import React from 'react';

type AppDetailModalProps = {
  app: App;
  open: boolean;
  closeModal: () => void;
};

const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  open,
  closeModal,
}) => {
  return (
    <Modal open={open}>
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-x-3 items-center">
            <img
              src={app?.icon?.thumbnail}
              className="p-1 bg-neutral-100 rounded-xl"
              height={28}
              width={28}
            />
            <p className="text-neutral-900 text-lg font-extrabold">
              {app.label}
            </p>
          </div>
          <Icon
            name="close"
            onClick={closeModal}
            stroke="#000"
            size={20}
            disabled
          />
        </div>
        <Divider />
        {/* Body */}
        <div className="px-6 py-3">
          <div className="border-orange-300 border-1 rounded-9xl">
            <div className="w-fit pt-4 pl-5">
              <Badge
                text={app.category}
                textClassName="text-blue-500 text-base"
                bgClassName="bg-blue-100"
              />
            </div>
            <div className="pb-8">
              {/* The icon, name and description */}
              <div className="flex px-6 pt-4 gap-x-6">
                <img
                  src={app?.icon?.thumbnail}
                  className="p-1 bg-neutral-100 rounded-xl"
                  height={100}
                  width={100}
                />
                <div>
                  <p className="text-3xl text-neutral-900 font-semibold">
                    {app.label}
                  </p>
                  <p className="pt-1 text-neutral-900 font-normal line-clamp-3">
                    {app.description}
                  </p>
                </div>
              </div>
              {/* The audience */}
              <div className="flex px-6 pt-4">
                <p className="text-neutral-900 font-medium">Audience:</p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-blue-50 flex items-center justify-end px-6 py-4 gap-x-3 rounded-9xl">
          <Button label="Delete app" variant={Variant.Secondary} />
          <Button label="Edit app" />
        </div>
      </Card>
    </Modal>
  );
};

export default AppDetailModal;
