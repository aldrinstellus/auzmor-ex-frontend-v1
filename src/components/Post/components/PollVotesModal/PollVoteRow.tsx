import Avatar from 'components/Avatar';
import useAuth from 'hooks/useAuth';
import { IGetPollVote } from 'queries/pollVotes';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarColor, getFullName, getProfileImage } from 'utils/misc';

export interface IPollVoteRowProps {
  vote?: IGetPollVote;
  isLoading?: boolean;
}

const ReactionRow: FC<IPollVoteRowProps> = ({ vote, isLoading = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      className="flex justify-between py-5 border-b-1 border-neutral-100 cursor-pointer"
      onClick={() => {
        if (vote?.id === user?.id) {
          return navigate('/profile');
        }
        return navigate(`/users/${vote?.id}`);
      }}
    >
      <div className="flex w-1/2 items-center">
        <div className="mr-4">
          <Avatar
            size={32}
            image={getProfileImage(vote)}
            name={getFullName(vote)}
            loading={isLoading}
            bgColor={getAvatarColor(vote)}
          />
        </div>
        <div className="flex flex-col truncate w-full">
          <div className="text-neutral-900 font-bold text-sm truncate">
            {vote ? getFullName(vote) : 'NA'}
          </div>
          <div className="text-neutral-500 text-xs truncate">
            {vote?.primaryEmail || 'NA'}
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
