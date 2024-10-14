import Icon from 'components/Icon';
import { Logo } from 'components/Logo';
import PopupMenu from 'components/PopupMenu';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import './style.css';
import { getLearnUrl } from 'utils/misc';
import LxpNotificationsOverview from 'components/LxpNotificationsOverview';
import AccountCard from './AccountCard';
import { clsx } from 'clsx';
import useAuth from 'hooks/useAuth';

interface INavbarLxpProps {}

const Navbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
  const { pathname } = useLocation();
  const { user } = useAuth();

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
    case '/user/teams':
      backBtn.show = true;
      backBtn.linkTo = '/user/feed';
      backBtn.label = t('learn.backToFeed');
      backBtn.for = t('learn.myTeams');
      break;
  }

  const navbarMenu = [
    {
      id: 'home',
      label: t('learn.home'),
      to: '/user/feed',
      icon: pathname.startsWith('/user/feed') ? 'homeFilled' : 'home',
      show: true,
      options: [],
      isActive: pathname.startsWith('/user/feed'),
    },
    {
      id: 'channels',
      label: t('learn.channels'),
      to: '/user/channels',
      show: true,
      icon: pathname.startsWith('/user/channels')
        ? 'exploreFilled'
        : 'exploreOutline',
      options: [],
      isActive: pathname.startsWith('/user/channels'),
    },
    {
      id: 'training',
      label: t('learn.training'),
      to: '',
      show: true,
      icon: 'training',
      options: [
        {
          id: 'myLearning',
          label: t('learn.myLearning'),
          onClick: () => window.location.replace(`${getLearnUrl('/user')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-neutral-500 group-hover:!text-black leading-4',
        },
        {
          id: 'allTrainings',
          label: t('learn.allTrainings'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/user/trainings')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-neutral-500 group-hover:!text-black leading-4',
        },
      ],
    },
    {
      id: 'learningCenter',
      label: t('learn.learningCenter'),
      to: '',
      show: true,
      icon: 'learningCenter',
      options: [
        {
          id: 'tasks',
          label: t('learn.tasks'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/user/tasks')}`),
          show: !!user?.organization?.setting?.enablechecklist,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-neutral-500 group-hover:!text-black leading-4',
        },
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/mentorship/overview')}`),
          show: !!user?.organization?.setting?.enableMentorship,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-neutral-500 group-hover:!text-black leading-4',
        },
        {
          id: 'forums',
          label: t('learn.forums'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/user/forums')}`),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: '!text-neutral-500 group-hover:!text-black leading-4',
        },
      ].filter((option) => option.show),
    },
  ];

  const getNavItemStyle = (id: string) => {
    switch (id) {
      case 'home':
      case 'channels':
      case 'training':
      case 'learningCenter':
        return clsx({
          'my-[5px] flex gap-2 items-center text-[15px] text-neutral-500 px-2.5 py-1 transition ease duration-150 group-hover/item:bg-neutral-100 hover:bg-neutral-100 font-medium rounded-xl cursor-pointer group':
            true,
          'text-primary-500':
            (!!pathname.startsWith('/user/feed') && id === 'home') ||
            (!!pathname.startsWith('/user/channels') && id === 'channels'),
        });
      case 'backBtn':
        return clsx({
          'my-[5px] nav-item text-[15px] gap-[8px] transition ease duration-150 group-hover/item:text-primary-500 flex items-center px-4 py-2 border rounded-17xl group':
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
    <div className="h-[78px] flex items-center justify-center bg-white px-14 sticky top-0 w-full z-50">
      <div className="w-full max-w-[1440px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          {backBtn.show && (
            <div className="text-neutral-900 text-base font-bold">
              {backBtn.for}
            </div>
          )}
        </div>
        {!backBtn.show && (
          <div className="flex items-center gap-8 h-full">
            <div className="flex items-center gap-[24px]">
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
                            <Icon
                              name={item.icon}
                              size={18}
                              dataTestId={`${item.id}-collapse`}
                              className="group-hover/item:!text-neutral-500"
                            />
                            <span className="text-[15px]">{item.label}</span>
                            <Icon
                              name="arrowDown2"
                              size={20}
                              dataTestId={`${item.id}-collapse`}
                              className="group-hover/item:!text-neutral-500 navbar-arrow-icon group-hover/item:navbar-arrow-icon-hover"
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
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      key={item.id}
                      className={getNavItemStyle(item.id)}
                    >
                      <Icon
                        name={item.icon}
                        size={item.id === 'channels' ? 22 : 18}
                        dataTestId={`${item.id}-collapse`}
                        className={
                          item?.isActive
                            ? 'text-primary-500 group-hover:!text-primary-500'
                            : 'group-hover:!text-neutral-500'
                        }
                      />
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
            key={'backBtnNavbarModern'}
            className={getNavItemStyle('backBtn')}
          >
            <Icon
              name={'arrowLeft'}
              size={18}
              dataTestId={`backBtnNavbarModernIcon`}
            />
            {backBtn.label}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
