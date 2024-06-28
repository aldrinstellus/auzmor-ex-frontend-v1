import Birthday from 'images/Birthday.svg';
import WorkAnniversary from 'images/Workanniversary.svg';
import { CELEBRATION_TYPE } from '..';
import { FC } from 'react';

interface EmptyStateProps {
  type: CELEBRATION_TYPE;
}

const EmptyState: FC<EmptyStateProps> = ({ type }) => {
  const image = type === CELEBRATION_TYPE.Birthday ? Birthday : WorkAnniversary;
  const label =
    type === CELEBRATION_TYPE.Birthday
      ? 'Upcoming birthdays will show here'
      : 'Upcoming work anniversaries will show here';
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={image} height={150} alt="Celebration Picture" />
      <p className="text-xs leading-normal font-semibold text-neutral-500 text-center">
        {label}
      </p>
    </div>
  );
};

export default EmptyState;
