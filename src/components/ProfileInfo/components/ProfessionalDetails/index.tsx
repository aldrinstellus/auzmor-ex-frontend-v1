import React, { useEffect, useMemo, useState } from 'react';
import Card from 'components/Card';
import clsx from 'clsx';
import 'moment-timezone';
import Header from '../Header';
import TimezoneRow from './TimezoneRow';
import DateOfJoiningRow from './DateOfJoiningRow';
import EmployeeIdRow from './EmployeeIdRow';

export interface IProfessionalDetailsProps {
  professionalDetails: any;
  canEdit?: boolean;
  editSection?: string;
  setSearchParams?: any;
  searchParams?: any;
}

const ProfessionalDetails: React.FC<IProfessionalDetailsProps> = ({
  professionalDetails,
  canEdit,
  editSection,
  setSearchParams,
  searchParams,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditable && searchParams.has('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams);
    }
  }, [isEditable]);

  const onHoverStyles = clsx({ 'mb-8': true });

  return (
    <div>
      <Header title="Professional Details" dataTestId="professional-details" />
      <Card className={onHoverStyles} shadowOnHover={canEdit}>
        <div className="px-4">
          <EmployeeIdRow data={professionalDetails} />
          <DateOfJoiningRow data={professionalDetails} />
          <TimezoneRow data={professionalDetails} />
        </div>
      </Card>
    </div>
  );
};

export default ProfessionalDetails;
