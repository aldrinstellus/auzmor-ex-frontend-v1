import Button from 'components/Button';
import Card from 'components/Card';
import React, { ReactElement } from 'react';

export type SSOCardProps = {
  logo: string;
  description: string;
  buttonText?: string;
};
const SSOCard: React.FC<SSOCardProps> = ({
  logo,
  description,
  buttonText = 'Configure',
}): ReactElement => {
  return (
    <Card className="w-80 h-60">
      <div className="flex flex-col w-full h-full items-start justify-between ml-6">
        <div className="mt-7">
          <img src={logo} className="h-6" />
          <div className="mt-5 w-64 h-20 text-neutral-500 text-sm font-normal">
            <p>{description}</p>
          </div>
        </div>
        <Button className="mb-6 max-w-fit" label={buttonText}></Button>
      </div>
    </Card>
  );
};

export default SSOCard;
