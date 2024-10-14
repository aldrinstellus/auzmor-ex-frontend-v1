import clsx from 'clsx';
import AccountCard from './AccountCard';
import Icon from 'components/Icon';
import { Logo } from 'components/Logo';
import LxpNotificationsOverview from 'components/LxpNotificationsOverview';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { getLearnUrl } from 'utils/misc';
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
      show: true,
      isActive: pathname.startsWith('/user/feed'),
    },
    {
      id: 'channels',
      label: t('learn.channels'),
      to: '/user/channels',
      show: true,
      isActive: pathname.startsWith('/user/channels'),
    },
    {
      id: 'myLearning',
      label: t('learn.myLearning'),
      to: `${getLearnUrl('/user')}`,
      show: true,
    },
    {
      id: 'courses',
      label: t('learn.courses'),
      to: `${getLearnUrl('/user/courses')}`,
      show: true,
    },
    {
      id: 'paths',
      label: t('learn.paths'),
      to: `${getLearnUrl('/user/paths')}`,
      show: true,
    },
    {
      id: 'events',
      label: t('learn.events'),
      to: `${getLearnUrl('/user/events')}`,
      show: true,
    },
    {
      id: 'tasks',
      label: t('learn.tasks'),
      to: `${getLearnUrl('/user/tasks')}`,
      show: !!user?.organization?.setting?.enablechecklist,
    },
    {
      id: 'mentorship',
      label: t('learn.mentorship'),
      to: `${getLearnUrl('/user/mentorship/overview')}`,
      show: !!user?.organization?.setting?.enableMentorship,
    },
    {
      id: 'forums',
      label: t('learn.forums'),
      to: `${getLearnUrl('/user/forums')}`,
      show: true,
    },
  ];

  const optionWrapperStyle = clsx({
    'w-full max-w-[1440px] flex items-center': true,
    'justify-between': backBtn.show,
  });

  return (
    <div className="h-[78px] flex items-center justify-center bg-white px-14 sticky top-0 w-full z-50">
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
                .map((item) => (
                  <NavLink
                    to={item.to}
                    key={item.id}
                    className={`nav-item text-[15px] px-[10px] py-[4px] gap-[8px] transition ease duration-150 flex items-center hover:bg-neutral-100 ${
                      item.isActive
                        ? 'font-bold text-primary-500 hover:!text-black'
                        : ''
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
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
            key={'backBtnNavbarClassic'}
            className={`nav-item text-[15px] gap-[8px] transition ease duration-150 hover:text-primary-500 flex items-center px-4 py-2 border rounded-17xl`}
          >
            <Icon
              name={'arrowLeft'}
              size={18}
              dataTestId={`backBtnNavbarClassicIcon`}
            />
            {backBtn.label}
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
