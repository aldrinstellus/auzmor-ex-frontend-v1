import { IPostUsersResponse } from 'interfaces';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface IInvitedUsersListProps {
  invitedUsersResponse: IPostUsersResponse[];
}

const InvitedUsersList: FC<IInvitedUsersListProps> = ({
  invitedUsersResponse,
}) => {
  const { t } = useTranslation('profile', {
    keyPrefix: 'inviteUserModal.invitedUsersList',
  });

  return (
    <div className="p-6">
      <div className="flex w-full mb-4">
        <div className="w-1/4 truncate text-sm font-bold mr-2">
          {t('fullName')}
        </div>
        <div className="w-1/4 truncate text-sm font-bold mr-2">
          {t('emailAddress')}
        </div>
        <div className="w-1/4 truncate text-sm font-bold mr-2">{t('role')}</div>
        <div className="w-1/4 truncate"></div>
      </div>
      {invitedUsersResponse.map((user, index) => (
        <div
          className={`flex w-full py-3 border-neutral-200 ${
            invitedUsersResponse.length - 1 !== index && 'border-b'
          }`}
          key={index}
        >
          <div className="w-1/4 truncate text-sm mr-2">{user.fullName}</div>
          <div className="w-1/4 truncate text-sm mr-2">{user.workEmail}</div>
          <div className="w-1/4 truncate text-sm mr-2">{user.role}</div>
          <div className="w-1/4 truncate text-sm text-red-500 font-bold">
            {user.reason}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvitedUsersList;
