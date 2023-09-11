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
import { useInfiniteAcknowledgements } from 'queries/post';
import { useMutation } from '@tanstack/react-query';
import { createNewJob } from 'queries/job';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';

type AppProps = {
  post: Record<string, any>;
  closeModal: () => any;
};

const Pending: React.FC<AppProps> = ({ post, closeModal }) => {
  const { ref, inView } = useInView();

  const reminderMutation = useMutation(
    () =>
      createNewJob({
        type: 'ACKNOWLEDGEMENT_REMINDER',
        postId: post.id,
      }),
    {
      onError: () => {},
      onSuccess: () => {
        toast(
          <SuccessToast content={'Reminder has been sent to all unreads'} />,
          {
            closeButton: (
              <Icon
                name="closeCircleOutline"
                color="text-primary-500"
                size={20}
              />
            ),
            style: {
              border: `1px solid ${twConfig.theme.colors.primary['300']}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            },
            autoClose: TOAST_AUTOCLOSE_TIME,
            transition: slideInAndOutTop,
            theme: 'dark',
          },
        );
        closeModal();
      },
    },
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteAcknowledgements(post.id, { acknowledged: false });

  const usersData = data?.pages.flatMap((page) =>
    page?.data?.result?.data.map((user: any) => user),
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const pendingPercent =
    Math.ceil(
      post?.acknowledgementStats?.pending /
        post?.acknowledgementStats?.audience,
    ) * 100;

  return (
    <div>
      <div className="w-full max-h-[480px] overflow-y-scroll px-6">
        <div className="flex justify-center items-center py-5 border-b">
          <div style={{ width: 64, height: 64 }}>
            <CircularProgressbarWithChildren
              value={pendingPercent}
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
              <div className="text-sm font-semibold">{pendingPercent}%</div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="ml-4">
            <div className="text-2xl text-yellow-300 font-semibold">
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
          />
        </div>
      </div>
    </div>
  );
};

export default Pending;
