import React, { MouseEventHandler, ReactNode, useMemo } from 'react';
import clsx from 'clsx';
import {
  ChildrenType,
  PlacesType,
  Tooltip as ReactTooltip,
} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export enum Variant {
  Dark = 'dark',
  Light = 'light',
}

export type TooltipProps = {
  tooltipContent: string | ReactNode;
  children: ReactNode;
  tooltipId?: string;
  variant?: Variant;
  className?: string;
  onClick?: MouseEventHandler<Element>;
  tooltipPosition?: PlacesType;
  render?: (render: {
    content: string | null;
    activeAnchor: HTMLElement | null;
  }) => ChildrenType;
};

const Tooltip = ({
  tooltipContent,
  children,
  tooltipId,
  variant = Variant.Dark,
  className = '',
  onClick = () => {},
  tooltipPosition = 'top',
  render,
}: TooltipProps) => {
  const tooltipPlacement = useMemo(
    () =>
      clsx({
        [className]: true,
      }),
    [className, variant],
  );
  const id = Math.random().toString(16).slice(2);
  return (
    <span className={` ${className}`} onClick={onClick}>
      <ReactTooltip
        className={`${tooltipPlacement} ${tooltipId}`}
        id={`tooltip-${id}`}
        react-tooltip-arrow
        anchorSelect=".my-anchor-element"
        clickable
        render={render}
      >
        <div>{tooltipContent}</div>
      </ReactTooltip>
      <a
        href="#"
        className="my-anchor-element cursor-default mt-10"
        data-tooltip-id={`tooltip-${id}`}
        data-tooltip-content={`${
          typeof tooltipContent === 'string' ? tooltipContent : ''
        }`}
        data-tooltip-variant={variant}
        data-tooltip-place={`${tooltipPosition}`}
      >
        <span className={`${className}`}>{children}</span>
      </a>
    </span>
  );
};

export default Tooltip;
