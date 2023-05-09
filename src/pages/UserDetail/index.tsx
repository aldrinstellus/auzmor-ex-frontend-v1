import ProfileInfo from 'components/ProfileInfo';
import TabSwitcher from 'pages/Users/components/TabSwitch';
import React from 'react';
import { useParams } from 'react-router-dom';
interface IUserDetailProps {}

const tabs = [
  {
    id: 1,
    label: 'Profile',
  },
  {
    id: 2,
    label: 'Activity',
  },
  {
    id: 3,
    label: 'Recognitions',
  },
];

const UserDetail: React.FC<IUserDetailProps> = () => {
  const params = useParams();
  return (
    <div className="mb-32 space-x-8 flex">
      {/* Contact Widget  */}
      <div className="max-w-2xl w-[638px]">
        {/* change to responsiveness */}
        <TabSwitcher tabs={tabs} />
        <div>
          <ProfileInfo />
        </div>
      </div>
      {/* Other Widget */}
    </div>
  );
};

export default UserDetail;
