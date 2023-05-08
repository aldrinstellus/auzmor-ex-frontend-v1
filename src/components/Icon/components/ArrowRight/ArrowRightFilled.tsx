import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  fill?: string;
};

const SvgArrowRightFilled = ({
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
      d="M15.2 10.49L10.02 5.31C9.34 4.64 8.18 5.12 8.18 6.08V17.92C8.18 18.88 9.34 19.36 10.02 18.68L15.2 13.5C16.03 12.68 16.03 11.32 15.2 10.49Z"
      fill={fill}
    />
  </svg>
);

export default SvgArrowRightFilled;
