import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import Popover from 'components/Popover';
import Button, { Size, Variant } from 'components/Button';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { logout } from 'queries/account';
import { Link, useNavigate } from 'react-router-dom';
import Icon from 'components/Icon';
import {
  deleteCookie,
  getCookieParam,
  getLearnUrl,
  userChannel,
} from 'utils/misc';
import useRole from 'hooks/useRole';
import { useTranslation } from 'react-i18next';
import useProduct from 'hooks/useProduct';
import { learnLogout } from 'queries/learn';

const AccountCard = () => {
  const navigate = useNavigate();
  const { user, reset } = useAuth();
  const { isAdmin } = useRole();
  const { t } = useTranslation('navbar');
  const { t: tp } = useTranslation('profile');
  const { isLxp, isOffice } = useProduct();

  const logoutMutation = useMutation(isLxp ? learnLogout : logout, {
    onSuccess: async () => {
      userChannel.postMessage({
        userId: user?.id,
        payload: {
          type: 'SIGN_OUT',
        },
      });
      if (isLxp) {
        deleteCookie(getCookieParam('region_url'));
        deleteCookie(getCookieParam());
        window.location.replace(`${getLearnUrl()}`);
      }
      if (isOffice) {
        navigate('/logout');
      }
      reset();
    },
  });

  const menuItemStyle = clsx({
    'px-4 py-3 border-t text-sm hover:bg-primary-50 cursor-pointer': true,
  });

  return (
    <Popover
      triggerNode={
        <div className="flex gap-1 items-center">
          <Avatar
            dataTestId="my-profile-avatar"
            name={user?.name || tp('nameNotSpecified')}
            size={32}
            image={user?.profileImage}
            ariaLabel="profile image"
          />
          <Icon
            name="arrowDownOutline"
            size={16}
            ariaLabel="Account dropdown"
          />
        </div>
      }
      className="-right-2 top-[52px] rounded-9xl"
      contentRenderer={(close) => (
        <div className="rounded-9xl flex flex-col items-center w-64 shadow overflow-hidden">
          <div className="px-4 py-5 flex flex-col items-center">
            <Avatar
              size={80}
              name={user?.name || tp('nameNotSpecified')}
              image={user?.profileImage}
              // showActiveIndicator
            />
            <div
              className="text-sm font-bold mt-4"
              data-testid="user-menu-user-name"
            >
              {user?.name}
            </div>
            <div
              className="text-neutral-500 text-xs"
              data-testid="user-menu-user-email"
            >
              {user?.email}
            </div>
          </div>
          {isOffice && (
            <div className="px-4 pb-4 w-full">
              <Button
                dataTestId="user-menu-profile"
                variant={Variant.Secondary}
                label={t('account.goToProfile')}
                onClick={() => {
                  navigate('/profile', { state: { userId: user?.id } });
                  close();
                }}
                size={Size.Small}
                className="w-full"
              />
            </div>
          )}
          <div className="w-full">
            <Link to={isLxp ? `${getLearnUrl()}/user/settings` : '/settings'}>
              <div
                className={`flex ${menuItemStyle} text-neutral-900 text-sm hover:text-primary-500 hover:font-bold group`}
                data-testid="user-menu-user-settings"
                onClick={close}
              >
                <Icon
                  name="settingOutline"
                  size={20}
                  className="mr-2.5"
                  color="text-neutral-900"
                />
                <div>{t('userSetting')}</div>
              </div>
            </Link>
            {isOffice && isAdmin && (
              <Link to="/admin">
                <div
                  className={`flex ${menuItemStyle} text-neutral-900 text-sm hover:text-primary-500 hover:font-bold group`}
                  data-testid="user-menu-admin-settings"
                  onClick={close}
                >
                  <Icon
                    name="settingThreeOutline"
                    size={20}
                    className="mr-2.5"
                    color="text-neutral-900"
                  />
                  <div>{t('adminSetting')}</div>
                </div>
              </Link>
            )}
            {isLxp && isAdmin && (
              <Link to={getLearnUrl()}>
                <div
                  className={`flex ${menuItemStyle} text-neutral-900 text-sm hover:text-primary-500 hover:font-bold group`}
                  data-testid="user-menu-adminview"
                  onClick={close}
                >
                  <Icon
                    name="userAdmin"
                    size={20}
                    className="mr-2.5"
                    color="text-neutral-900"
                  />
                  <div>{t('switchToAdminsView')}</div>
                </div>
              </Link>
            )}
            <Link to="/bookmarks">
              <div
                className={`flex ${menuItemStyle} text-neutral-900 text-sm hover:text-primary-500 hover:font-bold group`}
                data-testid="user-menu-mybookmarks"
                onClick={close}
              >
                <Icon
                  name="postBookmark"
                  size={20}
                  className="mr-2.5"
                  color="text-neutral-900"
                />
                <div>{t('myBookmarks')}</div>
              </div>
            </Link>
            <div
              className={`flex ${menuItemStyle} text-neutral-900 text-sm hover:text-primary-500 hover:font-bold group`}
              onClick={() => {
                logoutMutation.mutate();
                close();
              }}
              data-testid="user-menu-signout-cta"
            >
              <Icon
                name="logoutOutline"
                size={20}
                className="mr-2.5"
                color="text-neutral-900"
              />
              <div>{t('signOut')}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default AccountCard;
