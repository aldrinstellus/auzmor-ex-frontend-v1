import clsx from 'clsx';
import AccountCard from './AccountCard';
import Icon from 'components/Icon';
import { Logo } from 'components/Logo';
import LxpNotificationsOverview from 'components/LxpNotificationsOverview';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { getLearnUrl } from 'utils/misc';
import useAuth from 'hooks/useAuth';
import SubscriptionBanner from 'components/AppShell/components/SubscriptionBanner';
import IconButton from 'components/IconButton';
import './style.css';
import useNavigate from 'hooks/useNavigation';
import Cart from './Cart';

interface INavbarLxpProps {}

const Navbar: FC<INavbarLxpProps> = ({}) => {
  const { t } = useTranslation('navbar');
  const { pathname } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

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
    'w-full max-w-[1280px] flex items-center': true,
    'justify-between': backBtn.show,
  });

  return (
    <div className="flex flex-col justify-center bg-white sticky w-full top-0 z-50">
      <div className="h-[78px] flex items-center justify-center bg-white px-14">
        <div className={optionWrapperStyle}>
          <div className="flex items-center gap-2">
            <Logo
              className="cursor-pointer min-h-[40px] max-h-[40px]"
              onClick={() => navigate('/feed')}
            />
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
              <ul className="flex items-center gap-[19px]">
                <div className="w-[1px] h-5 bg-[#e5e5e5]"></div>
                {!!user?.organization?.setting?.enableEcommerce && (
                  <li>
                    <Cart />
                  </li>
                )}
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
      {showSubscriptionBanner && (
        <SubscriptionBanner
          closeBanner={() => setShowSubscriptionBanner(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
