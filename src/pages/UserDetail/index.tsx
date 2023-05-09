import ProfileInfo from 'components/ProfileInfo';
import Spinner from 'components/Spinner';
import { useSingleUser } from 'queries/users';
// import TabSwitcher from 'pages/Users/components/TabSwitch';
import React from 'react';
import { useLoaderData, useLocation, useParams } from 'react-router-dom';
interface IUserDetailProps {}

// const tabs = [
//   {
//     id: 1,
//     label: 'Profile',
//   },
//   {
//     id: 2,
//     label: 'Activity',
//   },
//   {
//     id: 3,
//     label: 'Recognitions',
//   },
// ];

const UserDetail: React.FC<IUserDetailProps> = () => {
  const params = useParams(); // get from users list
  const { state } = useLocation(); // get from user/me
  const {
    data: userProfileDetails,
    isError,
    isLoading,
  } = useSingleUser(params?.userId || state?.userId || '');

  if (isLoading) {
    return <Spinner color="#000" />;
  }

  if (isError) {
    return <div></div>;
  }

  const profileData = userProfileDetails?.data?.result?.data;

  return (
    <div className="mb-32 space-x-8 flex">
      {/* Contact Widget  */}
      <div className="max-w-2xl w-[638px]">
        {/* change to responsiveness */}
        {/* <TabSwitcher tabs={tabs} /> */}
        <ProfileInfo profileDetails={profileData} />
      </div>
      {/* Other Widget */}
    </div>
  );
};

export default UserDetail;
