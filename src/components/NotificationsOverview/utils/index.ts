import {
  NOTIFICATION_CARD_TYPE,
  NotificationCardProps,
} from '../components/NotificationCard';
import {
  Action,
  ActionType,
  Actor,
  Target,
  TargetType,
} from '../components/NotificationsList';

export type NotificationElementProps = {
  cardContent?: NotificationCardProps;
  redirect: string;
  showActor: boolean;
};

export const getNotificationElementContent = (
  action: Action,
  target: Target[],
  actor: Actor,
): NotificationElementProps => {
  const cardContent: NotificationCardProps = {
    BottomCardContent: undefined,
    TopCardContent: undefined,
    image: undefined,
    type: NOTIFICATION_CARD_TYPE.Card,
  };

  let showActor = true;
  let redirect = '';

  // If the action performed is a REACTION
  if (action.type === ActionType.REACTION) {
    // If the target has only one element, it means the reaction has been made on a POST
    if (target.length === 1) {
      const post = target[0];
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${target[0].entityId}`;
    }

    // If the target has two elements, it means that the reaction has been made on a COMMENT made on a POST
    else if (target.length === 2) {
      const post = target[0];
      const comment = target[1];
      cardContent.TopCardContent = comment.content;
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${post.entityId}${'?commentId=' + comment.entityId}`;
    }

    // If the target has three elements, it means that the reaction has been made on a REPLY made to a COMMENT made on a POST
    else if (target.length === 3) {
      const post = target[0];
      const comment = target[1];
      const reply = target[2];

      cardContent.TopCardContent = reply.content;
      cardContent.BottomCardContent = comment.content;

      redirect = `/posts/${post.entityId}${
        reply.entityId ? '?commentId=' + reply.entityId : ''
      }`;
    }
  }

  // If the action performed is a SHOUTOUT
  else if (action.type === ActionType.SHOUTOUT) {
    cardContent.TopCardContent = `Congratulations! You have received a shout-out From <span class="font-bold text-primary-500">${actor.fullName}</span>. Your hard work and contributions are being recognized by your colleagues. Keep up the great work!`;
    cardContent.type = NOTIFICATION_CARD_TYPE.Content;

    redirect = `/posts/${target[0].entityId}`;
  }

  // If the action performed is a ADD NEW TEAM Member
  else if (action.type === ActionType.NEW_MEMBERS_TO_TEAM) {
    cardContent.TopCardContent = `You've been added to the <span class="font-bold">${
      target[0].entityName || ''
    }</span> team. Welcome aboard! Get ready to collaborate and achieve great things together. 
    <button class=" flex items-center mt-3 px-2 py-1 bg-white rounded-9xl border border-neutral-200 font-bold text-xs hover:text-primary-500 active:text-primary-600">
      Explore team 
      <svg
        width={16}
        height={16}
        viewBox="0 0 20 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
      >
        <path
          d="M13.3367 8.345L6.16417 15.5175L4.98584 14.3392L12.1575 7.16667H5.83667V5.5H15.0033V14.6667H13.3367V8.345Z"
          fill="currentColor"
        />
      </svg>
    </button>`;
    cardContent.type = NOTIFICATION_CARD_TYPE.Content;

    redirect = `/teams/${target[0].entityId}`;
    showActor = false;
  }

  // If the action performed is a COMMENT OR MENTION
  else if (
    action.type === ActionType.COMMENT ||
    action.type === ActionType.MENTION
  ) {
    const [post, comment, reply] = target;

    // If the target has only post, it means the mention was made on a POST
    if (post && !comment && !reply) {
      cardContent.BottomCardContent = `<span class="text-neutral-900">${post.content}</span>`;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${post.entityId}`;
    }

    // If the target has only post and comment, it means the comment was made on a POST
    else if (post && comment && !reply) {
      cardContent.TopCardContent = `<span class="text-neutral-900">${comment.content}</span>`;
      cardContent.BottomCardContent = `<span class="text-neutral-900">${post.content}</span>`;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${post.entityId}${
        comment.entityId ? '?commentId=' + comment.entityId : ''
      }`;
    }

    // If the target has post, comment and reply, it means that the comment is a reply to a COMMENT made on a POST.
    else if (post && comment && reply) {
      cardContent.TopCardContent = `<span class="text-neutral-900">${reply.content}</span>`;
      cardContent.BottomCardContent = `<span class="text-neutral-900">${comment.content}</span>`;
      cardContent.image = comment?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${post.entityId}${
        reply.entityId ? '?commentId=' + reply.entityId : ''
      }`;
    }
  }

  // If the action performed is a SCHEDULE_POST
  else if (
    action.type === ActionType.SCHEDULE_POST ||
    action.type === ActionType.SCHEDULE_POST_PUBLISH ||
    action.type === ActionType.POST_PRE_PUBLISH
  ) {
    // If target length is 1
    if (target.length === 1) {
      const post = target[0];
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${post.entityId}`;
    }
  }

  // if the action performed is ACKNOWLEDGEMENT_REMINDER
  else if (action.type === ActionType.ACKNOWLEDGEMENT_REMINDER) {
    // If target length is 1
    if (target.length === 1) {
      const post = target[0];
      cardContent.TopCardContent = `Announcement`;
      cardContent.BottomCardContent = post.content;
      cardContent.image = post?.image?.thumbnailUrl || undefined;

      redirect = `/posts/${post.entityId}`;
    }
  }

  return {
    cardContent,
    redirect,
    showActor,
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
    } else if (actionType === ActionType.SHOUTOUT) {
      message = 'You Received a Shout Out From';
    } else if (actionType === ActionType.ACKNOWLEDGEMENT_REMINDER) {
      message = 'shared an announcement';
    } else if (actionType === ActionType.SCHEDULE_POST) {
      message = 'Your post is scheduled';
    } else if (actionType === ActionType.SCHEDULE_POST_PUBLISH) {
      message = 'Your scheduled post is live';
    } else if (actionType === ActionType.POST_PRE_PUBLISH) {
      message = 'Your post is about to go live';
    }
  } else if (targetType === TargetType[TargetType.TEAM]) {
    if (actionType === ActionType[ActionType.NEW_MEMBERS_TO_TEAM]) {
      message = 'Welcome to the team! 🎉🥳';
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
