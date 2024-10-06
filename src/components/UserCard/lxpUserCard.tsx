import clsx from 'clsx';
import Spinner from 'components/Spinner';
import Skeleton from 'react-loading-skeleton';
import Icon from 'components/Icon';
import { getInitials } from 'utils/misc';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

const LxpUserCard = ({ userId, className }: any) => {
  const style = clsx('flex items-start h-20', className);
  const { getApi } = usePermissions();
  const { t } = useTranslation('profile');

  const getUser = getApi(ApiEnum.GetUserApi);
  const { data, isLoading } = useQuery(
    ['user', userId],
    () => getUser(userId),
    {
      enabled: !!userId,
    },
  );

  const userData = data?.data?.result?.data;

  const renderUserAvatar = () => {
    if (isLoading) return <Spinner />;
    if (userData?.profileImage?.original) {
      return (
        <img
          src={userData.profileImage.original}
          className="object-cover h-full w-full rounded-full"
          alt={userData.fullName}
          loading="lazy"
        />
      );
    }
    if (userData?.fullName) {
      return (
        <span
          className="text-white font-medium flex items-center"
          style={{ fontSize: '30px' }}
        >
          {getInitials(userData.fullName)}
        </span>
      );
    }
    return (
      <span
        className="text-white font-medium flex items-center"
        style={{ fontSize: '30px' }}
      >
        {t('nameNotSpecified')}
      </span>
    );
  };

  return (
    <div className={style} data-testid="usercard">
      <div
        className="w-16 h-16 mr-2 relative flex justify-center items-center rounded-full bg-gray-800 cursor-pointer"
        id={`user-card-${userId}-Lxp-user-avatar`}
      >
        {renderUserAvatar()}
      </div>
      <div className="flex flex-col justify-between h-full">
        <div
          className="text-base font-bold text-neutral-900 truncate"
          data-testid="usercard-name"
          id={`user-card-${userId}-Lxp-full-name`}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            userData?.fullName || t('fieldNotSpecified')
          )}
        </div>
        <div
          className="text-sm font-normal text-neutral-500 truncate"
          data-testid="usercard-email"
          id={`user-card-${userId}-Lxp-user-email`}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            userData?.primaryEmail || t('fieldNotSpecified')
          )}
        </div>
        <div className="flex items-center">
          <Icon
            name="briefcase"
            size={16}
            hover={false}
            color="text-neutral-900"
            className="mr-2"
          />
          <div
            className="text-xs font-normal text-neutral-500 w-full "
            data-testid="usercard-Lxp-designation"
            id={`user-card-${userId}-Lxp-designation`}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              userData?.designation?.name || t('fieldNotSpecified')
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LxpUserCard;
