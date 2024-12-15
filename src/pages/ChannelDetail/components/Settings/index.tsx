import React, { FC } from 'react';
import BasicSetting from './components/BasicSetting';
import { IChannel } from 'stores/channelStore';
import PrivacySetting from './components/PrivacySetting';
import BasicSettingSkeleton from './components/Skeletons/BasicSettingSkeleton';
import { ChannelPermissionEnum } from '../utils/channelPermission';

type AppProps = {
  channelData: IChannel;
  isLoading?: boolean;
  permissions: ChannelPermissionEnum[];
};

const Setting: FC<AppProps> = ({ channelData, isLoading, permissions }) => {
  return (
    <>
      {isLoading ? (
        <BasicSettingSkeleton />
      ) : (
        <BasicSetting
          canEdit={permissions.includes(ChannelPermissionEnum.CanEditSettings)}
          channelData={channelData}
        />
      )}
      <PrivacySetting
        canEdit={permissions.includes(ChannelPermissionEnum.CanEditSettings)}
        channelData={channelData}
      />
    </>
  );
};

export default Setting;
