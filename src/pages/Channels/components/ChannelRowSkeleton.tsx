import Icon from 'components/Icon';
import IconWrapper, {
  Type as IconWrapperType,
} from 'components/Icon/components/IconWrapper';
import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

interface IChannelRowSkeletonProps {}

const ChannelRowSkeleton: FC<IChannelRowSkeletonProps> = ({}) => {
  return (
    <div className="flex items-center w-full px-6 gap-4">
      <Skeleton circle width={80} height={80} />
      <div className="flex grow">
        <div className="flex flex-col gap-0.5 grow">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <div className="flex gap-8 items-center">
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name="lock"
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <Skeleton width={64} />
            </div>
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name="people"
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <Skeleton width={64} />
            </div>
            <div className="flex gap-3 items-center">
              <IconWrapper
                type={IconWrapperType.Square}
                className="h-[24px] w-[24px]"
                dataTestId={`contact-info-edit`}
              >
                <Icon
                  name="chartOutline"
                  color="text-primary-500"
                  hover={false}
                  size={16}
                />
              </IconWrapper>
              <Skeleton width={64} />
            </div>
          </div>
        </div>
        <div className="flex items-end flex-col gap-3 grow">
          <Skeleton width={256} />
          <Skeleton width={256} />
        </div>
      </div>
    </div>
  );
};

export default ChannelRowSkeleton;
