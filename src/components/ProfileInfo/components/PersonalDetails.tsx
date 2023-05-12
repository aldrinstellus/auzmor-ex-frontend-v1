import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { useMemo } from 'react';
import clsx from 'clsx';
import useHover from 'hooks/useHover';
import Icon from 'components/Icon';
import moment from 'moment';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';

export interface IPersonalDetailsProps {
  personalDetails: any;
  skills: string[];
  canEdit?: boolean;
}

const PersonalDetails: React.FC<IPersonalDetailsProps> = ({
  personalDetails,
  skills,
  canEdit,
}) => {
  const [isHovered, eventHandlers] = useHover();

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8 px-6': true }, { 'shadow-xl': isHovered }),
    [isHovered],
  );

  const timestamp = personalDetails?.createdAt;

  const formattedDate = moment(timestamp).format('Do MMMM');

  return (
    <>
      {canEdit ? (
        <div {...eventHandlers}>
          <Card className={onHoverStyles}>
            <div className="flex justify-between items-center">
              <div className="text-neutral-900 font-bold text-base pt-6 pb-4">
                Personal Details
              </div>
              {isHovered && (
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="edit" size={16} />
                </IconWrapper>
              )}
            </div>
            <Divider />
            <div className="py-6">
              <div className="pb-4 space-y-3">
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    <Icon name="cake" size={16} />
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
                    Born on {formattedDate}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    <Icon name="femaleIcon" size={16} />
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
                    {personalDetails?.personal?.gender || 'Female'}
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-neutral-500 text-sm font-bold">
                  Permanent Address
                </div>
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    <Icon name="location" size={16} />
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
                    {personalDetails?.personal?.permanentAddress ||
                      '4517 Washington Ave. Manchester, Kentucky 39495'}
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-neutral-500 text-sm font-bold">
                  Marital Status
                </div>
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square} className="cursor-pointer">
                    <Icon name="marriedIcon" size={16} />
                  </IconWrapper>
                  <div className="text-neutral-900 text-base font-medium">
                    {personalDetails?.personal?.maritalStatus || 'Married'}
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
      ) : (
        <Card className={onHoverStyles}>
          <div className="flex justify-between items-center">
            <div className="text-neutral-900 font-bold text-base pt-6 pb-4">
              Personal Details
            </div>
          </div>
          <Divider />
          <div className="py-6">
            <div className="pb-4 space-y-3">
              <div className="flex space-x-3">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="cake" size={16} />
                </IconWrapper>
                <div className="text-neutral-900 text-base font-medium">
                  Born on {formattedDate}
                </div>
              </div>
              <div className="flex space-x-3">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="femaleIcon" size={16} />
                </IconWrapper>
                <div className="text-neutral-900 text-base font-medium">
                  {personalDetails?.personal?.gender || 'Female'}
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-neutral-500 text-sm font-bold">
                Permanent Address
              </div>
              <div className="flex space-x-3">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="location" size={16} />
                </IconWrapper>
                <div className="text-neutral-900 text-base font-medium">
                  {personalDetails?.personal?.permanentAddress ||
                    '4517 Washington Ave. Manchester, Kentucky 39495'}
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-neutral-500 text-sm font-bold">
                Marital Status
              </div>
              <div className="flex space-x-3">
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon name="marriedIcon" size={16} />
                </IconWrapper>
                <div className="text-neutral-900 text-base font-medium">
                  {personalDetails?.personal?.maritalStatus || 'Married'}
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
      )}
    </>
  );
};

export default PersonalDetails;
