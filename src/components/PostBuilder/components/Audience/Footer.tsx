import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import React from 'react';
import { AudienceFlow } from '.';

interface IFooterProps {
  isValid: boolean;
  handleBackButtonClick: () => void;
  showSaveChangesBtn: boolean;
  audienceFlow: AudienceFlow;
}

const Footer: React.FC<IFooterProps> = ({
  isValid,
  handleBackButtonClick,
  showSaveChangesBtn,
  audienceFlow,
}) => {
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          className="mr-3"
          onClick={handleBackButtonClick}
          dataTestId="scheduledpost-back"
        />
        {showSaveChangesBtn && audienceFlow === AudienceFlow.EntitySelect && (
          <Button
            label={'Save changes'}
            type={Type.Submit}
            dataTestId="scheduledpost-next"
            disabled={!isValid}
          />
        )}
        {audienceFlow !== AudienceFlow.EntitySelect && (
          <Button
            label={'Next'}
            type={Type.Submit}
            dataTestId="scheduledpost-next"
            disabled={!isValid}
          />
        )}
      </div>
    </div>
  );
};

export default Footer;
