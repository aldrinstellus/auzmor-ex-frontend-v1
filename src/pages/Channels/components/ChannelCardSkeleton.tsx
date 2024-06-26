import React, { FC } from 'react';
import Card from 'components/Card';
import DefaultCoverImage from 'images/png/CoverImage.png';
import Skeleton from 'react-loading-skeleton';

interface IChannelCardSkeletonProps {}

const ChannelCardSkeleton: FC<IChannelCardSkeletonProps> = ({}) => {
  return (
    <Card className="w-full flex flex-col gap-2 relative">
      <div className="w-full h-[80px] bg-slate-500 rounded-t-9xl">
        <img
          className="object-cover h-full w-full rounded-t-9xl"
          src={DefaultCoverImage}
          alt="Channel Cover Image"
        />
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="flex w-full items-center gap-1">
          <Skeleton width={128} />
          <Skeleton width={16} />
        </div>
        <Skeleton />
        <Skeleton />
      </div>
      <Skeleton
        width={40}
        height={40}
        circle
        containerClassName="absolute left-4 top-[52px]"
      />
    </Card>
  );
};

export default ChannelCardSkeleton;
