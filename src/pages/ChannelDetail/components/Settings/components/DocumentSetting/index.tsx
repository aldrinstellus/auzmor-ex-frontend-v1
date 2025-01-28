import Card from 'components/Card';
import Header from 'components/ProfileInfo/components/Header';
import React, { FC } from 'react';
import { IChannel } from 'stores/channelStore';
import DocVisibilityRow from './DocVisibilityRow';
import UploadControlRow from './UploadControlRow';
import DocAccessLevelRow from './DocAccessLevelRow';

type DocumentSettingProps = {
  channelData: IChannel;
  canEdit: boolean;
};

const DocumentSetting: FC<DocumentSettingProps> = ({
  channelData,
  canEdit,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Header
        title="Document settings"
        dataTestId="privacy-settings"
        className="!mb-0"
      />
      <Card shadowOnHover={canEdit} className="px-4">
        <DocVisibilityRow canEdit={canEdit} data={channelData} />
        <UploadControlRow canEdit={canEdit} data={channelData} />
        <DocAccessLevelRow canEdit={canEdit} data={channelData} />
      </Card>
    </div>
  );
};

export default DocumentSetting;
