import Card from 'components/Card';
import Header from 'components/ProfileInfo/components/Header';
import React, { FC } from 'react';
import { IChannel } from 'stores/channelStore';
import DocVisibilityRow from './DocVisibilityRow';
import UploadControlRow from './UploadControlRow';
import DocAccessLevelRow from './DocAccessLevelRow';
import CommentVisibilityRow from './CommentVisibilityRow';
import CommentControlRow from './CommentControlRow';
import { useTranslation } from 'react-i18next';

type DocumentSettingProps = {
  channelData: IChannel;
  canEdit: boolean;
};

const DocumentSetting: FC<DocumentSettingProps> = ({
  channelData,
  canEdit,
}) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'setting.documentSetting',
  });
  return (
    <div className="flex flex-col gap-3">
      <Header
        title={t('title')}
        dataTestId="privacy-settings"
        className="!mb-0"
      />
      <Card shadowOnHover={canEdit} className="px-4">
        <DocVisibilityRow canEdit={canEdit} data={channelData} />
        <UploadControlRow canEdit={canEdit} data={channelData} />
        <DocAccessLevelRow canEdit={canEdit} data={channelData} />
        <CommentVisibilityRow canEdit={canEdit} data={channelData} />
        <CommentControlRow canEdit={canEdit} data={channelData} />
      </Card>
    </div>
  );
};

export default DocumentSetting;
