import React, { useState } from 'react';
import _ from 'lodash';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import useRole from 'hooks/useRole';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import {
  UserRole,
  UserStatus,
  updateRoleToAdmin,
  updateStatus,
  useResendInvitation,
} from 'queries/users';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { PRIMARY_COLOR, TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import useModal from 'hooks/useModal';
import DeletePeople from '../../pages/Users/components/DeleteModals/People';
import { useMutation } from '@tanstack/react-query';
import { IPeopleCardProps } from 'pages/Users/components/People/PeopleCard';

export interface IUserDropdownProps {
  id: string;
  role: string;
  status: string | undefined;
  isAdmin: boolean;
  openModal?: any;
  isHovered?: boolean;
  parentIsUserProfile?: boolean;
}

const UserProfileDropdown: React.FC<IUserDropdownProps> = ({
  id,
  role,
  status,
  isAdmin,
  isHovered,
  openModal,
  parentIsUserProfile = false,
}) => {
  const { user } = useAuth();
  const resendInviteMutation = useResendInvitation();
  const updateUserStatusMutation = useMutation({
    mutationFn: updateStatus,
    mutationKey: ['update-user-status'],
    onSuccess: () => {
      toast(
        <SuccessToast
          content={`User has been ${
            (status as any) === UserStatus.Inactive
              ? 'reactivated'
              : 'deactivated'
          }`}
        />,
        {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        },
      );
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: updateRoleToAdmin,
    mutationKey: ['update-user-role'],
    onSuccess: () => {
      toast(<SuccessToast content={`User role has been updated to admin`} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            stroke={twConfig.theme.colors.primary['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
    },
  });

  const _options = [];

  if ([UserStatus.Invited, UserStatus.Created].includes(status as any)) {
    _options.push({
      icon: 'redo',
      label: 'Resend Invite',
      dataTestId: 'people-card-ellipsis-resend-invite',
      onClick: () => {
        toast(<SuccessToast content="Invitation has been sent" />, {
          closeButton: (
            <Icon
              name="closeCircleOutline"
              stroke={twConfig.theme.colors.primary['500']}
              size={20}
            />
          ),
          style: {
            border: `1px solid ${twConfig.theme.colors.primary['300']}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
          },
          autoClose: TOAST_AUTOCLOSE_TIME,
          transition: slideInAndOutTop,
          theme: 'dark',
        });
        resendInviteMutation.mutate(id);
      },
    });
  }

  if (isAdmin && role === UserRole.Member) {
    _options.push({
      icon: '',
      label: `Edit`,
      dataTestId: 'people-card-ellipsis-resend-invite',
      onClick: () => {
        updateUserRoleMutation.mutate({ id });
      },
    });
  }

  if (
    [UserStatus.Inactive, UserStatus.Active].includes(status as any) &&
    role !== UserRole.Superadmin &&
    id !== user?.id
  ) {
    _options.push({
      icon:
        (status as any) === UserStatus.Inactive
          ? 'reactivateUser'
          : 'deactivateUser',
      label: `${
        (status as any) === UserStatus.Inactive ? 'Reactivate' : 'Deactivate'
      } user`,
      dataTestId: 'people-card-ellipsis-resend-invite',
      onClick: () => {
        updateUserStatusMutation.mutate({
          id,
          status:
            (status as any) === UserStatus.Active
              ? UserStatus.Inactive
              : UserStatus.Active,
        });
      },
    });
  }

  if (isAdmin && role === UserRole.Member && status === UserStatus.Active) {
    _options.push({
      icon: '',
      label: `Promote to admin`,
      dataTestId: 'people-card-ellipsis-resend-invite',
      onClick: () => {
        updateUserRoleMutation.mutate({ id });
      },
    });
  }

  if (id !== user?.id) {
    _options.push({
      icon: 'forbidden',
      label: <div className="text-red-500">Remove account</div>,
      dataTestId: 'people-card-ellipsis-remove-user',
      onClick: openModal,
      stroke: '#F05252',
    });
  }

  if (isAdmin && isHovered && _options.length > 0) {
    return (
      <PopupMenu
        triggerNode={
          <div className="cursor-pointer">
            <Icon
              name="dotsVertical"
              stroke="#000"
              className="absolute top-2 right-2"
              hover={false}
              dataTestId="people-card-ellipsis"
            />
          </div>
        }
        menuItems={_options}
        className="right-0 top-8"
      />
    );
  }
  return null;
};

export default UserProfileDropdown;
