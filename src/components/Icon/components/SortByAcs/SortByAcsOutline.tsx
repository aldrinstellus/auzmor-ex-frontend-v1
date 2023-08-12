import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgSortByAcsOutline = ({
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
        d="M12.6667 2L15.3333 5.33333H13.3333V13.3333H12V5.33333H10L12.6667 2ZM9.33333 12V13.3333H2V12H9.33333ZM9.33333 7.33333V8.66667H2V7.33333H9.33333ZM8 2.66667V4H2V2.66667H8Z"
        fill="#171717"
      />
    </g>
  </svg>
);

export default SvgSortByAcsOutline;
