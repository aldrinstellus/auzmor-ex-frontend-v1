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
import AccountCard from './AccountCard';

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
      options: [
        {
          id: 'feed',
          label: t('learn.feed'),
          onClick: () => navigate('/feed'),
          show: true,
        },
        {
          id: 'channels',
          label: t('learn.channels'),
          onClick: () => navigate('/channels'),
          show: true,
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
        },
        {
          id: 'paths',
          label: t('learn.paths'),
          onClick: () => window.location.replace(`${getLearnUrl('/paths')}`),
          show: true,
        },
        {
          id: 'events',
          label: t('learn.events'),
          onClick: () => window.location.replace(`${getLearnUrl('/events')}`),
          show: true,
        },
        {
          id: 'external',
          label: t('learn.external'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/external-trainings')}`),
          show: true,
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
          show: true,
        },
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/mentorship')}`),
          show: true,
        },
        {
          id: 'forums',
          label: t('learn.forums'),
          onClick: () => window.location.replace(`${getLearnUrl('/forums')}`),
          show: true,
        },
      ],
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
        },
        {
          id: 'teams',
          label: t('learn.teams'),
          onClick: () =>
            window.location.replace(`${getLearnUrl('/peoples?tab=teams')}`),
          show: true,
        },
        {
          id: 'branches',
          label: t('learn.branches'),
          onClick: () => window.location.replace(`${getLearnUrl('/branches')}`),
          show: true,
        },
      ],
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
        },
        {
          id: 'reports',
          label: t('learn.reports'),
          onClick: () => window.location.replace(`${getLearnUrl('/reports')}`),
          show: true,
        },
      ],
    },
    {
      id: 'ecommerce',
      label: t('learn.ecommerce'),
      to: '',
      show: true,
      options: [
        {
          id: 'orders',
          label: t('learn.orders'),
          onClick: () => window.location.replace(`${getLearnUrl('/orders')}`),
          show: true,
        },
        {
          id: 'coupons',
          label: t('learn.coupons'),
          onClick: () => window.location.replace(`${getLearnUrl('/coupons')}`),
          show: true,
        },
      ],
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
                .map((item) =>
                  item.options.length > 0 ? (
                    <div className="relative" key={item.id}>
                      <PopupMenu
                        triggerNode={
                          <div
                            tabIndex={0}
                            className="px-[10px] py-[4px] cursor-pointer flex items-center transition ease duration-150 hover:text-primary-500 multi-navitem"
                          >
                            <span className="text-[15px]">{item.label}</span>
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
                      className="text-[15px] px-[10px] py-[4px] transition ease duration-150 hover:text-primary-500"
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
            className={`nav-item text-[15px] gap-[8px] transition ease duration-150 hover:text-primary-500 flex items-center px-4 py-2 border rounded-17xl`}
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
