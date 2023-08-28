import React, { useEffect, useMemo, useState } from 'react';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import 'moment-timezone';
import Header from '../Header';
import useRole from 'hooks/useRole';
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
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { isAdmin } = useRole();

  useEffect(() => {
    if (!isEditable && searchParams.has('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams);
    }
  }, [isEditable]);

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  return (
    <div {...eventHandlers}>
      <Header title="Professional Details" dataTestId="professional-details" />
      <Card className={onHoverStyles}>
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
