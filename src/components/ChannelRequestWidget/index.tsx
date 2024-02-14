import { FC, memo, useMemo } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import clsx from 'clsx';
import ChannelRequestModal from './components/ChannelRequestModal';
import Button, { Size, Variant } from 'components/Button';
import ChannelWidgetUserRow from './components/ChannelWidgetUser';
import { useChannelRequests } from 'queries/channel';

type ChannelWidgetProps = {
  className?: string;
  channelId?: string;
};

const ChannelRequestWidget: FC<ChannelWidgetProps> = ({
  className = '',
  channelId = '',
}) => {
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openAllRequest, openAllRequestModal, closeAllRequestModal] =
    useModal();

  const channelRequestCount = 0;
  const widgetTitle = `Channel requests (${channelRequestCount})`;
  // const buttonLabel = 'View all requests';
  const { data: channelRequests } = useChannelRequests(channelId);

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const style = useMemo(
    () =>
      clsx({
        'py-6  flex flex-col rounded-9xl': true,
        [className]: true,
      }),
    [className],
  );

  const isAllRequestDisplyed = true; // isAllRequestDisplyed;
  return (
    <Card className={style} dataTestId="requestwidget">
      <div
        className=" px-6 flex items-center justify-between cursor-pointer"
        data-testid={`collapse-'channel-request`}
        onClick={toggleModal}
      >
        <div
          className="text-base font-bold leading-6 "
          data-test-id={`requestwidget-membercount`}
        >
          {widgetTitle}
        </div>
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
        <div className=" flex flex-col px-4  ">
          {/* add skelton loader here */}

          <div className=" divide-y  divide-neutral-200  ">
            <>
              {channelRequests?.map((user: any) => {
                return (
                  <div className="py-2 " key={user?.id}>
                    <ChannelWidgetUserRow user={user?.user} />
                  </div>
                );
              })}
            </>
          </div>

          {isAllRequestDisplyed && (
            <Button
              variant={Variant.Secondary}
              size={Size.Small}
              label={'View all requests'}
              dataTestId={`requestwidget-viewall-request`}
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
