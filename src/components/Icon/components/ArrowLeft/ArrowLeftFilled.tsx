import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgArrowLeftFilled = ({
  size = 24,
  fill = '#737373',
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
      d="M13.98 5.32L10.77 8.53L8.8 10.49C7.97 11.32 7.97 12.67 8.8 13.5L13.98 18.68C14.66 19.36 15.82 18.87 15.82 17.92V6.08C15.82 5.12 14.66 4.64 13.98 5.32Z"
      fill={fill}
    />
  </svg>
);

export default SvgArrowLeftFilled;
