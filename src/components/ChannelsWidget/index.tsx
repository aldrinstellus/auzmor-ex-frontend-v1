import { FC } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Size, Variant } from 'components/Button';
import useModal from 'hooks/useModal';
import useNavigate from 'hooks/useNavigation';
import ChannelRow from './components/ChannelRow';
import { useTranslation } from 'react-i18next';
import { useInfiniteChannels } from 'queries/channel';
import { isFiltersEmpty } from 'utils/misc';
import ChannelSkeleton from './components/skeletons/ChannelsWidgetSkeleton';

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
  const { data, channels, isLoading } = useInfiniteChannels(
    isFiltersEmpty({
      limit: 2,
    }),
  );

  const channelIds =
    (data?.pages.flatMap(
      (page) =>
        page?.data?.result?.data.map((channel: { id: string }) => channel) ||
        [],
    ) as { id: string }[]) || [];

  if (channelIds?.length == 0) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        {[...Array(2)].map((_value, index) => (
          <div
            key={`${index}-channels-widget-skeleton`}
            className="flex flex-col gap-2"
          >
            <ChannelSkeleton />
          </div>
        ))}
      </>
    );
  }
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
        {channelIds.slice(0, 2).map(({ id }) => (
          <ChannelRow key={id} channel={channels[id]} />
        ))}
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
      </div>
    </Card>
  );
};

export default ChannelsWidget;
