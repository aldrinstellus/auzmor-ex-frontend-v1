import clsx from 'clsx';
import Icon from 'components/Icon';
import { FC, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { slideInAndOutBottom, slideInAndOutTop } from 'utils/react-toastify';

export interface ISuccessToastProps {
  content?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
  dataTestId?: string;
  actionClassName?: string;
  variant?: string;
}

const SuccessToast: FC<ISuccessToastProps> = ({
  content,
  actionLabel,
  action,
  dataTestId,
  actionClassName,
  variant = 'default',
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
        <span
          className={clsx(
            { 'text-sm min-w-[256px]': true },
            { 'text-white': variant === 'default' },
            { 'text-neutral-900': variant !== 'default' },
          )}
        >
          {content}
        </span>
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

interface ISuccessToastConfig {
  message?: string | ReactNode;
  dataTestId?: string;
  variant?: string;
  actionLabel?: string;
  action?: () => void;
}

export const successToastConfig = ({
  message = 'Your changes have been saved',
  dataTestId,
  variant = 'default',
  actionLabel,
  action,
}: ISuccessToastConfig) =>
  toast(
    <SuccessToast
      content={message}
      dataTestId={dataTestId}
      variant={variant}
      actionLabel={actionLabel}
      action={action}
    />,
    {
      closeButton: (
        <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
      ),
      style: {
        border: `1px solid ${twConfig.theme.colors.primary['300']}`,
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
      },
      autoClose: TOAST_AUTOCLOSE_TIME,
      position: variant === 'default' ? 'top-right' : 'bottom-center',
      transition:
        variant === 'default' ? slideInAndOutTop : slideInAndOutBottom,
      theme: variant === 'default' ? 'dark' : 'light',
    },
  );
