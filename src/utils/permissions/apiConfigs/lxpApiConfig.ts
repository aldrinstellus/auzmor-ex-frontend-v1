import * as queries from 'queries/learn';

import { ApiEnum } from '../enums/apiEnum';
import { LxpRoleEnum } from '../enums/roleEnum';

const { Default, Learner } = LxpRoleEnum;

export const apiConfigLxp = {
  //apps
  [ApiEnum.GetApps]: {
    [Default]: queries.useInfiniteApps,
    [Learner]: queries.useInfiniteAppsLearner,
  },
  [ApiEnum.GetFeaturedApps]: { [Default]: queries.useInfiniteFeaturedApps },
  [ApiEnum.GetWidgetApps]: { [Default]: queries.useInfiniteWidgetApps },
  [ApiEnum.CreateApp]: { [Default]: queries.createApp },
  [ApiEnum.EditApp]: { [Default]: queries.editApp },
  [ApiEnum.LaunchApp]: { [Default]: queries.launchApp },
  [ApiEnum.DeleteApp]: { [Default]: queries.deleteApp },

  //audience
  [ApiEnum.GetAudience]: { [Default]: queries.useInfiniteAudience },

  //auth
  [ApiEnum.GetLogin]: { [Default]: queries.useCheckLogin },
  [ApiEnum.GetLoginApi]: { [Default]: queries.checkLogin },
  [ApiEnum.Logout]: { [Default]: queries.learnLogout },
  [ApiEnum.ToggleView]: { [Default]: queries.toggleView },

  //categories
  [ApiEnum.GetCategories]: { [Default]: queries.useInfiniteLearnCategory },
  [ApiEnum.CreateCategory]: { [Default]: queries.createCategory },

  //channels
  [ApiEnum.GetChannels]: {
    [Default]: queries.useInfiniteChannels,
    [Learner]: queries.useInfiniteChannelsLearner,
  },
  [ApiEnum.GetChannel]: { [Default]: queries.useChannelDetails },
  [ApiEnum.CreateChannel]: { [Default]: queries.createChannel },
  [ApiEnum.UpdateChannel]: { [Default]: queries.updateChannel },
  [ApiEnum.DeleteChannel]: { [Default]: queries.deleteChannel },

  [ApiEnum.GetChannelLinks]: { [Default]: queries.useChannelLinksWidget },
  [ApiEnum.CreateChannelLinks]: { [Default]: queries.createLinks },
  [ApiEnum.UpdateChannelLinks]: { [Default]: queries.updateChannelLinksIndex },
  [ApiEnum.UpdateChannelLink]: { [Default]: queries.updateChannelLink },
  [ApiEnum.DeleteChannelLink]: { [Default]: queries.deleteChannelLinks },

  [ApiEnum.GetChannelMembers]: { [Default]: queries.useInfiniteChannelMembers },
  [ApiEnum.AddChannelMembers]: { [Default]: queries.addChannelMembers },
  [ApiEnum.GetAddChannelMembersStatus]: {
    [Default]: queries.useChannelMembersStatus,
  },
  [ApiEnum.UpdateChannelMember]: { [Default]: queries.updateChannelMember },
  [ApiEnum.DeleteChannelMember]: { [Default]: queries.removeChannelMember },
  [ApiEnum.LeaveChannel]: { [Default]: queries.leaveChannel },

  [ApiEnum.GetJoinChannelRequests]: {
    [Default]: queries.useInfiniteChannelsRequest,
  },
  [ApiEnum.CreateJoinChannelRequest]: { [Default]: queries.joinChannelRequest },
  [ApiEnum.ApproveJoinChannelRequest]: {
    [Default]: queries.approveChannelJoinRequest,
  },
  [ApiEnum.RejectJoinChannelRequest]: {
    [Default]: queries.rejectChannelJoinRequest,
  },
  [ApiEnum.DeleteJoinChannelRequest]: {
    [Default]: queries.deleteJoinChannelRequest,
  },
  [ApiEnum.UpdateChannelJoinRequests]: {
    [Default]: queries.bulkChannelRequestUpdate,
  },

  //comments
  [ApiEnum.GetComments]: { [Default]: queries.useInfiniteComments },
  [ApiEnum.CreateComment]: { [Default]: queries.createComment },
  [ApiEnum.UpdateComment]: { [Default]: queries.updateComment },
  [ApiEnum.DeleteComment]: {
    [Default]: queries.deleteComment,
    [Learner]: queries.deleteCommentLearner,
  },

  //events
  [ApiEnum.GetEvents]: { [Default]: queries.useInfiniteLearnEvents },
  [ApiEnum.GetEventAttendees]: { [Default]: queries.useEventAttendee },

  //jobs
  [ApiEnum.CreateJob]: { [Default]: queries.createNewJob },

  //links
  [ApiEnum.GetLinkPreview]: { [Default]: queries.usePreviewLink },
  [ApiEnum.GetLinkPreviewApi]: { [Default]: queries.getPreviewLink },

  //notifications
  [ApiEnum.GetNotifications]: {
    [Default]: queries.useInfiniteNotifications,
    [Learner]: queries.useInfiniteNotificationsLearner,
  },
  [ApiEnum.GetNotificationsUnreadCount]: {
    [Default]: queries.useGetUnreadNotificationsCount,
  },
  [ApiEnum.MarkNotificationAsRead]: {
    [Default]: queries.markNotificationAsReadById,
    [Learner]: queries.markNotificationAsReadByIdLearner,
  },
  [ApiEnum.MarkAllNotificationsAsRead]: {
    [Default]: queries.markAllNotificationsAsRead,
    [Learner]: queries.markAllNotificationsAsReadLearner,
  },

  //organizations
  [ApiEnum.GetOrganization]: { [Default]: queries.useOrganization },
  [ApiEnum.GetOrganizationBranch]: { [Default]: queries.useGetBranches },
  [ApiEnum.GetCartItems]: { [Default]: queries.useGetCartItems },

  //photos
  [ApiEnum.UploadImage]: { [Default]: queries.uploadImage },

  //posts
  [ApiEnum.MarkAsAnnouncement]: { [Default]: queries.markAsAnnouncement },
  [ApiEnum.RemoveAnnouncement]: { [Default]: queries.removeAnnouncement },
  [ApiEnum.GetPost]: {
    [Default]: queries.useGetPost,
    [Learner]: queries.useGetLearnerPost,
  },
  [ApiEnum.CreatePost]: {
    [Default]: queries.createPost,
    [Learner]: queries.createPostLearner,
  },
  [ApiEnum.UpdatePost]: { [Default]: queries.updatePost },
  [ApiEnum.DeletePost]: {
    [Default]: queries.deletePost,
    [Learner]: queries.deletePostLearner,
  },

  [ApiEnum.AcknowledgeAnnouncement]: { [Default]: queries.announcementRead },
  [ApiEnum.GetPostAcknowledgements]: {
    [Default]: queries.useInfiniteAcknowledgements,
  },
  [ApiEnum.SendAcknowledgementReminders]: {
    [Default]: queries.sendAcknowledgementReminders,
  },
  [ApiEnum.DownloadPostAcknowledgements]: {
    [Default]: queries.downloadAcknowledgementReport,
  },

  [ApiEnum.GetPostPollVotes]: { [Default]: queries.useInfinitePollVotes },
  [ApiEnum.CreatePollVote]: { [Default]: queries.pollVote },
  [ApiEnum.DeletePollVote]: { [Default]: queries.deletePollVote },

  [ApiEnum.GetFeedPosts]: {
    [Default]: queries.useInfiniteFeed,
    [Learner]: queries.useInfiniteLearnerFeed,
  },
  [ApiEnum.GetAnnouncementPosts]: { [Default]: queries.useAnnouncementsWidget },

  [ApiEnum.CreateBookmarkPost]: { [Default]: queries.createBookmark },
  [ApiEnum.DeleteBookmarkPost]: { [Default]: queries.deleteBookmark },

  //reactions
  [ApiEnum.GetReactions]: { [Default]: queries.useInfiniteReactions },
  [ApiEnum.CreateReaction]: { [Default]: queries.createReaction },
  [ApiEnum.DeleteReaction]: { [Default]: queries.deleteReaction },

  //storage
  [ApiEnum.ConnectStorage]: { [Default]: queries.getLinkToken },
  [ApiEnum.UpdateStorage]: { [Default]: queries.patchConfig },
  [ApiEnum.GetStorageFiles]: { [Default]: queries.useFiles },
  [ApiEnum.GetStorageFolders]: { [Default]: queries.useFolders },
  [ApiEnum.SearchStorage]: { [Default]: queries.useDocument },
  [ApiEnum.CreateStorageFolder]: { [Default]: queries.createFolder },
  [ApiEnum.DownloadStorageFile]: { [Default]: queries.download },
  [ApiEnum.GetStorageUsers]: { [Default]: queries.useGetStorageUser },
  [ApiEnum.GetStorageConnectionStatus]: {
    [Default]: queries.useConnectedStatus,
  },

  //submissions
  [ApiEnum.GetEvaluations]: { [Default]: queries.useGetEvaluation },

  //support
  [ApiEnum.ContactSales]: { [Default]: queries.contactSales },

  //teams
  [ApiEnum.GetTeams]: { [Default]: queries.useInfiniteTeams },
  [ApiEnum.GetTeam]: { [Default]: queries.useSingleTeam },
  [ApiEnum.GetTeamMembers]: { [Default]: queries.useInfiniteTeamMembers },

  //trainings
  [ApiEnum.GetProgressTracker]: { [Default]: queries.useProgressTracker },
  [ApiEnum.GetRecommendations]: { [Default]: queries.useGetRecommendation },

  //users
  [ApiEnum.GetMe]: { [Default]: queries.useCurrentUser },
  [ApiEnum.GetMeApi]: { [Default]: queries.fetchMe },
  [ApiEnum.GetUsers]: { [Default]: queries.useInfiniteUsers },
  [ApiEnum.GetUser]: { [Default]: queries.useSingleUser },
  [ApiEnum.GetUserApi]: { [Default]: queries.getUser },
  [ApiEnum.GetMembers]: { [Default]: queries.useInfiniteMembers },
};
