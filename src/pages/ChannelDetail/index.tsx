import { useEffect, useState } from 'react';
import Documents from './components/Documents';
import Home from './components/Home';
import ProfileSection from './components/ProfileSection';
import Members from './components/Members';
import DocumentPathProvider from 'contexts/DocumentPathContext';
import { useChannelStore } from 'stores/channelStore';
import { useParams } from 'react-router-dom';
import useScrollTop from 'hooks/useScrollTop';
import ManageAccess from './components/ManageChannel';

const ChannelDetail = () => {
  const { channelId } = useParams();
  const [activeTab, setActiveTab] = useState('home');
  const { getChannel } = useChannelStore();
  const [activeMenu, setActiveMenu] = useState({
    accessTab: false,
    settingTab: false,
  });

  if (!channelId) {
    return <div>Error</div>;
  }
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
  const renderActiveTab = () => {
    if (activeMenu.accessTab) {
      return <ManageAccess />;
    }
    if (activeMenu.settingTab) {
      return <>setting tab</>;
    }
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'document':
        return (
          <DocumentPathProvider>
            <Documents />
          </DocumentPathProvider>
        );
      case 'members':
        return <Members />;
      default:
        return null;
    }
  };

  const channelData = getChannel(channelId);
  return (
    <div className="flex flex-col space-y-10 w-full mb-16">
      <ProfileSection
        channelData={channelData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setActiveMenu={setActiveMenu}
      />
      {renderActiveTab()}
    </div>
  );
};

export default ChannelDetail;
