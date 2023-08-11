import clsx from 'clsx';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import React, { ReactElement, ReactNode, useMemo } from 'react';

type CollapseProps = {
  label: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  headerTextClassName?: string;
};

const Collapse: React.FC<CollapseProps> = ({
  label,
  children,
  className,
  headerClassName = '',
  headerTextClassName = '',
}): ReactElement => {
  // If you think about it, modal has similar interactivity as collapse
  const [open, openCollpase, closeCollapse] = useModal();
  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const headerStyle = useMemo(
    () =>
      clsx({
        'flex items-center justify-between cursor-pointer': true,
        [headerClassName]: true,
      }),
    [],
  );

  const headerTextStyle = useMemo(
    () =>
      clsx({
        'text-neutral-500 font-bold text-sm': true,
        [headerTextClassName]: true,
      }),
    [],
  );

  return (
    <div className={className}>
      <div className={headerStyle} onClick={toggleModal}>
        <div className={headerTextStyle}>{label}</div>
        <div>
          <Icon name={open ? 'arrowUp' : 'arrowDown'} />
        </div>
      </div>
      <div
        className={`py-0 ${
          open ? 'h-full' : 'h-0'
        } overflow-hidden transition-all duration-300 ease-in-out`}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
