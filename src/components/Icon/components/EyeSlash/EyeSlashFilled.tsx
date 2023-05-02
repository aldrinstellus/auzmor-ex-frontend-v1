import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgEyeSlashFilled = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
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
      strokeWidth={1.5}
      d="M9.69 6.313 6.318 9.687A2.384 2.384 0 1 1 9.69 6.314Z"
    />
    <path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.88 3.847c-1.167-.88-2.5-1.36-3.88-1.36-2.353 0-4.547 1.386-6.073 3.786-.6.94-.6 2.52 0 3.46a9.553 9.553 0 0 0 1.806 2.114M5.617 13.02c.76.32 1.567.493 2.387.493 2.353 0 4.546-1.386 6.073-3.786.6-.94.6-2.52 0-3.46-.22-.347-.46-.674-.707-.98"
    />
    <path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.34 8.467a2.377 2.377 0 0 1-1.88 1.88M6.316 9.687l-4.98 4.98M14.668 1.333l-4.98 4.98"
    />
  </svg>
);

export default SvgEyeSlashFilled;
