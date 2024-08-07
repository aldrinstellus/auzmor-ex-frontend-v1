import { FC, memo, useMemo } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import clsx from 'clsx';
import ChannelRequestModal from './components/ChannelRequestModal';
import Button, { Size, Variant } from 'components/Button';
import ChannelWidgetUserRow, {
  ChannelRequestWidgetModeEnum,
} from './components/ChannelWidgetUser';
import { useInfiniteChannelsRequest } from 'queries/channel';
import { CHANNEL_MEMBER_STATUS, IChannelRequest } from 'stores/channelStore';
import { useNavigate, useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { useChannelRole } from 'hooks/useChannelRole';

export type ChannelRequestWidgetProps = {
  className?: string;
  mode?: ChannelRequestWidgetModeEnum;
};

const ChannelRequestWidget: FC<ChannelRequestWidgetProps> = ({
  className = '',
  mode = ChannelRequestWidgetModeEnum.Feed,
}) => {
  const navigate = useNavigate();
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openAllRequest, openAllRequestModal, closeAllRequestModal] =
    useModal();
  const { channelId } = useParams();

  const { isChannelAdmin } = useChannelRole(channelId!);

  if (channelId && !isChannelAdmin) return <></>;

  const { data, isLoading } = useInfiniteChannelsRequest(
    channelId,
    {
      limit: 3,
      status: CHANNEL_MEMBER_STATUS.PENDING,
    },
    true,
  );

  const requests = data?.pages.flatMap((page: any) => {
    return (
      page?.data?.result?.data.map((request: IChannelRequest) => {
        try {
          return request;
        } catch (e) {}
      }) || []
    );
  }) as IChannelRequest[];

  const widgetTitle = (
    <p className="flex">
      Channel requests &#40;&nbsp;
      {isLoading ? (
        <Skeleton count={1} className="!w-8 h-5" />
      ) : (
        data?.pages[0]?.data?.result?.totalCount
      )}
      &nbsp;&#41;
    </p>
  );

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

  if (requests?.length === 0) {
    return <></>;
  }
  return (
    <Card className={style} dataTestId="requestwidget" shadowOnHover>
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
              {requests?.map((request: IChannelRequest) => {
                return (
                  <div className="py-2 " key={request?.id}>
                    <ChannelWidgetUserRow request={request} mode={mode} />
                  </div>
                );
              })}
            </>
          </div>
          <Button
            variant={Variant.Secondary}
            size={Size.Small}
            label={'View all requests'}
            dataTestId={`requestwidget-viewall-request`}
            onClick={() =>
              mode === ChannelRequestWidgetModeEnum.Channel
                ? navigate(`/channels/${channelId}/members?type=requests`)
                : openAllRequestModal()
            }
          />
        </div>
      </div>
      {openAllRequest && (
        <ChannelRequestModal
          open={openAllRequest}
          channelId={channelId}
          closeModal={closeAllRequestModal}
        />
      )}
    </Card>
  );
};

export default memo(ChannelRequestWidget);
