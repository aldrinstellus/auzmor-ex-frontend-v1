import React, { ReactNode, useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu, { IMenuItem } from 'components/PopupMenu';
import { twConfig } from 'utils/misc';
// import { editPost } from 'queries/post';
import { useMutation } from '@tanstack/react-query';
import CreatePostCard from 'pages/Feed/components/CreatePostCard';
import ActivityFeed from 'components/ActivityFeed';
import CreatePostModal from 'pages/Feed/components/CreatePostModal';
import Feed from 'pages/Feed';
import { divide } from 'lodash';
import Modal from 'components/Modal';
import ConfirmationBox from 'components/ConfirmationBox';
import { deletePost } from 'queries/post';

export interface IFeedPostMenuProps {
  id: string;
}

const FeedPostMenu: React.FC<IFeedPostMenuProps> = ({ id }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const deletePostMutation = useMutation({
    mutationKey: ['deletePostMutation', id],
    mutationFn: deletePost,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      console.log('data==>', data);
    },
  });

  const postOptions = [
    {
      renderNode: (
        <div className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer">
          <Icon
            name="bookmarkOutline"
            size={16}
            className="p-2 rounded-7xl border mr-2.5 bg-white"
            fill={twConfig.theme.colors.primary['500']}
          />
          <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
            Bookmark this post
          </div>
        </div>
      ),
    },
    {
      renderNode: (
        <div className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer">
          <Icon
            name="copyLink"
            size={16}
            className="p-2 rounded-7xl border mr-2.5 bg-white"
            fill={twConfig.theme.colors.primary['500']}
          />
          <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
            Copy link to post
          </div>
        </div>
      ),
    },
    {
      renderNode: (
        <div
          onClick={() => setShowModal(true)}
          className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer"
        >
          <Icon
            name="editIcon"
            size={16}
            className="p-2 rounded-7xl border mr-2.5 bg-white"
            fill={twConfig.theme.colors.primary['500']}
          />
          <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
            Edit Post
          </div>
        </div>
      ),
    },
    {
      renderNode: (
        <div
          className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer"
          onClick={() => setShowDeleteModal(true)}
        >
          <Icon
            name="deleteIcon"
            size={16}
            className="p-2 rounded-7xl border mr-2.5 bg-white"
            fill={twConfig.theme.colors.primary['500']}
          />
          <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
            Delete post
          </div>
        </div>
      ),
    },
    {
      renderNode: (
        <div className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer">
          <Icon
            name="notificationIcon"
            size={16}
            className="p-2 rounded-7xl border mr-2.5 bg-white"
            fill={twConfig.theme.colors.primary['500']}
          />
          <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
            Turn off commenting
          </div>
        </div>
      ),
    },
    {
      renderNode: (
        <div className="flex px-6 py-3 items-center hover:bg-primary-50 cursor-pointer">
          <Icon
            name="analyticsIconOutline"
            size={16}
            className="p-2 rounded-7xl border mr-2.5 bg-white"
            fill={twConfig.theme.colors.primary['500']}
          />
          <div className="text-sm text-neutral-900 font-medium whitespace-nowrap">
            View Post analytics
          </div>
        </div>
      ),
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
      <Modal open={showModal} closeModal={() => setShowModal(false)}>
        <div>Hello</div>
      </Modal>
      <ConfirmationBox
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
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
            deletePostMutation.mutate(id);
          },
        }}
        discard={{
          label: 'Cancel',
          className: 'text-neutral-900 bg-white ',
          onCancel: () => {
            setShowDeleteModal(false);
          },
        }}
      />
    </>
  );
};

export default FeedPostMenu;
