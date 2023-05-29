import { NotificationCardProps } from '../components/NotificationCard';
import {
  Action,
  ActionType,
  Target,
  TargetType,
} from '../components/NotificationsList';

const convertUTCDateToLocalDate = (date: Date) => {
  return new Date(date.valueOf() - date.getTimezoneOffset() * 60 * 1000);
};

export const getTimeSinceActedAt = (actedAt: string) => {
  // Convert string time to a Date object
  const targetDatetime = convertUTCDateToLocalDate(new Date(actedAt));

  // Calculate the time difference between now and 'actedAt'
  const now = new Date();
  const difference = now.getTime() - targetDatetime.getTime();

  // Calculate the time differences in various units
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  // Return the biggest non-zero unit
  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `Less than a minute ago`;
  }
};

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
      cardContent.image = post?.image || undefined;

      redirect.postId = target[0].entityId;
    }

    // If the target has two elements, it means that the reaction has been made on a COMMENT made on a POST
    else if (target.length === 2) {
      const post = target[0];
      const comment = target[1];
      cardContent.TopCardContent = comment.content;
      cardContent.BottomCardContent = post.content;
      cardContent.image = post.image || undefined;

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
      cardContent.image = post.image || undefined;

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
) => {
  let message = '';
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
