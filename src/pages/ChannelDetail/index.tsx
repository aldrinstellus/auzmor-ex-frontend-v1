import { FC } from 'react';
import Documents from './components/Documents';
import Home from './components/Home';
import ProfileSection from './components/ProfileSection';
import Members from './components/Members';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useChannelDetails } from 'queries/channel';
import PageLoader from 'components/PageLoader';
import clsx from 'clsx';
import DocumentPathProvider from 'contexts/DocumentPathContext';
import Setting from './components/Settings';
import ManageAccess from './components/ManageChannel';
import { usePageTitle } from 'hooks/usePageTitle';
import PrivateChannelBanner from 'components/PrivateChannel';
import { useChannelRole } from 'hooks/useChannelRole';
import { useTranslation } from 'react-i18next';

type AppProps = {
  activeTabIndex?: number;
};

const ChannelDetail: FC<AppProps> = ({ activeTabIndex = 0 }) => {
  usePageTitle('channelDetails');
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('channelDetail', { keyPrefix: 'tabs' });
  // Navigate to 404 if channel id is missing
  if (!channelId) {
    navigate('/404');
  }

  // fetch channel data
  const { data, isLoading } = useChannelDetails(channelId!);
  const channelData: IChannel = data?.data?.result?.data || null;
  const { isJoinedChannel, isChannelAdmin } = useChannelRole(channelId!);

  const showRequestBtn =
    channelData?.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channelData?.member &&
    !!!channelData?.joinRequest;
  const showWithdrawBtn =
    channelData?.settings?.visibility === ChannelVisibilityEnum.Private &&
    !!!channelData?.member &&
    !!channelData?.joinRequest;

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

  const showBanner = () => {
    if (showRequestBtn) {
      return <PrivateChannelBanner channel={channelData} />;
    } else if (showWithdrawBtn) {
      return <PrivateChannelBanner channel={channelData} isRequested />;
    }
    return false;
  };

  const tabs = [
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('home')}</div>
      ),
      hidden: false,
      dataTestId: 'channel-home-tab',
      tabContent: showBanner() || <Home channelData={channelData} />,
    },
    {
      id: 2,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('documents')}</div>
      ),
      hidden: !isJoinedChannel,
      dataTestId: 'channel-document-tab',
      tabContent: showBanner() || (
        <DocumentPathProvider>
          <Documents />
        </DocumentPathProvider>
      ),
    },
    {
      id: 3,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('members')}</div>
      ),
      hidden: !isJoinedChannel,
      dataTestId: 'channel-member-tab',
      tabContent: showBanner() || <Members channelData={channelData} />,
    },
    {
      id: 4,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}> {t('settings')}</div>
      ),
      hidden: !isJoinedChannel,
      dataTestId: 'channel-member-tab',
      tabContent: showBanner() || (
        <Setting isLoading={isLoading} channelData={channelData} />
      ),
    },
    {
      id: 5,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}> {t('manageAccess')}</div>
      ),
      hidden: !isChannelAdmin,
      dataTestId: 'channel-member-tab',
      tabContent: showBanner() || <ManageAccess channelData={channelData} />,
    },
  ].filter((item) => !item.hidden);

  return (
    <div className="flex flex-col  w-full ">
      <ProfileSection activeTabIndex={activeTabIndex} tabs={tabs} />
    </div>
  );
};

export default ChannelDetail;
