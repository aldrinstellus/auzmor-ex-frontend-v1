/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useNavigate from 'hooks/useNavigation';

import { Logo } from 'components/Logo';
import Icon from 'components/Icon';

import './style.css';
import PopupMenu from 'components/PopupMenu';
import { getLearnUrl } from 'utils/misc';
import { clsx } from 'clsx';
import LxpNotificationsOverview from 'components/LxpNotificationsOverview';
import AccountCard from './AccountCard';
import useAuth from 'hooks/useAuth';
import SubscriptionBanner from 'components/AppShell/components/SubscriptionBanner';
import IconButton from 'components/IconButton';
import GlobalSearch from 'components/GlobalSearch';
import usePermissionStore from 'stores/permissionsStore';
import { isModuleAccessible } from 'utils/customRolesPermissions/permissions';
import { ADMIN_MODULES } from 'constants/permissions';

interface INavbarLxpProps {}

const AdminNavbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const accessibleModules = usePermissionStore((state) =>
    state.getAccessibleModules()
  );

  const isAdministrativeDashboardAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.DASHBOARD_ADMIN,
  );

  const isAdministrativeCourseAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.COURSE_ADMIN,
  );

  const isAdministrativePathAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.LEARNING_PATH_ADMIN,
  );

  const isAdministrativeTaskAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.TASK_ADMIN,
  );

  const isAdministrativeMentorshipAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.MENTORSHIP_ADMIN,
  );

  const isAdministrativeUserAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.USER_ADMIN,
  );

  const isAdministrativeTeamAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.TEAM_ADMIN,
  );
  const isAdministrativeInsightAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.INSIGHT_ADMIN,
  );

  const isAdministrativeBranchAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.BRANCH_ADMIN,
  );

  const isAdministrativeEventAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.EVENT_ADMIN,
  );

  const isAdministrativeEcommerceEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.ECOMMERCE_ADMIN,
  );

  const isAdministrativeForumAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.FORUMS_ADMIN,
  );

  const isAdministrativeExternalTrainingAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.EXTERNAL_TRAINING_ADMIN,
  );

  const isAdministrativeFeedsAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.FEEDS_ADMIN,
  );

  const isAdministrativeChannelAccessEnabled = isModuleAccessible(
    accessibleModules, ADMIN_MODULES.CHANNEL_ADMIN,
  );



  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(
    user?.subscription?.type === 'TRIAL' &&
      user?.subscription?.daysRemaining > -1,
  );

  const backBtn = {
    show: false,
    linkTo: '',
    label: '',
    for: '',
  };

  const isLxpEnabled = user?.organization.type === 'LXP';

  switch (pathname) {
    case '/user/apps':
      backBtn.show = true;
      backBtn.linkTo = isLxpEnabled ? '/user/feed' : getLearnUrl('/user');
      backBtn.label = isLxpEnabled
        ? t('learn.backToFeed')
        : t('learn.backToHome');
      backBtn.for = t('learn.appLauncher');
      break;
    case '/apps':
      backBtn.show = true;
      backBtn.linkTo = isLxpEnabled ? '/feed' : getLearnUrl();
      backBtn.label = isLxpEnabled
        ? t('learn.backToFeed')
        : t('learn.backToHome');
      backBtn.for = t('learn.appLauncher');
      break;
  }

  const navbarMenu = [
    {
      id: 'home',
      label: t('learn.home'),
      to: getLearnUrl(),
      show: isAdministrativeDashboardAccessEnabled,
      options: [],
    },
    {
      id: 'engagement',
      label: t('learn.engagement'),
      to: '',
      show: true,
      isActive: true,
      options: [
        {
          id: 'feed',
          label: t('learn.feed'),
          dataTestId: 'feed-menu',
          onClick: () => navigate('/feed'),
          show: isAdministrativeFeedsAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: `!text-[15px] !leading-4 !text-black hover:!text-black leading-4 ${
            pathname.startsWith('/feed') && '!font-bold !text-primary-500'
          }`,
        },
        {
          id: 'channels',
          label: t('learn.channels'),
          dataTestId: 'channels-menu',
          onClick: () => navigate('/channels'),
          show: isAdministrativeChannelAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: `!text-[15px] !leading-4 !text-black hover:!text-black leading-4 ${
            pathname.startsWith('/channels') && '!font-bold !text-primary-500 '
          }`,
        },
        {
          id: 'forums',
          label: t('learn.forums'),
          dataTestId: 'forums-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/forums')}`),
          show: !!user?.organization?.setting?.enableSocialLearning && isAdministrativeForumAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
      ].filter((option) => option.show),
    },
    {
      id: 'training',
      label: t('learn.training'),
      to: '',
      show: true,
      options: [
        {
          id: 'courses',
          label: t('learn.courses'),
          dataTestId: 'courses-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/courses')}`),
          show: isAdministrativeCourseAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'paths',
          label: t('learn.paths'),
          dataTestId: 'paths-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/paths')}`),
          show: isAdministrativePathAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'events',
          label: t('learn.events'),
          dataTestId: 'events-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/events')}`),
          show: isAdministrativeEventAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'external',
          label: t('learn.external'),
          dataTestId: 'external-menu',
          onClick: () =>
            window.location.assign(`${getLearnUrl('/external-trainings')}`),
          show: isAdministrativeExternalTrainingAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
      ],
    },
    {
      id: 'development',
      label: t('learn.development'),
      to: '',
      show: true,
      options: [
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          dataTestId: 'mentorship-menu',
          onClick: () =>
            window.location.assign(`${getLearnUrl('/mentorship/admin')}`),
          show: !!user?.organization?.setting?.enableMentorship && isAdministrativeMentorshipAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'tasks',
          label: t('learn.tasks'),
          dataTestId: 'tasks-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/tasks')}`),
          show: !!user?.organization?.setting?.enablechecklist && isAdministrativeTaskAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
      ].filter((option) => option.show),
    },
    {
      id: 'company',
      label: t('learn.company'),
      to: '',
      show: true,
      options: [
        {
          id: 'people',
          label: t('learn.people'),
          dataTestId: 'people-menu',
          onClick: () =>
            window.location.assign(
              `${getLearnUrl('/peoples?tab=individuals')}`,
            ),
          show: isAdministrativeUserAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'teams',
          label: t('learn.teams'),
          dataTestId: 'teams-menu',
          onClick: () =>
            window.location.assign(`${getLearnUrl('/peoples?tab=teams')}`),
          show: isAdministrativeTeamAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'branches',
          label: t('learn.branches'),
          onClick: () => window.location.assign(`${getLearnUrl('/branches')}`),
          show: !!user?.organization?.setting?.enableBranches && isAdministrativeBranchAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
      ].filter((option) => option.show),
    },
    {
      id: 'analytics',
      label: t('learn.analytics'),
      to: '',
      show: true,
      options: [
        {
          id: 'insights',
          label: t('learn.insights'),
          dataTestId: 'insights-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/insights')}`),
          show: isAdministrativeInsightAccessEnabled,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'reports',
          label: t('learn.reports'),
          dataTestId: 'reports-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/reports')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'customReports',
          label: t('learn.customReports'),
          dataTestId: 'reports-menu',
          onClick: () => window.location.assign(`${getLearnUrl('/custom-reports')}`),
          isBeta: true,
          show: !!user?.organization?.setting?.enableCustomReports,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
      ].filter(option => option.show),
    },
    {
      id: 'ecommerce',
      label: t('learn.ecommerce'),
      to: '',
      show: !!user?.organization?.setting?.enableEcommerce && isAdministrativeEcommerceEnabled,
      options: [
        {
          id: 'orders',
          label: t('learn.orders'),
          onClick: () => window.location.assign(`${getLearnUrl('/orders')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
        {
          id: 'coupons',
          label: t('learn.coupons'),
          onClick: () => window.location.assign(`${getLearnUrl('/coupons')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-[15px] !leading-4 !text-black hover:!text-black leading-4',
        },
      ],
    },
  ].filter((each) => each.show && (each.to || each.options.length > 0));

  const optionWrapperStyle = clsx({
    'w-full max-w-[1280px] flex items-center': true,
    'justify-between': backBtn.show,
  });

  const getNavItemStyle = (id: string) => {
    switch (id) {
      case 'engagement':
        return clsx({
          'gap-1 font-lato items-center font-lato my-[5px] text-[15px] px-2.5 py-1 transition ease duration-150 text-primary-500 group-hover/item:bg-neutral-100 font-semibold cursor-pointer rounded-xl flex group':
            true,
        });
      case 'home':
      case 'training':
      case 'development':
      case 'company':
      case 'analytics':
      case 'ecommerce':
        return clsx({
          'gap-1 font-lato items-center font-lato my-[5px] flex text-[15px] px-2.5 py-1 transition ease duration-150 group-hover/item:bg-neutral-100 hover:bg-neutral-100 font-medium rounded-xl cursor-pointer group':
            true,
        });
      case 'backBtn':
        return clsx({
          'font-lato my-[5px] nav-item text-base gap-[8px] transition ease duration-150 text-neutral-900 flex items-center px-4 py-2 border rounded-17xl group':
            true,
        });
    }
    return '';
  };

  const getOptionHeight = (length: number) => {
    return clsx({
      'group-hover/item:h-[39px]': length === 1,
      'group-hover/item:h-[78px]': length === 2,
      'group-hover/item:h-[117px]': length === 3,
      'group-hover/item:h-[156px]': length === 4,
    });
  };

  const getCustomWidth = (id: string) => {
    switch (id) {
      case "analytics":
        return "!w-[180px]";
      default:
        return "";
    }
  };

  return (
    <div className="sticky top-0 w-full z-50">
      <div className="h-[78px] flex items-center justify-center bg-white px-14">
        <div className={optionWrapperStyle}>
          <div className="flex items-center gap-2">
            <Logo
              className="cursor-pointer min-h-[40px] max-h-[40px] max-w-full align-middle relative mr-1 border-none"
              onClick={() => window.location.assign(getLearnUrl())}
            />
            {backBtn.show && (
              <div className="text-neutral-900 text-base font-bold">
                {backBtn.for}
              </div>
            )}
          </div>
          {!backBtn.show && (
            <div className="flex items-center justify-between gap-8 h-full w-full">
              <ul className="ml-[26px] flex items-center gap-[16px]">
                {navbarMenu
                  .filter((item) => item.show)
                  .map((item) =>
                    item.options.length > 0 ? (
                      <li className="relative group/item" key={item.id}>
                        <PopupMenu
                          triggerNode={
                            <div
                              tabIndex={0}
                              className={getNavItemStyle(item.id)}
                            >
                              <span className="group-hover:!text-black">
                                {item.label}
                              </span>
                              <Icon
                                name="arrowDown3"
                                size={10}
                                dataTestId={`${item.id}-collapse`}
                                className="group-hover:!text-black navbar-arrow-icon group-hover/item:navbar-arrow-icon-hover"
                                color={
                                  item.isActive
                                    ? 'text-primary-500'
                                    : '!text-black'
                                }
                              />
                            </div>
                          }
                          menuItems={item.options}
                          className={`dropdown-menu-option group-hover/item:visible invisible h-[39px] !transition-[height] !duration-300 w-full left-1/2 -translate-x-1/2 ${getOptionHeight(
                            item.options.length,
                          )} ${getCustomWidth(item.id)}`}
                          controlled
                          isOpen
                        />
                      </li>
                    ) : (
                      <li key={item.id}>
                        <NavLink
                          to={item.to}
                          className={getNavItemStyle(item.id)}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ),
                  )}
              </ul>
              <ul className="flex items-center gap-[19px]">
                <div className="w-[1px] h-5 bg-[#e5e5e5]"></div>
                <li>
                  <GlobalSearch
                    permissions={{
                      canReadTrainings: isAdministrativeCourseAccessEnabled || isAdministrativeEventAccessEnabled || isAdministrativePathAccessEnabled,
                      canReadPeoples: isAdministrativeUserAccessEnabled,
                      canReadTeams: isAdministrativeTeamAccessEnabled,
                    }}
                  />
                </li>
                <li>
                  <IconButton
                    icon="messageQuestionOutline"
                    color="text-#888888"
                    size={22}
                    onClick={() => {
                      window.open(`${getLearnUrl()}?openHelpSupport=true`);
                    }}
                    ariaLabel="help and support"
                    className="bg-white hover:!bg-neutral-100 rounded-md active:bg-white py-[9px] px-[13px]"
                    iconClassName="group-hover:!text-neutral-500"
                  />
                </li>
                <li>
                  <LxpNotificationsOverview />
                </li>
                <li>
                  <AccountCard />
                </li>
              </ul>
            </div>
          )}
          {backBtn.show && (
            <NavLink
              to={backBtn.linkTo}
              key={'backBtnAdminNavbarClassic'}
              className={getNavItemStyle('backBtn')}
            >
              <Icon
                name={'arrowLeft'}
                size={18}
                dataTestId={`backBtnAdminNavbarClassicIcon`}
                color="!text-black"
                hoverColor="!text-black"
                hover
              />
              {backBtn.label}
            </NavLink>
          )}
        </div>
      </div>
      {showSubscriptionBanner && (
        <SubscriptionBanner
          closeBanner={() => setShowSubscriptionBanner(false)}
        />
      )}
    </div>
  );
};

export default AdminNavbar;
