import React, { useEffect } from 'react';
import AboutMe from './components/AboutMe';
import AboutMeSkeleton from './components/Skeletons/AboutMe';
import ProfessionalDetails from './components/ProfessionalDetails';
import ProfessionalDetailsSkeleton from './components/Skeletons/ProfessionalDetails';
import PersonalDetails from './components/PersonalDetails';
import PersonalDetailsSkeleton from './components/Skeletons/PersonalDetails';

import useScrollTop from 'hooks/useScrollTop';
import { UserEditType } from 'queries/users';

export interface IProfileInfoProps {
  profileDetails: any;
  editSection?: string;
  isLoading?: boolean;
  editType?: UserEditType;
  setSearchParams?: any;
  searchParams?: any;
}

const ProfileInfo: React.FC<IProfileInfoProps> = ({
  profileDetails,
  isLoading,
  editSection,
  editType,
  setSearchParams,
  searchParams,
}) => {
  useScrollTop();
  return (
    <>
      {isLoading ? (
        <AboutMeSkeleton />
      ) : (
        <AboutMe
          aboutMeData={profileDetails}
          canEdit={editType === UserEditType.COMPLETE}
          editSection={editSection}
          setSearchParams={setSearchParams}
          searchParams={searchParams}
        />
      )}
      <div className="mt-6">
        {isLoading ? (
          <ProfessionalDetailsSkeleton />
        ) : (
          <ProfessionalDetails
            professionalDetails={profileDetails}
            canEdit={editType !== UserEditType.NONE}
            editSection={editSection}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
          />
        )}
      </div>

      <div className="-mt-1">
        {isLoading ? (
          <PersonalDetailsSkeleton />
        ) : (
          <PersonalDetails
            personalDetails={profileDetails}
            canEdit={editType === UserEditType.COMPLETE}
          />
        )}
      </div>
    </>
  );
};

export default ProfileInfo;
