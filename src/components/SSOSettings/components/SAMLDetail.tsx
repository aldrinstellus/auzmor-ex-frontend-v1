import Icon from 'components/Icon';
import React, { ReactElement } from 'react';
import { toast } from 'react-toastify';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';

type SAMLDetailProps = {
  prop: string;
  value: string;
};

const SAMLDetail: React.FC<SAMLDetailProps> = ({
  prop,
  value,
}): ReactElement => {
  return (
    <div className="flex items-center justify-between p-6">
      <p className="font-normal text-neutral-500">{prop}</p>
      <div className="flex items-center">
        <p className="font-bold text-neutral-900">{value}</p>
        <Icon
          className="ml-2 mb-1"
          name="copy"
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
                    stroke={twConfig.theme.colors.primary['500']}
                    size={20}
                  />
                ),
                style: {
                  border: `1px solid ${twConfig.theme.colors.primary['300']}`,
                  borderRadius: '6px',
                  display: 'fixed',
                  alignItems: 'center',
                },
                autoClose: 2000,
              },
            );
          }}
        />
      </div>
    </div>
  );
};

export default SAMLDetail;
