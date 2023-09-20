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
};

const Tooltip = ({
  tooltipContent,
  children,
  variant = Variant.Dark,
  className = '',
  onClick = () => {},
  tooltipPosition = 'top',
}: TooltipProps) => {
  const id = Math.random().toString(16).slice(2);
  return (
    <span onClick={onClick}>
      <ReactTooltip
        className={className}
        id={`tooltip-${id}`}
        react-tooltip-arrow
        anchorSelect={`#anchor-${id}`}
        clickable
      >
        {tooltipContent}
      </ReactTooltip>
      <a
        id={`anchor-${id}`}
        href="#"
        className="cursor-default mt-10"
        data-tooltip-id={`tooltip-${id}`}
        data-tooltip-content={`${
          typeof tooltipContent === 'string' ? tooltipContent : ''
        }`}
        data-tooltip-variant={variant}
        data-tooltip-place={`${tooltipPosition}`}
      >
        <span>{children}</span>
      </a>
    </span>
  );
};

export default Tooltip;
