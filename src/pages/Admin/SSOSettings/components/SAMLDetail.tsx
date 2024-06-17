import Icon from 'components/Icon';
import { FC, ReactElement } from 'react';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

type SAMLDetailProps = {
  prop: string;
  value: string;
};

const SAMLDetail: FC<SAMLDetailProps> = ({ prop, value }): ReactElement => {
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
            onClick={() => {
              navigator.clipboard.writeText(value);
              successToastConfig({
                content: `${prop} has been copied to your clipboard!`,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SAMLDetail;
