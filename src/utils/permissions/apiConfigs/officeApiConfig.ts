import * as queries from 'queries/office';
import { ApiEnum } from '../enums/apiEnum';
import { OfficeRoleEnum } from '../enums/roleEnum';

const { Default, Member } = OfficeRoleEnum;

export const apiConfigOffice = {
  //audience
  [ApiEnum.GetAudience]: { [Default]: queries.useInfiniteAudience },

  //auth
  [ApiEnum.Login]: { [Default]: queries.login },
  [ApiEnum.GetLogin]: { [Default]: queries.useCheckLogin },
  [ApiEnum.GetLoginApi]: { [Default]: queries.checkLogin },
  [ApiEnum.LoginSSO]: { [Default]: queries.useLoginViaSSO },
  [ApiEnum.Logout]: { [Default]: queries.logout },

  //apps
  [ApiEnum.GetApps]: { [Default]: queries.useInfiniteApps },
  [ApiEnum.GetFeaturedApps]: { [Default]: queries.useInfiniteFeaturedApps },
  [ApiEnum.GetWidgetApps]: { [Default]: queries.useInfiniteWidgetApps },
  [ApiEnum.CreateApp]: { [Default]: queries.createApp },
  [ApiEnum.EditApp]: { [Default]: queries.editApp },
  [ApiEnum.LaunchApp]: { [Default]: queries.launchApp },
  [ApiEnum.DeleteApp]: { [Default]: queries.deleteApp },

  //categories
  [ApiEnum.GetCategories]: { [Default]: queries.useInfiniteCategories },

  //channels
  [ApiEnum.GetChannels]: {
    [Default]: queries.useInfiniteChannels,
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
  [ApiEnum.DeleteComment]: { [Default]: queries.deleteComment },

  //designations
  [ApiEnum.GetDesignations]: { [Default]: queries.useInfiniteDesignations },

  //departments
  [ApiEnum.GetDepartments]: { [Default]: queries.useInfiniteDepartments },

  //importusers
  [ApiEnum.StartImportUsers]: { [Default]: queries.startImportUser },
  [ApiEnum.ParseImport]: { [Default]: queries.parseImport },
  [ApiEnum.UpdateParseImport]: { [Default]: queries.updateParseImport },
  [ApiEnum.ValidateImport]: { [Default]: queries.validateImport },
  [ApiEnum.StartCreatingUsers]: { [Default]: queries.startCreatingUsers },
  [ApiEnum.GetImportData]: { [Default]: queries.useInfiniteImportData },
  [ApiEnum.GetImportReport]: { [Default]: queries.useInfiniteImportResultData },
  [ApiEnum.DownloadImportReport]: { [Default]: queries.downloadReport },

  //integrations
  [ApiEnum.CreateHrisConfiguration]: { [Default]: queries.createConfiguration },
  [ApiEnum.DeleteHrisConfiguration]: {
    [Default]: queries.deleteHrisIntegration,
  },
  [ApiEnum.UpdateHrisConfiguration]: { [Default]: queries.putConfiguration },
  [ApiEnum.SyncHrisUsers]: { [Default]: queries.syncUser },

  //jobs
  [ApiEnum.CreateJob]: { [Default]: queries.createNewJob },

  //links
  [ApiEnum.GetLinkPreview]: { [Default]: queries.usePreviewLink },
  [ApiEnum.GetLinkPreviewApi]: { [Default]: queries.getPreviewLink },

  //locations
  [ApiEnum.GetLocations]: { [Default]: queries.useInfiniteLocations },
  [ApiEnum.GetGooglePlaces]: { [Default]: queries.useGooglePlaces },

  //notifications
  [ApiEnum.GetNotifications]: { [Default]: queries.useInfiniteNotifications },
  [ApiEnum.GetNotificationsUnreadCount]: {
    [Default]: queries.useGetUnreadNotificationsCount,
  },
  [ApiEnum.MarkNotificationAsRead]: {
    [Default]: queries.markNotificationAsReadById,
  },
  [ApiEnum.MarkAllNotificationsAsRead]: {
    [Default]: queries.markAllNotificationsAsRead,
  },

  //organizations
  [ApiEnum.OrganizationSignup]: { [Default]: queries.signup },
  [ApiEnum.GetOrganization]: { [Default]: queries.useOrganization },
  [ApiEnum.GetOrganizationDomain]: { [Default]: queries.useGetSSOFromDomain },
  [ApiEnum.UpdateOrganization]: { [Default]: queries.useUpdateOrganization },
  [ApiEnum.GetOrganizationSSO]: { [Default]: queries.useGetSSO },
  [ApiEnum.UpdateOrganizationSSO]: { [Default]: queries.updateSso },
  [ApiEnum.DeleteOrganizationSSO]: { [Default]: queries.deleteSSO },
  [ApiEnum.UpdateOrganizationConfiguration]: {
    [Default]: queries.useUpdateOrganizationConfiguration,
  },
  [ApiEnum.GetOrganizationCelebrations]: { [Default]: queries.useCelebrations },

  //password
  [ApiEnum.ForgotPassword]: { [Default]: queries.forgotPassword },
  [ApiEnum.ChangePassword]: { [Default]: queries.changePassword },
  [ApiEnum.ResetPassword]: { [Default]: queries.resetPassword },
  [ApiEnum.ValidateToken]: { [Default]: queries.useTokenValidation },

  //posts
  [ApiEnum.MarkAsAnnouncement]: { [Default]: queries.updatePost },
  [ApiEnum.RemoveAnnouncement]: { [Default]: queries.updatePost },
  [ApiEnum.GetPost]: { [Default]: queries.useGetPost },
  [ApiEnum.CreatePost]: { [Default]: queries.createPost },
  [ApiEnum.UpdatePost]: { [Default]: queries.updatePost },
  [ApiEnum.DeletePost]: { [Default]: queries.deletePost },

  [ApiEnum.AcknowledgeAnnouncement]: { [Default]: queries.announcementRead },
  [ApiEnum.GetPostAcknowledgements]: {
    [Default]: queries.useInfiniteAcknowledgements,
  },
  [ApiEnum.DownloadPostAcknowledgements]: {
    [Default]: queries.downloadAcknowledgementReport,
  },

  [ApiEnum.GetPostPollVotes]: { [Default]: queries.useInfinitePollVotes },
  [ApiEnum.CreatePollVote]: { [Default]: queries.pollVote },
  [ApiEnum.DeletePollVote]: { [Default]: queries.deletePollVote },

  [ApiEnum.GetMyProfilePosts]: { [Default]: queries.useInfiniteMyProfileFeed },
  [ApiEnum.GetMyRecognitionPosts]: {
    [Default]: queries.useInfiniteMyRecognitionFeed,
  },
  [ApiEnum.GetUserProfilePosts]: {
    [Default]: queries.useInfinitePeopleProfileFeed,
  },
  [ApiEnum.GetUserRecognitionPosts]: {
    [Default]: queries.useInfinitePeopleProfileRecognitionFeed,
  },

  [ApiEnum.GetFeedPosts]: { [Default]: queries.useInfiniteFeed },
  [ApiEnum.GetAnnouncementPosts]: {
    [Default]: (limit: number, queryKey: string) =>
      queries.useAnnouncementsWidget(limit, queryKey, true, false),
    [Member]: (limit: number, queryKey: string) =>
      queries.useAnnouncementsWidget(limit, queryKey, false, true),
  },

  [ApiEnum.CreateBookmarkPost]: { [Default]: queries.createBookmark },
  [ApiEnum.DeleteBookmarkPost]: { [Default]: queries.deleteBookmark },

  //reactions
  [ApiEnum.GetReactions]: { [Default]: queries.useInfiniteReactions },
  [ApiEnum.CreateReaction]: { [Default]: queries.createReaction },
  [ApiEnum.DeleteReaction]: { [Default]: queries.deleteReaction },

  //skills
  [ApiEnum.GetSkills]: { [Default]: queries.useInfiniteSkills },

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

  //support
  [ApiEnum.ContactSales]: { [Default]: queries.contactSales },

  //teams
  [ApiEnum.GetTeams]: { [Default]: queries.useInfiniteTeams },
  [ApiEnum.GetTeam]: { [Default]: queries.useSingleTeam },
  [ApiEnum.GetTeamMembers]: { [Default]: queries.useInfiniteTeamMembers },
  [ApiEnum.CreateTeam]: { [Default]: queries.createTeams },
  [ApiEnum.UpdateTeam]: { [Default]: queries.updateTeam },
  [ApiEnum.DeleteTeam]: { [Default]: queries.deleteTeam },
  [ApiEnum.AddTeamMembers]: { [Default]: queries.addTeamMember },
  [ApiEnum.RemoveTeamMembers]: { [Default]: queries.removeTeamMember },

  //users
  [ApiEnum.GetMe]: { [Default]: queries.useCurrentUser },
  [ApiEnum.GetMeApi]: { [Default]: queries.fetchMe },
  [ApiEnum.GetUsers]: { [Default]: queries.useInfiniteUsers },
  [ApiEnum.GetUser]: { [Default]: queries.useSingleUser },
  [ApiEnum.GetUserApi]: { [Default]: queries.getUser },
  [ApiEnum.GetMembers]: { [Default]: queries.useInfiniteMembers },
  [ApiEnum.GetUserEmailExistsOpen]: { [Default]: queries.useIsUserExistOpen },
  [ApiEnum.GetUserExistsAuthenticated]: {
    [Default]: queries.useIsUserExistAuthenticated,
  },
  [ApiEnum.GetOrganizationDomainExists]: {
    [Default]: queries.useDomainExists,
  },
  [ApiEnum.GetNotificationSettings]: {
    [Default]: queries.useNotificationSettings,
  },
  [ApiEnum.VerifyInviteLink]: { [Default]: queries.verifyInviteLink },
  [ApiEnum.UpdateMe]: { [Default]: queries.updateCurrentUser },
  [ApiEnum.UpdateUser]: { [Default]: queries.updateUserById },
  [ApiEnum.DeleteUser]: { [Default]: queries.deleteUser },
  [ApiEnum.InviteUsers]: { [Default]: queries.inviteUsers },
  [ApiEnum.AcceptInviteSetPassword]: {
    [Default]: queries.acceptInviteSetPassword,
  },
  [ApiEnum.GetOrganizationChart]: { [Default]: queries.useOrgChart },
  [ApiEnum.GetOrganizationChartApi]: { [Default]: queries.getOrgChart },
  [ApiEnum.ResendInvitation]: { [Default]: queries.useResendInvitation },
};
