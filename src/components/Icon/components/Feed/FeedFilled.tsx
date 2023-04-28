import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgFeedFilled = ({
  size = 24,
  fill = PRIMARY_COLOR,
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
      fill={fill}
      d="M7 10a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 0 3h-3A1.5 1.5 0 0 1 7 10Z"
    />
    <path
      fill={fill}
      fillRule="evenodd"
      d="M3 5.5v13a2 2 0 0 0 2 2h12L17.001 7H17V5.5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Zm5.5 2a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5h-3Zm-2 8a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7Z"
      clipRule="evenodd"
    />
    <path
      fill={fill}
      d="M18.001 7 18 20.5h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-.999Z"
    />
  </svg>
);

export default SvgFeedFilled;
