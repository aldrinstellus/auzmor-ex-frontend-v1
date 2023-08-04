import clsx from 'clsx';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import React, { ReactElement, ReactNode, useMemo } from 'react';

type CollapseProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

const Collapse: React.FC<CollapseProps> = ({
  label,
  children,
  className = '',
}): ReactElement => {
  // If you think about it, modal has similar interactivity as collapse
  const [open, openCollpase, closeCollapse] = useModal();
  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const styles = useMemo(
    () =>
      clsx(
        {
          'flex flex-col': true,
        },
        {
          [className]: true,
        },
      ),
    [className],
  );

  return (
    <>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleModal}
      >
        <div className=" text-neutral-500 font-bold text-sm">{label}</div>
        <div>
          <Icon name={open ? 'arrowUp' : 'arrowDown'} />
        </div>
      </div>
      <div className={`py-0 ${open ? 'max-h-fit' : 'max-h-0'} overflow-hidden`}>
        {children}
      </div>
    </>
  );
};

export default Collapse;
