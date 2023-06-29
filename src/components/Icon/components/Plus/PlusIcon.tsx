import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const PlusIcon = ({
  size = 16,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="16" height="16" rx="8" fill="#171717" />
    <path
      d="M8 4V8M8 8V12M8 8H12M8 8H4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PlusIcon;
