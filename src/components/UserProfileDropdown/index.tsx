import { FC, ReactNode } from 'react';
import PopupMenu from 'components/PopupMenu';
import Button, { Variant, Size } from 'components/Button';
import { useTranslation } from 'react-i18next';
import { PeopleCardPermissionEnum } from 'pages/Users/components/People/PeopleCard';

export interface IUserDropdownProps {
  isHovered?: boolean;
  parentIsUserProfile?: boolean;
  triggerNode: ReactNode;
  showOnHover: boolean;
  className: string;
  loggedInUserId?: string;
  showDirectOption?: boolean;
  permissions: PeopleCardPermissionEnum[];
  onEditClick?: any;
  onPromoteClick?: any;
  onDeactivateClick?: any;
  onReactivateClick?: any;
  onDeleteClick?: any;
  onResendInviteClick?: any;
  onRemoveTeamMember?: any;
  onRemoveChannelMember?: any;
}

const UserProfileDropdown: FC<IUserDropdownProps> = ({
  isHovered,
  onDeleteClick,
  triggerNode,
  showOnHover,
  className,
  showDirectOption = false,
  permissions,
  onEditClick,
  onPromoteClick,
  onDeactivateClick,
  onReactivateClick,
  onResendInviteClick,
  onRemoveTeamMember,
  onRemoveChannelMember,
}) => {
  const { t } = useTranslation('components', {
    keyPrefix: 'userProfileDropdown',
  });
  const _options = [];
  if (permissions.includes(PeopleCardPermissionEnum.CanPromote)) {
    _options.push({
      icon: 'promoteUser',
      label: t('promoteToAdmin'),
      dataTestId: 'user-promoteToAdmin',
      onClick: onPromoteClick,
    });
  }
  if (permissions.includes(PeopleCardPermissionEnum.CanRemoveFromChannel)) {
    _options.push({
      icon: 'deactivateUser',
      label: <div className="text-red-500">{t('removeFromChannel')}</div>,
      dataTestId: 'people-card-ellipsis-remove-member',
      onClick: onRemoveChannelMember,
      iconClassName: '!text-red-500',
    });
  }
  if (permissions.includes(PeopleCardPermissionEnum.CanRemoveFromTeam)) {
    _options.push({
      icon: 'forbidden',
      label: <div className="text-red-500">{t('remove')}</div>,
      dataTestId: 'people-card-ellipsis-remove-member',
      onClick: onRemoveTeamMember,
      iconClassName: '!text-red-500',
    });
  }
  if (permissions.includes(PeopleCardPermissionEnum.CanEdit)) {
    _options.push({
      icon: 'edit',
      label: t('edit'),
      dataTestId: 'user-edit',
      onClick: onEditClick,
    });
  }

  if (permissions.includes(PeopleCardPermissionEnum.CanResendInvite)) {
    _options.push({
      icon: 'redo',
      label: t('resendInvite'),
      dataTestId: 'people-card-ellipsis-resend-invite',
      onClick: onResendInviteClick,
    });
  }

  if (permissions.includes(PeopleCardPermissionEnum.CanReactivate)) {
    _options.push({
      icon: 'reactivateUser',
      label: t('reactivateUser'),
      dataTestId: 'user-reactivate',
      onClick: onReactivateClick,
    });
  }

  if (permissions.includes(PeopleCardPermissionEnum.CanDeactivate)) {
    _options.push({
      icon: 'deactivateUser',
      label: t('deactivateUser'),
      dataTestId: 'user-deactivate',
      onClick: onDeactivateClick,
    });
  }

  if (permissions.includes(PeopleCardPermissionEnum.CanDelete)) {
    _options.push({
      icon: 'forbidden',
      label: <div className="text-red-500">{t('removeAccount')}</div>,
      dataTestId: 'people-card-ellipsis-remove-user',
      onClick: onDeleteClick,
      iconClassName: '!text-red-500',
    });
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
