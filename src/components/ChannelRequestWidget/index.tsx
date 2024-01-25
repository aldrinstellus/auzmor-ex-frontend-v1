import { FC, memo, useMemo } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import clsx from 'clsx';
import { ChannelUser } from 'mocks/Channels';
import ChannelRequestModal from './components/ChannelRequestModal';
import Button, { Size, Variant } from 'components/Button';
import ChannelWidgetUserRow from './components/ChannelWidgetUser';

type ChannelWidgetProps = {
  className?: '';
};

const ChannelRequestWidget: FC<ChannelWidgetProps> = ({ className = '' }) => {
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openAllRequest, openAllRequestModal, closeAllRequestModal] =
    useModal();

  const channelRequestCount = 0;
  const widgetTitle = `Channel requests (${channelRequestCount})`;
  // const buttonLabel = 'View all requests';

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const style = useMemo(
    () =>
      clsx({
        'py-6 px-4 flex flex-col rounded-9xl': true,
        [className]: true,
      }),
    [className],
  );

  const isAllRequestDisplyed = true; // isAllRequestDisplyed;
  return (
    <Card className={style}>
      <div
        className="px-6 flex items-center justify-between cursor-pointer"
        data-testid={`collapse-'channel-request`}
        onClick={toggleModal}
      >
        <div className="text-base font-bold leading-6 ">{widgetTitle}</div>
        <Icon
          name={open ? 'arrowUp' : 'arrowDown'}
          size={20}
          color="text-neutral-900"
        />
      </div>
      <div
        className={`transition-max-h duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[1000px]' : 'max-h-[0]'
        }`}
      >
        <div className=" flex flex-col  mt-4">
          {/* add skelton loader here */}
          {ChannelUser.map((user: any) => {
            return <ChannelWidgetUserRow key={user?.id} user={user} />;
          })}
          {isAllRequestDisplyed && (
            <Button
              variant={Variant.Secondary}
              size={Size.Small}
              className="py-[7px]"
              label={'View all requests'}
              dataTestId={`view-all-requests`}
              onClick={openAllRequestModal}
            />
          )}
        </div>
      </div>
      {openAllRequest && (
        <ChannelRequestModal
          open={openAllRequest}
          closeModal={closeAllRequestModal}
        />
      )}
    </Card>
  );
};

export default memo(ChannelRequestWidget);
