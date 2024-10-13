import { FC } from 'react';
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
import AccountCard from 'components/AppShell/components/AccountCard';

interface INavbarLxpProps {}

const AdminNavbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const backBtn = {
    show: false,
    linkTo: '',
    label: '',
    for: '',
  };

  switch (pathname) {
    case '/user/apps':
      backBtn.show = true;
      backBtn.linkTo = '/user/feed';
      backBtn.label = t('learn.backToFeed');
      backBtn.for = t('learn.appLauncher');
      break;
    case '/apps':
      backBtn.show = true;
      backBtn.linkTo = '/feed';
      backBtn.label = t('learn.backToFeed');
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
      optionContainerClassname: 'group-hover/item:h-[78px]',
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
      optionContainerClassname: 'group-hover/item:h-[156px]',
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
      optionContainerClassname: 'group-hover/item:h-[117px]',
      options: [
        {
          id: 'tasks',
          label: t('learn.tasks'),
          onClick: () => window.location.replace(`${getLearnUrl('/tasks')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/mentorship')}`),
          show: true,
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
      ],
    },
    {
      id: 'company',
      label: t('learn.company'),
      to: '',
      show: true,
      optionContainerClassname: 'group-hover/item:h-[117px]',
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
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-black hover:!text-black leading-4',
        },
      ],
    },
    {
      id: 'analytics',
      label: t('learn.analytics'),
      to: '',
      show: true,
      optionContainerClassname: 'group-hover/item:h-[78px]',
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
      show: true,
      optionContainerClassname: 'group-hover/item:h-[78px]',
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
  ];

  const optionWrapperStyle = clsx({
    'w-full max-w-[1440px] flex items-center': true,
    'justify-between': backBtn.show,
  });

  const getNavItemStyle = (id: string) => {
    switch (id) {
      case 'engage':
        return clsx({
          'my-[5px] text-[15px] px-2.5 py-1 transition ease duration-150 text-primary-500 group-hover/item:bg-neutral-100 group-hover/item:text-black font-semibold cursor-pointer rounded-xl flex group':
            true,
        });
      case 'home':
      case 'training':
      case 'learningCenter':
      case 'company':
      case 'analytics':
      case 'ecommerce':
        return clsx({
          'my-[5px] flex text-[15px] px-2.5 py-1 transition ease duration-150 group-hover/item:bg-neutral-100 hover:bg-neutral-100 group-hover/item:text-black font-medium rounded-xl cursor-pointer group':
            true,
        });
      case 'backBtn':
        return clsx({
          'my-[5px] nav-item text-[15px] gap-[8px] transition ease duration-150 group-hover/item:text-primary-500 flex items-center px-4 py-2 border rounded-17xl group':
            true,
        });
    }
    return '';
  };

  return (
    <div className="group-hover/item:h-[78px] flex items-center justify-center bg-white px-14 sticky top-0 w-full z-50">
      <div className={optionWrapperStyle}>
        <div className="flex items-center gap-2">
          <Logo />
          {backBtn.show && (
            <div className="text-neutral-900 text-base font-bold">
              {backBtn.for}
            </div>
          )}
        </div>
        {!backBtn.show && (
          <div className="flex items-center justify-between gap-8 h-full w-full">
            <div className="ml-[26px] flex items-center gap-[16px]">
              {navbarMenu
                .filter((item) => item.show)
                .map((item) =>
                  item.options.length > 0 ? (
                    <div className="relative group/item" key={item.id}>
                      <PopupMenu
                        triggerNode={
                          <div
                            tabIndex={0}
                            className={getNavItemStyle(item.id)}
                          >
                            <span className="text-[15px]">{item.label}</span>
                            <Icon
                              name="arrowDown2"
                              size={20}
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
                        className={`dropdown-menu-option group-hover/item:visible invisible h-[39px] !transition-[height] !duration-500 w-[124px] left-1/2 -translate-x-1/2 ${item.optionContainerClassname}`}
                        controlled
                        isOpen
                      />
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      key={item.id}
                      className={getNavItemStyle(item.id)}
                    >
                      {item.label}
                    </NavLink>
                  ),
                )}
            </div>
            <ul className="flex items-center gap-6">
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
  );
};

export default AdminNavbar;
