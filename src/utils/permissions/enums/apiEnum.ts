export enum ApiEnum {
  //apps
  GetApps = 'GET_APPS',
  GetFeaturedApps = 'GET_FEATURED_APPS',
  GetWidgetApps = 'GET_WIDGET_APPS',
  CreateApp = 'CREATE_APP',
  EditApp = 'EDIT_APP',
  LaunchApp = 'LAUNCH_APP',
  DeleteApp = 'DELETE_APP',

  //audience
  GetAudience = 'GET_AUDIENCE',

  //auth
  Login = 'LOGIN',
  GetLogin = 'GET_LOGIN',
  GetLoginApi = 'GET_LOGIN_API',
  LoginSSO = 'LOGIN_SSO',
  Logout = 'LOGOUT',
  ToggleView = 'TOGGLE_VIEW',

  //categories
  GetCategories = 'GET_CATEGORIES',
  CreateCategory = 'CREATE_CATEGORY',

  //channels
  GetChannels = 'GET_CHANNELS',
  GetChannel = 'GET_CHANNEL',
  CreateChannel = 'CREATE_CHANNEL',
  UpdateChannel = 'UPDATE_CHANNEL',
  DeleteChannel = 'DELETE_CHANNEL',

  GetChannelLinks = 'GET_CHANNEL_LINKS',
  CreateChannelLinks = 'CREATE_CHANNEL_LINKS',
  UpdateChannelLinks = 'UPDATE_CHANNEL_LINKS',
  UpdateChannelLink = 'UPDATE_CHANNEL_LINK',
  DeleteChannelLink = 'DELETE_CHANNEL_LINK',

  GetChannelMembers = 'GET_CHANNEL_MEMBERS',
  AddChannelMembers = 'ADD_CHANNEL_MEMBERS',
  GetAddChannelMembersStatus = 'GET_ADD_CHANNEL_MEMBERS_STATUS',
  UpdateChannelMember = 'UPDATE_CHANNEL_MEMBER',
  DeleteChannelMember = 'DELETE_CHANNEL_MEMBER',
  LeaveChannel = 'LEAVE_CHANNEL',

  GetJoinChannelRequests = 'GET_JOIN_CHANNEL_REQUESTS',
  CreateJoinChannelRequest = 'CREATE_JOIN_CHANNEL_REQUEST',
  ApproveJoinChannelRequest = 'APPROVE_JOIN_CHANNEL_REQUEST',
  RejectJoinChannelRequest = 'REJECT_JOIN_CHANNEL_REQUEST',
  DeleteJoinChannelRequest = 'DELETE_JOIN_CHANNEL_REQUEST',
  UpdateChannelJoinRequests = 'UPDATE_CHANNEL_JOIN_REQUESTS',

  //comments
  GetComments = 'GET_COMMENTS',
  CreateComment = 'CREATE_COMMENT',
  UpdateComment = 'UPDATE_COMMENT',
  DeleteComment = 'DELETE_COMMENT',

  //designations
  GetDesignations = 'GET_DESIGNATIONS',

  //departments
  GetDepartments = 'GET_DEPARTMENTS',

  //events
  GetEvents = 'GET_EVENTS',
  GetEventAttendees = 'GET_EVENT_ATTENDEES',

  //importUsers
  StartImportUsers = 'START_IMPORT_USERS',
  ParseImport = 'PARSE_IMPORT',
  UpdateParseImport = 'UPDATE_PARSE_IMPORT',
  ValidateImport = 'VALIDATE_IMPORT',
  StartCreatingUsers = 'START_CREATING_USERS',
  GetImportData = 'GET_IMPORT_DATA',
  GetImportReport = 'GET_IMPORT_REPORT',
  DownloadImportReport = 'DOWNLOAD_IMPORT_REPORT',

  //integrations
  CreateHrisConfiguration = 'CREATE_HRIS_CONFIGURATION',
  DeleteHrisConfiguration = 'DELETE_HRIS_CONFIGURATION',
  UpdateHrisConfiguration = 'UPDATE_HRIS_CONFIGURATION',
  SyncHrisUsers = 'SYNC_HRIS_USERS',

  //jobs
  CreateJob = 'CREATE_JOB',

  //links
  GetLinkPreview = 'GET_LINK_PREVIEW',
  GetLinkPreviewApi = 'GET_LINK_PREVIEW_API',

  //locations
  GetLocations = 'GET_LOCATIONS',
  GetGooglePlaces = 'GET_GOOGLE_PLACES',

  //notifications
  GetNotifications = 'GET_NOTIFICATIONS',
  GetNotificationsUnreadCount = 'GET_NOTIFICATIONS_UNREAD_COUNT',
  MarkNotificationAsRead = 'MARK_NOTIFICATION_AS_READ',
  MarkAllNotificationsAsRead = 'MARK_ALL_NOTIFICATIONS_AS_READ',

  //organizations
  OrganizationSignup = 'ORGANIZATION_SIGNUP',
  GetOrganization = 'GET_ORGANIZATION',
  GetOrganizationDomain = 'GET_ORGANIZATION_DOMAIN',
  UpdateOrganization = 'UPDATE_ORGANIZATION',
  GetOrganizationSSO = 'GET_ORGANIZATION_SSO',
  UpdateOrganizationSSO = 'UPDATE_ORGANIZATION_SSO',
  DeleteOrganizationSSO = 'DELETE_ORGANIZATION_SSO',
  UpdateOrganizationConfiguration = 'UPDATE_ORGANIZATION_CONFIGURATION',
  GetOrganizationCelebrations = 'GET_ORGANIZATION_CELEBRATIONS',
  GetOrganizationBranch = 'GET_ORGANIZATION_BRANCH',

  //password
  ForgotPassword = 'FORGOT_PASSWORD',
  ChangePassword = 'CHANGE_PASSWORD',
  ResetPassword = 'RESET_PASSWORD',
  ValidateToken = 'VALIDATE_TOKEN',

  //photos
  UploadImage = 'UPLOAD_IMAGE',

  //posts
  GetPost = 'GET_POST',
  CreatePost = 'CREATE_POST',
  UpdatePost = 'UPDATE_POST',
  DeletePost = 'DELETE_POST',
  MarkAsAnnouncement = 'MARK_AS_ANNOUNCEMENT',

  AcknowledgeAnnouncement = 'ACKNOWLEDGE_ANNOUNCEMENT',
  GetPostAcknowledgements = 'GET_POST_ACKNOWLEDGEMENTS',
  DownloadPostAcknowledgements = 'DOWNLOAD_POST_ACKNOWLEDGEMENTS',

  GetPostPollVotes = 'GET_POST_POLL_VOTES',
  CreatePollVote = 'CREATE_POLL_VOTE',
  DeletePollVote = 'DELETE_POLL_VOTE',

  GetMyProfilePosts = 'GET_MY_PROFILE_POSTS',
  GetMyRecognitionPosts = 'GET_MY_RECOGNITON_POSTS',
  GetUserProfilePosts = 'GET_USER_PROFILE_POSTS',
  GetUserRecognitionPosts = 'GET_USER_RECOGNITON_POSTS',

  GetFeedPosts = 'GET_FEED_POSTS',
  GetAnnouncementPosts = 'GET_ANNOUNCEMENT_POSTS',

  CreateBookmarkPost = 'CREATE_BOOKMARK_POST',
  DeleteBookmarkPost = 'DELETE_BOOKMARK_POST',

  //reactions
  GetReactions = 'GET_REACTIONS',
  CreateReaction = 'CREATE_REACTION',
  DeleteReaction = 'DELETE_REACTION',

  //skills
  GetSkills = 'GET_SKILLS',

  //storage
  ConnectStorage = 'CONNECT_STORAGE',
  UpdateStorage = 'UPDATE_STORAGE',
  GetStorageFiles = 'GET_STORAGE_FILES',
  GetStorageFolders = 'GET_STORAGE_FOLDERS',
  SearchStorage = 'SEARCH_STORAGE',
  CreateStorageFolder = 'CREATE_STORAGE_FOLDER',
  DownloadStorageFile = 'DOWNLOAD_STORAGE_FILE',
  GetStorageUsers = 'GET_STORAGE_USERS',
  GetStorageConnectionStatus = 'GET_STORAGE_CONNECTION_STATUS',

  //submissions
  GetEvaluations = 'GET_EVALUATIONS',

  //support
  ContactSales = 'CONTACT_SALES',

  //teams
  GetTeams = 'GET_TEAMS',
  GetTeam = 'GET_TEAM',
  GetTeamMembers = 'GET_TEAM_MEMBERS',
  CreateTeam = 'CREATE_TEAM',
  UpdateTeam = 'UPDATE_TEAM',
  DeleteTeam = 'DELETE_TEAM',
  AddTeamMembers = 'ADD_TEAM_MEMBERS',
  RemoveTeamMembers = 'REMOVE_TEAM_MEMBERS',

  //trainings
  GetProgressTracker = 'GET_PROGRESS_TRACKER',
  GetRecommendations = 'GET_RECOMMENDATIONS',

  //users
  GetMe = 'GET_ME',
  GetMeApi = 'GET_ME_API',
  GetUsers = 'GET_USERS',
  GetUser = 'GET_USER',
  GetUserApi = 'GET_USER_API',
  GetMembers = 'GET_MEMBERS',
  GetUserEmailExistsOpen = 'GET_USER_EMAIL_EXISTS_OPEN',
  GetUserExistsAuthenticated = 'GET_USER_EXISTS_AUTHENTICATED',
  GetOrganizationDomainExists = 'GET_ORGANIZATION_DOMAIN_EXISTS',
  GetNotificationSettings = 'GET_NOTIFICATION_SETTINGS',
  VerifyInviteLink = 'VERIFY_INVITE_LINK',
  UpdateMe = 'UPDATE_ME',
  UpdateUser = 'UPDATE_USER',
  DeleteUser = 'DELETE_USER',
  InviteUsers = 'INVITE_USERS',
  AcceptInviteSetPassword = 'ACCEPT_INVITE_SET_PASSWORD',
  GetOrganizationChart = 'GET_ORGANIZATION_CHART',
  GetOrganizationChartApi = 'GET_ORGANIZATION_CHART_API',
  ResendInvitation = 'RESEND_INVITATION',
}
