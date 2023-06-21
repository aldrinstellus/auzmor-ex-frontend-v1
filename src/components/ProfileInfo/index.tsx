import React, { useEffect } from 'react';
import AboutMe from './components/AboutMe';
import AboutMeSkeleton from './components/Skeletons/AboutMe';
import ProfessionalDetails from './components/ProfessionalDetails';
import ProfessionalDetailsSkeleton from './components/Skeletons/ProfessionalDetails';
import PersonalDetails from './components/PersonalDetails';
import PersonalDetailsSkeleton from './components/Skeletons/PersonalDetails';

import useScrollTop from 'hooks/useScrollTop';

export interface IProfileInfoProps {
  profileDetails: any;
  canEdit?: boolean;
  isLoading?: boolean;
}

const ProfileInfo: React.FC<IProfileInfoProps> = ({
  profileDetails,
  canEdit,
  isLoading,
}) => {
  useScrollTop();
  return (
    <>
      {isLoading ? (
        <AboutMeSkeleton />
      ) : (
        <AboutMe aboutMeData={profileDetails} canEdit={canEdit} />
      )}
      {isLoading ? (
        <ProfessionalDetailsSkeleton />
      ) : (
        <ProfessionalDetails
          professionalDetails={profileDetails}
          canEdit={canEdit}
        />
      )}
      {isLoading ? (
        <PersonalDetailsSkeleton />
      ) : (
        <PersonalDetails personalDetails={profileDetails} canEdit={canEdit} />
      )}
    </>
  );
};

export default ProfileInfo;
