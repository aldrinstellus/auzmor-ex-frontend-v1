import { Fragment, MouseEventHandler, ReactNode, useState } from 'react';
import { PlacesType, Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export enum Variant {
  Dark = 'dark',
  Light = 'light',
}

export type TooltipProps = {
  tooltipContent?: string | ReactNode;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: MouseEventHandler<Element>;
  tooltipPosition?: PlacesType;
  showTooltip?: boolean;
  textClassName?: string;
};

const Tooltip = ({
  tooltipContent,
  children,
  variant = Variant.Dark,
  className = '',
  onClick = () => {},
  tooltipPosition = 'top',
  showTooltip = true,
  textClassName = '',
}: TooltipProps) => {
  const id = Math.random().toString(16).slice(2);
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      {showTooltip && (
        <ReactTooltip
          className={className}
          id={`tooltip-${id}`}
          react-tooltip-arrow
          anchorSelect={`#anchor-${id}`}
          clickable
          isOpen={open}
        >
          {tooltipContent}
        </ReactTooltip>
      )}
      <span
        id={`anchor-${id}`}
        data-tooltip-id={`tooltip-${id}`}
        data-tooltip-content={`${
          typeof tooltipContent === 'string' ? tooltipContent : ''
        }`}
        data-tooltip-variant={variant}
        data-tooltip-place={`${tooltipPosition}`}
        className={`${textClassName} inline`}
        onClick={onClick}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {children}
      </span>
    </Fragment>
  );
};

export default Tooltip;
