import Card from 'components/Card';
import Divider from 'components/Divider';
import React, { useMemo } from 'react';
import Time from 'images/time.svg';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import Icon from 'components/Icon';
import moment from 'moment';
import 'moment-timezone';

export interface IProfessionalDetailsProps {
  professionalDetails: any;
  canEdit?: boolean;
}

const ProfessionalDetails: React.FC<IProfessionalDetailsProps> = ({
  professionalDetails,
  canEdit,
}) => {
  const [isHovered, eventHandlers] = useHover();

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8 px-6': true }, { 'shadow-xl': isHovered }),
    [isHovered],
  );

  const timestamp = professionalDetails?.createdAt;

  const formattedTime = moment
    .utc(timestamp)
    .tz('America/New_York')
    .format('(UTC-05:00) z');

  const formattedDate = moment(timestamp).format('Do MMMM YYYY');

  return (
    <div {...eventHandlers}>
      <Card className={onHoverStyles}>
        <div className="flex justify-between items-center">
          <div className="text-neutral-900 font-bold text-base pt-6 pb-4">
            Professional Details
          </div>
          {canEdit && isHovered && (
            <div>
              <Icon name="edit" />
            </div>
          )}
        </div>
        <Divider />
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <div className="text-neutral-500 text-sm font-bold">
              Date of Joining
            </div>
            <div className="flex space-x-3">
              <img src={Time} alt="" />
              <div className="text-neutral-900 text-base font-medium ">
                Joined on {formattedDate}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-neutral-500 text-sm font-bold">Timezone</div>
            <div className="flex space-x-3">
              <img src={Time} alt="" />
              <div className="text-neutral-900 text-base font-medium ">
                {formattedTime}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfessionalDetails;
