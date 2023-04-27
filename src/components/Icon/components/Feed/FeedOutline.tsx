import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgFeedOutline = ({
  size = 24,
  fill = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke={fill}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M17 7h2a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2h-2M17 7v13.5M17 7V5.5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12M6.5 16h7m-5-4h3a2 2 0 1 0 0-4h-3a2 2 0 1 0 0 4Z"
    />
  </svg>
);

export default SvgFeedOutline;
