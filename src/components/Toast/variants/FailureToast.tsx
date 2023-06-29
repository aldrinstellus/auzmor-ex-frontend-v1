import Button, { Variant as ButtonVariant } from 'components/Button';
import Icon from 'components/Icon';
import React, { ReactNode } from 'react';
import { twConfig } from 'utils/misc';

export interface IFailureToastProps {
  content?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
  dataTestId?: string;
}

const FailureToast: React.FC<IFailureToastProps> = ({
  content,
  actionLabel,
  action,
  dataTestId,
}) => {
  return (
    <div className="flex justify-between items-center" data-testid={dataTestId}>
      <div className="flex items-center">
        <div>
          <Icon
            className="p-1.5 bg-red-100 rounded-7xl mr-2.5"
            name="infoCircleOutline"
            stroke={twConfig.theme.colors.red['500']}
            size={32}
          />
        </div>
        <span className="text-red-500 text-sm w-56">{content}</span>
      </div>
      {actionLabel && (
        <div className="flex">
          <Button
            className="text-red-500 ml-4 pr-1"
            variant={ButtonVariant.Tertiary}
            label={actionLabel}
            onClick={action}
          />
        </div>
      )}
    </div>
  );
};

export default FailureToast;
