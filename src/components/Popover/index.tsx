import React, { Fragment, JSXElementConstructor, ReactElement } from 'react';
import { Popover as HUIPopover, Transition } from '@headlessui/react';
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

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <HUIPopover.Panel className={styles}>
          {({ close }) =>
            contentRenderer ? contentRenderer(close) : children || <></>
          }
        </HUIPopover.Panel>
      </Transition>
    </HUIPopover>
  );
};

export default Popover;
