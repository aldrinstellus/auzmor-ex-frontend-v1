import React from 'react';
import AboutMe from './components/AboutMe';
import ProfessionalDetails from './components/ProfessionalDetails';
import PersonalDetails from './components/PersonalDetails';

export interface IProfileInfoProps {}

const ProfileInfo: React.FC<IProfileInfoProps> = () => {
  return (
    <div className="">
      <AboutMe />
      <ProfessionalDetails />
      <PersonalDetails />
    </div>
  );
};

export default ProfileInfo;
