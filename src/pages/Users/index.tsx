import { FC, useState } from 'react';
import clsx from 'clsx';
import useModal from 'hooks/useModal';
import useAuth from 'hooks/useAuth';
import Button, { Variant } from 'components/Button';
import Card from 'components/Card';
import Tabs from 'components/Tabs';
import OrgChart from 'components/OrgChart';
import People from './components/People';
import Team from './components/Teams';
import { useLocation } from 'react-router-dom';
import PopupMenu from 'components/PopupMenu';
import { useTranslation } from 'react-i18next';
import useProduct from 'hooks/useProduct';
import { usePageTitle } from 'hooks/usePageTitle';
import useNavigate from 'hooks/useNavigation';
import { UserRole } from 'interfaces';

interface IUsersProps {}

const Users: FC<IUsersProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathname = location.pathname;
  const isUserTab = currentPathname.includes('users');
  const { t } = useTranslation('peoplehub');

  if (isUserTab) {
    usePageTitle('users');
  } else {
    usePageTitle('teams');
  }

  const [showOrgChart, setShowOrgChart] = useState<boolean>(false);
  const [showAddUserModal, openAddUserModal, closeAddUserModal] = useModal(
    undefined,
    false,
  );
  const [showImportUserModal, openImportUserModal, closeImportUserModal] =
    useModal(undefined, false);

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
        'bg-primary-500 rounded-6xl text-white text-neutral-900': active,
      },
      {
        'bg-neutral-50 rounded-lg hover:text-neutral-900 text-neutral-500':
          !active,
      },
      {
        'bg-opacity-50 text-gray-400': disabled,
      },
    );
  const { isLxp } = useProduct();
  const tabs = [
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('people.title')}</div>
      ),
      dataTestId: 'people-tab',
      tabContent: (
        <>
          <People
            showModal={showAddUserModal}
            openModal={openAddUserModal}
            closeModal={closeAddUserModal}
            showImport={showImportUserModal}
            closeImport={closeImportUserModal}
          />
        </>
      ),
      tabAction: (
        <div className="flex space-x-2 relative">
          <Button
            className="flex space-x-[6px] group px-6 py-[10px] rounded-[24px]"
            label={t('people.viewOrgChart')}
            variant={Variant.Secondary}
            leftIcon="groupOutline"
            leftIconSize={16}
            dataTestId="people-org-chart"
            iconColor="text-black"
            onClick={() => setShowOrgChart(true)}
          />
          {user?.role !== UserRole.Member && (
            <PopupMenu
              triggerNode={
                <Button
                  className="flex space-x-1 px-6 py-[10px] rounded-[24px]"
                  label={t('people.addMembers')}
                  leftIcon="add"
                  leftIconClassName="!text-white"
                  leftIconSize={20}
                  dataTestId="add-members-btn"
                />
              }
              className="absolute right-0 top-10 mt-2 w-44  "
              menuItems={[
                {
                  icon: 'addCircle',
                  label: t('people.quickAdd'),
                  onClick: openAddUserModal,
                  dataTestId: 'people-quick-add',
                },
                {
                  icon: 'import',
                  label: t('people.import'),
                  onClick: openImportUserModal,
                  dataTestId: 'people-bulk-import',
                },
              ]}
            />
          )}
        </div>
      ),
    },
    {
      id: 2,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>{t('teams.title')}</div>
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
        user?.role !== UserRole.Member && !isLxp ? (
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
        title={isLxp ? 'My Teams' : 'People Hub'}
        className={`w-fit   ${
          isLxp ? 'hidden' : 'flex'
        } justify-start bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200`}
        tabSwitcherClassName="!p-1"
        activeTabIndex={!isUserTab ? 1 : 0}
        showUnderline={false}
        itemSpacing={1}
        tabContentClassName="mt-4"
        onTabChange={() => {
          navigate(isUserTab ? '/teams' : '/users');
        }}
      />
    </Card>
  );
};

export default Users;
