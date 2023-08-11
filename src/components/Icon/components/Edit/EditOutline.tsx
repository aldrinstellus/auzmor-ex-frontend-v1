import * as React from 'react';
import { SVGProps } from 'react';
import { PRIMARY_COLOR } from 'utils/constants';

type IconProps = {
  size?: number;
  stroke?: string;
  hoverStroke?: string;
};

const SvgEditOutline = ({
  size = 24,
  stroke = '#737373',
  hoverStroke = PRIMARY_COLOR,
  ...props
}: SVGProps<SVGSVGElement> & IconProps) => (
  <>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden group-hover:block cursor-pointer"
    >
      <path
        d="M11.89 5.05C12.32 7.81 14.56 9.92 17.34 10.2M3 22H21M13.26 3.6L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.74C20.12 7.24 20.76 5.53 18.55 3.44C16.35 1.37 14.68 2.1 13.26 3.6Z"
        stroke={hoverStroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover:hidden"
    >
      <path
        d="M11.89 5.05C12.32 7.81 14.56 9.92 17.34 10.2M3 22H21M13.26 3.6L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.74C20.12 7.24 20.76 5.53 18.55 3.44C16.35 1.37 14.68 2.1 13.26 3.6Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </>
);

export default SvgEditOutline;
