import AppLauncher from 'components/AppLauncher';
import CelebrationWidget from 'components/CelebrationWidget';
import ChannelRequestWidget from 'components/ChannelRequestWidget';
import ChannelAdminsWidget from 'pages/ChannelDetail/components/AdminsWidget';
import ChannelLinksWidget from 'components/LinksWidget';
import ChannelMembersWidget from 'pages/ChannelDetail/components/MembersWidget';
import ChannelsWidget from 'components/ChannelsWidget';
import NotificationSettingsCard from 'pages/Notifications/components/NotificationSettingsCard';
import TeamsWidget from 'components/MyTeamWidget';
import UserWidget from 'components/UserWidget';

import { ComponentEnum } from '../enums/componentEnum';
import { OfficeRoleEnum } from '../enums/roleEnum';
import { IS_PROD } from 'utils/constants';

const { Default } = OfficeRoleEnum;

export const componentConfigOffice = {
  [ComponentEnum.AppLauncherWidget]: {
    [Default]: AppLauncher,
  },
  [ComponentEnum.AnniversaryCelebrationWidget]: {
    [Default]: CelebrationWidget,
  },
  [ComponentEnum.BirthdayCelebrationWidget]: {
    [Default]: CelebrationWidget,
  },
  [ComponentEnum.ChannelAdminsWidget]: {
    [Default]: !IS_PROD && ChannelAdminsWidget,
  },
  [ComponentEnum.ChannelLinksWidget]: {
    [Default]: !IS_PROD && ChannelLinksWidget,
  },
  [ComponentEnum.ChannelMembersWidget]: {
    [Default]: !IS_PROD && ChannelMembersWidget,
  },
  [ComponentEnum.ChannelRequestWidget]: {
    [Default]: !IS_PROD && ChannelRequestWidget,
  },
  [ComponentEnum.ChannelsWidget]: {
    [Default]: !IS_PROD && ChannelsWidget,
  },
  [ComponentEnum.NotificationSettingsWidget]: {
    [Default]: NotificationSettingsCard,
  },
  [ComponentEnum.TeamsWidget]: {
    [Default]: TeamsWidget,
  },
  [ComponentEnum.UserCardWidget]: {
    [Default]: UserWidget,
  },
};
