import PopupMenu from 'components/PopupMenu';
import Badge from 'components/Badge';
import Card from 'components/Card';
import { App, editApp } from 'queries/apps';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
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
import useRole from 'hooks/useRole';
import { FC } from 'react';
import DefaultAppIcon from 'images/DefaultAppIcon.svg';

type AppCardProps = {
  app: App;
};

const AppCard: FC<AppCardProps> = ({ app }) => {
  const { isAdmin } = useRole();
  const [appCardHovered, appCardEventHandlers] = useHover();
  // const [menuHovered, menuEventHandlers] = useHover();

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
      queryClient.invalidateQueries(['featured-apps']);
      queryClient.invalidateQueries(['my-apps']);
      queryClient.invalidateQueries(['my-featured-apps']);
      toast(
        <SuccessToast
          content={`App has been added to featured apps`}
          dataTestId="feature-app-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
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
    onError: (_error: any) => {
      toast(
        <FailureToast
          content={`Error while adding app to featured apps`}
          dataTestId="feature-app-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
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

  const removeFeaturedAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload: any) => editApp(app?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      queryClient.invalidateQueries(['featured-apps']);
      queryClient.invalidateQueries(['my-apps']);
      queryClient.invalidateQueries(['my-featured-apps']);
      toast(
        <SuccessToast
          content={`App has been removed from featured apps`}
          dataTestId="unfeature-app-toaster"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
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
    onError: (_error: any) => {
      toast(
        <FailureToast
          content={`Error while removing app from featured apps`}
          dataTestId="unfeature-app-error-toaster"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
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

  const toggleAppFeature = (featured: boolean) => {
    const payload = {
      url: app.url,
      label: app.label,
      featured,
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
    if (featured) {
      featuredAppMutation.mutate(payload);
    } else {
      removeFeaturedAppMutation.mutate(payload);
    }
  };

  const appCardMenu = [
    {
      id: 0,
      label: 'Show details',
      icon: 'editReceipt',
      dataTestId: 'app-card-show-app-details',
      onClick: openAppDetailModal,
      hidden: false,
    },
    {
      id: 1,
      label: 'Feature',
      icon: 'filterLinear',
      dataTestId: 'app-card-feature',
      onClick: () => toggleAppFeature(true),
      hidden: app.featured || !isAdmin,
    },
    {
      id: 2,
      label: 'Remove from Feature',
      icon: 'tag',
      dataTestId: 'app-card-remove-feature',
      onClick: () => toggleAppFeature(false),
      hidden: !app.featured || !isAdmin,
    },
    {
      id: 3,
      label: 'Edit',
      icon: 'edit',
      dataTestId: 'app-card-edit',
      onClick: openEditAppModal,
      hidden: !isAdmin,
    },
    {
      id: 4,
      label: 'Delete',
      icon: 'delete',
      iconClassName: '!text-red-500',
      labelClassName: '!text-red-500',
      dataTestId: 'app-card-delete',
      onClick: openDeleteAppModal,
      hidden: !isAdmin,
    },
  ];

  const handleCloseDeleteAppModal = (closeAppDetail = false) => {
    if (closeAppDetail) {
      closeAppDetailModal();
    }
    closeDeleteAppModal();
  };

  return (
    <div {...appCardEventHandlers} data-testid="app-card" className="w-full">
      {/* <Link to={app.url} target="_blank"> */}
      <Card className="relative border-1 p-3 flex gap-2" shadowOnHover>
        {/* App logo */}
        <div className="p-2 bg-neutral-100 rounded-xl min-w-[60px] min-h-[60px]">
          <img
            src={app?.icon?.original || DefaultAppIcon}
            height={44}
            width={44}
          />
        </div>

        {/* App details */}
        <div className="flex flex-col gap-1">
          {/* App name */}
          <div
            className="text-sm font-bold text-neutral-900 line-clamp-1"
            data-testid="app-name"
          >
            {app.label}
          </div>
          {/* App category */}
          {app.category && (
            <div className="flex">
              <Badge
                text={app.category.name}
                textClassName="text-blue-500 text-xxs py-0 leading-2"
                bgClassName="bg-blue-100 border-1 border-blue-300"
                dataTestId="app-category"
              />
            </div>
          )}
          {/* App description */}
          <p
            className="text-neutral-500 line-clamp-1 text-xxs"
            data-testid="app-description"
          >
            {app.description}
          </p>
        </div>

        {/* App menu popover */}
        <div className="absolute top-0 right-3">
          {appCardHovered && (
            <PopupMenu
              triggerNode={
                <div className="cursor-pointer">
                  <Icon name="threeDots" dataTestId="app-card-ellipsis" />
                </div>
              }
              menuItems={appCardMenu.filter((item) => !item.hidden)}
              className="-right-36 w-fit top-6"
            />
          )}
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
