import { MouseEventHandler, ReactNode } from 'react';
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
};

const Tooltip = ({
  tooltipContent,
  children,
  variant = Variant.Dark,
  className = '',
  onClick = () => {},
  tooltipPosition = 'top',
  showTooltip = true,
}: TooltipProps) => {
  const id = Math.random().toString(16).slice(2);
  return (
    <span onClick={onClick}>
      {showTooltip && (
        <ReactTooltip
          className={className}
          id={`tooltip-${id}`}
          react-tooltip-arrow
          anchorSelect={`#anchor-${id}`}
          clickable
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
      >
        {children}
      </span>
    </span>
  );
};

export default Tooltip;
