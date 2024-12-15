import Button, { Variant as ButtonVariant } from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import { FC, useContext } from 'react';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';
import { afterXUnit } from 'utils/time';
import { CreateAnnouncementMode } from '.';
import { useMutation } from '@tanstack/react-query';
import { IPost, PostType } from 'interfaces';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { useFeedStore } from 'stores/feedStore';
import { produce } from 'immer';
import useAuth from 'hooks/useAuth';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

export interface IFooterProps {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  isValid: boolean;
  mode?: CreateAnnouncementMode;
  closeModal: () => void;
  data?: IPost;
  getFormValues?: any;
}

const Footer: FC<IFooterProps> = ({
  handleSubmit,
  isValid,
  mode,
  closeModal,
  data,
}) => {
  const { getApi } = usePermissions();
  const preIsAnnouncement = data?.isAnnouncement;
  const getPost = useFeedStore((state) => state.getPost);
  const updateFeed = useFeedStore((state) => state.updateFeed);
  const { setAnnouncement, setActiveFlow, announcement } =
    useContext(CreatePostContext);
  const { user } = useAuth();
  const { t } = useTranslation('postBuilder', {
    keyPrefix: 'createAnnouncement',
  });
  const getSelectedAnnouncement = (data: any) => {
    return {
      label: data?.expiryOption?.label || announcement?.label || '1 Week',
      value:
        data?.expiryOption?.label === 'Custom Date'
          ? data?.date?.toISOString().substring(0, 19) + 'Z'
          : data?.expiryOption?.value ||
            announcement?.value ||
            afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
    };
  };

  const onSubmit = (data: any) => {
    setAnnouncement(getSelectedAnnouncement(data));
    setActiveFlow(CreatePostFlow.CreatePost);
  };

  const onDirectSubmit = (data: any) => {
    makePostAnnouncementMutation.mutate(getSelectedAnnouncement(data).value);
  };

  const markAsAnnouncement = getApi(ApiEnum.MarkAsAnnouncement);
  const makePostAnnouncementMutation = useMutation({
    mutationKey: ['makePostAnnouncementMutation', data?.id],
    mutationFn: (endDate: string) => {
      return markAsAnnouncement(data!.id!, {
        ...data,
        type: data?.type || PostType.Update,
        isAnnouncement: true,
        announcement: {
          end: endDate,
        },
      });
    },
    onMutate: (endDate) => {
      const previousPost = getPost(data!.id!);
      if (data?.id) {
        updateFeed(
          data.id,
          produce(previousPost, (draft) => {
            (draft.announcement = {
              actor: {
                userId: user?.id,
                ...user,
              },
              end: endDate,
            }),
              (draft.isAnnouncement = true),
              (draft.acknowledged = false);
          }),
        );
      }
      return { previousPost };
    },
    onError: (_error, _variables, context) => {
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
    onSuccess: async (res: any) => {
      const data = res?.result?.data;
      if (data?.id) {
        updateFeed(
          data.id,
          produce(getPost(data!.id || ''), (draft) => {
            draft.acknowledgementStats = data?.acknowledgementStats || {};
          }),
        );
      }

      successToastConfig({
        content: preIsAnnouncement
          ? t('announcementUpdatedSuccess')
          : t('announcementSharedSuccess'),
        dataTestId: isEmpty(data.announcement)
          ? 'convert-to-announcement-toast'
          : 'announcement-updated-toast',
      });
      closeModal();
      await Promise.allSettled([
        queryClient.invalidateQueries(['feed-announcements-widget']),
        queryClient.invalidateQueries(['post-announcements-widget'])
      ]);
    },
  });
  return (
    <div>
      {mode === CreateAnnouncementMode.POST_BUILDER && (
        <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            variant={ButtonVariant.Secondary}
            label={t('clear')}
            onClick={() => {
              setAnnouncement(null);
              setActiveFlow(CreatePostFlow.CreatePost);
            }}
          />

          <div className="flex">
            <Button
              variant={ButtonVariant.Secondary}
              label={t('back')}
              className="mr-3"
              onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
              dataTestId="announcement-expiry-backcta"
            />
            <Button
              label={t('next')}
              onClick={handleSubmit(onSubmit)}
              dataTestId="announcement-expiry-nextcta"
              disabled={!isValid}
            />
          </div>
        </div>
      )}
      {mode === CreateAnnouncementMode.DIRECT && (
        <div className="flex justify-between items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            variant={ButtonVariant.Secondary}
            label={t('cancel')}
            className="mr-3"
            onClick={closeModal}
            dataTestId="promote-to-announcement-cancel"
          />
          <Button
            label={t('done')}
            loading={makePostAnnouncementMutation.isLoading}
            onClick={handleSubmit(onDirectSubmit)}
            dataTestId="promote-to-announcement-done"
            disabled={!isValid}
          />
        </div>
      )}
    </div>
  );
};

export default Footer;
