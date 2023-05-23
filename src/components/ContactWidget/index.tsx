import React from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Variant } from 'components/Button';
import IconWrapper from 'components/Icon/components/IconWrapper';
import { Size } from 'components/Button';

export interface IContactCardProps {
  contactCardData: any;
  className?: string;
}

const ContactWidget: React.FC<IContactCardProps> = ({
  contactCardData,
  className,
}) => {
  return (
    <div className={className}>
      <Card className="p-6 rounded-9xl space-y-6">
        <div className="flex justify-between items-center">
          <div className="font-bold">Contact Info</div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 truncate items-center">
              <IconWrapper>
                <Icon name="email" stroke="#737373" size={15} />
              </IconWrapper>
              <div className="text-xs font-normal text-neutral-900">
                {contactCardData?.workEmail}
              </div>
            </div>
            <div>
              <Icon
                name="copyIcon"
                size={16}
                onClick={() => {
                  navigator.clipboard.writeText(contactCardData?.workEmail);
                }}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-2 truncate items-center">
              <IconWrapper>
                <Icon name="call" stroke="#737373" size={15} />
              </IconWrapper>{' '}
              <div className="text-xs font-normal text-neutral-900">
                {contactCardData?.contact || 'N/A'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            label="View Organization Chart"
            variant={Variant.Secondary}
            className="space-x-1 font-bold"
            leftIcon="connectionFolder"
            size={Size.Small}
          />
        </div>
      </Card>
    </div>
  );
};

export default ContactWidget;
