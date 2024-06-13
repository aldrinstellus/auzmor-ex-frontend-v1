import { useEffect, useState } from 'react';
import Documents from './components/Documents';
import Home from './components/Home';
import ProfileSection from './components/ProfileSection';
import Members from './components/Members';
import DocumentPathProvider from 'contexts/DocumentPathContext';
import { useChannelStore } from 'stores/channelStore';
import { useParams } from 'react-router-dom';
import useScrollTop from 'hooks/useScrollTop';

const ChannelDetail = () => {
  const { channelId } = useParams();
  const [activeTab, setActiveTab] = useState('home');
  const { getChannel } = useChannelStore();

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

  const channelData = getChannel(channelId);
  return (
    <div className="flex flex-col space-y-10 w-full mb-16">
      <ProfileSection
        channelData={channelData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === 'home' && <Home />}
      {activeTab === 'document' && (
        <DocumentPathProvider>
          <Documents />
        </DocumentPathProvider>
      )}
      {activeTab === 'members' && <Members />}
    </div>
  );
};

export default ChannelDetail;
