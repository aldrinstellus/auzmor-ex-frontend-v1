import Card from 'components/Card';

import Header from 'components/ProfileInfo/components/Header';
import React, { FC } from 'react';
import { ChannelVisibilityEnum, IChannel } from 'stores/channelStore';

import PrivacyRow from './PrivacyRow';
// import RestrictionRow from './RestrictionRow';
import { useTranslation } from 'react-i18next';
import ChannelVisibilityRow from './ChannelVisibilityRow';
import useRole from 'hooks/useRole';

type AppProps = {
  channelData: IChannel;
  canEdit: boolean;
};

const PrivacySetting: FC<AppProps> = ({ channelData, canEdit }) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'setting' });
  const { isLearner } = useRole()
  const canEditLearnerDiscoveryAndRequest = !isLearner && (channelData?.settings?.visibility === ChannelVisibilityEnum.Private || channelData?.settings?.visibility === ChannelVisibilityEnum.Restricted);

  return (
    <div className="flex flex-col gap-3">
      <Header
        title={t('privacySettings')}
        dataTestId="privacy-settings"
        className="!mb-0"
      />
      <Card shadowOnHover={canEdit} className="px-4">
        <PrivacyRow canEdit={canEdit} data={channelData} />
        <ChannelVisibilityRow canEdit={canEditLearnerDiscoveryAndRequest} data={channelData} />
      </Card>
    </div>
  );
};

export default PrivacySetting;
