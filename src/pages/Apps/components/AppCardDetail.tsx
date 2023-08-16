import Badge from 'components/Badge';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { App } from 'queries/apps';
import React from 'react';
import { twConfig } from 'utils/misc';

type AppDetailModalProps = {
  app: App;
  open: boolean;
  closeModal: () => void;
  openEditAppModal: () => void;
  openDeleteAppModal: () => void;
};

const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  open,
  closeModal,
  openEditAppModal,
  openDeleteAppModal,
}) => {
  return (
    <Modal open={open}>
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-x-3 items-center">
            <img
              src={app?.icon?.original}
              className="p-1 bg-neutral-100 rounded-xl"
              height={20}
              width={20}
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
            dataTestId="app-details-close"
            disabled
          />
        </div>
        <Divider />
        {/* Body */}
        <div className="px-6 py-3">
          <div className="border-orange-300 border-1 rounded-9xl">
            <div className="w-full pt-4 px-5 flex justify-between">
              <div className="flex gap-2">
                {app.category && (
                  <Badge
                    text={app.category.name}
                    textClassName="text-blue-500 text-base leading-6 font-semibold"
                    bgClassName="bg-blue-100"
                    dataTestId="app-details-category"
                  />
                )}
                {app.featured && (
                  <Badge
                    text="Featured"
                    textClassName="text-white text-base leading-6 font-semibold"
                    bgClassName="bg-blue-500"
                    dataTestId="app-details-category"
                  />
                )}
              </div>
              <div
                className="cursor-pointer text-primary-500 text-lg font-medium flex items-center gap-1"
                onClick={() => window.open(app.url, '_target')}
              >
                <span>Visit app</span>
                <Icon
                  name="arrowRightUp"
                  fill={twConfig.theme.colors.primary[500]}
                />
              </div>
            </div>
            <div className="pb-8">
              {/* The icon, name and description */}
              <div className="flex px-6 pt-4 gap-x-6">
                <img
                  src={app?.icon?.original}
                  className="p-1 rounded-xl min-w-[100px] min-h-[100px]"
                  height={100}
                  width={100}
                />
                <div>
                  <p
                    className="text-3xl text-neutral-900 font-semibold"
                    data-testid="app-details-name"
                  >
                    {app.label}
                  </p>
                  <p
                    className="pt-1 text-neutral-900 font-normal line-clamp-3"
                    data-testid="app-details-description"
                  >
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
          <Button
            label="Delete app"
            variant={Variant.Secondary}
            onClick={openDeleteAppModal}
            dataTestId="app-details-delete-app"
          />
          <Button
            label="Edit app"
            onClick={openEditAppModal}
            dataTestId="app-details-edit-app"
          />
        </div>
      </Card>
    </Modal>
  );
};

export default AppDetailModal;
