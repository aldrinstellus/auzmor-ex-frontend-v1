import React, { FC } from 'react';
import Tracker from 'images/tracker.svg';
import Card from 'components/Card';

interface IEmptyStateProps {}

const EmptyState: FC<IEmptyStateProps> = ({}) => {
  return (
    <Card className="flex flex-col w-full py-9 items-center gap-4">
      <img src={Tracker} className="opacity-75" />
      <p className="text-base font-bold text-neutral-900 text-center">
        You’re all caught up
      </p>
      <p className="text-neutral-500 text-xs">No training in progress</p>
    </Card>
  );
};

export default EmptyState;
