import React from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Variant } from 'components/Button';

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
          <div>Contact Info</div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 truncate">
              <div>
                <Icon name="email" />
              </div>
              <div>{contactCardData?.workEmail}</div>
            </div>
            <div>
              <Icon
                name="copyIcon"
                onClick={() => {
                  navigator.clipboard.writeText(contactCardData?.workEmail);
                }}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex space-x-2 truncate">
              <div>
                <Icon name="email" />
              </div>
              <div>{contactCardData?.contact || '9999999999'}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            label="Organization Chart"
            variant={Variant.Secondary}
            className="px-16"
          />
        </div>
      </Card>
    </div>
  );
};

export default ContactWidget;
