import Badge from 'components/Badge';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import useRole from 'hooks/useRole';
import { App } from 'queries/apps';
import React from 'react';
import { twConfig } from 'utils/misc';
import AppDetailSVG from './../../../images/appDetails.svg';

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
  const { isAdmin } = useRole();
  const audienceChipStyle =
    'py-2 px-3 flex items-center gap-1 border-1 rounded-[24px] border-neutral-200';
  const audienceLabelStyle = 'text-sm font-semibold';

  return (
    <Modal open={open} className="max-w-[638px]">
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex gap-x-3 items-center">
            {app?.icon?.original && (
              <div className="p-1 bg-neutral-100 rounded-xl">
                <img src={app?.icon?.original} height={20} width={20} />
              </div>
            )}
            <p className="text-neutral-900 text-lg font-extrabold">
              {app.label}
            </p>
          </div>
          <Icon
            name="close"
            onClick={closeModal}
            color="text-black"
            size={20}
            dataTestId="app-details-close"
          />
        </div>
        <Divider />
        {/* Body */}
        <div className="px-6 py-3">
          <div className="border-orange-300 border-1 rounded-9xl relative">
            <img src={AppDetailSVG} className="absolute" />
            <div className="z-10 relative">
              <div className="w-full pt-4 px-5 flex justify-between">
                <div className="flex gap-2">
                  {app.category && (
                    <Badge
                      text={app.category.name}
                      textClassName="text-blue-500 text-base leading-6 font-semibold"
                      bgClassName="bg-blue-100 border-1 border-blue-300"
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
                  <Icon name="arrowRightUp" className="text-primary-500" />
                </div>
              </div>
              <div className="pb-8">
                {/* The icon, name and description */}
                <div className="flex px-6 pt-4 gap-x-6">
                  {app?.icon?.original && (
                    <div className="min-w-[100px] min-h-[100px]">
                      <img
                        src={app?.icon?.original}
                        className="p-1 rounded-xl"
                        height={100}
                        width={100}
                      />
                    </div>
                  )}
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
                <div className="flex px-6 pt-4 items-center gap-2">
                  <p className="text-neutral-900 text-sm font-medium">
                    Audience:
                  </p>
                  {app.audience && app.audience.length > 0 ? (
                    <div className="flex gap-2">
                      <div className={audienceChipStyle}>
                        <Icon name="noteFavourite" size={16} hover={false} />
                        <span className={audienceLabelStyle}>
                          {app.audience[0].name || 'Team Name'}
                        </span>
                      </div>
                      {app.audience.length > 1 && (
                        <div className={audienceChipStyle}>
                          <span className={audienceLabelStyle}>
                            {`+ ${app.audience.length - 1} more`}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={audienceChipStyle}>
                      <span className={audienceLabelStyle}>Everyone</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        {isAdmin ? (
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
        ) : (
          <div className="pb-2"></div>
        )}
      </Card>
    </Modal>
  );
};

export default AppDetailModal;
