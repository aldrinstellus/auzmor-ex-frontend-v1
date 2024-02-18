import { FC } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import useModal from 'hooks/useModal';
import { useNavigate } from 'react-router-dom';
import ChannelRow from './components/ChannelRow';
import { useTranslation } from 'react-i18next';

interface IChannelsProps {
  channelData?: any;
}

const ChannelsWidget: FC<IChannelsProps> = ({}) => {
  const { t } = useTranslation('channels');
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const navigate = useNavigate();

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };
  const channels = [1, 2, 3];

  return (
    <Card className="py-6  flex flex-col rounded-9xl" shadowOnHover>
      <div
        className="px-6 flex items-center justify-between cursor-pointer"
        onClick={toggleModal}
      >
        <div className="font-bold">{t('channels')}</div>
        <div className="flex items-center gap-2">
          <Icon
            name={open ? 'arrowUp' : 'arrowDown'}
            size={20}
            color="text-neutral-900"
            dataTestId="channel-launcher-collapse"
          />
        </div>
      </div>
      <div
        className={`transition-max-h px-6 duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[500px] mt-4' : 'max-h-[0]'
        }`}
      >
        <div className="my-4">
          <ChannelRow channel={channels} />
        </div>
        {/* // add skelten in loading state */}
        {(() => {
          if (channels.length > 0) {
            return (
              <div className="flex flex-col gap-4">
                <Button
                  variant={Variant.Secondary}
                  size={Size.Small}
                  className="py-[7px]"
                  label={t('explore-channels')}
                  dataTestId="explore-channels"
                  onClick={() => navigate('/channels')}
                />
              </div>
            );
          }
        })()}
      </div>
    </Card>
  );
};

export default ChannelsWidget;
