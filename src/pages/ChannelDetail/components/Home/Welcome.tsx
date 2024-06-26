import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation('channelDetail');
  return (
    <div
      className="bg-white rounded-9xl py-4 mt-6"
      data-testid="channel-welcome-abord-post"
    >
      <div className="flex justify-end px-4">
        <Icon name="close" size={20} />
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
            <div className="text-center text-xs mt-6">{t('welcome.line2')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
