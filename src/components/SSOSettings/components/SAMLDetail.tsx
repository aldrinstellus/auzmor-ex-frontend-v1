import Icon from 'components/Icon';
import React, { ReactElement } from 'react';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';

type SAMLDetailProps = {
  prop: string;
  value: string;
};

const SAMLDetail: React.FC<SAMLDetailProps> = ({
  prop,
  value,
}): ReactElement => {
  return (
    <div className="flex items-center space-x-4">
      <p className="font-normal text-xs text-neutral-500 w-[121px]">{prop}</p>
      <div className="flex items-center space-x-2">
        <p className="font-bold text-sm text-neutral-900">{value}</p>
        {value && (
          <Icon
            className=""
            name="copy"
            size={16}
            disabled
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast(
                <SuccessToast
                  content={`${prop} has been copied to your clipboard!`}
                />,
                {
                  closeButton: (
                    <Icon
                      name="closeCircleOutline"
                      color={twConfig.theme.colors.primary['500']}
                      size={20}
                    />
                  ),
                  style: {
                    border: `1px solid ${twConfig.theme.colors.primary['300']}`,
                    borderRadius: '6px',
                    display: 'fixed',
                    alignItems: 'center',
                  },
                  autoClose: TOAST_AUTOCLOSE_TIME,
                  transition: slideInAndOutTop,
                  theme: 'dark',
                },
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SAMLDetail;
