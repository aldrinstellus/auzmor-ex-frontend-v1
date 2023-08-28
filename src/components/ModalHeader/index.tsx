import Icon from 'components/Icon';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import React from 'react';
import { twConfig } from 'utils/misc';

export interface IHeaderProps {
  title: string;
  onClose?: () => void;
  onBackIconClick?: () => void;
  closeBtnDataTestId?: string;
}

const Header: React.FC<IHeaderProps> = ({
  title,
  onClose,
  onBackIconClick,
  closeBtnDataTestId,
}) => {
  return (
    <div className="flex flex-wrap border-b-1 border-neutral-200 items-center">
      {onBackIconClick && (
        <Icon
          name="arrowLeftOutline"
          color="text-neutral-900"
          className="ml-4"
          size={16}
          onClick={onBackIconClick}
        />
      )}

      <div className="text-lg text-black p-4 font-extrabold flex-[50%]">
        {title}
      </div>
      <IconButton
        onClick={onClose}
        icon={'close'}
        className="!flex-[0] !text-right !p-1 !mx-4 !my-3 !bg-inherit !text-neutral-900"
        variant={IconVariant.Primary}
        dataTestId={closeBtnDataTestId}
      />
    </div>
  );
};

export default Header;
