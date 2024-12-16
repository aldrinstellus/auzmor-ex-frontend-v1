import Icon from 'components/Icon';
import { Logo } from 'components/Logo';
import PopupMenu from 'components/PopupMenu';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import './style.css';
import { getLearnUrl } from 'utils/misc';
import LxpNotificationsOverview from 'components/LxpNotificationsOverview';
import AccountCard from './AccountCard';
import { clsx } from 'clsx';
import useAuth from 'hooks/useAuth';
import SubscriptionBanner from 'components/AppShell/components/SubscriptionBanner';
import IconButton from 'components/IconButton';
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

  if (pathname === '/user/apps') {
    backBtn.show = true;
    backBtn.linkTo = isLxpEnabled ? '/user/feed' : getLearnUrl('/user');
    backBtn.label = isLxpEnabled
      ? t('learn.backToFeed')
      : t('learn.backToHome');
    backBtn.for = t('learn.appLauncher');
  } else if (pathname === '/user/teams') {
    backBtn.show = true;
    backBtn.linkTo = '/user/feed';
    backBtn.label = t('learn.backToFeed');
    backBtn.for = t('learn.myTeams');
  } else if (pathname.startsWith('/user/teams')) {
    backBtn.show = true;
    backBtn.linkTo = '/user/teams';
    backBtn.label = t('learn.backToMyTeams');
  }

  const navbarMenu = [
    {
      id: 'home',
      label: t('learn.home'),
      to: getLearnUrl('/user'),
      icon: 'home',
      show: true,
      options: [],
      isActive: false,
    },
    {
      id: 'engagement',
      label: t('learn.engagement'),
      to: '',
      show: true,
      icon: 'exploreFilled',
      options: [
        {
          id: 'feed',
          label: t('learn.feed'),
          onClick: () => navigate('/user/feed'),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: `!text-sm !leading-4 !text-neutral-500 !font-normal group-hover:!text-black leading-4 ${
            pathname.startsWith('/user/feed') &&
            '!font-semibold !text-primary-500'
          }`,
        },
        {
          id: 'channels',
          label: t('learn.channels'),
          onClick: () => navigate('/user/channels'),
          show: true,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName: `!text-sm !leading-4 !text-neutral-500 !font-normal group-hover:!text-black leading-4 ${
            pathname.startsWith('/user/channels') &&
            '!font-semibold !text-primary-500'
          }`,
        },
        {
          id: 'forums',
          label: t('learn.forums'),
          onClick: () =>
            window.location.assign(`${getLearnUrl('/user/forums')}`),
          show: !!user?.organization?.setting?.enableSocialLearning,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-sm !leading-4 !text-neutral-500 !font-normal group-hover:!text-black leading-4',
        },
      ].filter((option) => option.show),
      isActive: true,
    },
    {
      id: 'trainings',
      label: t('learn.trainings'),
      to: getLearnUrl('/user/trainings'),
      show: true,
      icon: 'training',
      options: [],
      isActive: false,
    },
    {
      id: 'development',
      label: t('learn.development'),
      to: '',
      show: true,
      icon: 'learningCenter',
      options: [
        {
          id: 'mentorship',
          label: t('learn.mentorship'),
          onClick: () =>
            window.location.assign(
              `${getLearnUrl('/user/mentorship/overview')}`,
            ),
          show: !!user?.organization?.setting?.enableMentorship,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-sm !leading-4 !text-neutral-500 !font-normal group-hover:!text-black leading-4',
        },
        {
          id: 'tasks',
          label: t('learn.tasks'),
          onClick: () =>
            window.location.assign(`${getLearnUrl('/user/tasks')}`),
          show: !!user?.organization?.setting?.enablechecklist,
          className: '!py-[11px] !px-3 hover:!bg-neutral-100',
          labelClassName:
            '!text-sm !leading-4 !text-neutral-500 !font-normal group-hover:!text-black leading-4',
        },
      ].filter((option) => option.show),
    },
  ].filter((navItem) => navItem.to || navItem.options.length > 0);

  const getNavItemStyle = (id: string) => {
    switch (id) {
      case 'home':
      case 'engagement':
      case 'trainings':
      case 'development':
        return clsx({
          'modern-nav-item flex gap-2 items-center text-sm text-neutral-500 px-[13px] py-[9px] transition ease duration-150 group-hover/item:bg-neutral-100 hover:bg-neutral-100 font-medium rounded-xl cursor-pointer group':
            true,
          'text-primary-500': id === 'engagement',
        });
      case 'backBtn':
        return clsx({
          'my-[5px] nav-item text-base gap-[8px] transition ease duration-150 flex items-center px-4 py-2 border rounded-17xl group':
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
    <div className="font-manrope flex flex-col justify-center bg-white sticky w-full top-0 z-50">
      <div className="h-[78px] flex items-center justify-center bg-white px-14">
        <div className="w-full max-w-[1280px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo
              onClick={() => navigate('/user/feed')}
              className="cursor-pointer min-h-[40px] max-h-[40px] max-w-full align-middle relative border-none"
            />
            {backBtn.show && (
              <div className="text-neutral-900 text-base font-bold">
                {backBtn.for}
              </div>
            )}
          </div>
          {!backBtn.show && (
            <div className="flex items-center gap-6 h-full">
              <div className="flex items-center gap-2.5">
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
                                className={
                                  item?.isActive
                                    ? 'text-primary-500 group-hover/item:!text-primary-500'
                                    : 'group-hover/item:!text-neutral-500'
                                }
                              />
                              {item.label}
                              <Icon
                                name="arrowDown3"
                                size={10}
                                dataTestId={`${item.id}-collapse`}
                                className={`${
                                  item?.isActive
                                    ? 'text-primary-500 group-hover/item:!text-primary-500'
                                    : 'group-hover/item:!text-neutral-500'
                                } navbar-arrow-icon group-hover/item:navbar-arrow-icon-hover`}
                              />
                            </div>
                          }
                          menuItems={item.options}
                          className={`dropdown-menu-option group-hover/item:visible invisible h-[39px] !transition-[height] !duration-300 w-full left-1/2 -translate-x-1/2 ${getOptionHeight(
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
              <div className="w-[1px] h-5 bg-[#e5e5e5]"></div>
              <ul className="flex items-center gap-[10px]">
                <li>
                  <div title={t('learn.helpAndSupportTitle')}>
                    <IconButton
                      icon="messageQuestionOutline"
                      color="text-[#888888]"
                      size={22}
                      onClick={() => {
                        window.open(`${getLearnUrl()}?openHelpSupport=true`);
                      }}
                      ariaLabel={t('learn.helpAndSupportTitle')}
                      className="bg-white hover:!bg-neutral-100 rounded-md active:bg-white py-[9px] px-[13px]"
                      iconClassName="group-hover:!text-neutral-500"
                    />
                  </div>
                </li>
                {!!user?.organization?.setting?.enableEcommerce && (
                  <li>
                    <Cart />
                  </li>
                )}
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

export default Navbar;
