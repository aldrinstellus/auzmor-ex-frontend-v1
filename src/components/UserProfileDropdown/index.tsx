import { FC, ReactNode } from 'react';
import useAuth from 'hooks/useAuth';
import PopupMenu from 'components/PopupMenu';
import { UserRole, UserStatus } from 'queries/users';
import useRole from 'hooks/useRole';
import Button, { Variant, Size } from 'components/Button';
import useProduct from 'hooks/useProduct';

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
  showDirectOption?: boolean;
  isChannelPeople?: boolean;
  userId?: string;
  isUserAdminOrChannelAdmin?: boolean;
  onRemoveChannelMember?: any;
}

const UserProfileDropdown: FC<IUserDropdownProps> = ({
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
  isChannelPeople,
  showDirectOption = false,
  userId,
  isUserAdminOrChannelAdmin,
  onRemoveChannelMember,
}) => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const _options = [];
  const { isLxp } = useProduct();
  if (
    isChannelPeople &&
    isUserAdminOrChannelAdmin &&
    role == UserRole.Member &&
    user?.id != userId
  ) {
    _options.push({
      icon: 'promoteUser',
      label: `Promote to admin`,
      dataTestId: 'user-promoteToAdmin',
      onClick: onPromoteClick,
    });
  }
  if (isChannelPeople && isUserAdminOrChannelAdmin && user?.id != userId) {
    _options.push({
      icon: 'deactivateUser',
      label: <div className="text-red-500">Remove from channel</div>,
      dataTestId: 'people-card-ellipsis-remove-member',
      onClick: onRemoveChannelMember,
      iconClassName: '!text-red-500',
    });
  }

  if (isTeamPeople) {
    if (isAdmin && !isLxp) {
      _options.push({
        icon: 'forbidden',
        label: <div className="text-red-500">Remove</div>,
        dataTestId: 'people-card-ellipsis-remove-member',
        onClick: onRemoveTeamMember,
        iconClassName: '!text-red-500',
      });
    }
  } else {
    if ((id === user?.id || isAdmin) && !isLxp) {
      _options.push({
        icon: 'edit',
        label: `Edit`,
        dataTestId: 'user-edit',
        onClick: onEditClick,
      });
    }

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

    if (isAdmin && id !== user?.id && !isLxp) {
      _options.push({
        icon: 'forbidden',
        label: <div className="text-red-500">Remove account</div>,
        dataTestId: 'people-card-ellipsis-remove-user',
        onClick: onDeleteClick,
        iconClassName: '!text-red-500',
      });
    }
  }

  if (showDirectOption && _options.length === 1) {
    const option = _options[0];
    return (
      <Button
        label={option?.label}
        onClick={option?.onClick}
        variant={Variant.Secondary}
        size={Size.Small}
        leftIcon={option?.icon}
        leftIconSize={16}
        dataTestId="profile-more-cta"
      />
    );
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
