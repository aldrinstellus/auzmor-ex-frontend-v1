import React, { useState } from 'react';
import ContactWidget from 'components/ContactWidget';
import {
  UserEditType,
  UserRole,
  useCurrentUser,
  useSingleUser,
} from 'queries/users';
import ProfileInfo from 'components/ProfileInfo';
import Spinner from 'components/Spinner';
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

export interface IUpdateProfileImage {
  profileImage: File;
  coverImage: File;
}

interface IUserDetailProps {}

const UserDetail: React.FC<IUserDetailProps> = () => {
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
        'font-bold px-4 cursor-pointer py-1': true,
      },
      {
        'bg-primary-500 rounded-6xl text-white': active,
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
      tabContent: <NoDataCard user={data?.fullName} />,
    },
  ];

  return (
    <div className="flex flex-col space-y-9 w-full">
      {userDetail?.isLoading ? (
        <UserDetailSkeleton />
      ) : (
        <ProfileCoverSection userDetails={data} />
      )}

      <div className="mb-32 flex w-full">
        <div className="w-1/4 pr-12">
          {userDetail?.isLoading ? (
            <ContactSkeleton />
          ) : (
            <ContactWidget
              contactCardData={data}
              canEdit={pathname === '/profile'}
            />
          )}
        </div>
        <div className="w-1/2">
          <Tabs
            tabs={tabs}
            className="w-fit flex justify-start bg-neutral-50 rounded-6xl border-solid border-1 border-neutral-200"
            tabSwitcherClassName="!p-1"
            showUnderline={false}
            itemSpacing={1}
            tabContentClassName="mt-8"
          />
        </div>
        <div className="w-1/4 pl-12"></div>
      </div>
    </div>
  );
};

export default UserDetail;
