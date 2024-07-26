import { FC, useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmationBox from 'components/ConfirmationBox';
import {
  AudienceEntityType,
  IPost,
  PostType,
  deletePost,
  updatePost,
} from 'queries/post';
import PostBuilder, { PostBuilderMode } from 'components/PostBuilder';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import useRole from 'hooks/useRole';
import { canPerform, isRegularPost } from 'utils/misc';
import { useFeedStore } from 'stores/feedStore';
import omit from 'lodash/omit';
import { CreatePostFlow } from 'contexts/CreatePostContext';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { failureToastConfig } from 'components/Toast/variants/FailureToast';
import ClosePollModal from './ClosePollModal';
import PollVotesModal from './PollVotesModal';
import ChangeToRegularPostModal from './ChangeToRegularPostModal';
import AnnouncementAnalytics from './AnnouncementAnalytics';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export interface IFeedPostMenuProps {
  data: IPost;
}

const FeedPostMenu: FC<IFeedPostMenuProps> = ({ data }) => {
  const { user } = useAuth();
  const { isMember } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
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
  const currentDate = new Date().toISOString();

  const isPostPage = location.pathname.startsWith('/posts/');
  const isChannelPage = location.pathname.startsWith('/channels/');
  const { channelId = '' } = useParams();
  const deletePostMutation = useMutation({
    mutationKey: ['deletePostMutation', data.id],
    mutationFn: deletePost,
    onMutate: (variables) => {
      const previousFeed = feedRef.current;
      if (!isPostPage) setFeed({ ...omit(feedRef.current, [variables]) });
      closeConfirm();
      return { previousFeed };
    },
    onError: (_error, _variables, context) => {
      failureToastConfig({
        content: 'Error deleting post',
        dataTestId: 'post-delete-toaster-failure',
      });
      if (context?.previousFeed) {
        setFeed(context?.previousFeed);
      }
    },
    onSuccess: async (_data, variables, _context) => {
      successToastConfig({
        content: 'Post deleted successfully',
        dataTestId: 'post-delete-toaster-success',
      });
      if (isPostPage) navigate('/feed');
      await queryClient.invalidateQueries(['feed']);
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
      await queryClient.invalidateQueries(['bookmarks']);
      await queryClient.invalidateQueries(['scheduledPosts']);
      await queryClient.invalidateQueries(['posts', variables], {
        exact: false,
      });
    },
  });
  const updatePostMutation = useMutation({
    mutationKey: ['updatePostMutation'],
    mutationFn: (payload: any) => updatePost(payload.id || '', payload as any),

    onMutate: (variables) => {
      const previousFeed = feedRef.current;
      if (!isPostPage) setFeed({ ...omit(feedRef.current, [variables]) });
      closeConfirm();
      return { previousFeed };
    },
    onError: (_error, _variables, context) => {
      failureToastConfig({
        content: 'Error deleting post',
        dataTestId: 'post-delete-toaster-failure',
      });
      if (context?.previousFeed) {
        setFeed(context?.previousFeed);
      }
    },
    onSuccess: async (_data, variables, _context) => {
      successToastConfig({
        content: 'Post deleted successfully',
        dataTestId: 'post-delete-toaster-success',
      });
      if (isPostPage) navigate('/feed');
      await queryClient.invalidateQueries(['feed']);
      await queryClient.invalidateQueries(['feed-announcements-widget']);
      await queryClient.invalidateQueries(['post-announcements-widget']);
      await queryClient.invalidateQueries(['bookmarks']);
      await queryClient.invalidateQueries(['scheduledPosts']);
      await queryClient.invalidateQueries(['posts', variables], {
        exact: false,
      });
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
      enabled: isRegularPost(data, currentDate, isAdmin),
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
      enabled: !isRegularPost(data, currentDate, isAdmin),
    },
    {
      icon: 'cyclicArrow',
      label: 'Change to regular post',
      onClick: () => showRemoveAnnouncement(),
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-changeto-regularpost',
      permissions: ['UPDATE_ANNOUNCEMENTS'],
      enabled: !isRegularPost(data, currentDate, isAdmin),
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
      enabled: !data?.isAutomatedPost && data.createdBy?.userId === user?.id, // editing of automated post is not allow.
    },
    {
      icon: 'closeCircle',
      label: 'Close Poll',
      onClick: () => showClosePoll(),
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-close-poll',
      permissions: ['UPDATE_MY_POSTS', 'CLOSE_POLLS'],
      enabled:
        data.type === PostType.Poll &&
        data.pollContext?.closedAt > currentDate &&
        (isAdmin || data.createdBy?.userId === user?.id),
    },
    {
      icon: 'chartOutline',
      label: 'See who voted',
      onClick: () => showPollVotes(),
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-see-poll-votes',
      permissions: ['UPDATE_MY_POSTS'],
      enabled:
        data.type === PostType.Poll &&
        (isAdmin || data.createdBy?.userId === user?.id),
    },
    {
      icon: 'announcementChart',
      label: 'View acknowledgement report',
      onClick: () => showAnalytics(),
      stroke: 'text-neutral-900',
      dataTestId: 'post-ellipsis-view-acknowledgement-report',
      permissions: ['CREATE_ANNOUNCEMENTS', 'UPDATE_ANNOUNCEMENTS'],
      enabled: !isRegularPost(data, currentDate, isAdmin),
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
  ];

  const handleDelete = () => {
    if (!isChannelPage) {
      deletePostMutation.mutate(data?.id || '');
      return;
    }
    if (data?.audience?.length <= 1 && isChannelPage) {
      deletePostMutation.mutate(data?.id || '');
      return;
    } else {
      const audience = data?.audience?.filter(
        (audience: any) =>
          audience?.entityId !== channelId &&
          audience?.entityType === AudienceEntityType.Channel,
      );
      updatePostMutation.mutate({
        ...data,
        audience,
      });
    }
  };

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
              <Icon name="more" tabIndex={0} />
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
            onSubmit: () => handleDelete(),
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
