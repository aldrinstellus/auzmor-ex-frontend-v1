import Button, { Variant as ButtonVariant } from 'components/Button';
import Icon from 'components/Icon';
import React, { ReactNode } from 'react';
import { twConfig } from 'utils/misc';

export interface ISuccessToastProps {
  content?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
  dataTestId?: string;
  actionClassName?: string;
}

const SuccessToast: React.FC<ISuccessToastProps> = ({
  content,
  actionLabel,
  action,
  dataTestId,
  actionClassName,
}) => {
  return (
    <div className="flex justify-between items-center" data-testid={dataTestId}>
      <div className="flex items-center">
        <div>
          <Icon
            className="p-1.5 bg-primary-100 rounded-7xl mr-2.5"
            name="tickCircleOutline"
            color="text-primary-500"
            size={32}
          />
        </div>
        <span className="text-white text-sm min-w-[256px]">{content}</span>
      </div>
      {actionLabel && (
        <div
          className={`ml-4 pr-1 text-sm font-bold ${actionClassName}`}
          onClick={action}
        >
          {actionLabel}
        </div>
      )}
    </div>
  );
};

export default SuccessToast;
