import { NotificationCardProps } from '../components/NotificationCard';
import {
  Action,
  ActionType,
  Target,
  TargetType,
} from '../components/NotificationsList';

export type NotificationRedirect = {
  postId?: string;
  commentId?: string;
};

export type NotificationElementProps = {
  cardContent?: NotificationCardProps;
  redirect?: NotificationRedirect;
};

export const getNotificationElementContent = (
  action: Action,
  target: Target[],
): NotificationElementProps => {
  const cardContent: NotificationCardProps = {
    BottomCardContent: undefined,
    TopCardContent: undefined,
    image: undefined,
  };

  const redirect: NotificationRedirect = {
    postId: undefined,
    commentId: undefined,
  };

  // If the action performed is a REACTION
  if (
    action.type === ActionType.REACTION ||
    action.type === ActionType.MENTION
  ) {
    // If the target has only one element, it means the reaction has been made on a POST
    if (target.length === 1) {
      const post = target[0];
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect.postId = target[0].entityId;
    }

    // If the target has two elements, it means that the reaction has been made on a COMMENT made on a POST
    else if (target.length === 2) {
      const post = target[0];
      const comment = target[1];
      cardContent.TopCardContent = comment.content;
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect.postId = post.entityId;
      redirect.commentId = comment.entityId;
    }

    // If the target has three elements, it means that the reaction has been made on a REPLY made to a COMMENT made on a POST
    else if (target.length === 3) {
      const post = target[0];
      const comment = target[1];
      const reply = target[2];

      cardContent.TopCardContent = reply.content;
      cardContent.BottomCardContent = comment.content;

      redirect.postId = post.entityId;
      redirect.commentId = reply.entityId;
    }
  }

  // If the action performed is a COMMENT
  else if (action.type === ActionType.COMMENT) {
    // If the target has only one element, it means the comment was made on a POST
    if (target.length === 1) {
      const comment = action;
      const post = target[0];

      cardContent.TopCardContent = comment.content;
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect.postId = post.entityId;
      redirect.commentId = comment.entityId;
    }

    // If the target has two elements, it means that the comment is a reply to a COMMENT made on a POST.
    else if (target.length === 2) {
      const reply = action;
      const post = target[0];
      const comment = target[1];

      cardContent.TopCardContent = reply.content;
      cardContent.BottomCardContent = comment.content;

      redirect.commentId = reply.entityId;
      redirect.postId = post.entityId;
    }
  }

  return {
    cardContent,
    redirect,
  };
};

export const getNotificationMessage = (
  actionType: string,
  targetType: string,
  interactionCount?: number,
) => {
  let message =
    interactionCount && interactionCount > 1
      ? `and ${interactionCount - 1} others `
      : '';

  if (targetType === TargetType[TargetType.POST]) {
    if (actionType === ActionType[ActionType.COMMENT]) {
      message += 'commented on your post';
    } else if (actionType === ActionType[ActionType.MENTION]) {
      message += 'mentioned you in a post';
    } else if (actionType === ActionType[ActionType.REACTION]) {
      message += 'reacted to your post';
    }
  } else if (targetType === TargetType[TargetType.COMMENT]) {
    if (actionType === ActionType[ActionType.COMMENT]) {
      message += 'replied to your comment';
    } else if (actionType === ActionType[ActionType.MENTION]) {
      message += 'mentioned you in a comment';
    } else if (actionType === ActionType[ActionType.REACTION]) {
      message += 'reacted to your comment';
    }
  }
  return message;
};
