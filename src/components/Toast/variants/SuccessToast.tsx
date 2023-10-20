import Icon from 'components/Icon';
import { FC, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { slideInAndOutTop } from 'utils/react-toastify';

export interface ISuccessToastProps {
  content?: string | ReactNode;
  action?: () => void;
  actionLabel?: string;
  dataTestId?: string;
  actionClassName?: string;
}

const SuccessToast: FC<ISuccessToastProps> = ({
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

export const successToastConfig = (
  message = 'Your changes have been saved',
  dataTestId?: string,
) =>
  toast(<SuccessToast content={message} dataTestId={dataTestId} />, {
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
    transition: slideInAndOutTop,
    theme: 'dark',
  });
