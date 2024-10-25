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
  isSafariBrowser,
  userChannel,
} from 'utils/misc';
import useRole from 'hooks/useRole';
import { useTranslation } from 'react-i18next';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { UserRole } from 'interfaces';
import Divider from 'components/Divider';
import { SwitchView } from './SwitchView';
import { useState } from 'react';
import useModal from 'hooks/useModal';
import LearnLogo from 'images/LearnLogo.svg';
import ConfirmationModal from './ConfirmationModal';
import Truncate from 'components/Truncate';

const AccountCard = () => {
  const { user, reset } = useAuth();

  const { isLearner: isLearnerView } = useRole();
  const { t } = useTranslation('navbar', { keyPrefix: 'learn' });
  const { t: tp } = useTranslation('profile');
  const { getApi } = usePermissions();

  const useGetBranches = getApi(ApiEnum.GetOrganizationBranch);
  const { data } = useGetBranches(user?.organization?.id || '');
  const [confirm, showConfirm, closeConfirm] = useModal();
  const totalBranches = data?.result?.totalRecords;

  const [selectedBranch, setSelectedBranch] = useState('');

  const redirectToDomain = async (org: any) => {
    const { url } = org;
    const isSafari = isSafariBrowser();
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const windowRef = isSafari ? window.open() : null;
    if (fullUrl) {
      if (isSafari && windowRef) {
        windowRef.location.href = fullUrl;
      } else {
        window.open(fullUrl, '_blank');
      }
    } else if (windowRef) {
      windowRef.close();
    }

    closeConfirmation();
  };
  const branchData = data?.result?.data;
  const branches = [
    {
      ...user?.organization,
      isSignedIn: true,
      subdomain: user?.organization?.name,
    },
    ...(branchData || []),
  ];

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
  const closeConfirmation = () => {
    closeConfirm();
    setSelectedBranch('');
  };

  return (
    <Popover
      triggerNodeRenderer={(isOpen) => (
        <div
          tabIndex={0}
          className="flex items-center px-[7px] py-2 transition ease duration-150 group-hover:bg-neutral-100 hover:bg-neutral-100 rounded-xl cursor-pointer group"
        >
          <Avatar
            dataTestId="my-profile-avatar"
            name={user?.name || tp('nameNotSpecified')}
            size={26}
            image={user?.profileImage}
            ariaLabel={user?.name || 'profile image'}
          />
          <Icon
            name="arrowDown2"
            size={20}
            dataTestId={`$my-profile-avatar-collapse`}
            className={`group-hover:!text-neutral-500 ${
              isOpen ? 'navbar-arrow-icon-hover' : 'navbar-arrow-icon'
            }`}
          />
          {confirm && (
            <ConfirmationModal
              open={confirm}
              closeModal={closeConfirm}
              onClick={() => {
                redirectToDomain(selectedBranch);
              }}
            />
          )}
        </div>
      )}
      className="-right-2 top-[52px] rounded-9xl shadow-sm shadow-[#22242626] border border-neutral-200 border-solid"
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
            {totalBranches > 0 && (
              <div
                className={`flex flex-col pl-5 pr-[10px] py-0 text-sm leading-9 tracking-[0.3px] font-normal text-neutral-900`}
                data-testid="user-menu-user-settings"
                onClick={close}
              >
                <div className="!text-base tracking-wider !font-normal !text-gray-600 opacity-100 no-underline font-lato">
                  {t('switchBranch')}
                </div>

                {branches?.map((branch: any) => {
                  const { subdomain, accountStatus } = branch;
                  const active = user?.organization?.name === subdomain;
                  const isPending = accountStatus === 'PENDING';
                  return (
                    <div
                      className="flex flex-col my-1 cursor-pointer hover:bg-neutral-50"
                      key={branch.id}
                      onClick={() => {
                        if (isPending) {
                          setSelectedBranch(branch);
                          showConfirm();
                        } else {
                          redirectToDomain(branch);
                        }
                      }}
                    >
                      <div className="flex gap-x-2 items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            active
                              ? 'border-2 border-green-500'
                              : 'border-2 border-transparent'
                          }`}
                        >
                          <img
                            src={branch.logo || LearnLogo}
                            className="w-full min-h-4 max-h-4"
                          />
                        </div>

                        <div className="flex flex-col">
                          <Truncate
                            className={`font-semibold  text-[14px] leading-[30px] flex items-center gap-2 ${
                              active ? 'text-black' : 'text-gray-500'
                            }`}
                            text={branch.name}
                          />

                          {isPending && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Icon name="exclamation" size={12} />
                              <span>{t('Pending')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {totalBranches > 2 && (
                  <div
                    className="flex text-lg tracking-wide font-semibold text-primary-500 opacity-100 no-underline justify-center cursor-pointer"
                    onClick={() => {
                      window.location.replace(
                        `${getLearnUrl('/select-branch')}`,
                      );
                    }}
                  >
                    {t('viewAll')}
                  </div>
                )}
              </div>
            )}
            <Divider className="my-[6px]" />
            <div
              className={`flex ${menuItemStyle} justify-between`}
              data-testid="user-menu-switch-theme"
            >
              <div>{t('switchTheme')}</div>
              <SwitchView viewType={user?.preferences?.learnerViewType} />
            </div>
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
      triggerNodeClassName="outline-none"
    />
  );
};

export default AccountCard;
