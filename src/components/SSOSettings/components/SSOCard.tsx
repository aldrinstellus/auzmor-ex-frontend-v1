import Button from 'components/Button';
import Card from 'components/Card';
import React, { ReactElement } from 'react';
import SSOCardMenu from './SSOCardMenu';
import { IdentityProvider } from 'queries/organization';
import { ISSOSetting } from '..';

export type SSOCardProps = {
  logo: string;
  description: string;
  id: string;
  buttonText?: string;
  onClick: any;
  idp: IdentityProvider;
  active: boolean;
  activeSSO?: ISSOSetting;
  setShowErrorBanner: (show: boolean) => void;
  dataTestId?: string;
};

const SSOCard: React.FC<SSOCardProps> = ({
  logo,
  description,
  id,
  buttonText = 'Configure',
  onClick,
  idp,
  active = false,
  activeSSO,
  setShowErrorBanner,
  dataTestId = '',
}): ReactElement => {
  const customOnClick = () => {
    if (activeSSO && activeSSO?.idp !== idp) {
      setShowErrorBanner(true);
    } else onClick(id);
  };

  return (
    <Card className="w-96 h-60 hover:shadow-2xl">
      <div className="flex flex-col h-full items-start justify-between ml-6">
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <img src={logo} className="h-6" />
            <div
              className={`flex items-center gap-x-3 flex-end ${
                active ? 'visible' : 'invisible'
              }`}
            >
              <span className="font-medium text-sm text-green-500 bg-green-100 border-1 border-green-500 rounded-17xl px-2 py-1">
                Activated
              </span>
              <SSOCardMenu idp={idp} name={id} onClick={customOnClick} />
            </div>
          </div>
          <div className="mt-5 w-80 h-24 text-neutral-500 text-sm font-normal">
            <p>{description}</p>
          </div>
        </div>
        <Button
          onClick={customOnClick}
          className={`mb-6 max-w-fit ${active ? 'invisible' : 'visible'}`}
          label={buttonText}
          dataTestId={dataTestId}
        ></Button>
      </div>
    </Card>
  );
};

export default SSOCard;
