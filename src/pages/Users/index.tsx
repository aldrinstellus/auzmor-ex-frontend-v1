import React, { useState } from 'react';
import clsx from 'clsx';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Tabs from 'components/Tabs';
import OrgChart from 'components/OrgChart';
import People from './components/People';
import { Role } from 'utils/enum';
import Team, { TeamFlow } from './components/Teams';
import TeamDetail from './components/TeamDetail';

export interface ITeamDetailState {
  isTeamSelected: boolean;
  teamDetail: Record<string, any> | null;
  activeTab: string;
}

interface IUsersProps {}

const Users: React.FC<IUsersProps> = () => {
  const [showOrgChart, setShowOrgChart] = useState<boolean>(false);
  const [showAddUserModal, openAddUserModal, closeAddUserModal] = useModal(
    undefined,
    false,
  );
  const [showTeamModal, openTeamModal, closeTeamModal] = useModal(
    undefined,
    false,
  );

  const [teamFlow, setTeamFlow] = useState<TeamFlow>(TeamFlow.CreateTeam); // to context

  const [showTeamDetail, setShowTeamDetail] = useState<ITeamDetailState>({
    isTeamSelected: false,
    teamDetail: {},
    activeTab: '',
  }); // to context

  const [showAddMemberModal, openAddMemberModal, closeAddMemberModal] =
    useModal(false);

  const { user } = useAuth();

  const tabStyles = (active: boolean, disabled = false) =>
    clsx(
      {
        'font-bold px-4 cursor-pointer py-1': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
      {
        'bg-opacity-50 text-gray-400': disabled,
      },
    );

  const tabs = [
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>People</div>
      ),
      dataTestId: 'people-view-tab',
      tabContent: (
        <>
          <People
            showModal={showAddUserModal}
            openModal={openAddUserModal}
            closeModal={closeAddUserModal}
          />
        </>
      ),
      tabAction: (
        <div className="flex space-x-2">
          <Button
            className="flex space-x-[6px] group"
            label="View Organization Chart"
            variant={Variant.Secondary}
            leftIcon="groupOutline"
            leftIconSize={20}
            dataTestId="people-org-chart"
            iconStroke="black"
            onClick={() => setShowOrgChart(true)}
          />
          {user?.role !== Role.Member && (
            <Button
              className="flex space-x-1"
              label="Add Members"
              leftIcon="add"
              onClick={openAddUserModal}
              dataTestId="add-members-btn"
            />
          )}
        </div>
      ),
    },
    {
      id: 2,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Teams</div>
      ),
      dataTestId: 'teams-view-tab',
      tabContent: (
        <Team
          showTeamModal={showTeamModal}
          openTeamModal={openTeamModal}
          closeTeamModal={closeTeamModal}
          showTeamDetail={showTeamDetail}
          setShowTeamDetail={setShowTeamDetail}
          setTeamFlow={setTeamFlow}
          teamFlow={teamFlow}
          showAddMemberModal={showAddMemberModal}
          openAddMemberModal={openAddMemberModal}
          closeAddMemberModal={closeAddMemberModal}
        />
      ),
      tabAction: user?.role !== Role.Member && (
        <Button
          className="flex space-x-1"
          label="Add Teams"
          leftIcon="add"
          onClick={openTeamModal}
          dataTestId="add-teams-btn"
        />
      ),
    },
  ];

  return showOrgChart ? (
    <OrgChart setShowOrgChart={setShowOrgChart} />
  ) : (
    <>
      {!showTeamDetail.isTeamSelected ? (
        <Card className="p-8 w-full h-full">
          <Tabs
            tabs={tabs}
            title={'People Hub'}
            className="w-fit flex justify-start bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200"
            tabSwitcherClassName="!p-1"
            showUnderline={false}
            itemSpacing={1}
            activeTabIndex={showTeamDetail.activeTab === 'TEAM' ? 1 : 0} //need to handle the behaviour
            tabContentClassName="mt-8"
          />
        </Card>
      ) : (
        <TeamDetail
          setShowTeamDetail={setShowTeamDetail}
          teamTab={showTeamDetail.activeTab}
          openModal={openTeamModal}
          showAddMemberModal={showAddMemberModal}
          openAddMemberModal={openAddMemberModal}
          closeAddMemberModal={closeAddMemberModal}
          {...showTeamDetail.teamDetail}
        />
      )}
    </>
  );
};

export default Users;
