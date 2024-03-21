import { clsx } from 'clsx';
import Button from 'components/Button';
import LearnCard from 'components/LearnCard';
import { useShouldRender } from 'hooks/useShouldRender';
import { useProgressTracker } from 'queries/learn';
import React, { FC, useMemo } from 'react';
import { getLearnUrl } from 'utils/misc';
import EmptyState from './EmptyState';

interface IProgressTrackerWidgetProps {
  className?: string;
}

const ID = 'ProgressTrackerWidget';

const ProgressTrackerWidget: FC<IProgressTrackerWidgetProps> = ({
  className = '',
}) => {
  const shouldRender = useShouldRender(ID);
  if (!shouldRender) {
    return <></>;
  }

  const { data, isLoading } = useProgressTracker();
  const trackerData = data?.data.result?.data || [];

  const style = useMemo(
    () => clsx({ 'min-w-[240px]': true, [className]: true }),
    [className],
  );

  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">Progress Tracker</div>
        <Button
          label={'View all'}
          className="bg-transparent !text-primary-500 hover:!text-primary-600 hover:!bg-transparent active:!bg-transparent active:!text-primary-700"
          onClick={() =>
            window.location.replace(
              `${getLearnUrl()}/user/trainings?type=elearning&tab=IN_PROGRESS`,
            )
          }
        />
      </div>
      <div className="mt-2">
        {!isLoading && !!!trackerData.length ? (
          <EmptyState />
        ) : (
          <LearnCard
            showProgressInfo
            data={{ ...trackerData[0] }}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressTrackerWidget;
