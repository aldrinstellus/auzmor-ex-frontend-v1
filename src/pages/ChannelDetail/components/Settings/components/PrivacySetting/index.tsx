import Card from 'components/Card';

import Header from 'components/ProfileInfo/components/Header';
import React, { FC } from 'react';
import { IChannel } from 'stores/channelStore';

import PrivacyRow from './PrivacyRow';
// import RestrictionRow from './RestrictionRow';
import { useTranslation } from 'react-i18next';

type AppProps = {
  channelData: IChannel;
  canEdit: boolean;
};

const PrivacySetting: FC<AppProps> = ({ channelData, canEdit }) => {
  const { t } = useTranslation('channelDetail', { keyPrefix: 'setting' });

  return (
    <div>
      <Header title={t('persnolDetails')} dataTestId="personal-details" />
      <Card shadowOnHover={canEdit} className="px-4">
        <PrivacyRow canEdit={canEdit} data={channelData} />
      </Card>
    </div>
  );
};

export default PrivacySetting;
