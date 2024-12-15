import PopupMenu from 'components/PopupMenu';
import Badge from 'components/Badge';
import Card from 'components/Card';
import { IApp } from 'interfaces';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import AppDetailModal from './AppCardDetail';
import AddApp, { APP_MODE } from './AddApp';
import DeleteApp from './DeleteApp';
import { isNewEntity } from 'utils/misc';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useRole from 'hooks/useRole';
import { FC } from 'react';
import DefaultAppIcon from 'images/DefaultAppIcon.svg';
import { isEmpty } from 'lodash';
import clsx from 'clsx';
import Truncate from 'components/Truncate';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

type AppCardProps = {
  app: IApp;
};

const AppCard: FC<AppCardProps> = ({ app }) => {
  const { isAdmin } = useRole();
  const { t } = useTranslation('appLauncher', {
    keyPrefix: 'appCard',
  });
  const { getApi } = usePermissions();
  const [appDetailModal, openAppDetailModal, closeAppDetailModal] = useModal();
  const [editAppModal, openEditAppModal, closeEditAppModal] = useModal();
  const [deleteAppModal, openDeleteAppModal, closeDeleteAppModal] = useModal();

  const queryClient = useQueryClient();

  const editApp = getApi(ApiEnum.EditApp);
  const featuredAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload: any) => editApp(app?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      queryClient.invalidateQueries(['featured-apps']);
      queryClient.invalidateQueries(['my-apps']);
      queryClient.invalidateQueries(['my-featured-apps']);
      successToastConfig({
        content: t('featureSuccess'),
        dataTestId: 'feature-app-toaster',
      });
    },
    onError: (_error: any) =>
      failureToastConfig({
        content: t('featureError'),
        dataTestId: 'feature-app-error-toaster',
      }),
  });

  const removeFeaturedAppMutation = useMutation({
    mutationKey: ['edit-app-mutation'],
    mutationFn: (payload: any) => editApp(app?.id || '', payload as any),
    onSuccess: () => {
      queryClient.invalidateQueries(['apps']);
      queryClient.invalidateQueries(['featured-apps']);
      queryClient.invalidateQueries(['my-apps']);
      queryClient.invalidateQueries(['my-featured-apps']);
      successToastConfig({
        content: t('unfeatureSuccess'),
        dataTestId: 'unfeature-app-toaster',
      });
    },
    onError: () =>
      failureToastConfig({
        content: t('unfeatureError'),
        dataTestId: 'unfeature-app-error-toaster',
      }),
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
      label: t('showDetails'),
      icon: 'editReceipt',
      dataTestId: 'app-card-show-app-details',
      onClick: openAppDetailModal,
      hidden: false,
    },
    {
      id: 1,
      label: t('feature'),
      icon: 'filterLinear',
      dataTestId: 'app-card-feature',
      onClick: () => toggleAppFeature(true),
      hidden: app.featured || !isAdmin,
    },
    {
      id: 2,
      label: t('removeFeature'),
      icon: 'tag',
      dataTestId: 'app-card-remove-feature',
      onClick: () => toggleAppFeature(false),
      hidden: !app.featured || !isAdmin,
    },
    {
      id: 3,
      label: t('edit'),
      icon: 'edit',
      dataTestId: 'app-card-edit',
      onClick: openEditAppModal,
      hidden: !isAdmin,
    },
    {
      id: 4,
      label: t('delete'),
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

  const leftChipStyle = clsx({
    'absolute top-0 left-0 rounded-tl-[12px] rounded-br-[12px] px-2 text-xxs font-medium':
      true,
  });

  const handleAppLaunch = () => {
    window.open(`${window.location.origin}/apps/${app.id}/launch`, '_target');
  };

  return (
    <>
      <Card
        className="relative border-1 p-3 focus-within:shadow-xl w-full group/app-card"
        dataTestId="app-card"
        shadowOnHover
      >
        <div
          className="flex gap-2 outline-none"
          onClick={handleAppLaunch}
          onKeyUp={(e) => (e.code === 'Enter' ? handleAppLaunch() : '')}
          tabIndex={0}
        >
          {isNewEntity(app?.createdAt) && (
            <div
              className={`${leftChipStyle} bg-primary-600 text-primary-100`}
              data-testid={`member-badge`}
            >
              {t('new')}
            </div>
          )}
          {/* App logo */}
          <div className="p-2 bg-neutral-100 rounded-xl min-w-[60px] min-h-[60px]">
            <img
              src={app?.icon?.original || DefaultAppIcon}
              height={44}
              width={44}
              alt={`${app.label} ${t('imageAlt')}`}
            />
          </div>

          {/* App details */}
          <div className="flex flex-col gap-1">
            {/* App name */}
            <Truncate
              text={app.label}
              className="text-sm font-bold text-neutral-900 max-w-[128px]"
              dataTestId="app-name"
            />
            {/* App category */}
            {app.category && !isEmpty(app.category) && (
              <div className="flex">
                <Badge
                  text={app.category.name?.substring(0, 24)}
                  textClassName="text-blue-500 text-xxs py-0 leading-2 line-clamp-1 truncate"
                  bgClassName="bg-blue-100 border-1 border-blue-300"
                  dataTestId="app-category"
                />
              </div>
            )}
            {/* App description */}
            <Truncate
              text={app.description}
              className=" text-xxs  text-neutral-500 max-w-[128px]"
              dataTestId="app-description"
            />
          </div>
        </div>

        {/* App menu popover */}
        <div className="absolute top-0 right-3 hidden group-hover/app-card:block group-focus-within/app-card:block">
          <PopupMenu
            triggerNode={
              <div className="cursor-pointer">
                <Icon
                  name="threeDots"
                  dataTestId="app-card-ellipsis"
                  tabIndex={0}
                />
              </div>
            }
            menuItems={appCardMenu.filter((item) => !item.hidden)}
            className="-right-3 w-fit top-6"
          />
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
    </>
  );
};

export default AppCard;
