import { clsx } from 'clsx';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import ProgressBar from 'components/ProgressBar';
import Rating from 'components/Rating';
import { useShouldRender } from 'hooks/useShouldRender';
import React, { FC, useMemo } from 'react';

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
        />
      </div>
      <div className="mt-2">
        <Card className="w-full relative h-[350px] overflow-hidden group/card">
          <>
            <img
              src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXw0MjYwN3wwfDF8c2VhcmNofDJ8fFNvZnR3YXJlfGVufDB8fHw&ixlib=rb-1.2.1&q=80&w=1080"
              className="w-full h-[350px] object-cover group-hover/card:scale-[1.10]"
              style={{
                transition: 'all 0.25s ease-in 0s',
                animation: '0.15s ease-in 0s 1 normal both running fadeIn',
              }}
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
            <div className="absolute top-4 left-4 px-2.5 py-1 text-xs bg-black text-white font-medium rounded">
              Course
            </div>
            <div className="flex absolute top-4 right-4 px-2.5 py-1 bg-white rounded gap-1 items-center">
              <Icon name="menuBoard" size={18} color="text-neutral-900" />
              <p className="text-xs bg-white text-neutral-900 font-medium">
                Due in &nbsp;
                <span className="text-primary-500 font-semibold">9 days</span>
              </p>
            </div>
            <div className="absolute bottom-0 left-0 flex flex-col p-4 z-10 gap-2 w-full">
              <div className="flex">
                <div className="px-2 py-1 rounded bg-white border border-white flex bg-opacity-10 text-white border-opacity-20 text-xs font-medium">
                  Analytics
                </div>
              </div>
              <Rating rating={4.5} />
              <div className="flex-col gap-0.5">
                <div className="text-white font-bold text-base">
                  Cancer Hope Network: The Machine Helps to Cure Disease
                </div>
                <p className="text-xxs font-medium text-white">
                  2 out of 3 chapters left
                </p>
                <ProgressBar
                  total={100}
                  completed={80}
                  customLabel={
                    <p className="text-white text-xs font-medium whitespace-nowrap">
                      80% completed
                    </p>
                  }
                  className="w-full"
                  barClassName="w-[162px]"
                  barFilledClassName="!bg-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <Icon name="clock" size={16} color="text-white" />
                  <p className="text-xs text-white">3 Lessons</p>
                </div>
                <div className="flex gap-1 items-center">
                  <Icon name="clock" size={16} color="text-white" />
                  <p className="text-xs text-white">5 h 53 m</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar
                  name={'Name'}
                  image={`https://avatars.githubusercontent.com/u/25411520?v=4`}
                  size={32}
                />
                <div className="flex-col gap-0.2">
                  <div className="text-white text-sm font-medium">Name</div>
                  <div className="text-xs text-white font-light">
                    Assigned by
                  </div>
                </div>
              </div>
            </div>
          </>
        </Card>
      </div>
    </div>
  );
};

export default ProgressTrackerWidget;
