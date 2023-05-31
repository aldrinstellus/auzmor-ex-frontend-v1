import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { Popover as HUIPopover } from '@headlessui/react';
import clsx from 'clsx';

type AppProps = {
  triggerNode: React.ReactNode;
  children?: ReactElement<any, string | JSXElementConstructor<any>>;
  className?: string;
  contentRenderer?: (
    close: any,
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
};

const Popover: React.FC<AppProps> = ({
  triggerNode,
  children,
  className = 'right-0',
  contentRenderer,
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

      <HUIPopover.Panel className={styles}>
        {({ close }) =>
          contentRenderer ? contentRenderer(close) : children || <></>
        }
      </HUIPopover.Panel>
    </HUIPopover>
  );
};

export default Popover;
