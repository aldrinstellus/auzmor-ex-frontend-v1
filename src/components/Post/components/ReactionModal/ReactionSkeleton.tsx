import { FC, ReactElement } from 'react';
import ReactionRowSkeleton from './ReactionRowSkeleton';

const ReactionSkeleton: FC = (): ReactElement => {
  return (
    <div>
      {[...Array(4)].map((_value, index) => (
        <ReactionRowSkeleton key={index} />
      ))}
    </div>
  );
};

export default ReactionSkeleton;
