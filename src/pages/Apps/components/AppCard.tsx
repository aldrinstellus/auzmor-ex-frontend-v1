import Badge from 'components/Badge';
import Card from 'components/Card';
import React, { useEffect, useState } from 'react';
import { App, editApp } from 'queries/apps';
import { Link } from 'react-router-dom';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
import Divider from 'components/Divider';
import useModal from 'hooks/useModal';
import AppDetailModal from './AppCardDetail';
import AddApp, { APP_MODE } from './AddApp';
import DeleteApp from './DeleteApp';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import FailureToast from 'components/Toast/variants/FailureToast';
import { toast } from 'react-toastify';
import { slideInAndOutTop } from 'utils/react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AppCardProps = {
  app: App;
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [appCardHovered, appCardEventHandlers] = useHover();
  const [menuHovered, menuEventHandlers] = useHover();

  const [appDetailModal, openAppDetailModal, closeAppDetailModal] = useModal();
  // Add apps modal
  const [editAppModal, openEditAppModal, closeEditAppModal] = useModal();
  const [deleteAppModal, openDeleteAppModal, closeDeleteAppModal] = useModal();

  const queryClient = useQueryClient();

  const featuredAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload: any) => editApp(app?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      toast(
        <SuccessToast
          content={`App has been added to featured apps`}
          dataTestId="app-updated-success-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
    onError: (error: any) => {
      toast(
        <FailureToast
          content={`Error while adding app to featured apps`}
          dataTestId="app-create-error-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  const makeFeaturedApp = () => {
    const payload = {
      url: app.url,
      label: app.label,
      featured: false,
      ...(app.description && { description: app.description }),
      ...(app.category?.id && { category: app.category.label }),
      ...(app.icon?.id && { icon: app.icon.id }),
      audience: app?.audience || [],
    };
    const credentials: any = {};
    if (app.credentials?.acsUrl) {
      credentials.acsUrl = app.credentials.acsUrl;
    }
    if (app.credentials?.entityId) {
      credentials.entityId = app.credentials.entityId;
    }
    if (app.credentials?.relayState) {
      credentials.relayState = app.credentials.relayState;
    }
    payload.credentials = credentials;
    featuredAppMutation.mutate({ ...payload, featured: true });
  };

  const appCardMenu = [
    {
      id: 0,
      text: 'Show details',
      icon: 'editReceipt',
      dataTestId: 'show-app-details',
      onClick: openAppDetailModal,
      hidden: false,
    },
    {
      id: 1,
      text: 'Feature',
      icon: 'filterLinear',
      dataTestId: 'feature-app',
      onClick: makeFeaturedApp,
      hidden: false,
    },
    {
      id: 3,
      text: 'Edit',
      icon: 'edit',
      dataTestId: 'edit-app',
      onClick: openEditAppModal,
      hidden: false,
    },
    {
      id: 4,
      text: 'Delete',
      icon: 'delete',
      dataTestId: 'delete-app',
      onClick: openDeleteAppModal,
      hidden: false,
    },
  ];

  const handleCloseDeleteAppModal = (closeAppDetail = false) => {
    if (closeAppDetail) {
      closeAppDetailModal();
    }
    closeDeleteAppModal();
  };

  return (
    <div {...appCardEventHandlers}>
      {/* <Link to={app.url} target="_blank"> */}
      <Card
        className="relative min-w-[234px] max-w-[234px] min-h-[148px] max-h-[148px] border-1 px-4 py-6"
        shadowOnHover
      >
        <div>
          <div className="absolute top-2 right-2 flex flex-col items-end">
            {app.category && (
              <Badge
                text={app.category.name}
                textClassName="text-blue-500"
                bgClassName="bg-blue-100"
              />
            )}
            {appCardHovered && (
              <div {...menuEventHandlers} className="relative z-10">
                <Icon name="threeDots" className="cursor-pointer" />
                {menuHovered && (
                  <Card className="absolute border-1 rounded-11xl">
                    {appCardMenu.map((menuItem) => (
                      <div key={menuItem.id} onClick={menuItem.onClick}>
                        <div className="flex gap-x-2 cursor-pointer py-2 px-6 items-center hover:bg-blue-50">
                          <Icon
                            name={menuItem.icon}
                            size={16}
                            stroke="#000"
                            disabled
                          />
                          <p className="text-neutral-900 text-sm whitespace-nowrap">
                            {menuItem.text}
                          </p>
                        </div>
                        <Divider />
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            )}
          </div>
          <div className="pb-8">
            <div className="flex items-center justify-between">
              <img
                src={app?.icon?.original}
                className="p-1 bg-neutral-100 rounded-xl"
                height={28}
                width={28}
              />
            </div>
            <p className="text-neutral-900 font-bold py-2 text-sm">
              {app.label}
            </p>
            <p className="text-neutral-500 line-clamp-3 text-xs">
              {app.description}
            </p>
          </div>
        </div>
      </Card>
      {/* </Link> */}
      <AppDetailModal
        open={appDetailModal}
        closeModal={closeAppDetailModal}
        openEditAppModal={openEditAppModal}
        openDeleteAppModal={openDeleteAppModal}
        app={app}
      />
      <DeleteApp
        open={deleteAppModal}
        closeModal={handleCloseDeleteAppModal}
        appId={app.id}
      />
      {editAppModal && (
        <AddApp
          open={editAppModal}
          closeModal={closeEditAppModal}
          data={app}
          mode={APP_MODE.Edit}
        />
      )}
    </div>
  );
};

export default AppCard;
