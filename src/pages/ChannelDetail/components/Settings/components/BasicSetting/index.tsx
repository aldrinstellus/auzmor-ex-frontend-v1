import { FC } from 'react';
import Card from 'components/Card';
import clsx from 'clsx';
import 'moment-timezone';
import NameRow from './NameRow';
import DescriptionRow from './DescriptionRow';
import Header from 'components/ProfileInfo/components/Header';
import CategoryRow from './CategoryRow';
import { useTranslation } from 'react-i18next';

export interface IBasicSettingProps {
  channelData?: any;
  canEdit: boolean;
  editSection?: string;
  setSearchParams?: any;
  searchParams?: any;
}

const BasicSetting: FC<IBasicSettingProps> = ({ channelData, canEdit }) => {
  const styles = clsx({ 'p-4 mb-8': true });
  const { t } = useTranslation('channelDetail', { keyPrefix: 'setting' });
  return (
    <div>
      <Header title={t('basicSetting')} dataTestId="channel-setting-details" />
      <Card className={styles} shadowOnHover={canEdit}>
        <NameRow canEdit={canEdit} data={channelData} />
        <DescriptionRow canEdit={canEdit} channelData={channelData} />
        <CategoryRow canEdit={canEdit} channelData={channelData} />
      </Card>
    </div>
  );
};

export default BasicSetting;
