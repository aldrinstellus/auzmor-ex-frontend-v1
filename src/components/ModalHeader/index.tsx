import IconButton, { Variant as IconVariant } from 'components/IconButton';
import React, { FC, ReactNode } from 'react';

export interface IHeaderProps {
  className?: string;
  title: string | ReactNode;
  onClose?: () => void;
  onBackIconClick?: () => void;
  closeBtnDataTestId?: string;
  titleDataTestId?: string | React.ReactNode;
}

const Header: FC<IHeaderProps> = ({
  title,
  onClose,
  onBackIconClick,
  closeBtnDataTestId,
  titleDataTestId,
  className,
}) => {
  return (
    <div
      className={`flex flex-wrap p-4 space-x-3 border-b-1 border-neutral-100 items-center ${className}`}
    >
      {onBackIconClick && (
        <IconButton
          onClick={onBackIconClick}
          icon="arrowLeftOutline"
          color="text-neutral-900"
          className="!p-1 !bg-inherit hover:!bg-inherit"
          variant={IconVariant.Primary}
        />
      )}

      <div
        className="text-lg text-black font-extrabold flex-[50%]"
        data-testid={titleDataTestId}
      >
        {title}
      </div>
      {onClose && (
        <IconButton
          onClick={onClose}
          icon="close"
          color="text-neutral-900"
          className="!p-1 !bg-inherit hover:!bg-inherit"
          variant={IconVariant.Primary}
          dataTestId={closeBtnDataTestId}
        />
      )}
    </div>
  );
};

export default Header;
