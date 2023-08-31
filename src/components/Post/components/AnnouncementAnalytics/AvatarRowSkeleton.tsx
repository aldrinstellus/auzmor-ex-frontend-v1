import Avatar from 'components/Avatar';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

type AppProps = {
  count?: number;
};

const AvatarRowSkeleton: React.FC<AppProps> = ({ count = 4 }) => {
  const renderLoaderRow = () => (
    <div className="flex justify-between py-4">
      <div className="flex items-center space-x-4">
        <Skeleton width={32} height={32} className="rounded-full" circle />
        <Skeleton height={32} width={200} />
      </div>
      <div>
        <Skeleton height={20} width={140} />
      </div>
      <div>
        <Skeleton height={20} width={140} />
      </div>
    </div>
  );

  return (
    <div>
      {Array(count)
        .fill(null)
        .map((_, idx) => (
          <div key={idx}>{renderLoaderRow()}</div>
        ))}
    </div>
  );
};

export default AvatarRowSkeleton;
