import React, { useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmationBox from 'components/ConfirmationBox';
import { IPost, deletePost } from 'queries/post';
import PostBuilder, { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import useRole from 'hooks/useRole';
import { isSubset } from 'utils/misc';

export interface IFeedPostMenuProps {
  data: IPost;
}

const FeedPostMenu: React.FC<IFeedPostMenuProps> = ({ data }) => {
  const { user } = useAuth();
  const { isMember } = useRole();
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [showModal, setShowModal] = useState(false);
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

  const postOptions = [
    {
      icon: 'bookmarkOutline',
      label: 'Bookmark this post',
      onClick: () => null,
      dataTestId: 'post-ellipsis-bookmark-this-post',
      disabled: true,
    },
    {
      icon: 'copyLink',
      label: 'Copy link to post',
      onClick: () => null,
      dataTestId: 'post-ellipsis-copy-link-to-post',
      disabled: true,
    },
    {
      icon: 'edit',
      label: 'Edit Post',
      onClick: () => setShowModal(true),
      dataTestId: 'post-ellipsis-edit-post',
      permissions: ['UPDATE_MY_POSTS'],
    },
    {
      icon: 'delete',
      label: 'Delete post',
      onClick: () => showConfirm(),
      dataTestId: 'post-ellipsis-delete-post',
      permissions: ['DELETE_MY_POSTS'],
    },
    {
      icon: 'clipboardClose',
      label: 'Turn off commenting',
      onClick: () => null,
      dataTestId: 'post-ellipsis-turn-off-commenting',
      disabled: true,
    },
    {
      icon: 'chart',
      label: 'View Post analytics',
      onClick: () => null,
      dataTestId: 'post-ellipsis-view-post-anlytics',
      disabled: true,
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

  return (
    <>
      <PopupMenu
        triggerNode={
          <div className="cursor-pointer p-2" data-testid="feed-post-ellipsis">
            <Icon name="more" />
          </div>
        }
        menuItems={postOptions}
      />
      <PostBuilder
        data={data}
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        mode={PostBuilderMode.Edit}
      />
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
    </>
  );
};

export default FeedPostMenu;
