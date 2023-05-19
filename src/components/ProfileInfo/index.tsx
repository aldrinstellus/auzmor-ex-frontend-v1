import React from 'react';
import AboutMe from './components/AboutMe';
import ProfessionalDetails from './components/ProfessionalDetails';
import PersonalDetails from './components/PersonalDetails';

export interface IProfileInfoProps {
  profileDetails: any;
  canEdit?: boolean;
}

const ProfileInfo: React.FC<IProfileInfoProps> = ({
  profileDetails,
  canEdit,
}) => {
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
