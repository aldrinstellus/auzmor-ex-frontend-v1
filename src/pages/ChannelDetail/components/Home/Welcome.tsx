import Icon from 'components/Icon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

const Welcome = () => {
  const { t } = useTranslation('channelDetail');
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState<boolean>(
    searchParams.get('showWelcome') === 'true',
  );

  useEffect(() => {
    if (showWelcome) {
      searchParams.delete('showWelcome');
      setSearchParams(searchParams, { replace: true });
    }
  }, [showWelcome, searchParams, setSearchParams]);

  const handleClose = () => {
    setShowWelcome(false);
  };

  if (!showWelcome) {
    return null;
  }

  return (
    <div
      className="bg-white rounded-9xl py-4 mt-6"
      data-testid="channel-welcome-abord-post"
    >
      <div className="flex justify-end px-4">
        <Icon onClick={handleClose} name="close" size={20} />
      </div>
      <div className="flex justify-between p-4">
        <div>
          <img
            src={require('images/channelOnboard.png')}
            className="h-[210px]"
            alt="Channel Onboard Picture"
          />
        </div>
        <div className="flex flex-col items-center flex-1 py-4">
          <div className="text-2xl font-semibold">{t('welcome.title')}</div>
          <div className="mt-4 font-medium">
            <div className="text-center text-xs">{t('welcome.line1')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
