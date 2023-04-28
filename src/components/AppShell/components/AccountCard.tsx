import React from 'react';
import Avatar from 'components/Avatar';
import PopupMenu from 'components/PopupMenu';
import useAuth from 'hooks/useAuth';

const AccountCard = () => {
  const { user } = useAuth();

  return (
    <PopupMenu
      triggerNode={<Avatar name={user?.name || 'U'} size={32} />}
      menuItems={[]}
    />
  );
};

export default AccountCard;
