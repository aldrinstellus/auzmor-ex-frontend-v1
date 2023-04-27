import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgInfoCircle = ({
  size = 16,
  fill = '#F05252',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <path
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.003 14.665c3.666 0 6.666-3 6.666-6.666 0-3.667-3-6.667-6.666-6.667-3.667 0-6.667 3-6.667 6.667 0 3.666 3 6.666 6.667 6.666ZM8 5.332v3.333M8 10.668h.006"
      />
    </svg>
  );
};

export default SvgInfoCircle;
