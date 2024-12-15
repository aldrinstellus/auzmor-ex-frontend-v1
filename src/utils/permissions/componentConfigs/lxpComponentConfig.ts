import AppLauncher from 'components/AppLauncher';
import AnnouncementWidget from 'components/AnnouncementWidget';
import ChannelRequestWidget from 'components/ChannelRequestWidget';
import ChannelAdminsWidget from 'pages/ChannelDetail/components/AdminsWidget';
import ChannelLinksWidget from 'components/LinksWidget';
import ChannelMembersWidget from 'pages/ChannelDetail/components/MembersWidget';
import ChannelsWidget from 'components/ChannelsWidget';
import EvaluationRequestWidget from 'components/EvaluationRequestWidget';
import EventWidget from 'components/EventWidget';
import ProgressTrackerWidget from 'components/ProgressTrackerWidget';
import Recommendation from 'components/Recommendation';
import TeamsWidget from 'components/MyTeamWidget';
import UserWidget from 'components/UserWidget';

import { ComponentEnum } from '../enums/componentEnum';
import { LxpRoleEnum } from '../enums/roleEnum';

const { Default, Admin, PrimaryAdmin, Learner } = LxpRoleEnum;

export const componentConfigLxp = {
  [ComponentEnum.AppLauncherWidget]: {
    [Default]: AppLauncher,
  },
  [ComponentEnum.AnnouncementWidget]: {
    [PrimaryAdmin]: AnnouncementWidget,
    [Admin]: AnnouncementWidget,
  },
  [ComponentEnum.ChannelAdminsWidget]: {
    [Default]: ChannelAdminsWidget,
  },
  [ComponentEnum.ChannelLinksWidget]: {
    [Default]: ChannelLinksWidget,
  },
  [ComponentEnum.ChannelMembersWidget]: {
    [Default]: ChannelMembersWidget,
  },
  [ComponentEnum.ChannelRequestWidget]: {
    [Default]: ChannelRequestWidget,
  },
  [ComponentEnum.ChannelsWidget]: {
    [Default]: ChannelsWidget,
  },
  [ComponentEnum.EvaluationRequestWidget]: {
    [PrimaryAdmin]: EvaluationRequestWidget,
    [Admin]: EvaluationRequestWidget,
  },
  [ComponentEnum.EventWidget]: {
    [Learner]: EventWidget,
  },
  [ComponentEnum.ProgressTrackerWidget]: {
    [Learner]: ProgressTrackerWidget,
  },
  [ComponentEnum.RecommendationWidget]: {
    [Learner]: Recommendation,
  },
  [ComponentEnum.TeamsWidget]: {
    [Default]: TeamsWidget,
  },
  [ComponentEnum.UserCardWidget]: {
    [Default]: UserWidget,
  },
};
