import React, { useState } from 'react';
import ContactCard from 'components/ContactCard';
import ProfileCoverSection from 'components/ProfileCoverSection';
import { useSingleUser } from 'queries/users';
import ProfileInfo from 'components/ProfileInfo';
import Spinner from 'components/Spinner';
import { useLocation, useParams } from 'react-router-dom';
import TabSwitcher from 'pages/Users/components/TabSwitch';
import ProfileActivityFeed from './ProfileActivityFeed';
interface IUserDetailProps {}

const UserDetail: React.FC<IUserDetailProps> = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const params = useParams(); // get from users list
  const { state, pathname } = useLocation(); // get from user/me

  const {
    data: userProfileDetails,
    isError,
    isLoading,
  } = useSingleUser(params?.userId || state?.userId || '');
  const profileData = userProfileDetails?.data?.result?.data;

  if (isLoading) {
    return <Spinner color="#000" />;
  }

  if (isError) {
    return <div></div>;
  }

  const tabs = [
    {
      id: 1,
      title: 'Profile',
      content: <ProfileInfo profileDetails={profileData} />,
    },
    {
      id: 2,
      title: 'Activity',
      content: <ProfileActivityFeed />,
    },
    { id: 3, title: 'Recognitions', content: <div>Content for Tab 3</div> },
  ];

  return (
    <div className="flex flex-col space-y-9 w-full">
      <ProfileCoverSection
        profileCoverData={profileData}
        showModal={showModal}
        setShowModal={setShowModal}
        canEdit={pathname === '/profile'}
      />
      <div className="mb-32 space-x-8 flex">
        <ContactCard
          email={profileData?.workEmail}
          contact={profileData?.workEmail}
        />
        <div className="max-w-2xl w-[638px]">
          <TabSwitcher tabs={tabs} />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default UserDetail;
