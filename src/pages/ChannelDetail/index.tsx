import { FC } from 'react';
import Documents from './components/Documents';
import ChannelHome from './components/Home';
import ProfileSection from './components/ProfileSection';
import Members from './components/Members';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import { useParams } from 'react-router-dom';
import PageLoader from 'components/PageLoader';
import clsx from 'clsx';
import DocumentPathProvider from 'contexts/DocumentPathContext';
import Setting from './components/Settings';
import ManageAccess from './components/ManageChannel';
import { usePageTitle } from 'hooks/usePageTitle';
import PrivateChannelBanner from 'components/PrivateChannel';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigation';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import {
  ChannelPermissionEnum,
  getChannelPermissions,
} from './components/utils/channelPermission';
import { useChannelRole } from 'hooks/useChannelRole';
import useRole from 'hooks/useRole';
import useProduct from 'hooks/useProduct';

export enum ChannelDetailTabsEnum {
  Home = 'HOME',
  Documents = 'DOCUMENTS',
  Members = 'MEMBERS',
  Setting = 'SETTING',
  ManageAccess = 'MANAGE_ACCESS',
}

type AppProps = {
  activeTab?: ChannelDetailTabsEnum;
};

const ChannelDetail: FC<AppProps> = ({
  activeTab = ChannelDetailTabsEnum.Home,
}) => {
  usePageTitle('channelDetails');
  const { channelId } = useParams();
  const { getApi } = usePermissions();
  const navigate = useNavigate();
  const { t } = useTranslation('channelDetail', { keyPrefix: 'tabs' });
  const { isChannelJoined } = useChannelRole(channelId);
  const { isAdmin, isLearner } = useRole();
  const { isLxp } = useProduct();

  if (!channelId) {
    navigate('/404');
  }

  // fetch channel data
  const useChannelDetails = getApi(ApiEnum.GetChannel);
  const { data, isLoading } = useChannelDetails(channelId!);
  const channelData: IChannel = data?.data?.result?.data || null;
  const isChannelPrivate =
    channelData?.settings?.visibility === ChannelVisibilityEnum.Private;

  const showWithdrawBtn =
    isChannelPrivate && !!!channelData?.member && !!channelData?.joinRequest;

  const permissions = getChannelPermissions(
    isLxp,
    isLearner,
    channelData?.settings?.visibility || ChannelVisibilityEnum.Private,
    isChannelJoined,
    channelData?.member?.role,
    isAdmin,
  );

  if (isLoading && !channelData) {
    return <PageLoader />;
  }

  const tabStyles = (active: boolean, disabled = false) =>
    clsx(
      {
        'text-sm px-1 cursor-pointer group-focus:!text-white': true,
      },
      {
        '  font-bold text-white border-b-2 border-primary-400 pb-2 bottom-2 relative mt-1':
          active,
      },
      {
        '!text-neutral-300 hover:!text-white': !active,
      },
      {
        'bg-opacity-50 text-gray-400': disabled,
      },
    );

  const showBanner = (tab: ChannelDetailTabsEnum) => {
    switch (tab) {
      case ChannelDetailTabsEnum.Home:
        if (permissions.includes(ChannelPermissionEnum.CanAccessHomeTab)) {
          return false;
        } else {
          return (
            <PrivateChannelBanner
              channel={channelData}
              isRequested={showWithdrawBtn}
            />
          );
        }
      case ChannelDetailTabsEnum.Documents:
        if (permissions.includes(ChannelPermissionEnum.CanAccessDocumentsTab)) {
          return false;
        } else {
          return (
            <PrivateChannelBanner
              channel={channelData}
              isRequested={showWithdrawBtn}
            />
          );
        }
      case ChannelDetailTabsEnum.Members:
        if (permissions.includes(ChannelPermissionEnum.CanAccessMembersTab)) {
          return false;
        } else {
          return (
            <PrivateChannelBanner
              channel={channelData}
              isRequested={showWithdrawBtn}
            />
          );
        }
      case ChannelDetailTabsEnum.Setting:
        if (permissions.includes(ChannelPermissionEnum.CanAccessSettingsTab)) {
          return false;
        } else {
          return (
            <PrivateChannelBanner
              channel={channelData}
              isRequested={showWithdrawBtn}
            />
          );
        }
      case ChannelDetailTabsEnum.ManageAccess:
        if (permissions.includes(ChannelPermissionEnum.CanAccessManageTab)) {
          return false;
        } else {
          return (
            <PrivateChannelBanner
              channel={channelData}
              isRequested={showWithdrawBtn}
            />
          );
        }
    }
    return false;
  };

  const tabs = [
    {
      id: ChannelDetailTabsEnum.Home,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('home')}</div>
      ),
      hidden: false,
      dataTestId: 'channel-home-tab',
      tabContent: showBanner(ChannelDetailTabsEnum.Home) || (
        <ChannelHome channelData={channelData} permissions={permissions} />
      ),
    },
    {
      id: ChannelDetailTabsEnum.Documents,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('documents')}</div>
      ),
      hidden: !permissions.includes(
        ChannelPermissionEnum.CanAccessDocumentsTab,
      ),
      dataTestId: 'channel-document-tab',
      tabContent: showBanner(ChannelDetailTabsEnum.Documents) || (
        <DocumentPathProvider>
          <Documents />
        </DocumentPathProvider>
      ),
    },
    {
      id: ChannelDetailTabsEnum.Members,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('members')}</div>
      ),
      hidden: !permissions.includes(ChannelPermissionEnum.CanAccessMembersTab),
      dataTestId: 'channel-member-tab',
      tabContent: showBanner(ChannelDetailTabsEnum.Members) || (
        <Members channelData={channelData} permissions={permissions} />
      ),
    },
    {
      id: ChannelDetailTabsEnum.Setting,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}> {t('settings')}</div>
      ),
      hidden: !permissions.includes(ChannelPermissionEnum.CanAccessSettingsTab),
      dataTestId: 'channel-setting-tab',
      tabContent: showBanner(ChannelDetailTabsEnum.Setting) || (
        <Setting
          isLoading={isLoading}
          channelData={channelData}
          permissions={permissions}
        />
      ),
    },
    {
      id: ChannelDetailTabsEnum.ManageAccess,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}> {t('manageAccess')}</div>
      ),
      hidden: !permissions.includes(ChannelPermissionEnum.CanAccessManageTab),
      dataTestId: 'channel-access-tab',
      tabContent: showBanner(ChannelDetailTabsEnum.ManageAccess) || (
        <ManageAccess channelData={channelData} />
      ),
    },
  ].filter((item) => !item.hidden);

  return (
    <div className="flex flex-col  w-full ">
      <ProfileSection
        permissions={permissions}
        activeTab={activeTab}
        tabs={tabs}
      />
    </div>
  );
};

export default ChannelDetail;
