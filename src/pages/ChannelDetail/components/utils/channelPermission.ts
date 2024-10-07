import { CHANNEL_ROLE, ChannelVisibilityEnum } from 'stores/channelStore';

export enum ChannelPermissionEnum {
  CanViewContentOnly = 'CAN_VIEW_CONTENT_Only',
  CanAddMember = 'CAN_ADD_MEMBER',
  CanRemoveMember = 'CAN_REMOVE_MEMBER',
  CanPromoteMember = 'CAN_PROMOTE_MEMBER',
  CanEditSettings = 'CAN_EDIT_SETTINGS',
  CanPostContent = 'CAN_POST_CONTENT',
  CanInviteSelf = 'CAN_INVITE_SELF',
  CanManageChannelRequests = 'CAN_MANAGE_CHANNEL_REQUESTS',

  CanArchive = 'CAN_ARCHIVE',
  CanAccessHomeTab = 'CAN_ACCESS_HOME_TAB',
  CanAccessManageTab = 'CAN_ACCESS_MANAGE_TAB',
  CanAccessMembersTab = 'CAN_ACCESS_MEMBERS_TAB',
  CanAccessDocumentsTab = 'CAN_ACCESS_DOCUMENTS_TAB',
  CanAccessSettingsTab = 'CAN_ACCESS_SETTINGS_TAB',
}

export const getChannelPermissions: (
  isLxp: boolean,
  isLearner: boolean,
  channelPrivacy: ChannelVisibilityEnum,
  isChannelJoined: boolean,
  channelRole: CHANNEL_ROLE,
  isAdmin: boolean,
) => ChannelPermissionEnum[] = (
  isLxp,
  isLearner,
  channelPrivacy,
  isChannelJoined,
  channelRole,
  isAdmin,
) => {
  let channelPermissions: ChannelPermissionEnum[] = [];
  if (isLxp) {
    if (!isLearner) {
      if (channelPrivacy === ChannelVisibilityEnum.Public) {
        if (!isChannelJoined) {
          // 1 -> LXP -> Admin view - > Public channel -> Not joined
          channelPermissions = [
            ChannelPermissionEnum.CanViewContentOnly,
            ChannelPermissionEnum.CanAddMember,
            ChannelPermissionEnum.CanRemoveMember,
            ChannelPermissionEnum.CanPromoteMember,
            ChannelPermissionEnum.CanEditSettings,
            ChannelPermissionEnum.CanArchive,
            ChannelPermissionEnum.CanAccessHomeTab,
            ChannelPermissionEnum.CanAccessManageTab,
            ChannelPermissionEnum.CanAccessMembersTab,
            ChannelPermissionEnum.CanAccessDocumentsTab,
            ChannelPermissionEnum.CanAccessSettingsTab,
          ];
        } else {
          if (channelRole === CHANNEL_ROLE.Member) {
            // 2 -> LXP -> Admin view - > Public channel -> Joined -> Channel Role -> Member
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanAddMember,
              ChannelPermissionEnum.CanRemoveMember,
              ChannelPermissionEnum.CanPromoteMember,
              ChannelPermissionEnum.CanEditSettings,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanArchive,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessManageTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          } else if (channelRole === CHANNEL_ROLE.Admin) {
            // 3 -> LXP -> Admin view - > Public channel -> Joined -> Channel Role -> Channel Admin
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanAddMember,
              ChannelPermissionEnum.CanRemoveMember,
              ChannelPermissionEnum.CanPromoteMember,
              ChannelPermissionEnum.CanEditSettings,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanArchive,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessManageTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          }
        }
      } else if (channelPrivacy === ChannelVisibilityEnum.Private) {
        if (!isChannelJoined) {
          // 4 -> LXP -> Admin view - > Private channel -> Not Joined
          channelPermissions = [
            ChannelPermissionEnum.CanAddMember,
            ChannelPermissionEnum.CanRemoveMember,
            ChannelPermissionEnum.CanPromoteMember,
            ChannelPermissionEnum.CanEditSettings,
            ChannelPermissionEnum.CanInviteSelf,
            ChannelPermissionEnum.CanManageChannelRequests,
            ChannelPermissionEnum.CanArchive,
            ChannelPermissionEnum.CanAccessManageTab,
            ChannelPermissionEnum.CanAccessMembersTab,
            ChannelPermissionEnum.CanAccessDocumentsTab,
            ChannelPermissionEnum.CanAccessSettingsTab,
          ];
        } else {
          if (channelRole === CHANNEL_ROLE.Member) {
            // 5 -> LXP -> Admin view - > Private channel -> Joined -> Channel Role -> Channel Member
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanAddMember,
              ChannelPermissionEnum.CanRemoveMember,
              ChannelPermissionEnum.CanPromoteMember,
              ChannelPermissionEnum.CanEditSettings,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanManageChannelRequests,
              ChannelPermissionEnum.CanArchive,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessManageTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          } else if (channelRole === CHANNEL_ROLE.Admin) {
            // 6 -> LXP -> Admin view - > Private channel -> Joined -> Channel Role -> Channel Admin
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanAddMember,
              ChannelPermissionEnum.CanRemoveMember,
              ChannelPermissionEnum.CanPromoteMember,
              ChannelPermissionEnum.CanEditSettings,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanManageChannelRequests,
              ChannelPermissionEnum.CanArchive,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessManageTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          }
        }
      }
    } else {
      if (channelPrivacy === ChannelVisibilityEnum.Public) {
        if (!isChannelJoined) {
          // 7 -> LXP -> Learner view - > Public channel -> Not joined
          channelPermissions = [ChannelPermissionEnum.CanViewContentOnly];
        } else {
          if (channelRole === CHANNEL_ROLE.Member) {
            // 8 -> LXP -> Learner view - > Public channel -> Joined -> Channel Role -> Member
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          } else if (channelRole === CHANNEL_ROLE.Admin) {
            // 9 -> LXP -> Learner view - > Public channel -> Joined -> Channel Role -> Channel Admin
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanAddMember,
              ChannelPermissionEnum.CanRemoveMember,
              ChannelPermissionEnum.CanPromoteMember,
              ChannelPermissionEnum.CanEditSettings,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanManageChannelRequests,
              ChannelPermissionEnum.CanArchive,
              ChannelPermissionEnum.CanAccessManageTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          }
        }
      } else if (channelPrivacy === ChannelVisibilityEnum.Private) {
        if (!isChannelJoined) {
          // 10 -> LXP -> Learner view - > Private channel -> Not Joined
          channelPermissions = [];
        } else {
          if (channelRole === CHANNEL_ROLE.Member) {
            // 11 -> LXP -> Learner view - > Private channel -> Joined -> Channel Role -> Channel Member
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          } else if (channelRole === CHANNEL_ROLE.Admin) {
            // 12 -> LXP -> Learner view - > Private channel -> Joined -> Channel Role -> Channel Admin
            channelPermissions = [
              ChannelPermissionEnum.CanViewContentOnly,
              ChannelPermissionEnum.CanAddMember,
              ChannelPermissionEnum.CanRemoveMember,
              ChannelPermissionEnum.CanPromoteMember,
              ChannelPermissionEnum.CanEditSettings,
              ChannelPermissionEnum.CanPostContent,
              ChannelPermissionEnum.CanManageChannelRequests,
              ChannelPermissionEnum.CanArchive,
              ChannelPermissionEnum.CanAccessManageTab,
              ChannelPermissionEnum.CanAccessMembersTab,
              ChannelPermissionEnum.CanAccessDocumentsTab,
              ChannelPermissionEnum.CanAccessHomeTab,
              ChannelPermissionEnum.CanAccessSettingsTab,
            ];
          }
        }
      }
    }
  } else {
    if (channelPrivacy === ChannelVisibilityEnum.Public) {
      if (!isChannelJoined) {
        // 13 -> Office -> Public channel -> Not joined
        channelPermissions = [ChannelPermissionEnum.CanViewContentOnly];
      } else {
        if (channelRole === CHANNEL_ROLE.Member) {
          // 14 -> Office -> Public channel -> Joined -> Channel Role -> Member
          channelPermissions = [
            ChannelPermissionEnum.CanViewContentOnly,
            ChannelPermissionEnum.CanPostContent,
            ChannelPermissionEnum.CanAccessHomeTab,
            ChannelPermissionEnum.CanAccessMembersTab,
            ChannelPermissionEnum.CanAccessDocumentsTab,
            ChannelPermissionEnum.CanAccessSettingsTab,
          ];
        } else if (channelRole === CHANNEL_ROLE.Admin) {
          // 15 -> Office -> Public channel -> Joined -> Channel Role -> Channel Admin
          channelPermissions = [
            ChannelPermissionEnum.CanViewContentOnly,
            ChannelPermissionEnum.CanAddMember,
            ChannelPermissionEnum.CanRemoveMember,
            ChannelPermissionEnum.CanPromoteMember,
            ChannelPermissionEnum.CanEditSettings,
            ChannelPermissionEnum.CanPostContent,
            ChannelPermissionEnum.CanArchive,
            ChannelPermissionEnum.CanAccessManageTab,
            ChannelPermissionEnum.CanAccessMembersTab,
            ChannelPermissionEnum.CanAccessDocumentsTab,
            ChannelPermissionEnum.CanAccessHomeTab,
            ChannelPermissionEnum.CanAccessSettingsTab,
          ];
        }
      }
    } else if (channelPrivacy === ChannelVisibilityEnum.Private) {
      if (!isChannelJoined) {
        if (isAdmin) {
          // 16 -> Office -> Private channel -> Not Joined -> Admin
          channelPermissions = [ChannelPermissionEnum.CanInviteSelf];
        } else {
          // 17 -> Office -> Private channel -> Not Joined -> Member
          channelPermissions = [];
        }
      } else {
        if (channelRole === CHANNEL_ROLE.Member) {
          // 18 -> Office -> Private channel -> Joined -> Channel Role -> Channel Member
          channelPermissions = [
            ChannelPermissionEnum.CanViewContentOnly,
            ChannelPermissionEnum.CanPostContent,
            ChannelPermissionEnum.CanAccessHomeTab,
            ChannelPermissionEnum.CanAccessSettingsTab,
          ];
        } else if (channelRole === CHANNEL_ROLE.Admin) {
          // 19 -> Office -> Private channel -> Joined -> Channel Role -> Channel Admin
          channelPermissions = [
            ChannelPermissionEnum.CanViewContentOnly,
            ChannelPermissionEnum.CanAddMember,
            ChannelPermissionEnum.CanRemoveMember,
            ChannelPermissionEnum.CanPromoteMember,
            ChannelPermissionEnum.CanEditSettings,
            ChannelPermissionEnum.CanPostContent,
            ChannelPermissionEnum.CanManageChannelRequests,
            ChannelPermissionEnum.CanArchive,
            ChannelPermissionEnum.CanAccessManageTab,
            ChannelPermissionEnum.CanAccessMembersTab,
            ChannelPermissionEnum.CanAccessDocumentsTab,
            ChannelPermissionEnum.CanAccessHomeTab,
            ChannelPermissionEnum.CanAccessSettingsTab,
          ];
        }
      }
    }
  }

  return channelPermissions;
};
