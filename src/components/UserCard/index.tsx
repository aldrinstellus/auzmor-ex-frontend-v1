import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import IconWrapper from 'components/Icon/components/IconWrapper';
import Spinner from 'components/Spinner';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import useProduct from 'hooks/useProduct';
import { IGetUser, getUser } from 'queries/users';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import {
  getAvatarColor,
  getCoverImage,
  getFullName,
  getInitials,
  getProfileImage,
} from 'utils/misc';

export enum UsercardVariant {
  Small = 'SMALL',
  Large = 'LARGE',
}

export interface IUserCardProp {
  user?: IGetUser;
  variant?: UsercardVariant;
  className?: string;
}

let handleCopyRef = () => {};
let handleContactCopyRef = () => {};
let emailRef = '';
let contactRef = '';

const UserCard: FC<IUserCardProp> = ({
  user,
  variant = UsercardVariant.Small,
  className = '',
}) => {
  const { t } = useTranslation('profile');
  const { isLxp } = useProduct();
  switch (variant) {
    case UsercardVariant.Small: {
      const style = clsx({
        'flex items-start h-20': true,
        [className]: true,
      });
      return (
        <div className={style} data-testid="usercard">
          <div className="mr-4">
            <Avatar
              size={80}
              name={getFullName(user) || t('nameNotSpecified')}
              image={getProfileImage(user)}
              bgColor={getAvatarColor(user)}
              dataTestId="usercard-profilepic"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div
              className="text-base font-bold text-neutral-900 truncate"
              data-testid="usercard-name"
            >
              {getFullName(user) || t('fieldNotSpecified')}
            </div>
            <div
              className="text-sm font-normal text-neutral-500 truncate"
              data-testid="usercard-email"
            >
              {user?.workEmail || t('fieldNotSpecified')}
            </div>
            {isLxp ? (
              <div className="flex items-center">
                <Icon
                  name="briefcase"
                  size={16}
                  hover={false}
                  color="text-neutral-900"
                  className="mr-2"
                />
                <div
                  className="text-sm font-normal text-neutral-500 truncate"
                  data-testid="usercard-designation"
                >
                  {user?.designation?.name || t('noDesignation')}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <Icon
                  name="location"
                  size={16}
                  hover={false}
                  color="text-neutral-900"
                  className="mr-2"
                />
                <div className="flex items-center">
                  <div
                    className="text-xs font-normal text-neutral-500 truncate"
                    data-testid="usercard-location"
                  >
                    {user?.workLocation?.name || t('fieldNotSpecified')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    case UsercardVariant.Large: {
      handleCopyRef = () => {
        navigator.clipboard.writeText(emailRef);
        successToastConfig({
          content: 'Copied to clipboard',
          variant: 'bottom-center',
        });
      };
      handleContactCopyRef = () => {
        navigator.clipboard.writeText(contactRef);
        successToastConfig({
          content: 'Copied to clipboard',
          variant: 'bottom-center',
        });
      };
      const style = clsx({
        'flex flex-col shadow-xl rounded-9xl bg-white w-[272px] overflow-hidden relative':
          true,
        [className]: true,
      });
      setTimeout(() => {
        const ele = document.getElementById(`${user?.id}`);
        ele?.addEventListener('mouseenter', () => {
          const userPromise = getUser(user?.id || '');
          userPromise.then((response: any) => {
            let ele = document.getElementById(
              `user-card-${user?.id}-cover-image`,
            );
            if (ele && !!response?.data?.result.data?.coverImage?.original) {
              try {
                (ele as any).src =
                  response?.data?.result.data?.coverImage?.original;
              } catch (e) {}
            }
            ele = document.getElementById(`user-card-${user?.id}-email`);
            if (ele) {
              ele.innerHTML =
                response?.data?.result.data.workEmail || t('fieldNotSpecified');
              emailRef = response?.data?.result.data.workEmail;
            }
            ele = document.getElementById(`user-card-${user?.id}-workPhone`);
            if (ele) {
              ele.innerHTML =
                response?.data?.result.data.workPhone || t('fieldNotSpecified');
              contactRef = response?.data?.result.data.workPhone;
            }
            ele = document.getElementById(`user-card-${user?.id}-manager-name`);
            if (ele) {
              ele.innerHTML =
                response?.data?.result.data.manager.fullName ||
                t('fieldNotSpecified');
            }
            ele = document.getElementById(
              `user-card-${user?.id}-manager-designation`,
            );
            if (ele) {
              ele.innerHTML =
                response?.data?.result.data.manager.designation ||
                t('fieldNotSpecified');
            }
            ele = document.getElementById(
              `user-card-${user?.id}-manager-avatar`,
            );
            if (ele) {
              if (
                response?.data?.result?.data?.manager?.profileImage?.original
              ) {
                ele.innerHTML = `<img
                src="${response?.data?.result?.data?.manager?.profileImage?.original}"
                style="border-radius:100%;width:32px;height:32px;"
                data-testid="user-card-manager-avatar"
                alt="Manager Profile Picture"
              />`;
              } else if (response?.data?.result?.data?.manager?.fullName) {
                ele.innerHTML = `<div class="w-full h-full rounded-full bg-neutral-800 text-white font-medium flex justify-center items-center text-lg"><div>${getInitials(
                  response?.data?.result?.data?.manager?.fullName,
                )}</div></div>`;
              } else {
                ele.innerHTML = `<div class="w-full h-full rounded-full bg-neutral-800 text-white font-medium flex justify-center items-center text-lg"><div>U</div></div>`;
              }
            }
            const copyElement = document.getElementById(
              `user-card-${user?.id}-copy-icon`,
            );
            copyElement?.removeEventListener('click', handleCopyRef, true);
            copyElement?.addEventListener('click', handleCopyRef, true);
            const contactCopyElement = document.getElementById(
              `user-card-${user?.id}-contact-copy-icon`,
            );
            contactCopyElement?.removeEventListener(
              'click',
              handleContactCopyRef,
              true,
            );
            contactCopyElement?.addEventListener(
              'click',
              handleContactCopyRef,
              true,
            );
          });
        });

        const viewProfileElement = document.getElementById(
          `user-card-${user?.id}-view-profile-btn`,
        );
        viewProfileElement?.removeEventListener('click', () => {});
        viewProfileElement?.addEventListener('click', () => {
          window.location.href = `/users/${user?.id}`;
        });
      }, 0);
      return (
        <div className={style} data-testid="usercard">
          <img
            id={`user-card-${user?.id}-cover-image`}
            className="object-cover object-center w-full rounded-t-9xl h-[53px]"
            src={getCoverImage({})}
            alt={'User cover picture profile'}
            data-testid="user-cover-pic"
          />
          <div className="absolute top-[18px] left-[18px]">
            <Avatar
              size={60}
              name={getFullName(user) || 'U'}
              image={
                (user?.profileImage as any) !== ''
                  ? getProfileImage(user)
                  : undefined
              }
              bgColor={getAvatarColor(user)}
              dataTestId={`usercard-${user?.id}-profilepic`}
            />
          </div>
          <div className="px-4 pb-4 pt-4">
            <div
              className="text-lg font-bold text-neutral-900 truncate mt-4"
              data-testid={`usercard-${user?.id}-name`}
            >
              {getFullName(user) || t('fieldNotSpecified')}
            </div>
            <div
              className="text-sm font-normal text-neutral-500 truncate mb-2"
              data-testid={`usercard-${user?.id}-position`}
            >
              {user?.designation?.name || t('fieldNotSpecified')}
              {user?.department?.name ? `, ${user?.department?.name}` : ''}
            </div>
            <Divider className="mt-1 mb-2" />
            <div className="text-sm text-neutral-500 font-bold mb-2">
              Information
            </div>
            <div className="flex items-center mb-1 group/item1">
              <IconWrapper className="rounded-6xl p-[3px] mr-3 !cursor-default">
                <Icon
                  name="mail"
                  size={16}
                  hover={false}
                  color="!text-neutral-500"
                />
              </IconWrapper>
              <div className="flex w-full">
                <div
                  className="truncate w-full"
                  data-testid={`usercard-${user?.id}-email`}
                  id={`user-card-${user?.id}-email`}
                >
                  <Skeleton className="w-full" />
                </div>
                <div
                  id={`user-card-${user?.id}-copy-icon`}
                  className="ml-3 group-hover/item1:visible invisible"
                >
                  <Icon name="copy" size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center group/item2">
              <IconWrapper className="rounded-6xl p-[3px] mr-3 !cursor-default">
                <Icon
                  name="call"
                  size={16}
                  hover={false}
                  color="!text-neutral-500"
                />
              </IconWrapper>
              <div
                className="truncate w-full"
                data-testid={`usercard-${user?.id}-number`}
                id={`user-card-${user?.id}-workPhone`}
              >
                <Skeleton className="w-full" />
              </div>
              <div
                id={`user-card-${user?.id}-contact-copy-icon`}
                className="ml-3 group-hover/item2:visible invisible"
              >
                <Icon name="copy" size={16} />
              </div>
            </div>
            <div className="text-sm text-neutral-500 font-bold mb-1 mt-2">
              Manager
            </div>
            <div className="flex w-full">
              <div
                className="w-8 h-8"
                id={`user-card-${user?.id}-manager-avatar`}
              >
                <Spinner />
              </div>
              <div className="flex flex-col justify-between w-3/4">
                <div
                  className="text-sm font-bold text-neutral-900 pl-4 w-full"
                  data-testid="usercard-manager-name"
                  id={`user-card-${user?.id}-manager-name`}
                >
                  <Skeleton />
                </div>
                <div
                  className="text-xs font-normal text-neutral-500 w-full pl-4"
                  data-testid="usercard-manager-position"
                  id={`user-card-${user?.id}-manager-designation`}
                >
                  <Skeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    default:
      return <></>;
  }
};

export default UserCard;
