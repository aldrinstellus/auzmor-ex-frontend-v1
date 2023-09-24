import { FC, useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmationBox from 'components/ConfirmationBox';
import { IPost, deletePost } from 'queries/post';
import PostBuilder, { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import useRole from 'hooks/useRole';
import { canPerform, twConfig } from 'utils/misc';
import { useFeedStore } from 'stores/feedStore';
import omit from 'lodash/omit';
import { CreatePostFlow, POST_TYPE } from 'contexts/CreatePostContext';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { toast } from 'react-toastify';
import FailureToast from 'components/Toast/variants/FailureToast';
import ClosePollModal from './ClosePollModal';
import PollVotesModal from './PollVotesModal';
import ChangeToRegularPostModal from './ChangeToRegularPostModal';
import AnnouncementAnalytics from './AnnouncementAnalytics';

export interface IFeedPostMenuProps {
  data: IPost;
}

const FeedPostMenu: FC<IFeedPostMenuProps> = ({ data }) => {
  const { user } = useAuth();
  const { isMember } = useRole();
  const feedRef = useRef(useFeedStore.getState().feed);
  const [confirm, showConfirm, closeConfirm] = useModal();
  const [analytics, showAnalytics, closeAnalytics] = useModal();
  const [removeAnnouncement, showRemoveAnnouncement, closeRemoveAnnouncement] =
    useModal();
  const [closePoll, showClosePoll, closeClosePoll] = useModal();
  const [pollVotes, showPollVotes, closePollVotes] = useModal();
  const [open, openModal, closeModal] = useModal(undefined, false);
  const [customActiveFlow, setCustomActiveFlow] = useState<CreatePostFlow>(
    CreatePostFlow.CreatePost,
  );

  const queryClient = useQueryClient();
  const setFeed = useFeedStore((state) => state.setFeed);
  const { isAdmin } = useRole();

  const deletePostMutation = useMutation({
    mutationKey: ['deletePostMutation', data.id],
    mutationFn: deletePost,
    onMutate: (variables) => {
      const previousFeed = feedRef.current;
      setFeed({ ...omit(feedRef.current, [variables]) });
      closeConfirm();
      return { previousFeed };
    },
    onError: (_error, _variables, context) => {
      toast(
        <FailureToast
          content="Error deleting post"
          dataTestId="post-delete-toaster-failure"
        />,
        {
          closeButton: (
            <Icon name="closeCircleOutline" color="text-red-500" size={20} />
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
    onSuccess: async (_data, _variables, _context) => {
      toast(
        <SuccessToast
          content="Post deleted successfully"
          dataTestId="post-delete-toaster-success"
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              color="text-primary-500"
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

  const allOptions = [
    {
      icon: 'cyclicArrow',
      label: 'Promote to announcement',
      onClick: () => {
        setCustomActiveFlow(CreatePostFlow.CreateAnnouncement);
        openModal();
      },
      stroke: 'text-neutral-900',
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
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-edit-announcement',
      permissions: ['UPDATE_ANNOUNCEMENTS'],
      enabled: data.isAnnouncement,
    },
    {
      icon: 'cyclicArrow',
      label: 'Change to regular post',
      onClick: () => showRemoveAnnouncement(),
      stroke: 'text-neutral-900',
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
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-edit-post',
      permissions: ['UPDATE_MY_POSTS'],
      enabled: data.createdBy?.userId === user?.id,
    },
    {
      icon: 'closeCircle',
      label: 'Close Poll',
      onClick: () => showClosePoll(),
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-close-poll',
      permissions: ['UPDATE_MY_POSTS', 'CLOSE_POLLS'],
      enabled:
        data.type === POST_TYPE.Poll &&
        data.pollContext?.closedAt > new Date().toISOString() &&
        (isAdmin || data.createdBy?.userId === user?.id),
    },
    {
      icon: 'delete',
      label: 'Delete post',
      onClick: () => showConfirm(),
      iconClassName: '!text-red-500',
      labelClassName: '!text-red-500',
      dataTestId: 'post-ellipsis-delete-post',
      permissions: ['DELETE_MY_POSTS', 'DELETE_POSTS'],
      enabled: isAdmin || data.createdBy?.userId === user?.id,
    },
    {
      icon: 'chartOutline',
      label: 'See who voted',
      onClick: () => showPollVotes(),
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-see-poll-votes',
      permissions: [],
      enabled:
        data.type === POST_TYPE.Poll &&
        (isAdmin || data.createdBy?.userId === user?.id),
    },
    {
      icon: 'announcementChart',
      label: 'View acknowledgement report',
      onClick: () => showAnalytics(),
      stroke: 'text-neutral-900',
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

  useEffect(
    () => useFeedStore.subscribe((state) => (feedRef.current = state.feed)),
    [],
  );

  if (postOptions.length) {
    return (
      <>
        <PopupMenu
          triggerNode={
            <div className="cursor-pointer" data-testid="feed-post-ellipsis">
              <Icon name="more" />
            </div>
          }
          menuItems={postOptions}
          className="mt-1 right-0 border-1 border-neutral-200 focus-visible:outline-none"
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
              Are you sure you want to delete this post? This cannot be undone
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
        <ChangeToRegularPostModal
          open={removeAnnouncement}
          closeModal={closeRemoveAnnouncement}
          data={data}
        />
        {closePoll && (
          <ClosePollModal
            open={closePoll}
            closeModal={closeClosePoll}
            data={data}
          />
        )}
        {pollVotes && (
          <PollVotesModal
            post={data}
            open={pollVotes}
            closeModal={closePollVotes}
          />
        )}
        {data?.id && analytics && (
          <AnnouncementAnalytics
            post={data}
            open={analytics}
            closeModal={closeAnalytics}
          />
        )}
      </>
    );
  }

  return null;
};

export default FeedPostMenu;
