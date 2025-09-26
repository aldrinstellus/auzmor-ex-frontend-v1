import { FEED_PERMISSIONS } from "constants/permissions";

export const getFeedPermissions = (modulePermissions: string[] = []) => {
  const permissionsSet = new Set(modulePermissions);

  return {
    isReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_READ_ADMIN),
    isPostsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_CREATE_ADMIN),
    isPostsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_READ_ADMIN),
    isPostsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_UPDATE_ADMIN),
    isPostsScheduleAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SCHEDULE_ADMIN),
    isPostsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_DELETE_ADMIN),
    isShoutoutCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_CREATE_ADMIN),
    isShoutoutReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_READ_ADMIN),
    isShoutoutUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_UPDATE_ADMIN),
    isShoutoutDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_DELETE_ADMIN),
    isPollsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_CREATE_ADMIN),
    isPollsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_READ_ADMIN),
    isPollsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_UPDATE_ADMIN),
    isPollsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_DELETE_ADMIN),
    isAnnouncementsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_CREATE_ADMIN),
    isAnnouncementsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_READ_ADMIN),
    isAnnouncementsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_UPDATE_ADMIN),
    isAnnouncementsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_DELETE_ADMIN),
    isAnnouncementsAcknowledgeAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_ACKNOWLEDGE_ADMIN),
    isAnnouncementsReportsAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_REPORTS_ADMIN),
    isAnnouncementsRemindersAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_REMINDERS_ADMIN),
    isReactionsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REACTIONS_CREATE_ADMIN),
    isReactionsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REACTIONS_READ_ADMIN),
    isReactionsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REACTIONS_UPDATE_ADMIN),
    isReactionsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REACTIONS_DELETE_ADMIN),
    isBookmarksCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_BOOKMARKS_CREATE_ADMIN),
    isBookmarksDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_BOOKMARKS_DELETE_ADMIN),
    isCommentsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_CREATE_ADMIN),
    isCommentsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_READ_ADMIN),
    isCommentsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_UPDATE_ADMIN),
    isCommentsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_DELETE_ADMIN),
    isRepliesCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_CREATE_ADMIN),
    isRepliesReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_READ_ADMIN),
    isRepliesUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_UPDATE_ADMIN),
    isRepliesDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_DELETE_ADMIN),
  };
};

export const getLearnerFeedPermissions = (modulePermissions: string[] = []) => {
  const permissionsSet = new Set(modulePermissions);

  return {
    isReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_READ_LEARNER),
    isPostsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_CREATE_LEARNER),
    isPostsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_READ_LEARNER),
    isPostsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_UPDATE_LEARNER),
    isPostsScheduleAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SCHEDULE_LEARNER),
    isPostsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_DELETE_LEARNER),
    isShoutoutCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_CREATE_LEARNER),
    isShoutoutReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_READ_LEARNER),
    isShoutoutUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_UPDATE_LEARNER),
    isShoutoutDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_SHOUTOUT_DELETE_LEARNER),
    isPollsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_CREATE_LEARNER),
    isPollsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_READ_LEARNER),
    isPollsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_UPDATE_LEARNER),
    isPollsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_POLLS_DELETE_LEARNER),
    isAnnouncementsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_POSTS_ANNOUNCEMENTS_READ_LEARNER),
    isBookmarksCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_BOOKMARKS_CREATE_LEARNER),
    isBookmarksDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_BOOKMARKS_DELETE_LEARNER),
    isCommentsCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_CREATE_LEARNER),
    isCommentsReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_READ_LEARNER),
    isCommentsUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_UPDATE_LEARNER),
    isCommentsDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_COMMENTS_DELETE_LEARNER),
    isRepliesCreateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_CREATE_LEARNER),
    isRepliesReadAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_READ_LEARNER),
    isRepliesUpdateAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_UPDATE_LEARNER),
    isRepliesDeleteAllowed: permissionsSet.has(FEED_PERMISSIONS.FEEDS_REPLIES_DELETE_LEARNER),
  };
};
