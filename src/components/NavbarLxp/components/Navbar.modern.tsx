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

interface INavbarLxpProps {}

const Navbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
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
      icon: 'home',
      show: true,
      options: [],
    },
    {
      id: 'channels',
      label: t('learn.channels'),
      to: '/user/channels',
      show: true,
      icon: 'exploreOutline',
      options: [],
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
        },
        {
          id: 'allTrainings',
          label: t('learn.allTrainings'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/user/trainings')}`),
          show: true,
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
          show: true,
        },
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/mentorship/overview')}`),
          show: true,
        },
        {
          id: 'forums',
          label: t('learn.forums'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/user/forums')}`),
          show: true,
        },
      ],
    },
  ];
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
                    <div className="relative" key={item.id}>
                      <PopupMenu
                        triggerNode={
                          <div
                            tabIndex={0}
                            className="nav-item px-[10px] py-[4px] cursor-pointer flex items-center transition ease duration-150 hover:text-primary-500 multi-navitem"
                          >
                            <Icon
                              name={item.icon}
                              size={18}
                              dataTestId={`${item.id}-collapse`}
                            />
                            <span className="text-[15px] ml-[8px]">
                              {item.label}
                            </span>
                            <Icon
                              name="arrowDown2"
                              size={20}
                              dataTestId={`${item.id}-collapse`}
                            />
                          </div>
                        }
                        menuItems={item.options}
                        className="mt-1 right-0 border-1 border-neutral-200 focus-visible:outline-none"
                      />
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      key={item.id}
                      className={`nav-item text-[15px] px-[10px] py-[4px] gap-[8px] transition ease duration-150 hover:text-primary-500 flex items-center`}
                    >
                      <Icon
                        name={item.icon}
                        size={item.id === 'channels' ? 22 : 18}
                        dataTestId={`${item.id}-collapse`}
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
            className={`nav-item text-[15px] gap-[8px] transition ease duration-150 hover:text-primary-500 flex items-center px-4 py-2 border rounded-17xl`}
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
