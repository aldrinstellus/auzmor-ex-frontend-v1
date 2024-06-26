import Card from 'components/Card';

import Header from 'components/ProfileInfo/components/Header';
import React, { FC } from 'react';
import { IChannel } from 'stores/channelStore';

import PrivacyRow from './PrivacyRow';
import RestrictionRow from './RestrictionRow';

type AppProps = {
  channelData: IChannel;
};

const PrivacySetting: FC<AppProps> = ({ channelData }) => {
  return (
    <div>
      <Header title="Personal Details" dataTestId="personal-details" />
      <Card shadowOnHover={true} className=" px-4">
        <div className="px-4">
          <PrivacyRow data={channelData} />
          <RestrictionRow data={channelData} />
        </div>
      </Card>
    </div>
  );
};

export default PrivacySetting;
