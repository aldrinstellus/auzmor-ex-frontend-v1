import React from 'react';
import EditReceiptOutline from './EditReceiptOutline';
import EditReceiptFilled from './EditReceiptFilled';
import useHover from 'hooks/useHover';

type EditReceiptProps = {
  size?: number;
  className?: string;
  hover?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const EditReceipt: React.FC<EditReceiptProps> = ({
  hover,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const [isHovered, eventHandlers] = useHover();

  return (
    <div onClick={onClick} className={className} {...eventHandlers}>
      {!disabled && (hover || isHovered) ? (
        <EditReceiptFilled {...props} />
      ) : (
        <EditReceiptOutline {...props} />
      )}
    </div>
  );
};

export default EditReceipt;
