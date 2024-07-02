import Card from 'components/Card';
import { FC } from 'react';
import PrivateChannelImage from 'images/png/PrivateChannelBanner.png';
import Button, { Variant } from 'components/Button';
import AvatarChips from 'components/AvatarChips';
import { useTranslation } from 'react-i18next';
import { useChannelAdmins } from 'queries/channel';
import { useNavigate } from 'react-router-dom';

interface IChannelBannerProps {
  isChannelRequest?: boolean;
  channelId?: string;
}

const PrivateChannelBanner: FC<IChannelBannerProps> = ({
  channelId = '',
  isChannelRequest = true,
}) => {
  const { t } = useTranslation('channels');
  const { data: admins } = useChannelAdmins(channelId);
  const navigate = useNavigate();
  return (
    <Card>
      <div
        onClick={() => {
          navigate(`channels/${channelId}`);
        }}
        className="flex flex-col items-center justify-center p-8 "
      >
        <img src={PrivateChannelImage} alt="private channel banner" />
        <div
          className="text-2xl font-bold mt-8 mb-4"
          data-testid={'channel--privacynote'}
        >
          {t('privateChannel.bannerHeader')}
        </div>
        <Button
          label={
            isChannelRequest
              ? t('privateChannel.joinRequestCTA')
              : t('privateChannel.withdrawRequestCTA')
          }
          variant={isChannelRequest ? Variant.Primary : Variant.Danger}
          onClick={() => {}} // channel send or withdraw  function to call
          data-testid={
            isChannelRequest
              ? 'channel-request-to-join'
              : 'channel--withdraw-request'
          }
        />
        <div
          className="text-neutral-500 mt-[80px] underline  mb-4 text-sm font-semibold"
          data-testid={'channel-admin-list'}
        >
          {t('privateChannel.bannerFotter')}
        </div>
        <AvatarChips
          users={admins}
          showCount={7}
          dataTestId={'channel-admin-list-'}
        />
      </div>
    </Card>
  );
};

export default PrivateChannelBanner;
