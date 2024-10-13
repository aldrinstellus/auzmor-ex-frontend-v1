export const NOTIFICATION_ACTION_TYPES = {
  ShoutOut: 'NOTIFICATION_SHOUT_OUT',
  LxpCommentOnPost: 'NOTIFICATION_COMMENT_ON_FEED',
  LxpMentionOnFeed: 'NOTIFICATION_MENTION_ON_FEED',
  LxpAnnouncementReminderOnFeed:
    'NOTIFICATION_ACKNOWLEDGEMENT_REMINDER_ON_FEED',
  LxpPostSchedulePrePublish: 'NOTIFICATION_POST_SCHEDULE_PRE_PUBLISH_ON_FEED',
  LxpPostSchedulePostPublish: 'NOTIFICATION_POST_SCHEDULE_POST_PUBLISH_ON_FEED',
  UserAdd: 'NOTIFICATION_USER_ADD',
  UserDelete: 'NOTIFICATION_USER_DELETE',
  TeamDelete: 'NOTIFICATION_DELETE_TEAM',
  AddManager: 'NOTIFICATION_ADD_MANAGER_TO_TEAM',
  RemoveManager: 'NOTIFICATION_REMOVE_MANAGER_TO_TEAM',
  CourseOverdued: 'NOTIFICATION_COURSE_OVERDUE',
  CourseCompleted: 'NOTIFICATION_COURSE_COMPLETE',
  LearningPathCompleted: 'NOTIFICATION_LEARNING_PATH_COMPLETED',
  LearningPathUpdated: 'NOTIFICATION_UPDATE_LEARNING_PATH',
  AssessmentFailed: 'NOTIFICATION_ASSESSMENT_FAILED',
  CourseExpire: 'NOTIFICATION_COURSE_EXPIRE',
  CourseAssigned: 'NOTIFICATION_ASSIGN_COURSE',
  LearningPathAssigned: 'NOTIFICATION_ASSIGN_LEARNING_PATH',
  LearningPathOverdued: 'NOTIFICATION_LEARNING_PATH_OVERDUE',
  PublicCourse: 'NOTIFICATION_EDIT_PUBLIC_COURSE',
  PrivateCourse: 'NOTIFICATION_EDIT_PRIVATE_COURSE',
  SingleCourseReminder: 'NOTIFICATION_COURSE_SINGLE_REMINDER',
  RecurringCourseReminder: 'NOTIFICATION_COURSE_RECURRING_REMINDER',
  SinglePathReminder: 'NOTIFICATION_LEARNING_PATH_SINGLE_REMINDER',
  RecurringPathReminder: 'NOTIFICATION_LEARNING_PATH_RECURRING_REMINDER',
  AssignTeamUserToCourse: 'NOTIFICATION_ASSIGN_TEAM_USER_TO_COURSE',
  ArchiveCourse: 'NOTIFICATION_COURSE_ARCHIVE',
  ArchiveLearningPath: 'NOTIFICATION_LEARNING_PATH_ARCHIVE',
  AssignCertificate: 'NOTIFICATION_ASSIGN_CERTIFICATE',
  ReportGenerated: 'NOTIFICATION_REPORT_GENERATION',
  AddInstructor: 'NOTIFICATION_EVENT_ADD_INSTRUCTOR',
  EventAssigned: 'NOTIFICATION_EVENT_ASSIGN',
  EventPublished: 'NOTIFICATION_EVENT_PUBLISH',
  EventCancelled: 'NOTIFICATION_EVENT_CANCEL',
  EventUpdated: 'NOTIFICATION_EVENT_UPDATE',
  EventTakeAssessment: 'NOTIFICATION_ASSESSMENT_TAKE',
  EventComplete: 'NOTIFICATION_EVENT_COMPLETE',
  EventAttendanceSummary: 'NOTIFICATION_EVENT_ATTENDANCE_SUMMARY',
  EventReminder: 'NOTIFICATION_EVENT_REMINDER',
  EventSubscriptionElapsed: 'NOTIFICATION_EVENT_SUBSCRIPTION_ELAPSED',
  EventCapacityExhausted: 'NOTIFICATION_EVENT_CAPACITY_EXHAUSTED',
  EventDateUpdated: 'NOTIFICATION_EVENT_DATE_UPDATE',
  SubmitAssessment: 'NOTIFICATION_SUBMIT_ASSESSMENT',
  EvaluationCompleted: 'NOTIFICATION_ASSESSMENT_EVALUATED',
  CourseSharedWithBranch: 'NOTIFICATION_BULK_SHARE_COURSE_WITH_SISTER_ORG',
  LPSharedWithBranch: 'NOTIFICATION_BULK_SHARE_LEARNING_PATH_WITH_SISTER_ORG',
  EventSharedWithBranch: 'NOTIFICATION_BULK_SHARE_EVENT_WITH_SISTER_ORG',
  CourseUnSharedWithBranch: 'NOTIFICATION_BULK_UNSHARE_COURSE_WITH_SISTER_ORG',
  LPUnSharedWithBranch:
    'NOTIFICATION_BULK_UNSHARE_LEARNING_PATH_WITH_SISTER_ORG',
  EventUnShareWithBranch: 'NOTIFICATION_BULK_UNSHARE_EVENT_WITH_SISTER_ORG',
  UserInvitedToBranch: 'NOTIFICATION_INVITE_BRANCH_ADMIN',
  ArchiveSharedCourse: 'NOTIFICATION_SHARED_COURSE_ARCHIVE',
  ArchiveSharedPath: 'NOTIFICATION_SHARED_LEARNING_PATH_ARCHIVE',
  EcommerceEnabled: 'NOTIFICATION_ENABLE_ECOMMERCE',
  EcommerceDisabled: 'NOTIFICATION_DISABLE_ECOMMERCE',
  LogisticsDisabled: 'NOTIFICATION_DISABLE_LOGISTICS',
  EcommerceContentPurchase: 'NOTIFICATION_CONTENT_PURCHASE_COMPLETED',
  EcommerceContentAssigned: 'NOTIFICATION_CONTENT_PURCHASED',
  EcommerceDiscountExpired: 'NOTIFICATION_DISCOUNT_EXPIRED',
  EcommerceCurrencyChanged: 'NOTIFICATION_CURRENCY_CHANGED',
  LearnerCertificateExpirationRemainder:
    'NOTIFICATION_LEARNER_CERTIFICATE_EXPIRATION_REMINDER',
  AdminCertificateExpirationRemainder:
    'NOTIFICATION_CERTIFICATE_EXPIRATION_REMINDER',
  LearnerCertificateExpired: 'NOTIFICATION_LEARNER_CERTIFICATE_EXPIRED',
  AdminCertificateExpired: 'NOTIFICATION_CERTIFICATE_EXPIRED',
  EventAssessmentRemainder: 'NOTIFICATION_ASSESSMENT_RECURRING_REMINDER',
  OrderItemsProcessed: 'NOTIFICATION_ORDER_ITEMS_PROCESSED',
  CancelSharedEvent: 'NOTIFICATION_SHARED_EVENT_CANCEL',
  UpdateSharedCourse: 'NOTIFICATION_UPDATE_SHARED_COURSE',
  UpdateSharedPath: 'NOTIFICATION_UPDATE_SHARED_LEARNING_PATH',
  SyncCompleted: 'NOTIFICATION_SYNC_COMPLETED',

  FeedbackSubmitted: 'NOTIFICATION_FEEDBACK_SUBMITTED',
  FeedbackSubmitSingleReminder:
    'NOTIFICATION_FEEDBACK_SUBMISSION_SINGLE_REMINDER',
  FeedbackSubmitReminder: 'NOTIFICATION_FEEDBACK_SUBMISSION_RECURRING_REMINDER',

  SurveySubmitted: 'NOTIFICATION_SURVEY_SUBMITTED',

  UpdatedCoupon: 'NOTIFICATION_UPDATE_COUPON',
  UpdatedSharedCoupon: 'NOTIFICATION_UPDATE_SHARED_COUPON',
  DeactivateCoupon: 'NOTIFICATION_DEACTIVATE_COUPON',
  DeactivateSharedCoupon: 'NOTIFICATION_DEACTIVATE_SHARED_COUPON',
  CouponToExpire: 'NOTIFICATION_COUPON_DUE_IN_X_DAYS',
  CouponExpired: 'NOTIFICATION_COUPON_EXPIRED',
  CouponRedemption: 'NOTIFICATION_COUPON_X_REDEMPTIONS_LEFT',
  SharedCouponRedemption: 'NOTIFICATION_SHARED_COUPON_X_REDEMPTIONS_LEFT',
  PublishCoupon: 'NOTIFICATION_PUBLISH_COUPON',
  PublishSharedCoupon: 'NOTIFICATION_PUBLISH_SHARED_COUPON',
  RecurringEventReminderLearner:
    'NOTIFICATION_EVENT_RECURRING_REMINDER_LEARNER',
  RecurringEventReminderInstructor:
    'NOTIFICATION_EVENT_RECURRING_REMINDER_INSTRUCTOR',
  StartEventReminderLearner: 'NOTIFICATION_EVENT_START_REMINDER_LEARNER',
  StartEventReminderInstructor: 'NOTIFICATION_EVENT_START_REMINDER_INSTRUCTOR',

  /** Bulk Notifications */
  BulkAssignCourse: 'NOTIFICATION_BULK_ASSIGN_COURSE',
  BulkArchiveCourse: 'NOTIFICATION_BULK_ARCHIVE_COURSE',
  BulkAssignLearningPath: 'NOTIFICATION_BULK_ASSIGN_LEARNING_PATH',
  BulkArchiveLearningPath: 'NOTIFICATION_BULK_ARCHIVE_LEARNING_PATH',
  BulkDeleteUser: 'NOTIFICATION_BULK_DELETE_USER',
  BulkAddManagerToTeam: 'NOTIFICATION_BULK_ADD_MANAGER_TO_TEAM',
  BulkDeleteTeam: 'NOTIFICATION_BULK_DELETE_TEAM',
  BulkArchiveSharedCourse: 'NOTIFICATION_BULK_ARCHIVE_SHARED_COURSE',
  BulkArchiveSharedPath: 'NOTIFICATION_BULK_ARCHIVE_SHARED_LEARNING_PATH',

  SchedulePublish: 'NOTIFICATION_ON_SCHEDULE_PUBLISH',
  BulkSchedulePublish: 'NOTIFICATION_BULK_SCHEDULED_LIBRARY_PUBLISH',
  CancelSchedulePath: 'NOTIFICATION_ON_CANCELLED_PUBLISH_PATH',
  PublishScheduled: 'NOTIFICATION_SCHEDULED_LIBRARY_PUBLISH',
  BulkPublishScheduled: 'NOTIFICATION_ON_BULK_SCHEDULE_PUBLISH',
  BulkFailedPublishScheduled: 'NOTIFICATION_ON_FAILED_SCHEDULE_PUBLISH',

  DuplicateLibrary: 'NOTIFICATION_DUPLICATE_LIBRARY',
  BulkDuplicateLibrary: 'NOTIFICATION_BULK_DUPLICATE_LIBRARY',

  BulkCouponToExpire: 'NOTIFICATION_BULK_COUPON_DUE_IN_X_DAYS',
  BulkCouponExpired: 'NOTIFICATION_BULK_COUPON_EXPIRED',

  /** End of bulk notification */

  // Social Learning Notifications
  SocialLikeOnPost: 'NOTIFICATION_LIKE_ON_POST',
  SocialLikeOnComment: 'NOTIFICATION_LIKE_ON_COMMENT',
  SocialLikeOnReply: 'NOTIFICATION_LIKE_ON_REPLY',
  SocialReplyOnComment: 'NOTIFICATION_REPLY_ON_COMMENT',
  SocialReplyOnPost: 'NOTIFICATION_REPLY_ON_POST',
  SocialCommentOnPost: 'NOTIFICATION_COMMENT_ON_POST',
  SocialMentionOnPost: 'NOTIFICATION_MENTION_ON_POST',
  SocialMentionOnComment: 'NOTIFICATION_MENTION_ON_COMMENT',
  SocialMentionOnReply: 'NOTIFICATION_MENTION_ON_REPLY',
  SocialFlagOnPostAuthor: 'NOTIFICATION_FLAG_ON_POST_AUTHOR',
  SocialFlagOnCommentAuthor: 'NOTIFICATION_FLAG_ON_COMMENT_AUTHOR',
  SocialFlagOnReplyAuthor: 'NOTIFICATION_FLAG_ON_REPLY_AUTHOR',
  SocialFlagOnPostAdmin: 'NOTIFICATION_FLAG_ON_POST',
  SocialFlagOnCommentAdmin: 'NOTIFICATION_FLAG_ON_COMMENT',
  SocialFlagOnReplyAdmin: 'NOTIFICATION_FLAG_ON_REPLY',
  SocialAddedToForum: 'NOTIFICATION_USER_ADDED_TO_FORUM',
  SocialPollReminder: 'NOTIFICATION_POLL_EXPIRY_RECURRING_REMINDER',
  SocialPollExpired: 'NOTIFICATION_ON_POLL_EXPIRED',

  // External Trainings
  AddExternalCertificate: 'NOTIFICATION_ADD_EXTERNAL_CERTIFICATE',
  UpdateExternalCertificate: 'NOTIFICATION_UPDATE_EXTERNAL_CERTIFICATE',
  DeleteExternalCertificate: 'NOTIFICATION_DELETE_EXTERNAL_CERTIFICATE',
  ApprovedExternalCertificate: 'NOTIFICATION_EXTERNAL_CERTIFICATE_APPROVED',
  RejectedExternalCertificate: 'NOTIFICATION_EXTERNAL_CERTIFICATE_REJECTED',
  ApprovalExternalCertificate: 'NOTIFICATION_APPROVE_EXTERNAL_CERTIFICATE',
  ApprovalReminderExternalCertificate:
    'NOTIFICATION_EXTERNAL_CERTIFICATE_APPROVAL_REMINDER',

  // Tasks
  TasksNotificationOnAssigned: 'NOTIFICATION_CHECKLIST_ASSIGNED',
  TasksNotificationOnSubmission: 'NOTIFICATION_SUBMIT_CHECKLIST',
  TasksNotificationOnRework: 'NOTIFICATION_CHECKLIST_REWORK',
  TasksNotificationOnStatusChange: 'NOTIFICATION_CHECKLIST_STATUS_UPDATE',
  TasksNotificationChecklistCompleted: 'NOTIFICATION_CHECKLIST_COMPLETE',
  TasksNotificationOnOverdue: 'NOTIFICATION_CHECKLIST_OVERDUE',
  TasksNotificationOnComment: 'NOTIFICATION_COMMENT_ON_CHECKLIST',
  TasksNotificationOnMention: 'NOTIFICATION_MENTION_ON_CHECKLIST',
  TasksNotificationOnMentionAdmin: 'NOTIFICATION_MENTION_ON_CHECKLIST_ADMIN',

  TasksNotificationAssigneeUpdateResponse:
    'NOTIFICATION_CHECKLIST_UPDATE_ASSIGNEE',
  TasksNotificationReviewerUpdateReview:
    'NOTIFICATION_CHECKLIST_UPDATE_REVIEWER',

  // Reporting Manager
  AssignAsReportingManager: 'NOTIFICATION_ON_REPORTING_MANAGER_ASSIGNMENT',
  RemoveAsReportingManager: 'NOTIFICATION_ON_REPORTING_MANAGER_REMOVAL',
  AssignReportingManager: 'NOTIFICATION_ON_REPORTEE_ASSIGNMENT',
  RemoveReportingManager: 'NOTIFICATION_ON_REPORTEE_REMOVAL',

  // Manual Reassignment
  ReassignCourse: 'NOTIFICATION_REASSIGN_COURSE',
  ReassignPath: 'NOTIFICATION_REASSIGN_LEARNING_PATH',
  // first one are lxp
  SystemGenerated: [
    'NOTIFICATION_ACKNOWLEDGEMENT_REMINDER_ON_FEED',
    'NOTIFICATION_USER_ADD',
    'NOTIFICATION_USER_DELETE',
    'NOTIFICATION_DELETE_TEAM',
    'NOTIFICATION_COURSE_OVERDUE',
    'NOTIFICATION_COURSE_ARCHIVE',
    'NOTIFICATION_COURSE_EXPIRE',
    'NOTIFICATION_EDIT_PUBLIC_COURSE',
    'NOTIFICATION_EDIT_PRIVATE_COURSE',
    'NOTIFICATION_COURSE_SINGLE_REMINDER',
    'NOTIFICATION_COURSE_RECURRING_REMINDER',
    'NOTIFICATION_ASSIGN_TEAM_USER_TO_COURSE',
    'NOTIFICATION_ASSIGN_CERTIFICATE',
    'NOTIFICATION_COURSE_GENERATION',

    'NOTIFICATION_BULK_ASSIGN_COURSE',
    'NOTIFICATION_BULK_ARCHIVE_COURSE',
    'NOTIFICATION_BULK_DELETE_USER',
    'NOTIFICATION_BULK_ADD_MANAGER_TO_TEAM',
    'NOTIFICATION_BULK_DELETE_TEAM',

    'NOTIFICATION_FLAG_ON_POST_AUTHOR',
    'NOTIFICATION_FLAG_ON_COMMENT_AUTHOR',
    'NOTIFICATION_FLAG_ON_REPLY_AUTHOR',
    'NOTIFICATION_FLAG_ON_POST',
    'NOTIFICATION_FLAG_ON_COMMENT',
    'NOTIFICATION_FLAG_ON_REPLY',

    'NOTIFICATION_EXTERNAL_CERTIFICATE_REJECTED',
    'NOTIFICATION_EXTERNAL_CERTIFICATE_APPROVED',

    'NOTIFICATION_LEARNER_CERTIFICATE_EXPIRATION_REMINDER',
    'NOTIFICATION_LEARNER_CERTIFICATE_EXPIRED',

    'NOTIFICATION_ON_POLL_EXPIRED',
    'NOTIFICATION_POLL_EXPIRY_RECURRING_REMINDER',

    'NOTIFICATION_FEEDBACK_SUBMISSION_SINGLE_REMINDER',
    'NOTIFICATION_FEEDBACK_SUBMISSION_RECURRING_REMINDER',

    'NOTIFICATION_CHECKLIST_ASSIGNED',
    'NOTIFICATION_SUBMIT_CHECKLIST',
    'NOTIFICATION_CHECKLIST_STATUS_UPDATE',
    'NOTIFICATION_CHECKLIST_REWORK',
    'NOTIFICATION_CHECKLIST_OVERDUE',
    'NOTIFICATION_CHECKLIST_COMPLETE',

    'NOTIFICATION_CHECKLIST_UPDATE_ASSIGNEE',
    'NOTIFICATION_CHECKLIST_UPDATE_REVIEWER',
  ],
};
export const USER_ROLES = {
  primaryAdmin: 'PRIMARY_ADMIN',
  admin: 'ADMIN',
  manager: 'MANAGER',
  learner: 'LEARNER',
  trainee: 'TRAINEE',
};
export const LEARNING_TYPE = {
  course: {
    id: 'course',
    category: 'COURSE',
    route: 'courses',
    managerRoute: 'managers/managed_courses',
  },
  path: {
    id: 'path',
    category: 'LEARNING_PATH',
    route: 'learning_paths',
    managerRoute: 'managers/managed_learning_paths',
    pathAPIKey: 'learning_path',
  },
  event: {
    id: 'event',
    category: 'EVENT',
    route: 'events',
    managerRoute: 'managers/managed_events',
  },
  external_training: {
    id: 'external_training',
    category: 'EXTERNAL_TRAINING',
    route: 'external_trainings',
    managerRoute: 'external_trainings',
  },
};
export const FORUM_POST_TYPES = ['Poll', 'Discussion'];

export const LEARNING_PATH = 'LearningPath';

export const TASK_CONFIG_ROLES = {
  assignee: 'ASSIGNEE',
  reviewer: 'REVIEWER',
  viewer: 'VIEWER',
};
export const TASK_CREATION_SCOPE = {
  creator: 'CREATOR',
  global: 'GLOBAL',
};
export const TASK_TYPE = {
  task: 'Checklist',
  subtask: 'ChecklistItem',
};

export const SOURCE = {
  ...LEARNING_TYPE,
  user: {
    id: 'user',
    category: 'USER',
    route: 'users',
    managerRoute: 'users',
  },
  team: {
    id: 'team',
    category: 'TEAM',
    route: 'teams',
    managerRoute: 'teams',
  },
  organization: {
    id: 'organization',
    category: 'ORGANIZATION',
    route: 'organizations',
    managerRoute: 'organizations',
  },
  branch: {
    id: 'branch',
    category: 'BRANCH',
    route: 'branches',
    managerRoute: 'branches',
  },
  forum: {
    id: 'forum',
    category: 'FORUM',
    route: 'forums',
    managerRoute: 'forums',
  },
};

export const LEARNER_YOUR_COURSES_TABS = {
  assigned: 'ASSIGNED',
  enrolled: 'ENROLLED',
  inprogress: 'ONGOING',
  completed: 'COMPLETED',
  public: 'PUBLIC',
  overdue: 'OVERDUE',
  failed: 'FAILED',
  multiple: 'MULTIPLE',
};

export const FORUM_POST_TYPE = {
  poll: {
    id: 'Poll',
    route: 'polls',
  },
  discussion: {
    id: 'Discussion',
    route: 'discussions',
  },
  post: {
    id: 'Post',
    route: 'discussions',
  },
};
export const TRAINING_KEYWORD = '[Training]';

export const CURRENCY_NAMES = {
  USD: 'USD (US Dollar)',
  INR: 'INR (Indian Rupee)',
};

export const SURVEY_QUESTION_TYPES = {
  freeText: 'FREE_TEXT',
  multi: 'MULTI_CHOICE',
  single: 'SINGLE_CHOICE',
  linear: 'LIKERT_SCALE',
  rating: 'RATING',
};
