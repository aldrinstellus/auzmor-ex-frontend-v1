import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Card from 'components/Card';
import { formatDate } from 'components/CelebrationWidget/utils';
import Icon from 'components/Icon';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { useShouldRender } from 'hooks/useShouldRender';
import { useEventAttendee, useInfiniteLearnEvents } from 'queries/learn';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { getLearnUrl } from 'utils/misc';
import { getTimeDifference, getTimeFromNow } from 'utils/time';
import AvatarList from 'components/AvatarList';
import Skeleton from 'react-loading-skeleton';
import EmptyState from './Component/EmptyState';
import moment from 'moment';
import { useQueryClient } from '@tanstack/react-query';

interface IEventWidgetProps {
  className?: string;
}
const ID = 'EventWidget';

const EventWidget: FC<IEventWidgetProps> = ({ className = '' }) => {
  const { currentTimezone } = useCurrentTimezone();
  const shouldRender = useShouldRender(ID);
  if (!shouldRender) {
    return <></>;
  }
  let isLive = true;
  const queryClient = useQueryClient();
  const style = useMemo(
    () => clsx({ 'min-w-[240px]  ': true, [className]: true }),
    [className],
  );
  const { data: ongoingEvents, isLoading: isLoadingOngoing } =
    useInfiniteLearnEvents({
      q: { limit: 1, filter: 'ONGOING' },
    });
  const { data: upcomingEvents, isLoading: isLoadingUpcoming } =
    useInfiniteLearnEvents({
      q: { limit: 1, filter: 'UPCOMING' },
    });
  const isLoading = isLoadingOngoing || isLoadingUpcoming;
  let events = ongoingEvents?.pages?.flatMap((page: any) =>
    page?.data?.result?.data.map((event: any) => event),
  );
  if (events?.length == 0) {
    isLive = false;
    events = upcomingEvents?.pages?.flatMap((page: any) =>
      page?.data?.result?.data.map((event: any) => event),
    );
  }
  const event = events?.[0];
  const { data: attendees } = useEventAttendee(event?.id);
  const eventsAttendees = attendees?.data?.result?.data?.map(
    (attendee: any) => ({
      id: attendee.id,
      name: attendee.full_name,
      image: attendee.image_url,
    }),
  );
  const userTimezone = event?.timezone || currentTimezone || 'Asia/Kolkata';
  const startDate = event?.start_date;
  const endDate = event?.end_date;

  const [timeLeft, setTimeLeft] = useState<any>(
    getTimeFromNow(startDate, userTimezone),
  ); // State to store the time left
  let interval: NodeJS.Timeout;

  // Function to calculate and update time left
  const updateTimeLeft = async () => {
    if (moment(startDate) < moment(endDate)) {
      const finalDate = moment.tz(1711629000000, userTimezone);
      const currentDate = moment().tz(userTimezone);
      // Calculate the difference between finalDate and currentDate
      const timeDiff = finalDate.diff(currentDate);
      // console.log('timeDiff :', timeDiff);
      if (timeDiff == 1) {
        await queryClient.invalidateQueries(['event-attendee']);
      }
      // Check if time left is less than a minute
      if (timeDiff <= 60000) {
        // 60000 milliseconds = 1 minute
        // Re-render every second
        interval = setInterval(() => {
          updateTimeLeft();
        }, 1000);
      } else if (timeDiff <= 3600000) {
        // 3600000 milliseconds = 1 hour
        // Re-render every minute
        interval = setInterval(() => {
          updateTimeLeft();
        }, 60000);
      } else {
        // If time left is more than an hour, clear the interval
        clearInterval(interval);
      }
      // Format the time difference
      const formattedTimeLeft = getTimeFromNow(startDate, userTimezone);
      setTimeLeft(formattedTimeLeft);
    }
  };

  // useEffect hook to update time left on component mount
  useEffect(() => {
    updateTimeLeft();
    // Clean up setInterval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full h-[350px] relative overflow-hidden group/card">
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }

  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">Events</div>
        <Button
          label={'View all'}
          onClick={() => {
            window.location.assign(
              `${getLearnUrl()}/user/trainings?type=events&tab=${
                isLive ? 'ONGOING' : 'UPCOMING'
              }`,
            );
          }}
          className="bg-transparent !text-primary-500 hover:!text-primary-600 hover:!bg-transparent active:!bg-transparent active:!text-primary-700"
        />
      </div>
      <Card className="mt-2 w-full relative overflow-hidden ">
        {(() => {
          if (events && events?.length > 0 && !isLoading) {
            return (
              <div
                className={`w-full  ${
                  isLive ? 'h-[397px]' : 'h-[353px]'
                } relative overflow-hidden group/card `}
              >
                <img
                  src={event?.image_url}
                  className="w-full h-[160px]    object-cover group-hover/card:scale-[1.10]"
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
                    {isLive ? 'Live' : `Starts in ${timeLeft}`}
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
                    <Button
                      label={'Join event'}
                      className="w-full "
                      onClick={() => {
                        window.open(event?.conference_url, '_blank');
                      }}
                    />
                  )}
                </div>
              </div>
            );
          }
          return <EmptyState />;
        })()}
      </Card>
    </div>
  );
};

export default EventWidget;
