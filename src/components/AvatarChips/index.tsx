import AvatarChip, { IAvatarUser } from 'components/AvatarChip';
import useModal from 'hooks/useModal';
import React from 'react';
import UserListModal from './components/UserListModal';

interface IAvatarChipsProps {
  users: IAvatarUser[];
  showCount: number;
  className?: string;
  avatarClassName?: string;
  avatarSize?: number;
  dataTestId?: string;
}

const AvatarChips: React.FC<IAvatarChipsProps> = ({
  users,
  showCount,
  className,
  avatarClassName,
  avatarSize = 16,
  dataTestId,
}) => {
  const [open, openModal, closeModal] = useModal();

  return (
    <>
      <div className={`flex items-center flex-wrap gap-2 ${className}`}>
        {users.length > 0 &&
          users
            .slice(0, showCount)
            .map((user: IAvatarUser) => (
              <AvatarChip
                user={user}
                key={user.userId}
                className={avatarClassName}
                size={avatarSize}
                dataTestId={dataTestId}
              />
            ))}

        {users.length > showCount && (
          <div
            className={`flex items-center w-fit gap-1 rounded-[24px] border-1 border-neutral-200 bg-neutral-100
      px-2 py-3 text-primary-500 text-semibold text-sm 
      hover:border-primary-500 transition cursor-pointer ${avatarClassName}`}
            onClick={openModal}
            data-testid={`${dataTestId}morecta`}
          >
            +{users.length - showCount} more
          </div>
        )}
      </div>
      <UserListModal
        open={open}
        closeModal={closeModal}
        users={users}
        dataTestId={dataTestId}
      />
    </>
  );
};

export default AvatarChips;
