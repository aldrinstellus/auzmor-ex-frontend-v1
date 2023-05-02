import React from 'react';
import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import Popover from 'components/Popover';
import Button, { Size, Variant } from 'components/Button';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { logout } from 'queries/account';
import { removeAllItems } from 'utils/persist';
import { useNavigate } from 'react-router-dom';

const AccountCard = () => {
  const navigate = useNavigate();

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      removeAllItems();
      navigate('/login');
    },
  });

  const { user } = useAuth();

  const menuItemStyle = clsx({
    'px-4 py-3 border-t text-sm hover:bg-primary-50 cursor-pointer': true,
  });

  return (
    <Popover
      triggerNode={<Avatar name={user?.name || 'U'} size={32} />}
      className="-right-2 top-[52px] rounded-9xl"
    >
      <div className="rounded-9xl flex flex-col items-center w-64">
        <div className="px-4 py-5 flex flex-col items-center">
          <Avatar size={80} name={user?.name || 'U'} showActiveIndicator />
          <div className="text-sm font-bold mt-4">{user?.name}</div>
          <div className="text-neutral-500 text-xs">{user?.email}</div>
        </div>
        <div className="px-4">
          <Button
            variant={Variant.Secondary}
            label="Go to my profile"
            size={Size.Small}
          />
        </div>
        <div className="w-full pt-4">
          <div className={menuItemStyle}>User Settings</div>
          <div className={menuItemStyle}>Admin Settings</div>
          <div
            className={menuItemStyle}
            onClick={() => logoutMutation.mutate()}
          >
            Sign out
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default AccountCard;
