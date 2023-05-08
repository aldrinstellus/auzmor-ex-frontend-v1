import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgMailOutline = ({
  size = 24,
  fill = '#292D32',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.1641 17.0846H5.83073C3.33073 17.0846 1.66406 15.8346 1.66406 12.918V7.08464C1.66406 4.16797 3.33073 2.91797 5.83073 2.91797H14.1641C16.6641 2.91797 18.3307 4.16797 18.3307 7.08464V12.918C18.3307 15.8346 16.6641 17.0846 14.1641 17.0846Z"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.1693 7.5L11.5609 9.58333C10.7026 10.2667 9.29427 10.2667 8.43593 9.58333L5.83594 7.5"
      stroke={fill}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgMailOutline;
