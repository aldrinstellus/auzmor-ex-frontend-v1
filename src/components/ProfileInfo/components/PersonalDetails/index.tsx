import React, { memo, useMemo } from 'react';
import Card from 'components/Card';
import clsx from 'clsx';
import useHover from 'hooks/useHover';
import Header from '../Header';
import { OptionType } from 'components/UserOnboard/components/SelectTimeZone';
import DateOfBirthRow from './DateOfBirthRow';
import GenderRow from './GenderRow';
import MarriedRow from './MarriedRow';
import SkillsRow from './SkillsRow';

interface IPersonalDetails {
  birthDate: Date | string;
  gender: OptionType;
  permanentLocation: string;
  maritalStatus: OptionType;
  skills: string[];
}
interface IPersonalDetailsForm {
  personal: IPersonalDetails;
  skills: string;
}

export interface ISkillsOption {
  id: string;
  value: string;
}

type IPersonalDetailsProps = {
  personalDetails: any;
  canEdit?: boolean;
};

const PersonalDetails: React.FC<IPersonalDetailsProps> = ({
  personalDetails,
  canEdit,
}) => {
  const onHoverStyles = clsx({ 'mb-8': true });

  return (
    <div>
      <Header title="Personal Details" dataTestId="personal-details" />
      <Card className={onHoverStyles} shadowOnHover={canEdit}>
        <div className="px-4">
          <DateOfBirthRow data={personalDetails} />
          <GenderRow data={personalDetails} />
          <MarriedRow data={personalDetails} />
          <SkillsRow data={personalDetails} />
        </div>
      </Card>
    </div>
  );
};

export default memo(PersonalDetails);
