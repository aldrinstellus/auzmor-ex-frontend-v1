import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

interface IconProps {
  size?: number;
  fill?: string;
}

const SvgPeopleFilled = ({
  size = 24,
  fill = PRIMARY_COLOR,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path fill={fill} d="M10.1 9.6a1.9 1.9 0 1 1 3.8 0 1.9 1.9 0 0 1-3.8 0Z" />
    <path
      fill={fill}
      fillRule="evenodd"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-7.1-2.4c0 .9-.408 1.702-1.05 2.234a5.3 5.3 0 0 1 3.45 4.967.5.5 0 0 1-1 0 4.3 4.3 0 0 0-8.6 0 .5.5 0 0 1-1 0 5.3 5.3 0 0 1 3.45-4.967 2.9 2.9 0 1 1 4.75-2.233Z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgPeopleFilled;
