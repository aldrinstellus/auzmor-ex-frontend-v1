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
      <AboutMe aboutMe={profileDetails} canEdit={canEdit} />
      <ProfessionalDetails
        professionalDetails={profileDetails}
        canEdit={canEdit}
      />
      <PersonalDetails
        personalDetails={profileDetails}
        canEdit={canEdit}
        skills={[
          'Techinal Analysis',
          'Fundamental Analysis',
          'Blockchain',
          'Painting',
        ]}
      />
    </>
  );
};

export default ProfileInfo;
