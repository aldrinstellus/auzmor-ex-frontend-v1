import { clsx } from 'clsx';
import Button from 'components/Button';
import Card from 'components/Card';
import LearnCard from 'components/LearnCard';
import { useShouldRender } from 'hooks/useShouldRender';
import { useProgressTracker } from 'queries/learn';
import React, { FC, useMemo } from 'react';
import { getLearnUrl } from 'utils/misc';
import Tracker from 'images/tracker.svg';

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
        <div className="text-base font-bold">Progress tracker</div>
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
          <Card className="flex flex-col w-full h-[264px] py-6 items-center gap-4">
            <p className="text-base font-bold text-neutral-900">
              Progress tracking
            </p>
            <div className="flex flex-col items-center gap-5">
              <img src={Tracker} className="opacity-75" />
              <p className="text-neutral-500 text-xs">
                Your can track your course, path success here
              </p>
            </div>
          </Card>
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
