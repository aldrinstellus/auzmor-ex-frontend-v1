import Card from 'components/Card';
import Divider from 'components/Divider';
import React from 'react';

export interface IPersonalDetailsProps {
  dateOfBirth: string;
  gender: string;
  address: string;
  maritalStatus: string;
  skills: string[];
}

const PersonalDetails: React.FC<IPersonalDetailsProps> = ({
  dateOfBirth,
  gender,
  address,
  maritalStatus,
  skills,
}) => {
  return (
    <Card>
      <div className="text-neutral-900 font-bold text-base px-6 pt-6 pb-4">
        Personal Details
      </div>
      <Divider />
      <div className="p-6">
        <div className="pb-4 space-y-3">
          <div className="flex space-x-3">
            <div>i</div>
            <div className="text-neutral-900 text-base font-medium">
              Born on {dateOfBirth}
            </div>
          </div>
          <div className="flex space-x-3">
            <div>i</div>
            <div className="text-neutral-900 text-base font-medium">
              {gender}
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="text-neutral-500 text-sm font-bold">
            Permanent Address
          </div>
          <div className="flex space-x-3">
            <div>i</div>
            <div className="text-neutral-900 text-base font-medium">
              {address}
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="text-neutral-500 text-sm font-bold">
            Marital Status
          </div>
          <div className="flex space-x-3">
            <div>i</div>
            <div className="text-neutral-900 text-base font-medium">
              {maritalStatus}
            </div>
          </div>
        </div>
        <div>
          <div className="text-neutral-500 text-sm font-bold">Skills</div>
          <div className="text-neutral-900 text-base font-medium">
            {skills.map((skill, index) => (
              <ul key={index}>
                <li>{skill}</li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PersonalDetails;
