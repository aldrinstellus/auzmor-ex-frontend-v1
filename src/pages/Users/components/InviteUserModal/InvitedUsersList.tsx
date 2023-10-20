import { IPostUsersResponse } from 'queries/users';
import { FC } from 'react';

export interface IInvitedUsersListProps {
  invitedUsersResponse: IPostUsersResponse[];
}

const InvitedUsersList: FC<IInvitedUsersListProps> = ({
  invitedUsersResponse,
}) => {
  return (
    <div className="p-6">
      <div className="flex w-full mb-4">
        <div className="w-1/4 truncate text-sm font-bold mr-2">Full name</div>
        <div className="w-1/4 truncate text-sm font-bold mr-2">
          Email address
        </div>
        <div className="w-1/4 truncate text-sm font-bold mr-2">Role</div>
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
