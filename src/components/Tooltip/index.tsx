import React, { MouseEventHandler, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export enum Variant {
  Dark = 'DARK',
  Light = 'LIGHT',
}

export type TooltipProps = {
  tooltipContent: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: MouseEventHandler<Element>;
  tooltipPosition?: PlacesType;
};

const Tooltip = ({
  tooltipContent,
  children,
  variant = Variant.Dark,
  className = '',
  onClick = () => {},
  tooltipPosition = 'top',
}: TooltipProps) => {
  const tooltipPlacement = useMemo(
    () =>
      clsx(
        {
          'bg-white text-black shadow-lg': variant === Variant.Light,
        },
        {
          'bg-black text-white shadow-lg': variant === Variant.Dark,
        },
        {
          [className]: true,
        },
      ),
    [className, variant],
  );
  return (
    <div className={`text-center ${className}`} onClick={onClick}>
      <ReactTooltip
        className={tooltipPlacement}
        id="my-tooltip"
        react-tooltip-arrow
        anchorSelect=".my-anchor-element"
        clickable
      >
        <div>{tooltipContent}</div>
      </ReactTooltip>
      <a
        href="#"
        className="my-anchor-element cursor-default mt-10"
        data-tooltip-id="my-tooltip"
        data-tooltip-content={`${tooltipContent}`}
        data-tooltip-place={`${tooltipPosition}`}
      >
        <div className={`${className}`}>{children}</div>
      </a>
    </div>
  );
};

export default Tooltip;
