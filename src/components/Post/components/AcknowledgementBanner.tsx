import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import { announcementRead } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { hasDatePassed } from 'utils/time';
import { produce } from 'immer';
import useAuth from 'hooks/useAuth';
import ProgressBar from 'components/ProgressBar';
import { FC } from 'react';

export interface IAcknowledgementBannerProps {
  data: any;
}

const AcknowledgementBanner: FC<IAcknowledgementBannerProps> = ({ data }) => {
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAnnouncement = data?.isAnnouncement;

  const createdByMe = user?.id === data?.announcement?.actor?.userId;

  const acknowledgeMutation = useMutation({
    mutationKey: ['acknowledge-announcement'],
    mutationFn: announcementRead,
    onMutate: (postId) => {
      const previousPost = getPost(postId);
      updateFeed(
        postId,
        produce(getPost(postId), (draft) => {
          (draft.announcement = { end: '' }),
            (draft.isAnnouncement = false),
            (draft.acknowledged = true);
        }),
      );
      return { previousPost };
    },
    onError: (error, variables, context) =>
      updateFeed(context!.previousPost.id!, context!.previousPost!),
    onSuccess: async (_data, _variables, _context) => {
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
    },
  });

  return isAnnouncement &&
    !(data?.acknowledged || hasDatePassed(data?.announcement?.end)) ? (
    <div
      className={`flex justify-between items-center bg-blue-700 px-6 py-2 rounded-t-9xl min-h-[42px]`}
      data-testid="announcement-header"
    >
      <div className="flex justify-center items-center text-white text-xs font-bold space-x-3">
        <Icon name="flashIcon" size={16} className="text-white" hover={false} />
        <div className="text-xs font-bold">Announcement</div>
      </div>
      {createdByMe ? (
        <ProgressBar
          total={data?.acknowledgementStats?.audience}
          completed={data?.acknowledgementStats?.acknowledged}
          suffix="people acknowledged"
        />
      ) : (
        <Button
          className="text-sm font-bold !py-[3px]"
          label="Mark as read"
          size={Size.Small}
          variant={Variant.Tertiary}
          loading={acknowledgeMutation.isLoading}
          onClick={() => {
            acknowledgeMutation.mutate(data?.id);
          }}
          dataTestId="announcment-markasreadcta"
        />
      )}
    </div>
  ) : (
    <></>
  );
};
export default AcknowledgementBanner;
