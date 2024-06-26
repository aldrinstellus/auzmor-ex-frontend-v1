import React, { FC } from 'react';
import BasicSetting from './components/BasicSetting';
import { IChannel } from 'stores/channelStore';
import PrivacySetting from './components/PrivacySetting';
import BasicSettingSkeleton from './components/Skeletons/BasicSettingSkeleton';

type AppProps = {
  channelData: IChannel;
  isLoading?: boolean;
};

const Setting: FC<AppProps> = ({ channelData, isLoading }) => {
  return (
    <>
      {isLoading ? (
        <BasicSettingSkeleton />
      ) : (
        <BasicSetting channelData={channelData} />
      )}
      <PrivacySetting channelData={channelData} />
    </>
  );
};

export default Setting;
