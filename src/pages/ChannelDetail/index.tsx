import { FC, useEffect } from 'react';
import Documents from './components/Documents';
import Home from './components/Home';
import ProfileSection from './components/ProfileSection';
import Members from './components/Members';
import { IChannel, useChannelStore } from 'stores/channelStore';
import { useParams } from 'react-router-dom';
import useScrollTop from 'hooks/useScrollTop';
import { useChannelDetails } from 'queries/channel';
import PageLoader from 'components/PageLoader';
import clsx from 'clsx';
import DocumentPathProvider from 'contexts/DocumentPathContext';
import { usePageTitle } from 'hooks/usePageTitle';

type AppProps = {
  activeTabIndex?: number;
  isSettingTab?: boolean;
  isManagedTab?: boolean;
};

const ChannelDetail: FC<AppProps> = ({
  activeTabIndex = 0,
  isSettingTab,
  isManagedTab,
}) => {
  usePageTitle('channelDetails');
  const { channelId } = useParams();

  const { getChannel } = useChannelStore();

  const { getScrollTop, resumeRecordingScrollTop } = useScrollTop(
    'app-shell-container',
  );
  useEffect(() => {
    resumeRecordingScrollTop();
    const ele = document.getElementById('app-shell-container');
    if (ele) {
      ele.scrollTo({
        top: getScrollTop(),
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [channelId]);

  if (!channelId) {
    return <div>Error</div>;
  }

  const { data, isLoading } = useChannelDetails(channelId || '');

  const listChannelData: IChannel = getChannel(channelId);
  const channelData: IChannel =
    data?.data?.result?.data || listChannelData || null;

  if (isLoading && !channelData) {
    return <PageLoader />;
  }
  const tabStyles = (active: boolean, disabled = false) =>
    clsx(
      {
        'text-sm px-1 cursor-pointer': true,
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
  const tabs = [
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Home</div>
      ),
      dataTestId: 'channel-home-tab',
      tabContent: (
        <>
          <Home isSettingTab={isSettingTab} />
        </>
      ),
    },
    {
      id: 2,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Documents</div>
      ),
      dataTestId: 'channel-document-tab',
      tabContent: (
        <DocumentPathProvider>
          <Documents />
        </DocumentPathProvider>
      ),
    },
    {
      id: 3,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Members</div>
      ),
      dataTestId: 'channel-member-tab',
      tabContent: (
        <Members isManagedTab={isManagedTab} channelData={channelData} />
      ),
    },
  ];

  return (
    <div className="flex flex-col  w-full ">
      <ProfileSection
        activeTabIndex={activeTabIndex}
        tabs={tabs}
        channelData={channelData}
      />
    </div>
  );
};

export default ChannelDetail;
