import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import Popover from 'components/Popover';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Icon from 'components/Icon';
import {
  deleteCookie,
  getCookieParam,
  getLearnUrl,
  userChannel,
} from 'utils/misc';
import useRole from 'hooks/useRole';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { UserRole } from 'interfaces';
import Divider from 'components/Divider';

const AccountCard = () => {
  const { user, reset } = useAuth();
  const { isLearner: isLearnerView } = useRole();
  const { t } = useTranslation('navbar', { keyPrefix: 'learn' });
  const { t: tp } = useTranslation('profile');
  const { getApi } = usePermissions();

  const isAdmin =
    user?.role && [UserRole.Admin, UserRole.PrimaryAdmin].includes(user?.role);
  const isManager = user?.role === UserRole.Manager;

  const logoutMutation = useMutation(getApi(ApiEnum.Logout), {
    onSuccess: async () => {
      userChannel.postMessage({
        userId: user?.id,
        payload: {
          type: 'SIGN_OUT',
        },
      });

      deleteCookie(getCookieParam('region_url'));
      deleteCookie(getCookieParam());
      window.location.replace(`${getLearnUrl()}`);

      reset();
    },
  });

  const menuItemStyle = clsx({
    'pl-5 pr-[10px] py-0 text-sm leading-9 tracking-[0.3px] font-normal text-neutral-900 hover:bg-neutral-50 cursor-pointer':
      true,
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
        <div className="rounded-9xl flex flex-col items-center w-[300px] shadow overflow-hidden">
          <div className="w-full px-5 py-5 pb-0 flex gap-[14px] items-center">
            <Avatar
              size={50}
              name={user?.name || tp('nameNotSpecified')}
              image={user?.profileImage}
              // showActiveIndicator
            />
            <div className="h-[50px] flex flex-col justify-between">
              <div
                className="text-lg leading-tight tracking-[0.3px] font-semibold"
                data-testid="user-menu-user-name"
              >
                {user?.name}
              </div>
              <div
                className="text-neutral-500 text-sm leading-tight tracking-[0.3px] font-normal"
                data-testid="user-menu-user-email"
              >
                {user?.email}
              </div>
            </div>
          </div>
          <div className="w-full mt-[14px]">
            <Link
              to={`${getLearnUrl()}${isLearnerView ? '/user' : ''}/settings`}
            >
              <div
                className={`flex ${menuItemStyle}`}
                data-testid="user-menu-user-settings"
                onClick={close}
              >
                <div>{t('settings')}</div>
              </div>
            </Link>
            {isLearnerView && (
              <Link to={`${getLearnUrl()}/user/settings/certificates`}>
                <div
                  className={`flex ${menuItemStyle}`}
                  data-testid="user-menu-my-certificates"
                  onClick={close}
                >
                  <div>{t('myCertificates')}</div>
                </div>
              </Link>
            )}
            {isLearnerView && (
              <Link to={`${getLearnUrl()}/user/settings/activity`}>
                <div
                  className={`flex ${menuItemStyle}`}
                  data-testid="user-menu-user-settings"
                  onClick={close}
                >
                  <div>{t('myActivity')}</div>
                </div>
              </Link>
            )}
            {isManager || isAdmin ? (
              <Link
                to={isLearnerView ? getLearnUrl() : `${getLearnUrl()}/user`}
              >
                <div
                  className={`flex ${menuItemStyle} `}
                  data-testid="user-menu-switchview"
                  onClick={close}
                >
                  <div>
                    {isLearnerView && isManager
                      ? t('switchToMangersView')
                      : null}
                    {isLearnerView && isAdmin ? t('switchToAdminsView') : null}
                    {!isLearnerView ? t('switchToLearnersView') : null}
                  </div>
                </div>
              </Link>
            ) : null}
            <Divider className="my-[6px]" />
            {isLearnerView && (
              <div
                className={`flex ${menuItemStyle}`}
                data-testid="user-menu-switch-theme"
              >
                <div>{t('switchTheme')}</div>
              </div>
            )}
            <div
              className={`flex ${menuItemStyle}`}
              onClick={() => {
                logoutMutation.mutate();
                close();
              }}
              data-testid="user-menu-signout-cta"
            >
              <div>{t('signOut')}</div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default AccountCard;
