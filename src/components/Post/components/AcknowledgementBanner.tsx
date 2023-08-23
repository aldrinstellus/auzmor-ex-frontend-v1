import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import { announcementRead } from 'queries/post';
import React from 'react';
import { useFeedStore } from 'stores/feedStore';
import { hasDatePassed } from 'utils/time';
import { produce } from 'immer';
import useAuth from 'hooks/useAuth';

export interface IAcknowledgementBannerProps {
  data: any;
}

const AcknowledgementBanner: React.FC<IAcknowledgementBannerProps> = ({
  data,
}) => {
  const { feed, updateFeed } = useFeedStore();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAnnouncement = data?.isAnnouncement;

  const hasLoggedInUserCreatedAnnouncement =
    user?.id === data?.announcement?.actor?.userId;

  const acknowledgeMutation = useMutation({
    mutationKey: ['acknowledge-announcement'],
    mutationFn: announcementRead,
    onMutate: (postId) => {
      const previousPost = feed[postId];
      updateFeed(
        postId,
        produce(feed[postId], (draft) => {
          (draft.announcement = { end: '' }), (draft.isAnnouncement = false);
        }),
      );
      return { previousPost };
    },
    onError: (error, variables, context) =>
      updateFeed(context!.previousPost.id!, context!.previousPost!),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
    },
  });

  return (
    <div>
      {isAnnouncement &&
        !(data?.acknowledged || hasDatePassed(data?.announcement?.end)) && (
          <div
            className={`flex justify-between items-center bg-blue-700 px-6 py-2 rounded-t-9xl min-h-[42px]`}
            data-testid="announcement-header"
          >
            <div className="flex justify-center items-center text-white text-xs font-bold space-x-3">
              <Icon name="flashIcon" size={16} stroke="#fff" />
              <div className="text-xs font-bold">Announcement</div>
            </div>
            {!hasLoggedInUserCreatedAnnouncement && (
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
        )}
    </div>
  );
};

export default AcknowledgementBanner;
