import React from 'react';
import AboutMe from './components/AboutMe';
import ProfessionalDetails from './components/ProfessionalDetails';
import PersonalDetails from './components/PersonalDetails';

export interface IProfileInfoProps {
  profileDetails: any;
}

const ProfileInfo: React.FC<IProfileInfoProps> = ({ profileDetails }) => {
  return (
    <>
      <AboutMe aboutMe={profileDetails?.fullName} />
      <ProfessionalDetails
        dateOfJoin={profileDetails?.createdAt}
        timezone={profileDetails?.createdAt}
      />
      <PersonalDetails
        dateOfBirth={profileDetails?.createdAt}
        gender="s'he"
        address="4517 Washington Ave. Manchester, Kentucky 39495"
        maritalStatus="Married"
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
