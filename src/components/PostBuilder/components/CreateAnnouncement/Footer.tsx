import Button, { Variant as ButtonVariant } from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';
import { afterXUnit } from 'utils/time';
import { CreateAnnouncementMode } from '.';
import { useMutation } from '@tanstack/react-query';
import { IPost, updatePost } from 'queries/post';
import queryClient from 'utils/queryClient';

export interface IFooterProps {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  isValid: boolean;
  mode?: CreateAnnouncementMode;
  closeModal: () => void;
  data?: IPost;
  getFormValues?: any;
}

const Footer: React.FC<IFooterProps> = ({
  handleSubmit,
  isValid,
  mode,
  closeModal,
  data,
  getFormValues,
}) => {
  const { setAnnouncement, setActiveFlow, announcement } =
    useContext(CreatePostContext);

  const onSubmit = (data: any) => {
    setAnnouncement({
      label: data?.expityOption?.label || announcement?.label || '1 Week',
      value:
        data?.expityOption?.label === 'Custom Date'
          ? data?.date?.toISOString().substring(0, 19) + 'Z'
          : data?.expityOption?.value ||
            announcement?.value ||
            afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
    });
    setActiveFlow(CreatePostFlow.CreatePost);
  };

  const makePostAnnouncementMutation = useMutation({
    mutationKey: ['makePostAnnouncementMutation', data?.id],
    mutationFn: async () => {
      const formData = getFormValues();
      const fileIds = data?.files?.map((file: any) => file.id);
      if (data?.id)
        await updatePost(data?.id, {
          ...data,
          files: fileIds,
          isAnnouncement: true,
          announcement: {
            end:
              formData?.expityOption?.value ||
              afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
          },
        });
    },
    onError: () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries(['feed']);
      closeModal();
    },
  });
  return (
    <div>
      {mode === CreateAnnouncementMode.POST_BUILDER && (
        <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
          <Button
            variant={ButtonVariant.Secondary}
            label="Clear"
            onClick={() => {
              setAnnouncement(null);
              setActiveFlow(CreatePostFlow.CreatePost);
            }}
          />

          <div className="flex">
            <Button
              variant={ButtonVariant.Secondary}
              label="Back"
              className="mr-3"
              onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
              dataTestId="announcement-expiry-backcta"
            />
            <Button
              label={'Next'}
              onClick={handleSubmit(onSubmit)}
              dataTestId="announcement-expiry-nextcta"
              disabled={!isValid}
            />
          </div>
        </div>
      )}
      {mode === CreateAnnouncementMode.DIRECT && (
        <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
          <Button
            variant={ButtonVariant.Secondary}
            label="Cancel"
            className="mr-3"
            onClick={closeModal}
            dataTestId="promote-to-announcement-cancel"
          />
          <Button
            label={'Done'}
            loading={makePostAnnouncementMutation.isLoading}
            onClick={() => makePostAnnouncementMutation.mutate()}
            dataTestId="promote-to-announcement-done"
            disabled={!isValid}
          />
        </div>
      )}
    </div>
  );
};

export default Footer;
