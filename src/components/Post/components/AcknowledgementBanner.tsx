import { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Button, { Size, Variant } from 'components/Button';
import Icon from 'components/Icon';
import { announcementRead } from 'queries/post';
import { useFeedStore } from 'stores/feedStore';
import { produce } from 'immer';
import useAuth from 'hooks/useAuth';
import ProgressBar from 'components/ProgressBar';
import { isRegularPost } from 'utils/misc';
import useRole from 'hooks/useRole';

export interface IAcknowledgementBannerProps {
  data: any;
  readOnly?: boolean;
}

const AcknowledgementBanner: FC<IAcknowledgementBannerProps> = ({
  data,
  readOnly = false,
}) => {
  const { t } = useTranslation('post', { keyPrefix: 'acknowledgementBanner' });
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const postCreatedByMe = user?.id === data?.createdBy?.userId;
  const announcementCreatedByMe =
    user?.id === data?.announcement?.actor?.userId;
  const currentDate = new Date().toISOString();

  const acknowledgeMutation = useMutation({
    mutationKey: ['acknowledge-announcement'],
    mutationFn: announcementRead,
    onMutate: (postId) => {
      const previousPost = getPost(postId);
      updateFeed(
        postId,
        produce(getPost(postId), (draft) => {
          if (draft) {
            draft.acknowledged = true;
          }
        }),
      );
      return { previousPost };
    },
    onError: (error, variables, context) =>
      updateFeed(context!.previousPost.id!, context!.previousPost!),
    onSuccess: async (_data, _variables, _context) => {
      await Promise.allSettled([
        queryClient.invalidateQueries(['feed-announcements-widget']),
        queryClient.invalidateQueries(['post-announcements-widget']),
        queryClient.invalidateQueries(['posts', data.id]),
        queryClient.invalidateQueries(['feed']),
      ]);
    },
  });

  return !isRegularPost(data, currentDate, isAdmin) ? (
    <div
      className={`flex justify-between items-center bg-secondary-500 px-6 py-2 rounded-t-9xl min-h-[42px]`}
      data-testid="announcement-header"
    >
      <div className="flex justify-center items-center text-white text-xs font-bold space-x-3">
        <Icon name="flashIcon" size={16} className="text-white" hover={false} />
        <div className="text-xs font-bold">{t('announcement')}</div>
      </div>
      {postCreatedByMe || announcementCreatedByMe || data?.acknowledged ? (
        <ProgressBar
          total={data?.acknowledgementStats?.audience}
          completed={data?.acknowledgementStats?.acknowledged}
          suffix={t('peopleAcknowledged')}
        />
      ) : (
        <Button
          className={`${!readOnly ? '' : 'hidden'} text-sm font-bold !py-[3px]`}
          label={t('markAsRead')}
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
