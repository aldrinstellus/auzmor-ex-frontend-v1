import clsx from 'clsx';
import useProduct from 'hooks/useProduct';
import {
  Fragment,
  MouseEventHandler,
  ReactNode,
  useMemo,
  useState,
} from 'react';
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
  const { isLxp } = useProduct();
  const [open, setOpen] = useState(false);

  const style = useMemo(
    () =>
      clsx({
        'border-1 border-neutral-200 shadow-md': isLxp,
        [className]: true,
      }),
    [className, isLxp],
  );

  const arrowStyle = useMemo(
    () =>
      clsx({
        'border-b-1 border-r-1 border-neutral-200': isLxp,
      }),
    [isLxp],
  );

  return (
    <Fragment>
      {showTooltip && (
        <ReactTooltip
          className={style}
          id={`tooltip-${id}`}
          react-tooltip-arrow
          classNameArrow={arrowStyle}
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
        data-tooltip-variant={isLxp ? Variant.Light : variant}
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
