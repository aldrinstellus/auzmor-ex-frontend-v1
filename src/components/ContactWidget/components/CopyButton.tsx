import Icon from 'components/Icon';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import React, { ReactElement } from 'react';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';

type CopyButtonProps = {
  content: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ content }): ReactElement => {
  return (
    <div>
      <Icon
        name="copyIcon"
        size={16}
        onClick={() => {
          navigator.clipboard.writeText(content);
          toast(<SuccessToast content={'Copied to clipboard'} />, {
            closeButton: (
              <Icon
                name="closeCircleOutline"
                stroke={twConfig.theme.colors.primary['500']}
                size={20}
              />
            ),
            style: {
              border: `1px solid ${twConfig.theme.colors.primary['300']}`,
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
            },
            autoClose: 2000,
            position: 'bottom-center',
          });
        }}
      />
    </div>
  );
};

export default CopyButton;
