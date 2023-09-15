import React, { ReactNode } from 'react';
import _ from 'lodash';
import useAuth from 'hooks/useAuth';
import PopupMenu from 'components/PopupMenu';
import { UserRole, UserStatus } from 'queries/users';
import useRole from 'hooks/useRole';

export interface IUserDropdownProps {
  id: string;
  role: string;
  status: string | undefined;
  isHovered?: boolean;
  parentIsUserProfile?: boolean;
  onEditClick?: any;
  onPromoteClick?: any;
  onDeactivateClick?: any;
  onReactivateClick?: any;
  onDeleteClick?: any;
  onResendInviteClick?: any;
  onRemoveTeamMember?: any;
  triggerNode: ReactNode;
  showOnHover: boolean;
  className: string;
  loggedInUserId?: string;
  isTeamPeople?: boolean;
}

const UserProfileDropdown: React.FC<IUserDropdownProps> = ({
  id,
  role,
  status,
  isHovered,
  onEditClick,
  onPromoteClick,
  onDeactivateClick,
  onReactivateClick,
  onResendInviteClick,
  onRemoveTeamMember,
  onDeleteClick,
  triggerNode,
  showOnHover,
  isTeamPeople,
  className,
}) => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const _options = [];

  if (isTeamPeople && isAdmin) {
    _options.push({
      icon: 'forbidden',
      label: <div className="text-red-500">Remove</div>,
      dataTestId: 'people-card-ellipsis-remove-member',
      onClick: onRemoveTeamMember,
      iconClassName: '!text-red-500',
    });
  } else {
    if (
      isAdmin &&
      [UserStatus.Invited, UserStatus.Created].includes(status as any)
    ) {
      _options.push({
        icon: 'redo',
        label: 'Resend Invite',
        dataTestId: 'people-card-ellipsis-resend-invite',
        onClick: onResendInviteClick,
      });
    }

    if (id === user?.id) {
      _options.push({
        icon: 'edit',
        label: `Edit`,
        dataTestId: 'user-edit',
        onClick: onEditClick,
      });
    }

    if (isAdmin && role === UserRole.Member && status === UserStatus.Active) {
      _options.push({
        icon: 'promoteUser',
        label: `Promote to admin`,
        dataTestId: 'user-promoteToAdmin',
        onClick: onPromoteClick,
      });
    }

    if (
      [UserStatus.Inactive, UserStatus.Active].includes(status as any) &&
      role !== UserRole.Superadmin &&
      id !== user?.id &&
      isAdmin
    ) {
      _options.push({
        icon:
          (status as any) === UserStatus.Inactive
            ? 'reactivateUser'
            : 'deactivateUser',
        label: `${
          (status as any) === UserStatus.Inactive ? 'Reactivate' : 'Deactivate'
        } user`,
        dataTestId:
          (status as any) === UserStatus.Inactive
            ? 'user-deactivate'
            : 'user-reactivate',
        onClick:
          (status as any) === UserStatus.Inactive
            ? onReactivateClick
            : onDeactivateClick,
      });
    }

    if (isAdmin && id !== user?.id) {
      _options.push({
        icon: 'forbidden',
        label: <div className="text-red-500">Remove account</div>,
        dataTestId: 'people-card-ellipsis-remove-user',
        onClick: onDeleteClick,
        iconClassName: '!text-red-500',
      });
    }
  }

  if (((showOnHover && isHovered) || !showOnHover) && _options.length > 0) {
    return (
      <PopupMenu
        triggerNode={triggerNode}
        menuItems={_options}
        className={className}
      />
    );
  }
  return null;
};

export default UserProfileDropdown;
