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
import { useMutation } from '@tanstack/react-query';
import { createNewJob } from 'queries/job';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useFeedStore } from 'stores/feedStore';

type AppProps = {
  postId: string;
  closeModal: () => any;
};

const Pending: FC<AppProps> = ({ postId, closeModal }) => {
  const { ref, inView } = useInView();
  const updatePost = useFeedStore((state) => state.updateFeed);
  const post = useFeedStore((state) => state.getPost)(postId);

  const reminderMutation = useMutation(
    () =>
      createNewJob({
        type: 'ACKNOWLEDGEMENT_REMINDER',
        postId: post.id,
      }),
    {
      onError: () => {},
      onSuccess: () => {
        successToastConfig({
          content: 'Reminder has been sent to all unreads',
          dataTestId: 'acknowledgement-reminder-toast-message',
        });
        closeModal();
      },
    },
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteAcknowledgements(post.id, { acknowledged: false }, (data) =>
      updatePost(post.id, {
        ...post,
        acknowledgementStats: {
          ...post.acknowledgementStats,
          pending: data?.pages.flatMap((page: any) =>
            page?.data?.result?.data.map((user: any) => user),
          ).length,
        },
      }),
    );

  const usersData = data?.pages.flatMap((page) =>
    page?.data?.result?.data.map((user: any) => user),
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const pendingPercent = Math.round(
    (post?.acknowledgementStats?.pending * 100) /
      post?.acknowledgementStats?.audience,
  );

  return (
    <div>
      <div className="w-full max-h-[480px] overflow-y-scroll px-6">
        <div className="flex justify-center items-center py-5 border-b">
          <div style={{ width: 64, height: 64 }}>
            <CircularProgressbarWithChildren
              value={pendingPercent || 0}
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
              <div className="text-sm font-semibold">
                {pendingPercent || 0}%
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="ml-4">
            <div
              className="text-2xl text-yellow-300 font-semibold"
              data-testid="acknowledge-pending-count"
            >
              {post?.acknowledgementStats?.pending} out of{' '}
              {post?.acknowledgementStats?.audience} people
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
            dataTestId="acknowledgement-report-close"
            disabled={reminderMutation.isLoading}
          />
          <Button
            label="Send reminder to all unread"
            dataTestId="acknowledgement-send-reminder"
            loading={reminderMutation.isLoading}
            onClick={() => reminderMutation.mutate()}
            disabled={pendingPercent === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Pending;
