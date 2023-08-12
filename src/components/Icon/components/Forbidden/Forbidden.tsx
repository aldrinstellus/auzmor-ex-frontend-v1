/* eslint-disable react/no-unknown-property */
import * as React from 'react';
import { SVGProps } from 'react';

type IconProps = {
  size?: number;
  stroke?: string;
};

const SvgForbidden = ({
  size = 24,
  stroke = '#737373',
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.83464 14.6673C12.5013 14.6673 15.5013 11.6673 15.5013 8.00065C15.5013 4.33398 12.5013 1.33398 8.83464 1.33398C5.16797 1.33398 2.16797 4.33398 2.16797 8.00065C2.16797 11.6673 5.16797 14.6673 8.83464 14.6673Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.83398 12.9993L7.88727 9.88596L13.834 3.66602"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgForbidden;
