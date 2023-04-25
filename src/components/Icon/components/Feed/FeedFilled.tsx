import * as React from 'react';
import { SVGProps } from 'react';

interface IconProps {
  size?: number;
}

const SvgFeedFilled = ({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M3 5.5V18.5C3 19.6046 3.89543 20.5 5 20.5H17H17.5L17 20.5L17.0012 7H17V5.5C17 4.39543 16.1046 3.5 15 3.5H5C3.89543 3.5 3 4.39543 3 5.5ZM18.0012 7L18 20.5H19C20.1046 20.5 21 19.6046 21 18.5V9C21 7.89543 20.1046 7 19 7H18.0012Z"
      fill="#10B981"
    />
    <path d="M6.5 16H13.5" stroke="white" strokeLinecap="round" />
    <path
      d="M11.5 12H8.5C7.39543 12 6.5 11.1046 6.5 10C6.5 8.89543 7.39543 8 8.5 8H11.5C12.6046 8 13.5 8.89543 13.5 10C13.5 11.1046 12.6046 12 11.5 12Z"
      stroke="white"
      strokeLinecap="round"
    />
  </svg>
);

export default SvgFeedFilled;
