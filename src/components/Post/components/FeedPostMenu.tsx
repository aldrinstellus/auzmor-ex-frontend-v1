import React, { useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { useMutation } from '@tanstack/react-query';
import ConfirmationBox from 'components/ConfirmationBox';
import { IPost, deletePost } from 'queries/post';
import PostBuilder, { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';

export interface IFeedPostMenuProps {
  data: IPost;
}

const FeedPostMenu: React.FC<IFeedPostMenuProps> = ({ data }) => {
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [showModal, setShowModal] = useState(false);

  const deletePostMutation = useMutation({
    mutationKey: ['deletePostMutation', data.id],
    mutationFn: deletePost,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      closeConfirm();
    },
  });

  const postOptions = [
    {
      icon: 'bookmarkOutline',
      label: 'Bookmark this post',
      onClick: () => null,
    },
    {
      icon: 'copyLink',
      label: 'Copy link to post',
      onClick: () => null,
    },
    {
      icon: 'editIcon',
      label: 'Edit Post',
      onClick: () => setShowModal(true),
    },
    {
      icon: 'deleteIcon',
      label: 'Delete post',
      onClick: () => showConfirm(),
    },
    {
      icon: 'notificationIcon',
      label: 'Turn off commenting',
      onClick: () => null,
    },
    {
      icon: 'analyticsIconOutline',
      label: 'View Post analytics',
      onClick: () => null,
    },
  ];

  return (
    <>
      <PopupMenu
        triggerNode={
          <div className="cursor-pointer p-2">
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
          onSubmit: () => {
            deletePostMutation.mutate(data?.id || '');
          },
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: closeConfirm,
        }}
      />
    </>
  );
};

export default FeedPostMenu;
