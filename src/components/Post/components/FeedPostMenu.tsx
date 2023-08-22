import React, { useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmationBox from 'components/ConfirmationBox';
import { IPost, IPostPayload, deletePost, updatePost } from 'queries/post';
import PostBuilder, { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import useRole from 'hooks/useRole';
import { canPerform, isSubset, twConfig } from 'utils/misc';
import { useFeedStore } from 'stores/feedStore';
import _ from 'lodash';
import { CreatePostFlow } from 'contexts/CreatePostContext';
import Modal from 'components/Modal';
import Divider from 'components/Divider';
import Button, { Variant } from 'components/Button';
import { produce } from 'immer';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';

export interface IFeedPostMenuProps {
  data: IPost;
}

const FeedPostMenu: React.FC<IFeedPostMenuProps> = ({ data }) => {
  const { user } = useAuth();
  const { isMember } = useRole();
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [removeAnnouncement, showRemoveAnnouncement, closeRemoveAnnouncement] =
    useModal();
  const [open, openModal, closeModal] = useModal(undefined, false);
  const [customActiveFlow, setCustomActiveFlow] = useState<CreatePostFlow>(
    CreatePostFlow.CreatePost,
  );

  const queryClient = useQueryClient();
  const { feed, setFeed, updateFeed } = useFeedStore();
  const { isAdmin } = useRole();

  const deletePostMutation = useMutation({
    mutationKey: ['deletePostMutation', data.id],
    mutationFn: deletePost,
    onMutate: (variables) => {
      const previousFeed = feed;
      setFeed({ ..._.omit(feed, [variables]) });
      closeConfirm();
      return { previousFeed };
    },
    onError: (error, variables, context) => {
      toast(
        <FailureToast
          content="Error deleting post"
          dataTestId="post-delete-toaster-failure"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.red['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.red['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
      if (context?.previousFeed) {
        setFeed(context?.previousFeed);
      }
    },
    onSuccess: async (data, variables, context) => {
      toast(
        <SuccessToast
          content="Post deleted successfully"
          dataTestId="post-delete-toaster-success"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
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
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
      await queryClient.invalidateQueries(['my-bookmarks']);
    },
  });

  const removeAnnouncementMutation = useMutation({
    mutationKey: ['removeAnnouncementMutation', data.id],
    mutationFn: (payload: IPostPayload) =>
      updatePost(payload.id || '', payload),
    onMutate: (variables) => {
      const previousPost = feed[variables.id!];
      updateFeed(
        variables.id!,
        produce(feed[variables.id!], (draft) => {
          (draft.announcement = { end: '' }), (draft.isAnnouncement = false);
        }),
      );
      closeRemoveAnnouncement();
      return { previousPost };
    },
    onError: (error, variables, context) => {
      updateFeed(context!.previousPost.id!, context!.previousPost!);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
    },
  });

  const { isLoading: removeAnnouncementLoading } = removeAnnouncementMutation;

  const allOptions = [
    {
      icon: 'cyclicArrow',
      label: 'Promote to announcement',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreateAnnouncement);
        openModal();
      },
      dataTestId: 'post-ellipsis-promote-to-announcement',
      permissions: ['CREATE_ANNOUNCEMENTS'],
      enabled: !data.isAnnouncement,
    },
    {
      icon: 'editReceipt',
      label: 'Edit announcement',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreateAnnouncement);
        openModal();
      },
      dataTestId: 'post-ellipsis-edit-announcement',
      permissions: ['UPDATE_ANNOUNCEMENTS'],
      enabled: data.isAnnouncement,
    },
    {
      icon: 'cyclicArrow',
      label: 'Change to regular post',
      onClick: () => showRemoveAnnouncement(),
      dataTestId: 'post-ellipsis-changeto-regularpost',
      permissions: ['UPDATE_ANNOUNCEMENTS'],
      enabled: data.isAnnouncement,
    },
    {
      icon: 'edit',
      label: 'Edit post',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreatePost);
        openModal();
      },
      dataTestId: 'post-ellipsis-edit-post',
      permissions: ['UPDATE_MY_POSTS'],
      enabled: data.createdBy?.userId === user?.id,
    },
    {
      icon: 'delete',
      label: 'Delete post',
      onClick: () => showConfirm(),
      stroke: '#F05252',
      fill: '#F05252',
      labelClassName: '!text-red-500',
      dataTestId: 'post-ellipsis-delete-post',
      permissions: ['DELETE_MY_POSTS', 'DELETE_POSTS'],
      enabled: isAdmin || data.createdBy?.userId === user?.id,
    },
    {
      icon: 'announcementChart',
      label: 'View acknowledgement report',
      // onClick: () => showConfirm(),
      dataTestId: 'post-ellipsis-view-acknowledgement-report',
      permissions: ['CREATE_ANNOUNCEMENTS', 'UPDATE_ANNOUNCEMENTS'],
      enabled: data.isAnnouncement,
    },
  ];

  const postOptions = allOptions
    .filter((option) => option.enabled)
    .filter((menuItem) => {
      if (
        menuItem.permissions &&
        !canPerform(menuItem.permissions, user?.permissions) &&
        isMember
      ) {
        return false;
      }
      return true;
    });

  return !!postOptions.length ? (
    <>
      <PopupMenu
        triggerNode={
          <div className="cursor-pointer" data-testid="feed-post-ellipsis">
            <Icon name="more" />
          </div>
        }
        menuItems={postOptions}
        className="mt-6 right-0 border-1 border-neutral-200"
      />
      {open && (
        <PostBuilder
          data={data}
          open={open}
          openModal={openModal}
          closeModal={closeModal}
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
          onSubmit: () => deletePostMutation.mutate(data?.id || ''),
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
        isLoading={deletePostMutation.isLoading}
        dataTestId="post-deletepost"
      />
      <Modal open={removeAnnouncement} className="w-max overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <p className="font-bold text-lg text-gray-900">
            Change to regular post?
          </p>
          <Icon
            name="close"
            onClick={closeRemoveAnnouncement}
            disabled={true}
            dataTestId="changeto-regularpost-closemodal"
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
        <div className="flex min-w-full items-center justify-end gap-x-3 p-4 bg-blue-50 rounded-b-9xl">
          <Button
            variant={Variant.Secondary}
            label="Cancel"
            onClick={closeRemoveAnnouncement}
            dataTestId="changeto-regularpost-cancel"
          />
          <Button
            variant={Variant.Primary}
            label="Yes"
            onClick={() => {
              const fileIds = data.files?.map((file: any) => file.id);
              const payload = {
                ...data,
                files: fileIds,
                isAnnouncement: false,
                announcement: {
                  end: '',
                },
              };
              removeAnnouncementMutation.mutate(payload);
            }}
            loading={removeAnnouncementLoading}
            dataTestId="changeto-regularpost-accept"
          />
        </div>
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default FeedPostMenu;
