import React, { useEffect } from 'react';
import AboutMe from './components/AboutMe';
import ProfessionalDetails from './components/ProfessionalDetails';
import PersonalDetails from './components/PersonalDetails';
import useScrollTop from 'hooks/useScrollTop';

export interface IProfileInfoProps {
  profileDetails: any;
  canEdit?: boolean;
}

const ProfileInfo: React.FC<IProfileInfoProps> = ({
  profileDetails,
  canEdit,
}) => {
  useScrollTop();

  return (
    <>
      <AboutMe aboutMeData={profileDetails} canEdit={canEdit} />
      <ProfessionalDetails
        professionalDetails={profileDetails}
        canEdit={canEdit}
      />
      <PersonalDetails personalDetails={profileDetails} canEdit={canEdit} />
    </>
  );
};

export default ProfileInfo;
