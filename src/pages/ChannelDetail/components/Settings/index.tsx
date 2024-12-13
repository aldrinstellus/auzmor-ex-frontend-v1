import React, { FC } from 'react';
import BasicSetting from './components/BasicSetting';
import { IChannel } from 'stores/channelStore';
import PrivacySetting from './components/PrivacySetting';
import BasicSettingSkeleton from './components/Skeletons/BasicSettingSkeleton';
import { ChannelPermissionEnum } from '../utils/channelPermission';
import IntegrationSetting from './components/IntegrationSetting';

type AppProps = {
  channelData: IChannel;
  isLoading?: boolean;
  permissions: ChannelPermissionEnum[];
};

const Setting: FC<AppProps> = ({ channelData, isLoading, permissions }) => {
  return (
    <div className="flex flex-col gap-4">
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
      <IntegrationSetting
        canEdit={permissions.includes(ChannelPermissionEnum.CanEditSettings)}
      />
    </div>
  );
};

export default Setting;
