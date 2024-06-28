import AvatarList from 'components/AvatarList';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
import TeamWork from 'images/teamwork.svg';
import { TeamFlow } from '.';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FC } from 'react';
import { isNewEntity } from 'utils/misc';
import TeamOptions from 'components/TeamOptions';
import useRole from 'hooks/useRole';
import useProduct from 'hooks/useProduct';
import Truncate from 'components/Truncate';

export interface ITeamsCardProps {
  id: string;
  name: string;
  category: Record<string, any>;
  description: string;
  createdAt: string;
  totalMembers: number;
  recentMembers: any;
  setTeamFlow: (mode: string) => void;
  openModal: () => void;
  setTeamDetails: (detail: Record<string, any> | null) => void;
}

const TeamsCard: FC<ITeamsCardProps> = ({
  id,
  name,
  description,
  category,
  createdAt,
  totalMembers,
  recentMembers = [],
  setTeamFlow,
  openModal,
  setTeamDetails,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isHovered, eventHandlers] = useHover();
  const { isMember } = useRole();
  const { isLxp } = useProduct();
  return (
    <div className="cursor-pointer" data-testid="" {...eventHandlers}>
      <Card
        shadowOnHover
        className="relative w-[190px] h-[217px] border-solid border border-neutral-200 flex flex-col items-center justify-center py-6 px-3 bg-white focus-within:shadow-xl"
        dataTestId="team-card"
      >
        <div
          tabIndex={0}
          className="outline-none"
          onKeyUp={(e) => {
            if (e.code === 'Enter') {
              navigate(`/teams/${id}`, {
                state: { prevRoute: searchParams.get('tab') },
              });
            }
          }}
          title={`${name} with ${totalMembers} members`}
        >
          {!isMember && !isLxp && isHovered && (
            <TeamOptions
              id={id}
              onEdit={() => {
                openModal();
                setTeamFlow(TeamFlow.EditTeam);
                setTeamDetails({
                  id: id,
                  name: name,
                  description: description,
                  category: category,
                  createdAt: createdAt,
                  totalMembers: totalMembers,
                });
              }}
              className="-right-36 w-44 top-8"
              dataTestId="team-card-ellipsis"
              dataTestIdPrefix="ellipsis-"
              iconColor="text-black"
              iconClassName="absolute top-2 right-2"
            />
          )}
          {isNewEntity(createdAt) && (
            <div
              className="absolute top-0 left-0 bg-primary-100 text-primary-500 rounded-tl-[12px] rounded-br-[12px] px-3 py-1 text-xxs font-medium"
              data-testid="team-badge-recentlyadded"
            >
              Recently added
            </div>
          )}
          <div
            className="flex flex-col items-center gap-4 justify-between"
            onClick={() => {
              navigate(`/teams/${id}`, {
                state: { prevRoute: searchParams.get('tab') },
              });
            }}
          >
            {recentMembers?.length !== 0 ? (
              <AvatarList
                size={80}
                users={recentMembers || []}
                moreCount={totalMembers}
                dataTestId="teams-icon"
              />
            ) : (
              <div className="p-[18px] bg-neutral-200 rounded-full">
                <img src={TeamWork} height={44} width={44} alt="Team Icon" />
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex flex-col items-center gap-1">
                <Truncate
                  text={name}
                  className="text-neutral-900 text-base font-bold text-center max-w-[128px]"
                  dataTestId={`team-name-${name}`}
                />

                {!isLxp ? (
                  <div
                    // different colors for category
                    className="text-xxs font-semibold py-[2px] px-2 line-clamp-1 capitalize rounded bg-indigo-100 text-indigo-500"
                    data-testid={`team-category-${category?.name?.toLowerCase()}`}
                  >
                    {category?.name?.toLowerCase()}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-center gap-1">
                <Icon
                  name="profileUserOutline"
                  size={16}
                  color="text-neutral-900"
                  strokeWidth="1"
                  hover={false}
                />
                <div
                  className="text-xs font-normal text-neutral-500"
                  data-testid={`team-no-of-members-${totalMembers}`}
                >
                  {totalMembers} members
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamsCard;
