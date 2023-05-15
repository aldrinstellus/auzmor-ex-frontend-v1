import Avatar from 'components/Avatar';
import Card from 'components/Card';
import useAuth from 'hooks/useAuth';
import React from 'react';

export interface IUserCardProps {}

const UserCard: React.FC<IUserCardProps> = () => {
  const { user } = useAuth();

  return (
    <div>
      <Card className="pb-10 pt-0 rounded-9xl">
        <div className="flex flex-col items-center relative px-12">
          <div className="bg-blue-700 w-full h-20 absolute top-0 rounded-t-9xl"></div>
          <Avatar
            name={user?.name || ''}
            image={user?.profileImage}
            size={96}
            className="border-4 border-white mt-8 overflow-hidden"
          />
          <div className="text-base font-bold mt-2">{user?.name}</div>
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
