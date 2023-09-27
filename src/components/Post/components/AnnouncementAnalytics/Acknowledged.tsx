import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import AvatarRowSkeleton from './AvatarRowSkeleton';
import AvatarRow from './AvatarRow';
import PageLoader from 'components/PageLoader';
import Button, { Variant } from 'components/Button';
import { useInfiniteAcknowledgements } from 'queries/post';

type AppProps = {
  post: Record<string, any>;
  closeModal: () => any;
};

const Acknowledged: FC<AppProps> = ({ post, closeModal }) => {
  const { ref, inView } = useInView();

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteAcknowledgements(post.id, { acknowledged: true });

  const usersData = data?.pages.flatMap((page) =>
    page?.data?.result?.data.map((user: any) => user),
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const completePercent = Math.round(
    (post?.acknowledgementStats?.acknowledged * 100) /
      post?.acknowledgementStats?.audience,
  );

  return (
    <div>
      <div className="w-full max-h-[480px] overflow-y-scroll px-6">
        <div className="flex justify-center items-center py-5 border-b">
          <div style={{ width: 64, height: 64 }}>
            <CircularProgressbarWithChildren
              value={completePercent || 0}
              className="center"
              strokeWidth={12}
              styles={buildStyles({
                // Text size
                textSize: '32px',
                // Colors
                pathColor: '#10b981',
                textColor: '#000000',
                trailColor: '#A3A3A3',
              })}
            >
              <div className="text-sm font-semibold">
                {completePercent || 0}%
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="ml-4">
            <div className="text-2xl text-primary-500 font-semibold">
              {post?.acknowledgementStats?.acknowledged} out of{' '}
              {post?.acknowledgementStats?.audience} people
            </div>
            <div className="text-sm text-neutral-900">
              marked this post as &apos;read&apos;
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
        <div className="flex justify-end">
          <Button
            label="Close"
            onClick={closeModal}
            variant={Variant.Secondary}
            dataTestId="acknowledgement-report-close"
          />
        </div>
      </div>
    </div>
  );
};

export default Acknowledged;
