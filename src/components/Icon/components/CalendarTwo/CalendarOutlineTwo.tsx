import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgCalendarOutlineTwo = ({
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
      d="M8 2V5M16 2V5M3.5 9.09H20.5M11.9955 13.7H12.0045M8.29431 13.7H8.30329M8.29431 16.7H8.30329M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgCalendarOutlineTwo;
