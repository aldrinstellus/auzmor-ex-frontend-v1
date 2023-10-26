import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import { AudienceFlow } from './Audience';
import { FC } from 'react';

interface IFooterProps {
  isValid: boolean;
  handleBackButtonClick: () => void;
  audienceFlow: AudienceFlow;
}

const Footer: FC<IFooterProps> = ({
  isValid,
  handleBackButtonClick,
  audienceFlow,
}) => {
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          onClick={handleBackButtonClick}
          dataTestId="add-audience-back"
        />
        {audienceFlow === AudienceFlow.EntitySelect && (
          <Button
            label={'Save changes'}
            type={Type.Submit}
            dataTestId="add-audience-save"
            disabled={!isValid}
            className="ml-3"
          />
        )}
        {audienceFlow !== AudienceFlow.EntitySelect && (
          <Button
            label={'Next'}
            type={Type.Submit}
            dataTestId="add-audience-next"
            disabled={!isValid}
            className="ml-3"
          />
        )}
      </div>
    </div>
  );
};

export default Footer;
