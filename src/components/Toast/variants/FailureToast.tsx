import Button, { Variant as ButtonVariant } from 'components/Button';
import Icon from 'components/Icon';
import { FC, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';
export interface IFailureToastProps {
  content?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
  dataTestId?: string;
}

const FailureToast: FC<IFailureToastProps> = ({
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
            color="text-red-500"
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

interface IFailureToastConfig {
  content?: string | ReactNode;
  dataTestId?: string;
}

export const failureToastConfig = ({
  content = 'Opps... Something went wrong...!',
  dataTestId,
}: IFailureToastConfig) =>
  toast(<FailureToast content={content} dataTestId={dataTestId} />, {
    closeButton: (
      <Icon name="closeCircleOutline" color="text-red-500" size={20} />
    ),
    style: {
      border: `1px solid ${twConfig.theme.colors.red['300']}`,
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
    },
    autoClose: TOAST_AUTOCLOSE_TIME,
    transition: slideInAndOutTop,
    theme: 'dark',
  });
