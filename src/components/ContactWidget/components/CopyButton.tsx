import Icon from 'components/Icon';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { FC, ReactElement } from 'react';
import { toast } from 'react-toastify';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { slideInAndOutBottom } from 'utils/react-toastify';

type CopyButtonProps = {
  content: string;
  dataTestId?: string;
  className?: string;
};

const CopyButton: FC<CopyButtonProps> = ({
  content,
  dataTestId,
  className,
}): ReactElement => {
  return (
    <div className={className}>
      <Icon
        name="copy"
        size={16}
        dataTestId={dataTestId}
        onClick={() => {
          navigator.clipboard.writeText(content);
          toast(<SuccessToast content={'Copied to clipboard'} />, {
            closeButton: (
              <Icon
                name="closeCircleOutline"
                color="text-primary-500"
                size={20}
              />
            ),
            style: {
              border: `1px solid ${twConfig.theme.colors.primary['300']}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            },
            autoClose: TOAST_AUTOCLOSE_TIME,
            position: 'bottom-center',
            transition: slideInAndOutBottom,
            theme: 'dark',
          });
        }}
      />
    </div>
  );
};

export default CopyButton;
