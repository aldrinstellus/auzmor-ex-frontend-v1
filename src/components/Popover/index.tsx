/* eslint-disable react/display-name */
import React, {
  Fragment,
  JSXElementConstructor,
  ReactElement,
  memo,
} from 'react';
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

const Popover = React.forwardRef(
  (
    { triggerNode, children, className = 'right-0', contentRenderer }: AppProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const styles = clsx(
      { 'absolute z-10 bg-white': true },
      { [className]: true },
    );

    return (
      <HUIPopover className="relative">
        <HUIPopover.Button className="outline-none" ref={ref}>
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
  },
);

export default memo(Popover);
