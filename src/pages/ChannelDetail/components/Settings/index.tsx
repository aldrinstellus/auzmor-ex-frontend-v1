import React, { FC } from 'react';
import BasicSetting from './components/BasicSetting';
import { IChannel } from 'stores/channelStore';
import PrivacySetting from './components/PrivacySetting';
import BasicSettingSkeleton from './components/Skeletons/BasicSettingSkeleton';
import { useChannelRole } from 'hooks/useChannelRole';

type AppProps = {
  channelData: IChannel;
  isLoading?: boolean;
};

const Setting: FC<AppProps> = ({ channelData, isLoading }) => {
  const { isChannelAdmin } = useChannelRole(channelData.id);
  return (
    <>
      {isLoading ? (
        <BasicSettingSkeleton />
      ) : (
        <BasicSetting canEdit={isChannelAdmin} channelData={channelData} />
      )}
      <PrivacySetting canEdit={isChannelAdmin} channelData={channelData} />
    </>
  );
};

export default Setting;
