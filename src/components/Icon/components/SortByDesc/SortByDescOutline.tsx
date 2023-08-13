import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgSortByDescOutline = ({
  size = 24,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Group">
      <path
        id="Vector"
        d="M13.3333 2.66699V10.667H15.3333L12.6667 14.0003L10 10.667H12V2.66699H13.3333ZM8 12.0003V13.3337H2V12.0003H8ZM9.33333 7.33366V8.66699H2V7.33366H9.33333ZM9.33333 2.66699V4.00033H2V2.66699H9.33333Z"
        fill="#171717"
      />
    </g>
  </svg>
);

export default SvgSortByDescOutline;
