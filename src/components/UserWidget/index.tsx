import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import { useCurrentUser } from 'queries/users';
import React from 'react';
import { Link } from 'react-router-dom';

export interface IUserCardProps {
  className?: string;
}

const UserCard: React.FC<IUserCardProps> = ({ className }) => {
  const { user } = useAuth();
  const { data } = useCurrentUser();

  const userDetails = data?.data?.result?.data;

  return (
    <div className={className}>
      <Card className="pb-10 pt-0 rounded-9xl">
        <div className="flex flex-col items-center relative px-12">
          <div className="bg-blue-500 w-full h-20 absolute top-0 rounded-t-9xl"></div>
          <Link to="/profile">
            <Avatar
              name={userDetails?.fullName || ''}
              image={user?.profileImage}
              size={80}
              className="border-4 border-white mt-8 overflow-hidden"
              dataTestId="profilecard-profilepic"
            />
          </Link>
          <Link to="/profile">
            <div
              className="text-base font-bold mt-2 truncate w-full text-center"
              data-testid="profilecard-username"
            >
              {userDetails?.fullName}
            </div>
            {userDetails?.designation && (
              <div
                className="text-xs font-normal mt-2 truncate w-full text-center"
                data-testid="profilecard-designation"
              >
                {userDetails?.designation || 'NA'}
              </div>
            )}

            {/* <div className="text-xxs font-normal mt-2 truncate w-full text-center flex justify-center items-center gap-x-2">
              <Icon name="location" size={16} />
              {userDetails?.workLocation}
            </div> */}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default UserCard;
