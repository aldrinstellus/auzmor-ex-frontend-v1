import React, { useRef, useState } from 'react';
import ContactWidget from 'components/ContactWidget';
import { useCurrentUser, useSingleUser } from 'queries/users';
import ProfileInfo from 'components/ProfileInfo';
import Spinner from 'components/Spinner';
import { useLocation, useParams } from 'react-router-dom';
import TabSwitcher from 'pages/Users/components/TabSwitch';
import ProfileActivityFeed from './components/ProfileActivityFeed';
import useAuth from 'hooks/useAuth';
import NoDataCard from './components/NoDataCard';
import ProfileCoverSection from './components/ProfileCoverSection';

export interface IUpdateProfileImage {
  profileImage: File;
  coverImage: File;
}

interface IUserDetailProps {}

const UserDetail: React.FC<IUserDetailProps> = () => {
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);
  const [showPictureCropModal, setShowPictureCropModal] =
    useState<boolean>(false);
  const [showFeedModal, setShowFeedModal] = useState<boolean>(false);
  const { user } = useAuth();

  const params = useParams();
  const { pathname } = useLocation();

  let userData;

  if (pathname === '/profile') {
    userData = useCurrentUser();
  } else {
    userData = useSingleUser(params?.userId || '');
  }

  const profileData = userData?.data?.data?.result?.data;

  if (userData?.isLoading) {
    return <Spinner color="#000" />;
  }

  if (userData?.isError) {
    return <div></div>;
  }

  const tabs = [
    {
      id: 1,
      title: 'Profile',
      dataTestId: 'user-profile-tab',
      content: (
        <ProfileInfo
          profileDetails={profileData}
          canEdit={pathname === '/profile'}
        />
      ),
    },
    {
      id: 2,
      title: 'Activity',
      dataTestId: 'user-actiity-tab',
      content: (
        <ProfileActivityFeed
          pathname={pathname}
          userId={params?.userId || user?.id || ''}
          showFeedModal={showFeedModal}
          setShowFeedModal={setShowFeedModal}
          data={profileData}
        />
      ),
    },
    {
      id: 3,
      title: 'Recognitions',
      dataTestId: 'user-recognitions-tab',
      content: (
        <NoDataCard user={userData?.data?.data?.result?.data?.fullName} />
      ),
    },
  ];

  return (
    <div className="flex flex-col space-y-9 w-full">
      <ProfileCoverSection
        profileCoverData={profileData}
        showEditProfileModal={showEditProfileModal}
        setShowEditProfileModal={setShowEditProfileModal}
        showPictureCropModal={showPictureCropModal}
        setShowPictureCropModal={setShowPictureCropModal}
        canEdit={pathname === '/profile'}
      />
      <div className="mb-32 space-x-8 flex w-full">
        <ContactWidget
          contactCardData={profileData}
          canEdit={pathname === '/profile'}
        />
        <div className="w-1/2">
          <TabSwitcher tabs={tabs} />
        </div>
        <div className="w-1/4"></div>
      </div>
    </div>
  );
};

export default UserDetail;
