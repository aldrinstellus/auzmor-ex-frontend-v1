import React, { useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmationBox from 'components/ConfirmationBox';
import { IPost, deletePost, updatePost } from 'queries/post';
import PostBuilder, { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import useRole from 'hooks/useRole';
import { isSubset } from 'utils/misc';
import { CreatePostFlow } from 'contexts/CreatePostContext';
import Modal from 'components/Modal';
import Divider from 'components/Divider';
import Button, { Variant } from 'components/Button';

export interface IFeedPostMenuProps {
  data: IPost;
}

const FeedPostMenu: React.FC<IFeedPostMenuProps> = ({ data }) => {
  const { user } = useAuth();
  const { isMember } = useRole();
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [removeAnnouncement, showRemoveAnnouncement, closeRemoveAnnouncement] =
    useModal();
  const [showModal, setShowModal] = useState(false);
  const [customActiveFlow, setCustomActiveFlow] = useState<CreatePostFlow>(
    CreatePostFlow.CreatePost,
  );

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationKey: ['deletePostMutation', data.id],
    mutationFn: deletePost,
    onError: (error) => console.log(error),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries(['feed']);
      await queryClient.invalidateQueries(['announcements-widget']);
      await queryClient.invalidateQueries(['my-profile-feed']);
      await queryClient.invalidateQueries(['people-profile-feed']);
      closeConfirm();
    },
  });

  const removeAnnouncementMutation = useMutation({
    mutationKey: ['removeAnnouncementMutation', data.id],
    mutationFn: async () => {
      const fileIds = data.files?.map((file: any) => file.id);
      const payload = {
        ...data,
        files: fileIds,
        isAnnouncement: false,
        announcement: {
          end: '',
        },
      };
      if (payload.id) await updatePost(payload.id, payload);
    },
    onError: (error) => console.log(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['feed']);
      closeRemoveAnnouncement();
    },
  });

  const { isLoading: removeAnnouncementLoading } = removeAnnouncementMutation;

  const postOptions = [
    {
      icon: 'cyclicArrow',
      label: 'Promote to announcement',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreateAnnouncement);
        setShowModal(true);
      },
      dataTestId: 'post-ellipsis-promote-announcement',
      permissions: ['CREATE_ANNOUNCEMENTS'],
      disabled: data.isAnnouncement,
    },
    {
      icon: 'editReceipt',
      label: 'Edit announcement',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreateAnnouncement);
        setShowModal(true);
      },
      dataTestId: 'post-ellipsis-edit-announcement',
      permissions: ['UPDATE_ANNOUNCEMENTS'],
      disabled: !data.isAnnouncement,
    },
    {
      icon: 'cyclicArrow',
      label: 'Change to regular post',
      onClick: () => showRemoveAnnouncement(),
      dataTestId: 'post-ellipsis-remove-announcement',
      permissions: ['UPDATE_ANNOUNCEMENTS'],
      disabled: !data.isAnnouncement,
    },
    {
      icon: 'edit',
      label: 'Edit post',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreatePost);
        setShowModal(true);
      },
      dataTestId: 'post-ellipsis-edit-post',
      permissions: ['UPDATE_MY_POSTS'],
      disabled: data.createdBy?.userId !== user?.id,
    },
    {
      icon: 'delete',
      label: 'Delete post',
      onClick: () => showConfirm(),
      dataTestId: 'post-ellipsis-delete-post',
      permissions: ['DELETE_MY_POSTS'],
      disabled: data.createdBy?.userId !== user?.id,
    },
  ].filter((menuItem) => {
    if (
      menuItem.permissions &&
      !isSubset(menuItem.permissions, user?.permissions) &&
      isMember
    ) {
      return false;
    }
    return true;
  });

  return postOptions.filter((postOption) => !postOption.disabled).length > 0 ? (
    <>
      <PopupMenu
        triggerNode={
          <div className="cursor-pointer p-2" data-testid="feed-post-ellipsis">
            <Icon name="more" />
          </div>
        }
        menuItems={postOptions}
      />
      {showModal && (
        <PostBuilder
          data={data}
          showModal={showModal}
          setShowModal={() => setShowModal(false)}
          mode={PostBuilderMode.Edit}
          customActiveFlow={customActiveFlow}
        />
      )}
      <ConfirmationBox
        open={confirm}
        onClose={closeConfirm}
        title="Delete"
        description={
          <span>
            Are you sure you want to delete this post?
            <br /> This cannot be undone.
          </span>
        }
        success={{
          label: 'Delete',
          className: 'bg-red-500 text-white ',
          onSubmit: async () => {
            deletePostMutation.mutate(data?.id || '');
            await queryClient.invalidateQueries(['feed']);
            await queryClient.invalidateQueries(['announcements-widget']);
          },
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
        isLoading={deletePostMutation.isLoading}
      />
      <Modal open={removeAnnouncement} className="w-max">
        <div className="flex items-center justify-between p-4">
          <p className="font-bold text-lg text-gray-900">
            Change to regular post?
          </p>
          <Icon
            name="close"
            onClick={closeRemoveAnnouncement}
            disabled={true}
          />
        </div>
        <Divider />
        <div className="flex flex-col gap-y-4 items-center justify-center text-neutral-900 text-base p-6">
          <Icon name="infoCircle" stroke="#3F83F8" size={66} disabled={true} />
          <p className="font-semibold">
            Are you sure you want to change this announcement to a regular post?
          </p>
          <p>
            You can change it back to announcements by clicking on promote to
            announcements
          </p>
        </div>
        <div className="flex min-w-full items-center justify-end gap-x-3 p-4 bg-blue-50">
          <Button
            variant={Variant.Secondary}
            label="Cancel"
            onClick={closeRemoveAnnouncement}
          />
          <Button
            variant={Variant.Primary}
            label="Yes"
            onClick={() => removeAnnouncementMutation.mutate()}
            loading={removeAnnouncementLoading}
          />
        </div>
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default FeedPostMenu;
