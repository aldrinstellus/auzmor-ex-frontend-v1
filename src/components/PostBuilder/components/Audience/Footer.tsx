import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import { FC, useCallback } from 'react';
import { AudienceFlow } from '.';

interface IFooterProps {
  isValid: boolean;
  handleBackButtonClick: () => void;
  audienceFlow: AudienceFlow;
  dataTestId?: string;
}

const Footer: FC<IFooterProps> = ({
  isValid,
  handleBackButtonClick,
  audienceFlow,
  dataTestId,
}) => {
  const getBackBtnTestIds = useCallback(() => {
    switch (audienceFlow) {
      case AudienceFlow.ChannelSelect:
        return 'select-channel-back';
      case AudienceFlow.TeamSelect:
        return 'select-team-back';
      case AudienceFlow.UserSelect:
        return 'select-user-back';
      default:
        return `${dataTestId}-back`;
    }
  }, [audienceFlow]);
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          onClick={handleBackButtonClick}
          dataTestId={getBackBtnTestIds()}
        />
        {audienceFlow === AudienceFlow.EntitySelect && (
          <Button
            label={'Save changes'}
            type={Type.Submit}
            dataTestId="audience-selection-save-changes"
            disabled={!isValid}
            className="ml-3"
          />
        )}
        {audienceFlow !== AudienceFlow.EntitySelect && (
          <Button
            label={'Next'}
            type={Type.Submit}
            dataTestId="audience-selection-next"
            disabled={!isValid}
            className="ml-3"
          />
        )}
      </div>
    </div>
  );
};

export default Footer;
