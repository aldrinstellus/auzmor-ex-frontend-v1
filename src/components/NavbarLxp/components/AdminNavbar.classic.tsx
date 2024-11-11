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
import useRole from 'hooks/useRole';

interface INavbarLxpProps {}

const AdminNavbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { isSuperAdmin } = useRole();

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
      show: true,
      options: [],
    },
    {
      id: 'engage',
      label: t('learn.engage'),
      to: '',
      show: true,
      isActive: true,
      options: [
        {
          id: 'feed',
          label: t('learn.feed'),
          onClick: () => navigate('/feed'),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: `!text-black hover:!text-black leading-4 ${
            pathname.startsWith('/feed') &&
            '!font-bold !text-primary-500 hover:!text-primary-500'
          }`,
        },
        {
          id: 'channels',
          label: t('learn.channels'),
          onClick: () => navigate('/channels'),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: `!text-black hover:!text-black leading-4 ${
            pathname.startsWith('/channels') &&
            '!font-bold !text-primary-500 hover:!text-primary-500'
          }`,
        },
      ],
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
          onClick: () => window.location.replace(`${getLearnUrl('/courses')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'paths',
          label: t('learn.paths'),
          onClick: () => window.location.replace(`${getLearnUrl('/paths')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'events',
          label: t('learn.events'),
          onClick: () => window.location.replace(`${getLearnUrl('/events')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'external',
          label: t('learn.external'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/external-trainings')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
      ],
    },
    {
      id: 'learningCenter',
      label: t('learn.learningCenter'),
      to: '',
      show: true,
      options: [
        {
          id: 'tasks',
          label: t('learn.tasks'),
          onClick: () => window.location.replace(`${getLearnUrl('/tasks')}`),
          show: !!user?.organization?.setting?.enablechecklist,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/mentorship/overview')}`),
          show: !!user?.organization?.setting?.enableMentorship,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'forums',
          label: t('learn.forums'),
          onClick: () => window.location.replace(`${getLearnUrl('/forums')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
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
          onClick: () =>
            window.location.replace(
              `${getLearnUrl('/peoples?tab=individuals')}`,
            ),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'teams',
          label: t('learn.teams'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/peoples?tab=teams')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'branches',
          label: t('learn.branches'),
          onClick: () => window.location.replace(`${getLearnUrl('/branches')}`),
          show: !!user?.organization?.setting?.enableBranches && isSuperAdmin,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
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
          onClick: () => window.location.replace(`${getLearnUrl('/insights')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'reports',
          label: t('learn.reports'),
          onClick: () => window.location.replace(`${getLearnUrl('/reports')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
      ],
    },
    {
      id: 'ecommerce',
      label: t('learn.ecommerce'),
      to: '',
      show: !!user?.organization?.setting?.enableEcommerce,
      options: [
        {
          id: 'orders',
          label: t('learn.orders'),
          onClick: () => window.location.replace(`${getLearnUrl('/orders')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'coupons',
          label: t('learn.coupons'),
          onClick: () => window.location.replace(`${getLearnUrl('/coupons')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
      ],
    },
  ].filter((each) => each.show);

  const optionWrapperStyle = clsx({
    'w-full max-w-[1280px] flex items-center': true,
    'justify-between': backBtn.show,
  });

  const getNavItemStyle = (id: string) => {
    switch (id) {
      case 'engage':
        return clsx({
          'gap-1 font-lato items-center font-lato my-[5px] text-[15px] px-2.5 py-1 transition ease duration-150 text-primary-500 group-hover/item:bg-neutral-100 group-hover/item:text-black font-semibold cursor-pointer rounded-xl flex group':
            true,
        });
      case 'home':
      case 'training':
      case 'learningCenter':
      case 'company':
      case 'analytics':
      case 'ecommerce':
        return clsx({
          'gap-1 font-lato items-center font-lato my-[5px] flex text-[15px] px-2.5 py-1 transition ease duration-150 group-hover/item:bg-neutral-100 hover:bg-neutral-100 group-hover/item:text-black font-medium rounded-xl cursor-pointer group':
            true,
        });
      case 'backBtn':
        return clsx({
          'font-lato my-[5px] nav-item text-[15px] gap-[8px] transition ease duration-150 group-hover/item:text-primary-500 flex items-center px-4 py-2 border rounded-17xl group':
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

  return (
    <div className="sticky top-0 w-full z-50">
      <div className="h-[78px] flex items-center justify-center bg-white px-14">
        <div className={optionWrapperStyle}>
          <div className="flex items-center gap-2">
            <Logo
              className="cursor-pointer min-h-[40px] max-h-[40px] max-w-full align-middle relative mr-1 border-none"
              onClick={() => window.location.replace(getLearnUrl())}
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
                              {item.label}
                              <Icon
                                name="arrowDown3"
                                size={10}
                                dataTestId={`${item.id}-collapse`}
                                className="group-hover/item:!text-black navbar-arrow-icon group-hover/item:navbar-arrow-icon-hover"
                                color={
                                  item.id === 'engage'
                                    ? 'text-primary-500'
                                    : '!text-black'
                                }
                              />
                            </div>
                          }
                          menuItems={item.options}
                          className={`dropdown-menu-option group-hover/item:visible invisible h-[39px] !transition-[height] !duration-300 w-[124px] left-1/2 -translate-x-1/2 ${getOptionHeight(
                            item.options.length,
                          )}`}
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
                  <IconButton
                    icon="messageQuestionOutline"
                    color="#888888"
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
