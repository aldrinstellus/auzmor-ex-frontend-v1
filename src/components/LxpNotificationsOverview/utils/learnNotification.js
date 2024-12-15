/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars, react/jsx-key */

import truncate from 'lodash/truncate';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import hasIn from 'lodash/hasIn';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import {
  NOTIFICATION_ACTION_TYPES,
  LEARNING_TYPE,
  LEARNER_YOUR_COURSES_TABS,
  FORUM_POST_TYPE,
  SOURCE,
  LEARNING_PATH,
  TASK_CONFIG_ROLES,
  TASK_CREATION_SCOPE,
  TASK_TYPE,
  TASK_CATEGORIES,
} from './constants';
import moment from 'moment';
import NotificationTitle from '../components/NotificationTitle';
import NotificationText from '../components/NotificationText';

import { convertKeysToCamelCase } from 'utils/misc';
import useAuth from 'hooks/useAuth';

export const isLearnerRoute = () => {
  const path = window.location.pathname.toLowerCase();
  return (
    path.startsWith('/learn') ||
    path.startsWith('/user') ||
    (path.startsWith('/user') && !path.includes('users'))
  );
};

const SOCIAL_GROUP = {
  ALL_FORUM_USERS: 'forum',
  ALL_ENGAGED_USERS: 'here',
  ALL_ADMINS: 'admin',
  ALL_REVIEWERS: 'reviewers',
  DIRECT_MANAGERS: 'managers',
  ALL_VIEWERS: 'viewers',
};
export const getIconForAction = (actionType, target1Type) => {
  let iconName;

  switch (actionType) {
    case NOTIFICATION_ACTION_TYPES.LxpAnnouncementReminderOnFeed:
      iconName = 'AcknowledgeAnnouncementNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.LxpPostSchedulePostPublish:
      iconName = 'PostLiveNotification';
      break;

    case NOTIFICATION_ACTION_TYPES.LxpPostScheduled:
    case NOTIFICATION_ACTION_TYPES.LxpPostSchedulePrePublish:
      iconName = 'PostScheduleClockNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.ShoutOut:
      iconName = 'starShoutOut';
      break;

    case NOTIFICATION_ACTION_TYPES.LxpMentionOnFeed:
      if (target1Type === 'POST' || target1Type === 'COMMENT') {
        iconName = 'MentionInPost';
      } else if (target1Type === 'COMMENT') {
        iconName = 'CommentNotification';
      }
      break;
    case NOTIFICATION_ACTION_TYPES.LxpCommentOnPost:
      iconName = 'CommentNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.LxpRepliedOnFeedComment:
      iconName = 'CommentNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.ReportGenerated:
    case NOTIFICATION_ACTION_TYPES.CourseCompleted:
    case NOTIFICATION_ACTION_TYPES.LearningPathCompleted:
    case NOTIFICATION_ACTION_TYPES.AssignCertificate:
    case NOTIFICATION_ACTION_TYPES.EventComplete:
    case NOTIFICATION_ACTION_TYPES.ApprovedExternalCertificate:
    case NOTIFICATION_ACTION_TYPES.AddExternalCertificate:
      iconName = 'completedNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.PublicCourse:
    case NOTIFICATION_ACTION_TYPES.PrivateCourse:
    case NOTIFICATION_ACTION_TYPES.CourseOverdued:
    case NOTIFICATION_ACTION_TYPES.SingleCourseReminder:
    case NOTIFICATION_ACTION_TYPES.RecurringCourseReminder:
    case NOTIFICATION_ACTION_TYPES.SinglePathReminder:
    case NOTIFICATION_ACTION_TYPES.RecurringPathReminder:
    case NOTIFICATION_ACTION_TYPES.EventUpdated:
    case NOTIFICATION_ACTION_TYPES.EventTakeAssessment:
    case NOTIFICATION_ACTION_TYPES.LearningPathUpdated:
    case NOTIFICATION_ACTION_TYPES.StartEventReminderInstructor:
    case NOTIFICATION_ACTION_TYPES.StartEventReminderLearner:
    case NOTIFICATION_ACTION_TYPES.RecurringEventReminderInstructor:
    case NOTIFICATION_ACTION_TYPES.RecurringEventReminderLearner:
    case NOTIFICATION_ACTION_TYPES.EventReminder:
      iconName = 'updateNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.RemoveManager:
    case NOTIFICATION_ACTION_TYPES.UserDelete:
    case NOTIFICATION_ACTION_TYPES.TeamDelete:
    case NOTIFICATION_ACTION_TYPES.BulkDeleteUser:
    case NOTIFICATION_ACTION_TYPES.BulkDeleteTeam:
    case NOTIFICATION_ACTION_TYPES.DeleteExternalCertificate:
      iconName = 'deleteNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.ArchiveCourse:
    case NOTIFICATION_ACTION_TYPES.ArchiveLearningPath:
    case NOTIFICATION_ACTION_TYPES.BulkArchiveCourse:
      iconName = 'archivedNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.CoursePublished:
    case NOTIFICATION_ACTION_TYPES.EventPublished:
      iconName = 'publishNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.CourseAssigned:
    case NOTIFICATION_ACTION_TYPES.LearningPathAssigned:
    case NOTIFICATION_ACTION_TYPES.CourseTeamAssigned:
    case NOTIFICATION_ACTION_TYPES.CourseReInvited:
    case NOTIFICATION_ACTION_TYPES.AssignTeamUserToCourse:
    case NOTIFICATION_ACTION_TYPES.BulkAssignCourse:
    case NOTIFICATION_ACTION_TYPES.EventAssigned:
    case NOTIFICATION_ACTION_TYPES.CourseAssignedToBranch:
    case NOTIFICATION_ACTION_TYPES.UpdateExternalCertificate:
      iconName = 'assignmentNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.CourseEnrolled:
    case NOTIFICATION_ACTION_TYPES.AddManager:
    case NOTIFICATION_ACTION_TYPES.UserAdd:
    case NOTIFICATION_ACTION_TYPES.BulkAddManagerToTeam:
    case NOTIFICATION_ACTION_TYPES.AddInstructor:
      iconName = 'enrollmentNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.AssessmentFailed:
      iconName = 'failedNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.AdminJoined:
    case NOTIFICATION_ACTION_TYPES.UserJoined:
    case NOTIFICATION_ACTION_TYPES.EventAttendanceSummary:
      iconName = 'invitationNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.CourseUnpublished:
      iconName = 'courseUnpublishedNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.CourseExpire:
    case NOTIFICATION_ACTION_TYPES.NotLoggedForXDays:
    case NOTIFICATION_ACTION_TYPES.EventCancelled:
    case NOTIFICATION_ACTION_TYPES.LearnerCertificateExpired:
      iconName = 'expiryNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.LearnerCertificateExpirationRemainder:
      iconName = 'expiryReminderNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.SocialReplyOnComment:
    case NOTIFICATION_ACTION_TYPES.SocialReplyOnPost:
    case NOTIFICATION_ACTION_TYPES.SocialCommentOnPost:
      iconName = 'replyNotificationIcon';
      break;
    case NOTIFICATION_ACTION_TYPES.SocialMentionOnPost:
    case NOTIFICATION_ACTION_TYPES.SocialMentionOnComment:
    case NOTIFICATION_ACTION_TYPES.SocialMentionOnReply:
      iconName = 'mentionNotificationIcon';
      break;
    case NOTIFICATION_ACTION_TYPES.SocialLikeOnPost:
    case NOTIFICATION_ACTION_TYPES.SocialLikeOnComment:
    case NOTIFICATION_ACTION_TYPES.SocialLikeOnReply:
      iconName = 'heartNotificationIcon';
      break;
    case NOTIFICATION_ACTION_TYPES.SocialFlagOnPostAuthor:
    case NOTIFICATION_ACTION_TYPES.SocialFlagOnCommentAuthor:
    case NOTIFICATION_ACTION_TYPES.SocialFlagOnReplyAuthor:
    case NOTIFICATION_ACTION_TYPES.SocialFlagOnPostAdmin:
    case NOTIFICATION_ACTION_TYPES.SocialFlagOnCommentAdmin:
    case NOTIFICATION_ACTION_TYPES.SocialFlagOnReplyAdmin:
      iconName = 'flagNotificationIcon';
      break;
    case NOTIFICATION_ACTION_TYPES.RejectedExternalCertificate:
      iconName = 'thumbsDown';
      break;
    case NOTIFICATION_ACTION_TYPES.ApprovalExternalCertificate:
      iconName = 'thumbsUpNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.SocialPollExpired:
    case NOTIFICATION_ACTION_TYPES.SocialPollReminder:
      iconName = 'pollNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.FeedbackSubmitSingleReminder:
    case NOTIFICATION_ACTION_TYPES.FeedbackSubmitReminder:
      iconName = 'feedbackPending';
      break;
    case NOTIFICATION_ACTION_TYPES.ApprovalReminderExternalCertificate:
      iconName = 'updateNotification';
      break;
    case NOTIFICATION_ACTION_TYPES.TasksNotificationOnAssigned:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationOnSubmission:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationOnStatusChange:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationOnRework:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationOnOverdue:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationChecklistCompleted:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationAssigneeUpdateResponse:
    case NOTIFICATION_ACTION_TYPES.TasksNotificationReviewerUpdateReview:
      iconName = 'taskUpdateNotification';
      break;

    default:
    // console.log('Invalid action type');
  }
  return iconName;
};

export const humanizeTimestamp = (timestamp) => moment(timestamp).fromNow();

export const parseMentions = (mentions, text) => {
  let finalText = text;
  mentions.map((m) => {
    finalText = finalText.replaceAll(
      `{{${m.id}}}{{${m.type}}}`,
      `@${m.type === 'SocialGroup' ? SOCIAL_GROUP[m.name] : m.name}`,
    );
    return m;
  });
  return finalText;
};
export const getAvatarInitial = ({ firstName = '', lastName = '' }) =>
  `${firstName && firstName?.trim()[0]} ${lastName && lastName?.trim()[0]}`;

const CERTIFICATE = 'certificate';

const getSourceList = (sourceNamesList = undefined, count) => {
  if (sourceNamesList) {
    const visibleItems = sourceNamesList?.slice(0, 2);
    const visibleLabel = visibleItems
      .map((item) => truncate(item, visibleItems.length === 2 ? 20 : 48))
      .join(', ');
    const othersLabel =
      sourceNamesList.length > 2
        ? ` ${i18n.t('assessment.bulkUpload.moreErrors', {
            count: sourceNamesList.length - 2,
          })}`
        : '';

    const label = `${visibleLabel} ${othersLabel}`;
    return label;
  }
  return count;
};

const getSourceRoute = (isLearn, target1Type, targetId1) => {
  switch (target1Type) {
    case SOURCE.course.id:
      return isLearn
        ? `/user/courses/${targetId1}/detail`
        : `/courses/${targetId1}`;
    case SOURCE.event.id:
      return isLearn
        ? `/user/events/${targetId1}/detail`
        : `/events/${targetId1}`;
    case SOURCE.path.pathAPIKey:
      return isLearn
        ? `/user/paths/${targetId1}/detail`
        : `/paths/${targetId1}`;
    case CERTIFICATE:
      return isLearn
        ? '/user/settings/certificates?type=external'
        : '/external-trainings/approvals';
    default:
      return null;
  }
};

const getSocialSourceRoute = (
  isLearn,
  target1Type,
  targetId1,
  userId,
  additionalInfo,
  actionType,
) => {
  switch (target1Type) {
    case 'COMMENT':
    case 'POST':
      const targetPost = additionalInfo?.target?.find(
        (item) => item.entityType === 'POST',
      );
      const targetComment = additionalInfo?.target
        ?.toReversed()
        ?.find((item) => item.entityType === 'COMMENT');
      const targetPostId =
        target1Type === 'POST' ? targetId1 : targetPost?.entityId;
      const url = `${isLearn ? '/user' : ''}/posts/${targetPostId}${
        targetComment ? `?commentId=${targetComment.entityId}` : ''
      }`;
      return url;

    case 'Poll':
      if (additionalInfo && additionalInfo.forum && additionalInfo.post) {
        return `${isLearn ? '/user' : ''}/forums/${additionalInfo.forum.id}/${
          FORUM_POST_TYPE.poll.route
        }/${additionalInfo.post.id}`;
      }
      return '';
    case 'Discussion':
      if (additionalInfo && additionalInfo.forum && additionalInfo.post) {
        return `${isLearn ? '/user' : ''}/forums/${additionalInfo.forum.id}/${
          FORUM_POST_TYPE.discussion.route
        }/${additionalInfo.post.id}`;
      }
      return '';
    case 'Comment':
      // This needs to be changed after finalizing anchoring
      if (additionalInfo && additionalInfo.forum && additionalInfo.post) {
        return `${isLearn ? '/user' : ''}/forums/${additionalInfo.forum.id}/${
          FORUM_POST_TYPE[additionalInfo.post.type.toLowerCase()].route
        }/${additionalInfo.post.id}`;
      }
      return '';
    case 'Reply':
      // This needs to be changed after finalizing anchoring
      if (additionalInfo && additionalInfo.forum && additionalInfo.post) {
        return `${isLearn ? '/user' : ''}/forums/${additionalInfo.forum.id}/${
          FORUM_POST_TYPE[additionalInfo.post.type.toLowerCase()].route
        }/${additionalInfo.post.id}`;
      }
      return '';
    default:
      return null;
  }
};

const getTasksRoute = (isLearn, target1Type, targetId1, additionalInfo) => {
  const {
    metadata: { role = 'ASSIGNEE' },
    parent,
  } = additionalInfo || {};

  const taskId = target1Type === TASK_TYPE.subtask ? parent.id : targetId1;

  const urlPrefix = isLearn ? '/user' : '';
  const urlPostfix =
    target1Type === TASK_TYPE.subtask ? `subtaskId=${targetId1}` : '';

  const roleUrl = Object.values(TASK_CONFIG_ROLES).includes(role)
    ? `/${role.toLowerCase()}`
    : '';

  return `${urlPrefix}/tasks/${taskId}${roleUrl}/detail?${urlPostfix}`;
};

export const getNotificationTitle = (
  viewInline,
  actionType,
  periods,
  actorId,
  name,
  userId,
  deletedTargetName,
  targetId1,
  isLearn,
  target1Type,
  target2Type,
  additionalInfo,
) => {
  const { user } = useAuth();
  const { t } = useTranslation('learnNotifications');
  if (additionalInfo) {
    additionalInfo = convertKeysToCamelCase(additionalInfo);
  }
  // 1.when mention on feed-post -> actoName mention on post
  if (
    NOTIFICATION_ACTION_TYPES.LxpMentionOnFeed === actionType &&
    target1Type == 'COMMENT'
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpuserMentionedOnComment"
        values={{ actor: name }}
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
          actionType,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 2.when mention on feed-comment -> actoName mention on comment
  if (
    NOTIFICATION_ACTION_TYPES.LxpMentionOnFeed === actionType &&
    target1Type == 'POST'
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpuserMentionedOnPost"
        values={{ actor: name }}
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 3.  Lxp user base shoutOut , Shout-Out Kate Wilson gave you a shout-out for your outstanding efforts!
  if (NOTIFICATION_ACTION_TYPES.ShoutOut === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpShoutOut"
        values={{ actor: name }}
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // 4. system generated lxp Announcement Please acknowledge our recent announcement.
  if (NOTIFICATION_ACTION_TYPES.LxpAnnouncementReminderOnFeed === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpAnnouncementReminder"
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 5.  Lxp user base shoutOut , Shout-Out Kate Wilson gave you a shout-out for your outstanding efforts!
  if (NOTIFICATION_ACTION_TYPES.LxpCommentOnPost === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpCommentOnPost"
        values={{ actor: name }}
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // 6.  schedule post . your post is scheduled .
  if (NOTIFICATION_ACTION_TYPES.LxpPostScheduled === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpPostScheduled"
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 7.  schedule pre Publish post . your post going live in 1 hour ...
  if (NOTIFICATION_ACTION_TYPES.LxpPostSchedulePrePublish === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpSchedulePrePublishPost"
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 8. schedule post Publish post . your post is live now ...
  if (NOTIFICATION_ACTION_TYPES.LxpPostSchedulePostPublish === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpSchedulePostPublishPost"
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  //9 . replied on comment
  if (NOTIFICATION_ACTION_TYPES.LxpRepliedOnFeedComment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpRepliedOnComment"
        values={{ actor: name }}
        isLxpRoute
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
          actionType,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  //leran notification===============================================================
  if (NOTIFICATION_ACTION_TYPES.ReportGenerated === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reportGenerated"
        values={{
          reportName: deletedTargetName,
          trainingType: t(`reportsType.${camelCase(target2Type)}`),
          oc:
            additionalInfo && additionalInfo.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={
          isLearn
            ? `/user/reports/${targetId1}/download`
            : `/reports/${targetId1}/download`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UserAdd === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userInvited"
        values={{ newUser: deletedTargetName, actor: name }}
        linkTo={isLearn ? '/user' : `/users/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UserDelete === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userDeleted"
        values={{ user: deletedTargetName, actor: name }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.TeamDelete === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.teamDeleted"
        values={{ team: deletedTargetName, actor: name }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AddManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.managerAdded"
        values={{ teamName: deletedTargetName, actor: name }}
        linkTo={`/teams/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RemoveManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.managerRemoved"
        values={{ teamName: deletedTargetName, actor: name }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseOverdued === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseOverdue"
        values={{ courseName: deletedTargetName, assigneeName: name }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearningPathOverdued === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathOverdue"
        values={{ pathName: deletedTargetName, assigneeName: name }}
        linkTo={
          isLearn ? `/user/paths/${targetId1}/detail` : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SingleCourseReminder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.singleCourseReminder"
        values={{
          courseName: deletedTargetName,
          periods,
          count: periods,
          timeUnit: i18n.t('timeUnits.day', { count: periods }),
        }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventReminder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventReminder"
        values={{ eventName: deletedTargetName }}
        linkTo={isLearn && `/user/events/${targetId1}/detail`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RecurringEventReminderLearner === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.recurringEventReminderForLearner"
        values={{ eventName: deletedTargetName, periods, count: periods }}
        linkTo={isLearn && `/user/events/${targetId1}/detail`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.RecurringEventReminderInstructor === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.recurringEventReminderForInstructor"
        values={{ eventName: deletedTargetName, count: periods, periods }}
        linkTo={isLearn && `/user/events/${targetId1}/detail`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.StartEventReminderLearner === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventStartReminderForLearner"
        values={{ eventName: deletedTargetName }}
        linkTo={isLearn && `/user/events/${targetId1}/detail`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.StartEventReminderInstructor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventStartReminderForInstructor"
        values={{ eventName: deletedTargetName }}
        linkTo={isLearn && `/user/events/${targetId1}/detail`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RecurringCourseReminder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.recurringCourseReminder"
        values={{ courseName: deletedTargetName }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SinglePathReminder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathReminder"
        values={{
          pathName: deletedTargetName,
          count: periods,
          periods,
          timeUnit: i18n.t('timeUnits.day', { count: periods }),
        }}
        linkTo={
          isLearn ? `/user/paths/${targetId1}/detail` : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RecurringPathReminder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.recurringPathReminder"
        values={{ pathName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/paths/${targetId1}/detail` : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseCompleted === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseCompleted"
        values={{ courseName: deletedTargetName, assigneeName: name }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventComplete === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventCompleted"
        values={{ eventName: deletedTargetName, assigneeName: name }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearningPathCompleted === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathCompleted"
        values={{ pathName: deletedTargetName, assigneeName: name }}
        linkTo={
          isLearn ? `/user/paths/${targetId1}/detail` : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ArchiveCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseArchived"
        values={{ courseName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ArchiveLearningPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathArchived"
        values={{ pathName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AssignTeamUserToCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.assignTeamUserToCourse"
        values={{ periods, actor: name }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AssessmentFailed === actionType) {
    const source = additionalInfo && additionalInfo.sourceType;
    const isRedirectInfoExists =
      additionalInfo &&
      hasIn(additionalInfo, 'assessmentId') &&
      hasIn(additionalInfo, 'attempt');
    return (
      <NotificationTitle
        i18nKey="notifications.assessmentFailed"
        linkTo={
          source === 'Course'
            ? isLearn
              ? `/user/courses/${targetId1}/detail`
              : isRedirectInfoExists
              ? `/assessments/${additionalInfo.assessmentId}/users/${actorId}/summary?attempt=${additionalInfo.attempt}`
              : `/courses/${targetId1}`
            : isLearn
            ? `/user/events/${targetId1}/detail`
            : isRedirectInfoExists
            ? `/assessments/${additionalInfo.assessmentId}/users/${actorId}/summary?attempt=${additionalInfo.attempt}`
            : `/events/${targetId1}`
        }
        values={{
          assigneeName: name,
          trainingType: i18n.t(`page.${camelCase(source)}`),
          trainingName: deletedTargetName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseExpire === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseExpired"
        values={{
          courseName: deletedTargetName,
          count: periods,
          days: periods,
        }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventCancelled === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventCancelled"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn
            ? '/not-found?event-error=eventCancelled'
            : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseAssigned === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseAssigned"
        values={{ courseName: deletedTargetName }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseSharedWithBranch === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseSharedWithBranch"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo="/courses?tab=PUBLISHED"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LPSharedWithBranch === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathSharedWithBranch"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo="/paths?tab=PUBLISHED"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventSharedWithBranch === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventSharedWithBranch"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo="/events/upcoming"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseUnSharedWithBranch === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseUnSharedWithBranch"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo="/courses"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LPUnSharedWithBranch === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathUnSharedWithBranch"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo="/paths"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventUnShareWithBranch === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventUnSharedWithBranch"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo="/events"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UserInvitedToBranch === actionType) {
    const orgName = additionalInfo && additionalInfo.organizationName;

    return (
      <NotificationTitle
        i18nKey="notifications.userInvitedToBranch"
        values={{ orgName: orgName || '' }}
        linkTo="/select-branch"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EcommerceEnabled === actionType) {
    return <NotificationTitle i18nKey="notifications.ecommerceEnabled" />;
  }
  if (NOTIFICATION_ACTION_TYPES.EcommerceDisabled === actionType) {
    return <NotificationTitle i18nKey="notifications.disabledEcommerce" />;
  }
  if (NOTIFICATION_ACTION_TYPES.LogisticsDisabled === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.disabledLogistics"
        values={{ logistic: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EcommerceContentPurchase === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.contentPurchased"
        values={{ actor: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // if (NOTIFICATION_ACTION_TYPES.EcommerceContentAssigned === actionType) {
  //   return (
  //     <NotificationTitle
  //       i18nKey="notifications.paidContentAssigned"
  //       values={{
  //         amount: getCurrency(currency, additionalInfo.orderTotalAmount),
  //         orderId: additionalInfo.orderUniqueKey,
  //       }}
  //       components={[<NotificationText bold viewInline />]}
  //     />
  //   );
  // }
  if (NOTIFICATION_ACTION_TYPES.EcommerceDiscountExpired === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.discountExpired"
        values={{ training: deletedTargetName }}
        linkTo={
          target1Type === 'Course'
            ? `/courses/${targetId1}`
            : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EcommerceCurrencyChanged === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.currencyChanged"
        values={{ currency: CURRENCY_NAMES.additionalInfo.currency }}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventAssigned === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventAssigned"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AddInstructor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.instructorAdded"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearningPathAssigned === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathAssigned"
        values={{ pathName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/paths/${targetId1}/detail` : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.PublicCourse === actionType ||
    NOTIFICATION_ACTION_TYPES.PrivateCourse === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseUpdated"
        values={{ courseName: deletedTargetName }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UpdateSharedCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseUpdated"
        values={{ courseName: deletedTargetName }}
        linkTo={
          isLearn
            ? `/user/courses/${targetId1}/detail`
            : `/courses/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UpdateSharedPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathUpdated"
        values={{ pathName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/paths/${targetId1}/detail` : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventUpdated === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventUpdated"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UpdatedCoupon === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponUpdated"
        values={{ couponName: deletedTargetName }}
        linkTo={`/coupons/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UpdatedSharedCoupon === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponUpdated"
        values={{ couponName: deletedTargetName }}
        linkTo={`/coupons/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.DeactivateCoupon === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponDeactivated"
        values={{ couponName: deletedTargetName }}
        linkTo={`/coupons/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.DeactivateSharedCoupon === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponDeactivated"
        values={{ couponName: deletedTargetName }}
        linkTo={`/coupons/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CouponToExpire === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponToExpire"
        values={{ couponName: deletedTargetName, periods }}
        linkTo={`/coupons/${targetId1}/edit`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CouponExpired === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponExpired"
        values={{ couponName: deletedTargetName }}
        linkTo={`/coupons/${targetId1}/edit`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.CouponRedemption === actionType ||
    NOTIFICATION_ACTION_TYPES.SharedCouponRedemption === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponRedemptionReminder"
        values={{ couponName: deletedTargetName, periods }}
        linkTo={`/coupons/${targetId1}/edit`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.PublishCoupon === actionType ||
    NOTIFICATION_ACTION_TYPES.PublishSharedCoupon === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponPublished"
        values={{ couponName: deletedTargetName, periods }}
        linkTo={`/coupons/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.BulkCouponToExpire === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponToExpireBulk"
        values={{
          count: additionalInfo.count,
          periods,
          coupons: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo={`/coupons/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.BulkCouponExpired === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.couponExpiredBulk"
        values={{
          count: additionalInfo.count,
          coupons: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventAttendanceSummary === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventAttendanceSummary"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventTakeAssessment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventTakeAssessment"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventAssessmentRemainder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventTakeAssessmentReminder"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventSubscriptionElapsed === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventSubscriptionElapsed"
        values={{ eventName: deletedTargetName }}
        linkTo={`/events/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventCapacityExhausted === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventCapacityExhausted"
        values={{ eventName: deletedTargetName }}
        linkTo={`/events/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventDateUpdated === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventDateUpdated"
        values={{
          eventName: deletedTargetName,
          newDate: formatDateWithTimeZone(
            additionalInfo.newStartDate,
            'Do MMM',
          ),
          newStartTime: formatDateWithTimeZone(
            additionalInfo.newStartDate,
            'hh:mm a',
          ),
          newEndTime: formatDateWithTimeZone(
            additionalInfo.newEndDate,
            'hh:mm a',
          ),
        }}
        linkTo={`/events/${targetId1}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SubmitAssessment === actionType) {
    const source = additionalInfo && additionalInfo.sourceType;
    return (
      <NotificationTitle
        i18nKey="notifications.assessmentSubmitted"
        values={{ assigneeName: name, trainingName: deletedTargetName }}
        linkTo={
          source === 'Course'
            ? isLearn
              ? `/user/courses/${targetId1}/detail`
              : `/courses/${targetId1}/evaluations`
            : isLearn
            ? `/user/events/${targetId1}/detail`
            : `/events/${targetId1}/evaluations`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EvaluationCompleted === actionType) {
    const { sourceType: source, attempt, assessmentId } = additionalInfo || {};
    const param =
      isLearn && assessmentId && attempt
        ? `?assessmentId=${assessmentId}&attempt=${attempt}`
        : '';

    return (
      <NotificationTitle
        i18nKey="notifications.evaluationCompleted"
        values={{ trainingName: deletedTargetName }}
        linkTo={
          source === 'Course'
            ? isLearn
              ? `/user/courses/${targetId1}/summary${param}`
              : `/courses/${targetId1}`
            : isLearn
            ? `/user/events/${targetId1}/summary${param}`
            : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.EventPublished === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.eventPublished"
        values={{ eventName: deletedTargetName, creator: name }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearningPathUpdated === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathUpdated"
        values={{ pathName: deletedTargetName }}
        linkTo={
          isLearn
            ? `/user/paths/${targetId1}/detail`
            : `/user/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AssignCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.certificateAssigned"
        values={{ certificate: deletedTargetName }}
        linkTo={
          additionalInfo &&
          additionalInfo.sourceType === LEARNING_TYPE.course.category
            ? `/user/viewcertificate/${additionalInfo.certificateId}?source=course`
            : additionalInfo.sourceType === LEARNING_TYPE.path.category
            ? `/user/viewcertificate/${additionalInfo.certificateId}?source=path`
            : `/user/viewcertificate/${additionalInfo.certificateId}?source=event`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.LearnerCertificateExpirationRemainder ===
    actionType
  ) {
    return target1Type !== CERTIFICATE ? (
      <NotificationTitle
        i18nKey="notifications.certificateExpirationReminder"
        values={{ certificate: deletedTargetName, periods }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    ) : (
      <NotificationTitle
        i18nKey="notifications.externalCertificateExpirationReminder"
        values={{ certificate: deletedTargetName, periods }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.AdminCertificateExpirationRemainder === actionType
  ) {
    return target1Type !== CERTIFICATE ? (
      <NotificationTitle
        i18nKey="notifications.adminCertificateExpirationReminder"
        values={{ certificate: deletedTargetName, periods, assigneeName: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    ) : (
      <NotificationTitle
        i18nKey="notifications.externalAdminCertificateExpirationReminder"
        values={{ certificate: deletedTargetName, periods, assigneeName: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearnerCertificateExpired === actionType) {
    return target1Type !== CERTIFICATE ? (
      <NotificationTitle
        i18nKey="notifications.certificateExpirationReminderToday"
        values={{ certificate: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    ) : (
      <NotificationTitle
        i18nKey="notifications.externalCertificateExpirationReminderToday"
        values={{ certificate: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AdminCertificateExpired === actionType) {
    return target1Type !== CERTIFICATE ? (
      <NotificationTitle
        i18nKey="notifications.adminCertificateExpirationReminderToday"
        values={{ certificate: deletedTargetName, assigneeName: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    ) : (
      <NotificationTitle
        i18nKey="notifications.externalAdminCertificateExpirationReminderToday"
        values={{ certificate: deletedTargetName, assigneeName: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AddExternalCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateAdded"
        values={{ certificate: deletedTargetName, actor: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UpdateExternalCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateUpdated"
        values={{ certificate: deletedTargetName, actor: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.DeleteExternalCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateDeleted"
        values={{ certificate: deletedTargetName, actor: name }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ApprovedExternalCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateApproved"
        values={{ certificate: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RejectedExternalCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateRejected"
        values={{ certificate: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ApprovalExternalCertificate === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateForApproval"
        values={{
          certificate: deletedTargetName,
          actor: name,
          username:
            additionalInfo && additionalInfo.userName
              ? `${additionalInfo.userName}'s`
              : '',
        }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.ApprovalReminderExternalCertificate === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.externalCertificateApprovalReminder"
        values={{
          count:
            additionalInfo && additionalInfo.count ? additionalInfo.count : '0',
        }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.NotificationLPEventSeatFillingFast === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.notificationLPEventSeatFillingFast"
        values={{ eventName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearnerCourseOverdue === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.learnerCourseOverdue"
        values={{ courseName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CourseOverdueByXDays === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseOverdueByXDays"
        values={{ courseName: deletedTargetName, days: periods }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearnerLearningPathOverdue === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.learnerLearningPathOverdue"
        values={{ pathName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LearningPathOverdueByXDays === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.learningPathOverdueByXDays"
        values={{ pathName: deletedTargetName, days: periods }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.NotificationLPEventCapacityExhausted ===
    actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.notificationLPEventCapacityExhausted"
        values={{ eventName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.NotificationOnUnavailableMandatoryTraining ===
    actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.notificationOnUnavailableMandatoryTraining"
        values={{ pathName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.NotificationOnUnavailableOptionalTraining ===
    actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.notificationOnUnavailableOptionalTraining"
        values={{ pathName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Feedback
  if (NOTIFICATION_ACTION_TYPES.FeedbackSubmitted === actionType) {
    const {
      feedbackCount,
      lastUserInfo: { fullName },
    } = additionalInfo;
    return (
      <NotificationTitle
        i18nKey={
          feedbackCount <= 1
            ? 'notifications.feedbackSubmitted'
            : 'notifications.feedbackSubmittedBulk'
        }
        values={{
          actor: fullName,
          training: deletedTargetName,
          count: feedbackCount - 1,
        }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.FeedbackSubmitSingleReminder === actionType ||
    NOTIFICATION_ACTION_TYPES.FeedbackSubmitReminder === actionType
  ) {
    return (
      <NotificationTitle
        linkTo={{
          pathname: getSourceRoute(isLearn, target1Type, targetId1),
          state: { openFeedbackPopup: true },
        }}
        values={{ trainingName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
        i18nKey="notifications.feedbackReminder"
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.OrderItemsProcessed === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.orderItemsProcessed"
        linkTo="/user?tab=ENROLLED"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Survey
  if (NOTIFICATION_ACTION_TYPES.SurveySubmitted === actionType) {
    const {
      surveyRespondentsCount,
      lastUserInfo: { fullName },
    } = additionalInfo;
    return (
      <NotificationTitle
        i18nKey={
          surveyRespondentsCount <= 1
            ? 'notifications.surveySubmitted'
            : 'notifications.surveySubmittedBulk'
        }
        values={{
          actor: fullName,
          training: deletedTargetName,
          count: surveyRespondentsCount - 1,
        }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Forums Notifications
  if (NOTIFICATION_ACTION_TYPES.SocialLikeOnPost === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userLikedPost"
        values={{ actor: name, post: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialLikeOnComment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userLikedComment"
        values={{ actor: name, comment: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialLikeOnReply === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userLikedReply"
        values={{ actor: name, reply: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialReplyOnComment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userRepliedOnComment"
        values={{ actor: name, comment: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialReplyOnPost === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userRepliedOnPost"
        values={{ actor: name, post: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialCommentOnPost === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userCommentOnPost"
        values={{ actor: name, post: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialMentionOnPost === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userMentionedOnPost"
        values={{ actor: name, post: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialMentionOnComment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userMentionedOnComment"
        values={{ actor: name, comment: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialMentionOnReply === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userMentionedOnReply"
        values={{ actor: name, reply: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialFlagOnPostAuthor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userPostFlagged"
        values={{ actor: name, post: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialFlagOnCommentAuthor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userCommentFlagged"
        values={{ actor: name, comment: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialFlagOnReplyAuthor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userReplyFlagged"
        values={{ actor: name, reply: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialFlagOnPostAdmin === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.postFlaggedAdmin"
        values={{ actor: name, post: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialFlagOnCommentAdmin === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.commentFlaggedAdmin"
        values={{ actor: name, comment: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialFlagOnReplyAdmin === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.replyFlaggedAdmin"
        values={{ actor: name, reply: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialAddedToForum === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userAddedToForum"
        values={{ forum: deletedTargetName }}
        linkTo={`${isLearn ? '/user' : ''}/forums/${
          additionalInfo.forum.id
        }/posts`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialPollReminder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pollReminder"
        values={{ poll: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.SocialPollExpired === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pollExpired"
        values={{ poll: deletedTargetName }}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // Tasks Notifications
  if (NOTIFICATION_ACTION_TYPES.TasksNotificationOnAssigned === actionType) {
    const {
      metadata: { role = TASK_CONFIG_ROLES.assignee },
      source: { scope },
    } = additionalInfo;
    const viewerRedirectUrl = `${isLearn ? '/user' : ''}/tasks/${targetId1}${
      scope === TASK_CREATION_SCOPE.global
        ? '/viewer/insights'
        : '/viewer/detail'
    }`;
    const reviewerRedirectUrl = `${isLearn ? '/user' : ''}/tasks/${targetId1}${
      scope === TASK_CREATION_SCOPE.global
        ? '/reviewer/insights'
        : '/reviewer/detail'
    }`;
    if (role === TASK_CONFIG_ROLES.assignee) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskAssignedAsAssignee"
          values={{
            actor: name,
            task: deletedTargetName,
            oc:
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={`${
            isLearn ? '/user' : ''
          }/tasks/${targetId1}/assignee/detail`}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    if (role === TASK_CONFIG_ROLES.viewer) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskAssignedAsViewer"
          values={{
            actor: name,
            task: deletedTargetName,
            oc:
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={viewerRedirectUrl}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    if (role === TASK_CONFIG_ROLES.reviewer) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskAssignedAsReviewer"
          values={{
            actor: name,
            task: deletedTargetName,
            oc:
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={reviewerRedirectUrl}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
  }
  if (NOTIFICATION_ACTION_TYPES.TasksNotificationOnSubmission === actionType) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    const {
      metadata: { role = TASK_CONFIG_ROLES.reviewer },
    } = additionalInfo;

    if (role === TASK_CONFIG_ROLES.viewer) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskSubmittedViewer"
          values={{
            actor: name,
            taskType: isSubTask
              ? t('notifications.subTask')
              : t('notifications.task'),
            oc:
              !isSubTask &&
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
            taskTypeName: deletedTargetName,
            parent: isSubTask ? additionalInfo.parent.title : '',
          }}
          linkTo={getTasksRoute(
            isLearn,
            target1Type,
            targetId1,
            additionalInfo,
          )}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    if (role === TASK_CONFIG_ROLES.reviewer) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskSubmittedReviewer"
          values={{
            actor: name,
            taskType: isSubTask
              ? t('notifications.subTask')
              : t('notifications.task'),
            oc:
              !isSubTask &&
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
            taskTypeName: deletedTargetName,
            parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
          }}
          linkTo={getTasksRoute(
            isLearn,
            target1Type,
            targetId1,
            additionalInfo,
          )}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnStatusChange === actionType
  ) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    return (
      additionalInfo &&
      additionalInfo.metadata &&
      additionalInfo.metadata.status && (
        <NotificationTitle
          i18nKey="notifications.taskStatusChange"
          values={{
            actor: name,
            taskType: isSubTask
              ? t('notifications.subTask')
              : t('notifications.task'),
            oc:
              !isSubTask &&
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
            taskTypeName: deletedTargetName,
            parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
            status: i18n.t(getTaskStatus(additionalInfo.metadata.status).name),
          }}
          linkTo={getTasksRoute(
            isLearn,
            target1Type,
            targetId1,
            additionalInfo,
          )}
          components={[<NotificationText bold viewInline />]}
        />
      )
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationChecklistCompleted === actionType
  ) {
    const {
      metadata: {
        role = TASK_CONFIG_ROLES.assignee,
        assignee: { firstName },
      },
    } = additionalInfo;
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    if (role === TASK_CONFIG_ROLES.assignee) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskCompletedAssignee"
          values={{
            taskType: isSubTask
              ? t('notifications.subTask')
              : t('notifications.task'),
            oc:
              !isSubTask &&
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
            taskTypeName: deletedTargetName,
            parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
          }}
          linkTo={getTasksRoute(
            isLearn,
            target1Type,
            targetId1,
            additionalInfo,
          )}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    return (
      <NotificationTitle
        i18nKey="notifications.taskCompleted"
        values={{
          actor: firstName,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          oc:
            !isSubTask &&
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.TasksNotificationOnRework === actionType) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    return (
      <NotificationTitle
        i18nKey="notifications.taskRework"
        values={{
          actor: name,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          oc:
            !isSubTask &&
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.TasksNotificationOnOverdue === actionType) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    if (userId === user.id) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskOverdueForYou"
          values={{
            taskType: isSubTask
              ? t('notifications.subTaskCap')
              : t('notifications.taskCap'),
            taskTypeName: deletedTargetName,
            parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
            oc:
              !isSubTask &&
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={getTasksRoute(
            isLearn,
            target1Type,
            targetId1,
            additionalInfo,
          )}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    return (
      <NotificationTitle
        i18nKey="notifications.taskOverdueForUser"
        values={{
          assigneeName: name,
          taskType: isSubTask
            ? t('notifications.subTaskCap')
            : t('notifications.taskCap'),
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
          oc:
            !isSubTask &&
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.TasksNotificationOnComment === actionType) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    return (
      <NotificationTitle
        i18nKey="notifications.userCommentOnTask"
        values={{
          actor: name,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          oc:
            !isSubTask &&
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnMention === actionType ||
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnMentionAdmin === actionType
  ) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    return (
      <NotificationTitle
        i18nKey="notifications.userMentionedOnTask"
        values={{
          actor: name,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          oc:
            !isSubTask &&
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationAssigneeUpdateResponse ===
    actionType
  ) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    return (
      <NotificationTitle
        i18nKey="notifications.responseUpdatedInTask"
        values={{
          actor: name,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          oc:
            !isSubTask &&
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationReviewerUpdateReview ===
    actionType
  ) {
    const isSubTask =
      additionalInfo && additionalInfo.parent && additionalInfo.parent.title;
    return (
      <NotificationTitle
        i18nKey="notifications.reviewerUpdatedReviewInTask"
        values={{
          actor: name,
          taskTypeName: deletedTargetName,
          parent: isSubTask ? ` (${additionalInfo.parent.title})` : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.TaskNotificationOnEdit === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.taskEdited"
        values={{
          task: deletedTargetName,
          actor: name,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={`/tasks/${targetId1}/edit`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.TaskNotificationOnDelete === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.taskDeleted"
        values={{
          task: deletedTargetName,
          actor: name,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  if (NOTIFICATION_ACTION_TYPES.TaskReassign === actionType) {
    const {
      metadata: { role = TASK_CONFIG_ROLES.assignee },
      source: { scope },
    } = additionalInfo;
    const viewerRedirectUrl = `${isLearn ? '/user' : ''}/tasks/${targetId1}${
      scope === TASK_CREATION_SCOPE.global
        ? '/viewer/insights'
        : '/viewer/detail'
    }`;
    const reviewerRedirectUrl = `${isLearn ? '/user' : ''}/tasks/${targetId1}${
      scope === TASK_CREATION_SCOPE.global
        ? '/reviewer/insights'
        : '/reviewer/detail'
    }`;
    if (role === TASK_CONFIG_ROLES.assignee) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskReassign"
          values={{
            actor: name,
            task: deletedTargetName,
            oc:
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={`${
            isLearn ? '/user' : ''
          }/tasks/${targetId1}/assignee/detail`}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    if (role === TASK_CONFIG_ROLES.viewer) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskReassign"
          values={{
            actor: name,
            task: deletedTargetName,
            oc:
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={viewerRedirectUrl}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
    if (role === TASK_CONFIG_ROLES.reviewer) {
      return (
        <NotificationTitle
          i18nKey="notifications.taskReassign"
          values={{
            actor: name,
            task: deletedTargetName,
            oc:
              additionalInfo &&
              additionalInfo.metadata &&
              additionalInfo.metadata.isObservationChecklist
                ? ` (${i18n.t('task:observationChecklist.title')})`
                : '',
          }}
          linkTo={reviewerRedirectUrl}
          components={[<NotificationText bold viewInline />]}
        />
      );
    }
  }
  if (NOTIFICATION_ACTION_TYPES.AssignAsReportingManager === actionType) {
    return (
      <NotificationTitle
        i18nKey={
          additionalInfo.reporteesCount === 1
            ? 'notifications.addedAsReportingManagerForSingleUser'
            : 'notifications.addedAsReportingManagerForMultipleUsers'
        }
        values={{
          userName: deletedTargetName,
          actor: name,
          count: additionalInfo.reporteesCount - 1,
        }}
        linkTo={
          additionalInfo.reporteesCount === 1
            ? `/users/${targetId1}`
            : '/peoples?tab=individuals&showDirectReportee=true'
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RemoveAsReportingManager === actionType) {
    return (
      <NotificationTitle
        i18nKey={
          additionalInfo.reporteesCount === 1
            ? 'notifications.removedAsReportingManagerForSingleUser'
            : 'notifications.removedAsReportingManagerForMultipleUsers'
        }
        values={{
          userName: deletedTargetName,
          actor: name,
          count: additionalInfo.reporteesCount - 1,
        }}
        linkTo={
          additionalInfo.reporteesCount === 1
            ? additionalInfo.userInfo && !additionalInfo.userInfo.isAccessible
              ? null
              : `/users/${targetId1}`
            : '/peoples?tab=individuals&showDirectReportee=true'
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AssignReportingManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.assignedReportingManager"
        linkTo="/user/settings"
        values={{ userName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.RemoveReportingManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.removedReportingManager"
        linkTo="/user/settings"
        values={{ userName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Tasks/OC - Added in 3.9
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnSubtaskAddedAssignee ===
    actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.subtaskAddedForUser"
        values={{
          // task: deletedTargetName,
          actor: name,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnSubtaskUpdatedAssignee ===
    actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.subtaskUpdatedForUser"
        values={{
          actor: name,
          // task: deletedTargetName,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnSubtaskAdded === actionType
  ) {
    const { metadata } = additionalInfo;
    const { assignee } = metadata;
    const { firstName } = assignee;

    return (
      <NotificationTitle
        i18nKey="notifications.subtaskAddedForAssignee"
        values={{
          actor: name,
          // task: deletedTargetName,
          assigneeName: firstName,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnSubtaskUpdate === actionType
  ) {
    const { metadata } = additionalInfo;
    const { assignee } = metadata;
    const { firstName } = assignee;

    return (
      <NotificationTitle
        i18nKey="notifications.subtaskUpdatedForAssignee"
        values={{
          actor: name,
          // task: deletedTargetName,
          assigneeName: firstName,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnReviwerSubmitResponse ===
    actionType
  ) {
    const { metadata } = additionalInfo;
    const { assignee } = metadata;
    const { firstName } = assignee;
    const isSubTask = target1Type === TASK_CATEGORIES.subtask;
    return (
      <NotificationTitle
        i18nKey="notifications.taskCompletedForAssignee"
        values={{
          actor: name,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          assigneeName: firstName,
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.TasksNotificationOnReviewerSubmitResponseAssignee ===
    actionType
  ) {
    const isSubTask = target1Type === TASK_CATEGORIES.subtask;

    return (
      <NotificationTitle
        i18nKey="notifications.taskCompletedForUser"
        values={{
          actor: name,
          taskType: isSubTask
            ? t('notifications.subTask')
            : t('notifications.task'),
          oc:
            additionalInfo &&
            additionalInfo.metadata &&
            additionalInfo.metadata.isObservationChecklist
              ? ` (${i18n.t('task:observationChecklist.title')})`
              : '',
        }}
        linkTo={getTasksRoute(isLearn, target1Type, targetId1, additionalInfo)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Mentorship

  // Admin notifications
  if (NOTIFICATION_ACTION_TYPES.ProgramEnrollment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.programEnrollment"
        linkTo={
          target1Type === 'MenteeProgram'
            ? `/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`
            : `/programs/${additionalInfo.program.id}/mentors/${actorId}/detail`
        }
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.NominationRequest === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.nominationRequest"
        linkTo={`/mentorship/admin?tab=requests&type=nominations&requestId=${additionalInfo.metadata.requestId}`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorChangeRequestAdmin === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorChangeRequestAdmin"
        linkTo={`/mentorship/admin?tab=requests&type=pairing&requestId=${additionalInfo.metadata.requestId}`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorCancelChangeRequest === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorCancelChangeRequest"
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorExitProgram === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorExitProgram"
        linkTo={`/programs/${additionalInfo.program.id}?tab=ENROLLMENTS`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Mentee notifications
  if (NOTIFICATION_ACTION_TYPES.InviteMenteeToProgram === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.inviteMenteeToProgram"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeJoinRequestApproval === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeJoinRequestApproval"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ProgramJoinRequestRejection === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.programJoinRequestRejection"
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.PairingRequestApprovalMentee === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pairingRequestApprovalMentee"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.AdminPairingRequestRejection === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.adminPairingRequestRejection"
        linkTo={`${
          isLearn ? '/user' : ''
        }/mentee/programs/${targetId1}/detail?showRejectedRequest=true`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorPairingRequestRejection === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorPairingRequestRejection"
        linkTo={`${
          isLearn ? '/user' : ''
        }/mentee/programs/${targetId1}/detail?showRejectedRequest=true`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.NominationsApproval === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.nominationsApproval"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.NominationsRejected === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.nominationsRejected"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorMeetingRequestApproval === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorMeetingRequestApproval"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${
          additionalInfo.source.id
        }/detail?meetingId=${targetId1}`}
        values={{
          mentorName: name,
          meetingTitle: deletedTargetName,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorSchedulesMeeting === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorSchedulesMeeting"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${
          additionalInfo.source.id
        }/detail?meetingId=${targetId1}`}
        values={{
          actor: name,
          meetingTitle: deletedTargetName,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorReschedulesMeeting === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorReschedulesMeeting"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${
          additionalInfo.source.id
        }/detail?meetingId=${targetId1}`}
        values={{
          actor: name,
          meetingTitle: deletedTargetName,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorAddingMeetingNotes === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorAddingMeetingNotes"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${
          additionalInfo.source.id
        }/detail?meetingId=${targetId1}&showMentorMeetingNotes=true&milestoneId=${
          additionalInfo.metadata.milestoneId
        }`}
        values={{
          meetingTitle: deletedTargetName,
          actor: name,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorFeedback === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorFeedback"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorFeedbackPending === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorFeedbackPending"
        linkTo={`${
          isLearn ? '/user' : ''
        }/mentee/programs/${targetId1}/detail?openMentorFeedback=true`}
        values={{ mentorName: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorChangeRejection === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorChangeRejection"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorChangeApproved === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorChangeApproved"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorUpdateProgramContent === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorUpdateProgramContent"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorAssignment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorAssignment"
        linkTo={`${isLearn ? '/user' : ''}/mentee/programs/${targetId1}/detail`}
        values={{
          mentorName: additionalInfo.metadata.mentor.fullName,
          programName: deletedTargetName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Mentor notifications
  if (NOTIFICATION_ACTION_TYPES.KickoffMeetingRequest === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.kickoffMeetingRequest"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.parent.id
        }/mentees/${actorId}/detail?meetingId=${targetId1}&milestoneId=${
          additionalInfo.metadata.milestoneId
        }`}
        values={{ actor: name, programName: additionalInfo.parent.title }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CreateGoalMentor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.createGoalMentor"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail?evaluateGoals=true`}
        values={{
          programName: deletedTargetName,
          menteeName: additionalInfo.metadata.mentee.fullName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.PreProgramFeedbackMentor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.preProgramFeedbackMentor"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail`}
        values={{
          programName: deletedTargetName,
          menteeName: additionalInfo.metadata.mentee.fullName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeAddingMeetingNotes === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeAddingMeetingNotes"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.parent.id
        }/mentees/${actorId}/detail?meetingId=${targetId1}&showMenteeMeetingNotes=true&milestoneId=${
          additionalInfo.metadata.milestoneId
        }`}
        values={{
          meetingTitle: deletedTargetName,
          actor: name,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeFeedback === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeFeedback"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail?openMenteeFeedback=true`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MilestoneCompletion === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.milestoneCompletion"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail`}
        values={{
          actor: name,
          milestoneTitle: deletedTargetName,
          programName: additionalInfo.program.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ProgramTrainingCompletion === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.programTrainingCompletion"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail`}
        values={{
          actor: name,
          trainingTitle: deletedTargetName,
          programName: additionalInfo.program.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.PairingRequestApprovalMentor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pairingRequestApprovalMentor"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${additionalInfo.metadata.mentee.id}/detail`}
        values={{
          actor: additionalInfo.metadata.mentee.fullName,
          programName: deletedTargetName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.UpdateAdminProgram === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.updateAdminProgram"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorJoinRequestApproval === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorJoinRequestApproval"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${targetId1}/detail`}
        values={{ programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorChangeApprovedMentor === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorChangeApprovedMentor"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail`}
        values={{
          programName: deletedTargetName,
          menteeName: additionalInfo.metadata.mentee.fullName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.InviteMentorToProgram === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.inviteMentorToProgram"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${targetId1}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeSchedulesMeeting === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeSchedulesMeeting"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.parent.id
        }/mentees/${actorId}/detail?meetingId=${targetId1}`}
        values={{
          actor: name,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeReschedulesMeeting === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeReschedulesMeeting"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.parent.id
        }/mentees/${actorId}/detail?meetingId=${targetId1}`}
        values={{
          actor: name,
          meetingTitle: deletedTargetName,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.OverdueMilestone === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.overdueMilestone"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail`}
        values={{
          menteeName: name,
          milestoneName: deletedTargetName,
          programName: additionalInfo.program.title,
          days: periods,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeFeedbackPending === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeFeedbackPending"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail?openMenteeFeedback=true`}
        values={{ menteeName: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ProgramCompletion === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.programCompletion"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${
          additionalInfo.program.id
        }/mentees/${actorId}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteeExitProgram === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteeExitProgram"
        linkTo={`${
          isLearn ? '/user' : ''
        }/mentor/programs/${targetId1}/detail?tab=MENTEES`}
        values={{ menteeName: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MenteesAssignment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.menteesAssignment"
        linkTo={`${isLearn ? '/user' : ''}/mentor/programs/${targetId1}/detail`}
        values={{
          menteeName: additionalInfo.metadata.mentee.fullName,
          programName: deletedTargetName,
          count: additionalInfo.metadata.menteesCount,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  if (NOTIFICATION_ACTION_TYPES.MentorReceivedPairingRequest === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorReceivedPairingRequest"
        linkTo={`${isLearn ? '/user' : ''}/mentor/dashboard?pairingRequestId=${
          additionalInfo.metadata.requestId
        }`}
        values={{
          menteeName: additionalInfo.metadata.mentee.fullName,
          programName: deletedTargetName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Reporting Manager notifications
  if (NOTIFICATION_ACTION_TYPES.ReporteeProgramEnrollment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reporteeProgramEnrollment"
        linkTo={
          target1Type === 'MenteeProgram'
            ? `/programs/${additionalInfo.program.id}/mentees/${additionalInfo.metadata.mentee.id}/detail`
            : `/programs/${additionalInfo.program.id}/mentors/${additionalInfo.metadata.mentee.id}/detail`
        }
        values={{ actor: name }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.MeetingScheduledReportingManager === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.meetingScheduledReportingManager"
        linkTo={`/mentorship/admin?tab=meetings&meetingId=${targetId1}`}
        values={{
          meetingTitle: deletedTargetName,
          menteeName: additionalInfo.metadata.mentee.fullName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.MeetingRescheduledReportingManager === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.meetingRescheduledReportingManager"
        linkTo={`/mentorship/admin?tab=meetings&meetingId=${targetId1}`}
        values={{
          meetingTitle: deletedTargetName,
          menteeName: additionalInfo.metadata.mentee.fullName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ReporteeAddingMeetingNotes === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reporteeAddingMeetingNotes"
        linkTo={`/programs/${additionalInfo.parent.id}/mentees/${actorId}/detail?meetingId=${targetId1}&showMenteeMeetingNotes=true&milestoneId=${additionalInfo.metadata.milestoneId}`}
        values={{
          actor: name,
          meetingTitle: deletedTargetName,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorFeedbackReportingManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorFeedbackReportingManager"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{
          actor: additionalInfo.metadata.mentee.fullName,
          mentorName: name,
          programName: deletedTargetName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.PreProgramFeedbackReportingManager === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.preProgramFeedbackReportingManager"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.NominationApprovedReportingManager === actionType
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.nominationApprovedReportingManager"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CreateGoalReportingManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.createGoalReportingManager"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ReporteeMeetingRequestApproval === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reporteeMeetingRequestApproval"
        linkTo={`/mentorship/admin?tab=meetings&meetingId=${targetId1}`}
        values={{
          actor: additionalInfo.metadata.mentee.fullName,
          mentorName: name,
          meetingTitle: deletedTargetName,
          programName: additionalInfo.parent.title,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ReporteeProgramCompletion === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reporteeProgramCompletion"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.OverdueReportees === actionType) {
    const singleUser = additionalInfo.count === 1;
    const twoUsers = additionalInfo.count === 2;
    const multipleUsers = additionalInfo.count > 2;
    return (
      <NotificationTitle
        i18nKey={
          singleUser
            ? 'notifications.overdueReportees'
            : twoUsers
            ? 'notifications.twoOverdueReportees'
            : 'notifications.multipleOverdueReportees'
        }
        values={{
          actorName:
            twoUsers || multipleUsers
              ? additionalInfo.sourceNames[0]
              : deletedTargetName,
          count: twoUsers ? additionalInfo.count - 1 : additionalInfo.count - 2,
          ...((twoUsers || multipleUsers) && {
            actor2Name: additionalInfo.sourceNames[1],
          }),
        }}
        linkTo="/insights?showOverdueUsersSection=true"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Team manager notifications
  if (NOTIFICATION_ACTION_TYPES.TeamMemberProgramEnrollment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.teamMemberProgramEnrollment"
        linkTo={
          target1Type === 'MenteeProgram'
            ? `/programs/${additionalInfo.program.id}/mentees/${additionalInfo.metadata.mentee.id}/detail`
            : `/programs/${additionalInfo.program.id}/mentors/${additionalInfo.metadata.mentee.id}/detail`
        }
        values={{ actor: name }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.MentorFeedbackTeamMember === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.mentorFeedbackTeamMember"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{
          actor: additionalInfo.metadata.mentee.fullName,
          mentorName: name,
          programName: deletedTargetName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ProgramCompletionTeamManager === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.programCompletionTeamManager"
        linkTo={`/programs/${additionalInfo.program.id}/mentees/${actorId}/detail`}
        values={{ actor: name, programName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.OverdueTeamMembers === actionType) {
    const singleUser = additionalInfo.count === 1;
    const twoUsers = additionalInfo.count === 2;
    const multipleUsers = additionalInfo.count > 2;
    return (
      <NotificationTitle
        i18nKey={
          singleUser
            ? 'notifications.overdueTeamMembers'
            : twoUsers
            ? 'notifications.twoOverdueTeamMembers'
            : 'notifications.multipleOverdueTeamMembers'
        }
        values={{
          teamName: deletedTargetName,
          actorName:
            twoUsers || multipleUsers
              ? additionalInfo.sourceNames[0]
              : deletedTargetName,
          count: twoUsers ? additionalInfo.count - 1 : additionalInfo.count - 2,
          ...((twoUsers || multipleUsers) && {
            actor2Name: additionalInfo.sourceNames[1],
          }),
        }}
        linkTo={`/teams/${targetId1}?tab=insights&trainingType=elearning`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // Stakeholder notification
  if (NOTIFICATION_ACTION_TYPES.NominationApprovedStakeholder === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.nominationApprovedStakeholder"
        linkTo={`${
          isLearn ? '/user' : ''
        }/mentorship/overview?stakeholderFeedback=${targetId1}`}
        values={{ actor: name, role: additionalInfo.metadata.nominationRole }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  /** Bulk Notifications */
  if (NOTIFICATION_ACTION_TYPES.BulkAssignCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseBulkAssigned"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo={`/user?tab=${LEARNER_YOUR_COURSES_TABS.assigned}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkArchiveCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.courseBulkArchived"
        values={{
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkAssignLearningPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathBulkAssigned"
        values={{
          actor: name,
          paths: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        linkTo={`/user?tab=${LEARNER_YOUR_COURSES_TABS.assigned}`}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkArchiveLearningPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathBulkArchived"
        values={{
          paths: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkDeleteUser === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.userBulkDeleted"
        values={{
          actor: name,
          users: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkAddManagerToTeam === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.managerAddedToTeam"
        values={{
          actor: name,
          teams: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkDeleteTeam === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.teamBulkDeleted"
        values={{
          actor: name,
          teams: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkArchiveSharedCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.sharedCoursesBulkArchived"
        values={{
          actor: name,
          courses: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.SyncCompleted === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.coursesSynced"
        values={{
          count: additionalInfo.count,
          provider: additionalInfo.providerName,
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CancelSchedulePath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.pathsScheduledCancelled"
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.SchedulePublish === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.trainingScheduledPublish"
        values={{
          training: deletedTargetName,
          date: formatDateWithTimeZone(additionalInfo.scheduledAt, 'Do MMM'),
          time: formatDateWithTimeZone(additionalInfo.scheduledAt, 'hh:mm a'),
        }}
        linkTo={
          additionalInfo.sourceType === 'Course'
            ? `/courses/${targetId1}`
            : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.PublishScheduled === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey={
          target1Type === 'course'
            ? 'notifications.coursePublishedScheduled'
            : 'notifications.pathPublishedScheduled'
        }
        values={{ training: deletedTargetName }}
        linkTo={
          target1Type === 'course'
            ? `/courses/${targetId1}`
            : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.BulkSchedulePublish === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.trainingScheduledPublishBulk"
        values={{
          trainings: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
          date: formatDateWithTimeZone(additionalInfo.scheduledAt, 'Do MMM'),
          time: formatDateWithTimeZone(additionalInfo.scheduledAt, 'hh:mm a'),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.BulkPublishScheduled === actionType &&
    additionalInfo
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.trainingPublishedScheduledBulk"
        values={{
          trainings: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (
    NOTIFICATION_ACTION_TYPES.BulkFailedPublishScheduled === actionType &&
    additionalInfo
  ) {
    const contentType =
      additionalInfo.sourceType === LEARNING_PATH ? 'base:path' : 'base:course';
    return (
      <NotificationTitle
        i18nKey={
          additionalInfo.sourceType === LEARNING_PATH
            ? 'notifications.pathPublishedScheduledFailed'
            : 'notifications.coursePublishedScheduledFailed'
        }
        values={{
          courseName: additionalInfo.sourceNames,
          trainingType: pluralize(
            i18n.t(contentType).toLowerCase(),
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.DuplicateLibrary === actionType) {
    return (
      <NotificationTitle
        data-testid="duplicate-content-notification"
        i18nKey="notifications.duplicateLibrary"
        values={{
          training: deletedTargetName,
          trainingType: i18n
            .t(target1Type === 'course' ? 'course' : 'path')
            .toLowerCase(),
        }}
        linkTo={
          target1Type === 'course'
            ? `/courses/${targetId1}`
            : `/paths/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkDuplicateLibrary === actionType) {
    return (
      <NotificationTitle
        data-testid="duplicate-content-bulk-notification"
        i18nKey="notifications.duplicateLibraryBulk"
        values={{
          trainings: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
          trainingType: i18n
            .t(target1Type === 'course' ? 'course' : 'path')
            .toLowerCase(),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.BulkArchiveSharedPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.bulkArchivedSharedPath"
        values={{
          trainings: getSourceList(
            additionalInfo.sourceNames,
            additionalInfo.count,
          ),
        }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ArchiveSharedCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.sharedCourseArchived"
        values={{ courseName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ArchiveSharedPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.sharedPathArchived"
        values={{ courseName: deletedTargetName }}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.CancelSharedEvent === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.cancelSharedEvent"
        values={{ eventName: deletedTargetName }}
        linkTo={
          isLearn ? `/user/events/${targetId1}/detail` : `/events/${targetId1}`
        }
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  /** End of Bulk Notifications */
  if (NOTIFICATION_ACTION_TYPES.ReassignCourse === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reassignCourse"
        values={{ courseName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.ReassignPath === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.reassignPath"
        values={{ pathName: deletedTargetName }}
        linkTo={getSourceRoute(isLearn, target1Type, targetId1)}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // LXP Notifications
  // 1.when mention on feed-post -> Actor Name mention on post
  if (
    NOTIFICATION_ACTION_TYPES.LxpMentionOnFeed === actionType &&
    target1Type === 'COMMENT'
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpuserMentionedOnComment"
        values={{ actor: name }}
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
          actionType,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 2.when mention on feed-comment -> Actor Name mention on comment
  if (
    NOTIFICATION_ACTION_TYPES.LxpMentionOnFeed === actionType &&
    target1Type === 'POST'
  ) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpuserMentionedOnPost"
        values={{ actor: name }}
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 3.Lxp user base shoutOut
  if (NOTIFICATION_ACTION_TYPES.ShoutOut === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpShoutOut"
        values={{ actor: name }}
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // 4. system generated lxp Announcement Please acknowledge our recent announcement.
  if (NOTIFICATION_ACTION_TYPES.LxpAnnouncementReminderOnFeed === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpAnnouncementReminder"
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 5.  Lxp user base shoutOut
  if (NOTIFICATION_ACTION_TYPES.LxpCommentOnPost === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpCommentOnPost"
        values={{ actor: name }}
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }

  // 6.  schedule post . your post is scheduled .
  if (NOTIFICATION_ACTION_TYPES.LxpPostScheduled === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpPostScheduled"
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 7.  schedule pre Publish post . your post going live in 1 hour ...
  if (NOTIFICATION_ACTION_TYPES.LxpPostSchedulePrePublish === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpSchedulePrePublishPost"
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 8. schedule post Publish post . your post is live now ...
  if (NOTIFICATION_ACTION_TYPES.LxpPostSchedulePostPublish === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpSchedulePostPublishPost"
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  // 9 . replied on comment
  if (NOTIFICATION_ACTION_TYPES.LxpRepliedOnFeedComment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpRepliedOnComment"
        values={{ actor: name }}
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
          actionType,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  if (NOTIFICATION_ACTION_TYPES.LxpRepliedOnFeedComment === actionType) {
    return (
      <NotificationTitle
        i18nKey="notifications.LxpPostScheduled"
        values={{ actor: name }}
        isLxpRoute
        isLearner={isLearn}
        linkTo={getSocialSourceRoute(
          isLearn,
          target1Type,
          targetId1,
          userId,
          additionalInfo,
          actionType,
        )}
        components={[<NotificationText bold viewInline />]}
      />
    );
  }
  return null;
};
