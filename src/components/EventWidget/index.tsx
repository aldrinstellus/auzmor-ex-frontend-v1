import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import { formatDate } from 'components/CelebrationWidget/utils';
import Icon from 'components/Icon';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
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
import useAuth from 'hooks/useAuth';
import { FRONTEND_VIEWS } from 'interfaces';

export interface IEventWidgetProps {
  className?: string;
}

const EventWidget: FC<IEventWidgetProps> = ({ className = '' }) => {
  const { currentTimezone } = useCurrentTimezone();
  const { t } = useTranslation('learnWidget', { keyPrefix: 'eventWidget' });
  const { getApi } = usePermissions();
  const { user } = useAuth();

  let isLive = true;
  const style = useMemo(
    () => clsx({ 'min-w-[240px]': true, [className]: true }),
    [className],
  );
  const useInfiniteEvents = getApi(ApiEnum.GetEvents);
  const { data: ongoingEvents, isLoading: isLoadingOngoing } =
    useInfiniteEvents({
      q: {
        filter: 'ONGOING',
        status: 'PUBLISHED',
        limit: 1,
        page: 1,
        sort: '-start_date',
      },
    });
  const { data: upcomingEvents, isLoading: isLoadingUpcoming } =
    useInfiniteEvents({
      q: {
        filter: 'UPCOMING',
        status: 'PUBLISHED',
        limit: 1,
        page: 1,
        sort: '-start_date',
      },
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
  const eventSession = events?.[0];
  const userTimezone = currentTimezone || 'Asia/Kolkata';
  const startDate = eventSession?.start_date;
  const endDate = eventSession?.end_date;

  const assignedBy = eventSession?.my_enrollment?.assigned_by;

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
            if (user?.preferences?.learnerViewType === FRONTEND_VIEWS.modern)
              window.location.assign(
                `${getLearnUrl()}/user/trainings?type=events&tab=${
                  isLive ? 'ONGOING' : 'UPCOMING'
                }`,
              );
            else
              window.location.assign(
                `${getLearnUrl()}/user/events/${
                  isLive ? 'ongoing' : 'upcoming'
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
                  src={eventSession?.event?.image_url}
                  className="w-full h-[160px] object-cover group-hover/card:scale-[1.10]"
                  style={{
                    transition: 'all 0.25s ease-in 0s',
                    animation: '0.15s ease-in 0s 1 normal both running fadeIn',
                  }}
                  alt={`${eventSession?.event?.title} Image`}
                />
                {!isLive && eventSession?.conference_url && (
                  <div className="absolute z-10 flex top-0 left-4 right-4 bottom-40 justify-center items-center inset-0">
                    <Button
                      label={t('joinEvent')}
                      onClick={() => {
                        window.open(eventSession.conference_url, '_blank');
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
                    {eventSession?.categories?.slice(0, 2)?.map((d: any) => (
                      <div
                        key={d?.id}
                        className="px-2 py-1 rounded bg-primary-100 text-center text-primary-500 text-xs font-medium"
                      >
                        {d?.title}
                      </div>
                    ))}
                    {eventSession?.categories?.length > 2 && (
                      <div className="px-2 py-1 rounded bg-primary-100 text-center text-primary-500 text-xs font-medium">
                        +{eventSession?.categories?.length - 2}
                      </div>
                    )}
                  </div>
                  <div className="text-neutral-900 font-semibold text-base">
                    {eventSession?.event?.title}
                  </div>
                  <div className="flex gap-1 items-center">
                    <Icon name="session" size={16} color="text-primary-500" />
                    <p className="flex gap-1 text-xs text-neutral-900">
                      <span className="font-semibold">{t('session')}</span>
                      {eventSession.title}
                    </p>
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
                      name={
                        assignedBy?.display_name ||
                        assignedBy?.full_name ||
                        assignedBy?.first_name ||
                        'U'
                      }
                      image={assignedBy?.image_url}
                      size={32}
                      bgColor={assignedBy?.profile_color}
                    />
                    <div className="text-neutral-500 text-xs font-normal">
                      {assignedBy?.id == user?.id
                        ? t('selfEnrolled')
                        : assignedBy?.display_name ||
                          assignedBy?.full_name ||
                          assignedBy.first_name}
                    </div>
                    <div className="flex ml-auto gap-1 items-center">
                      <Icon
                        name={eventSession?.location ? 'location' : 'video'}
                        size={20}
                        color="text-primary-500"
                      />
                      <p className="text-xs text-neutral-500">
                        {eventSession?.location || t('virtual')}
                      </p>
                    </div>
                  </div>
                  {eventSession?.stats?.enrollments === 1 ? (
                    <div className="flex items-center text-sm text-neutral-500 font-normal">
                      {t('onlyAttendee')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AvatarList
                        size={32}
                        users={[
                          {
                            id: user?.id,
                            name: user?.name,
                            image: user?.profileImage,
                          },
                        ]}
                        display={1}
                        moreCount={eventSession?.stats?.enrollments}
                        className="-space-x-[12px]"
                        avatarClassName="!b-[1px]"
                      />
                      <div className="text-xs text-neutral-500 font-normal">
                        {t('moreAttendees')}
                      </div>
                    </div>
                  )}
                  {isLive && eventSession?.conference_url && (
                    <Button
                      label={t('joinEvent')}
                      className="w-full"
                      onClick={() => {
                        window.open(eventSession?.conference_url, '_blank');
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
