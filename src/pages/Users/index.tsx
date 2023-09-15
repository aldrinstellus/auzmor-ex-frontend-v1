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
import Team from './components/Teams';
import { useLocation, useNavigate } from 'react-router-dom';

interface IUsersProps {}

const Users: React.FC<IUsersProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathname = location.pathname;
  const isUserTab = currentPathname.includes('users');

  const [showOrgChart, setShowOrgChart] = useState<boolean>(false);
  const [showAddUserModal, openAddUserModal, closeAddUserModal] = useModal(
    undefined,
    false,
  );
  const [showTeamModal, openTeamModal, closeTeamModal] = useModal(
    undefined,
    false,
  ); // to context

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
      dataTestId: 'people-tab',
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
            className="flex space-x-[6px] group px-6 py-[10px] rounded-[24px]"
            label="View Organization Chart"
            variant={Variant.Secondary}
            leftIcon="groupOutline"
            leftIconSize={16}
            dataTestId="people-org-chart"
            iconColor="text-black"
            onClick={() => setShowOrgChart(true)}
          />
          {user?.role !== Role.Member && (
            <Button
              className="flex space-x-1 px-6 py-[10px] rounded-[24px]"
              label="Add Members"
              leftIcon="add"
              leftIconClassName="!text-white"
              leftIconSize={20}
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
      dataTestId: 'teams-tab',
      tabContent: (
        <Team
          showTeamModal={showTeamModal}
          openTeamModal={openTeamModal}
          closeTeamModal={closeTeamModal}
        />
      ),
      tabAction:
        user?.role !== Role.Member ? (
          <div className="flex space-x-2">
            <Button
              className="flex space-x-1 px-6 py-[10px] rounded-[24px]"
              label="Add Teams"
              leftIcon="add"
              leftIconClassName="!text-white"
              leftIconSize={20}
              onClick={openTeamModal}
              dataTestId="add-teams"
            />
          </div>
        ) : (
          <div />
        ),
    },
  ];

  return showOrgChart ? (
    <OrgChart setShowOrgChart={setShowOrgChart} />
  ) : (
    <Card className="p-8 px-7 w-full h-full">
      <Tabs
        tabs={tabs}
        title={'People Hub'}
        className="w-fit flex justify-start bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200"
        tabSwitcherClassName="!p-1"
        showUnderline={false}
        itemSpacing={1}
        activeTabIndex={!isUserTab ? 1 : 0} //need to handle the behaviour
        tabContentClassName="mt-6"
        onTabChange={() => {
          navigate(isUserTab ? '/teams' : '/users');
        }}
      />
    </Card>
  );
};

export default Users;
