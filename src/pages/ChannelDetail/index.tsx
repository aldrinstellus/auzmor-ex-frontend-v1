import { useState } from 'react';
import Documents from './components/Documents';
import Home from './components/Home';
import ProfileSection from './components/ProfileSection';
import Members from './components/Members';

const ChannelDetail = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col space-y-10 w-full">
      <ProfileSection activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'home' && <Home />}
      {activeTab === 'document' && <Documents />}
      {activeTab === 'members' && <Members />}
    </div>
  );
};

export default ChannelDetail;
