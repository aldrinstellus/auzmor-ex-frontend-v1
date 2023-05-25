import Avatar from 'components/Avatar';
import { IGetReaction } from 'queries/reaction';
import React from 'react';

export interface IReactionRowProps {
  reaction: IGetReaction;
}

const ReactionRow: React.FC<IReactionRowProps> = ({ reaction }) => {
  return (
    <div className="flex justify-between py-5 border-b-1 border-neutral-100">
      <div className="flex w-1/2 items-center">
        <div className="mr-4">
          <Avatar
            size={32}
            image={reaction.createdBy.profileImage.original}
            name={reaction.createdBy.fullName}
          />
        </div>
        <div className="flex flex-col truncate">
          <div className="text-neutral-900 font-bold text-sm truncate">
            {reaction.createdBy.fullName}
          </div>
          <div className="text-neutral-500 text-xs truncate">
            {reaction.createdBy.email}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2">
        <div className="flex flex-row">
          <div className="text-neutral-500 text-xs truncate mr-6">
            {reaction.createdBy.designation}
          </div>
          <div className="mr-6 flex items-center">
            <div className="w-1 h-1 bg-neutral-500 rounded-full"></div>
          </div>
          <div className="text-neutral-500 text-xs truncate">
            {reaction.createdBy.workLocation}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ReactionRow;
