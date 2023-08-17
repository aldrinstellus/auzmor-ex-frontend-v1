import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgArrowRightUpFilled = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3367 8.345L6.16417 15.5175L4.98584 14.3392L12.1575 7.16667H5.83667V5.5H15.0033V14.6667H13.3367V8.345Z"
      fill={fill}
    />
  </svg>
);

export default SvgArrowRightUpFilled;
