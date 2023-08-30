import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteUsers } from 'queries/users';
import AvatarRowSkeleton from './AvatarRowSkeleton';
import AvatarRow from './AvatarRow';
import PageLoader from 'components/PageLoader';
import Button, { Variant } from 'components/Button';

type AppProps = {
  id: string;
  closeModal: () => any;
};

const Acknowledged: React.FC<AppProps> = ({ id, closeModal }) => {
  const { ref, inView } = useInView();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteUsers({});

  const usersData = data?.pages.flatMap((page) =>
    page?.data?.result?.data.map((user: any) => user),
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div>
      <div className="w-full max-h-[480px] overflow-y-scroll px-6">
        <div className="flex justify-center items-center py-5 border-b">
          <div style={{ width: 64, height: 64 }}>
            <CircularProgressbarWithChildren
              value={50}
              className="center"
              strokeWidth={12}
              styles={buildStyles({
                // Text size
                textSize: '32px',
                // Colors
                pathColor: '#FACA15',
                textColor: '#000000',
                trailColor: '#A3A3A3',
              })}
            >
              <div className="text-sm font-semibold">50%</div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="ml-4">
            <div className="text-2xl text-yellow-300 font-semibold">
              50 out of 100 people
            </div>
            <div className="text-sm text-neutral-900">
              did not acknowledge this post
            </div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <AvatarRowSkeleton />
          ) : (
            <div>
              {usersData?.map((user) => (
                <AvatarRow key={user.id} {...user} />
              ))}
            </div>
          )}
        </div>
        <div className="h-12 w-12">
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
        {isFetchingNextPage && <PageLoader />}
      </div>
      <div className="px-6 py-4 bg-blue-50">
        <div className="flex justify-end space-x-3">
          <Button
            label="Close"
            onClick={closeModal}
            variant={Variant.Secondary}
          />
          <Button label="Send reminder to all unread" />
        </div>
      </div>
    </div>
  );
};

export default Acknowledged;
