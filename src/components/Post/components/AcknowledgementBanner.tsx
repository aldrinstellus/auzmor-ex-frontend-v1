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
    onMutate: (variables) => {
      const previousPost = feed[variables.entityId];
      updateFeed(
        variables.entityId,
        produce(feed[variables.entityId], (draft) => {
          (draft.announcement = { end: '' }), (draft.isAnnouncement = false);
        }),
      );
      return { previousPost };
    },
    onError: (error, variables, context) =>
      updateFeed(context!.previousPost.id!, context!.previousPost!),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries(['announcements-widget']);
    },
  });

  return (
    <div>
      {isAnnouncement &&
        !(
          data?.myAcknowledgement?.reaction === 'mark_read' ||
          hasDatePassed(data?.announcement?.end)
        ) && (
          <div
            className={`flex justify-between items-center bg-blue-700 -mb-4 ${
              hasLoggedInUserCreatedAnnouncement ? 'p-3' : 'p-2'
            } rounded-t-9xl`}
            data-testid="announcement-header"
          >
            <div className="flex justify-center items-center text-white text-xs font-bold pl-1">
              <Icon name="flashIcon" />
              <div className="text-sm font-bold">Announcement</div>
            </div>
            {!hasLoggedInUserCreatedAnnouncement && (
              <Button
                className="text-sm font-bold"
                label={'Mark as read'}
                size={Size.Small}
                variant={Variant.Tertiary}
                loading={acknowledgeMutation.isLoading}
                onClick={() => {
                  acknowledgeMutation.mutate({
                    entityId: data?.id,
                    entityType: 'post',
                    type: 'acknowledge',
                    reaction: 'mark_read',
                  });
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
