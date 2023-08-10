import AvatarList from 'components/AvatarList';
import Card from 'components/Card';
import React from 'react';
import useHover from 'hooks/useHover';
import { truncate } from 'lodash';
import Icon from 'components/Icon';
import TeamWork from 'images/teamwork.svg';
import PopupMenu from 'components/PopupMenu';
import useRole from 'hooks/useRole';
import DeleteTeam from '../DeleteModals/Team';
import useModal from 'hooks/useModal';

// types....

export interface ITeamsCardProps {
  id: string;
  name: string;
  category: Record<string, any>;
  description: string;
  setShowMyTeam: (show: boolean) => void;
}

const TeamsCard: React.FC<ITeamsCardProps> = ({
  setShowMyTeam,
  id,
  name,
  category,
  description,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const [open, openModal, closeModal] = useModal();
  const { isAdmin } = useRole();

  return (
    <div className="cursor-pointer" data-testid="" {...eventHandlers}>
      <Card
        shadowOnHover
        className="relative w-[188px] border-solid border border-neutral-200 flex flex-col items-center justify-center p-6 bg-white"
      >
        {isAdmin && isHovered > 0 && (
          <PopupMenu
            triggerNode={
              <div className="cursor-pointer">
                <Icon
                  name="moreOutline"
                  stroke="#000"
                  className="absolute top-2 right-2"
                  hover={false}
                  dataTestId="people-card-ellipsis"
                />
              </div>
            }
            menuItems={[
              {
                icon: 'edit',
                label: 'Edit',
                onClick: () => {
                  // edit action flow
                },
                dataTestId: '',
                permissions: [''],
              },
              {
                icon: 'shareForwardOutline',
                label: 'Share',
                onClick: () => {
                  // sharing the team
                },
                dataTestId: '',
                permissions: [''],
              },
              {
                icon: 'cancel',
                label: 'Remove',
                onClick: () => openModal(),
                permissions: [''],
              },
            ]}
            className="-right-36 w-44 top-8"
          />
        )}
        {/* Conditionally Render based on API Response - based on the communintated using createdAt date*/}
        {/* <div
          style={{
            backgroundColor: '#D1FAE5',
          }}
          className="absolute top-0 left-0 text-primary-500 rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xs font-medium"
        >
          Recently added
        </div> */}

        <div
          className="flex flex-col items-center"
          onClick={() => setShowMyTeam(true)}
        >
          <AvatarList
            size={80}
            users={[]}
            displayCount={2}
            className="mb-4 mt-1"
          />
          <div className="p-[18px] bg-neutral-200 rounded-full mb-4 mt-1">
            <img src={TeamWork} height={44} width={44} />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col items-center space-y-1">
              <div
                className="truncate text-neutral-900 text-base font-bold"
                data-testid={`team-card-name-${name}`}
              >
                {truncate(name, {
                  length: 24,
                  separator: ' ',
                })}
              </div>

              <div className="bg-indigo-100 text-indigo-500 text-xxs font-semibold rounded-xl py-0.4 px-2 truncate capitalize">
                {category?.name?.toLowerCase()}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1">
              <Icon name="profileUserOutline" size={18} />
              <div className="text-xs font-normal text-neutral-500">
                {0} members
              </div>
            </div>
          </div>
        </div>
      </Card>

      <DeleteTeam
        open={open}
        openModal={openModal}
        closeModal={closeModal}
        userId={id}
      />
    </div>
  );
};

export default TeamsCard;
