import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgTickCircleOutline = ({
  size = 24,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.75 12L10.58 14.83L16.25 9.16998"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgTickCircleOutline;
