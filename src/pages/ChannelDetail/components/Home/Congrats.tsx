import Icon from 'components/Icon';
import { FC, useEffect, useMemo, useState } from 'react';
import { IChannel } from 'stores/channelStore';
import { useFeedStore } from 'stores/feedStore';
import * as _ from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type AppProps = {
  channelData: IChannel;
};

const Congrats: FC<AppProps> = ({ channelData }) => {
  const [searchParams] = useSearchParams();
  const [showSettingUp, setShowSettingUp] = useState<boolean>(
    searchParams.get('showWelcome') === 'true',
  );
  const { t } = useTranslation('channelDetail', { keyPrefix: 'congrats' });
  const { feed } = useFeedStore();
  const isRender = useMemo(() => {
    return (
      !!channelData?.banner?.original &&
      channelData?.totalMembers > 1 &&
      !!channelData?.description &&
      !_.isEmpty(feed) &&
      showSettingUp
    );
  }, [channelData, feed]);

  const [isShow, setIsShow] = useState(isRender);

  useEffect(() => {
    setIsShow(isRender);
  }, [isRender]);

  const handleClose = () => {
    setShowSettingUp(false);
    setIsShow(false);
  };

  if (!isShow || !showSettingUp) {
    return <></>;
  }
  return (
    <div
      className="bg-white rounded-9xl py-4 mt-6"
      data-testid="channel-welcome-abord-post"
    >
      <div className="flex justify-end px-4">
        <Icon name="close" onClick={handleClose} size={20} />
      </div>
      <div className="flex justify-between p-4">
        <div>
          <img
            src={require('images/ChannelCover/channelDone.png')}
            className="h-[210px]"
            alt="Channel congrats Picture"
          />
        </div>
        <div className="flex flex-col items-center flex-1 py-4">
          <div className="text-2xl font-semibold">{t('congratulations')}!</div>
          <div className="mt-4 font-medium">
            <div className="text-center text-xs">{t('finishedSettingUp')}</div>
            <div className="text-center text-xs mt-6">{t('inviteMore')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congrats;
