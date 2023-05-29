import React from 'react';
import { Popover as HUIPopover } from '@headlessui/react';
import clsx from 'clsx';

type AppProps = {
  triggerNode: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const Popover: React.FC<AppProps> = ({
  triggerNode,
  children,
  className = 'right-0',
}) => {
  const styles = clsx(
    { 'absolute z-10 bg-white': true },
    { [className]: true },
  );

  return (
    <HUIPopover className="relative">
      <HUIPopover.Button
        style={{
          borderWidth: 0,
          borderColor: undefined,
          backgroundColor: undefined,
        }}
      >
        {triggerNode}
      </HUIPopover.Button>

      <HUIPopover.Panel className={styles}>{children}</HUIPopover.Panel>
    </HUIPopover>
  );
};

export default Popover;
