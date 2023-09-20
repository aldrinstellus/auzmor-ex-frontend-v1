import ContactWidget from 'components/ContactWidget';
import {
  UserEditType,
  UserRole,
  useCurrentUser,
  useSingleUser,
} from 'queries/users';
import ProfileInfo from 'components/ProfileInfo';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import ProfileActivityFeed from './components/ProfileActivityFeed';
import useAuth from 'hooks/useAuth';
import NoDataCard from './components/NoDataCard';
import ProfileCoverSection from './components/ProfileCoverSection';
import clsx from 'clsx';
import Tabs from 'components/Tabs';
import UserDetailSkeleton from './components/UserDetailSkeleton';
import ContactSkeleton from 'components/ContactWidget/components/Skeletons';
import useModal from 'hooks/useModal';
import useRole from 'hooks/useRole';
import { FC } from 'react';

export interface IUpdateProfileImage {
  profileImage: File;
  coverImage: File;
}

interface IUserDetailProps {}

const UserDetail: FC<IUserDetailProps> = () => {
  const [open, openModal, closeModal] = useModal(undefined, false);
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const params = useParams();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  let editType = UserEditType.NONE;

  let userDetail;

  if (pathname === '/profile') {
    userDetail = useCurrentUser();
  } else {
    userDetail = useSingleUser(params?.userId || '');
  }

  const editSection = searchParams.get('edit') || '';

  const data = userDetail?.data?.data?.result?.data;

  if (data) {
    editType =
      data?.id === user?.id
        ? UserEditType.COMPLETE
        : isAdmin && data?.role === UserRole.Member
        ? UserEditType.PARTIAL
        : editType;
  }

  const tabStyles = (active: boolean) =>
    clsx(
      {
        'font-medium px-6 cursor-pointer py-1': true,
      },
      {
        '!font-bold bg-primary-500 rounded-6xl text-white': active,
      },
      {
        'bg-neutral-50 rounded-lg': !active,
      },
    );

  const tabs = [
    {
      id: 1,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Profile</div>
      ),
      dataTestId: 'user-profile-tab',
      tabContent: (
        <ProfileInfo
          profileDetails={data}
          isLoading={userDetail?.isLoading}
          editType={editType}
          editSection={editSection}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      ),
    },
    {
      id: 2,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Activity</div>
      ),
      dataTestId: 'user-activity-tab',
      tabContent: (
        <ProfileActivityFeed
          pathname={pathname}
          userId={params?.userId || user?.id || ''}
          open={open}
          openModal={openModal}
          closeModal={closeModal}
          data={data}
        />
      ),
    },
    {
      id: 3,
      tabLabel: (isActive: boolean) => (
        <div className={tabStyles(isActive)}>Recognitions</div>
      ),
      title: 'Recognitions',
      dataTestId: 'user-recognitions-tab',
      tabContent: (
        <div className="pt-2">
          <NoDataCard user={data?.fullName} dataType="recognition" />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col space-y-10 w-full">
      {userDetail?.isLoading ? (
        <UserDetailSkeleton />
      ) : (
        <ProfileCoverSection userDetails={data} />
      )}

      <div className="mb-32 flex w-full">
        <div className="w-1/4 pr-10">
          {userDetail?.isLoading ? (
            <ContactSkeleton />
          ) : (
            <ContactWidget
              contactCardData={data}
              canEdit={pathname === '/profile'}
            />
          )}
        </div>
        <div className="w-1/2 px-3">
          <Tabs
            tabs={tabs}
            className="w-fit flex justify-start bg-neutral-50 rounded-8xl border-solid border-1 border-neutral-200"
            tabSwitcherClassName="!p-1"
            showUnderline={false}
            itemSpacing={0}
            tabContentClassName="mt-5"
          />
        </div>
        <div className="w-1/4 pl-12"></div>
      </div>
    </div>
  );
};

export default UserDetail;
