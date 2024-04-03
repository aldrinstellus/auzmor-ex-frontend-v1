import { FC, ReactElement } from 'react';
import AudienceRowSkeleton from './AudienceRowSkeleton';

const AudienceSkeleton: FC = (): ReactElement => {
  return (
    <div>
      {[...Array(4)].map((_value, index) => (
        <AudienceRowSkeleton key={index} />
      ))}
    </div>
  );
};

export default AudienceSkeleton;
