import React, { FC } from 'react';
import Tracker from 'images/tracker.svg';
import Card from 'components/Card';

interface IEmptyStateProps {}

const EmptyState: FC<IEmptyStateProps> = ({}) => {
  return (
    <Card className="flex flex-col w-full h-[264px] py-6 items-center gap-4">
      <img src={Tracker} className="opacity-75" />
      <p className="text-base font-bold text-neutral-900 text-center">
        Great job! <br /> You have no pending tasks
      </p>
      <p className="text-neutral-500 text-xs">
        Your can track your course, path success here
      </p>
    </Card>
  );
};

export default EmptyState;
