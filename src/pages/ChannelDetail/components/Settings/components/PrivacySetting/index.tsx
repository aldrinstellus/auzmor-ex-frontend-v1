import Card from 'components/Card';

import Header from 'components/ProfileInfo/components/Header';
import React, { FC } from 'react';
import { IChannel } from 'stores/channelStore';

import PrivacyRow from './PrivacyRow';
import RestrictionRow from './RestrictionRow';

type AppProps = {
  channelData: IChannel;
  canEdit: boolean;
};

const PrivacySetting: FC<AppProps> = ({ channelData, canEdit }) => {
  return (
    <div>
      <Header title="Personal Details" dataTestId="personal-details" />
      <Card shadowOnHover={canEdit} className=" px-4">
        <div className="px-4">
          <PrivacyRow isUserAdminOrChannelAdmin={canEdit} data={channelData} />
          <RestrictionRow
            isUserAdminOrChannelAdmin={canEdit}
            data={channelData}
          />
        </div>
      </Card>
    </div>
  );
};

export default PrivacySetting;
