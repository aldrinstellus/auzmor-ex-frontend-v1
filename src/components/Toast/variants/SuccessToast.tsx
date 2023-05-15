import { JSXElement } from '@babel/types';
import Button, { Variant as ButtonVariant } from 'components/Button';
import Icon from 'components/Icon';
import React, { ReactNode } from 'react';
import { twConfig } from 'utils/misc';

export interface ISuccessToastProps {
  content?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
}

const SuccessToast: React.FC<ISuccessToastProps> = ({
  content,
  actionLabel,
  action,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <div>
          <Icon
            className="p-1.5 bg-primary-100 rounded-7xl mr-2.5"
            name="tickCircleOutline"
            stroke={twConfig.theme.colors.primary['500']}
            size={32}
          />
        </div>
        <span className="text-primary-500 text-sm w-56">{content}</span>
      </div>
      {actionLabel && (
        <div className="flex">
          <Button
            className="text-primary-500 ml-4 pr-1"
            variant={ButtonVariant.Tertiary}
            label={actionLabel}
            onClick={action}
          />
        </div>
      )}
    </div>
  );
};

export default SuccessToast;
