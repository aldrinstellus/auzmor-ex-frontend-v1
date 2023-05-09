import Card from 'components/Card';
import Divider from 'components/Divider';
import React from 'react';

export interface IProfessionalDetailsProps {
  dateOfJoin: string;
  timezone: string;
}

const ProfessionalDetails: React.FC<IProfessionalDetailsProps> = ({
  dateOfJoin,
  timezone,
}) => {
  const joiningDate = new Date(dateOfJoin);
  return (
    <Card className="mb-8">
      <div className="text-neutral-900 font-bold text-base px-6 pt-6 pb-4">
        Professional Details
      </div>
      <Divider />
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="text-neutral-500 text-sm font-bold">
            Date of Joining
          </div>
          <div className="flex space-x-3">
            <div>i</div>
            <div className="text-neutral-900 text-base font-medium ">
              Joined on {joiningDate.toDateString()}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-neutral-500 text-sm font-bold">Timezone</div>
          <div className="flex space-x-3">
            <div>i</div>
            <div className="text-neutral-900 text-base font-medium ">
              Joined on {timezone?.toString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfessionalDetails;
