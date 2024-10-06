import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import { formatDate } from 'components/CelebrationWidget/utils';
import Icon from 'components/Icon';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { useShouldRender } from 'hooks/useShouldRender';
import React, { FC, useMemo } from 'react';
import { getLearnUrl } from 'utils/misc';
import { getTimeDifference } from 'utils/time';
import AvatarList from 'components/AvatarList';
import Skeleton from 'react-loading-skeleton';
import EmptyState from './Component/EmptyState';
import TimeChip from './Component/TimeChip';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IEventWidgetProps {
  className?: string;
}
const ID = 'EventWidget';

const EventWidget: FC<IEventWidgetProps> = ({ className = '' }) => {
  const { currentTimezone } = useCurrentTimezone();
  const shouldRender = useShouldRender(ID);
  const { t } = useTranslation('learnWidget', { keyPrefix: 'eventWidget' });
  const { getApi } = usePermissions();

  if (!shouldRender) {
    return <></>;
  }

  let isLive = true;
  const style = useMemo(
    () => clsx({ 'min-w-[240px]': true, [className]: true }),
    [className],
  );
  const useInfiniteEvents = getApi(ApiEnum.GetEvents);
  const { data: ongoingEvents, isLoading: isLoadingOngoing } =
    useInfiniteEvents({
      q: { limit: 1, filter: 'ONGOING' },
    });
  const { data: upcomingEvents, isLoading: isLoadingUpcoming } =
    useInfiniteEvents({
      q: { limit: 1, filter: 'UPCOMING' },
    });
  const isLoading = isLoadingOngoing || isLoadingUpcoming;
  let events = ongoingEvents?.pages?.flatMap((page: any) =>
    page?.data?.result?.data.map((event: any) => event),
  );
  if (events?.length === 0) {
    isLive = false;
    events = upcomingEvents?.pages?.flatMap((page: any) =>
      page?.data?.result?.data.map((event: any) => event),
    );
  }
  const event = events?.[0];
  const useEventAttendees = getApi(ApiEnum.GetEventAttendees);
  const { data: attendees } = useEventAttendees({ eventId: event?.id });
  const eventsAttendees = attendees?.data?.result?.data?.map(
    (attendee: any) => ({
      id: attendee.id,
      name: attendee.full_name,
      image: attendee.image_url,
    }),
  );
  const userTimezone = currentTimezone || 'Asia/Kolkata';
  const startDate = event?.start_date;
  const endDate = event?.end_date;

  if (isLoading) {
    return (
      <Card className="w-full h-[350px] relative overflow-hidden group/card">
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }

  return (
    <div className={style}>
      <div className="flex justify-between items-center">
        <div className="text-base font-bold">{t('events')}</div>
        <Button
          variant={Variant.Secondary}
          label={t('viewAll')}
          className="border-0 !bg-transparent !px-0 !py-1 group"
          labelClassName=" text-primary-500 hover:text-primary-600  group-focus:text-primary-500"
          onClick={() => {
            window.location.assign(
              `${getLearnUrl()}/user/trainings?type=events&tab=${
                isLive ? 'ONGOING' : 'UPCOMING'
              }`,
            );
          }}
        />
      </div>
      <Card className="mt-2 w-full relative overflow-hidden">
        {(() => {
          if (events && events?.length > 0 && !isLoading) {
            return (
              <div
                className={`w-full ${
                  isLive ? 'h-[397px]' : 'h-[353px]'
                } relative overflow-hidden group/card`}
              >
                <img
                  src={event?.image_url}
                  className="w-full h-[160px] object-cover group-hover/card:scale-[1.10]"
                  style={{
                    transition: 'all 0.25s ease-in 0s',
                    animation: '0.15s ease-in 0s 1 normal both running fadeIn',
                  }}
                  alt={`${event?.name} Image`}
                />
                {!isLive && event?.conference_url && (
                  <div className="absolute z-10 flex top-0 left-4 right-4 bottom-40 justify-center items-center inset-0">
                    <Button
                      label={t('joinEvent')}
                      onClick={() => {
                        window.open(event.conference_url, '_blank');
                      }}
                      className="w-full bg-white text-white bg-opacity-20 border-white"
                    />
                  </div>
                )}
                <div
                  className={`absolute ${
                    isLive ? 'bg-primary-500' : 'bg-white border-neutral-200'
                  } z-10 gap-1 flex top-4 left-4 px-2.5 py-1 text-xs font-medium rounded`}
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
                    {isLive ? (
                      t('live')
                    ) : (
                      <TimeChip
                        startDate={startDate}
                        userTimeZone={userTimezone}
                      />
                    )}
                  </p>
                </div>
                <div className="absolute bg-white bottom-0 left-0 flex flex-col p-4 z-10 gap-2 w-full">
                  <div className="flex gap-1">
                    {event?.categories?.slice(0, 2)?.map((d: any) => (
                      <div
                        key={d?.id}
                        className="px-2 py-1 rounded bg-primary-100 text-center text-primary-500 text-xs font-medium"
                      >
                        {d?.title}
                      </div>
                    ))}
                    {event?.categories?.length > 2 && (
                      <div className="px-2 py-1 rounded bg-primary-100 text-center text-primary-500 text-xs font-medium">
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
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={event?.created_by?.full_name}
                      image={event?.created_by?.image_url}
                      size={32}
                    />
                    <div className="text-neutral-500 text-xs font-normal">
                      {event?.created_by?.full_name}
                    </div>
                    <div className="flex ml-auto gap-1 items-center">
                      <Icon
                        name={event.location ? 'location' : 'video'}
                        size={20}
                        color="text-primary-500"
                      />
                      <p className="text-xs text-neutral-500">
                        {event?.location || t('virtual')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AvatarList
                      size={32}
                      users={eventsAttendees || []}
                      moreCount={attendees?.data?.result?.total_records || 10}
                      className="-space-x-[12px]"
                      avatarClassName="!b-[1px]"
                    />
                    <div className="text-xs text-neutral-500 font-normal">
                      {t('moreAttendees')}
                    </div>
                  </div>
                  {isLive && event.conference_url && (
                    <Button
                      label={t('joinEvent')}
                      className="w-full"
                      onClick={() => {
                        window.open(event.conference_url, '_blank');
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
