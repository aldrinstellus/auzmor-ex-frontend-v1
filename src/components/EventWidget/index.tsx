import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Card from 'components/Card';
import { formatDate } from 'components/CelebrationWidget/utils';
import Icon from 'components/Icon';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { useShouldRender } from 'hooks/useShouldRender';
import { useEventAttendee, useInfiniteLearnEvents } from 'queries/learn';
import React, { FC, useMemo } from 'react';
import { getLearnUrl } from 'utils/misc';
import { getTimeDifference, getTimeFromNow } from 'utils/time';
import EmptyState from './Component/EmptyState';
import AvatarList from 'components/AvatarList';

interface IEventWidgetProps {
  className?: string;
}
const ID = 'EventWidget';

const EventWidget: FC<IEventWidgetProps> = ({ className = '' }) => {
  const { currentTimezone } = useCurrentTimezone();
  const style = useMemo(
    () => clsx({ 'min-w-[240px] ': true, [className]: true }),
    [className],
  );
  const shouldRender = useShouldRender(ID);
  if (!shouldRender) {
    return <></>;
  }
  const isLive = false;
  const { data: upcomingEvents, isLoading } = useInfiniteLearnEvents({
    q: { limit: 1, filter: 'UPCOMING' },
  });
  const events = upcomingEvents?.pages?.flatMap((page: any) =>
    page?.data?.result?.data.map((event: any) => event),
  );
  const event = events?.[0];
  const { data: attendees } = useEventAttendee(event?.id);
  const eventsAttendees = attendees?.data?.result?.data;
  const userTimezone = event?.timezone || currentTimezone || 'Asia/Kolkata';
  const startDate = event?.start_date;
  const endDate = event?.end_date;

  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">Events</div>
        <Button
          label={'View all'}
          onClick={() => {
            window.location.replace(
              `${getLearnUrl()}/user/trainings?type=events&tab=UPCOMING`,
            );
          }}
          className="bg-transparent !text-primary-500 hover:!text-primary-600 hover:!bg-transparent active:!bg-transparent active:!text-primary-700"
        />
      </div>
      <Card className="mt-2 w-full   relative overflow-hidden ">
        {(() => {
          if (!event && !isLoading) {
            return <EmptyState />;
          } else {
            return (
              <div className="w-full h-full  relative overflow-hidden group/card ">
                <img
                  src={event?.image_url}
                  className="w-full  object-cover group-hover/card:scale-[1.10]"
                  style={{
                    transition: 'all 0.25s ease-in 0s',
                    animation: '0.15s ease-in 0s 1 normal both running fadeIn',
                  }}
                />
                {!isLive && (
                  <>
                    <div className="absolute z-10 flex top-0 left-4 right-4 bottom-40 justify-center z-100 items-center inset-0">
                      <Button
                        label={'Join event'}
                        onClick={() => {
                          window.open(event?.conference_url, '_blank');
                        }}
                        className="w-full bg-white text-white bg-opacity-20 border-white"
                      />
                    </div>
                  </>
                )}
                <div
                  className={`absolute  ${
                    isLive ? 'bg-primary-500' : 'bg-white border-neutral-200 '
                  } z-10 gap-1 flex top-4 left-4 px-2.5 py-1 text-xs font-medium rounded  `}
                >
                  <Icon
                    name={isLive ? 'radar' : 'videoPlay'}
                    size={18}
                    color={isLive ? 'text-white' : 'text-primary-500'}
                  />
                  <p
                    className={`text-xs ${
                      isLive ? 'text-white' : 'text-primary-500'
                    } font-semibold`}
                  >
                    {`Starts in ${getTimeFromNow(endDate, userTimezone)}`}
                  </p>
                </div>

                <div className="absolute  bg-white   bottom-0 left-0 flex flex-col p-4 z-10 gap-2 w-full">
                  <div className="flex gap-1">
                    {event?.categories?.slice(0, 2)?.map((d: any) => {
                      return (
                        <div
                          key={d?.id}
                          className="px-2 py-1 rounded bg-primary-100  text-center text-primary-500  text-xs font-medium"
                        >
                          {d?.title}
                        </div>
                      );
                    })}
                    {event?.categories?.length > 2 && (
                      <div className="px-2 py-1 rounded bg-primary-100  text-center text-primary-500  text-xs font-medium">
                        +{event?.categories?.length - 2}
                      </div>
                    )}
                  </div>
                  <div className="text-neutral-900 font-semibold text-base">
                    {event?.name}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1 items-center">
                      <Icon
                        name="calendar"
                        size={16}
                        color="text-primary-500"
                      />
                      <p className="text-xs text-neutral-900">
                        {formatDate(startDate, userTimezone, 'event')}
                      </p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Icon name="clock" size={16} color="text-primary-500" />
                      <p className="text-xs text-neutral-900">
                        {getTimeDifference(startDate, endDate, userTimezone)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center  gap-2">
                    <Avatar
                      name={event?.created_by?.full_name}
                      image={event?.created_by?.image_url}
                      size={32}
                    />

                    <div className="text-neutral-500 text-xs font-normal">
                      {event?.created_by?.full_name}
                    </div>

                    <div className="flex ml-auto gap-1 items-center">
                      <Icon name="video" size={20} color="text-primary-500" />
                      <p className="text-xs text-neutral-500">
                        {event?.session_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {' '}
                    <AvatarList
                      size={32}
                      users={eventsAttendees || []}
                      moreCount={attendees?.data?.result?.total_records || 10}
                      className="-space-x-[12px]"
                      avatarClassName="!b-[1px]"
                    />
                    <div className="text-xs  text-neutral-500 underline font-normal">
                      More attendees
                    </div>
                  </div>
                  {isLive && (
                    <Button label={'Join event'} className="w-full " />
                  )}
                </div>
              </div>
            );
          }
        })()}
      </Card>
    </div>
  );
};

export default EventWidget;
