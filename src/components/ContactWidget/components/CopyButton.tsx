import Icon from 'components/Icon';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { FC, ReactElement } from 'react';

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
          successToastConfig({ content: 'Copied to clipboard' });
        }}
      />
    </div>
  );
};

export default CopyButton;
