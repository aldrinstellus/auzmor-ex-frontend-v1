import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Icon from 'components/Icon';
import ProgressBar from 'components/ProgressBar';
import Rating from 'components/Rating';
import React, { FC, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getLearnUrl, titleCase } from 'utils/misc';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { clsx } from 'clsx';
import Tooltip, { Variant } from 'components/Tooltip';
import { useTranslation } from 'react-i18next';

export enum LearnCardEnum {
  Course = 'COURSE',
  Event = 'EVENT',
  Path = 'PATH',
}

interface ILearnCardProps {
  showProgressInfo?: boolean;
  className?: string;
  data: Record<string, any>;
  isLoading?: boolean;
  medalPosition?: 'top' | 'bottom';
}

const LearnCard: FC<ILearnCardProps> = ({
  showProgressInfo = false,
  className = '',
  data,
  isLoading,
  medalPosition = 'top',
}) => {
  const { t } = useTranslation('learnWidget', { keyPrefix: 'learnCard' });

  const { user } = useAuth();
  const style = useMemo(
    () =>
      clsx({
        'w-full h-[350px] relative overflow-hidden group/card': true,
        [className]: true,
      }),
    [className],
  );
  const type = useMemo(() => {
    switch (data.type) {
      case 'LearningPath':
        return LearnCardEnum.Path;
      case 'Course':
        return LearnCardEnum.Course;
      case 'Event':
        return LearnCardEnum.Event;
      default:
        LearnCardEnum.Course;
    }
  }, [data]);

  const Categories: FC = () => {
    if (!data?.categories?.length) {
      return <></>;
    }
    return (
      <div className="flex gap-2">
        {data?.categories?.slice(0, 2)?.map((category: Record<string, any>) => (
          <div
            key={category?.id}
            className="flex px-2 py-1 rounded bg-white border border-white bg-opacity-10 border-opacity-20 max-w-[90px]"
          >
            <p className="text-xs font-medium truncate text-white">
              {category?.title}
            </p>
          </div>
        ))}
        {data?.categories?.length > 2 && (
          <div className="px-2 py-1 rounded bg-white border border-white flex bg-opacity-10 text-white border-opacity-20 text-xs font-medium">
            +{data?.categories?.length - 2}
          </div>
        )}
      </div>
    );
  };

  const getDuration = (sec: number) => {
    if (sec > 3600) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec / 3600 - h) * 60);
      return `${h} h ${m} m`;
    } else {
      const m = Math.floor(sec / 60);
      const s = Math.floor((sec / 60 - m) * 60);
      return `${m} m ${s} s`;
    }
  };

  if (isLoading) {
    return (
      <Card className={style}>
        <Skeleton className="w-full h-full" />
      </Card>
    );
  }

  const getEventDate = () => {
    return `${moment(data.additional_properties.start_date)
      .tz(user?.timezone || 'UTC')
      .format('MMM DD, YYYY')}`;
  };

  const getEventTime = () => {
    return `${moment(data.additional_properties.start_date)
      .tz(user?.timezone || 'UTC')
      .format('hh:mm a')}-${moment(data.additional_properties.end_date)
      .tz(user?.timezone || 'UTC')
      .format('hh:mm a')}`;
  };

  const handleCardClick = () => {
    switch (type) {
      case LearnCardEnum.Course:
        window.location.assign(
          `${getLearnUrl()}/user/courses/${data.id}/detail`,
        );
        break;
      case LearnCardEnum.Path:
        window.location.assign(`${getLearnUrl()}/user/paths/${data.id}/detail`);
        break;
      case LearnCardEnum.Event:
        window.location.assign(`${getLearnUrl()}/events/${data.id}`);
        break;
    }
  };

  const chaptersCount = data?.dependent_entities?.chapters_count;
  const coursesCount = data?.dependent_entities?.courses_count;

  return (
    <Card className={style} onClick={handleCardClick}>
      <img
        src={data?.image_url}
        className="w-full h-full object-cover group-hover/card:scale-[1.10] focus:scale-[1.10]"
        style={{
          transition: 'all 0.25s ease-in 0s',
          animation: '0.15s ease-in 0s 1 normal both running fadeIn',
        }}
        alt={`${data.title} Image`}
        aria-label={data?.title}
        tabIndex={0}
        onKeyUp={(e) => (e.code === 'Enter' ? handleCardClick() : '')}
      />
      <div
        className="cursor-pointer rounded-lg absolute"
        style={{
          color: 'rgba(0,0,0,.87)',
          boxSizing: 'inherit',
          background:
            'linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 55%, rgb(0, 0, 0) 100%)',
          inset: '0px',
          zIndex: 2,
        }}
      />
      <div className="absolute top-4 left-4 px-2.5 py-1 text-xs bg-primary-500 text-white font-medium rounded">
        {type === LearnCardEnum.Course && titleCase(LearnCardEnum.Course)}
        {type === LearnCardEnum.Event && titleCase(LearnCardEnum.Event)}
        {type === LearnCardEnum.Path && titleCase(LearnCardEnum.Path)}
      </div>
      {showProgressInfo && data?.my_enrollment?.due_in_x_days && (
        <div className="flex absolute top-4 right-4 px-2.5 py-1 bg-white rounded gap-1 items-center">
          <Icon name="menuBoard" size={18} color="text-neutral-900" />
          <p className="text-xs bg-white text-neutral-900 font-medium">
            {t('dueIn')}&nbsp;
            <span className="text-primary-500 font-semibold">
              {data?.my_enrollment?.due_in_x_days} {t('days')}
            </span>
          </p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 flex flex-col py-4 pl-4 z-10 gap-2 w-full">
        <Categories />
        {data?.average_rating && <Rating rating={data?.average_rating} />}
        <div className="flex-col gap-0.5">
          <div className="text-white font-bold text-base line-clamp-2">
            {data?.title}
          </div>
          {showProgressInfo &&
            data?.my_enrollment?.completed_percentage >= 0 && (
              <ProgressBar
                total={100}
                completed={data?.my_enrollment?.completed_percentage}
                customLabel={
                  <p className="text-white text-xs font-medium whitespace-nowrap">
                    {data?.my_enrollment?.completed_percentage}% completed
                  </p>
                }
                className="w-full"
                barClassName="!w-[162px]"
                barFilledClassName="!bg-primary-500"
              />
            )}
        </div>
        {type === LearnCardEnum.Course && chaptersCount > 0 && (
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <Icon
                name="videoSquare"
                size={16}
                color="text-white"
                hover={false}
              />
              <p className="text-xs text-white">
                {`${chaptersCount} ${
                  chaptersCount === 1 ? t('lesson') : t('lessons')
                }`}
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <Icon name="clock" size={16} color="text-white" hover={false} />
              <p className="text-xs text-white">
                {getDuration(data?.duration)}
              </p>
            </div>
          </div>
        )}

        {type === LearnCardEnum.Path && coursesCount > 0 && (
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <Icon name="teacher" size={16} color="text-white" hover={false} />
              <p className="text-xs text-white">{`${coursesCount} ${
                coursesCount === 1 ? t('course') : t('courses')
              }`}</p>
            </div>
            <div className="flex gap-1 items-center">
              <Icon name="clock" size={16} color="text-white" hover={false} />
              <p className="text-xs text-white">
                {getDuration(data?.duration)}
              </p>
            </div>
          </div>
        )}

        {type === LearnCardEnum.Event && (
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <Icon
                name="calendar"
                size={16}
                color="text-white"
                hover={false}
              />
              <p className="text-xs text-white">{getEventDate()}</p>
            </div>
            <div className="flex gap-1 items-center">
              <Icon name="clock" size={16} color="text-white" hover={false} />
              <p className="text-xs text-white">{getEventTime()}</p>
            </div>
          </div>
        )}

        {data?.my_enrollment?.assigned_by && (
          <div className="flex items-center gap-2">
            <Avatar
              name={
                data?.my_enrollment?.assigned_by?.display_name ||
                data?.my_enrollment?.assigned_by?.full_name ||
                data?.my_enrollment?.assigned_by?.first_name ||
                'U'
              }
              image={data?.my_enrollment?.assigned_by?.image_url}
              size={32}
              bgColor={data?.my_enrollment?.assigned_by?.profile_color}
            />
            <div className="flex-col gap-0.2">
              <div className="text-white text-sm font-medium">
                {data?.my_enrollment?.assigned_by?.display_name == user?.name
                  ? t('selfEnrolled')
                  : data?.my_enrollment?.assigned_by?.full_name ||
                    data?.my_enrollment?.assigned_by?.first_name ||
                    'User'}
              </div>
              {data?.my_enrollment?.assigned_by?.display_name ==
              user?.name ? null : (
                <div className="text-xs text-white font-light">
                  {t('assignedBy')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {data?.certificate && (
        <div
          className={`flex items-center justify-center h-5 w-5 absolute right-4 bg-primary-500 z-10 rounded cursor-pointer ${
            medalPosition === 'top' && 'top-4'
          } ${medalPosition === 'bottom' && 'bottom-4'}`}
        >
          <Tooltip
            tooltipContent={
              <div className="text-sm">{t('includesCertificate')}</div>
            }
            variant={Variant.Light}
            className="!shadow-md !rounded !z-[999] !p-1 border"
          >
            <Icon name="medalStar" size={14} color="text-white" hover={false} />
          </Tooltip>
        </div>
      )}
    </Card>
  );
};

export default LearnCard;
