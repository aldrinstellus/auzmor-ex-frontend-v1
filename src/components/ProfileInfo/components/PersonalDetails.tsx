import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';

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
  const [isHovered, eventHandlers] = useHover();

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8 px-6': true }, { 'shadow-xl': isHovered }),
    [isHovered],
  );

  return (
    <div {...eventHandlers}>
      <Card className={onHoverStyles}>
        <div className="flex justify-between items-center">
          <div className="text-neutral-900 font-bold text-base pt-6 pb-4">
            Personal Details
          </div>
          {isHovered && (
            <div>
              <Icon name="edit" />
            </div>
          )}
        </div>
        <Divider />
        <div className="py-6">
          <div className="pb-4 space-y-3">
            <div className="flex space-x-3">
              <Icon name="cake" />
              <div className="text-neutral-900 text-base font-medium">
                Born on {dateOfBirth}
              </div>
            </div>
            <div className="flex space-x-3">
              <Icon name="femaleicon" />
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
              <Icon name="location" />
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
              <Icon name="marriedIcon" />
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
    </div>
  );
};

export default PersonalDetails;
