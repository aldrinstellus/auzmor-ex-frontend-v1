import React from 'react';
import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import Popover from 'components/Popover';
import Button, { Size, Variant } from 'components/Button';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from 'queries/account';
import { removeAllItems } from 'utils/persist';
import { useNavigate } from 'react-router-dom';

const AccountCard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      removeAllItems();
      queryClient.clear();
      navigate('/login');
    },
  });

  const { user } = useAuth();

  const menuItemStyle = clsx({
    'px-4 py-3 border-t text-sm hover:bg-primary-50 cursor-pointer': true,
  });

  return (
    <Popover
      triggerNode={
        <Avatar
          dataTestId="my-profile-avatar"
          name={user?.name || 'U'}
          size={32}
          image={user?.profileImage}
        />
      }
      className="-right-2 top-[52px] rounded-9xl"
    >
      <div className="rounded-9xl flex flex-col items-center w-64">
        <div className="px-4 py-5 flex flex-col items-center">
          <Avatar
            size={80}
            name={user?.name || 'U'}
            image={user?.profileImage}
            showActiveIndicator
          />
          <div
            className="text-sm font-bold mt-4"
            data-testId="user-menu-user-name"
          >
            {user?.name}
          </div>
          <div
            className="text-neutral-500 text-xs"
            data-testId="user-menu-user-email"
          >
            {user?.email}
          </div>
        </div>
        <div className="px-4">
          <Button
            dataTestId="user-menu-profile"
            variant={Variant.Secondary}
            label="Go to my profile"
            onClick={() => {
              navigate('/profile', { state: { userId: user?.id } });
            }}
            size={Size.Small}
          />
        </div>
        <div className="w-full pt-4">
          <div className={menuItemStyle} data-testId="user-menu-user-settings">
            User Settings
          </div>
          <div className={menuItemStyle} data-testId="user-menu-admin-settings">
            Admin Settings
          </div>
          <div
            className={menuItemStyle}
            onClick={() => logoutMutation.mutate()}
            data-testId="user-menu-signout-cta"
          >
            Sign out
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default AccountCard;
