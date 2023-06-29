import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import { IGetReaction } from 'queries/reaction';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface IReactionRowProps {
  reaction?: IGetReaction;
  isLoading?: boolean;
}

const ReactionRow: React.FC<IReactionRowProps> = ({
  reaction,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div
      className="flex justify-between py-5 border-b-1 border-neutral-100 cursor-pointer"
      onClick={() => {
        if (reaction?.createdBy.userId === user?.id) {
          return navigate('/profile');
        }
        return navigate(`/users/${reaction?.createdBy.userId}`);
      }}
    >
      <div className="flex w-1/2 items-center">
        <div className="mr-4">
          <Avatar
            size={32}
            image={reaction?.createdBy.profileImage.original}
            name={reaction?.createdBy.fullName}
            loading={isLoading}
          />
        </div>
        <div className="flex flex-col truncate w-full">
          <div className="text-neutral-900 font-bold text-sm truncate">
            {reaction?.createdBy.fullName || 'NA'}
          </div>
          <div className="text-neutral-500 text-xs truncate">
            {reaction?.createdBy.email || 'NA'}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2">
        <div className="flex flex-row w-full justify-end">
          {/* <div
            className={`text-neutral-500 text-xs truncate mr-6 ${
              isLoading && 'w-1/3'
            }`}
          >
            {reaction?.createdBy.designation ||
              (isLoading && <Skeleton />) ||
              'NA'}
          </div>
          <div className="mr-6 flex items-center">
            <div className="w-1 h-1 bg-neutral-500 rounded-full"></div>
          </div>
          <div
            className={`text-neutral-500 text-xs truncate ${
              isLoading && 'w-1/3'
            }`}
          >
            {reaction?.createdBy.workLocation ||
              (isLoading && <Skeleton />) ||
              'NA'}
          </div> */}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ReactionRow;
