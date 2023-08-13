import Button from 'components/Button';
import Icon from 'components/Icon';
import React from 'react';
import Card from 'components/Card';
import People from '../People';

export interface ITeamMemberProps {
  setShowMyTeam: (show: boolean) => void;
}

const TeamMember: React.FC<ITeamMemberProps> = ({ setShowMyTeam }) => {
  return (
    <>
      <Card className="py-8 space-y-6">
        <div className="flex justify-between items-center px-8">
          <div className="flex space-x-1">
            <Icon
              name="linearLeftArrowOutline"
              size={20}
              onClick={() => setShowMyTeam(false)}
            />
            <div className="text-base font-bold text-neutral-900">My Team</div>
          </div>
          <Button
            className="flex space-x-1"
            label="Add Members"
            leftIcon="add"
            onClick={() => {
              // add memeber
            }}
            dataTestId="add-members-btn"
          />
        </div>
        <div className="w-full bg-purple-50 border-1 border-purple-200 py-4 pl-8 pr-16 flex justify-between">
          <div className="flex flex-col text-neutral-900 space-y-4">
            <div className="text-2xl font-bold">Design Team</div>
            <div className="text-xs font-normal">
              This is a team for design members
            </div>
          </div>

          <div className="flex items-center space-x-20 ">
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold text-purple-700">
                Team type
              </div>
              <div className="text-xl font-semibold">Name</div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="text-sm font-semibold text-purple-700">
                No. of people
              </div>
              <div className="text-xl font-semibold">9</div>
            </div>
            <div>
              <Icon name="setting" stroke="#171717" />
            </div>
          </div>
        </div>
        <div className="px-8">
          {/* Here try to make common component called Peoplecard */}
          <div>List of members</div>
        </div>
      </Card>
    </>
  );
};

export default TeamMember;
