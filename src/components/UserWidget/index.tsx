import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useAuth from 'hooks/useAuth';
import { useCurrentUser } from 'queries/users';
import { FC, memo } from 'react';
import { Link } from 'react-router-dom';

export interface IUserCardProps {
  className?: string;
}

const UserCard: FC<IUserCardProps> = ({ className }) => {
  const { user } = useAuth();
  const { data } = useCurrentUser();

  const userDetails = data?.data?.result?.data;

  return (
    <div className={className}>
      <Card className="pb-3 pt-0 rounded-9xl min-h-[216px]">
        <div className="flex flex-col items-center gap-2 relative px-12">
          <div className="bg-secondary-500 w-full h-[89px] absolute top-0 rounded-t-9xl"></div>
          <Link to="/profile">
            <Avatar
              name={userDetails?.fullName || ''}
              image={user?.profileImage}
              size={80}
              className="border-4 border-white mt-11 overflow-hidden"
              dataTestId="profilecard-profilepic"
            />
          </Link>
          <Link to="/profile" className="flex flex-col gap-2">
            <div
              className="text-lg font-bold truncate w-full text-center"
              data-testid="profilecard-username"
            >
              {userDetails?.fullName}
            </div>

            {userDetails?.designation?.name && (
              <div
                className="text-sm font-normal truncate w-full text-center text-neutral-500"
                data-testid="profilecard-designation"
              >
                {userDetails?.designation?.name}
              </div>
            )}

            {userDetails?.workLocation?.name && (
              <div className="text-sm text-neutral-500 leading-[16px] font-normal truncate w-full text-center flex gap-1 justify-center items-center">
                <Icon
                  name="location"
                  size={16}
                  color="text-neutral-500"
                  hover={false}
                />
                {userDetails?.workLocation?.name}
              </div>
            )}
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default memo(UserCard);
