import { FC } from 'react';
import { usePageTitle } from 'hooks/usePageTitle';
import Feed from 'components/Feed';
import { useLocation } from 'react-router-dom';
import { CELEBRATION_TYPE } from 'components/CelebrationWidget';
import { FeedModeEnum } from 'stores/feedStore';
import { ComponentEnum } from 'utils/permissions/enums/componentEnum';
import { ADMIN_MODULES, LEARNER_MODULES } from 'constants/permissions';
import { isModuleAccessible } from 'utils/customRolesPermissions/permissions';
import usePermissionStore from 'stores/permissionsStore';
import { LEARNER_ACCESSIBLE_TRAININGS } from 'constants/training';

interface IHomeFeedProps {}

export interface IProfileImage {
  blurHash: string;
  original: string;
}

export interface ICreated {
  designation: string;
  fullName: string;
  userId: string;
  workLocation: Record<string, string>;
  status: string;
  department: string;
  profileImage: IProfileImage;
}
export interface IMyReactions {
  id?: string;
  type?: string;
  reaction?: string;
  createdBy?: ICreated;
}

const HomeFeed: FC<IHomeFeedProps> = () => {
  const { pathname } = useLocation();
  const accessibleModules = usePermissionStore((state) =>
      state.getAccessibleModules()
  );

  const canReadTeamsWidget = isModuleAccessible(
      accessibleModules, ADMIN_MODULES.TEAM_ADMIN,
  );
  const isCoursesModuleAccessible = isModuleAccessible(
      accessibleModules, ADMIN_MODULES.COURSE_ADMIN,
  );
  const isEventsModuleAccessible = isModuleAccessible(
      accessibleModules, ADMIN_MODULES.EVENT_ADMIN,
  );

  const isLearnersTrainingsModulesAccessible = isModuleAccessible(accessibleModules, LEARNER_ACCESSIBLE_TRAININGS);
  const isLearnersEventsModulesAccessible = isModuleAccessible(accessibleModules, LEARNER_MODULES.EVENT_LEARNER);

  const bookmarks = pathname === '/bookmarks' || pathname == '/user/bookmarks';
  const scheduled =
    pathname === '/scheduledPosts' || pathname == '/user/scheduledPosts';
  const announcements =
    pathname === '/announcements' || pathname == '/user/announcements';

  // Set page title
  if (scheduled) {
    usePageTitle('scheduledPosts');
  } else if (bookmarks) {
    usePageTitle('bookmarks');
  } else if (announcements) {
    usePageTitle('announcements');
  } else {
    usePageTitle('feed');
  }

  return (
    <Feed
      mode={FeedModeEnum.Default}
      leftWidgets={[
        ComponentEnum.UserCardWidget,
        ComponentEnum.AppLauncherWidget,
        ComponentEnum.ChannelsWidget,
        ...(canReadTeamsWidget ? [ComponentEnum.TeamsWidget] : []),
      ]}
      rightWidgets={[
        ...(isLearnersTrainingsModulesAccessible ? [ComponentEnum.ProgressTrackerWidget] : []),
        ComponentEnum.BirthdayCelebrationWidget,
        ComponentEnum.AnniversaryCelebrationWidget,
        ...(isLearnersEventsModulesAccessible ? [ComponentEnum.EventWidget] : []),
        ComponentEnum.AnnouncementWidget,
        ComponentEnum.ChannelRequestWidget, 
        ...((isCoursesModuleAccessible || isEventsModuleAccessible) ? [ComponentEnum.EvaluationRequestWidget] : []),
      ]}
      widgetProps={{
        [ComponentEnum.BirthdayCelebrationWidget]: {
          type: CELEBRATION_TYPE.Birthday,
        },
        [ComponentEnum.AnniversaryCelebrationWidget]: {
          type: CELEBRATION_TYPE.WorkAnniversary,
        },
        [ComponentEnum.EvaluationRequestWidget]: {
          permissions: {
            canReadCourses: isCoursesModuleAccessible,
            canReadEvents: isEventsModuleAccessible,
          },
        },
      }}
      modeProps={{ [FeedModeEnum.Default]: {} }}
    />
  );
};

export default HomeFeed;
